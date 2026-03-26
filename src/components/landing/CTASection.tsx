import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center hero-gradient rounded-3xl p-12 sm:p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Find Your Scheme?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
              Join lakhs of citizens who discovered benefits they didn't know existed. It's free, fast, and private.
            </p>
            <button
              onClick={() => navigate("/matcher")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-saffron text-saffron-foreground rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Start Now — It's Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
