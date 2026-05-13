import { useEffect, useState } from "react";
import { DefaultApi, ToiletResDto } from "../../features/lib";
import { apiConfig } from "../../config/api";

export function DashboardPage() {
  const [toilets, setToilets] = useState<ToiletResDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toiletsData, ratingsData] = await Promise.all([
          api.toiletsControllerGetAllToilets(),
          api.toiletsControllerGetAllRatings(),
        ]);

        setToilets(toiletsData);

        const totalSmell = ratingsData.reduce(
          (sum, r) => sum + r.smellRating,
          0,
        );
        const totalPurity = ratingsData.reduce(
          (sum, r) => sum + r.purityRating,
          0,
        );
        const avgSmell =
          ratingsData.length > 0 ? totalSmell / ratingsData.length : 0;
        const avgPurity =
          ratingsData.length > 0 ? totalPurity / ratingsData.length : 0;
        const avgRating = (avgSmell + avgPurity) / 2;

        const paperCount = ratingsData.filter((r) => r.hasToiletPaper).length;
        const soapCount = ratingsData.filter((r) => r.hasSoap).length;

        const paperAvailabilityPercent =
          ratingsData.length > 0 ? (paperCount / ratingsData.length) * 100 : 0;
        const soapAvailabilityPercent =
          ratingsData.length > 0 ? (soapCount / ratingsData.length) * 100 : 0;

        const satisfactionRate = (avgRating / 5) * 100;

        const toiletRatings = toiletsData.map((toilet) => {
          const toiletRatingsList = ratingsData.filter((r) =>
            toilet.ratings?.some(
              (tRating: any) => (tRating as any).id === r.id,
            ),
          );

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
          totalToilets: toiletsData.length,
          totalRatings: ratingsData.length,
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
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "24rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "0.5rem" }}>Загрузка данных...</div>
          <div
            style={{
              animation: "spin 1s linear infinite",
              borderRadius: "50%",
              height: "2rem",
              width: "2rem",
              borderBottom: `2px solid var(--accent)`,
              margin: "0 auto",
            }}
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: "rgba(220, 38, 38, 0.1)",
          border: `1px solid rgba(220, 38, 38, 0.4)`,
          color: "#dc2626",
          padding: "1rem",
          borderRadius: "0.5rem",
          margin: "1rem",
        }}
      >
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "0.5rem",
            backgroundColor: "#dc2626",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div
      style={{ padding: "1.5rem", background: "var(--bg)", minHeight: "100vh" }}
    >
      <h1 style={{ marginBottom: "2rem" }}>📊 Статистика туалетов</h1>

      {/* Основные метрики */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            borderRadius: "0.5rem",
            boxShadow: "var(--shadow-theme)",
            padding: "1.5rem",
            color: "white",
          }}
        >
          <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
            Всего туалетов
          </div>
          <div
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              marginTop: "0.5rem",
            }}
          >
            {stats.totalToilets}
          </div>
          <div
            style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.75 }}
          >
            в системе
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            borderRadius: "0.5rem",
            boxShadow: "var(--shadow-theme)",
            padding: "1.5rem",
            color: "white",
          }}
        >
          <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
            Всего отзывов
          </div>
          <div
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              marginTop: "0.5rem",
            }}
          >
            {stats.totalRatings}
          </div>
          <div
            style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.75 }}
          >
            оставлено пользователями
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #a855f7, #9333ea)",
            borderRadius: "0.5rem",
            boxShadow: "var(--shadow-theme)",
            padding: "1.5rem",
            color: "white",
          }}
        >
          <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
            Средний рейтинг
          </div>
          <div
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              marginTop: "0.5rem",
            }}
          >
            {stats.averageRating}
          </div>
          <div
            style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.75 }}
          >
            из 5.0
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            borderRadius: "0.5rem",
            boxShadow: "var(--shadow-theme)",
            padding: "1.5rem",
            color: "white",
          }}
        >
          <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
            Удовлетворенность
          </div>
          <div
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              marginTop: "0.5rem",
            }}
          >
            {stats.satisfactionRate}%
          </div>
          <div
            style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.75 }}
          >
            общая оценка
          </div>
        </div>
      </div>

      {/* Детальные оценки */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "var(--bg)",
            borderRadius: "0.5rem",
            boxShadow: "var(--shadow-theme)",
            padding: "1.5rem",
            border: `1px solid var(--border)`,
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span style={{ marginRight: "0.5rem" }}>👃</span> Оценка запаха
          </h2>
          <div
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "var(--accent)",
              marginBottom: "0.5rem",
            }}
          >
            {stats.averageSmellRating}
          </div>
          <div
            style={{
              width: "100%",
              background: "var(--border)",
              borderRadius: "9999px",
              height: "0.75rem",
            }}
          >
            <div
              style={{
                width: `${(stats.averageSmellRating / 5) * 100}%`,
                background: "var(--accent)",
                borderRadius: "9999px",
                height: "0.75rem",
                transition: "width 0.5s",
              }}
            />
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--text)",
              marginTop: "0.5rem",
            }}
          >
            из 5.0
          </div>
        </div>

        <div
          style={{
            background: "var(--bg)",
            borderRadius: "0.5rem",
            boxShadow: "var(--shadow-theme)",
            padding: "1.5rem",
            border: `1px solid var(--border)`,
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span style={{ marginRight: "0.5rem" }}>✨</span> Оценка чистоты
          </h2>
          <div
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "var(--accent)",
              marginBottom: "0.5rem",
            }}
          >
            {stats.averagePurityRating}
          </div>
          <div
            style={{
              width: "100%",
              background: "var(--border)",
              borderRadius: "9999px",
              height: "0.75rem",
            }}
          >
            <div
              style={{
                width: `${(stats.averagePurityRating / 5) * 100}%`,
                background: "var(--accent)",
                borderRadius: "9999px",
                height: "0.75rem",
                transition: "width 0.5s",
              }}
            />
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--text)",
              marginTop: "0.5rem",
            }}
          >
            из 5.0
          </div>
        </div>
      </div>

      {/* Доступность удобств */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "var(--bg)",
            borderRadius: "0.5rem",
            boxShadow: "var(--shadow-theme)",
            padding: "1.5rem",
            border: `1px solid var(--border)`,
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span style={{ marginRight: "0.5rem" }}>🧻</span> Наличие удобств
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontWeight: "500" }}>Туалетная бумага</span>
                <span style={{ fontSize: "0.875rem" }}>
                  {stats.toiletsWithPaper} / {stats.totalRatings} (
                  {stats.paperAvailabilityPercent}%)
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  background: "var(--border)",
                  borderRadius: "9999px",
                  height: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: `${stats.paperAvailabilityPercent}%`,
                    background: "#22c55e",
                    borderRadius: "9999px",
                    height: "0.75rem",
                    transition: "width 0.5s",
                  }}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontWeight: "500" }}>Мыло</span>
                <span style={{ fontSize: "0.875rem" }}>
                  {stats.toiletsWithSoap} / {stats.totalRatings} (
                  {stats.soapAvailabilityPercent}%)
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  background: "var(--border)",
                  borderRadius: "9999px",
                  height: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: `${stats.soapAvailabilityPercent}%`,
                    background: "#3b82f6",
                    borderRadius: "9999px",
                    height: "0.75rem",
                    transition: "width 0.5s",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--bg)",
            borderRadius: "0.5rem",
            boxShadow: "var(--shadow-theme)",
            padding: "1.5rem",
            border: `1px solid var(--border)`,
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span style={{ marginRight: "0.5rem" }}>🏆</span> Самый активный
            туалет
          </h2>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "var(--accent)",
                marginBottom: "0.5rem",
              }}
            >
              {stats.mostActiveToilet.name}
            </div>
            <div style={{ color: "var(--text)" }}>
              Количество отзывов: {stats.mostActiveToilet.ratingCount}
            </div>
          </div>
        </div>
      </div>

      {/* Топ туалетов */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "var(--bg)",
            borderRadius: "0.5rem",
            boxShadow: "var(--shadow-theme)",
            border: `1px solid var(--border)`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: `1px solid var(--border)`,
              background:
                "linear-gradient(to right, rgba(234, 179, 8, 0.1), transparent)",
            }}
          >
            <h2 style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "0.5rem" }}>⭐</span> Топ-5 туалетов
              по рейтингу
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {stats.topRatedToilets.length > 0 ? (
              stats.topRatedToilets.map((toilet, index) => (
                <div
                  key={toilet.id}
                  style={{
                    padding: "1rem",
                    borderBottom: `1px solid var(--border)`,
                    transition: "background 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--accent-bg)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          width: "2rem",
                          height: "2rem",
                          borderRadius: "9999px",
                          background: "rgba(234, 179, 8, 0.2)",
                          color: "#eab308",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          marginRight: "0.75rem",
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div
                          style={{ fontWeight: "600", color: "var(--text-h)" }}
                        >
                          {toilet.name}
                        </div>
                        <div
                          style={{ fontSize: "0.875rem", color: "var(--text)" }}
                        >
                          {toilet.ratings?.length || 0} отзывов
                        </div>
                      </div>
                    </div>
                    <div style={{ color: "#eab308", fontWeight: "bold" }}>
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
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "var(--text)",
                }}
              >
                Нет данных
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            background: "var(--bg)",
            borderRadius: "0.5rem",
            boxShadow: "var(--shadow-theme)",
            border: `1px solid var(--border)`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: `1px solid var(--border)`,
              background:
                "linear-gradient(to right, rgba(239, 68, 68, 0.1), transparent)",
            }}
          >
            <h2 style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "0.5rem" }}>📉</span> Туалеты для
              улучшения
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {stats.worstRatedToilets.length > 0 ? (
              stats.worstRatedToilets.map((toilet, index) => (
                <div
                  key={toilet.id}
                  style={{
                    padding: "1rem",
                    borderBottom: `1px solid var(--border)`,
                    transition: "background 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--accent-bg)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          width: "2rem",
                          height: "2rem",
                          borderRadius: "9999px",
                          background: "rgba(239, 68, 68, 0.2)",
                          color: "#ef4444",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          marginRight: "0.75rem",
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div
                          style={{ fontWeight: "600", color: "var(--text-h)" }}
                        >
                          {toilet.name}
                        </div>
                        <div
                          style={{ fontSize: "0.875rem", color: "var(--text)" }}
                        >
                          {toilet.ratings?.length || 0} отзывов
                        </div>
                      </div>
                    </div>
                    <div style={{ color: "#ef4444", fontWeight: "bold" }}>
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
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "var(--text)",
                }}
              >
                Нет данных
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Полный список туалетов */}
      <div
        style={{
          background: "var(--bg)",
          borderRadius: "0.5rem",
          boxShadow: "var(--shadow-theme)",
          border: `1px solid var(--border)`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1rem 1.5rem",
            borderBottom: `1px solid var(--border)`,
          }}
        >
          <h2 style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "0.5rem" }}>📋</span> Полный список
            туалетов
          </h2>
        </div>
        <div>
          {toilets.length > 0 ? (
            toilets.map((toilet) => {
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
                <div
                  key={toilet.id}
                  style={{
                    padding: "1.5rem",
                    borderBottom: `1px solid var(--border)`,
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--accent-bg)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "600",
                          color: "var(--text-h)",
                          margin: 0,
                        }}
                      >
                        {toilet.name}
                      </h3>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--text)",
                          marginTop: "0.25rem",
                        }}
                      >
                        Добавлен:{" "}
                        {new Date(toilet.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        background: "var(--accent-bg)",
                        color: "var(--accent)",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        border: `1px solid var(--accent-border)`,
                      }}
                    >
                      📝 {toilet.ratings?.length || 0} отзывов
                    </div>
                  </div>

                  {toilet.ratings && toilet.ratings.length > 0 && (
                    <div
                      style={{
                        marginTop: "1rem",
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          background: "var(--code-bg)",
                          borderRadius: "0.375rem",
                          padding: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--text)",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Средний запах
                        </div>
                        <div
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            color: "var(--accent)",
                          }}
                        >
                          {avgSmell} / 5
                        </div>
                      </div>
                      <div
                        style={{
                          background: "var(--code-bg)",
                          borderRadius: "0.375rem",
                          padding: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--text)",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Средняя чистота
                        </div>
                        <div
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            color: "var(--accent)",
                          }}
                        >
                          {avgPurity} / 5
                        </div>
                      </div>
                      <div
                        style={{
                          background: "var(--code-bg)",
                          borderRadius: "0.375rem",
                          padding: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--text)",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Наличие
                        </div>
                        <div style={{ fontSize: "0.875rem" }}>
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
                </div>
              );
            })
          ) : (
            <div
              style={{
                padding: "1.5rem",
                textAlign: "center",
                color: "var(--text)",
              }}
            >
              Нет данных о туалетах
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { DefaultApi, ToiletResDto } from "../../features/lib";
// import { apiConfig } from "../../config/api";

// export function DashboardPage() {
//   const [toilets, setToilets] = useState<ToiletResDto[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
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

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [toiletsData, ratingsData] = await Promise.all([
//           api.toiletsControllerGetAllToilets(),
//           api.toiletsControllerGetAllRatings(),
//         ]);

//         setToilets(toiletsData);

//         const totalSmell = ratingsData.reduce(
//           (sum, r) => sum + r.smellRating,
//           0,
//         );
//         const totalPurity = ratingsData.reduce(
//           (sum, r) => sum + r.purityRating,
//           0,
//         );
//         const avgSmell =
//           ratingsData.length > 0 ? totalSmell / ratingsData.length : 0;
//         const avgPurity =
//           ratingsData.length > 0 ? totalPurity / ratingsData.length : 0;
//         const avgRating = (avgSmell + avgPurity) / 2;

//         const paperCount = ratingsData.filter((r) => r.hasToiletPaper).length;
//         const soapCount = ratingsData.filter((r) => r.hasSoap).length;

//         const paperAvailabilityPercent =
//           ratingsData.length > 0 ? (paperCount / ratingsData.length) * 100 : 0;
//         const soapAvailabilityPercent =
//           ratingsData.length > 0 ? (soapCount / ratingsData.length) * 100 : 0;

//         const satisfactionRate = (avgRating / 5) * 100;

//         const toiletRatings = toiletsData.map((toilet) => {
//           const toiletRatingsList = ratingsData.filter((r) =>
//             toilet.ratings?.some(
//               (tRating: any) => (tRating as any).id === r.id,
//             ),
//           );

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
//           totalToilets: toiletsData.length,
//           totalRatings: ratingsData.length,
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
//           <div className="text-lg mb-2">Загрузка данных...</div>
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
//         <p>{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           Повторить
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8 text-gray-800">
//         📊 Статистика туалетов
//       </h1>

//       {/* Основные метрики */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
//           <div className="text-sm opacity-90">Всего туалетов</div>
//           <div className="text-4xl font-bold mt-2">{stats.totalToilets}</div>
//           <div className="text-xs mt-2 opacity-75">в системе</div>
//         </div>

//         <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
//           <div className="text-sm opacity-90">Всего отзывов</div>
//           <div className="text-4xl font-bold mt-2">{stats.totalRatings}</div>
//           <div className="text-xs mt-2 opacity-75">
//             оставлено пользователями
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
//           <div className="text-sm opacity-90">Средний рейтинг</div>
//           <div className="text-4xl font-bold mt-2">{stats.averageRating}</div>
//           <div className="text-xs mt-2 opacity-75">из 5.0</div>
//         </div>

//         <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
//           <div className="text-sm opacity-90">Удовлетворенность</div>
//           <div className="text-4xl font-bold mt-2">
//             {stats.satisfactionRate}%
//           </div>
//           <div className="text-xs mt-2 opacity-75">общая оценка</div>
//         </div>
//       </div>

//       {/* Детальные оценки */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4 flex items-center">
//             <span className="mr-2">👃</span> Оценка запаха
//           </h2>
//           <div className="text-3xl font-bold text-purple-600 mb-2">
//             {stats.averageSmellRating}
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-3">
//             <div
//               className="bg-purple-500 h-3 rounded-full transition-all duration-500"
//               style={{ width: `${(stats.averageSmellRating / 5) * 100}%` }}
//             />
//           </div>
//           <div className="text-sm text-gray-500 mt-2">из 5.0</div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4 flex items-center">
//             <span className="mr-2">✨</span> Оценка чистоты
//           </h2>
//           <div className="text-3xl font-bold text-orange-600 mb-2">
//             {stats.averagePurityRating}
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-3">
//             <div
//               className="bg-orange-500 h-3 rounded-full transition-all duration-500"
//               style={{ width: `${(stats.averagePurityRating / 5) * 100}%` }}
//             />
//           </div>
//           <div className="text-sm text-gray-500 mt-2">из 5.0</div>
//         </div>
//       </div>

//       {/* Доступность удобств */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4 flex items-center">
//             <span className="mr-2">🧻</span> Наличие удобств
//           </h2>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between mb-2">
//                 <span className="font-medium">Туалетная бумага</span>
//                 <span className="text-sm">
//                   {stats.toiletsWithPaper} / {stats.totalRatings} (
//                   {stats.paperAvailabilityPercent}%)
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3">
//                 <div
//                   className="bg-green-500 h-3 rounded-full transition-all duration-500"
//                   style={{ width: `${stats.paperAvailabilityPercent}%` }}
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
//               <div className="w-full bg-gray-200 rounded-full h-3">
//                 <div
//                   className="bg-blue-500 h-3 rounded-full transition-all duration-500"
//                   style={{ width: `${stats.soapAvailabilityPercent}%` }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4 flex items-center">
//             <span className="mr-2">🏆</span> Самый активный туалет
//           </h2>
//           <div className="text-center">
//             <div className="text-2xl font-bold text-blue-600 mb-2">
//               {stats.mostActiveToilet.name}
//             </div>
//             <div className="text-gray-600">
//               Количество отзывов: {stats.mostActiveToilet.ratingCount}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Топ туалетов */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow">
//           <div className="px-6 py-4 border-b bg-gradient-to-r from-yellow-50 to-white">
//             <h2 className="text-xl font-semibold flex items-center">
//               <span className="mr-2">⭐</span> Топ-5 туалетов по рейтингу
//             </h2>
//           </div>
//           <div className="divide-y">
//             {stats.topRatedToilets.length > 0 ? (
//               stats.topRatedToilets.map((toilet, index) => (
//                 <div
//                   key={toilet.id}
//                   className="p-4 hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold mr-3">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <div className="font-semibold">{toilet.name}</div>
//                         <div className="text-sm text-gray-500">
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
//                 </div>
//               ))
//             ) : (
//               <div className="p-4 text-gray-500 text-center">Нет данных</div>
//             )}
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow">
//           <div className="px-6 py-4 border-b bg-gradient-to-r from-red-50 to-white">
//             <h2 className="text-xl font-semibold flex items-center">
//               <span className="mr-2">📉</span> Туалеты для улучшения
//             </h2>
//           </div>
//           <div className="divide-y">
//             {stats.worstRatedToilets.length > 0 ? (
//               stats.worstRatedToilets.map((toilet, index) => (
//                 <div
//                   key={toilet.id}
//                   className="p-4 hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold mr-3">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <div className="font-semibold">{toilet.name}</div>
//                         <div className="text-sm text-gray-500">
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
//                 </div>
//               ))
//             ) : (
//               <div className="p-4 text-gray-500 text-center">Нет данных</div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Полный список туалетов */}
//       <div className="bg-white rounded-lg shadow">
//         <div className="px-6 py-4 border-b">
//           <h2 className="text-xl font-semibold flex items-center">
//             <span className="mr-2">📋</span> Полный список туалетов
//           </h2>
//         </div>
//         <div className="divide-y">
//           {toilets.length > 0 ? (
//             toilets.map((toilet) => {
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
//                 <div
//                   key={toilet.id}
//                   className="p-6 hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex justify-between items-start mb-3">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800">
//                         {toilet.name}
//                       </h3>
//                       <p className="text-sm text-gray-500">
//                         Добавлен:{" "}
//                         {new Date(toilet.createdAt).toLocaleDateString("ru-RU")}
//                       </p>
//                     </div>
//                     <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
//                       📝 {toilet.ratings?.length || 0} отзывов
//                     </div>
//                   </div>

//                   {toilet.ratings && toilet.ratings.length > 0 && (
//                     <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="bg-gray-50 rounded p-3">
//                         <div className="text-sm text-gray-600 mb-1">
//                           Средний запах
//                         </div>
//                         <div className="text-lg font-semibold text-purple-600">
//                           {avgSmell} / 5
//                         </div>
//                       </div>
//                       <div className="bg-gray-50 rounded p-3">
//                         <div className="text-sm text-gray-600 mb-1">
//                           Средняя чистота
//                         </div>
//                         <div className="text-lg font-semibold text-orange-600">
//                           {avgPurity} / 5
//                         </div>
//                       </div>
//                       <div className="bg-gray-50 rounded p-3">
//                         <div className="text-sm text-gray-600 mb-1">
//                           Наличие
//                         </div>
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
//                 </div>
//               );
//             })
//           ) : (
//             <div className="p-6 text-center text-gray-500">
//               Нет данных о туалетах
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
