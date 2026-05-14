import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

function CommonInfoTooltip({
  title,
  description,
  formula,
  position = "bottom-right",
}: {
  title: string;
  description: string;
  formula?: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    "top-right": "right-0 bottom-full mb-2",
    "top-left": "left-0 bottom-full mb-2",
    "bottom-right": "right-0 top-full mt-2",
    "bottom-left": "left-0 top-full mt-2",
  };

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="ml-2 w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center cursor-help hover:bg-accent/30 transition-colors shrink-0"
      >
        ?
      </button>

      <AnimatePresence>
        {isVisible && (
          <>
            <div
              className="fixed inset-0 z-40"
              style={{ pointerEvents: "none" }}
              onClick={() => setIsVisible(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className={`fixed z-50 w-80 p-4 bg-bg border border-border rounded-lg shadow-theme ${positionClasses[position]}`}
              style={{
                position: "fixed",
                pointerEvents: "auto",
              }}
              onMouseEnter={() => setIsVisible(true)}
              onMouseLeave={() => setIsVisible(false)}
            >
              <h4 className="font-semibold text-text-h mb-2 pr-4">{title}</h4>
              <p className="text-sm text-text mb-2">{description}</p>
              {formula && (
                <div className="mt-2 pt-2 border-t border-border">
                  <span className="text-xs font-medium text-accent">
                    Формула:
                  </span>
                  <code className="block text-xs mt-1 p-2 bg-code-bg rounded break-words">
                    {formula}
                  </code>
                </div>
              )}
              <div
                className="absolute w-2 h-2 bg-bg border border-border transform rotate-45"
                style={{
                  ...(position === "top-right" && {
                    bottom: "-5px",
                    right: "10px",
                    borderTop: "none",
                    borderLeft: "none",
                  }),
                  ...(position === "top-left" && {
                    bottom: "-5px",
                    left: "10px",
                    borderTop: "none",
                    borderRight: "none",
                  }),
                  ...(position === "bottom-right" && {
                    top: "-5px",
                    right: "10px",
                    borderBottom: "none",
                    borderLeft: "none",
                  }),
                  ...(position === "bottom-left" && {
                    top: "-5px",
                    left: "10px",
                    borderBottom: "none",
                    borderRight: "none",
                  }),
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export { CommonInfoTooltip };
