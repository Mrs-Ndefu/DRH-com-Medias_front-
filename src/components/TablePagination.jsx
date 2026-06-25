import PropTypes from 'prop-types';
import Pagination from 'react-bootstrap/Pagination';

// ==============================|| PAGINATION GÉNÉRIQUE ||============================== //

export default function TablePagination({ page, setPage, total, limit }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  // Show max 5 page numbers centered around current page
  const delta = 2;
  let start = Math.max(1, page - delta);
  let end   = Math.min(totalPages, page + delta);
  if (end - start < delta * 2) {
    if (start === 1) end   = Math.min(totalPages, start + delta * 2);
    else             start = Math.max(1, end   - delta * 2);
  }
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
      <small className="text-muted">
        {from}–{to} sur <strong>{total}</strong>
      </small>
      <Pagination size="sm" className="mb-0">
        <Pagination.First onClick={() => setPage(1)}              disabled={page === 1} />
        <Pagination.Prev  onClick={() => setPage((p) => p - 1)}  disabled={page === 1} />
        {start > 1 && <Pagination.Ellipsis disabled />}
        {pages.map((n) => (
          <Pagination.Item key={n} active={n === page} onClick={() => setPage(n)}>
            {n}
          </Pagination.Item>
        ))}
        {end < totalPages && <Pagination.Ellipsis disabled />}
        <Pagination.Next onClick={() => setPage((p) => p + 1)}   disabled={page === totalPages} />
        <Pagination.Last onClick={() => setPage(totalPages)}      disabled={page === totalPages} />
      </Pagination>
    </div>
  );
}

TablePagination.propTypes = {
  page:    PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  total:   PropTypes.number.isRequired,
  limit:   PropTypes.number.isRequired,
};
