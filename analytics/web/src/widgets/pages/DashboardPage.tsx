import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { CommonInfoTooltip } from "../../shared/ui/info";
import { useAnalytic } from "../analytic";
import { scrollToSection } from "../../features/utils/scroll";

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
      // variants={itemVariants}
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

export function DashboardPage() {
  const totalToiletsRef = useRef<HTMLDivElement>(null);
  const smellRatingRef = useRef<HTMLDivElement>(null);
  const purityRatingRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);
  const topRatedRef = useRef<HTMLDivElement>(null);
  const worstRatedRef = useRef<HTMLDivElement>(null);
  const fullListRef = useRef<HTMLDivElement>(null);

  const { toilets, loading, error, stats, refetch, fetch } = useAnalytic();

  useEffect(() => {
    fetch();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-bg min-h-screen"
    >
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        📊 Статистика туалетов
      </motion.h1>

      {/* Основные метрики */}
      <div ref={totalToiletsRef}>
        <motion.div
          // variants={containerVariants}
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

      {/* Детальные оценки */}
      <motion.div
        ref={smellRatingRef}
        // variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8"
      >
        <motion.div
          ref={purityRatingRef}
          // variants={itemVariants}
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
          // variants={itemVariants}
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
        // variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8"
      >
        <motion.div
          // variants={itemVariants}
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
          // variants={itemVariants}
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
            <div className="text-2xl font-bold text-accent mb-2">
              {stats.mostActiveToilet.name}
            </div>
            <div className="text-text">
              Количество отзывов: {stats.mostActiveToilet.ratingCount}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Топ туалетов */}
      <motion.div
        ref={topRatedRef}
        // variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6 mb-8"
      >
        <motion.div
          // variants={itemVariants}
          className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden"
        >
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
          // variants={itemVariants}
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

      {/* Полный список туалетов */}
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

// // DashboardPage.tsx
// import { useRef } from "react";
// import { motion } from "motion/react";
// import { CommonInfoTooltip } from "../../shared/ui/info";
// import { useAnalytics } from "../analytic/analytic.fn";
// import { scrollToSection } from "../../features/utils/scroll";

// function LoadingSpinner() {
//   return (
//     <div className="flex justify-center items-center h-96">
//       <div className="text-center">
//         <div className="mb-2">Загрузка данных...</div>
//         <motion.div
//           className="rounded-full h-8 w-8 mx-auto"
//           style={{ borderBottom: "2px solid var(--accent)" }}
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//         />
//       </div>
//     </div>
//   );
// }

// function ErrorMessage({
//   error,
//   onRetry,
// }: {
//   error: string;
//   onRetry: () => void;
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-red-500/10 border border-red-500/40 text-red-600 p-4 rounded-lg m-4"
//     >
//       <p>{error}</p>
//       <button
//         onClick={onRetry}
//         className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md border-none cursor-pointer hover:bg-red-700 transition-colors"
//       >
//         Повторить
//       </button>
//     </motion.div>
//   );
// }

// function MetricCard({
//   gradient,
//   label,
//   value,
//   unit,
//   tooltipTitle,
//   tooltipDescription,
//   tooltipFormula,
//   onClick,
// }: {
//   gradient: string;
//   label: string;
//   value: string | number;
//   unit: string;
//   tooltipTitle: string;
//   tooltipDescription: string;
//   tooltipFormula: string;
//   onClick?: () => void;
// }) {
//   return (
//     <motion.div
//       // variants={itemVariants}
//       whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
//       onClick={onClick}
//       className={`bg-gradient-to-br ${gradient} rounded-lg shadow-theme p-6 text-white cursor-pointer`}
//     >
//       <div className="flex items-center">
//         <div className="text-sm opacity-90">{label}</div>
//         <CommonInfoTooltip
//           title={tooltipTitle}
//           description={tooltipDescription}
//           formula={tooltipFormula}
//         />
//       </div>
//       <div className="text-4xl font-bold mt-2">{value}</div>
//       <div className="text-xs mt-2 opacity-75">{unit}</div>
//     </motion.div>
//   );
// }

// export function DashboardPage() {
//   const totalToiletsRef = useRef<HTMLDivElement>(null);
//   const smellRatingRef = useRef<HTMLDivElement>(null);
//   // const purityRatingRef = useRef<HTMLDivElement>(null);
//   const amenitiesRef = useRef<HTMLDivElement>(null);
//   const topRatedRef = useRef<HTMLDivElement>(null);
//   // const worstRatedRef = useRef<HTMLDivElement>(null);
//   const fullListRef = useRef<HTMLDivElement>(null);

//   const { toilets, loading, error, stats, refetch } = useAnalytics();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <ErrorMessage error={error} onRetry={refetch} />;
//   }

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
//           // variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-8"
//         >
//           <MetricCard
//             gradient="from-blue-600 to-blue-700"
//             label="Всего туалетов"
//             value={stats.totalToilets}
//             unit="в системе"
//             tooltipTitle="Всего туалетов"
//             tooltipDescription="Общее количество туалетов, зарегистрированных в системе"
//             tooltipFormula="COUNT(DISTINCT toilets.id)"
//             onClick={() => scrollToSection(fullListRef)}
//           />

//           <MetricCard
//             gradient="from-green-500 to-green-600"
//             label="Всего отзывов"
//             value={stats.totalRatings}
//             unit="оставлено пользователями"
//             tooltipTitle="Всего отзывов"
//             tooltipDescription="Общее количество оставленных пользователями отзывов"
//             tooltipFormula="SUM(ratings.count)"
//             onClick={() => scrollToSection(amenitiesRef)}
//           />

//           <MetricCard
//             gradient="from-purple-500 to-purple-600"
//             label="Средний рейтинг"
//             value={stats.averageRating}
//             unit="из 5.0"
//             tooltipTitle="Средний рейтинг"
//             tooltipDescription="Средняя оценка всех туалетов по всем критериям"
//             tooltipFormula="(AVG(smell_rating) + AVG(purity_rating)) / 2"
//             onClick={() => scrollToSection(smellRatingRef)}
//           />

//           <MetricCard
//             gradient="from-orange-500 to-orange-600"
//             label="Удовлетворенность"
//             value={`${stats.satisfactionRate}%`}
//             unit="общая оценка"
//             tooltipTitle="Удовлетворенность"
//             tooltipDescription="Процент пользователей, удовлетворенных состоянием туалетов"
//             tooltipFormula="(average_rating / 5) * 100%"
//             onClick={() => scrollToSection(topRatedRef)}
//           />
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// }

// // import { useEffect, useState, useRef } from "react";
// // import { motion } from "motion/react";
// // import { DefaultApi, ToiletResDto } from "../../features/lib";
// // import { apiConfig } from "../../config/api";
// // import { CommonInfoTooltip } from "../../shared/ui/info";

// // export function DashboardPage() {
// //   const [toilets, setToilets] = useState<ToiletResDto[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const totalToiletsRef = useRef<HTMLDivElement>(null);
// //   const smellRatingRef = useRef<HTMLDivElement>(null);
// //   const purityRatingRef = useRef<HTMLDivElement>(null);
// //   const amenitiesRef = useRef<HTMLDivElement>(null);
// //   const topRatedRef = useRef<HTMLDivElement>(null);
// //   const worstRatedRef = useRef<HTMLDivElement>(null);
// //   const fullListRef = useRef<HTMLDivElement>(null);

// //   const [stats, setStats] = useState({
// //     totalToilets: 0,
// //     totalRatings: 0,
// //     averageSmellRating: 0,
// //     averagePurityRating: 0,
// //     toiletsWithPaper: 0,
// //     toiletsWithSoap: 0,
// //     topRatedToilets: [] as ToiletResDto[],
// //     worstRatedToilets: [] as ToiletResDto[],
// //     averageRating: 0,
// //     satisfactionRate: 0,
// //     mostActiveToilet: { id: 0, name: "", ratingCount: 0 },
// //     paperAvailabilityPercent: 0,
// //     soapAvailabilityPercent: 0,
// //   });

// //   const api = new DefaultApi(apiConfig);

// //   const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
// //     ref.current?.scrollIntoView({
// //       behavior: "smooth",
// //       block: "start",
// //     });
// //   };

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const toiletsData = await api.toiletsControllerGetAllToilets();
// //         setToilets(toiletsData);

// //         const allRatings = toiletsData.flatMap(
// //           (toilet) => toilet.ratings || [],
// //         );

// //         const totalToilets = toiletsData.length;
// //         const totalRatings = allRatings.length;

// //         const totalSmell = allRatings.reduce(
// //           (sum, r) => sum + r.smellRating,
// //           0,
// //         );
// //         const totalPurity = allRatings.reduce(
// //           (sum, r) => sum + r.purityRating,
// //           0,
// //         );
// //         const avgSmell = totalRatings > 0 ? totalSmell / totalRatings : 0;
// //         const avgPurity = totalRatings > 0 ? totalPurity / totalRatings : 0;
// //         const avgRating = (avgSmell + avgPurity) / 2;

// //         const paperCount = allRatings.filter((r) => r.hasToiletPaper).length;
// //         const soapCount = allRatings.filter((r) => r.hasSoap).length;

// //         const paperAvailabilityPercent =
// //           totalRatings > 0 ? (paperCount / totalRatings) * 100 : 0;
// //         const soapAvailabilityPercent =
// //           totalRatings > 0 ? (soapCount / totalRatings) * 100 : 0;
// //         const satisfactionRate = (avgRating / 5) * 100;

// //         const toiletRatings = toiletsData.map((toilet) => {
// //           const toiletRatingsList = toilet.ratings || [];

// //           const avgRatingValue =
// //             toiletRatingsList.length > 0
// //               ? toiletRatingsList.reduce(
// //                   (sum, r) => sum + (r.smellRating + r.purityRating) / 2,
// //                   0,
// //                 ) / toiletRatingsList.length
// //               : 0;

// //           return {
// //             toilet,
// //             avgRating: avgRatingValue,
// //             ratingCount: toiletRatingsList.length,
// //           };
// //         });

// //         const topRated = [...toiletRatings]
// //           .sort((a, b) => b.avgRating - a.avgRating)
// //           .slice(0, 5)
// //           .map((item) => item.toilet);

// //         const worstRated = [...toiletRatings]
// //           .sort((a, b) => a.avgRating - b.avgRating)
// //           .filter((item) => item.ratingCount > 0)
// //           .slice(0, 5)
// //           .map((item) => item.toilet);

// //         const mostActiveToiletData = [...toiletRatings]
// //           .sort((a, b) => b.ratingCount - a.ratingCount)
// //           .slice(0, 1)[0];

// //         setStats({
// //           totalToilets,
// //           totalRatings,
// //           averageSmellRating: Math.round(avgSmell * 10) / 10,
// //           averagePurityRating: Math.round(avgPurity * 10) / 10,
// //           toiletsWithPaper: paperCount,
// //           toiletsWithSoap: soapCount,
// //           topRatedToilets: topRated,
// //           worstRatedToilets: worstRated,
// //           averageRating: Math.round(avgRating * 10) / 10,
// //           satisfactionRate: Math.round(satisfactionRate),
// //           mostActiveToilet: {
// //             id: mostActiveToiletData?.toilet?.id || 0,
// //             name: mostActiveToiletData?.toilet?.name || "Нет данных",
// //             ratingCount: mostActiveToiletData?.ratingCount || 0,
// //           },
// //           paperAvailabilityPercent: Math.round(paperAvailabilityPercent),
// //           soapAvailabilityPercent: Math.round(soapAvailabilityPercent),
// //         });
// //       } catch (err) {
// //         setError("Ошибка при загрузке данных");
// //         console.error("Error fetching data:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-96">
// //         <div className="text-center">
// //           <div className="mb-2">Загрузка данных...</div>
// //           <motion.div
// //             className="rounded-full h-8 w-8 mx-auto"
// //             style={{ borderBottom: "2px solid var(--accent)" }}
// //             animate={{ rotate: 360 }}
// //             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
// //           />
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <motion.div
// //         initial={{ opacity: 0, y: -20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         className="bg-red-500/10 border border-red-500/40 text-red-600 p-4 rounded-lg m-4"
// //       >
// //         <p>{error}</p>
// //         <button
// //           onClick={() => window.location.reload()}
// //           className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md border-none cursor-pointer hover:bg-red-700 transition-colors"
// //         >
// //           Повторить
// //         </button>
// //       </motion.div>
// //     );
// //   }

// //   const containerVariants = {
// //     hidden: { opacity: 0 },
// //     visible: {
// //       opacity: 1,
// //       transition: {
// //         staggerChildren: 0.1,
// //       },
// //     },
// //   };

// //   const itemVariants = {
// //     hidden: { opacity: 0, y: 20 },
// //     visible: { opacity: 1, y: 0 },
// //   };

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0 }}
// //       animate={{ opacity: 1 }}
// //       className="p-6 bg-bg min-h-screen"
// //     >
// //       <motion.h1
// //         initial={{ opacity: 0, x: -20 }}
// //         animate={{ opacity: 1, x: 0 }}
// //         className="mb-8"
// //       >
// //         📊 Статистика туалетов
// //       </motion.h1>

// //       <div ref={totalToiletsRef}>
// //         <motion.div
// //           variants={containerVariants}
// //           initial="hidden"
// //           animate="visible"
// //           className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-8"
// //         >
// //           <motion.div
// //             variants={itemVariants}
// //             whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
// //             onClick={() => scrollToSection(fullListRef)}
// //             className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-theme p-6 text-white cursor-pointer"
// //           >
// //             <div className="flex items-center">
// //               <div className="text-sm opacity-90">Всего туалетов</div>
// //               <CommonInfoTooltip
// //                 title="Всего туалетов"
// //                 description="Общее количество туалетов, зарегистрированных в системе"
// //                 formula="COUNT(DISTINCT toilets.id)"
// //               />
// //             </div>
// //             <div className="text-4xl font-bold mt-2">{stats.totalToilets}</div>
// //             <div className="text-xs mt-2 opacity-75">в системе</div>
// //           </motion.div>

// //           <motion.div
// //             variants={itemVariants}
// //             whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
// //             onClick={() => scrollToSection(amenitiesRef)}
// //             className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-theme p-6 text-white cursor-pointer"
// //           >
// //             <div className="flex items-center">
// //               <div className="text-sm opacity-90">Всего отзывов</div>
// //               <CommonInfoTooltip
// //                 title="Всего отзывов"
// //                 description="Общее количество оставленных пользователями отзывов"
// //                 formula="SUM(ratings.count)"
// //               />
// //             </div>
// //             <div className="text-4xl font-bold mt-2">{stats.totalRatings}</div>
// //             <div className="text-xs mt-2 opacity-75">
// //               оставлено пользователями
// //             </div>
// //           </motion.div>

// //           <motion.div
// //             variants={itemVariants}
// //             whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
// //             onClick={() => scrollToSection(smellRatingRef)}
// //             className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-theme p-6 text-white cursor-pointer"
// //           >
// //             <div className="flex items-center">
// //               <div className="text-sm opacity-90">Средний рейтинг</div>
// //               <CommonInfoTooltip
// //                 title="Средний рейтинг"
// //                 description="Средняя оценка всех туалетов по всем критериям"
// //                 formula="(AVG(smell_rating) + AVG(purity_rating)) / 2"
// //               />
// //             </div>
// //             <div className="text-4xl font-bold mt-2">{stats.averageRating}</div>
// //             <div className="text-xs mt-2 opacity-75">из 5.0</div>
// //           </motion.div>

// //           <motion.div
// //             variants={itemVariants}
// //             whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
// //             onClick={() => scrollToSection(topRatedRef)}
// //             className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-theme p-6 text-white cursor-pointer"
// //           >
// //             <div className="flex items-center">
// //               <div className="text-sm opacity-90">Удовлетворенность</div>
// //               <CommonInfoTooltip
// //                 title="Удовлетворенность"
// //                 description="Процент пользователей, удовлетворенных состоянием туалетов"
// //                 formula="(average_rating / 5) * 100%"
// //               />
// //             </div>
// //             <div className="text-4xl font-bold mt-2">
// //               {stats.satisfactionRate}%
// //             </div>
// //             <div className="text-xs mt-2 opacity-75">общая оценка</div>
// //           </motion.div>
// //         </motion.div>
// //       </div>

// //       <motion.div
// //         ref={smellRatingRef}
// //         variants={containerVariants}
// //         initial="hidden"
// //         animate="visible"
// //         className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8"
// //       >
// //         <motion.div
// //           ref={purityRatingRef}
// //           variants={itemVariants}
// //           whileHover={{ y: -5 }}
// //           className="bg-bg rounded-lg shadow-theme p-6 border border-border"
// //         >
// //           <div className="flex items-center">
// //             <h2 className="flex items-center mb-4">
// //               <span className="mr-2">👃</span> Оценка запаха
// //             </h2>
// //             <CommonInfoTooltip
// //               title="Оценка запаха"
// //               description="Средняя оценка запаха по всем отзывам"
// //               formula="AVG(smell_rating)"
// //               position="top-right"
// //             />
// //           </div>
// //           <div className="text-3xl font-bold text-accent mb-2">
// //             {stats.averageSmellRating}
// //           </div>
// //           <div className="w-full bg-border rounded-full h-3">
// //             <motion.div
// //               initial={{ width: 0 }}
// //               animate={{ width: `${(stats.averageSmellRating / 5) * 100}%` }}
// //               transition={{ duration: 0.8, ease: "easeOut" }}
// //               className="bg-accent rounded-full h-3"
// //             />
// //           </div>
// //           <div className="text-sm text-text mt-2">из 5.0</div>
// //         </motion.div>

// //         <motion.div
// //           variants={itemVariants}
// //           whileHover={{ y: -5 }}
// //           className="bg-bg rounded-lg shadow-theme p-6 border border-border"
// //         >
// //           <div className="flex items-center">
// //             <h2 className="flex items-center mb-4">
// //               <span className="mr-2">✨</span> Оценка чистоты
// //             </h2>
// //             <CommonInfoTooltip
// //               title="Оценка чистоты"
// //               description="Средняя оценка чистоты по всем отзывам"
// //               formula="AVG(purity_rating)"
// //               position="top-right"
// //             />
// //           </div>
// //           <div className="text-3xl font-bold text-accent mb-2">
// //             {stats.averagePurityRating}
// //           </div>
// //           <div className="w-full bg-border rounded-full h-3">
// //             <motion.div
// //               initial={{ width: 0 }}
// //               animate={{ width: `${(stats.averagePurityRating / 5) * 100}%` }}
// //               transition={{ duration: 0.8, ease: "easeOut" }}
// //               className="bg-accent rounded-full h-3"
// //             />
// //           </div>
// //           <div className="text-sm text-text mt-2">из 5.0</div>
// //         </motion.div>
// //       </motion.div>

// //       <motion.div
// //         ref={amenitiesRef}
// //         variants={containerVariants}
// //         initial="hidden"
// //         animate="visible"
// //         className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8"
// //       >
// //         <motion.div
// //           variants={itemVariants}
// //           whileHover={{ y: -5 }}
// //           className="bg-bg rounded-lg shadow-theme p-6 border border-border"
// //         >
// //           <div className="flex items-center">
// //             <h2 className="flex items-center mb-4">
// //               <span className="mr-2">🧻</span> Наличие удобств
// //             </h2>
// //             <CommonInfoTooltip
// //               title="Наличие удобств"
// //               description="Процент отзывов, в которых отмечено наличие туалетной бумаги и мыла"
// //               formula="(COUNT(has_toilet_paper = true) / total_ratings) * 100%"
// //               position="top-right"
// //             />
// //           </div>
// //           <div className="flex flex-col gap-4">
// //             <div>
// //               <div className="flex justify-between mb-2">
// //                 <span className="font-medium">Туалетная бумага</span>
// //                 <span className="text-sm">
// //                   {stats.toiletsWithPaper} / {stats.totalRatings} (
// //                   {stats.paperAvailabilityPercent}%)
// //                 </span>
// //               </div>
// //               <div className="w-full bg-border rounded-full h-3">
// //                 <motion.div
// //                   initial={{ width: 0 }}
// //                   animate={{ width: `${stats.paperAvailabilityPercent}%` }}
// //                   transition={{ duration: 0.8, ease: "easeOut" }}
// //                   className="bg-green-500 rounded-full h-3"
// //                 />
// //               </div>
// //             </div>
// //             <div>
// //               <div className="flex justify-between mb-2">
// //                 <span className="font-medium">Мыло</span>
// //                 <span className="text-sm">
// //                   {stats.toiletsWithSoap} / {stats.totalRatings} (
// //                   {stats.soapAvailabilityPercent}%)
// //                 </span>
// //               </div>
// //               <div className="w-full bg-border rounded-full h-3">
// //                 <motion.div
// //                   initial={{ width: 0 }}
// //                   animate={{ width: `${stats.soapAvailabilityPercent}%` }}
// //                   transition={{ duration: 0.8, ease: "easeOut" }}
// //                   className="bg-blue-500 rounded-full h-3"
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         </motion.div>

// //         <motion.div
// //           variants={itemVariants}
// //           whileHover={{ y: -5 }}
// //           className="bg-bg rounded-lg shadow-theme p-6 border border-border"
// //         >
// //           <div className="flex items-center">
// //             <h2 className="flex items-center mb-4">
// //               <span className="mr-2">🏆</span> Самый активный туалет
// //             </h2>
// //             <CommonInfoTooltip
// //               title="Самый активный туалет"
// //               description="Туалет с наибольшим количеством оставленных отзывов"
// //               formula="MAX(COUNT(ratings))"
// //               position="top-right"
// //             />
// //           </div>
// //           <div className="text-center">
// //             <div className="text-2xl font-bold text-accent mb-2">
// //               {stats.mostActiveToilet.name}
// //             </div>
// //             <div className="text-text">
// //               Количество отзывов: {stats.mostActiveToilet.ratingCount}
// //             </div>
// //           </div>
// //         </motion.div>
// //       </motion.div>

// //       <motion.div
// //         ref={topRatedRef}
// //         variants={containerVariants}
// //         initial="hidden"
// //         animate="visible"
// //         className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6 mb-8"
// //       >
// //         <motion.div
// //           variants={itemVariants}
// //           className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden"
// //         >
// //           <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-yellow-500/10 to-transparent">
// //             <div className="flex items-center">
// //               <h2 className="flex items-center">
// //                 <span className="mr-2">⭐</span> Топ-5 туалетов по рейтингу
// //               </h2>

// //               <CommonInfoTooltip
// //                 title="Топ-5 туалетов"
// //                 description="Туалеты с наивысшим средним рейтингом"
// //                 formula="AVG((smell_rating + purity_rating) / 2)"
// //                 position="top-right"
// //               />
// //             </div>
// //           </div>
// //           <div className="flex flex-col">
// //             {stats.topRatedToilets.length > 0 ? (
// //               stats.topRatedToilets.map((toilet, index) => (
// //                 <motion.div
// //                   key={toilet.id}
// //                   initial={{ opacity: 0, x: -20 }}
// //                   animate={{ opacity: 1, x: 0 }}
// //                   transition={{ delay: index * 0.05 }}
// //                   whileHover={{ backgroundColor: "var(--accent-bg)" }}
// //                   className="p-4 border-b border-border cursor-pointer transition-colors"
// //                   onClick={() => scrollToSection(fullListRef)}
// //                 >
// //                   <div className="flex items-center justify-between flex-wrap gap-2">
// //                     <div className="flex items-center">
// //                       <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold mr-3">
// //                         {index + 1}
// //                       </div>
// //                       <div>
// //                         <div className="font-semibold text-text-h">
// //                           {toilet.name}
// //                         </div>
// //                         <div className="text-sm text-text">
// //                           {toilet.ratings?.length || 0} отзывов
// //                         </div>
// //                       </div>
// //                     </div>
// //                     <div className="text-yellow-500 font-bold">
// //                       ⭐{" "}
// //                       {toilet.ratings && toilet.ratings.length > 0
// //                         ? (
// //                             toilet.ratings.reduce(
// //                               (sum, r) =>
// //                                 sum + (r.smellRating + r.purityRating) / 2,
// //                               0,
// //                             ) / toilet.ratings.length
// //                           ).toFixed(1)
// //                         : "Нет оценок"}
// //                     </div>
// //                   </div>
// //                 </motion.div>
// //               ))
// //             ) : (
// //               <div className="p-4 text-center text-text">Нет данных</div>
// //             )}
// //           </div>
// //         </motion.div>

// //         <motion.div
// //           ref={worstRatedRef}
// //           variants={itemVariants}
// //           className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden"
// //         >
// //           <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-red-500/10 to-transparent">
// //             <div className="flex items-center">
// //               <h2 className="flex items-center">
// //                 <span className="mr-2">📉</span> Туалеты для улучшения
// //               </h2>

// //               <CommonInfoTooltip
// //                 title="Туалеты для улучшения"
// //                 description="Туалеты с наименьшим средним рейтингом"
// //                 formula="AVG((smell_rating + purity_rating) / 2) ASC"
// //                 position="top-right"
// //               />
// //             </div>
// //           </div>
// //           <div className="flex flex-col">
// //             {stats.worstRatedToilets.length > 0 ? (
// //               stats.worstRatedToilets.map((toilet, index) => (
// //                 <motion.div
// //                   key={toilet.id}
// //                   initial={{ opacity: 0, x: -20 }}
// //                   animate={{ opacity: 1, x: 0 }}
// //                   transition={{ delay: index * 0.05 }}
// //                   whileHover={{ backgroundColor: "var(--accent-bg)" }}
// //                   className="p-4 border-b border-border cursor-pointer transition-colors"
// //                   onClick={() => scrollToSection(fullListRef)}
// //                 >
// //                   <div className="flex items-center justify-between flex-wrap gap-2">
// //                     <div className="flex items-center">
// //                       <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold mr-3">
// //                         {index + 1}
// //                       </div>
// //                       <div>
// //                         <div className="font-semibold text-text-h">
// //                           {toilet.name}
// //                         </div>
// //                         <div className="text-sm text-text">
// //                           {toilet.ratings?.length || 0} отзывов
// //                         </div>
// //                       </div>
// //                     </div>
// //                     <div className="text-red-500 font-bold">
// //                       ⭐{" "}
// //                       {toilet.ratings && toilet.ratings.length > 0
// //                         ? (
// //                             toilet.ratings.reduce(
// //                               (sum, r) =>
// //                                 sum + (r.smellRating + r.purityRating) / 2,
// //                               0,
// //                             ) / toilet.ratings.length
// //                           ).toFixed(1)
// //                         : "Нет оценок"}
// //                     </div>
// //                   </div>
// //                 </motion.div>
// //               ))
// //             ) : (
// //               <div className="p-4 text-center text-text">Нет данных</div>
// //             )}
// //           </div>
// //         </motion.div>
// //       </motion.div>

// //       <motion.div
// //         ref={fullListRef}
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ delay: 0.5 }}
// //         className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden"
// //       >
// //         <div className="px-6 py-4 border-b border-border">
// //           <div className="flex items-center">
// //             <h2 className="flex items-center">
// //               <span className="mr-2">📋</span> Полный список туалетов
// //             </h2>

// //             <CommonInfoTooltip
// //               title="Полный список"
// //               description="Детальная информация по каждому туалету"
// //               formula="Все данные из таблицы toilets"
// //               position="top-right"
// //             />
// //           </div>
// //         </div>
// //         <div>
// //           {toilets.length > 0 ? (
// //             toilets.map((toilet, index) => {
// //               const avgSmell = toilet.ratings?.length
// //                 ? (
// //                     toilet.ratings.reduce((sum, r) => sum + r.smellRating, 0) /
// //                     toilet.ratings.length
// //                   ).toFixed(1)
// //                 : "Нет оценок";
// //               const avgPurity = toilet.ratings?.length
// //                 ? (
// //                     toilet.ratings.reduce((sum, r) => sum + r.purityRating, 0) /
// //                     toilet.ratings.length
// //                   ).toFixed(1)
// //                 : "Нет оценок";

// //               return (
// //                 <motion.div
// //                   key={toilet.id}
// //                   initial={{ opacity: 0, y: 10 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   transition={{ delay: index * 0.03 }}
// //                   whileHover={{ backgroundColor: "var(--accent-bg)" }}
// //                   className="p-6 border-b border-border transition-colors"
// //                 >
// //                   <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
// //                     <div>
// //                       <h3 className="text-lg font-semibold text-text-h m-0">
// //                         {toilet.name}
// //                       </h3>
// //                       <p className="text-sm text-text mt-1">
// //                         Добавлен:{" "}
// //                         {new Date(toilet.createdAt).toLocaleDateString("ru-RU")}
// //                       </p>
// //                     </div>
// //                     <div className="text-sm bg-accent-bg text-accent px-3 py-1 rounded-full border border-accent-border">
// //                       📝 {toilet.ratings?.length || 0} отзывов
// //                     </div>
// //                   </div>

// //                   {toilet.ratings && toilet.ratings.length > 0 && (
// //                     <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
// //                       <div className="bg-code-bg rounded-md p-3">
// //                         <div className="text-sm text-text mb-1">
// //                           Средний запах
// //                         </div>
// //                         <div className="text-lg font-semibold text-accent">
// //                           {avgSmell} / 5
// //                         </div>
// //                       </div>
// //                       <div className="bg-code-bg rounded-md p-3">
// //                         <div className="text-sm text-text mb-1">
// //                           Средняя чистота
// //                         </div>
// //                         <div className="text-lg font-semibold text-accent">
// //                           {avgPurity} / 5
// //                         </div>
// //                       </div>
// //                       <div className="bg-code-bg rounded-md p-3">
// //                         <div className="text-sm text-text mb-1">Наличие</div>
// //                         <div className="text-sm">
// //                           <div>
// //                             🧻{" "}
// //                             {
// //                               toilet.ratings.filter((r) => r.hasToiletPaper)
// //                                 .length
// //                             }{" "}
// //                             / {toilet.ratings.length}
// //                           </div>
// //                           <div>
// //                             🧼 {toilet.ratings.filter((r) => r.hasSoap).length}{" "}
// //                             / {toilet.ratings.length}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </motion.div>
// //               );
// //             })
// //           ) : (
// //             <div className="p-6 text-center text-text">
// //               Нет данных о туалетах
// //             </div>
// //           )}
// //         </div>
// //       </motion.div>
// //     </motion.div>
// //   );
// // }
