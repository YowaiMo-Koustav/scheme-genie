import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Verified Government Schemes", color: "text-saffron" },
  { value: 36, suffix: "", label: "States & UTs Covered", color: "text-sky" },
  { value: 50, suffix: "L+", label: "Citizens Helped", color: "text-green-india" },
  { value: 98, suffix: "%", label: "Match Accuracy", color: "text-gold" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          tick();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tabular-nums">
      {count}{suffix}
    </div>
  );
}

const Stats = () => (
  <section className="py-24 sm:py-32 bg-background relative">
    <div className="container px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-saffron font-semibold text-sm uppercase tracking-[0.2em]">Impact</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4">
          Trusted by Citizens Across India
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 max-w-5xl mx-auto">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="text-center group"
          >
            <div className={`${stat.color} mb-3`}>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base font-medium leading-snug">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
