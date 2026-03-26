import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ROLES } from "@/data/schemes";
import { ArrowRight } from "lucide-react";

const RoleCards = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 sm:py-36 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-saffron/3 rounded-full blur-3xl" />

      <div className="container px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-saffron font-semibold text-sm uppercase tracking-[0.2em]">Who Are You?</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-4">
            Select Your Role to Begin
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl mx-auto text-lg">
            We tailor the discovery experience based on your profile. Every citizen deserves the right scheme.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {ROLES.map((role, i) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/matcher?role=${role.id}`)}
              className="relative glass rounded-2xl p-6 sm:p-7 text-left shadow-sm hover:shadow-xl transition-all group cursor-pointer overflow-hidden border border-border/40 hover:border-saffron/30"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-saffron/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <span className="text-4xl block mb-4">{role.icon}</span>
                <h3 className="font-bold text-foreground text-base mb-1.5">{role.label}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{role.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-saffron text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
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
