import React from 'react';

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  showFooter?: boolean;
  footerContent?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Table<T extends Record<string, any>>({
  data, 
  columns, 
  title,
  showFooter = false,
  footerContent,
  emptyMessage = 'No hay datos disponibles',
  className = ''
}: TableProps<T>) {
  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
          {title}
        </h3>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  {columns.map((column, colIndex) => {
                    const value = typeof column.accessor === 'function'
                      ? column.accessor(row)
                      : row[column.accessor];
                    return (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || 'text-gray-500'}`}
                      >
                        {value as React.ReactNode}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
          {showFooter && (
            <tfoot className="bg-gray-50">
              <tr>
                {footerContent}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}