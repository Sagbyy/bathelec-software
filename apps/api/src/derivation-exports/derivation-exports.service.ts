import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workbook } from 'exceljs';
import { PrismaService } from '../prisma/prisma.service';
import {
  CompletedDerivation,
  CompletedDerivationDocument,
} from '../completed-derivation/entities/completed-derivations.entity';
import {
  ENEDIS_COLUMNS,
  EnedisExportSource,
  TECHNICIAN_SIGNATURE_HEADER,
  buildEnedisRow,
} from './lib/enedis-export.columns';

const SIGNATURE_COLUMN_INDEX = ENEDIS_COLUMNS.findIndex(
  (column) => column.header === TECHNICIAN_SIGNATURE_HEADER
);
const SIGNATURE_ROW_HEIGHT = 48;
const PNG_DATA_URL = /^data:image\/png;base64,/;

export type EnedisExportFile = { fileName: string; buffer: Buffer };

@Injectable()
export class DerivationExportsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectModel(CompletedDerivation.name)
    private readonly completedDerivationModel: Model<CompletedDerivationDocument>
  ) {}

  async exportDerivation(derivationId: number): Promise<EnedisExportFile> {
    const sources = await this.loadSources({ id: derivationId });
    if (sources.length === 0) {
      throw new NotFoundException(
        'No completed report found for this derivation'
      );
    }
    return {
      fileName: `export-enedis-derivation-${derivationId}.xlsx`,
      buffer: await this.buildWorkbook(sources),
    };
  }

  async exportChantier(chantierId: number): Promise<EnedisExportFile> {
    const sources = await this.loadSources({ chantierId });
    if (sources.length === 0) {
      throw new NotFoundException(
        'No completed report found for this chantier'
      );
    }
    return {
      fileName: `export-enedis-chantier-${chantierId}.xlsx`,
      buffer: await this.buildWorkbook(sources),
    };
  }

  private async loadSources(where: {
    id?: number;
    chantierId?: number;
  }): Promise<EnedisExportSource[]> {
    const derivations = await this.prisma.derivation.findMany({
      where,
      include: { chantier: { include: { market: true } } },
      orderBy: { id: 'asc' },
    });
    const reports = await this.completedDerivationModel
      .find({
        requestedDerivationId: { $in: derivations.map(({ id }) => id) },
      })
      .lean();
    const reportByDerivation = new Map(
      reports.map((report) => [report.requestedDerivationId, report])
    );

    return derivations.flatMap((derivation) => {
      const report = reportByDerivation.get(derivation.id);
      return report
        ? [
            {
              derivationId: derivation.id,
              chantier: derivation.chantier,
              report,
            },
          ]
        : [];
    });
  }

  private async buildWorkbook(sources: EnedisExportSource[]) {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet('Export Enedis');
    sheet.columns = ENEDIS_COLUMNS.map(({ header, width }) => ({
      header,
      width,
    }));
    sheet.getRow(1).font = { bold: true };

    sources.forEach((source, index) => {
      const row = sheet.addRow(buildEnedisRow(source));
      const signature = source.report.clientValidation.technicianSignature;
      if (signature && PNG_DATA_URL.test(signature)) {
        row.height = SIGNATURE_ROW_HEIGHT;
        const imageId = workbook.addImage({
          base64: signature,
          extension: 'png',
        });
        sheet.addImage(imageId, {
          tl: { col: SIGNATURE_COLUMN_INDEX, row: index + 1 },
          ext: { width: 150, height: SIGNATURE_ROW_HEIGHT },
        });
      }
    });

    return Buffer.from(await workbook.xlsx.writeBuffer());
  }
}
