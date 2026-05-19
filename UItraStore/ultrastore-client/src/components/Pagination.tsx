interface Props {
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, totalCount, hasNextPage, onPageChange }: Props) {
  const totalPages = Math.ceil(totalCount / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Previous
      </button>
      <span className="pagination-info">
        Page {page} of {totalPages} &nbsp;·&nbsp; {totalCount} products
      </span>
      <button onClick={() => onPageChange(page + 1)} disabled={!hasNextPage}>
        Next
      </button>
    </div>
  );
}
