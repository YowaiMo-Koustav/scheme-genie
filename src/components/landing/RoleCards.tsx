import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ROLES } from "@/data/schemes";
import { ArrowRight } from "lucide-react";

const accentColors = [
  "group-hover:border-primary/40 group-hover:shadow-[0_0_30px_-10px_hsl(24_100%_55%_/_0.3)]",
  "group-hover:border-neon/40 group-hover:shadow-[0_0_30px_-10px_hsl(160_100%_50%_/_0.3)]",
  "group-hover:border-violet/40 group-hover:shadow-[0_0_30px_-10px_hsl(270_80%_65%_/_0.3)]",
  "group-hover:border-gold/40 group-hover:shadow-[0_0_30px_-10px_hsl(45_95%_55%_/_0.3)]",
  "group-hover:border-sky/40 group-hover:shadow-[0_0_30px_-10px_hsl(200_90%_55%_/_0.3)]",
  "group-hover:border-green-india/40 group-hover:shadow-[0_0_30px_-10px_hsl(160_70%_45%_/_0.3)]",
  "group-hover:border-primary/40 group-hover:shadow-[0_0_30px_-10px_hsl(24_100%_55%_/_0.3)]",
  "group-hover:border-violet/40 group-hover:shadow-[0_0_30px_-10px_hsl(270_80%_65%_/_0.3)]",
];

const RoleCards = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 sm:py-40 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet/3 rounded-full blur-[120px]" />

      <div className="container px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm uppercase tracking-[0.3em]">Who Are You?</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-foreground mt-5 tracking-tight">
            Select Your Role
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl mx-auto text-lg">
            We tailor the discovery experience based on your profile.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto">
          {ROLES.map((role, i) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/matcher?role=${role.id}`)}
              className={`group relative glass-card border-glow rounded-2xl p-6 sm:p-7 text-left cursor-pointer overflow-hidden transition-all duration-500 ${accentColors[i % accentColors.length]}`}
            >
              <div className="relative z-10">
                <span className="text-4xl block mb-4">{role.icon}</span>
                <h3 className="font-display font-bold text-foreground text-base mb-1.5">{role.label}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{role.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span>Get started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleCards;
