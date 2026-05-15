import { motion } from "motion/react";
import { CommonInfoTooltip } from "../../shared/ui/info";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="text-center">
        <div className="mb-2">Загрузка данных...</div>
        <motion.div
          className="rounded-full h-8 w-8 mx-auto"
          style={{ borderBottom: "2px solid var(--accent)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

function ErrorMessage({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-500/10 border border-red-500/40 text-red-600 p-4 rounded-lg m-4"
    >
      <p>{error}</p>
      <button
        onClick={onRetry}
        className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md border-none cursor-pointer hover:bg-red-700 transition-colors"
      >
        Повторить
      </button>
    </motion.div>
  );
}

function MetricCard({
  gradient,
  label,
  value,
  unit,
  tooltipTitle,
  tooltipDescription,
  tooltipFormula,
  onClick,
}: {
  gradient: string;
  label: string;
  value: string | number;
  unit: string;
  tooltipTitle: string;
  tooltipDescription: string;
  tooltipFormula: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} rounded-lg shadow-theme p-6 text-white cursor-pointer`}
    >
      <div className="flex items-center">
        <div className="text-sm opacity-90">{label}</div>
        <CommonInfoTooltip
          title={tooltipTitle}
          description={tooltipDescription}
          formula={tooltipFormula}
        />
      </div>
      <div className="text-4xl font-bold mt-2">{value}</div>
      <div className="text-xs mt-2 opacity-75">{unit}</div>
    </motion.div>
  );
}

export { ErrorMessage, MetricCard, LoadingSpinner };
