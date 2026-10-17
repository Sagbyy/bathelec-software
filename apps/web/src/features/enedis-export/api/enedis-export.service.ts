import { apiClient } from '@/shared/api';

export type EnedisExportScope = 'derivations' | 'chantiers';

const FILE_NAME_PATTERN = /filename="([^"]+)"/;

export const enedisExportService = {
  download: async (scope: EnedisExportScope, id: number) => {
    const response = await apiClient.get<Blob>(
      `/derivation-exports/${scope}/${id}`,
      { responseType: 'blob' }
    );
    const disposition = String(response.headers['content-disposition'] ?? '');
    return {
      blob: response.data,
      fileName:
        FILE_NAME_PATTERN.exec(disposition)?.[1] ??
        `export-enedis-${scope}-${id}.xlsx`,
    };
  },
};
