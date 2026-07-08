import { useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import ComingSoon from './ComingSoon';
import { useMaskSettings } from '../../constants';
import { rockstarMediaCatalog } from '../data/rockstarMediaCatalog';

const Hero = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { initialMaskPos, initialMaskSize, maskSize } =
    useMaskSettings();
  const launchTrailer =
    rockstarMediaCatalog.videos.find((video) => video.title === 'Grand Theft Auto VI Trailer 2') ||
    rockstarMediaCatalog.videos.find((video) => video.title === 'Grand Theft Auto VI Trailer 1') ||
    rockstarMediaCatalog.videos[0];

  useGSAP(() => {
    gsap.set('.mask-wrapper', {
      maskPosition: initialMaskPos,
      webkitMaskPosition: initialMaskPos,
      maskSize: initialMaskSize,
      webkitMaskSize: initialMaskSize,
    });

    gsap.set('.mask-logo', {
      marginTop: '-100vh',
      opacity: 0,
    });
    gsap.set('.entrance-message', {
      marginTop: '0vh',
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        scrub: 2.5,
        end: '+=200%',
        pin: true,
      },
    });
    tl.to('.fade-out', {
      opacity: 0,
      ease: 'power1.inOut',
    })
      .to('.scale-out', {
        scale: 1,
        ease: 'power1.inOut',
      })
      .to(
        '.mask-wrapper',
        {
          maskSize,
          webkitMaskSize: maskSize,
          ease: 'power1.inOut',
        },
        '<'
      )
      .to('.mask-wrapper', {
        opacity: 0,
      })
      .to(
        '.overlay-logo',
        {
          opacity: 1,
          onComplete: () => {
            gsap.to('.overlay-logo', { opacity: 0 });
          },
        },
        '<'
      )
      .to(
        '.entrance-message',
        {
          duration: 1,
          ease: 'power1.inOut',
          maskImage:
            'radial-gradient(circle at 50% 0vh,black,transparent 100%)',
          webkitMaskImage:
            'radial-gradient(circle at 50% 0vh,black,transparent 100%)',
        },
        '<'
      );
  });
  return (
    <section className="hero-section">
      <div className="size-full mask-wrapper">
        <img
          src="./images/lana-night-car.jpg"
          alt="background"
          className="scale-out"
        />
        <img
          src="./images/hero-text.webp"
          alt="hero-logo"
          className="title-logo fade-out "
        />
        <img
          src="./images/watch-trailer.png"
          alt="trailer"
          className="trailer-logo fade-ut cursor-pointer hover:scale-105 transition-all duration-300"
          onClick={() => setIsPlaying(true)}
        />

        <div
          className="play-img fade-out cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300"
          onClick={() => setIsPlaying(true)}
        >
          <img src="./images/play.png" alt="play" className="w-7 ml-1" />
        </div>
      </div>

      <div>
        <img
          src="./images/big-hero-text.svg"
          alt="logo"
          className="size-full object-cover mask-logo"
        />
      </div>

      <div className="fake-logo-wrapper">
        <img
          src="./images/big-hero-text.svg"
          alt="wrapper-logo"
          className="overlay-logo"
        />
      </div>

      <ComingSoon />

      {isPlaying && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsPlaying(false)}
        >
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-6 right-6 text-white text-4xl hover:text-pink transition duration-200 cursor-pointer"
            aria-label="Close Video"
          >
            &times;
          </button>
          <div
            className="w-full max-w-5xl rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_80px_rgba(255,20,147,0.2)] bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            <video
              src={launchTrailer.video}
              poster={launchTrailer.poster}
              title={launchTrailer.title}
              controls
              autoPlay
              playsInline
              className="w-full h-full"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-black border-t border-white/10">
              <div>
                <strong className="block text-white text-sm uppercase">{launchTrailer.title}</strong>
                <span className="block text-white/50 text-[11px] uppercase tracking-wider">Official Rockstar media source</span>
              </div>
              <a
                href={launchTrailer.sourcePage}
                target="_blank"
                rel="noreferrer"
                className="text-cyan text-xs uppercase font-semibold hover:text-white transition"
              >
                Open Rockstar Videos
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default Hero;
