import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const investorCards = [
  ['TTWO exposure', 'Rockstar Games is owned by Take-Two Interactive. Track TTWO, earnings calls, guidance, and launch timing.'],
  ['Catalyst watch', 'Monitor official trailers, pre-orders, platform news, delays, reviews, sales data, and post-launch monetization.'],
  ['Crypto firewall', 'There is no official GTA token. Treat beta coins, wallet links, early-access NFTs, and free-money offers as hostile.'],
  ['Education only', 'Investor Radar teaches research habits and scam defense. It is not financial advice or a buy/sell signal.'],
]

const serviceCards = [
  ['Route Plan Buildout', 'We build custom money-route playbooks, interactive checklists, and weekly plans for members.'],
  ['Crew Economy Setup', 'We organize team roles, launch calendars, payout distribution rules, and retention workflows.'],
  ['Creator Content Pack', 'We turn trailer notes and gameplay routes into custom content scripts, thumbnails, and distribution plans.'],
  ['Server Blueprint', 'We prepare rules, moderation queues, staff workflows, and safe resource audit templates.'],
  ['Affiliate Funnel', 'We map trusted gaming gear, hosting, creator toolkits, and community offers into member pages.'],
  ['Investor Brief', 'We build education around Take-Two (TTWO) catalysts, valuation, risk, and source-backed watchlists.'],
]

const mediaShots = [
  {
    title: 'Vice City Sign',
    url: 'https://www.rockstargames.com/VI/_next/static/media/Vice_City_01.135x56yoeu.6t.jpg?akim=1&imdensity=1&imwidth=1920',
  },
  {
    title: 'Ocean View',
    url: 'https://www.rockstargames.com/VI/_next/static/media/Vice_City_02.0c5.7qx17u9kl.jpg?akim=1&imdensity=1&imwidth=1920',
  },
  {
    title: 'Downtown Systems',
    url: 'https://www.rockstargames.com/VI/_next/static/media/Vice_City_03.0nqz~lrqdmlze.jpg?akim=1&imdensity=1&imwidth=1920',
  },
  {
    title: 'Leonida Keys',
    url: 'https://www.rockstargames.com/VI/_next/static/media/Leonida_Keys_01.0zgz7tveur6y8.jpg?akim=1&imdensity=1&imwidth=1920',
  },
]

const Outro = () => {
  useGSAP(() => {
    gsap.set('.final-message-section', { marginTop: '-100vh', opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.final-message-section',
        start: 'top 30%',
        end: 'top 10%',
        scrub: true,
      },
    });

    tl.to('.final-content', { opacity: 0, duration: 1, ease: 'power1.inOut' });
    tl.to('.final-message-section', { opacity: 1, duration: 1, ease: 'power1.inOut' });
  });

  return (
    <section className="final-message final-message-section flex flex-col items-center justify-start py-32 px-6 bg-black" id="investor-radar">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Logo and branding */}
        <div className="flex flex-col items-center gap-6 text-center">
          <img src="./images/logo.webp" alt="logo" className="md:w-72 w-52" />
          <h3 className="gradient-title">
            GTA <br /> MONEY TEAM
          </h3>
        </div>

        {/* Media Vault block */}
        <div className="w-full text-left" id="media-vault">
          <div className="border border-cyan/20 rounded-lg p-6 bg-white/5 mb-8">
            <span className="font-mono text-pink text-xs uppercase block mb-3">// Media Vault & Screen Study</span>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <strong className="block text-2xl uppercase text-white mb-3">Trailer Clues & Strategy Lessons</strong>
                <p className="text-white/60 text-xs leading-relaxed mb-4">
                  Study locations, vehicles, and assets from official Rockstar material to plan launch week strategies. Members get notes on vehicles, locations, possible business systems, content angles, and safe source verification.
                </p>
                <a
                  href="https://www.rockstargames.com/VI/media/screenshots"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-4 py-2 border border-white/20 rounded text-cyan text-xs font-semibold hover:border-cyan transition duration-300"
                >
                  Open Official Screenshots
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {mediaShots.map((shot) => (
                  <a href={shot.url} target="_blank" rel="noreferrer" key={shot.title} className="block group border border-white/10 rounded overflow-hidden">
                    <img src={shot.url} alt={shot.title} className="w-full aspect-video object-cover group-hover:scale-105 transition duration-500" />
                    <span className="block p-2 text-[10px] text-white/50 uppercase">{shot.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Member Services block */}
        <div className="w-full text-left" id="member-services">
          <span className="font-mono text-pink text-xs uppercase block mb-6">// Member Services</span>
          <div className="grid md:grid-cols-3 gap-6">
            {serviceCards.map(([title, text]) => (
              <div key={title} className="p-6 border border-white/10 rounded-lg bg-white/5 flex flex-col justify-between">
                <div>
                  <strong className="block text-lg text-white uppercase mb-2">{title}</strong>
                  <p className="text-white/60 text-xs leading-relaxed">{text}</p>
                </div>
                <button className="mt-4 w-full py-2 bg-transparent border border-cyan/40 rounded text-cyan text-xs font-semibold uppercase hover:bg-cyan/10 hover:border-cyan transition duration-300">
                  Request Build
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Investor Radar block */}
        <div className="grid md:grid-cols-2 gap-8 text-left w-full">
          <div>
            <span className="font-mono text-pink text-xs uppercase block mb-6">// Investor Radar</span>
            <div className="grid grid-cols-2 gap-4">
              {investorCards.map(([title, text]) => (
                <div key={title} className="p-5 border border-white/10 rounded bg-white/5">
                  <strong className="block text-yellow text-sm uppercase mb-2">{title}</strong>
                  <p className="text-white/60 text-xs leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scam warning */}
          <div className="flex flex-col justify-center p-6 border border-green/30 rounded bg-green/5 h-fit self-center">
            <strong className="block text-green text-lg uppercase mb-3">Scam Defense Desk</strong>
            <p className="text-white/70 text-xs leading-relaxed">
              If it says GTA VI beta, early access, crypto payment, secret token, free money, or downloadable PC/mobile build before official release, treat it as hostile. GTA Money Team teaches source checks, account safety, and legal advantage systems.
            </p>
          </div>
        </div>

        {/* Sources Footer */}
        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row items-center justify-between gap-6 w-full text-xs text-white/50">
          <div className="flex items-center gap-3">
            <strong>Source Stack</strong>
            <span>Checked July 6, 2026. Official claims are sourced; calculators are planning tools.</span>
          </div>
          <div className="flex gap-4">
            <a href="https://www.rockstargames.com/VI/" target="_blank" rel="noreferrer" className="hover:text-cyan transition">Rockstar GTA VI</a>
            <a href="https://www.rockstargames.com/VI/media/videos" target="_blank" rel="noreferrer" className="hover:text-cyan transition">Official Videos</a>
            <a href="https://www.take2games.com/ir/stock" target="_blank" rel="noreferrer" className="hover:text-cyan transition">Take-Two IR</a>
          </div>
        </div>

        {/* Brand credit */}
        <div className="text-center text-white/40 text-[11px] uppercase tracking-wider">
          Powered by Lana from Lux Agent | Created by Lux Automaton
        </div>

      </div>
    </section>
  );
};

export default Outro;
