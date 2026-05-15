import { useState, useCallback } from "react";
import { DefaultApi, ToiletResDto } from "../../features/lib";
import { apiConfig } from "../../config/api";

interface TimeFilter {
  from: Date | null;
  to: Date | null;
}

interface UseAnalytic {
  toilets: ToiletResDto[];
  loading: boolean;
  error: string | null;
  timeFilter: TimeFilter;
  stats: {
    totalToilets: number;
    totalRatings: number;
    averageSmellRating: number;
    averagePurityRating: number;
    toiletsWithPaper: number;
    toiletsWithSoap: number;
    topRatedToilets: ToiletResDto[];
    worstRatedToilets: ToiletResDto[];
    averageRating: number;
    satisfactionRate: number;
    mostActiveToilet: { id: number; name: string; ratingCount: number };
    paperAvailabilityPercent: number;
    soapAvailabilityPercent: number;
  };
  fetch: () => Promise<void>;
  refetch: () => Promise<void>;
  setTimeFilter: (filter: TimeFilter) => void;
}

export function useAnalytic(): UseAnalytic {
  const [toilets, setToilets] = useState<ToiletResDto[]>([]);
  const [toiletsRaw, setToiletsRaw] = useState<ToiletResDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>({
    from: null,
    to: null,
  });
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

  const filterRatingsByDate = (ratings: any[], filter: TimeFilter) => {
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

  const applyFilterToToilets = (data: ToiletResDto[], filter: TimeFilter) => {
    if (!filter.from && !filter.to) return data;

    return data.map((toilet) => ({
      ...toilet,
      ratings: filterRatingsByDate(toilet.ratings || [], filter),
    }));
  };

  const calculateStatsFromToilets = (filteredToilets: ToiletResDto[]) => {
    const allRatings = filteredToilets.flatMap(
      (toilet) => toilet.ratings || [],
    );

    const totalToilets = filteredToilets.length;
    const totalRatings = allRatings.length;

    const totalSmell = allRatings.reduce((sum, r) => sum + r.smellRating, 0);
    const totalPurity = allRatings.reduce((sum, r) => sum + r.purityRating, 0);
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
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const toiletsData = await api.toiletsControllerGetAllToilets();

      const processedData = toiletsData.map((toilet) => ({
        ...toilet,
        ratings:
          toilet.ratings?.map((rating) => ({
            ...rating,
            createdAt: new Date(rating.createdAt),
            updatedAt: new Date(rating.updatedAt),
          })) || [],
      }));

      setToiletsRaw(processedData);

      if (timeFilter.from || timeFilter.to) {
        const filtered = applyFilterToToilets(processedData, timeFilter);
        setToilets(filtered);
        calculateStatsFromToilets(filtered);
      } else {
        setToilets(processedData);
        calculateStatsFromToilets(processedData);
      }
    } catch (err) {
      setError("Ошибка при загрузке данных");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [api, timeFilter]);

  const handleSetTimeFilter = useCallback(
    (filter: TimeFilter) => {
      setTimeFilter(filter);

      if (toiletsRaw.length > 0) {
        const filtered = applyFilterToToilets(toiletsRaw, filter);
        setToilets(filtered);
        calculateStatsFromToilets(filtered);
      }
    },
    [toiletsRaw],
  );

  return {
    toilets,
    loading,
    error,
    timeFilter,
    stats,
    fetch: fetchData,
    refetch: fetchData,
    setTimeFilter: handleSetTimeFilter,
  };
}
