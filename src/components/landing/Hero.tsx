import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-violet/8 blur-[100px] animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-neon/5 blur-[80px] animate-pulse-soft" style={{ animationDelay: "3s" }} />
      </motion.div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Content */}
      <motion.div style={{ opacity, scale }} className="relative z-10 container px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border-glow mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-foreground/80 tracking-wide">AI-Powered Scheme Intelligence</span>
        </motion.div>

        {/* Giant headline */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] leading-[0.9] tracking-tighter mb-8"
        >
          <span className="block text-foreground">FIND YOUR</span>
          <span className="block text-gradient-saffron mt-2">SCHEME</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-muted-foreground text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          India's smartest AI assistant that matches you with{" "}
          <span className="text-foreground font-medium">500+ government schemes</span> you're actually eligible for.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => navigate("/matcher")}
            className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 glow-saffron"
          >
            <span className="relative z-10 flex items-center gap-2">
              Find My Schemes
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-[hsl(35_100%_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => document.getElementById("problem-section")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 rounded-2xl font-medium text-lg text-muted-foreground hover:text-foreground glass border-glow transition-all hover:scale-105"
          >
            How it works
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground"
        >
          {[
            { icon: Shield, text: "100% Private" },
            { icon: Zap, text: "Instant Matching" },
            { icon: Sparkles, text: "AI-Powered" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm">
              <Icon className="w-4 h-4 text-primary/70" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
