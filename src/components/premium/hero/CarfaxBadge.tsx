
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export function CarfaxBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-100"
    >
      <Shield className="h-4 w-4 mr-1.5" />
      CARFAX® Reports Included
    </motion.div>
  );
}
