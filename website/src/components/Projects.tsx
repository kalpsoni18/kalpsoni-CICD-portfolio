"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "AWS Multi-Region Infrastructure",
    category: "SYSTEMS",
    description: "Designed a fault-tolerant multi-region architecture using Terraform. Automated deployments with zero-downtime redundancy.",
    stack: ["Terraform", "AWS ECS", "Route53", "RDS"],
    metrics: "99.99% Uptime",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "AI Knowledge Agent",
    category: "ARTIFICIAL INTELLIGENCE",
    description: "Built a retrieval-augmented generation (RAG) system for proprietary data.",
    stack: ["Python", "LangChain", "VectorDB"],
    metrics: "< 2s Latency",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Zero-Touch CI/CD Workflow",
    category: "AUTOMATION",
    description: "Orchestrated end-to-end pipeline automation.",
    stack: ["Jenkins", "GitHub Actions", "Docker"],
    metrics: "70% Faster Deploys",
    span: "md:col-span-1 md:row-span-1",
  },
];

export function Projects() {
  return (
    <section className="relative py-32 border-t border-white/5 bg-panel">
      <div className="container px-6 md:px-12 max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-sm font-mono tracking-widest text-zinc-500 mb-4 uppercase">
            // Featured Work
          </h2>
          <h3 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">
            Engineering at scale.
          </h3>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 0.99 }}
              className={`group relative overflow-hidden rounded-2xl bg-background border border-white/5 p-8 flex flex-col justify-between ${project.span}`}
            >
              {/* Subtle Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-accent-rig tracking-wider">
                    {project.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight size={14} className="text-white" />
                  </div>
                </div>
                <h4 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                  {project.title}
                </h4>
                <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-md">
                  {project.description}
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mt-8">
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech, i) => (
                    <span key={i} className="px-2 py-1 text-[10px] uppercase tracking-widest font-mono text-zinc-500 border border-white/10 rounded-sm bg-white/5">
                      {tech}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-mono text-white/60">
                  {project.metrics}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
