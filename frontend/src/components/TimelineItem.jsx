import { motion } from "framer-motion";
import { Clock, DollarSign } from "lucide-react";

const TimelineItem = ({ activity, index }) => {
  const typeColors = {
    transport:     "bg-blue-500/20   text-blue-400   border-blue-500/30",
    stay:          "bg-purple-500/20 text-purple-400 border-purple-500/30",
    meals:         "bg-amber-500/20  text-amber-400  border-amber-500/30",
    activities:    "bg-green-500/20  text-green-400  border-green-500/30",
    miscellaneous: "bg-gray-500/20   text-gray-400   border-gray-500/30",
  };

  const typeEmoji = {
    transport: "✈️", stay: "🏨", meals: "🍽️",
    activities: "🎯", miscellaneous: "📌",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex gap-4"
    >
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full glass flex items-center justify-center text-lg flex-shrink-0">
          {typeEmoji[activity.type] || "📌"}
        </div>
        <div className="w-px flex-1 bg-white/10 mt-2" />
      </div>

      <div className={`glass border rounded-xl p-4 flex-1 mb-3 ${typeColors[activity.type] || typeColors.miscellaneous}`}>
        <div className="flex items-start justify-between mb-1">
          <h4 className="text-white font-semibold text-sm">{activity.name}</h4>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[activity.type]}`}>
            {activity.type}
          </span>
        </div>

        <div className="flex gap-4 text-xs text-white/50 mt-2">
          {activity.start_time && (
            <span className="flex items-center gap-1">
              <Clock size={11} /> {activity.start_time}
            </span>
          )}
          {activity.duration && (
            <span className="flex items-center gap-1">⏱ {activity.duration}</span>
          )}
          {activity.cost > 0 && (
            <span className="flex items-center gap-1">
              <DollarSign size={11} /> ₹{Number(activity.cost).toLocaleString()}
            </span>
          )}
        </div>

        {activity.notes && (
          <p className="text-white/40 text-xs mt-2">{activity.notes}</p>
        )}
      </div>
    </motion.div>
  );
};

export default TimelineItem;