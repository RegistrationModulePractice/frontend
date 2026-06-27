import { useDeferredValue, useEffect, useState } from 'react';
import { fetchCatalog, getDefaultCatalogMeta, getDefaultFilterOptions } from './api';
import { CompanyCard } from './components/CompanyCard';
import { FilterPanel } from './components/FilterPanel';
import { Header } from './components/Header';
import { Pagination } from './components/Pagination';
import { RequestModal } from './components/RequestModal';

const defaultFilters = {
  industry: '',
  serviceType: '',
  region: '',
  city: '',
};

const defaultCatalogMeta = getDefaultCatalogMeta();
const defaultFilterOptions = getDefaultFilterOptions();
const catalogPageSize = 12;

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [filters, setFilters] = useState(defaultFilters);
  const [currentPage, setCurrentPage] = useState(defaultCatalogMeta.page);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [conferenceDates, setConferenceDates] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [filterOptions, setFilterOptions] = useState(defaultFilterOptions);
  const [catalogMeta, setCatalogMeta] = useState(defaultCatalogMeta);
  const [catalogStatus, setCatalogStatus] = useState('loading');
  const [catalogError, setCatalogError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadCatalog = async () => {
      setCatalogStatus('loading');
      setCatalogError('');

      try {
        const catalog = await fetchCatalog({
          signal: controller.signal,
          page: currentPage,
          pageSize: catalogPageSize,
          search: deferredSearchTerm,
          industry: filters.industry,
          serviceType: filters.serviceType,
          region: filters.region,
          city: filters.city,
        });

        setCompanies(catalog.companies);
        setConferenceDates(catalog.conferenceDates);
        setTimeOptions(catalog.timeOptions);
        setFilterOptions(catalog.filterOptions);
        setCatalogMeta(catalog.meta);
        setCatalogStatus('success');

        if (catalog.meta.page !== currentPage) {
          setCurrentPage(catalog.meta.page);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        setCatalogStatus('error');
        setCatalogError(error instanceof Error ? error.message : 'Не удалось загрузить каталог компаний.');
      }
    };

    loadCatalog();

    return () => {
      controller.abort();
    };
  }, [currentPage, deferredSearchTerm, filters.city, filters.industry, filters.region, filters.serviceType]);

  const industryOptions = filterOptions.industries;
  const serviceOptions = filterOptions.serviceTypes;
  const regionOptions = filterOptions.regions;
  const cityOptions = filterOptions.cities;

  const activeFilters = [
    searchTerm ? `Поиск: ${searchTerm}` : null,
    filters.industry ? `Отрасль: ${filters.industry}` : null,
    filters.serviceType ? `Тип: ${filters.serviceType}` : null,
    filters.region ? `Регион: ${filters.region}` : null,
    filters.city ? `Город: ${filters.city}` : null,
  ].filter(Boolean);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page === currentPage || page > Math.max(catalogMeta.totalPages, 1)) {
      return;
    }

    setCurrentPage(page);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-gradient-to-r from-[#67bae8] via-[#0b97d5] to-[#0d6ba2]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <Header />
        </div>
      </div>

      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-visible py-4 sm:py-6">
          <div className="relative overflow-visible py-8 sm:py-10 lg:py-12">
            <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
              <div>
                <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
                  Участники
                  <br />
                  конференции
                </h1>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#catalog"
                    className="rounded-full bg-brand-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-200 hover:-translate-y-0.5 hover:bg-brand-primary-dark"
                  >
                    Смотреть каталог
                  </a>
                  <span className="rounded-full border border-slate-200 bg-slate-50/90 px-5 py-3 text-sm font-semibold text-slate-600 backdrop-blur">
                    Поиск по названию, ИНН и ключевым словам
                  </span>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-card backdrop-blur sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Конфигурация API</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="rounded-3xl bg-slate-900 px-5 py-4 text-white">
                    <div className="text-3xl font-extrabold">{catalogMeta.totalCompanies}</div>
                    <div className="mt-2 text-sm text-white/70">компаний в каталоге</div>
                  </div>
                  <div className="rounded-3xl bg-sky-50 px-5 py-4 text-brand-ink">
                    <div className="text-3xl font-extrabold">{industryOptions.length}</div>
                    <div className="mt-2 text-sm text-slate-500">отраслей и направлений</div>
                  </div>
                  <div className="rounded-3xl bg-white px-5 py-4 text-brand-ink">
                    <div className="text-3xl font-extrabold">{conferenceDates.length}</div>
                    <div className="mt-2 text-sm text-slate-500">дня для записи на встречу</div>
                  </div>
                </div>

                <div className="mt-5 rounded-[28px] border border-slate-200 bg-slate-50/70 p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Окна конференции</p>
                  <div className="mt-4 space-y-3">
                    {conferenceDates.map((date) => (
                      <div key={date.value} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                        <span className="font-semibold text-slate-700">{date.label}</span>
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                          10:00-17:00
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {catalogStatus === 'error' ? (
              <div className="relative mt-6 rounded-[28px] border border-rose-200 bg-rose-50/90 p-5 text-rose-700 shadow-card">
                <p className="text-sm font-bold uppercase tracking-[0.22em]">Ошибка загрузки каталога</p>
                <p className="mt-3 text-sm leading-6">{catalogError}</p>
                <button
                  type="button"
                  onClick={reloadPage}
                  className="mt-4 rounded-full bg-brand-primary px-4 py-2 text-sm font-bold text-white hover:bg-brand-primary-dark"
                >
                  Обновить страницу
                </button>
              </div>
            ) : null}

            <div className="relative mt-8">
              <FilterPanel
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={clearFilters}
                industryOptions={industryOptions}
                serviceOptions={serviceOptions}
                regionOptions={regionOptions}
                cityOptions={cityOptions}
                resultsCount={catalogMeta.totalItems}
                totalCount={catalogMeta.totalCompanies}
                activeFilters={activeFilters}
              />
            </div>
          </div>
        </section>

        <section id="catalog" className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="mt-3 font-display text-3xl font-bold text-brand-ink sm:text-4xl">
                Компании для деловых встреч
              </h2>
            </div>
          </div>

          {catalogStatus === 'loading' ? (
            <div className="mt-8 rounded-[30px] border border-slate-200 bg-white/80 p-8 text-center shadow-card">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Загружаем данные</p>
              <h3 className="mt-3 font-display text-2xl font-bold text-brand-ink">Подтягиваем каталог компаний с backend</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Поиск, фильтры и пагинация теперь обрабатываются на сервере, а здесь показывается только нужная страница каталога.
              </p>
            </div>
          ) : companies.length > 0 ? (
            <>
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {companies.map((company, index) => (
                  <CompanyCard key={company.id} company={company} index={index} onRequest={setSelectedCompany} />
                ))}
              </div>

              <Pagination
                page={catalogMeta.page}
                totalPages={catalogMeta.totalPages}
                hasPreviousPage={catalogMeta.hasPreviousPage}
                hasNextPage={catalogMeta.hasNextPage}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="mt-8 rounded-[30px] border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-card">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Ничего не найдено</p>
              <h3 className="mt-3 font-display text-2xl font-bold text-brand-ink">Попробуйте изменить параметры поиска</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Можно убрать часть фильтров, сбросить запрос или искать по ключевым словам из описания компаний.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full bg-brand-primary px-5 py-3 text-sm font-bold text-white hover:bg-brand-primary-dark"
              >
                Очистить фильтры
              </button>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-[34px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur sm:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[28px] bg-slate-900 p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/60">Шаг 1</p>
              <h3 className="mt-4 font-display text-2xl font-bold">Найдите нужного участника</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Работает поиск по названию, ИНН, описанию и ключевым словам. Дополнительно можно выбрать отрасль, тип услуг, регион и город.
              </p>
            </div>

            <div className="rounded-[28px] bg-sky-50 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-500">Шаг 2</p>
              <h3 className="mt-4 font-display text-2xl font-bold text-brand-ink">Откройте карточку встречи</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Кнопка «Назначить встречу» открывает модальное окно, а выбранная компания подставляется автоматически в форму без дополнительного выбора.
              </p>
            </div>

            <div className="rounded-[28px] bg-white p-6 ring-1 ring-slate-200">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Шаг 3</p>
              <h3 className="mt-4 font-display text-2xl font-bold text-brand-ink">Заполните заявку в 2 шага</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Валидация срабатывает на лету, дата ограничена днями конференции, а после отправки пользователь получает понятное успешное состояние.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-10 max-w-[1440px] px-4 text-sm text-slate-500 sm:px-6 lg:px-8">
        Демо-версия на React + Vite + Tailwind CSS. Каталог и прием заявок теперь идут через Express API, а интеграции с CRM и почтой можно подключить следующим этапом.
      </footer>

      <RequestModal
        isOpen={Boolean(selectedCompany)}
        company={selectedCompany}
        conferenceDates={conferenceDates}
        timeOptions={timeOptions}
        onClose={() => setSelectedCompany(null)}
      />
    </div>
  );
}

export default App;
