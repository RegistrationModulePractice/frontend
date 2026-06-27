const navItems = ['Программа', 'Атмосфера', 'Место проведения', 'Контакты', 'EN'];

export function Header() {
  return (
    <header className="flex items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-10">
      <a href="#" className="shrink-0 font-display text-4xl font-extrabold leading-none text-white sm:text-5xl">
        базис<span className="text-rose-400">.</span>
      </a>

      <nav className="hidden items-center gap-8 lg:flex">
        {navItems.map((item) => (
          <a
            key={item}
            href="#catalog"
            className="text-sm font-semibold tracking-wide text-white/80 hover:text-white"
          >
            {item}
          </a>
        ))}
      </nav>

      <a
        href="#catalog"
        className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-900/20 backdrop-blur hover:bg-brand-primary-dark"
      >
        Каталог
      </a>
    </header>
  );
}
