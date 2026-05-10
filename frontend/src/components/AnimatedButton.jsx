import { motion } from "framer-motion";

const AnimatedButton = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}) => {
  const base =
    "px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50";

  const variants = {
    primary:   "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90",
    secondary: "glass text-white hover:bg-white/10 border border-white/10",
    danger:    "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30",
    success:   "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;