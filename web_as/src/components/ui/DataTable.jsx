export default function DataTable({ columns, rows }) {
  const hasRows = rows.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!hasRows ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>
                  No data found
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="border-t border-slate-100 text-slate-700">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3">
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        {!hasRows ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">No data found</p>
        ) : (
          <div className="space-y-3 p-3">
            {rows.map((row, index) => (
              <article key={index} className="rounded-xl border border-slate-200 p-3">
                <dl className="space-y-2">
                  {columns.map((column) => (
                    <div key={column.key} className="grid grid-cols-[96px_minmax(0,1fr)] gap-2">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{column.label}</dt>
                      <dd className="min-w-0 wrap-break-word text-sm text-slate-700">{row[column.key]}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
