const tones = [
  'from-sky-500 to-cyan-400',
  'from-emerald-500 to-lime-400',
  'from-amber-500 to-orange-400',
  'from-fuchsia-500 to-rose-400',
  'from-indigo-500 to-sky-500',
  'from-teal-500 to-cyan-400',
];

function getInitials(name) {
  return name
    .replace(/["«».]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function CompanyCard({ company, index, onRequest }) {
  const tone = tones[index % tones.length];

  return (
    <article
      className="group flex h-full flex-col rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-card backdrop-blur animate-fade-up"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tone} font-display text-2xl font-bold text-white shadow-lg shadow-slate-300/40`}
        >
          {getInitials(company.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
              ИНН {company.inn}
            </span>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              {company.city}
            </span>
          </div>

          <h3 className="mt-3 font-display text-xl font-bold text-brand-ink">{company.name}</h3>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {company.industry} • {company.serviceType}
          </p>
        </div>
      </div>

      <p className="mt-5 flex-1 text-sm leading-6 text-slate-600 [display:-webkit-box] [-webkit-line-clamp:4] [-webkit-box-orient:vertical] overflow-hidden">
        {company.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {company.keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500"
          >
            {keyword}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{company.region}</span>
        </div>
        <button
          type="button"
          onClick={() => onRequest(company)}
          className="rounded-full bg-brand-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:bg-brand-primary-dark"
        >
          Назначить встречу
        </button>
      </div>
    </article>
  );
}
