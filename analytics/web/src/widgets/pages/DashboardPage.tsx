import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DefaultApi, ToiletResDto } from "../../features/lib";
import { apiConfig } from "../../config/api";

function InfoTooltip({
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

function TimeFilter({
  onFilterChange,
  isLoading,
}: {
  onFilterChange: (filter: { from: Date | null; to: Date | null }) => void;
  isLoading: boolean;
}) {
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
        <span>
          {presets.find((p) => p.id === selectedPreset)?.label ||
            "Выбрать период"}
        </span>
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

export function DashboardPage() {
  const [toilets, setToilets] = useState<ToiletResDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  const totalToiletsRef = useRef<HTMLDivElement>(null);
  const smellRatingRef = useRef<HTMLDivElement>(null);
  const purityRatingRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);
  const topRatedRef = useRef<HTMLDivElement>(null);
  const worstRatedRef = useRef<HTMLDivElement>(null);
  const fullListRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState({
    totalToilets: 0,
    totalRatings: 0,
    averageSmellRating: 0,
    averagePurityRating: 0,
    toiletsWithPaper: 0,
    toiletsWithSoap: 0,
    topRatedToilets: [] as ToiletResDto[],
    worstRatedToilets: [] as ToiletResDto[],
    averageRating: 0,
    satisfactionRate: 0,
    mostActiveToilet: { id: 0, name: "", ratingCount: 0 },
    paperAvailabilityPercent: 0,
    soapAvailabilityPercent: 0,
  });

  const api = new DefaultApi(apiConfig);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const filterRatingsByDate = useCallback(
    (ratings: any[]) => {
      if (!timeFilter.from && !timeFilter.to) return ratings;

      return ratings.filter((rating) => {
        const ratingDate = new Date(rating.createdAt);

        if (timeFilter.from && ratingDate < timeFilter.from) return false;
        if (timeFilter.to && ratingDate > timeFilter.to) return false;

        return true;
      });
    },
    [timeFilter.from, timeFilter.to],
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const toiletsData = await api.toiletsControllerGetAllToilets();

      const filteredToilets = toiletsData.map((toilet) => ({
        ...toilet,
        ratings: filterRatingsByDate(toilet.ratings || []),
      }));

      setToilets(filteredToilets);

      const allRatings = filteredToilets.flatMap(
        (toilet) => toilet.ratings || [],
      );

      const totalToilets = filteredToilets.length;
      const totalRatings = allRatings.length;

      const totalSmell = allRatings.reduce((sum, r) => sum + r.smellRating, 0);
      const totalPurity = allRatings.reduce(
        (sum, r) => sum + r.purityRating,
        0,
      );
      const avgSmell = totalRatings > 0 ? totalSmell / totalRatings : 0;
      const avgPurity = totalRatings > 0 ? totalPurity / totalRatings : 0;
      const avgRating = (avgSmell + avgPurity) / 2;

      const paperCount = allRatings.filter((r) => r.hasToiletPaper).length;
      const soapCount = allRatings.filter((r) => r.hasSoap).length;

      const paperAvailabilityPercent =
        totalRatings > 0 ? (paperCount / totalRatings) * 100 : 0;
      const soapAvailabilityPercent =
        totalRatings > 0 ? (soapCount / totalRatings) * 100 : 0;
      const satisfactionRate = (avgRating / 5) * 100;

      const toiletRatings = filteredToilets.map((toilet) => {
        const toiletRatingsList = toilet.ratings || [];

        const avgRatingValue =
          toiletRatingsList.length > 0
            ? toiletRatingsList.reduce(
                (sum, r) => sum + (r.smellRating + r.purityRating) / 2,
                0,
              ) / toiletRatingsList.length
            : 0;

        return {
          toilet,
          avgRating: avgRatingValue,
          ratingCount: toiletRatingsList.length,
        };
      });

      const topRated = [...toiletRatings]
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 5)
        .map((item) => item.toilet);

      const worstRated = [...toiletRatings]
        .sort((a, b) => a.avgRating - b.avgRating)
        .filter((item) => item.ratingCount > 0)
        .slice(0, 5)
        .map((item) => item.toilet);

      const mostActiveToiletData = [...toiletRatings]
        .sort((a, b) => b.ratingCount - a.ratingCount)
        .slice(0, 1)[0];

      setStats({
        totalToilets,
        totalRatings,
        averageSmellRating: Math.round(avgSmell * 10) / 10,
        averagePurityRating: Math.round(avgPurity * 10) / 10,
        toiletsWithPaper: paperCount,
        toiletsWithSoap: soapCount,
        topRatedToilets: topRated,
        worstRatedToilets: worstRated,
        averageRating: Math.round(avgRating * 10) / 10,
        satisfactionRate: Math.round(satisfactionRate),
        mostActiveToilet: {
          id: mostActiveToiletData?.toilet?.id || 0,
          name: mostActiveToiletData?.toilet?.name || "Нет данных",
          ratingCount: mostActiveToiletData?.ratingCount || 0,
        },
        paperAvailabilityPercent: Math.round(paperAvailabilityPercent),
        soapAvailabilityPercent: Math.round(soapAvailabilityPercent),
      });
    } catch (err) {
      setError("Ошибка при загрузке данных");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [api, filterRatingsByDate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  if (loading) {
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

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-500/10 border border-red-500/40 text-red-600 p-4 rounded-lg m-4"
      >
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md border-none cursor-pointer hover:bg-red-700 transition-colors"
        >
          Повторить
        </button>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getPeriodText = () => {
    if (!timeFilter.from && !timeFilter.to) return "За весь период";
    if (timeFilter.from && timeFilter.to) {
      return `${timeFilter.from.toLocaleDateString()} - ${timeFilter.to.toLocaleDateString()}`;
    }
    return "Выбран период";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-bg min-h-screen"
    >
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-0"
        >
          📊 Статистика туалетов
        </motion.h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-text">{getPeriodText()}</span>
          <TimeFilter onFilterChange={setTimeFilter} isLoading={loading} />
        </div>
      </div>

      <div ref={totalToiletsRef}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-8"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            onClick={() => scrollToSection(fullListRef)}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-theme p-6 text-white cursor-pointer"
          >
            <div className="flex items-center">
              <div className="text-sm opacity-90">Всего туалетов</div>
              <InfoTooltip
                title="Всего туалетов"
                description="Общее количество туалетов, зарегистрированных в системе"
                formula="COUNT(DISTINCT toilets.id)"
              />
            </div>
            <div className="text-4xl font-bold mt-2">{stats.totalToilets}</div>
            <div className="text-xs mt-2 opacity-75">в системе</div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            onClick={() => scrollToSection(amenitiesRef)}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-theme p-6 text-white cursor-pointer"
          >
            <div className="flex items-center">
              <div className="text-sm opacity-90">Всего отзывов</div>
              <InfoTooltip
                title="Всего отзывов"
                description="Общее количество оставленных пользователями отзывов"
                formula="SUM(ratings.count)"
              />
            </div>
            <div className="text-4xl font-bold mt-2">{stats.totalRatings}</div>
            <div className="text-xs mt-2 opacity-75">
              оставлено пользователями
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            onClick={() => scrollToSection(smellRatingRef)}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-theme p-6 text-white cursor-pointer"
          >
            <div className="flex items-center">
              <div className="text-sm opacity-90">Средний рейтинг</div>
              <InfoTooltip
                title="Средний рейтинг"
                description="Средняя оценка всех туалетов по всем критериям"
                formula="(AVG(smell_rating) + AVG(purity_rating)) / 2"
              />
            </div>
            <div className="text-4xl font-bold mt-2">{stats.averageRating}</div>
            <div className="text-xs mt-2 opacity-75">из 5.0</div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            onClick={() => scrollToSection(topRatedRef)}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-theme p-6 text-white cursor-pointer"
          >
            <div className="flex items-center">
              <div className="text-sm opacity-90">Удовлетворенность</div>
              <InfoTooltip
                title="Удовлетворенность"
                description="Процент пользователей, удовлетворенных состоянием туалетов"
                formula="(average_rating / 5) * 100%"
              />
            </div>
            <div className="text-4xl font-bold mt-2">
              {stats.satisfactionRate}%
            </div>
            <div className="text-xs mt-2 opacity-75">общая оценка</div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        ref={smellRatingRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8"
      >
        <motion.div
          ref={purityRatingRef}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-bg rounded-lg shadow-theme p-6 border border-border"
        >
          <div className="flex items-center">
            <h2 className="flex items-center mb-4">
              <span className="mr-2">👃</span> Оценка запаха
            </h2>
            <InfoTooltip
              title="Оценка запаха"
              description="Средняя оценка запаха по всем отзывам"
              formula="AVG(smell_rating)"
              position="top-right"
            />
          </div>
          <div className="text-3xl font-bold text-accent mb-2">
            {stats.averageSmellRating}
          </div>
          <div className="w-full bg-border rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stats.averageSmellRating / 5) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-accent rounded-full h-3"
            />
          </div>
          <div className="text-sm text-text mt-2">из 5.0</div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-bg rounded-lg shadow-theme p-6 border border-border"
        >
          <div className="flex items-center">
            <h2 className="flex items-center mb-4">
              <span className="mr-2">✨</span> Оценка чистоты
            </h2>
            <InfoTooltip
              title="Оценка чистоты"
              description="Средняя оценка чистоты по всем отзывам"
              formula="AVG(purity_rating)"
              position="top-right"
            />
          </div>
          <div className="text-3xl font-bold text-accent mb-2">
            {stats.averagePurityRating}
          </div>
          <div className="w-full bg-border rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stats.averagePurityRating / 5) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-accent rounded-full h-3"
            />
          </div>
          <div className="text-sm text-text mt-2">из 5.0</div>
        </motion.div>
      </motion.div>

      <motion.div
        ref={amenitiesRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-bg rounded-lg shadow-theme p-6 border border-border"
        >
          <div className="flex items-center">
            <h2 className="flex items-center mb-4">
              <span className="mr-2">🧻</span> Наличие удобств
            </h2>
            <InfoTooltip
              title="Наличие удобств"
              description="Процент отзывов, в которых отмечено наличие туалетной бумаги и мыла"
              formula="(COUNT(has_toilet_paper = true) / total_ratings) * 100%"
              position="top-right"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Туалетная бумага</span>
                <span className="text-sm">
                  {stats.toiletsWithPaper} / {stats.totalRatings} (
                  {stats.paperAvailabilityPercent}%)
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.paperAvailabilityPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-green-500 rounded-full h-3"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Мыло</span>
                <span className="text-sm">
                  {stats.toiletsWithSoap} / {stats.totalRatings} (
                  {stats.soapAvailabilityPercent}%)
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.soapAvailabilityPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-blue-500 rounded-full h-3"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-bg rounded-lg shadow-theme p-6 border border-border"
        >
          <div className="flex items-center">
            <h2 className="flex items-center mb-4">
              <span className="mr-2">🏆</span> Самый активный туалет
            </h2>
            <InfoTooltip
              title="Самый активный туалет"
              description="Туалет с наибольшим количеством оставленных отзывов"
              formula="MAX(COUNT(ratings))"
              position="top-right"
            />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-2">
              {stats.mostActiveToilet.name}
            </div>
            <div className="text-text">
              Количество отзывов: {stats.mostActiveToilet.ratingCount}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        ref={topRatedRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6 mb-8"
      >
        <motion.div
          variants={itemVariants}
          className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-yellow-500/10 to-transparent">
            <div className="flex items-center">
              <h2 className="flex items-center">
                <span className="mr-2">⭐</span> Топ-5 туалетов по рейтингу
              </h2>
              <InfoTooltip
                title="Топ-5 туалетов"
                description="Туалеты с наивысшим средним рейтингом"
                formula="AVG((smell_rating + purity_rating) / 2)"
                position="top-right"
              />
            </div>
          </div>
          <div className="flex flex-col">
            {stats.topRatedToilets.length > 0 ? (
              stats.topRatedToilets.map((toilet, index) => (
                <motion.div
                  key={toilet.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "var(--accent-bg)" }}
                  className="p-4 border-b border-border cursor-pointer transition-colors"
                  onClick={() => scrollToSection(fullListRef)}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-text-h">
                          {toilet.name}
                        </div>
                        <div className="text-sm text-text">
                          {toilet.ratings?.length || 0} отзывов
                        </div>
                      </div>
                    </div>
                    <div className="text-yellow-500 font-bold">
                      ⭐{" "}
                      {toilet.ratings && toilet.ratings.length > 0
                        ? (
                            toilet.ratings.reduce(
                              (sum, r) =>
                                sum + (r.smellRating + r.purityRating) / 2,
                              0,
                            ) / toilet.ratings.length
                          ).toFixed(1)
                        : "Нет оценок"}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-4 text-center text-text">Нет данных</div>
            )}
          </div>
        </motion.div>

        <motion.div
          ref={worstRatedRef}
          variants={itemVariants}
          className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-red-500/10 to-transparent">
            <div className="flex items-center">
              <h2 className="flex items-center">
                <span className="mr-2">📉</span> Туалеты для улучшения
              </h2>
              <InfoTooltip
                title="Туалеты для улучшения"
                description="Туалеты с наименьшим средним рейтингом"
                formula="AVG((smell_rating + purity_rating) / 2) ASC"
                position="top-right"
              />
            </div>
          </div>
          <div className="flex flex-col">
            {stats.worstRatedToilets.length > 0 ? (
              stats.worstRatedToilets.map((toilet, index) => (
                <motion.div
                  key={toilet.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "var(--accent-bg)" }}
                  className="p-4 border-b border-border cursor-pointer transition-colors"
                  onClick={() => scrollToSection(fullListRef)}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-text-h">
                          {toilet.name}
                        </div>
                        <div className="text-sm text-text">
                          {toilet.ratings?.length || 0} отзывов
                        </div>
                      </div>
                    </div>
                    <div className="text-red-500 font-bold">
                      ⭐{" "}
                      {toilet.ratings && toilet.ratings.length > 0
                        ? (
                            toilet.ratings.reduce(
                              (sum, r) =>
                                sum + (r.smellRating + r.purityRating) / 2,
                              0,
                            ) / toilet.ratings.length
                          ).toFixed(1)
                        : "Нет оценок"}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-4 text-center text-text">Нет данных</div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        ref={fullListRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center">
            <h2 className="flex items-center">
              <span className="mr-2">📋</span> Полный список туалетов
            </h2>
            <InfoTooltip
              title="Полный список"
              description="Детальная информация по каждому туалету"
              formula="Все данные из таблицы toilets"
              position="top-right"
            />
          </div>
        </div>
        <div>
          {toilets.length > 0 ? (
            toilets.map((toilet, index) => {
              const avgSmell = toilet.ratings?.length
                ? (
                    toilet.ratings.reduce((sum, r) => sum + r.smellRating, 0) /
                    toilet.ratings.length
                  ).toFixed(1)
                : "Нет оценок";
              const avgPurity = toilet.ratings?.length
                ? (
                    toilet.ratings.reduce((sum, r) => sum + r.purityRating, 0) /
                    toilet.ratings.length
                  ).toFixed(1)
                : "Нет оценок";

              return (
                <motion.div
                  key={toilet.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ backgroundColor: "var(--accent-bg)" }}
                  className="p-6 border-b border-border transition-colors"
                >
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-text-h m-0">
                        {toilet.name}
                      </h3>
                      <p className="text-sm text-text mt-1">
                        Добавлен:{" "}
                        {new Date(toilet.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                    <div className="text-sm bg-accent-bg text-accent px-3 py-1 rounded-full border border-accent-border">
                      📝 {toilet.ratings?.length || 0} отзывов
                    </div>
                  </div>

                  {toilet.ratings && toilet.ratings.length > 0 && (
                    <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                      <div className="bg-code-bg rounded-md p-3">
                        <div className="text-sm text-text mb-1">
                          Средний запах
                        </div>
                        <div className="text-lg font-semibold text-accent">
                          {avgSmell} / 5
                        </div>
                      </div>
                      <div className="bg-code-bg rounded-md p-3">
                        <div className="text-sm text-text mb-1">
                          Средняя чистота
                        </div>
                        <div className="text-lg font-semibold text-accent">
                          {avgPurity} / 5
                        </div>
                      </div>
                      <div className="bg-code-bg rounded-md p-3">
                        <div className="text-sm text-text mb-1">Наличие</div>
                        <div className="text-sm">
                          <div>
                            🧻{" "}
                            {
                              toilet.ratings.filter((r) => r.hasToiletPaper)
                                .length
                            }{" "}
                            / {toilet.ratings.length}
                          </div>
                          <div>
                            🧼 {toilet.ratings.filter((r) => r.hasSoap).length}{" "}
                            / {toilet.ratings.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="p-6 text-center text-text">
              Нет данных о туалетах
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// import { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { DefaultApi, ToiletResDto } from "../../features/lib";
// import { apiConfig } from "../../config/api";

// function InfoTooltip({
//   title,
//   description,
//   formula,
//   position = "bottom-right",
// }: {
//   title: string;
//   description: string;
//   formula?: string;
//   position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
// }) {
//   const [isVisible, setIsVisible] = useState(false);

//   const positionClasses = {
//     "top-right": "right-0 bottom-full mb-2",
//     "top-left": "left-0 bottom-full mb-2",
//     "bottom-right": "right-0 top-full mt-2",
//     "bottom-left": "left-0 top-full mt-2",
//   };

//   return (
//     <div className="relative inline-block">
//       <button
//         onMouseEnter={() => setIsVisible(true)}
//         onMouseLeave={() => setIsVisible(false)}
//         className="ml-2 w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center cursor-help hover:bg-accent/30 transition-colors shrink-0"
//       >
//         ?
//       </button>

//       <AnimatePresence>
//         {isVisible && (
//           <>
//             <div
//               className="fixed inset-0 z-40"
//               style={{ pointerEvents: "none" }}
//               onClick={() => setIsVisible(false)}
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: -10 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: -10 }}
//               transition={{ duration: 0.15 }}
//               className={`fixed z-50 w-80 p-4 bg-bg border border-border rounded-lg shadow-theme ${positionClasses[position]}`}
//               style={{
//                 position: "fixed",
//                 pointerEvents: "auto",
//               }}
//               onMouseEnter={() => setIsVisible(true)}
//               onMouseLeave={() => setIsVisible(false)}
//             >
//               <h4 className="font-semibold text-text-h mb-2 pr-4">{title}</h4>
//               <p className="text-sm text-text mb-2">{description}</p>
//               {formula && (
//                 <div className="mt-2 pt-2 border-t border-border">
//                   <span className="text-xs font-medium text-accent">
//                     Формула:
//                   </span>
//                   <code className="block text-xs mt-1 p-2 bg-code-bg rounded break-words">
//                     {formula}
//                   </code>
//                 </div>
//               )}
//               <div
//                 className="absolute w-2 h-2 bg-bg border border-border transform rotate-45"
//                 style={{
//                   ...(position === "top-right" && {
//                     bottom: "-5px",
//                     right: "10px",
//                     borderTop: "none",
//                     borderLeft: "none",
//                   }),
//                   ...(position === "top-left" && {
//                     bottom: "-5px",
//                     left: "10px",
//                     borderTop: "none",
//                     borderRight: "none",
//                   }),
//                   ...(position === "bottom-right" && {
//                     top: "-5px",
//                     right: "10px",
//                     borderBottom: "none",
//                     borderLeft: "none",
//                   }),
//                   ...(position === "bottom-left" && {
//                     top: "-5px",
//                     left: "10px",
//                     borderBottom: "none",
//                     borderRight: "none",
//                   }),
//                 }}
//               />
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export function DashboardPage() {
//   const [toilets, setToilets] = useState<ToiletResDto[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const totalToiletsRef = useRef<HTMLDivElement>(null);
//   const smellRatingRef = useRef<HTMLDivElement>(null);
//   const purityRatingRef = useRef<HTMLDivElement>(null);
//   const amenitiesRef = useRef<HTMLDivElement>(null);
//   const topRatedRef = useRef<HTMLDivElement>(null);
//   const worstRatedRef = useRef<HTMLDivElement>(null);
//   const fullListRef = useRef<HTMLDivElement>(null);

//   const [stats, setStats] = useState({
//     totalToilets: 0,
//     totalRatings: 0,
//     averageSmellRating: 0,
//     averagePurityRating: 0,
//     toiletsWithPaper: 0,
//     toiletsWithSoap: 0,
//     topRatedToilets: [] as ToiletResDto[],
//     worstRatedToilets: [] as ToiletResDto[],
//     averageRating: 0,
//     satisfactionRate: 0,
//     mostActiveToilet: { id: 0, name: "", ratingCount: 0 },
//     paperAvailabilityPercent: 0,
//     soapAvailabilityPercent: 0,
//   });

//   const api = new DefaultApi(apiConfig);

//   const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
//     ref.current?.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const toiletsData = await api.toiletsControllerGetAllToilets();
//         setToilets(toiletsData);

//         const allRatings = toiletsData.flatMap(
//           (toilet) => toilet.ratings || [],
//         );

//         const totalToilets = toiletsData.length;
//         const totalRatings = allRatings.length;

//         const totalSmell = allRatings.reduce(
//           (sum, r) => sum + r.smellRating,
//           0,
//         );
//         const totalPurity = allRatings.reduce(
//           (sum, r) => sum + r.purityRating,
//           0,
//         );
//         const avgSmell = totalRatings > 0 ? totalSmell / totalRatings : 0;
//         const avgPurity = totalRatings > 0 ? totalPurity / totalRatings : 0;
//         const avgRating = (avgSmell + avgPurity) / 2;

//         const paperCount = allRatings.filter((r) => r.hasToiletPaper).length;
//         const soapCount = allRatings.filter((r) => r.hasSoap).length;

//         const paperAvailabilityPercent =
//           totalRatings > 0 ? (paperCount / totalRatings) * 100 : 0;
//         const soapAvailabilityPercent =
//           totalRatings > 0 ? (soapCount / totalRatings) * 100 : 0;
//         const satisfactionRate = (avgRating / 5) * 100;

//         const toiletRatings = toiletsData.map((toilet) => {
//           const toiletRatingsList = toilet.ratings || [];

//           const avgRatingValue =
//             toiletRatingsList.length > 0
//               ? toiletRatingsList.reduce(
//                   (sum, r) => sum + (r.smellRating + r.purityRating) / 2,
//                   0,
//                 ) / toiletRatingsList.length
//               : 0;

//           return {
//             toilet,
//             avgRating: avgRatingValue,
//             ratingCount: toiletRatingsList.length,
//           };
//         });

//         const topRated = [...toiletRatings]
//           .sort((a, b) => b.avgRating - a.avgRating)
//           .slice(0, 5)
//           .map((item) => item.toilet);

//         const worstRated = [...toiletRatings]
//           .sort((a, b) => a.avgRating - b.avgRating)
//           .filter((item) => item.ratingCount > 0)
//           .slice(0, 5)
//           .map((item) => item.toilet);

//         const mostActiveToiletData = [...toiletRatings]
//           .sort((a, b) => b.ratingCount - a.ratingCount)
//           .slice(0, 1)[0];

//         setStats({
//           totalToilets,
//           totalRatings,
//           averageSmellRating: Math.round(avgSmell * 10) / 10,
//           averagePurityRating: Math.round(avgPurity * 10) / 10,
//           toiletsWithPaper: paperCount,
//           toiletsWithSoap: soapCount,
//           topRatedToilets: topRated,
//           worstRatedToilets: worstRated,
//           averageRating: Math.round(avgRating * 10) / 10,
//           satisfactionRate: Math.round(satisfactionRate),
//           mostActiveToilet: {
//             id: mostActiveToiletData?.toilet?.id || 0,
//             name: mostActiveToiletData?.toilet?.name || "Нет данных",
//             ratingCount: mostActiveToiletData?.ratingCount || 0,
//           },
//           paperAvailabilityPercent: Math.round(paperAvailabilityPercent),
//           soapAvailabilityPercent: Math.round(soapAvailabilityPercent),
//         });
//       } catch (err) {
//         setError("Ошибка при загрузке данных");
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <div className="text-center">
//           <div className="mb-2">Загрузка данных...</div>
//           <motion.div
//             className="rounded-full h-8 w-8 mx-auto"
//             style={{ borderBottom: "2px solid var(--accent)" }}
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           />
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-red-500/10 border border-red-500/40 text-red-600 p-4 rounded-lg m-4"
//       >
//         <p>{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md border-none cursor-pointer hover:bg-red-700 transition-colors"
//         >
//           Повторить
//         </button>
//       </motion.div>
//     );
//   }

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="p-6 bg-bg min-h-screen"
//     >
//       <motion.h1
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         className="mb-8"
//       >
//         📊 Статистика туалетов
//       </motion.h1>

//       <div ref={totalToiletsRef}>
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-8"
//         >
//           <motion.div
//             variants={itemVariants}
//             whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
//             onClick={() => scrollToSection(fullListRef)}
//             className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-theme p-6 text-white cursor-pointer"
//           >
//             <div className="flex items-center">
//               <div className="text-sm opacity-90">Всего туалетов</div>
//               <InfoTooltip
//                 title="Всего туалетов"
//                 description="Общее количество туалетов, зарегистрированных в системе"
//                 formula="COUNT(DISTINCT toilets.id)"
//               />
//             </div>
//             <div className="text-4xl font-bold mt-2">{stats.totalToilets}</div>
//             <div className="text-xs mt-2 opacity-75">в системе</div>
//           </motion.div>

//           <motion.div
//             variants={itemVariants}
//             whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
//             onClick={() => scrollToSection(amenitiesRef)}
//             className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-theme p-6 text-white cursor-pointer"
//           >
//             <div className="flex items-center">
//               <div className="text-sm opacity-90">Всего отзывов</div>
//               <InfoTooltip
//                 title="Всего отзывов"
//                 description="Общее количество оставленных пользователями отзывов"
//                 formula="SUM(ratings.count)"
//               />
//             </div>
//             <div className="text-4xl font-bold mt-2">{stats.totalRatings}</div>
//             <div className="text-xs mt-2 opacity-75">
//               оставлено пользователями
//             </div>
//           </motion.div>

//           <motion.div
//             variants={itemVariants}
//             whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
//             onClick={() => scrollToSection(smellRatingRef)}
//             className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-theme p-6 text-white cursor-pointer"
//           >
//             <div className="flex items-center">
//               <div className="text-sm opacity-90">Средний рейтинг</div>
//               <InfoTooltip
//                 title="Средний рейтинг"
//                 description="Средняя оценка всех туалетов по всем критериям"
//                 formula="(AVG(smell_rating) + AVG(purity_rating)) / 2"
//               />
//             </div>
//             <div className="text-4xl font-bold mt-2">{stats.averageRating}</div>
//             <div className="text-xs mt-2 opacity-75">из 5.0</div>
//           </motion.div>

//           <motion.div
//             variants={itemVariants}
//             whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
//             onClick={() => scrollToSection(topRatedRef)}
//             className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-theme p-6 text-white cursor-pointer"
//           >
//             <div className="flex items-center">
//               <div className="text-sm opacity-90">Удовлетворенность</div>
//               <InfoTooltip
//                 title="Удовлетворенность"
//                 description="Процент пользователей, удовлетворенных состоянием туалетов"
//                 formula="(average_rating / 5) * 100%"
//               />
//             </div>
//             <div className="text-4xl font-bold mt-2">
//               {stats.satisfactionRate}%
//             </div>
//             <div className="text-xs mt-2 opacity-75">общая оценка</div>
//           </motion.div>
//         </motion.div>
//       </div>

//       <motion.div
//         ref={smellRatingRef}
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8"
//       >
//         <motion.div
//           ref={purityRatingRef}
//           variants={itemVariants}
//           whileHover={{ y: -5 }}
//           className="bg-bg rounded-lg shadow-theme p-6 border border-border"
//         >
//           <div className="flex items-center">
//             <h2 className="flex items-center mb-4">
//               <span className="mr-2">👃</span> Оценка запаха
//             </h2>
//             <InfoTooltip
//               title="Оценка запаха"
//               description="Средняя оценка запаха по всем отзывам"
//               formula="AVG(smell_rating)"
//               position="top-right"
//             />
//           </div>
//           <div className="text-3xl font-bold text-accent mb-2">
//             {stats.averageSmellRating}
//           </div>
//           <div className="w-full bg-border rounded-full h-3">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${(stats.averageSmellRating / 5) * 100}%` }}
//               transition={{ duration: 0.8, ease: "easeOut" }}
//               className="bg-accent rounded-full h-3"
//             />
//           </div>
//           <div className="text-sm text-text mt-2">из 5.0</div>
//         </motion.div>

//         <motion.div
//           variants={itemVariants}
//           whileHover={{ y: -5 }}
//           className="bg-bg rounded-lg shadow-theme p-6 border border-border"
//         >
//           <div className="flex items-center">
//             <h2 className="flex items-center mb-4">
//               <span className="mr-2">✨</span> Оценка чистоты
//             </h2>
//             <InfoTooltip
//               title="Оценка чистоты"
//               description="Средняя оценка чистоты по всем отзывам"
//               formula="AVG(purity_rating)"
//               position="top-right"
//             />
//           </div>
//           <div className="text-3xl font-bold text-accent mb-2">
//             {stats.averagePurityRating}
//           </div>
//           <div className="w-full bg-border rounded-full h-3">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${(stats.averagePurityRating / 5) * 100}%` }}
//               transition={{ duration: 0.8, ease: "easeOut" }}
//               className="bg-accent rounded-full h-3"
//             />
//           </div>
//           <div className="text-sm text-text mt-2">из 5.0</div>
//         </motion.div>
//       </motion.div>

//       <motion.div
//         ref={amenitiesRef}
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8"
//       >
//         <motion.div
//           variants={itemVariants}
//           whileHover={{ y: -5 }}
//           className="bg-bg rounded-lg shadow-theme p-6 border border-border"
//         >
//           <div className="flex items-center">
//             <h2 className="flex items-center mb-4">
//               <span className="mr-2">🧻</span> Наличие удобств
//             </h2>
//             <InfoTooltip
//               title="Наличие удобств"
//               description="Процент отзывов, в которых отмечено наличие туалетной бумаги и мыла"
//               formula="(COUNT(has_toilet_paper = true) / total_ratings) * 100%"
//               position="top-right"
//             />
//           </div>
//           <div className="flex flex-col gap-4">
//             <div>
//               <div className="flex justify-between mb-2">
//                 <span className="font-medium">Туалетная бумага</span>
//                 <span className="text-sm">
//                   {stats.toiletsWithPaper} / {stats.totalRatings} (
//                   {stats.paperAvailabilityPercent}%)
//                 </span>
//               </div>
//               <div className="w-full bg-border rounded-full h-3">
//                 <motion.div
//                   initial={{ width: 0 }}
//                   animate={{ width: `${stats.paperAvailabilityPercent}%` }}
//                   transition={{ duration: 0.8, ease: "easeOut" }}
//                   className="bg-green-500 rounded-full h-3"
//                 />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between mb-2">
//                 <span className="font-medium">Мыло</span>
//                 <span className="text-sm">
//                   {stats.toiletsWithSoap} / {stats.totalRatings} (
//                   {stats.soapAvailabilityPercent}%)
//                 </span>
//               </div>
//               <div className="w-full bg-border rounded-full h-3">
//                 <motion.div
//                   initial={{ width: 0 }}
//                   animate={{ width: `${stats.soapAvailabilityPercent}%` }}
//                   transition={{ duration: 0.8, ease: "easeOut" }}
//                   className="bg-blue-500 rounded-full h-3"
//                 />
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         <motion.div
//           variants={itemVariants}
//           whileHover={{ y: -5 }}
//           className="bg-bg rounded-lg shadow-theme p-6 border border-border"
//         >
//           <div className="flex items-center">
//             <h2 className="flex items-center mb-4">
//               <span className="mr-2">🏆</span> Самый активный туалет
//             </h2>
//             <InfoTooltip
//               title="Самый активный туалет"
//               description="Туалет с наибольшим количеством оставленных отзывов"
//               formula="MAX(COUNT(ratings))"
//               position="top-right"
//             />
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold text-accent mb-2">
//               {stats.mostActiveToilet.name}
//             </div>
//             <div className="text-text">
//               Количество отзывов: {stats.mostActiveToilet.ratingCount}
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>

//       <motion.div
//         ref={topRatedRef}
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6 mb-8"
//       >
//         <motion.div
//           variants={itemVariants}
//           className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden"
//         >
//           <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-yellow-500/10 to-transparent">
//             <div className="flex items-center">
//               <h2 className="flex items-center">
//                 <span className="mr-2">⭐</span> Топ-5 туалетов по рейтингу
//               </h2>
//               <InfoTooltip
//                 title="Топ-5 туалетов"
//                 description="Туалеты с наивысшим средним рейтингом"
//                 formula="AVG((smell_rating + purity_rating) / 2)"
//                 position="top-right"
//               />
//             </div>
//           </div>
//           <div className="flex flex-col">
//             {stats.topRatedToilets.length > 0 ? (
//               stats.topRatedToilets.map((toilet, index) => (
//                 <motion.div
//                   key={toilet.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   whileHover={{ backgroundColor: "var(--accent-bg)" }}
//                   className="p-4 border-b border-border cursor-pointer transition-colors"
//                   onClick={() => scrollToSection(fullListRef)}
//                 >
//                   <div className="flex items-center justify-between flex-wrap gap-2">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold mr-3">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-text-h">
//                           {toilet.name}
//                         </div>
//                         <div className="text-sm text-text">
//                           {toilet.ratings?.length || 0} отзывов
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-yellow-500 font-bold">
//                       ⭐{" "}
//                       {toilet.ratings && toilet.ratings.length > 0
//                         ? (
//                             toilet.ratings.reduce(
//                               (sum, r) =>
//                                 sum + (r.smellRating + r.purityRating) / 2,
//                               0,
//                             ) / toilet.ratings.length
//                           ).toFixed(1)
//                         : "Нет оценок"}
//                     </div>
//                   </div>
//                 </motion.div>
//               ))
//             ) : (
//               <div className="p-4 text-center text-text">Нет данных</div>
//             )}
//           </div>
//         </motion.div>

//         <motion.div
//           ref={worstRatedRef}
//           variants={itemVariants}
//           className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden"
//         >
//           <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-red-500/10 to-transparent">
//             <div className="flex items-center">
//               <h2 className="flex items-center">
//                 <span className="mr-2">📉</span> Туалеты для улучшения
//               </h2>
//               <InfoTooltip
//                 title="Туалеты для улучшения"
//                 description="Туалеты с наименьшим средним рейтингом"
//                 formula="AVG((smell_rating + purity_rating) / 2) ASC"
//                 position="top-right"
//               />
//             </div>
//           </div>
//           <div className="flex flex-col">
//             {stats.worstRatedToilets.length > 0 ? (
//               stats.worstRatedToilets.map((toilet, index) => (
//                 <motion.div
//                   key={toilet.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   whileHover={{ backgroundColor: "var(--accent-bg)" }}
//                   className="p-4 border-b border-border cursor-pointer transition-colors"
//                   onClick={() => scrollToSection(fullListRef)}
//                 >
//                   <div className="flex items-center justify-between flex-wrap gap-2">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold mr-3">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-text-h">
//                           {toilet.name}
//                         </div>
//                         <div className="text-sm text-text">
//                           {toilet.ratings?.length || 0} отзывов
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-red-500 font-bold">
//                       ⭐{" "}
//                       {toilet.ratings && toilet.ratings.length > 0
//                         ? (
//                             toilet.ratings.reduce(
//                               (sum, r) =>
//                                 sum + (r.smellRating + r.purityRating) / 2,
//                               0,
//                             ) / toilet.ratings.length
//                           ).toFixed(1)
//                         : "Нет оценок"}
//                     </div>
//                   </div>
//                 </motion.div>
//               ))
//             ) : (
//               <div className="p-4 text-center text-text">Нет данных</div>
//             )}
//           </div>
//         </motion.div>
//       </motion.div>

//       <motion.div
//         ref={fullListRef}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5 }}
//         className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden"
//       >
//         <div className="px-6 py-4 border-b border-border">
//           <div className="flex items-center">
//             <h2 className="flex items-center">
//               <span className="mr-2">📋</span> Полный список туалетов
//             </h2>
//             <InfoTooltip
//               title="Полный список"
//               description="Детальная информация по каждому туалету"
//               formula="Все данные из таблицы toilets"
//               position="top-right"
//             />
//           </div>
//         </div>
//         <div>
//           {toilets.length > 0 ? (
//             toilets.map((toilet, index) => {
//               const avgSmell = toilet.ratings?.length
//                 ? (
//                     toilet.ratings.reduce((sum, r) => sum + r.smellRating, 0) /
//                     toilet.ratings.length
//                   ).toFixed(1)
//                 : "Нет оценок";
//               const avgPurity = toilet.ratings?.length
//                 ? (
//                     toilet.ratings.reduce((sum, r) => sum + r.purityRating, 0) /
//                     toilet.ratings.length
//                   ).toFixed(1)
//                 : "Нет оценок";

//               return (
//                 <motion.div
//                   key={toilet.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.03 }}
//                   whileHover={{ backgroundColor: "var(--accent-bg)" }}
//                   className="p-6 border-b border-border transition-colors"
//                 >
//                   <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
//                     <div>
//                       <h3 className="text-lg font-semibold text-text-h m-0">
//                         {toilet.name}
//                       </h3>
//                       <p className="text-sm text-text mt-1">
//                         Добавлен:{" "}
//                         {new Date(toilet.createdAt).toLocaleDateString("ru-RU")}
//                       </p>
//                     </div>
//                     <div className="text-sm bg-accent-bg text-accent px-3 py-1 rounded-full border border-accent-border">
//                       📝 {toilet.ratings?.length || 0} отзывов
//                     </div>
//                   </div>

//                   {toilet.ratings && toilet.ratings.length > 0 && (
//                     <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
//                       <div className="bg-code-bg rounded-md p-3">
//                         <div className="text-sm text-text mb-1">
//                           Средний запах
//                         </div>
//                         <div className="text-lg font-semibold text-accent">
//                           {avgSmell} / 5
//                         </div>
//                       </div>
//                       <div className="bg-code-bg rounded-md p-3">
//                         <div className="text-sm text-text mb-1">
//                           Средняя чистота
//                         </div>
//                         <div className="text-lg font-semibold text-accent">
//                           {avgPurity} / 5
//                         </div>
//                       </div>
//                       <div className="bg-code-bg rounded-md p-3">
//                         <div className="text-sm text-text mb-1">Наличие</div>
//                         <div className="text-sm">
//                           <div>
//                             🧻{" "}
//                             {
//                               toilet.ratings.filter((r) => r.hasToiletPaper)
//                                 .length
//                             }{" "}
//                             / {toilet.ratings.length}
//                           </div>
//                           <div>
//                             🧼 {toilet.ratings.filter((r) => r.hasSoap).length}{" "}
//                             / {toilet.ratings.length}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </motion.div>
//               );
//             })
//           ) : (
//             <div className="p-6 text-center text-text">
//               Нет данных о туалетах
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }
