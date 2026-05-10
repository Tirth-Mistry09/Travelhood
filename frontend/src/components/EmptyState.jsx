import { motion } from "framer-motion";

const EmptyState = ({ icon = "✈️", title, subtitle, action }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="text-6xl mb-4 float-anim">{icon}</div>
    <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
    <p className="text-white/40 text-sm mb-6 max-w-xs">{subtitle}</p>
    {action}
  </motion.div>
);

export default EmptyState;