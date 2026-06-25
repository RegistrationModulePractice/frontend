function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function selectClasses() {
  return 'w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700 hover:border-sky-300 focus:border-sky-400';
}

export function FilterPanel({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onReset,
  industryOptions,
  serviceOptions,
  regionOptions,
  cityOptions,
  resultsCount,
  totalCount,
  activeFilters,
}) {
  return (
    <div className="rounded-[30px] border border-white/75 bg-white/90 p-5 shadow-panel backdrop-blur sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Каталог компаний</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-brand-ink sm:text-3xl">
            Подберите участника для встречи
          </h2>
        </div>
        <p className="text-sm font-semibold text-slate-500">
          Найдено <span className="text-brand-blue">{resultsCount}</span> из {totalCount}
        </p>
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-[minmax(0,2.2fr)_repeat(4,minmax(0,1fr))]">
        <label className="relative block xl:col-span-1">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Поиск</span>
          <span className="pointer-events-none absolute left-4 top-[3.25rem] -translate-y-1/2">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="По названию, ИНН или ключевым словам"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-12 text-sm font-medium text-slate-700 shadow-sm hover:border-sky-300 focus:border-sky-400"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Отрасль</span>
          <select
            value={filters.industry}
            onChange={(event) => onFilterChange('industry', event.target.value)}
            className={selectClasses()}
          >
            <option value="">Все отрасли</option>
            {industryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Тип услуг</span>
          <select
            value={filters.serviceType}
            onChange={(event) => onFilterChange('serviceType', event.target.value)}
            className={selectClasses()}
          >
            <option value="">Все типы</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Регион</span>
          <select
            value={filters.region}
            onChange={(event) => onFilterChange('region', event.target.value)}
            className={selectClasses()}
          >
            <option value="">Все регионы</option>
            {regionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Город</span>
          <select
            value={filters.city}
            onChange={(event) => onFilterChange('city', event.target.value)}
            className={selectClasses()}
          >
            <option value="">Все города</option>
            {cityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {activeFilters.length > 0 ? (
            activeFilters.map((filter) => (
              <span
                key={filter}
                className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700"
              >
                {filter}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
              Фильтры не выбраны
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-sky-300 hover:text-brand-blue"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
}
