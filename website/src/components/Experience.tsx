"use client";

import { motion } from "framer-motion";
import { Briefcase, Activity, CheckCircle2 } from "lucide-react";

const experience = [
  {
    role: "Cloud & DevOps Engineer",
    company: "Backerhaus Veit",
    date: "Oct 2024 - Present",
    points: [
      "Architected AWS infrastructure using Terraform.",
      "Built zero-touch CI/CD pipelines with Jenkins.",
      "Containerized legacy systems with Docker.",
    ],
  },
  {
    role: "Systems Engineer Intern",
    company: "Tech Startup",
    date: "2023 - 2024",
    points: [
      "Optimized backend API response times by 40%.",
      "Managed Linux server environments.",
    ],
  },
];

const services = [
  "AI Systems Integration",
  "Infrastructure as Code",
  "Zero-Touch Automation",
  "Full-Stack Architecture",
];

export function Experience() {
  return (
    <section className="relative py-32 border-t border-white/5 bg-background overflow-hidden">
      <div className="container px-6 md:px-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
        
        {/* Experience Timeline */}
        <div>
          <h2 className="text-sm font-mono tracking-widest text-zinc-500 mb-8 uppercase">
            // Trajectory
          </h2>
          <div className="relative border-l border-white/10 pl-8 ml-4 space-y-12">
            {experience.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[37px] top-1 w-3 h-3 bg-background border border-accent-rig rounded-full shadow-[0_0_10px_rgba(255,76,59,0.5)]" />
                
                <span className="text-xs font-mono text-accent-rig mb-2 block">{exp.date}</span>
                <h4 className="text-xl font-semibold text-white mb-1">{exp.role}</h4>
                <div className="text-sm text-zinc-400 mb-4 flex items-center gap-2">
                  <Briefcase size={14} />
                  <span>{exp.company}</span>
                </div>
                <ul className="space-y-2">
                  {exp.points.map((point, i) => (
                    <li key={i} className="text-sm text-zinc-500 font-light flex items-start gap-2">
                      <span className="text-accent-blue mt-1"><CheckCircle2 size={12} /></span>
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Services / Focus Areas */}
        <div>
          <h2 className="text-sm font-mono tracking-widest text-zinc-500 mb-8 uppercase">
            // Capabilities
          </h2>
          <div className="space-y-4">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative flex items-center gap-4 p-6 rounded-xl bg-panel border border-white/5 hover:border-white/20 transition-all cursor-default overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/0 to-accent-blue/0 group-hover:from-accent-blue/5 group-hover:to-transparent transition-all duration-500" />
                <Activity size={18} className="text-zinc-600 group-hover:text-accent-blue transition-colors" />
                <span className="text-lg font-medium text-zinc-300 group-hover:text-white transition-colors">
                  {service}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
