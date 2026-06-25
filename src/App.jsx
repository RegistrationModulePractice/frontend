import { useEffect, useState } from 'react';
import { fetchCatalog } from './api';
import { CompanyCard } from './components/CompanyCard';
import { FilterPanel } from './components/FilterPanel';
import { Header } from './components/Header';
import { RequestModal } from './components/RequestModal';

const defaultFilters = {
  industry: '',
  serviceType: '',
  region: '',
  city: '',
};

function getUniqueOptions(items, key) {
  return [...new Set(items.map((item) => item[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [conferenceDates, setConferenceDates] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [catalogStatus, setCatalogStatus] = useState('loading');
  const [catalogError, setCatalogError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadCatalog = async () => {
      setCatalogStatus('loading');
      setCatalogError('');

      try {
        const catalog = await fetchCatalog({ signal: controller.signal });

        setCompanies(catalog.companies);
        setConferenceDates(catalog.conferenceDates);
        setTimeOptions(catalog.timeOptions);
        setCatalogStatus('success');
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
  }, []);

  const industryOptions = getUniqueOptions(companies, 'industry');
  const serviceOptions = getUniqueOptions(companies, 'serviceType');
  const regionOptions = getUniqueOptions(companies, 'region');
  const cityOptions = getUniqueOptions(companies, 'city');

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredCompanies = companies.filter((company) => {
    const haystack = [
      company.name,
      company.inn,
      company.description,
      company.industry,
      company.serviceType,
      company.region,
      company.city,
      ...company.keywords,
    ]
      .join(' ')
      .toLowerCase();

    return (
      (!normalizedSearch || haystack.includes(normalizedSearch)) &&
      (!filters.industry || company.industry === filters.industry) &&
      (!filters.serviceType || company.serviceType === filters.serviceType) &&
      (!filters.region || company.region === filters.region) &&
      (!filters.city || company.city === filters.city)
    );
  });

  const activeFilters = [
    searchTerm ? `Поиск: ${searchTerm}` : null,
    filters.industry ? `Отрасль: ${filters.industry}` : null,
    filters.serviceType ? `Тип: ${filters.serviceType}` : null,
    filters.region ? `Регион: ${filters.region}` : null,
    filters.city ? `Город: ${filters.city}` : null,
  ].filter(Boolean);

  const handleFilterChange = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters(defaultFilters);
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
        <section className="relative overflow-hidden py-4 sm:py-6">
          <div className="relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.38),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(13,107,162,0.16),transparent_35%)]" />

            <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-500">Страница + блок на главной</p>
                <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Участники
                  <br />
                  конференции
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
                  Каталог помогает быстро найти нужную компанию, отфильтровать участников по отрасли и региону и оставить
                  заявку на встречу в удобное окно конференции.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#catalog"
                    className="rounded-full bg-brand-blue px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200 hover:-translate-y-0.5 hover:bg-sky-600"
                  >
                    Смотреть каталог
                  </a>
                  <span className="rounded-full border border-white/80 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-600 backdrop-blur">
                    Поиск по названию, ИНН и ключевым словам
                  </span>
                </div>
              </div>

              <div className="animate-float-soft rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-card backdrop-blur sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Конфигурация API</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="rounded-3xl bg-slate-900 px-5 py-4 text-white">
                    <div className="text-3xl font-extrabold">{companies.length}</div>
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
                  className="mt-4 rounded-full bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700"
                >
                  Обновить страницу
                </button>
              </div>
            ) : null}

            <div className="relative mt-8">
              <FilterPanel
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={clearFilters}
                industryOptions={industryOptions}
                serviceOptions={serviceOptions}
                regionOptions={regionOptions}
                cityOptions={cityOptions}
                resultsCount={filteredCompanies.length}
                totalCount={companies.length}
                activeFilters={activeFilters}
              />
            </div>
          </div>
        </section>

        <section id="catalog" className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Сетка участников</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-brand-ink sm:text-4xl">
                Компании для деловых встреч
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Карточки спроектированы под витринный каталог: логотип, название, краткое описание, теги и быстрая запись
              в модальном окне.
            </p>
          </div>

          {catalogStatus === 'loading' ? (
            <div className="mt-8 rounded-[30px] border border-slate-200 bg-white/80 p-8 text-center shadow-card">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Загружаем данные</p>
              <h3 className="mt-3 font-display text-2xl font-bold text-brand-ink">Подтягиваем каталог компаний с backend</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                После ответа API здесь появятся карточки компаний, фильтры и доступные слоты для записи на встречу.
              </p>
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredCompanies.map((company, index) => (
                <CompanyCard key={company.id} company={company} index={index} onRequest={setSelectedCompany} />
              ))}
            </div>
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
                className="mt-6 rounded-full bg-brand-blue px-5 py-3 text-sm font-bold text-white hover:bg-sky-600"
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
                Работает поиск по названию, ИНН, описанию и ключевым словам. Дополнительно можно выбрать отрасль, тип
                услуг, регион и город.
              </p>
            </div>

            <div className="rounded-[28px] bg-sky-50 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-500">Шаг 2</p>
              <h3 className="mt-4 font-display text-2xl font-bold text-brand-ink">Откройте карточку встречи</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Кнопка «Назначить встречу» открывает модальное окно, а выбранная компания подставляется автоматически в
                форму без дополнительного выбора.
              </p>
            </div>

            <div className="rounded-[28px] bg-white p-6 ring-1 ring-slate-200">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Шаг 3</p>
              <h3 className="mt-4 font-display text-2xl font-bold text-brand-ink">Заполните заявку в 2 шага</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Валидация срабатывает на лету, дата ограничена днями конференции, а после отправки пользователь получает
                понятное успешное состояние.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-10 max-w-[1440px] px-4 text-sm text-slate-500 sm:px-6 lg:px-8">
        Демо-версия на React + Vite + Tailwind CSS. Каталог и прием заявок теперь идут через Express API, а интеграции с
        CRM и почтой можно подключить следующим этапом.
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
