import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { X, Check, Search, FileText, Clock, HelpCircle, Sparkles, Target, Zap, ArrowRight } from "lucide-react";

const problems = [
  { icon: Search, text: "Searching through 100+ government websites" },
  { icon: FileText, text: "Complex eligibility criteria nobody explains" },
  { icon: Clock, text: "Missing deadlines you didn't know existed" },
  { icon: HelpCircle, text: "No idea which schemes apply to you" },
];

const solutions = [
  { icon: Target, text: "One intelligent questionnaire, personalized results" },
  { icon: Sparkles, text: "AI explains exactly why you qualify" },
  { icon: Zap, text: "Instant matching across 500+ schemes" },
  { icon: ArrowRight, text: "Direct links to official application portals" },
];

const ProblemSolution = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "100%"]);

  return (
    <section id="problem-section" ref={ref} className="py-28 sm:py-40 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[150px]" />

      <div className="container px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary font-mono text-sm uppercase tracking-[0.3em]">The Problem We Solve</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-foreground mt-5 leading-[1.1] tracking-tight">
            Government schemes exist.
            <br />
            <span className="text-muted-foreground">Finding them shouldn't be hard.</span>
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="absolute inset-0 bg-border" />
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-destructive to-primary"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Problems */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-semibold mb-2 border border-destructive/20"
            >
              <X className="w-4 h-4" />
              Without SchemeMatch
            </motion.div>
            {problems.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex items-start gap-4 p-5 rounded-2xl glass-card border-glow group hover:border-destructive/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                  <p.icon className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-foreground/70 text-sm sm:text-base leading-relaxed pt-1.5">{p.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-india/10 text-green-india text-sm font-semibold mb-2 border border-green-india/20"
            >
              <Check className="w-4 h-4" />
              With SchemeMatch AI
            </motion.div>
            {solutions.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
                className="flex items-start gap-4 p-5 rounded-2xl glass-card border-glow group hover:border-green-india/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-green-india/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5 text-green-india" />
                </div>
                <p className="text-foreground/70 text-sm sm:text-base leading-relaxed pt-1.5">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
