import { motion } from "framer-motion";
import { UserCheck, Brain, ListChecks, ExternalLink } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    title: "Tell Us About Yourself",
    description: "Select your role, age, state, income, and other details. It takes less than 2 minutes.",
    color: "bg-saffron/10 text-saffron",
  },
  {
    icon: Brain,
    title: "AI Matches You",
    description: "Our intelligent engine scores 500+ schemes and ranks them by your eligibility and benefit amount.",
    color: "bg-sky/10 text-sky",
  },
  {
    icon: ListChecks,
    title: "Review Your Matches",
    description: "See why each scheme matched, what documents you need, deadlines, and confidence scores.",
    color: "bg-green-india/10 text-green-india",
  },
  {
    icon: ExternalLink,
    title: "Apply Directly",
    description: "Click through to the official portal. We link you directly to the government application page.",
    color: "bg-gold/10 text-gold",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 bg-background">
    <div className="container px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-saffron font-semibold text-sm uppercase tracking-wider">How It Works</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
          Four Steps to Your Benefits
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          No more searching through hundreds of websites. We bring the right schemes to you.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {i + 1}
            </div>
            <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-4`}>
              <step.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground text-lg mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
