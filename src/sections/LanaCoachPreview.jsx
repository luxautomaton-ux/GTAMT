import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const LanaCoachPreview = ({ setPage }) => {
  useGSAP(() => {
    gsap.set('.lana-preview-section', { marginTop: '-80vh' });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.lana-preview-section',
          start: 'top 90%',
          end: '10% center',
          scrub: 2,
        },
      })
      .to('.first-vd', { opacity: 0, duration: 1, ease: 'power1.inOut' });

    gsap.to(
      '.lana-preview-section .img-box',
      {
        scrollTrigger: {
          trigger: '.lana-preview-section',
          start: 'top center',
          end: '80% center',
          scrub: 2,
        },
        y: -300,
        duration: 1,
        ease: 'power1.inOut',
      },
      '<'
    );
  });

  return (
    <section className="jason lana-preview-section">
      <div className="max-w-lg jason-content text-left">
        <span className="font-mono text-pink text-xs uppercase block mb-3">// AI Strategy Coach</span>
        <h1>Lana Agent</h1>
        <h2>Premium AI Coaching built for modern GTA 6 players.</h2>
        <p className="text-white/80 md:text-lg text-sm mb-6">
          Meet Lana, your branded Lux Automaton AI guide. Built directly into the Money Team, Lana assists you with on-demand business specs, crew payout plans, and launch-week routes. Banish account risk and learn strategy the smart, legal way.
        </p>
        <button
          onClick={() => {
            setPage('lana-coach');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          className="bg-pink text-black font-round-bold uppercase px-6 py-3 rounded hover:bg-coral transition duration-300 mb-10"
        >
          Consult AI Coach
        </button>

        <div className="jason-2">
          <img src="./images/lb-photo-4.jpg" alt="Lana coaching tablet" />
        </div>
      </div>

      <div className="space-y-10 mt-96 img-box flex flex-col justify-center items-end pe-10 lg:pe-20">
        <div className="jason-1">
          <img src="./images/lb-photo-3.jpg" alt="Lana marina helicopter sunset" />
        </div>
        <div className="jason-3">
          <img src="./images/lb-photo-2.jpg" alt="Lana dashboard commands" />
        </div>
      </div>
    </section>
  );
};

export default LanaCoachPreview;
