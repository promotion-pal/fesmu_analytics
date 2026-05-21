import { AnimatePresence, motion } from "motion/react";
import { CommonInfoTooltip } from "../../shared/ui/info";
import { ToiletResDto } from "../../features/lib";

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

interface ToiletDetailsModalProps {
  toilet: ToiletResDto | null;
  isOpen: boolean;
  onClose: () => void;
}
function ToiletDetailsModal({
  toilet,
  isOpen,
  onClose,
}: ToiletDetailsModalProps) {
  if (!toilet) return null;

  const calculateAverage = (ratings: any[], field: string) => {
    if (!ratings.length) return 0;
    return ratings.reduce((sum, r) => sum + r[field], 0) / ratings.length;
  };

  const getRatingDistribution = (ratings: any[], field: string) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((rating) => {
      const value = rating[field];
      if (value >= 1 && value <= 5) {
        distribution[value as keyof typeof distribution]++;
      }
    });
    return distribution;
  };

  const smellDistribution = getRatingDistribution(
    toilet.ratings || [],
    "smellRating",
  );
  const purityDistribution = getRatingDistribution(
    toilet.ratings || [],
    "purityRating",
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-bg rounded-lg shadow-theme border border-border z-50"
          >
            <div className="sticky top-0 bg-bg border-b border-border px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-text-h">
                  {toilet.name}
                </h2>
                <p className="text-sm text-text mt-1">
                  📍 {toilet.location} • 👤 {toilet.person} • 🏢 Этаж{" "}
                  {toilet.floor}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-text hover:text-accent transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Общая статистика */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accent-bg rounded-lg p-4 border border-accent-border">
                  <div className="text-sm text-text mb-1">Всего отзывов</div>
                  <div className="text-2xl font-bold text-accent">
                    {toilet.ratings?.length || 0}
                  </div>
                </div>
                <div className="bg-accent-bg rounded-lg p-4 border border-accent-border">
                  <div className="text-sm text-text mb-1">Средний рейтинг</div>
                  <div className="text-2xl font-bold text-accent">
                    {toilet.ratings?.length
                      ? (
                          (calculateAverage(toilet.ratings, "smellRating") +
                            calculateAverage(toilet.ratings, "purityRating")) /
                          2
                        ).toFixed(1)
                      : "Нет данных"}
                  </div>
                </div>
                <div className="bg-accent-bg rounded-lg p-4 border border-accent-border">
                  <div className="text-sm text-text mb-1">
                    Удовлетворенность
                  </div>
                  <div className="text-2xl font-bold text-accent">
                    {toilet.ratings?.length
                      ? Math.round(
                          ((calculateAverage(toilet.ratings, "smellRating") +
                            calculateAverage(toilet.ratings, "purityRating")) /
                            2 /
                            5) *
                            100,
                        )
                      : 0}
                    %
                  </div>
                </div>
              </div>

              {/* Распределение оценок */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Оценки запаха */}
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-text-h mb-3 flex items-center">
                    👃 Распределение оценок запаха
                  </h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-sm w-12">{star} ⭐</span>
                        <div className="flex-1 bg-border rounded-full h-2">
                          <div
                            className="bg-accent rounded-full h-2 transition-all duration-500"
                            style={{
                              width: `${(smellDistribution[star as keyof typeof smellDistribution] / (toilet.ratings?.length || 1)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-text min-w-12">
                          {
                            smellDistribution[
                              star as keyof typeof smellDistribution
                            ]
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="text-sm text-text">
                      Средняя оценка:{" "}
                      {calculateAverage(
                        toilet.ratings || [],
                        "smellRating",
                      ).toFixed(1)}{" "}
                      / 5
                    </div>
                  </div>
                </div>

                {/* Оценки чистоты */}
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-text-h mb-3 flex items-center">
                    ✨ Распределение оценок чистоты
                  </h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-sm w-12">{star} ⭐</span>
                        <div className="flex-1 bg-border rounded-full h-2">
                          <div
                            className="bg-green-500 rounded-full h-2 transition-all duration-500"
                            style={{
                              width: `${(purityDistribution[star as keyof typeof purityDistribution] / (toilet.ratings?.length || 1)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-text min-w-12">
                          {
                            purityDistribution[
                              star as keyof typeof purityDistribution
                            ]
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="text-sm text-text">
                      Средняя оценка:{" "}
                      {calculateAverage(
                        toilet.ratings || [],
                        "purityRating",
                      ).toFixed(1)}{" "}
                      / 5
                    </div>
                  </div>
                </div>
              </div>

              {/* Удобства */}
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-text-h mb-3">
                  🧴 Наличие удобств
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-text mb-2">
                      Туалетная бумага
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-border rounded-full h-2">
                        <div
                          className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                          style={{
                            width: `${(toilet.ratings?.filter((r) => r.hasToiletPaper).length / (toilet.ratings?.length || 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold">
                        {Math.round(
                          (toilet.ratings?.filter((r) => r.hasToiletPaper)
                            .length /
                            (toilet.ratings?.length || 1)) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="text-xs text-text mt-1">
                      {toilet.ratings?.filter((r) => r.hasToiletPaper).length} /{" "}
                      {toilet.ratings?.length} отзывов
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text mb-2">Мыло</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-border rounded-full h-2">
                        <div
                          className="bg-purple-500 rounded-full h-2 transition-all duration-500"
                          style={{
                            width: `${(toilet.ratings?.filter((r) => r.hasSoap).length / (toilet.ratings?.length || 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold">
                        {Math.round(
                          (toilet.ratings?.filter((r) => r.hasSoap).length /
                            (toilet.ratings?.length || 1)) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="text-xs text-text mt-1">
                      {toilet.ratings?.filter((r) => r.hasSoap).length} /{" "}
                      {toilet.ratings?.length} отзывов
                    </div>
                  </div>
                </div>
              </div>

              {/* Комментарии */}
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-text-h mb-3 flex items-center">
                  💬 Комментарии пользователей
                  <span className="ml-2 text-sm text-text">
                    ({toilet.ratings?.filter((r) => r.comment).length}{" "}
                    комментариев)
                  </span>
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {toilet.ratings?.filter((r) => r.comment).length > 0 ? (
                    toilet.ratings
                      .filter((rating) => rating.comment)
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime(),
                      )
                      .map((rating, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-code-bg rounded-lg p-4 border border-border"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-2">
                              <span className="text-sm bg-accent-bg text-accent px-2 py-1 rounded">
                                👃 {rating.smellRating}/5
                              </span>
                              <span className="text-sm bg-accent-bg text-accent px-2 py-1 rounded">
                                ✨ {rating.purityRating}/5
                              </span>
                            </div>
                            <div className="text-xs text-text">
                              📅{" "}
                              {new Date(rating.createdAt).toLocaleDateString(
                                "ru-RU",
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mb-2">
                            {rating.hasToiletPaper && (
                              <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                                🧻 Есть бумага
                              </span>
                            )}
                            {rating.hasSoap && (
                              <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">
                                🧼 Есть мыло
                              </span>
                            )}
                          </div>
                          <p className="text-text-h mt-2">{rating.comment}</p>
                        </motion.div>
                      ))
                  ) : (
                    <div className="text-center text-text py-8">
                      💭 Нет комментариев к этому туалету
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export { ErrorMessage, MetricCard, LoadingSpinner, ToiletDetailsModal };

import { motion, AnimatePresence } from "motion/react";

export interface EntityDetailsModalProps<T = any> {
  entity: T | null;
  isOpen: boolean;
  onClose: () => void;
  config: EntityConfig<T>;
}

export interface EntityConfig<T> {
  // Основная информация
  title: string;
  getSubtitle: (entity: T) => string;

  // Поля для общей статистики
  getTotalRatings: (entity: T) => number;
  getAverageRating: (entity: T) => number;
  getSatisfactionRate: (entity: T) => number;

  // Поля для распределения оценок
  ratingFields: RatingField[];

  // Дополнительные метрики (опционально)
  additionalMetrics?: AdditionalMetric<T>[];

  // Комментарии
  getComments: (
    entity: T,
  ) => Array<{ text: string; createdAt: Date | string; [key: string]: any }>;
  renderCommentDetails?: (comment: any) => React.ReactNode;
}

export interface RatingField {
  key: string;
  label: string;
  icon: string;
  color: string;
  getValue: (rating: any) => number;
  getDistribution: (ratings: any[]) => Record<number, number>;
}

export interface AdditionalMetric<T> {
  label: string;
  icon: string;
  color: string;
  getValue: (entity: T) => { current: number; total: number; percent: number };
}

function EntityDetailsModal<T>({
  entity,
  isOpen,
  onClose,
  config,
}: EntityDetailsModalProps<T>) {
  if (!entity) return null;

  const totalRatings = config.getTotalRatings(entity);
  const averageRating = config.getAverageRating(entity);
  const satisfactionRate = config.getSatisfactionRate(entity);
  const comments = config.getComments(entity);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-bg rounded-lg shadow-theme border border-border z-50"
          >
            <div className="sticky top-0 bg-bg border-b border-border px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-text-h">
                  {(entity as any).name}
                </h2>
                <p className="text-sm text-text mt-1">
                  {config.getSubtitle(entity)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-text hover:text-accent transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Общая статистика */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accent-bg rounded-lg p-4 border border-accent-border">
                  <div className="text-sm text-text mb-1">Всего отзывов</div>
                  <div className="text-2xl font-bold text-accent">
                    {totalRatings}
                  </div>
                </div>
                <div className="bg-accent-bg rounded-lg p-4 border border-accent-border">
                  <div className="text-sm text-text mb-1">Средний рейтинг</div>
                  <div className="text-2xl font-bold text-accent">
                    {averageRating > 0
                      ? averageRating.toFixed(1)
                      : "Нет данных"}
                  </div>
                </div>
                <div className="bg-accent-bg rounded-lg p-4 border border-accent-border">
                  <div className="text-sm text-text mb-1">
                    Удовлетворенность
                  </div>
                  <div className="text-2xl font-bold text-accent">
                    {satisfactionRate > 0
                      ? `${satisfactionRate}%`
                      : "Нет данных"}
                  </div>
                </div>
              </div>

              {/* Распределение оценок */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {config.ratingFields.map((field) => {
                  const ratings = (entity as any).ratings || [];
                  const distribution = field.getDistribution(ratings);
                  const avgValue = ratings.length
                    ? ratings.reduce(
                        (sum: number, r: any) => sum + field.getValue(r),
                        0,
                      ) / ratings.length
                    : 0;

                  return (
                    <div
                      key={field.key}
                      className="border border-border rounded-lg p-4"
                    >
                      <h3 className="font-semibold text-text-h mb-3 flex items-center">
                        {field.icon} Распределение оценок {field.label}
                      </h3>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-sm w-12">{star} ⭐</span>
                            <div className="flex-1 bg-border rounded-full h-2">
                              <div
                                className={`${field.color} rounded-full h-2 transition-all duration-500`}
                                style={{
                                  width: `${(distribution[star] / (ratings.length || 1)) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-text min-w-12">
                              {distribution[star] || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-border">
                        <div className="text-sm text-text">
                          Средняя оценка: {avgValue.toFixed(1)} / 5
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Дополнительные метрики */}
              {config.additionalMetrics &&
                config.additionalMetrics.length > 0 && (
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold text-text-h mb-3">
                      📊 Дополнительные показатели
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {config.additionalMetrics.map((metric) => {
                        const { current, total, percent } =
                          metric.getValue(entity);
                        return (
                          <div key={metric.label}>
                            <div className="text-sm text-text mb-2">
                              {metric.icon} {metric.label}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-border rounded-full h-2">
                                <div
                                  className={`${metric.color} rounded-full h-2 transition-all duration-500`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold">
                                {Math.round(percent)}%
                              </span>
                            </div>
                            <div className="text-xs text-text mt-1">
                              {current} / {total} отзывов
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Комментарии */}
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-text-h mb-3 flex items-center">
                  💬 Комментарии пользователей
                  <span className="ml-2 text-sm text-text">
                    ({comments.length} комментариев)
                  </span>
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {comments.length > 0 ? (
                    comments
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime(),
                      )
                      .map((comment, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-code-bg rounded-lg p-4 border border-border"
                        >
                          {config.renderCommentDetails ? (
                            config.renderCommentDetails(comment)
                          ) : (
                            <>
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-2">
                                  {config.ratingFields.map((field) => (
                                    <span
                                      key={field.key}
                                      className="text-sm bg-accent-bg text-accent px-2 py-1 rounded"
                                    >
                                      {field.icon} {field.getValue(comment)}/5
                                    </span>
                                  ))}
                                </div>
                                <div className="text-xs text-text">
                                  📅{" "}
                                  {new Date(
                                    comment.createdAt,
                                  ).toLocaleDateString("ru-RU")}
                                </div>
                              </div>
                              <p className="text-text-h mt-2">
                                {comment.text || comment.comment}
                              </p>
                            </>
                          )}
                        </motion.div>
                      ))
                  ) : (
                    <div className="text-center text-text py-8">
                      💭 Нет комментариев
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export const toiletEntityConfig: EntityConfig<any> = {
  title: "Туалет",
  getSubtitle: (toilet) =>
    `📍 ${toilet.location} • 👤 ${toilet.person} • 🏢 Этаж ${toilet.floor}`,

  getTotalRatings: (toilet) => toilet.ratings?.length || 0,
  getAverageRating: (toilet) => {
    const ratings = toilet.ratings || [];
    if (!ratings.length) return 0;
    const avgSmell =
      ratings.reduce((sum: number, r: any) => sum + r.smellRating, 0) /
      ratings.length;
    const avgPurity =
      ratings.reduce((sum: number, r: any) => sum + r.purityRating, 0) /
      ratings.length;
    return (avgSmell + avgPurity) / 2;
  },
  getSatisfactionRate: (toilet) => {
    const avgRating = toiletEntityConfig.getAverageRating(toilet);
    return avgRating ? Math.round((avgRating / 5) * 100) : 0;
  },

  ratingFields: [
    {
      key: "smellRating",
      label: "запаха",
      icon: "👃",
      color: "bg-accent",
      getValue: (rating) => rating.smellRating,
      getDistribution: (ratings) => {
        const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach((r) => {
          const val = r.smellRating;
          if (val >= 1 && val <= 5) dist[val as keyof typeof dist]++;
        });
        return dist;
      },
    },
    {
      key: "purityRating",
      label: "чистоты",
      icon: "✨",
      color: "bg-green-500",
      getValue: (rating) => rating.purityRating,
      getDistribution: (ratings) => {
        const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach((r) => {
          const val = r.purityRating;
          if (val >= 1 && val <= 5) dist[val as keyof typeof dist]++;
        });
        return dist;
      },
    },
  ],

  additionalMetrics: [
    {
      label: "Туалетная бумага",
      icon: "🧻",
      color: "bg-blue-500",
      getValue: (toilet) => {
        const ratings = toilet.ratings || [];
        const current = ratings.filter((r: any) => r.hasToiletPaper).length;
        const total = ratings.length;
        return { current, total, percent: total ? (current / total) * 100 : 0 };
      },
    },
    {
      label: "Мыло",
      icon: "🧼",
      color: "bg-purple-500",
      getValue: (toilet) => {
        const ratings = toilet.ratings || [];
        const current = ratings.filter((r: any) => r.hasSoap).length;
        const total = ratings.length;
        return { current, total, percent: total ? (current / total) * 100 : 0 };
      },
    },
  ],

  getComments: (toilet) => {
    return (toilet.ratings || [])
      .filter((r: any) => r.comment)
      .map((r: any) => ({
        text: r.comment,
        createdAt: r.createdAt,
        smellRating: r.smellRating,
        purityRating: r.purityRating,
        hasToiletPaper: r.hasToiletPaper,
        hasSoap: r.hasSoap,
      }));
  },
};

export const lectureHallEntityConfig: EntityConfig<any> = {
  title: "Лекционный зал",
  getSubtitle: (hall) => `📍 ${hall.location}`,

  getTotalRatings: (hall) => hall.ratings?.length || 0,
  getAverageRating: (hall) => {
    const ratings = hall.ratings || [];
    if (!ratings.length) return 0;
    const avgCleanliness =
      ratings.reduce((sum: number, r: any) => sum + r.cleanliness, 0) /
      ratings.length;
    const avgComfort =
      ratings.reduce((sum: number, r: any) => sum + r.comfort, 0) /
      ratings.length;
    const avgEquipment =
      ratings.reduce((sum: number, r: any) => sum + r.equipment, 0) /
      ratings.length;
    return (avgCleanliness + avgComfort + avgEquipment) / 3;
  },
  getSatisfactionRate: (hall) => {
    const avgRating = lectureHallEntityConfig.getAverageRating(hall);
    return avgRating ? Math.round((avgRating / 5) * 100) : 0;
  },

  ratingFields: [
    {
      key: "cleanliness",
      label: "чистоты",
      icon: "🧹",
      color: "bg-accent",
      getValue: (rating) => rating.cleanliness,
      getDistribution: (ratings) => {
        const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach((r) => {
          const val = r.cleanliness;
          if (val >= 1 && val <= 5) dist[val as keyof typeof dist]++;
        });
        return dist;
      },
    },
    {
      key: "comfort",
      label: "комфорта",
      icon: "🪑",
      color: "bg-green-500",
      getValue: (rating) => rating.comfort,
      getDistribution: (ratings) => {
        const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach((r) => {
          const val = r.comfort;
          if (val >= 1 && val <= 5) dist[val as keyof typeof dist]++;
        });
        return dist;
      },
    },
    {
      key: "equipment",
      label: "оснащённости",
      icon: "💻",
      color: "bg-purple-500",
      getValue: (rating) => rating.equipment,
      getDistribution: (ratings) => {
        const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach((r) => {
          const val = r.equipment;
          if (val >= 1 && val <= 5) dist[val as keyof typeof dist]++;
        });
        return dist;
      },
    },
  ],

  getComments: (hall) => {
    return (hall.ratings || [])
      .filter((r: any) => r.comment)
      .map((r: any) => ({
        text: r.comment,
        createdAt: r.createdAt,
        cleanliness: r.cleanliness,
        comfort: r.comfort,
        equipment: r.equipment,
      }));
  },
};

export { EntityDetailsModal };
