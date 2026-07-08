import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CreatorKitPreview = ({ setPage }) => {
  const videoRef = useRef();

  useGSAP(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.creator-preview-section',
        start: 'top 50%',
        end: 'bottom bottom',
        scrub: 2,
      },
    });

    gsap.to(videoRef.current, {
      scrollTrigger: {
        trigger: '.creator-preview-section',
        start: 'top 80%',
        end: 'bottom center',
        scrub: 2,
      },
      currentTime: 10,
    });
  });

  return (
    <section className="post-card creator-preview-section pt-32 pb-48">
      <div className="animated-gradient-bg" />
      <div className="relative z-10 w-full max-w-7xl px-6 mx-auto flex flex-col items-center">
        
        <div className="text-center max-w-xl mb-12">
          <span className="font-mono text-pink text-xs uppercase block mb-3">// Creators & Community Operators</span>
          <h2 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-4">Media Vault & Server Forge</h2>
          <p className="text-white/70 text-sm mb-6">
            Help people make money playing GTA 6! Scale your content channel using our pre-written video script outlines, and acquire custom server blueprint configurations to host highly-monetized, compliant roleplay communities.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setPage('media-vault');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="bg-yellow text-black font-round-bold uppercase px-5 py-3 rounded text-xs hover:bg-white transition duration-300"
            >
              Open Media Vault
            </button>
            <button
              onClick={() => {
                setPage('server-lab');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="bg-transparent border border-white/20 text-white font-round-bold uppercase px-5 py-3 rounded text-xs hover:bg-white/10 transition duration-300"
            >
              Open Server Forge
            </button>
          </div>
        </div>

        {/* Postcard Interactive scrubbing card */}
        <div className="post-card-wrapper hover-glow mb-16 relative w-full h-[30vh] md:h-[45vh] lg:h-[60vh] max-w-4xl overflow-hidden rounded-lg shadow-2xl">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            src="./videos/postcard-vd.mp4"
            className="w-full h-full object-cover"
          />
          <img src="./images/overlay.webp" className="absolute z-10 inset-0 w-full h-full object-fill pointer-events-none" alt="" />
          <button
            onClick={() => {
              setPage('media-vault');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="font-round-bold uppercase rounded-full bg-white text-black absolute left-1/2 -translate-x-1/2 bottom-8 px-6 py-3 text-sm hover:scale-105 transition duration-300"
          >
            Explore Media Vault
          </button>
        </div>

      </div>
    </section>
  );
};

export default CreatorKitPreview;
