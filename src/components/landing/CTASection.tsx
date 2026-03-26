import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 sm:py-36 bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center hero-gradient rounded-3xl p-12 sm:p-20 relative overflow-hidden"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
                Ready to Discover<br />Your Scheme?
              </h2>
              <p className="text-primary-foreground/60 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                Join lakhs of citizens who discovered benefits they didn't know existed.
                It's free, fast, and completely private.
              </p>
              <button
                onClick={() => navigate("/matcher")}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-saffron text-saffron-foreground rounded-2xl font-bold text-lg shadow-[0_0_40px_-10px_hsl(var(--saffron)/0.5)] hover:shadow-[0_0_60px_-10px_hsl(var(--saffron)/0.6)] transition-all duration-300 hover:scale-105 active:scale-[0.98]"
              >
                Start Now — It's Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex items-center justify-center gap-2 text-primary-foreground/40 text-sm"
            >
              <Shield className="w-4 h-4" />
              <span>Your data stays private. We never store personal information.</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
