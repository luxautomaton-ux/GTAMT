import { useState } from 'react';

const Navbar = ({ page, setPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    ['home', 'Launch Board'],
    ['member-services', 'Services'],
    ['template-shop', 'Store'],
    ['server-forge', 'Server Forge'],
    ['calculators', 'Calculators'],
    ['streaming-academy', 'Streaming Academy'],
    ['scam-firewall', 'Scam Firewall'],
    ['member-activation', 'Member Access'],
    ['affiliate-stack', 'Affiliate Stack'],
    ['launch-funnel', 'Launch Funnel'],
    ['investor-radar', 'Investor Radar'],
    ['lana-coach', 'Lana Coach'],
  ];

  const handleNavClick = (pageId) => {
    setPage(pageId);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 md:px-12 md:py-6 z-[100] bg-black/85 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
        <img src="./images/nav-logo.svg" alt="logo-svg" className="h-8 scale-90" />
        <span className="font-round-bold text-white uppercase text-md md:text-lg tracking-wider">GTA Money Team</span>
      </div>
      <div className="hidden xl:flex items-center gap-6">
        {navItems.map(([id, label]) => (
          <button
            key={id}
            onClick={() => handleNavClick(id)}
            className={`text-xs font-semibold tracking-wider uppercase transition duration-300 bg-transparent border-0 cursor-pointer ${page === id ? 'text-yellow text-shadow-glow' : 'text-white/60 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="xl:hidden bg-transparent border-0 p-0 cursor-pointer"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
      >
        <img src="./images/menu.svg" alt="" className="w-8" />
      </button>
      {menuOpen && (
        <div className="absolute left-4 right-4 top-full mt-2 grid gap-2 rounded border border-white/10 bg-black/95 p-4 shadow-2xl xl:hidden">
          {navItems.map(([id, label]) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`w-full rounded border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider transition duration-300 ${page === id ? 'border-yellow text-yellow' : 'border-white/10 text-white/70 hover:border-cyan hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
export default Navbar;
