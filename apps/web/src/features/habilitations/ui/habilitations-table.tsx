'use client';

import { cn } from '@/lib/utils';
import {
  DEFAULT_HABILITATIONS,
  HABILITATION_TABLE,
  HabilitationCodes,
  HabilitationKey,
} from '@/entities/habilitation';

interface HabilitationsTableProps {
  habilitations: HabilitationCodes | null;
}

function CodeBadge({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <span
      className={cn(
        'inline-block rounded px-1.5 py-0.5 text-xs font-bold',
        enabled
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-400 line-through'
      )}
    >
      {label}
    </span>
  );
}

function Legend() {
  return (
    <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
      <div className="flex items-center gap-1.5">
        <span className="inline-block rounded bg-green-100 px-1.5 py-0.5 text-xs font-bold text-green-700">
          Ex
        </span>
        <span>Activée</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs font-bold text-gray-400 line-through">
          Ex
        </span>
        <span>Non activée</span>
      </div>
    </div>
  );
}

export function HabilitationsTable({ habilitations }: HabilitationsTableProps) {
  const data = habilitations ?? DEFAULT_HABILITATIONS;

  return (
    <div>
      <Legend />
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="w-28 border-r p-3" rowSpan={2} />
              <th
                className="border-r p-3 text-center font-semibold text-gray-600"
                colSpan={2}
              >
                Opération d'ordre non électrique
              </th>
              <th
                className="p-3 text-center font-semibold text-gray-600"
                colSpan={5}
              >
                Opération d'ordre électrique
              </th>
            </tr>
            <tr className="border-b bg-gray-50">
              {HABILITATION_TABLE.columns.slice(1).map((col) => (
                <th
                  key={col.key}
                  className="border-r p-3 text-center text-xs font-medium text-gray-500 last:border-r-0"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HABILITATION_TABLE.rows.map((row, rowIdx) => (
              <tr
                key={row.tension}
                className={cn(
                  'border-b last:border-b-0',
                  rowIdx === 0 ? 'bg-white' : 'bg-gray-50/50'
                )}
              >
                <td className="border-r p-3 text-center text-xs font-semibold text-gray-700">
                  {row.tension}
                </td>
                {row.cells.map((cell, cellIdx) =>
                  cell === null ? (
                    <td
                      key={cellIdx}
                      className="border-r p-3 text-center text-gray-300 last:border-r-0"
                    >
                      —
                    </td>
                  ) : (
                    <td key={cellIdx} className="border-r p-3 last:border-r-0">
                      <div className="flex flex-wrap justify-center gap-1">
                        {cell.codes.map((code, i) => (
                          <CodeBadge
                            key={code}
                            label={cell.labels[i] ?? ''}
                            enabled={data[code as HabilitationKey]}
                          />
                        ))}
                      </div>
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
