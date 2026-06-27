function getPageRange(startPage, endPage) {
  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
}

function getPaginationItems(page, totalPages) {
  if (totalPages <= 7) {
    return getPageRange(1, totalPages);
  }

  const items = [1];
  const isNearStart = page <= 4;
  const isNearEnd = page >= totalPages - 3;

  let middlePages;

  if (isNearStart) {
    middlePages = getPageRange(2, 5);
  } else if (isNearEnd) {
    middlePages = getPageRange(totalPages - 4, totalPages - 1);
  } else {
    middlePages = getPageRange(page - 1, page + 1);
  }

  if (middlePages[0] > 2) {
    items.push('left-ellipsis');
  }

  items.push(...middlePages);

  if (middlePages[middlePages.length - 1] < totalPages - 1) {
    items.push('right-ellipsis');
  }

  items.push(totalPages);

  return items;
}

function pageButtonClasses(isActive) {
  return `flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-bold transition ${
    isActive
      ? 'bg-brand-primary text-white shadow-lg shadow-rose-200'
      : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-primary hover:text-brand-primary'
  }`;
}

export function Pagination({ page, totalPages, hasPreviousPage, hasNextPage, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPaginationItems(page, totalPages);

  return (
    <nav className="mt-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-500">
        Страница <span className="text-brand-ink">{page}</span> из <span className="text-brand-ink">{totalPages}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-45"
        >
          Назад
        </button>

        {items.map((item) => {
          if (typeof item !== 'number') {
            return (
              <span key={item} className="px-1 text-slate-400">
                ...
              </span>
            );
          }

          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={pageButtonClasses(item === page)}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-45"
        >
          Вперед
        </button>
      </div>
    </nav>
  );
}
