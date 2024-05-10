import { AnimationConfig } from "@/components/AnimationConfig";
import BackdropGallery from "@/components/BackdropGallery/BackdropGallery";
import { motion, useInView } from "framer-motion";
import React, { MutableRefObject, useRef } from "react";

type Props = {};

const backdropImages = [
  {
    src: "/country-club/backdrop-gallery/backdrop-1.jpg",
    alt: "Backdrop 1",
  },
  {
    src: "/country-club/backdrop-gallery/backdrop-2.jpg",
    alt: "Backdrop 2",
  },
  {
    src: "/country-club/backdrop-gallery/backdrop-3.jpg",
    alt: "Backdrop 3",
  },
  {
    src: "/country-club/backdrop-gallery/backdrop-4.jpg",
    alt: "Backdrop 4",
  },
];

const BackdropScection = (props: Props) => {
  const containerRef = useRef() as MutableRefObject<HTMLElement>;
  const isInView = useInView(containerRef, {
    margin: "-0% 0% 0% 0%",
    amount: 0.3,
  });

  return (
    <section className="flex flex-col items-center my-24" ref={containerRef}>
      <div className="mb-12">
        <Crown />
      </div>
      <motion.h2
        className="font-country-script-display mb-12 text-center"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isInView ? 1 : 0,
          transition: {
            duration: AnimationConfig.SLOW,
            delay: 0,
          },
        }}
      >
        The making of our backdrop
      </motion.h2>
      <div className="flex flex-col md:flex-row text-justify gap-4 mx-4">
        <motion.p
          className="font-sans-sm max-w-[34ch]"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isInView ? 1 : 0,
            transition: {
              duration: AnimationConfig.SLOW,
              delay: 0.1,
            },
          }}
        >
          Setting the scene for our photoshoot, our backdrop was the result of
          thorough historical research and AI image-making with Midjourney to
          achieve the exact country club atmosphere we had in mind.
        </motion.p>
        <motion.p
          className="font-sans-sm max-w-[34ch]"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isInView ? 1 : 0,
            transition: {
              duration: AnimationConfig.SLOW,
              delay: 0.15,
            },
          }}
        >
          The final imagery references the West Side Tennis Club located in
          Queens, New York—the historical site of the first 60 editions of the
          U.S. Open held between 1915 and 1977.
        </motion.p>
      </div>
      <BackdropGallery images={backdropImages} />
    </section>
  );
};

const Crown = () => (
  <svg
    width="38"
    height="40"
    viewBox="0 0 38 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.69948 25.696C6.90639 26.5471 6.28567 26.7819 5.81274 27.1341C5.22158 27.6037 4.57131 27.9559 3.89148 28.2494C2.65004 28.807 1.31993 28.5428 0.847008 27.7504C0.108059 26.5471 0.285407 25.021 1.34949 24.1405C2.32491 23.3481 3.47767 22.8492 4.77821 23.1427C5.93097 23.4068 6.4039 24.4634 6.69948 25.696Z"
      fill="#1B2420"
    />
    <path
      d="M35.4891 28.3371C33.8043 28.6306 32.0604 27.1045 31.6761 25.8718C31.5874 25.637 31.5579 25.3436 31.6465 25.0794C32.0899 23.612 34.5432 22.7902 35.7551 23.7294C36.6714 24.4631 37.3217 25.4316 37.5581 26.5762C37.6172 26.9284 37.4399 27.5154 37.1739 27.6621C36.6123 28.0143 35.9324 28.2784 35.5482 28.3371H35.4891Z"
      fill="#1B2420"
    />
    <path
      d="M9.00469 4.00715C10.6895 4.38868 11.6649 6.47244 11.5467 7.76378C11.5467 8.02792 11.4284 8.29205 11.2807 8.49749C10.3052 9.67144 7.70414 9.49535 6.96519 8.14531C6.40359 7.11811 6.19669 5.97351 6.43315 4.82891C6.49227 4.47673 6.90608 4.0365 7.23122 3.9778C7.91105 3.86041 8.62044 3.88976 9.00469 3.9778V4.00715Z"
      fill="#1B2420"
    />
    <path
      d="M32.2669 4.97565C32.1782 5.73872 31.6757 6.38439 31.2619 7.00071C30.8481 7.61703 30.3161 8.204 29.7249 8.67358C29.3407 8.96707 28.6608 9.2899 28.3061 9.14316C27.7741 8.90837 27.1534 8.3214 27.0351 7.79312C26.71 6.44308 28.3357 3.8017 29.6362 3.33213C31.1141 2.7745 32.4738 3.33213 32.2373 4.97565H32.2669Z"
      fill="#1B2420"
    />
    <path
      d="M37.0261 16.539C36.5236 17.1553 35.7551 17.3901 35.1048 17.7129C34.0112 18.2412 32.3559 17.5368 32.1786 16.3629C32.0899 15.7466 32.2968 14.8368 32.7402 14.4259C33.3905 13.8096 34.3363 13.5161 35.1639 13.0758C35.9916 12.6063 36.7305 12.9585 37.3808 13.3693C37.6468 13.5454 37.9719 14.0444 37.9128 14.3085C37.7059 15.0716 37.5581 15.952 37.0261 16.539Z"
      fill="#1B2420"
    />
    <path
      d="M17.104 4.12467C16.838 3.36161 17.0154 2.59854 17.104 1.89418C17.2223 0.690882 18.6706 -0.336321 19.7938 0.103909C20.385 0.338698 21.0352 1.01372 21.183 1.57134C21.3899 2.42245 21.1239 3.39096 21.0944 4.33011C21.0648 5.26927 20.385 5.7095 19.6756 6.06168C19.38 6.20843 18.7888 6.20843 18.5819 6.00299C18.0203 5.44536 17.3701 4.85839 17.104 4.09532V4.12467Z"
      fill="#1B2420"
    />
    <path
      d="M28.6016 30.9494C30.1977 30.8907 31.853 32.8277 31.9712 34.0017C32.0599 34.7354 31.8826 35.293 31.0549 35.6158C28.4243 36.6137 26.9759 34.8528 26.6804 32.6516C26.503 31.3896 27.242 30.9788 28.6016 30.9201V30.9494Z"
      fill="#1B2420"
    />
    <path
      d="M4.80743 17.4488C3.44776 17.2434 2.41323 16.8031 1.40826 16.3629C0.610199 15.9814 -0.128749 14.8074 0.137272 13.9857C0.255504 13.6335 0.639757 13.3107 0.994453 13.1639C2.94528 12.3422 5.98975 13.8976 5.98975 16.2455C5.98975 17.1553 5.48726 17.5956 4.77787 17.4782L4.80743 17.4488Z"
      fill="#1B2420"
    />
    <path
      d="M18.1972 34.2656C17.7242 35.557 17.6356 36.6722 17.5765 37.7581C17.5173 38.6386 18.2267 39.8419 19.0839 39.9886C19.4386 40.0473 19.9411 39.8712 20.2367 39.6364C21.8919 38.3158 21.951 34.9113 19.8524 33.8254C19.0544 33.4145 18.4336 33.62 18.1972 34.295V34.2656Z"
      fill="#1B2420"
    />
    <path
      d="M11.6946 32.4754C11.5764 33.8548 11.1921 34.9114 10.8079 35.9092C10.4828 36.731 9.35955 37.5528 8.50237 37.318C8.14768 37.2299 7.79298 36.8484 7.61563 36.5256C6.64022 34.6472 7.99989 31.5363 10.3645 31.3602C11.2513 31.3015 11.7537 31.7711 11.6651 32.4754H11.6946Z"
      fill="#1B2420"
    />
  </svg>
);

export default BackdropScection;
