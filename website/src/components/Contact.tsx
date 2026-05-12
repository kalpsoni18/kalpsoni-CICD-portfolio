"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

export function Contact() {
  return (
    <section className="relative py-32 border-t border-white/5 bg-panel overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-rig/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container px-6 md:px-12 max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono tracking-widest text-accent-rig mb-8 uppercase">
            // Establish Connection
          </h2>
          <h3 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-12">
            Let&apos;s build something intelligent, scalable, and unforgettable.
          </h3>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto space-y-4 mb-16 text-left"
        >
          <div className="relative group">
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all focus:border-accent-rig focus:ring-1 focus:ring-accent-rig/50"
            />
          </div>
          <div className="relative group">
            <textarea
              placeholder="What are we building?"
              rows={4}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all focus:border-accent-rig focus:ring-1 focus:ring-accent-rig/50 resize-none"
            />
          </div>
          <button className="w-full group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-white px-8 font-medium text-black transition-all hover:scale-[1.02] active:scale-[0.98]">
            <span className="mr-2">Send Message</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.form>

        {/* Minimal Footer / Socials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-6 pt-16 border-t border-white/10"
        >
          <div className="flex gap-6">
            <a href="https://github.com/kalpsoni18" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path></svg>
            </a>
            <a href="https://linkedin.com/in/kalp-soni" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="mailto:kalp.soni2004@gmail.com" className="text-zinc-500 hover:text-white transition-colors">
              <Mail size={20} />
            </a>
          </div>
          <p className="text-xs font-mono text-zinc-600">
            &copy; {new Date().getFullYear()} KALP SONI. ENGINEERED IN NEXT.JS.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
