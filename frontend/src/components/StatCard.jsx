import { motion } from "framer-motion";

const StatCard = ({ icon, label, value, color = "blue", delay = 0 }) => {
  const colors = {
    blue:   "from-blue-500/20 to-blue-600/10   border-blue-500/20   text-blue-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400",
    green:  "from-green-500/20 to-green-600/10  border-green-500/20  text-green-400",
    amber:  "from-amber-500/20 to-amber-600/10  border-amber-500/20  text-amber-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5 card-hover`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-white/50 text-xs mb-1">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </motion.div>
  );
};

export default StatCard;