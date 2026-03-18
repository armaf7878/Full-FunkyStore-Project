function Table({ columns, data, onRowClick, emptyMessage = "No data available" }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-n-200">
                        {columns.map((col, idx) => (
                            <th 
                                key={idx}
                                className="px-4 py-3 text-left text-sm font-semibold text-n-100 font-Genos"
                                style={{ width: col.width }}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td 
                                colSpan={columns.length} 
                                className="px-4 py-8 text-center text-n-50 font-Genos"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIdx) => (
                            <tr 
                                key={rowIdx}
                                className={`border-b border-n-200/30 hover:bg-n-200/20 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                                onClick={() => onRowClick && onRowClick(row)}
                            >
                                {columns.map((col, colIdx) => (
                                    <td 
                                        key={colIdx}
                                        className="px-4 py-3 text-sm text-n-100 font-Genos"
                                    >
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
