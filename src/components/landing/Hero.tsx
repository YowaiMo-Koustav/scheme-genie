import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[110vh] flex items-center justify-center overflow-hidden hero-gradient">
      {/* Parallax background shapes */}
      <motion.div className="absolute inset-0 overflow-hidden" style={{ y }}>
        <div className="absolute top-20 left-10 w-72 h-72 bg-saffron/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-saffron/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-40 right-1/4 w-48 h-48 bg-green-india/8 rounded-full blur-2xl animate-float" />
      </motion.div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Floating scheme cards (decorative) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        {[
          { label: "PM-KISAN", amount: "₹6,000/yr", top: "15%", left: "5%", delay: 0 },
          { label: "Ayushman Bharat", amount: "₹5L Cover", top: "25%", right: "8%", delay: 1.5 },
          { label: "MUDRA Loan", amount: "₹10L Loan", bottom: "30%", left: "8%", delay: 3 },
          { label: "Scholarship", amount: "Full Tuition", bottom: "25%", right: "5%", delay: 2 },
        ].map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 + card.delay * 0.3, duration: 0.8 }}
            className="absolute glass-dark rounded-xl px-4 py-3 text-primary-foreground/70"
            style={{ top: card.top, left: card.left, right: card.right, bottom: card.bottom }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: card.delay }}
            >
              <p className="text-xs font-medium text-saffron">{card.label}</p>
              <p className="text-sm font-bold text-primary-foreground/90">{card.amount}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div className="container relative z-10 px-4 py-20" style={{ opacity }}>
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-dark mb-10"
          >
            <Sparkles className="w-4 h-4 text-saffron" />
            <span className="text-sm font-medium text-primary-foreground/90">
              AI-Powered Government Scheme Discovery
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl sm:text-6xl md:text-8xl font-bold text-primary-foreground leading-[0.95] mb-8 tracking-tight"
          >
            Find the Right
            <br />
            <span className="text-gradient-saffron">Government Scheme</span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-6xl font-medium text-primary-foreground/70">
              in Seconds, Not Hours
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-lg sm:text-xl md:text-2xl text-primary-foreground/60 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Answer a few questions. Our AI matches you with{" "}
            <span className="text-primary-foreground/90 font-medium">scholarships, loans, subsidies, insurance</span>{" "}
            — everything you're eligible for.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate("/matcher")}
              className="group flex items-center gap-3 px-10 py-5 bg-saffron text-saffron-foreground rounded-2xl font-bold text-lg shadow-[0_0_40px_-10px_hsl(var(--saffron)/0.5)] hover:shadow-[0_0_60px_-10px_hsl(var(--saffron)/0.6)] transition-all duration-300 hover:scale-105 active:scale-[0.98]"
            >
              Find My Schemes
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
            </button>
            <button
              onClick={() => document.getElementById("problem-section")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 px-8 py-5 glass-dark rounded-2xl font-medium text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:bg-white/10"
            >
              See How It Works
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-20 flex flex-wrap justify-center gap-8 sm:gap-12"
          >
            {[
              { icon: Shield, label: "500+ Verified Schemes" },
              { icon: Zap, label: "Instant AI Matching" },
              { icon: Sparkles, label: "100% Free to Use" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 text-primary-foreground/40 text-sm">
                <item.icon className="w-4 h-4 text-saffron/60" />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-6 h-6 text-primary-foreground/30" />
        </motion.div>
      </motion.div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z"
            fill="hsl(220, 20%, 97%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
