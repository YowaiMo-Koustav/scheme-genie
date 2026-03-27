import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Verified Schemes", color: "text-primary" },
  { value: 36, suffix: "", label: "States & UTs", color: "text-neon" },
  { value: 10, suffix: "L+", label: "Citizens Helped", color: "text-violet" },
  { value: 95, suffix: "%", label: "Match Accuracy", color: "text-gold" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const duration = 2000;
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl tracking-tight">
      {count}{suffix}
    </div>
  );
}

const Stats = () => (
  <section className="py-28 sm:py-40 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />

    <div className="container px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <span className="text-primary font-mono text-sm uppercase tracking-[0.3em]">Impact</span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-foreground mt-5 tracking-tight">
          Numbers That Matter
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="text-center p-8 rounded-3xl glass-card border-glow"
          >
            <div className={stat.color}>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <p className="text-muted-foreground text-sm mt-3 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
