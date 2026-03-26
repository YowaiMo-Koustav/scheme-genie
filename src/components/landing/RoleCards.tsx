import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ROLES } from "@/data/schemes";
import { ArrowRight } from "lucide-react";

const RoleCards = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-saffron font-semibold text-sm uppercase tracking-wider">Who Are You?</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Select Your Role to Begin
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            We tailor the scheme discovery experience based on your profile.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {ROLES.map((role, i) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/matcher?role=${role.id}`)}
              className="glass rounded-2xl p-5 text-center shadow-sm hover:shadow-lg transition-all group cursor-pointer"
            >
              <span className="text-3xl block mb-3">{role.icon}</span>
              <h3 className="font-semibold text-foreground text-sm mb-1">{role.label}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{role.description}</p>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 mx-auto text-saffron" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleCards;
