import { motion } from "motion/react";

export function NotFoundPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="w-32 h-32 md:w-40 md:h-40 mb-8 rounded-full bg-accent-bg border-2 border-accent-border flex items-center justify-center"
      >
        <svg
          className="w-16 h-16 md:w-20 md:h-20 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-7xl md:text-8xl font-bold font-heading text-text-h mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-text-h mb-4">
          Страница не найдена
        </h2>
      </motion.div>
    </motion.section>
  );
}
