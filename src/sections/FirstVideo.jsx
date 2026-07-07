import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { useRef } from 'react';

const FirstVideo = () => {
  const videoRef = useRef(null);

  useGSAP(() => {
    gsap.set('.first-vd-wrapper', {
      marginTop: '-150vh',
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.first-vd-wrapper',
        start: 'top top',
        end: '+=200% top',
        scrub: true,
        pin: true,
      },
    });

    tl.to('.hero-section', {
      delay: 0.5,
      opacity: 0,
      ease: 'power1.inOut',
    });

    tl.to('.first-vd-wrapper', {
      opacity: 1,
      duration: 2,
      ease: 'power1.inOut',
    });

    const video = videoRef.current;
    if (!video) return;

    video.onloadedmetadata = () => {
      if (!videoRef.current) return;
      tl.to(
        video,
        {
          currentTime: video.duration,
          duration: 3,
          ease: 'power1.inOut',
        },
        '<'
      );
    };
  }, []);

  return (
    <section className="first-vd-wrapper">
      <div className="h-dvh">
        <video
          src="./videos/output1.mp4"
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="first-vd"
        ></video>
      </div>
    </section>
  );
};
export default FirstVideo;
