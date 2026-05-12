"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Database, Blocks } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stackCards = [
  { name: "Frontend", icon: <Code2 size={18} />, tools: "Next.js, React, Tailwind, TS" },
  { name: "Backend", icon: <Database size={18} />, tools: "Node.js, Python, PostgreSQL" },
  { name: "Infrastructure", icon: <Cpu size={18} />, tools: "AWS, Terraform, Docker" },
  { name: "AI/Systems", icon: <Blocks size={18} />, tools: "LLMs, LangChain, Automation" },
];

export function About() {
  return (
    <section className="relative py-32 border-t border-white/5 bg-background">
      <div className="container px-6 md:px-12 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24"
        >
          {/* Narrative Bio */}
          <motion.div variants={fadeUp} className="flex flex-col justify-center">
            <h2 className="text-sm font-mono tracking-widest text-zinc-500 mb-6 uppercase">
              // Identify
            </h2>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 text-white">
              Engineering the future of intelligent products.
            </h3>
            <div className="space-y-4 text-zinc-400 font-light leading-relaxed">
              <p>
                I am Kalp Soni, an AI engineer and full-stack developer with a 
                founder&apos;s mindset. My focus lies at the intersection of scalable 
                infrastructure, artificial intelligence, and premium product design.
              </p>
              <p>
                I don&apos;t just write code; I architect systems. From zero-touch 
                CI/CD pipelines and complex AWS environments to highly cinematic 
                user interfaces and intelligent agents, I build solutions that 
                are designed for scale, resilience, and impact.
              </p>
            </div>
          </motion.div>

          {/* Tech Stack Cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stackCards.map((card, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-rig/0 to-accent-rig/0 group-hover:from-accent-rig/5 group-hover:to-transparent rounded-xl transition-all duration-500" />
                
                <div className="text-accent-blue mb-4">
                  {card.icon}
                </div>
                <h4 className="text-white font-medium mb-1">{card.name}</h4>
                <p className="text-xs text-zinc-500 font-mono">{card.tools}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
