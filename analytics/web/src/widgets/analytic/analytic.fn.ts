import { useState, useCallback } from "react";

export interface TimeFilter {
  from: Date | null;
  to: Date | null;
}

export interface RatingItem {
  id: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
  [key: string]: any;
}

export interface EntityWithRatings<T extends RatingItem = any> {
  id: number;
  name?: string;
  ratings: T[];
  [key: string]: any;
}

export interface AnalyticsStats {
  totalEntities: number;
  totalRatings: number;
  averageRating: number;
  satisfactionRate: number;
  topRatedEntities: EntityWithRatings[];
  worstRatedEntities: EntityWithRatings[];
  mostActiveEntity: { id: number; name: string; ratingCount: number };
}

export interface UseAnalyticsOptions<T extends RatingItem = any> {
  calculateRatingFromItem: (item: T) => number;
  getAdditionalStats?: (
    entities: EntityWithRatings<T>[],
    allRatings: T[],
  ) => Record<string, any>;
  topCount?: number;
}

export interface UseAnalytics<T extends RatingItem = any> {
  entities: EntityWithRatings<T>[];
  loading: boolean;
  error: string | null;
  timeFilter: TimeFilter;
  stats: AnalyticsStats & Record<string, any>;
  fetch: (data: EntityWithRatings<T>[]) => void;
  refetch: (data: EntityWithRatings<T>[]) => void;
  setTimeFilter: (filter: TimeFilter) => void;
  clearFilter: () => void;
}

export function useAnalytics<T extends RatingItem = any>(
  options: UseAnalyticsOptions<T>,
): UseAnalytics<T> {
  const { calculateRatingFromItem, getAdditionalStats, topCount = 5 } = options;

  const [entities, setEntities] = useState<EntityWithRatings<T>[]>([]);
  const [entitiesRaw, setEntitiesRaw] = useState<EntityWithRatings<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilterState] = useState<TimeFilter>({
    from: null,
    to: null,
  });

  const [stats, setStats] = useState<AnalyticsStats & Record<string, any>>({
    totalEntities: 0,
    totalRatings: 0,
    averageRating: 0,
    satisfactionRate: 0,
    topRatedEntities: [],
    worstRatedEntities: [],
    mostActiveEntity: { id: 0, name: "", ratingCount: 0 },
  });

  const filterRatingsByDate = (ratings: T[], filter: TimeFilter): T[] => {
    if (!filter.from && !filter.to) return ratings;

    return ratings.filter((rating) => {
      const ratingDate = new Date(rating.createdAt).getTime();

      let isValid = true;

      if (filter.from) {
        const fromTime = new Date(filter.from).getTime();
        if (ratingDate < fromTime) isValid = false;
      }

      if (filter.to && isValid) {
        const toTime = new Date(filter.to).getTime();
        if (ratingDate > toTime) isValid = false;
      }

      return isValid;
    });
  };

  const applyFilterToEntities = (
    data: EntityWithRatings<T>[],
    filter: TimeFilter,
  ): EntityWithRatings<T>[] => {
    if (!filter.from && !filter.to) return data;

    return data.map((entity) => ({
      ...entity,
      ratings: filterRatingsByDate(entity.ratings || [], filter),
    }));
  };

  const calculateStatsFromEntities = (
    filteredEntities: EntityWithRatings<T>[],
  ) => {
    const allRatings = filteredEntities.flatMap(
      (entity) => entity.ratings || [],
    );

    const totalEntities = filteredEntities.length;
    const totalRatings = allRatings.length;

    // Вычисляем средний рейтинг для каждого отзыва и общий средний
    let totalRatingSum = 0;
    allRatings.forEach((rating) => {
      totalRatingSum += calculateRatingFromItem(rating);
    });
    const avgRating = totalRatings > 0 ? totalRatingSum / totalRatings : 0;
    const satisfactionRate = totalRatings > 0 ? (avgRating / 5) * 100 : 0;

    // Вычисляем рейтинг для каждой сущности
    const entityRatings = filteredEntities.map((entity) => {
      const entityRatingsList = entity.ratings || [];

      const avgRatingValue =
        entityRatingsList.length > 0
          ? entityRatingsList.reduce(
              (sum, r) => sum + calculateRatingFromItem(r),
              0,
            ) / entityRatingsList.length
          : 0;

      return {
        entity,
        avgRating: avgRatingValue,
        ratingCount: entityRatingsList.length,
      };
    });

    const topRated = [...entityRatings]
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, topCount)
      .map((item) => item.entity);

    const worstRated = [...entityRatings]
      .sort((a, b) => a.avgRating - b.avgRating)
      .filter((item) => item.ratingCount > 0)
      .slice(0, topCount)
      .map((item) => item.entity);

    const mostActiveEntityData = [...entityRatings]
      .sort((a, b) => b.ratingCount - a.ratingCount)
      .slice(0, 1)[0];

    const baseStats: AnalyticsStats = {
      totalEntities,
      totalRatings,
      averageRating: Math.round(avgRating * 10) / 10,
      satisfactionRate: Math.round(satisfactionRate),
      topRatedEntities: topRated,
      worstRatedEntities: worstRated,
      mostActiveEntity: {
        id: mostActiveEntityData?.entity?.id || 0,
        name: mostActiveEntityData?.entity?.name || "Нет данных",
        ratingCount: mostActiveEntityData?.ratingCount || 0,
      },
    };

    // Добавляем дополнительные статистики, если они предоставлены
    const additionalStats = getAdditionalStats
      ? getAdditionalStats(filteredEntities, allRatings)
      : {};

    setStats({
      ...baseStats,
      ...additionalStats,
    });
  };

  const processData = useCallback(
    (data: EntityWithRatings<T>[], filter: TimeFilter) => {
      const processedData = data.map((entity) => ({
        ...entity,
        ratings:
          entity.ratings?.map((rating) => ({
            ...rating,
            createdAt: new Date(rating.createdAt),
            // updatedAt: new Date(rating.updatedAt),
          })) || [],
      }));

      setEntitiesRaw(processedData);

      if (filter.from || filter.to) {
        const filtered = applyFilterToEntities(processedData, filter);
        setEntities(filtered);
        calculateStatsFromEntities(filtered);
      } else {
        setEntities(processedData);
        calculateStatsFromEntities(processedData);
      }
    },
    [calculateRatingFromItem, getAdditionalStats],
  );

  const fetchData = useCallback(
    (data: EntityWithRatings<T>[]) => {
      setLoading(true);
      setError(null);

      try {
        processData(data, timeFilter);
      } catch (err) {
        setError("Ошибка при загрузке данных");
        console.error("Error processing data:", err);
      } finally {
        setLoading(false);
      }
    },
    [processData, timeFilter],
  );

  const handleSetTimeFilter = useCallback(
    (filter: TimeFilter) => {
      setTimeFilterState(filter);

      if (entitiesRaw.length > 0) {
        const filtered = applyFilterToEntities(entitiesRaw, filter);
        setEntities(filtered);
        calculateStatsFromEntities(filtered);
      }
    },
    [entitiesRaw],
  );

  const clearFilter = useCallback(() => {
    handleSetTimeFilter({ from: null, to: null });
  }, [handleSetTimeFilter]);

  return {
    entities,
    loading,
    error,
    timeFilter,
    stats,
    fetch: fetchData,
    refetch: fetchData,
    setTimeFilter: handleSetTimeFilter,
    clearFilter,
  };
}
