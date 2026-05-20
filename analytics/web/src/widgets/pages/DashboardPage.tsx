import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { CommonInfoTooltip } from "../../shared/ui/info";
import { ErrorMessage, LoadingSpinner, MetricCard } from "../analytic";
import { scrollToSection } from "../../features/utils/scroll";
import { CommonFilterDate } from "../../shared/filter";
import { useAnalytic } from "../analytic/analytic.old.fn";
import { ToiletResDto } from "../../features/lib";
import { ToiletDetailsModal } from "../analytic/analytic.ui";

export function DashboardPage() {
  const totalToiletsRef = useRef<HTMLDivElement>(null);
  const smellRatingRef = useRef<HTMLDivElement>(null);
  const purityRatingRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);
  const topRatedRef = useRef<HTMLDivElement>(null);
  const worstRatedRef = useRef<HTMLDivElement>(null);
  const fullListRef = useRef<HTMLDivElement>(null);

  const [selectedToilet, setSelectedToilet] = useState<ToiletResDto | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    fetch,
    refetch,
    loading,
    error,
    stats,
    toilets,
    timeFilter,
    setTimeFilter,
  } = useAnalytic();

  useEffect(() => {
    fetch();
  }, []);

  const handleOpenModal = (toilet: ToiletResDto) => {
    setSelectedToilet(toilet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedToilet(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  return (
    <>
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

          <CommonFilterDate
            isLoading={loading}
            currentFilter={timeFilter}
            onFilterChange={setTimeFilter}
          />
        </div>

        <div ref={totalToiletsRef}>
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-8"
          >
            <MetricCard
              gradient="from-blue-600 to-blue-700"
              label="Всего туалетов"
              value={stats.totalToilets}
              unit="в системе"
              tooltipTitle="Всего туалетов"
              tooltipDescription="Общее количество туалетов, зарегистрированных в системе"
              tooltipFormula="COUNT(DISTINCT toilets.id)"
              onClick={() => scrollToSection(fullListRef)}
            />

            <MetricCard
              gradient="from-green-500 to-green-600"
              label="Всего отзывов"
              value={stats.totalRatings}
              unit="оставлено пользователями"
              tooltipTitle="Всего отзывов"
              tooltipDescription="Общее количество оставленных пользователями отзывов"
              tooltipFormula="SUM(ratings.count)"
              onClick={() => scrollToSection(amenitiesRef)}
            />

            <MetricCard
              gradient="from-purple-500 to-purple-600"
              label="Средний рейтинг"
              value={stats.averageRating}
              unit="из 5.0"
              tooltipTitle="Средний рейтинг"
              tooltipDescription="Средняя оценка всех туалетов по всем критериям"
              tooltipFormula="(AVG(smell_rating) + AVG(purity_rating)) / 2"
              onClick={() => scrollToSection(smellRatingRef)}
            />

            <MetricCard
              gradient="from-orange-500 to-orange-600"
              label="Удовлетворенность"
              value={`${stats.satisfactionRate}%`}
              unit="общая оценка"
              tooltipTitle="Удовлетворенность"
              tooltipDescription="Процент пользователей, удовлетворенных состоянием туалетов"
              tooltipFormula="(average_rating / 5) * 100%"
              onClick={() => scrollToSection(topRatedRef)}
            />
          </motion.div>
        </div>

        <motion.div
          ref={smellRatingRef}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8"
        >
          <motion.div
            ref={purityRatingRef}
            whileHover={{ y: -5 }}
            className="bg-bg rounded-lg shadow-theme p-6 border border-border"
          >
            <div className="flex items-center">
              <h2 className="flex items-center mb-4">
                <span className="mr-2">👃</span> Оценка запаха
              </h2>
              <CommonInfoTooltip
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
            whileHover={{ y: -5 }}
            className="bg-bg rounded-lg shadow-theme p-6 border border-border"
          >
            <div className="flex items-center">
              <h2 className="flex items-center mb-4">
                <span className="mr-2">✨</span> Оценка чистоты
              </h2>
              <CommonInfoTooltip
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
          initial="hidden"
          animate="visible"
          className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-bg rounded-lg shadow-theme p-6 border border-border"
          >
            <div className="flex items-center">
              <h2 className="flex items-center mb-4">
                <span className="mr-2">🧻</span> Наличие удобств
              </h2>
              <CommonInfoTooltip
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
            whileHover={{ y: -5 }}
            className="bg-bg rounded-lg shadow-theme p-6 border border-border"
          >
            <div className="flex items-center">
              <h2 className="flex items-center mb-4">
                <span className="mr-2">🏆</span> Самый активный туалет
              </h2>
              <CommonInfoTooltip
                title="Самый активный туалет"
                description="Туалет с наибольшим количеством оставленных отзывов"
                formula="MAX(COUNT(ratings))"
                position="top-right"
              />
            </div>
            <div className="text-center">
              <button
                onClick={() => {
                  const activeToilet = toilets.find(
                    (t) => t.id === stats.mostActiveToilet.id,
                  );
                  if (activeToilet) handleOpenModal(activeToilet);
                }}
                className="text-2xl font-bold text-accent mb-2 hover:underline"
              >
                {stats.mostActiveToilet.name}
              </button>
              <div className="text-text">
                Количество отзывов: {stats.mostActiveToilet.ratingCount}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          ref={topRatedRef}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6 mb-8"
        >
          <motion.div className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-yellow-500/10 to-transparent">
              <div className="flex items-center">
                <h2 className="flex items-center">
                  <span className="mr-2">⭐</span> Топ-5 туалетов по рейтингу
                </h2>
                <CommonInfoTooltip
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
                    onClick={() => handleOpenModal(toilet)}
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
            className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-red-500/10 to-transparent">
              <div className="flex items-center">
                <h2 className="flex items-center">
                  <span className="mr-2">📉</span> Туалеты для улучшения
                </h2>
                <CommonInfoTooltip
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
                    onClick={() => handleOpenModal(toilet)}
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

              <CommonInfoTooltip
                title="Полный список"
                description="Детальная информация по каждому туалету. Нажмите для просмотра подробной статистики"
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
                      toilet.ratings.reduce(
                        (sum, r) => sum + r.smellRating,
                        0,
                      ) / toilet.ratings.length
                    ).toFixed(1)
                  : "Нет оценок";
                const avgPurity = toilet.ratings?.length
                  ? (
                      toilet.ratings.reduce(
                        (sum, r) => sum + r.purityRating,
                        0,
                      ) / toilet.ratings.length
                    ).toFixed(1)
                  : "Нет оценок";

                return (
                  <motion.div
                    key={toilet.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ backgroundColor: "var(--accent-bg)" }}
                    className="p-6 border-b border-border transition-colors cursor-pointer"
                    onClick={() => handleOpenModal(toilet)}
                  >
                    <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-text-h m-0">
                          {toilet.name}
                        </h3>
                        <p className="text-sm text-text mt-1">
                          Добавлен:{" "}
                          {new Date(toilet.createdAt).toLocaleDateString(
                            "ru-RU",
                          )}
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
                              🧼{" "}
                              {toilet.ratings.filter((r) => r.hasSoap).length} /{" "}
                              {toilet.ratings.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(toilet);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-accent to-accent/80 text-white rounded-lg hover:from-accent/90 hover:to-accent/70 transition-all flex items-center gap-2 text-sm font-semibold shadow-md"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        Детальная аналитика
                        <span>→</span>
                      </button>
                    </div>
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

      <ToiletDetailsModal
        toilet={selectedToilet}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
