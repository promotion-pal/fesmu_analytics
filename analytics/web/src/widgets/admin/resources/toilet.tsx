import { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  useGetList,
  Loading,
  TextInput,
  DateInput,
  ShowButton,
  Show,
  TabbedShowLayout,
  Tab,
  useShowController,
  NumberInput,
  Create,
  SimpleForm,
  Edit,
  EditButton,
  DeleteButton,
  CreateButton,
  TopToolbar,
  useRedirect,
  useNotify,
} from "react-admin";
import { Plus } from "lucide-react";
import { ToiletResDto } from "../../../features/lib";
import { CommonInfoTooltip } from "../../../shared/ui/info";
import { MetricCard, ToiletDetailsModal } from "../../analytic/analytic.ui";
import { scrollToSection } from "../../../features/utils/scroll";

const toiletFilters = [
  <TextInput source="name" label="Название" alwaysOn />,
  <DateInput source="createdAt_gte" label="Создан от" />,
  <DateInput source="createdAt_lte" label="Создан до" />,
];

// Кастомные действия для списка
const ListActions = () => (
  <TopToolbar>
    <CreateButton label="Добавить туалет" />
  </TopToolbar>
);

const ToiletStats = ({
  data,
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
  onRefresh?: () => void;
}) => {
  const [selectedToilet, setSelectedToilet] = useState<ToiletResDto | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fullListRef = useRef<HTMLDivElement>(null);
  const redirect = useRedirect();
  const notify = useNotify();

  if (isLoading || !data) {
    return <Loading />;
  }

  const toilets = data;

  const allRatings = toilets.flatMap((toilet: any) => toilet.ratings || []);
  const totalToilets = toilets.length;
  const totalRatings = allRatings.length;

  const totalSmell = allRatings.reduce(
    (sum: number, r: any) => sum + r.smellRating,
    0,
  );
  const totalPurity = allRatings.reduce(
    (sum: number, r: any) => sum + r.purityRating,
    0,
  );
  const avgSmell = totalRatings > 0 ? totalSmell / totalRatings : 0;
  const avgPurity = totalRatings > 0 ? totalPurity / totalRatings : 0;
  const avgRating = (avgSmell + avgPurity) / 2;
  const satisfactionRate = (avgRating / 5) * 100;

  const paperCount = allRatings.filter((r: any) => r.hasToiletPaper).length;
  const soapCount = allRatings.filter((r: any) => r.hasSoap).length;
  const paperAvailabilityPercent =
    totalRatings > 0 ? (paperCount / totalRatings) * 100 : 0;
  const soapAvailabilityPercent =
    totalRatings > 0 ? (soapCount / totalRatings) * 100 : 0;

  const toiletRatings = toilets.map((toilet: any) => {
    const ratings = toilet.ratings || [];
    const avgRatingValue =
      ratings.length > 0
        ? ratings.reduce(
            (sum: number, r: any) => sum + (r.smellRating + r.purityRating) / 2,
            0,
          ) / ratings.length
        : 0;
    return { toilet, avgRating: avgRatingValue, ratingCount: ratings.length };
  });

  const topRatedToilets = [...toiletRatings]
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5)
    .map((item) => item.toilet);

  const worstRatedToilets = [...toiletRatings]
    .sort((a, b) => a.avgRating - b.avgRating)
    .filter((item) => item.ratingCount > 0)
    .slice(0, 5)
    .map((item) => item.toilet);

  const mostActiveToilet = [...toiletRatings]
    .sort((a, b) => b.ratingCount - a.ratingCount)
    .slice(0, 1)[0];

  const stats = {
    totalToilets,
    totalRatings,
    averageSmellRating: Math.round(avgSmell * 10) / 10,
    averagePurityRating: Math.round(avgPurity * 10) / 10,
    averageRating: Math.round(avgRating * 10) / 10,
    satisfactionRate: Math.round(satisfactionRate),
    paperAvailabilityPercent: Math.round(paperAvailabilityPercent),
    soapAvailabilityPercent: Math.round(soapAvailabilityPercent),
    toiletsWithPaper: paperCount,
    toiletsWithSoap: soapCount,
    mostActiveToilet: {
      id: mostActiveToilet?.toilet?.id || 0,
      name: mostActiveToilet?.toilet?.name || "Нет данных",
      ratingCount: mostActiveToilet?.ratingCount || 0,
    },
    topRatedToilets,
    worstRatedToilets,
  };

  const handleOpenModal = (toilet: ToiletResDto) => {
    setSelectedToilet(toilet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedToilet(null);
  };

  const handleCreateToilet = () => {
    // redirect("/toilets/create");
    // redirect("/admin/dashboard#/toilets/create");

    redirect("create", "toilets");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-bg min-h-screen rounded-lg"
      >
        {/* Заголовок с кнопками */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-0"
          >
            🚽 Статистика туалетов
          </motion.h1>

          {/* <div className="flex gap-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-bg border border-border rounded-lg hover:bg-accent-bg transition-all flex items-center gap-2 text-text"
              >
                <RefreshCw size={18} />
                Обновить
              </button>
            )}

            <button
              onClick={handleCreateToilet}
              className="px-4 py-2 bg-gradient-to-r from-accent to-accent/80 text-white rounded-lg hover:from-accent/90 hover:to-accent/70 transition-all flex items-center gap-2 font-semibold shadow-md"
            >
              <Plus size={18} />
              Добавить туалет
            </button>
          </div> */}
        </div>

        {/* Метрики */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-8">
          <MetricCard
            tooltipFormula="COUNT(DISTINCT toilets.id)"
            gradient="from-blue-600 to-blue-700"
            label="Всего туалетов"
            value={stats.totalToilets}
            unit="в системе"
            tooltipTitle="Всего туалетов"
            tooltipDescription="Общее количество туалетов, зарегистрированных в системе"
            onClick={() => scrollToSection(fullListRef)}
          />
          <MetricCard
            gradient="from-green-500 to-green-600"
            label="Всего отзывов"
            tooltipFormula="SUM(ratings.count)"
            value={stats.totalRatings}
            unit="оставлено пользователями"
            tooltipTitle="Всего отзывов"
            tooltipDescription="Общее количество оставленных пользователями отзывов"
            onClick={() => scrollToSection(fullListRef)}
          />
          <MetricCard
            gradient="from-purple-500 to-purple-600"
            label="Средний рейтинг"
            tooltipFormula="(AVG(smell_rating) + AVG(purity_rating)) / 2"
            value={stats.averageRating}
            unit="из 5.0"
            tooltipTitle="Средний рейтинг"
            tooltipDescription="Средняя оценка всех туалетов по всем критериям"
          />
          <MetricCard
            gradient="from-orange-500 to-orange-600"
            label="Удовлетворенность"
            value={`${stats.satisfactionRate}%`}
            unit="общая оценка"
            tooltipTitle="Удовлетворенность"
            tooltipFormula="(average_rating / 5) * 100%"
            tooltipDescription="Процент пользователей, удовлетворенных состоянием туалетов"
          />
        </div>

        {/* Оценки */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8">
          <motion.div
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
              />
            </div>
            <div className="text-3xl font-bold text-accent mb-2">
              {stats.averageSmellRating}
            </div>
            <div className="w-full bg-border rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.averageSmellRating / 5) * 100}%` }}
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
              />
            </div>
            <div className="text-3xl font-bold text-accent mb-2">
              {stats.averagePurityRating}
            </div>
            <div className="w-full bg-border rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.averagePurityRating / 5) * 100}%` }}
                className="bg-accent rounded-full h-3"
              />
            </div>
            <div className="text-sm text-text mt-2">из 5.0</div>
          </motion.div>
        </div>

        {/* Удобства и активный туалет */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8">
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
                description="Процент отзывов с наличием туалетной бумаги и мыла"
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
                description="Туалет с наибольшим количеством отзывов"
              />
            </div>
            <div className="text-center">
              <button
                onClick={() => {
                  const activeToilet = toilets.find(
                    (t: any) => t.id === stats.mostActiveToilet.id,
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
        </div>

        {/* Топ-5 и худшие */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6 mb-8">
          <div className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-yellow-500/10 to-transparent">
              <div className="flex items-center">
                <h2 className="flex items-center">
                  <span className="mr-2">⭐</span> Топ-5 туалетов по рейтингу
                </h2>
              </div>
            </div>
            <div className="flex flex-col">
              {stats.topRatedToilets.map((toilet, index) => (
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
                      {toilet.ratings?.length > 0
                        ? (
                            toilet.ratings.reduce(
                              (sum: number, r: any) =>
                                sum + (r.smellRating + r.purityRating) / 2,
                              0,
                            ) / toilet.ratings.length
                          ).toFixed(1)
                        : "Нет оценок"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-red-500/10 to-transparent">
              <div className="flex items-center">
                <h2 className="flex items-center">
                  <span className="mr-2">📉</span> Туалеты для улучшения
                </h2>
              </div>
            </div>
            <div className="flex flex-col">
              {stats.worstRatedToilets.map((toilet, index) => (
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
                      {toilet.ratings?.length > 0
                        ? (
                            toilet.ratings.reduce(
                              (sum: number, r: any) =>
                                sum + (r.smellRating + r.purityRating) / 2,
                              0,
                            ) / toilet.ratings.length
                          ).toFixed(1)
                        : "Нет оценок"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Полный список */}
        <div
          ref={fullListRef}
          className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="flex items-center">
              <span className="mr-2">📋</span> Полный список туалетов
            </h2>

            <button
              onClick={handleCreateToilet}
              className="px-3 py-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-all flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Добавить
            </button>
          </div>

          <div>
            {toilets.map((toilet: any, index: number) => {
              const avgSmell = toilet.ratings?.length
                ? (
                    toilet.ratings.reduce(
                      (sum: number, r: any) => sum + r.smellRating,
                      0,
                    ) / toilet.ratings.length
                  ).toFixed(1)
                : "Нет оценок";
              const avgPurity = toilet.ratings?.length
                ? (
                    toilet.ratings.reduce(
                      (sum: number, r: any) => sum + r.purityRating,
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
                        {new Date(toilet.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                    <div className="text-sm bg-accent-bg text-accent px-3 py-1 rounded-full border border-accent-border">
                      📝 {toilet.ratings?.length || 0} отзывов
                    </div>
                  </div>

                  {toilet.ratings?.length > 0 && (
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
                              toilet.ratings.filter(
                                (r: any) => r.hasToiletPaper,
                              ).length
                            }{" "}
                            / {toilet.ratings.length}
                          </div>
                          <div>
                            🧼{" "}
                            {
                              toilet.ratings.filter((r: any) => r.hasSoap)
                                .length
                            }{" "}
                            / {toilet.ratings.length}
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
                      Детальная аналитика →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <ToiletDetailsModal
        toilet={selectedToilet}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

// Основной компонент для react-admin
export const ToilePanel = () => {
  const { data, isLoading, error, refetch } = useGetList("toilets", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "createdAt", order: "DESC" },
  });

  if (isLoading) return <Loading />;
  if (error) return null;

  return <ToiletStats data={data} isLoading={isLoading} onRefresh={refetch} />;
};

// Список туалетов с кнопкой создания
export const ToiletList = () => (
  <List filters={toiletFilters} actions={<ListActions />}>
    <Datagrid rowClick="show" bulkActionButtons={true}>
      <TextField source="name" label="Название" />
      <NumberField source="floor" label="Этаж" />
      <TextField source="person" label="Тип" />
      <TextField source="location" label="Местоположение" />
      <DateField source="createdAt" label="Создан" />
      <ShowButton />
      <EditButton />
      <DeleteButton mutationMode="pessimistic" />
    </Datagrid>
  </List>
);

// Просмотр туалета
export const ToiletShow = () => {
  const { record } = useShowController();
  if (!record) return null;

  const avgSmell = record.ratings?.length
    ? (
        record.ratings.reduce((sum: number, r: any) => sum + r.smellRating, 0) /
        record.ratings.length
      ).toFixed(1)
    : "Нет оценок";
  const avgPurity = record.ratings?.length
    ? (
        record.ratings.reduce(
          (sum: number, r: any) => sum + r.purityRating,
          0,
        ) / record.ratings.length
      ).toFixed(1)
    : "Нет оценок";

  return (
    <Show>
      <TabbedShowLayout>
        <Tab label="Основная информация">
          <TextField source="name" label="Название" />
          <NumberField source="floor" label="Этаж" />
          <TextField source="person" label="Тип" />
          <TextField source="location" label="Местоположение" />
          <DateField source="createdAt" label="Создан" />
          <DateField source="updatedAt" label="Обновлен" />
        </Tab>
        <Tab label="Статистика оценок">
          <div className="p-4">
            <h3>Средняя оценка запаха: {avgSmell} / 5</h3>
            <h3>Средняя оценка чистоты: {avgPurity} / 5</h3>
            <h3>Всего оценок: {record.ratings?.length || 0}</h3>
          </div>
        </Tab>
        <Tab label="Отзывы">
          <Datagrid data={record.ratings || []} resource="ratings">
            <NumberField source="smellRating" label="Запах" />
            <NumberField source="purityRating" label="Чистота" />
            <TextField source="comment" label="Комментарий" />
            <DateField source="createdAt" label="Дата" />
          </Datagrid>
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};

// Создание туалета
export const ToiletCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Название" required />
      <NumberInput source="floor" label="Этаж" required />
      <TextInput source="person" label="Тип (MAN/WOMAN)" required />
      <TextInput source="location" label="Местоположение" required />
    </SimpleForm>
  </Create>
);

// Редактирование туалета
export const ToiletEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Название" />
      <NumberInput source="floor" label="Этаж" />
      <TextInput source="person" label="Тип (MAN/WOMAN)" />
      <TextInput source="location" label="Местоположение" />
    </SimpleForm>
  </Edit>
);

// import { useState, useRef } from "react";
// import { motion } from "motion/react";
// import {
//   List,
//   Datagrid,
//   TextField,
//   NumberField,
//   DateField,
//   useGetList,
//   Loading,
//   TextInput,
//   DateInput,
//   ShowButton,
//   Show,
//   TabbedShowLayout,
//   Tab,
//   useShowController,
//   NumberInput,
//   Create,
//   SimpleForm,
//   Edit,
//   EditButton,
//   DeleteButton,
// } from "react-admin";
// import { ToiletResDto } from "../../../features/lib";
// import { CommonInfoTooltip } from "../../../shared/ui/info";
// import { MetricCard, ToiletDetailsModal } from "../../analytic/analytic.ui";
// import { scrollToSection } from "../../../features/utils/scroll";

// const toiletFilters = [
//   <TextInput source="name" label="Название" alwaysOn />,
//   <DateInput source="createdAt_gte" label="Создан от" />,
//   <DateInput source="createdAt_lte" label="Создан до" />,
// ];

// const ToiletStats = ({
//   data,
//   isLoading,
// }: {
//   data: any[];
//   isLoading: boolean;
// }) => {
//   const [selectedToilet, setSelectedToilet] = useState<ToiletResDto | null>(
//     null,
//   );
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const fullListRef = useRef<HTMLDivElement>(null);

//   if (isLoading || !data) {
//     return <Loading />;
//   }

//   const toilets = data;

//   const allRatings = toilets.flatMap((toilet: any) => toilet.ratings || []);
//   const totalToilets = toilets.length;
//   const totalRatings = allRatings.length;

//   const totalSmell = allRatings.reduce(
//     (sum: number, r: any) => sum + r.smellRating,
//     0,
//   );
//   const totalPurity = allRatings.reduce(
//     (sum: number, r: any) => sum + r.purityRating,
//     0,
//   );
//   const avgSmell = totalRatings > 0 ? totalSmell / totalRatings : 0;
//   const avgPurity = totalRatings > 0 ? totalPurity / totalRatings : 0;
//   const avgRating = (avgSmell + avgPurity) / 2;
//   const satisfactionRate = (avgRating / 5) * 100;

//   const paperCount = allRatings.filter((r: any) => r.hasToiletPaper).length;
//   const soapCount = allRatings.filter((r: any) => r.hasSoap).length;
//   const paperAvailabilityPercent =
//     totalRatings > 0 ? (paperCount / totalRatings) * 100 : 0;
//   const soapAvailabilityPercent =
//     totalRatings > 0 ? (soapCount / totalRatings) * 100 : 0;

//   const toiletRatings = toilets.map((toilet: any) => {
//     const ratings = toilet.ratings || [];
//     const avgRatingValue =
//       ratings.length > 0
//         ? ratings.reduce(
//             (sum: number, r: any) => sum + (r.smellRating + r.purityRating) / 2,
//             0,
//           ) / ratings.length
//         : 0;
//     return { toilet, avgRating: avgRatingValue, ratingCount: ratings.length };
//   });

//   const topRatedToilets = [...toiletRatings]
//     .sort((a, b) => b.avgRating - a.avgRating)
//     .slice(0, 5)
//     .map((item) => item.toilet);

//   const worstRatedToilets = [...toiletRatings]
//     .sort((a, b) => a.avgRating - b.avgRating)
//     .filter((item) => item.ratingCount > 0)
//     .slice(0, 5)
//     .map((item) => item.toilet);

//   const mostActiveToilet = [...toiletRatings]
//     .sort((a, b) => b.ratingCount - a.ratingCount)
//     .slice(0, 1)[0];

//   const stats = {
//     totalToilets,
//     totalRatings,
//     averageSmellRating: Math.round(avgSmell * 10) / 10,
//     averagePurityRating: Math.round(avgPurity * 10) / 10,
//     averageRating: Math.round(avgRating * 10) / 10,
//     satisfactionRate: Math.round(satisfactionRate),
//     paperAvailabilityPercent: Math.round(paperAvailabilityPercent),
//     soapAvailabilityPercent: Math.round(soapAvailabilityPercent),
//     toiletsWithPaper: paperCount,
//     toiletsWithSoap: soapCount,
//     mostActiveToilet: {
//       id: mostActiveToilet?.toilet?.id || 0,
//       name: mostActiveToilet?.toilet?.name || "Нет данных",
//       ratingCount: mostActiveToilet?.ratingCount || 0,
//     },
//     topRatedToilets,
//     worstRatedToilets,
//   };

//   const handleOpenModal = (toilet: ToiletResDto) => {
//     setSelectedToilet(toilet);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedToilet(null);
//   };

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="p-6 bg-bg min-h-screen rounded-lg"
//       >
//         <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
//           <motion.h1
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="mb-0"
//           >
//             🚽 Статистика туалетов
//           </motion.h1>
//         </div>

//         <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-8">
//           <MetricCard
//             tooltipFormula="COUNT(DISTINCT toilets.id)"
//             gradient="from-blue-600 to-blue-700"
//             label="Всего туалетов"
//             value={stats.totalToilets}
//             unit="в системе"
//             tooltipTitle="Всего туалетов"
//             tooltipDescription="Общее количество туалетов, зарегистрированных в системе"
//             onClick={() => scrollToSection(fullListRef)}
//           />
//           <MetricCard
//             gradient="from-green-500 to-green-600"
//             label="Всего отзывов"
//             tooltipFormula="SUM(ratings.count)"
//             value={stats.totalRatings}
//             unit="оставлено пользователями"
//             tooltipTitle="Всего отзывов"
//             tooltipDescription="Общее количество оставленных пользователями отзывов"
//             onClick={() => scrollToSection(fullListRef)}
//           />
//           <MetricCard
//             gradient="from-purple-500 to-purple-600"
//             label="Средний рейтинг"
//             tooltipFormula="(AVG(smell_rating) + AVG(purity_rating)) / 2"
//             value={stats.averageRating}
//             unit="из 5.0"
//             tooltipTitle="Средний рейтинг"
//             tooltipDescription="Средняя оценка всех туалетов по всем критериям"
//           />
//           <MetricCard
//             gradient="from-orange-500 to-orange-600"
//             label="Удовлетворенность"
//             value={`${stats.satisfactionRate}%`}
//             unit="общая оценка"
//             tooltipTitle="Удовлетворенность"
//             tooltipFormula="(average_rating / 5) * 100%"
//             tooltipDescription="Процент пользователей, удовлетворенных состоянием туалетов"
//           />
//         </div>

//         <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8">
//           <motion.div
//             whileHover={{ y: -5 }}
//             className="bg-bg rounded-lg shadow-theme p-6 border border-border"
//           >
//             <div className="flex items-center">
//               <h2 className="flex items-center mb-4">
//                 <span className="mr-2">👃</span> Оценка запаха
//               </h2>
//               <CommonInfoTooltip
//                 title="Оценка запаха"
//                 description="Средняя оценка запаха по всем отзывам"
//               />
//             </div>
//             <div className="text-3xl font-bold text-accent mb-2">
//               {stats.averageSmellRating}
//             </div>
//             <div className="w-full bg-border rounded-full h-3">
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: `${(stats.averageSmellRating / 5) * 100}%` }}
//                 className="bg-accent rounded-full h-3"
//               />
//             </div>
//             <div className="text-sm text-text mt-2">из 5.0</div>
//           </motion.div>

//           <motion.div
//             whileHover={{ y: -5 }}
//             className="bg-bg rounded-lg shadow-theme p-6 border border-border"
//           >
//             <div className="flex items-center">
//               <h2 className="flex items-center mb-4">
//                 <span className="mr-2">✨</span> Оценка чистоты
//               </h2>
//               <CommonInfoTooltip
//                 title="Оценка чистоты"
//                 description="Средняя оценка чистоты по всем отзывам"
//               />
//             </div>
//             <div className="text-3xl font-bold text-accent mb-2">
//               {stats.averagePurityRating}
//             </div>
//             <div className="w-full bg-border rounded-full h-3">
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: `${(stats.averagePurityRating / 5) * 100}%` }}
//                 className="bg-accent rounded-full h-3"
//               />
//             </div>
//             <div className="text-sm text-text mt-2">из 5.0</div>
//           </motion.div>
//         </div>

//         <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8">
//           <motion.div
//             whileHover={{ y: -5 }}
//             className="bg-bg rounded-lg shadow-theme p-6 border border-border"
//           >
//             <div className="flex items-center">
//               <h2 className="flex items-center mb-4">
//                 <span className="mr-2">🧻</span> Наличие удобств
//               </h2>
//               <CommonInfoTooltip
//                 title="Наличие удобств"
//                 description="Процент отзывов с наличием туалетной бумаги и мыла"
//               />
//             </div>
//             <div className="flex flex-col gap-4">
//               <div>
//                 <div className="flex justify-between mb-2">
//                   <span className="font-medium">Туалетная бумага</span>
//                   <span className="text-sm">
//                     {stats.toiletsWithPaper} / {stats.totalRatings} (
//                     {stats.paperAvailabilityPercent}%)
//                   </span>
//                 </div>
//                 <div className="w-full bg-border rounded-full h-3">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${stats.paperAvailabilityPercent}%` }}
//                     className="bg-green-500 rounded-full h-3"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <div className="flex justify-between mb-2">
//                   <span className="font-medium">Мыло</span>
//                   <span className="text-sm">
//                     {stats.toiletsWithSoap} / {stats.totalRatings} (
//                     {stats.soapAvailabilityPercent}%)
//                   </span>
//                 </div>
//                 <div className="w-full bg-border rounded-full h-3">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${stats.soapAvailabilityPercent}%` }}
//                     className="bg-blue-500 rounded-full h-3"
//                   />
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             whileHover={{ y: -5 }}
//             className="bg-bg rounded-lg shadow-theme p-6 border border-border"
//           >
//             <div className="flex items-center">
//               <h2 className="flex items-center mb-4">
//                 <span className="mr-2">🏆</span> Самый активный туалет
//               </h2>
//               <CommonInfoTooltip
//                 title="Самый активный туалет"
//                 description="Туалет с наибольшим количеством отзывов"
//               />
//             </div>
//             <div className="text-center">
//               <button
//                 onClick={() => {
//                   const activeToilet = toilets.find(
//                     (t: any) => t.id === stats.mostActiveToilet.id,
//                   );
//                   if (activeToilet) handleOpenModal(activeToilet);
//                 }}
//                 className="text-2xl font-bold text-accent mb-2 hover:underline"
//               >
//                 {stats.mostActiveToilet.name}
//               </button>
//               <div className="text-text">
//                 Количество отзывов: {stats.mostActiveToilet.ratingCount}
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6 mb-8">
//           <div className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden">
//             <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-yellow-500/10 to-transparent">
//               <div className="flex items-center">
//                 <h2 className="flex items-center">
//                   <span className="mr-2">⭐</span> Топ-5 туалетов по рейтингу
//                 </h2>
//               </div>
//             </div>
//             <div className="flex flex-col">
//               {stats.topRatedToilets.map((toilet, index) => (
//                 <motion.div
//                   key={toilet.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   whileHover={{ backgroundColor: "var(--accent-bg)" }}
//                   className="p-4 border-b border-border cursor-pointer transition-colors"
//                   onClick={() => handleOpenModal(toilet)}
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
//                       {toilet.ratings?.length > 0
//                         ? (
//                             toilet.ratings.reduce(
//                               (sum: number, r: any) =>
//                                 sum + (r.smellRating + r.purityRating) / 2,
//                               0,
//                             ) / toilet.ratings.length
//                           ).toFixed(1)
//                         : "Нет оценок"}
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden">
//             <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-red-500/10 to-transparent">
//               <div className="flex items-center">
//                 <h2 className="flex items-center">
//                   <span className="mr-2">📉</span> Туалеты для улучшения
//                 </h2>
//               </div>
//             </div>
//             <div className="flex flex-col">
//               {stats.worstRatedToilets.map((toilet, index) => (
//                 <motion.div
//                   key={toilet.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   whileHover={{ backgroundColor: "var(--accent-bg)" }}
//                   className="p-4 border-b border-border cursor-pointer transition-colors"
//                   onClick={() => handleOpenModal(toilet)}
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
//                       {toilet.ratings?.length > 0
//                         ? (
//                             toilet.ratings.reduce(
//                               (sum: number, r: any) =>
//                                 sum + (r.smellRating + r.purityRating) / 2,
//                               0,
//                             ) / toilet.ratings.length
//                           ).toFixed(1)
//                         : "Нет оценок"}
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div
//           ref={fullListRef}
//           className="bg-bg rounded-lg shadow-theme border border-border overflow-hidden"
//         >
//           <div className="px-6 py-4 border-b border-border">
//             <h2 className="flex items-center">
//               <span className="mr-2">📋</span> Полный список туалетов
//             </h2>
//           </div>

//           <div>
//             {toilets.map((toilet: any, index: number) => {
//               const avgSmell = toilet.ratings?.length
//                 ? (
//                     toilet.ratings.reduce(
//                       (sum: number, r: any) => sum + r.smellRating,
//                       0,
//                     ) / toilet.ratings.length
//                   ).toFixed(1)
//                 : "Нет оценок";
//               const avgPurity = toilet.ratings?.length
//                 ? (
//                     toilet.ratings.reduce(
//                       (sum: number, r: any) => sum + r.purityRating,
//                       0,
//                     ) / toilet.ratings.length
//                   ).toFixed(1)
//                 : "Нет оценок";

//               return (
//                 <motion.div
//                   key={toilet.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.03 }}
//                   whileHover={{ backgroundColor: "var(--accent-bg)" }}
//                   className="p-6 border-b border-border transition-colors cursor-pointer"
//                   onClick={() => handleOpenModal(toilet)}
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

//                   {toilet.ratings?.length > 0 && (
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
//                               toilet.ratings.filter(
//                                 (r: any) => r.hasToiletPaper,
//                               ).length
//                             }{" "}
//                             / {toilet.ratings.length}
//                           </div>
//                           <div>
//                             🧼{" "}
//                             {
//                               toilet.ratings.filter((r: any) => r.hasSoap)
//                                 .length
//                             }{" "}
//                             / {toilet.ratings.length}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <div className="mt-4 flex justify-end">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleOpenModal(toilet);
//                       }}
//                       className="px-4 py-2 bg-gradient-to-r from-accent to-accent/80 text-white rounded-lg hover:from-accent/90 hover:to-accent/70 transition-all flex items-center gap-2 text-sm font-semibold shadow-md"
//                     >
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                         />
//                       </svg>
//                       Детальная аналитика →
//                     </button>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       </motion.div>

//       <ToiletDetailsModal
//         toilet={selectedToilet}
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//       />
//     </>
//   );
// };

// // Основной компонент для react-admin
// export const ToilePanel = () => {
//   const { data, isLoading, error } = useGetList("toilets", {
//     pagination: { page: 1, perPage: 1000 },
//     sort: { field: "createdAt", order: "DESC" },
//   });

//   if (isLoading) return <Loading />;
//   //   if (error) return <Error />;
//   if (error) return null;

//   return <ToiletStats data={data} isLoading={isLoading} />;
// };

// export const ToiletList = () => (
//   <List filters={toiletFilters}>
//     <Datagrid rowClick="show">
//       <TextField source="name" label="Название" />
//       <NumberField source="floor" label="Этаж" />
//       <TextField source="person" label="Тип" />
//       <TextField source="location" label="Местоположение" />
//       <DateField source="createdAt" label="Создан" />
//       <ShowButton />
//       <EditButton />
//       <DeleteButton />
//     </Datagrid>
//   </List>
// );

// export const ToiletShow = () => {
//   const { record } = useShowController();
//   if (!record) return null;

//   const avgSmell = record.ratings?.length
//     ? (
//         record.ratings.reduce((sum: number, r: any) => sum + r.smellRating, 0) /
//         record.ratings.length
//       ).toFixed(1)
//     : "Нет оценок";
//   const avgPurity = record.ratings?.length
//     ? (
//         record.ratings.reduce(
//           (sum: number, r: any) => sum + r.purityRating,
//           0,
//         ) / record.ratings.length
//       ).toFixed(1)
//     : "Нет оценок";

//   return (
//     <Show>
//       <TabbedShowLayout>
//         <Tab label="Основная информация">
//           <TextField source="name" label="Название" />
//           <NumberField source="floor" label="Этаж" />
//           <TextField source="person" label="Тип" />
//           <TextField source="location" label="Местоположение" />
//           <DateField source="createdAt" label="Создан" />
//           <DateField source="updatedAt" label="Обновлен" />
//         </Tab>
//         <Tab label="Статистика оценок">
//           <div className="p-4">
//             <h3>Средняя оценка запаха: {avgSmell} / 5</h3>
//             <h3>Средняя оценка чистоты: {avgPurity} / 5</h3>
//             <h3>Всего оценок: {record.ratings?.length || 0}</h3>
//           </div>
//         </Tab>
//         <Tab label="Отзывы">
//           <Datagrid data={record.ratings || []} resource="ratings">
//             <NumberField source="smellRating" label="Запах" />
//             <NumberField source="purityRating" label="Чистота" />
//             <TextField source="comment" label="Комментарий" />
//             <DateField source="createdAt" label="Дата" />
//           </Datagrid>
//         </Tab>
//       </TabbedShowLayout>
//     </Show>
//   );
// };

// // Компонент для создания
// export const ToiletCreate = () => (
//   <Create>
//     <SimpleForm>
//       <TextInput source="name" label="Название" required />
//       <NumberInput source="floor" label="Этаж" required />
//       <TextInput source="person" label="Тип (MAN/WOMAN)" required />
//       <TextInput source="location" label="Местоположение" required />
//     </SimpleForm>
//   </Create>
// );

// // Компонент для редактирования
// export const ToiletEdit = () => (
//   <Edit>
//     <SimpleForm>
//       <TextInput source="name" label="Название" />
//       <NumberInput source="floor" label="Этаж" />
//       <TextInput source="person" label="Тип (MAN/WOMAN)" />
//       <TextInput source="location" label="Местоположение" />
//     </SimpleForm>
//   </Edit>
// );
