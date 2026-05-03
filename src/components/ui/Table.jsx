export const Table = ({ headers, children }) => (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-left border-collapse bg-white">
        <thead className="bg-gray-50/80 border-b border-gray-100">
          <tr>
            {headers.map((head, index) => (
              <th key={index} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {children}
        </tbody>
      </table>
    </div>
  );