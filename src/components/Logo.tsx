import logoImg from "@/assets/logo.png";
import { motion } from "framer-motion";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <motion.div 
      className={`flex items-center gap-3 sm:gap-4 group cursor-pointer ${className}`}
      whileHover="hover"
      initial="initial"
      animate="animate"
    >
      <motion.img
        src={logoImg}
        alt="Green Spark Solar logo"
        className="h-14 w-14 sm:h-[4.5rem] sm:w-[4.5rem] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        variants={{
          initial: { rotate: -20, scale: 0.8, opacity: 0 },
          animate: { rotate: 0, scale: 1, opacity: 1, transition: { type: "spring", bounce: 0.5, duration: 0.8 } },
          hover: { rotate: 12, scale: 1.08, transition: { type: "spring", stiffness: 400, damping: 10 } }
        }}
      />
      <motion.div 
        className="font-display text-2xl sm:text-[2rem] font-black tracking-tighter leading-none uppercase"
        variants={{
          initial: { x: -15, opacity: 0 },
          animate: { x: 0, opacity: 1, transition: { delay: 0.1, type: "spring", stiffness: 100 } }
        }}
      >
        <span className="text-[#22c55e] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]">GREEN SPARK</span>
        <br className="sm:hidden" />
        <span className="hidden sm:inline">{" "}</span>
        <span className="text-[#3b82f6] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]">SOLAR</span>
      </motion.div>
    </motion.div>
  );
}
