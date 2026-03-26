import { motion, useScroll, useTransform } from "framer-motion";
import { UserCheck, Brain, ListChecks, ExternalLink } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    icon: UserCheck,
    title: "Tell Us About Yourself",
    description: "Select your role, age, state, income, and a few other details. Takes under 2 minutes.",
    color: "bg-saffron/10 text-saffron",
    accent: "border-saffron/20",
  },
  {
    icon: Brain,
    title: "AI Matches You",
    description: "Our scoring engine evaluates 500+ schemes and ranks them by your eligibility and benefit amount.",
    color: "bg-sky/10 text-sky",
    accent: "border-sky/20",
  },
  {
    icon: ListChecks,
    title: "Review Your Results",
    description: "See match scores, required documents, deadlines, benefit amounts, and why each scheme fits you.",
    color: "bg-green-india/10 text-green-india",
    accent: "border-green-india/20",
  },
  {
    icon: ExternalLink,
    title: "Apply on Official Portals",
    description: "Click through directly to government application pages. We never handle your data — you stay in control.",
    color: "bg-gold/10 text-gold",
    accent: "border-gold/20",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const progressHeight = useTransform(scrollYProgress, [0.15, 0.85], ["0%", "100%"]);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-28 sm:py-36 bg-secondary/30 relative overflow-hidden">
      {/* BG accent */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky/5 rounded-full blur-3xl translate-y-1/2" />

      <div className="container px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-saffron font-semibold text-sm uppercase tracking-[0.2em]">How It Works</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-4">
            Four Steps to Your Benefits
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl mx-auto text-lg">
            No more searching through hundreds of websites. We bring the right schemes to you.
          </p>
        </motion.div>

        {/* Timeline layout */}
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical progress line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-border">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-saffron via-sky to-green-india"
              style={{ height: progressHeight }}
            />
          </div>

          <div className="space-y-12 sm:space-y-16">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative pl-16 sm:pl-24 group"
              >
                {/* Step number circle */}
                <div className="absolute left-0 top-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-card border-2 border-border flex items-center justify-center z-10 group-hover:border-saffron/40 transition-colors shadow-sm">
                  <span className="text-lg sm:text-xl font-bold text-foreground">{i + 1}</span>
                </div>

                {/* Card */}
                <div className={`p-6 sm:p-8 rounded-2xl bg-card border ${step.accent} shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1`}>
                  <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-4`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground text-xl mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
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
