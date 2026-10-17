import { describe, it, expect, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { enedisExportService } from './enedis-export.service';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

describe('enedisExportService', () => {
  afterEach(() => server.resetHandlers());

  it('télécharge l’export et lit le nom de fichier fourni par l’API', async () => {
    server.use(
      http.get(
        `${BASE}/derivation-exports/derivations/7`,
        () =>
          new HttpResponse('xlsx', {
            headers: {
              'Content-Type':
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Content-Disposition':
                'attachment; filename="export-enedis-derivation-7.xlsx"',
            },
          })
      )
    );

    const { blob, fileName } = await enedisExportService.download(
      'derivations',
      7
    );

    expect(fileName).toBe('export-enedis-derivation-7.xlsx');
    expect(blob).toBeDefined();
  });

  it('propose un nom par défaut sans en-tête de nom de fichier', async () => {
    server.use(
      http.get(
        `${BASE}/derivation-exports/chantiers/5`,
        () => new HttpResponse('xlsx')
      )
    );

    const { fileName } = await enedisExportService.download('chantiers', 5);

    expect(fileName).toBe('export-enedis-chantiers-5.xlsx');
  });
});
