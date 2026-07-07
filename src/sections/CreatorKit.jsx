import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const serverSteps = [
  {
    title: 'Server Basics',
    text: 'Plan Linux hosting, automated backups, centralized logging, moderator roles, database ownership, and maintenance windows.',
  },
  {
    title: 'Roleplay Rules',
    text: 'Write clear behavior rules, staff escalation pathways, appeal forms, and user privacy guidelines before public applications.',
  },
  {
    title: 'Resource Stack',
    text: 'Audit every script, license, external dependency, webhook, and admin command in a staging environment prior to server release.',
  },
  {
    title: 'Ops Rhythm',
    text: 'Schedule restarts, snapshots, changelog posts, server performance reviews, and direct community feedback loops.',
  },
]

const CreatorKitSection = () => {
  const videoRef = useRef();

  useGSAP(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.post-card-section',
        start: 'top 50%',
        end: 'bottom bottom',
        scrub: 2,
      },
    });

    gsap.to(videoRef.current, {
      scrollTrigger: {
        trigger: '.post-card-section',
        start: 'top 80%',
        end: 'bottom center',
        scrub: 2,
      },
      currentTime: 10,
    });
  });

  return (
    <section className="post-card post-card-section pt-32 pb-48" id="creator-kit">
      <div className="animated-gradient-bg" />
      <div className="relative z-10 w-full max-w-7xl px-6 mx-auto flex flex-col items-center">
        
        {/* Intro */}
        <div className="text-center max-w-xl mb-12">
          <span className="font-mono text-pink text-xs uppercase block mb-3">// Creator Kit & Server Lab</span>
          <h2 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-4">Creator Blueprints & Server Specs</h2>
          <p className="text-white/70 text-sm">
            Launch your GTA 6 content business and host compliant RP servers. Optimize viewer funnels, build script blueprints, and monitor server operations.
          </p>
        </div>

        {/* Reference PostCard Widget */}
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
            onClick={() => document.getElementById('media-vault')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-round-bold uppercase rounded-full bg-white text-black absolute left-1/2 -translate-x-1/2 bottom-8 px-6 py-3 text-sm hover:scale-105 transition duration-300"
          >
            Explore Media Vault
          </button>
        </div>

        {/* Creator Kit & Server Lab Content grids */}
        <div className="grid md:grid-cols-2 gap-8 w-full">
          
          {/* Creator Kit info */}
          <div className="p-6 border border-white/10 rounded-lg bg-black/80 backdrop-blur-md">
            <h3 className="font-round-bold text-2xl uppercase text-yellow mb-4">Content Blueprints</h3>
            <div className="space-y-4 text-left">
              <div className="p-4 bg-white/5 border border-white/10 rounded">
                <strong className="block text-white text-sm uppercase mb-1">Leonida Video Outlines</strong>
                <p className="text-white/60 text-xs">Script outlines for Solo Grinder progression guides and interactive map route clips.</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded">
                <strong className="block text-white text-sm uppercase mb-1">Content Pipeline Blueprint</strong>
                <p className="text-white/60 text-xs">Clip batching methods and search-optimized title formulas to drive traffic ethically.</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded">
                <strong className="block text-white text-sm uppercase mb-1">Viewer Conversion Strategy</strong>
                <p className="text-white/60 text-xs">Convert viewers into members using route planning guides and community sessions.</p>
              </div>
            </div>
          </div>

          {/* Server Lab info */}
          <div className="p-6 border border-white/10 rounded-lg bg-black/80 backdrop-blur-md" id="server-lab">
            <h3 className="font-round-bold text-2xl uppercase text-pink mb-4">RP Server Blueprint</h3>
            <div className="grid grid-cols-2 gap-4 text-left">
              {serverSteps.map((step) => (
                <div key={step.title} className="p-4 bg-white/5 border border-white/10 rounded">
                  <strong className="block text-white text-sm uppercase mb-1">{step.title}</strong>
                  <p className="text-white/60 text-xs">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CreatorKitSection;
