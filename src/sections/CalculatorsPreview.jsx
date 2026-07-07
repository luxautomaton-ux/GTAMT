import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CalculatorsPreview = ({ setPage }) => {
  useGSAP(() => {
    gsap.set('.calc-preview-section', { marginTop: '-80vh' });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.calc-preview-section',
          start: 'top 80%',
          end: '10% center',
          scrub: 2,
        },
      })
      .to('.second-vd', { opacity: 0, duration: 1, ease: 'power1.inOut' });

    gsap.to(
      '.calc-preview-section .img-box',
      {
        scrollTrigger: {
          trigger: '.calc-preview-section',
          start: 'top center',
          end: '80% center',
          scrub: 2,
        },
        y: -200,
        duration: 1,
        ease: 'power1.inOut',
      },
      '<'
    );
  });

  return (
    <section className="lucia-life calc-preview-section">
      <div className="flex flex-col gap-10 items-start img-box lg:w-1/2 ps-10 mt-96">
        <div className="lucia-1">
          <img src="./images/lb-photo-5.jpg" alt="Lana command center preview" />
        </div>
        <div className="lucia-3">
          <img src="./images/lb-photo-2.jpg" alt="GTA HUD statistics layout" />
        </div>
      </div>

      <div className="lg:w-1/2 lucia-life-content text-left">
        <div className="max-w-xl lg:ps-32 ps-10">
          <span className="font-mono text-pink text-xs uppercase block mb-3">// Yield Tools & Strategies</span>
          <h1>Revenue Estimators</h1>
          <h2>Project in-game hourly margins and subscriber business models.</h2>
          <p className="text-white/80 md:text-lg text-sm mb-6">
            Make decisions based on numbers, not guesses. We provide automated calculator dashboards to verify your transport route margins, crew splits, and subscriber conversion MRR. Stack routes cleanly without cheats or shortcuts.
          </p>
          <div className="flex gap-3 mb-10">
            <button
              onClick={() => {
                setPage('calculators');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="bg-cyan text-black font-round-bold uppercase px-5 py-3 rounded hover:bg-white transition duration-300"
            >
              Open Profit Calculators
            </button>
            <button
              onClick={() => {
                setPage('route-planner');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="bg-transparent border border-white/20 text-white font-round-bold uppercase px-5 py-3 rounded hover:bg-white/10 transition duration-300"
            >
              Study Money Routes
            </button>
          </div>

          <div className="lucia-2">
            <img src="./images/lb-photo-1.jpg" alt="Revenue estimators street view" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorsPreview;
