import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TimeFilterProps {
  onFilterChange: (filter: { from: Date | null; to: Date | null }) => void;
  isLoading: boolean;
  currentFilter: { from: Date | null; to: Date | null };
}

export function CommonFilterDate({
  isLoading,
  onFilterChange,
  currentFilter,
}: TimeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("all");
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");

  const presets = [
    { id: "all", label: "📊 За весь период", days: null },
    { id: "today", label: "📅 Сегодня", days: 1 },
    { id: "week", label: "📆 За неделю", days: 7 },
    { id: "month", label: "🗓️ За месяц", days: 30 },
    { id: "quarter", label: "📈 За квартал", days: 90 },
    { id: "year", label: "🎯 За год", days: 365 },
  ];

  const getPeriodText = () => {
    if (!currentFilter.from && !currentFilter.to) return "За весь период";
    if (currentFilter.from && currentFilter.to) {
      return `${currentFilter.from.toLocaleDateString()} - ${currentFilter.to.toLocaleDateString()}`;
    }
    return "Выбран период";
  };

  const applyFilter = (
    presetId: string,
    fromDate?: Date | null,
    toDate?: Date | null,
  ) => {
    let from: Date | null = null;
    let to: Date | null = null;

    if (presetId !== "custom") {
      const preset = presets.find((p) => p.id === presetId);
      if (preset && preset.days !== null) {
        to = new Date();
        from = new Date();
        from.setDate(from.getDate() - preset.days);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
      }
    } else if (fromDate && toDate) {
      from = fromDate;
      to = toDate;
    }

    onFilterChange({ from, to });
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    if (customFrom && customTo) {
      const fromDate = new Date(customFrom);
      const toDate = new Date(customTo);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);
      applyFilter("custom", fromDate, toDate);
      setSelectedPreset("custom");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-accent-bg border border-accent-border rounded-lg text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
      >
        <span>📅</span>
        <span>{getPeriodText()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-72 bg-bg border border-border rounded-lg shadow-theme z-30"
          >
            <div className="p-3">
              <div className="space-y-1">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset.id);
                      applyFilter(preset.id);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedPreset === preset.id
                        ? "bg-accent text-white"
                        : "hover:bg-accent-bg text-text"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-sm font-medium text-text-h mb-2">
                  Свой период
                </div>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-full px-3 py-2 bg-code-bg border border-border rounded-md text-text focus:outline-none focus:border-accent"
                    placeholder="с"
                  />
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-full px-3 py-2 bg-code-bg border border-border rounded-md text-text focus:outline-none focus:border-accent"
                    placeholder="по"
                  />
                  <button
                    onClick={handleCustomApply}
                    disabled={!customFrom || !customTo}
                    className="w-full px-3 py-2 bg-accent text-white rounded-md hover:opacity-80 transition-colors disabled:opacity-50"
                  >
                    Применить
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
