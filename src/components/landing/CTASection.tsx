import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 sm:py-40 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="container px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-foreground tracking-tight leading-[1.1]">
            Ready to discover your
            <br />
            <span className="text-gradient-saffron">eligible schemes?</span>
          </h2>

          <p className="text-muted-foreground text-lg mt-6 mb-10 max-w-lg mx-auto">
            Takes 2 minutes. No signup required. Your data stays private.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/matcher")}
            className="group relative px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-lg overflow-hidden glow-saffron"
          >
            <span className="relative z-10 flex items-center gap-3">
              Start Now — It's Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-[hsl(35_100%_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Shield className="w-4 h-4 text-green-india" />
            <span>Your data stays private. We never store personal information.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
