import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const OutroPreview = ({ setPage }) => {
  useGSAP(() => {
    gsap.set('.outro-preview-section', { marginTop: '-100vh', opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.outro-preview-section',
        start: 'top 30%',
        end: 'top 10%',
        scrub: true,
      },
    });

    tl.to('.final-content', { opacity: 0, duration: 1, ease: 'power1.inOut' });
    tl.to('.outro-preview-section', { opacity: 1, duration: 1, ease: 'power1.inOut' });
  });

  return (
    <section className="final-message outro-preview-section flex flex-col items-center justify-start py-32 px-6 bg-black">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-16 items-center">
        
        {/* Title branding */}
        <div className="flex flex-col items-center gap-6 text-center">
          <img src="./images/logo.webp" alt="logo" className="md:w-72 w-52" />
          <h3 className="gradient-title">
            GTA <br /> MONEY TEAM
          </h3>
          <p className="text-pink font-long uppercase text-xl md:text-2xl tracking-widest max-w-xl">
            Learn How To Make Money The Legit Way.
          </p>
        </div>

        {/* Call to Actions for subpages */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl w-full text-center">
          <div className="p-6 border border-white/10 rounded bg-white/5 flex flex-col justify-between items-center">
            <strong className="block text-white uppercase text-lg mb-2">DFY Services</strong>
            <p className="text-white/60 text-xs mb-4">Request custom money routes, crew payouts setup, and server script Audits.</p>
            <button
              onClick={() => {
                setPage('member-services');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="px-4 py-2 bg-pink text-black text-xs font-semibold uppercase rounded hover:bg-white transition duration-300"
            >
              Request Service
            </button>
          </div>
          
          <div className="p-6 border border-white/10 rounded bg-white/5 flex flex-col justify-between items-center">
            <strong className="block text-white uppercase text-lg mb-2">Investor Radar</strong>
            <p className="text-white/60 text-xs mb-4">Analyze Take-Two Interactive market metrics and build structural research habits.</p>
            <button
              onClick={() => {
                setPage('investor-radar');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="px-4 py-2 bg-yellow text-black text-xs font-semibold uppercase rounded hover:bg-white transition duration-300"
            >
              Open Radar
            </button>
          </div>

          <div className="p-6 border border-white/10 rounded bg-white/5 flex flex-col justify-between items-center">
            <strong className="block text-white uppercase text-lg mb-2">Scam Firewall</strong>
            <p className="text-white/60 text-xs mb-4">Filter out fake beta keys, crypto coin scams, and malicious downloads safely.</p>
            <button
              onClick={() => {
                setPage('investor-radar');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="px-4 py-2 bg-green text-black text-xs font-semibold uppercase rounded hover:bg-white transition duration-300"
            >
              Security Check
            </button>
          </div>
        </div>

        {/* Platforms */}
        <div className="flex-center gap-10 mt-6">
          <img src="./images/ps-logo.svg" className="md:w-32 w-20" alt="PS5" />
          <img src="./images/x-logo.svg" className="md:w-52 w-40" alt="Xbox Series" />
        </div>

        {/* Footer info */}
        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row items-center justify-between gap-6 w-full text-xs text-white/50 text-left">
          <div>
            <strong>Source Stack</strong>
            <span className="block mt-1">Checked July 6, 2026. Official claims are sourced; calculators are planning tools.</span>
          </div>
          <div className="flex gap-4">
            <a href="https://www.rockstargames.com/VI/" target="_blank" rel="noreferrer" className="hover:text-cyan transition">Rockstar GTA VI</a>
            <a href="https://www.rockstargames.com/VI/media/videos" target="_blank" rel="noreferrer" className="hover:text-cyan transition">Official Videos</a>
            <a href="https://www.take2games.com/ir/stock" target="_blank" rel="noreferrer" className="hover:text-cyan transition">Take-Two IR</a>
          </div>
        </div>

        <div className="text-center text-white/40 text-[11px] uppercase tracking-wider">
          Powered by Lana from Lux Agent | Created by Lux Automaton
        </div>

      </div>
    </section>
  );
};

export default OutroPreview;
