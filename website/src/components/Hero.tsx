"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Terminal } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-10 overflow-hidden bg-grid-pattern">
      {/* Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px] -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-rig/10 rounded-full blur-[100px] -z-10"
      />

      <div className="container px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-center text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest text-accent-rig border border-accent-rig/30 bg-accent-rig/5 rounded-full backdrop-blur-md">
              <Terminal size={12} />
              <span>KALP SONI // ENGINEERED INTELLIGENCE</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-8 leading-[1.05]"
          >
            Building intelligent
            <br />
            systems, products,
            <br />
            <span className="text-white/40 italic">and experiences.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl font-light leading-relaxed mb-12"
          >
            AI engineer and full-stack developer focused on modern software,
            automation, scalable systems, and product innovation.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
            <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-white px-8 font-medium text-black transition-all hover:scale-105 active:scale-95">
              <span className="mr-2">Explore Work</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black/50 backdrop-blur-md px-8 font-medium text-white transition-all hover:bg-white/5 hover:border-white/20 active:scale-95">
              <span>Initialize Contact</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-zinc-500"
      >
        <span className="text-xs font-mono tracking-widest mb-2 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
