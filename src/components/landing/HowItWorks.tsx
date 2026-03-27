import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { UserCheck, Brain, ListChecks, ExternalLink } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    title: "Tell us about yourself",
    description: "Answer a few simple questions — age, state, income, occupation. Takes under 2 minutes.",
    accent: "bg-primary/10 text-primary border-primary/20",
  },
  {
    icon: Brain,
    title: "AI analyzes your profile",
    description: "Our engine matches your profile against 500+ central and state schemes in real-time.",
    accent: "bg-neon/10 text-neon border-neon/20",
  },
  {
    icon: ListChecks,
    title: "Get ranked results",
    description: "See schemes ranked by eligibility score with clear reasons why you qualify.",
    accent: "bg-violet/10 text-violet border-violet/20",
  },
  {
    icon: ExternalLink,
    title: "Apply with confidence",
    description: "Get required documents list, deadline alerts, and direct links to official portals.",
    accent: "bg-gold/10 text-gold border-gold/20",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0.15, 0.85], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="py-28 sm:py-40 relative overflow-hidden">
      <div className="container px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary font-mono text-sm uppercase tracking-[0.3em]">How It Works</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-foreground mt-5 tracking-tight">
            Four Steps to{" "}
            <span className="text-gradient-neon">Clarity</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Progress line */}
          <div className="absolute left-8 md:left-10 top-0 bottom-0 w-px bg-border">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-neon to-violet"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="flex gap-6 md:gap-8 group"
              >
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${step.accent} border flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                    <step.icon className="w-7 h-7 md:w-8 md:h-8" />
                  </div>
                </div>

                <div className="pt-2 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-muted-foreground font-mono text-xs">0{i + 1}</span>
                    <div className="w-8 h-px bg-border" />
                  </div>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-md">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
