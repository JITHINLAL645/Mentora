import React from "react";

interface TableColumn<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CommonTable = <T,>({
  columns,
  data,
  currentPage,
  totalPages,
  onPageChange,
}: TableProps<T>) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-teal-700 text-white">
            {columns.map((col, index) => (
              <th key={index} className="px-4 py-3 text-left font-medium">
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
                className="text-center py-5 text-gray-500"
              >
                No records found.
              </td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                {columns.map((col, j) => (
                  <td key={j} className="px-4 py-3">
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-5">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => goToPage(num)}
              className={`px-3 py-1 text-sm border border-gray-300 ${
                currentPage === num
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } rounded-md`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommonTable;
