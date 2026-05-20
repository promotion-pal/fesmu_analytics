import { useState, useRef, useEffect } from "react";
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
  Create,
  SimpleForm,
  Edit,
  EditButton,
  DeleteButton,
  CreateButton,
  TopToolbar,
  useRedirect,
} from "react-admin";
import { Plus, RefreshCw } from "lucide-react";
import { CommonInfoTooltip } from "../../../shared/ui/info";
import { MetricCard } from "../../analytic/analytic.ui";
import { scrollToSection } from "../../../features/utils/scroll";
import { useAnalytics } from "../../analytic/analytic.fn";

interface LectureHallRating {
  id: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
  cleanliness: number;
  comfort: number;
  equipment: number;
  comment?: string;
}

interface LectureHall {
  id: number;
  name: string;
  location: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  ratings: LectureHallRating[];
}

// Фильтры для списка
const lectureHallFilters = [
  <TextInput source="name" label="Название" alwaysOn />,
  <DateInput source="createdAt_gte" label="Создан от" />,
  <DateInput source="createdAt_lte" label="Создан до" />,
];

// Кастомные действия для списка
const ListActions = () => (
  <TopToolbar>
    <CreateButton label="Добавить лекционный зал" />
  </TopToolbar>
);

// Функция для вычисления рейтинга из одного отзыва
const calculateLectureHallRating = (rating: LectureHallRating): number => {
  return (rating.cleanliness + rating.comfort + rating.equipment) / 3;
};

// Функция для дополнительных статистик
const getLectureHallAdditionalStats = (
  entities: LectureHall[],
  allRatings: LectureHallRating[],
) => {
  const totalCleanliness = allRatings.reduce(
    (sum, r) => sum + r.cleanliness,
    0,
  );
  const totalComfort = allRatings.reduce((sum, r) => sum + r.comfort, 0);
  const totalEquipment = allRatings.reduce((sum, r) => sum + r.equipment, 0);
  const totalRatings = allRatings.length;

  return {
    averageCleanliness:
      totalRatings > 0
        ? Math.round((totalCleanliness / totalRatings) * 10) / 10
        : 0,
    averageComfort:
      totalRatings > 0
        ? Math.round((totalComfort / totalRatings) * 10) / 10
        : 0,
    averageEquipment:
      totalRatings > 0
        ? Math.round((totalEquipment / totalRatings) * 10) / 10
        : 0,
  };
};

const LectureHallStats = ({
  data,
  isLoading,
  onRefresh,
}: {
  data: LectureHall[];
  isLoading: boolean;
  onRefresh?: () => void;
}) => {
  const [selectedHall, setSelectedHall] = useState<LectureHall | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fullListRef = useRef<HTMLDivElement>(null);
  const redirect = useRedirect();

  const {
    entities: halls,
    stats,
    setTimeFilter,
    timeFilter,
    fetch: setData,
  } = useAnalytics<LectureHallRating>({
    calculateRatingFromItem: calculateLectureHallRating,
    getAdditionalStats: getLectureHallAdditionalStats,
    topCount: 5,
  });

  useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data, setData]);

  if (isLoading || !data) {
    return <Loading />;
  }

  const handleOpenModal = (hall: LectureHall) => {
    setSelectedHall(hall);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHall(null);
  };

  const handleCreateHall = () => {
    redirect("/lecture-hall/create");
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
            🎓 Статистика лекционных залов
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
              onClick={handleCreateHall}
              className="px-4 py-2 bg-gradient-to-r from-accent to-accent/80 text-white rounded-lg hover:from-accent/90 hover:to-accent/70 transition-all flex items-center gap-2 font-semibold shadow-md"
            >
              <Plus size={18} />
              Добавить лекционный зал
            </button>
          </div> */}
        </div>

        {/* Метрики */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-8">
          <MetricCard
            tooltipFormula="COUNT(DISTINCT lecture_hall.id)"
            gradient="from-blue-600 to-blue-700"
            label="Всего залов"
            value={stats.totalEntities}
            unit="в системе"
            tooltipTitle="Всего лекционных залов"
            tooltipDescription="Общее количество лекционных залов, зарегистрированных в системе"
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
            tooltipFormula="(AVG(cleanliness) + AVG(comfort) + AVG(equipment)) / 3"
            value={stats.averageRating}
            unit="из 5.0"
            tooltipTitle="Средний рейтинг"
            tooltipDescription="Средняя оценка всех лекционных залов по всем критериям"
          />
          <MetricCard
            gradient="from-orange-500 to-orange-600"
            label="Удовлетворенность"
            value={`${stats.satisfactionRate}%`}
            unit="общая оценка"
            tooltipTitle="Удовлетворенность"
            tooltipFormula="(average_rating / 5) * 100%"
            tooltipDescription="Процент пользователей, удовлетворенных состоянием лекционных залов"
          />
        </div>

        {/* Оценки по критериям */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-bg rounded-lg shadow-theme p-6 border border-border"
          >
            <div className="flex items-center">
              <h2 className="flex items-center mb-4">
                <span className="mr-2">🧹</span> Чистота
              </h2>
              <CommonInfoTooltip
                title="Оценка чистоты"
                description="Средняя оценка чистоты по всем отзывам"
              />
            </div>
            <div className="text-3xl font-bold text-accent mb-2">
              {stats.averageCleanliness || 0}
            </div>
            <div className="w-full bg-border rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((stats.averageCleanliness || 0) / 5) * 100}%`,
                }}
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
                <span className="mr-2">🪑</span> Комфортность
              </h2>
              <CommonInfoTooltip
                title="Оценка комфортности"
                description="Средняя оценка комфортности по всем отзывам"
              />
            </div>
            <div className="text-3xl font-bold text-accent mb-2">
              {stats.averageComfort || 0}
            </div>
            <div className="w-full bg-border rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((stats.averageComfort || 0) / 5) * 100}%`,
                }}
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
                <span className="mr-2">💻</span> Оснащённость техникой
              </h2>
              <CommonInfoTooltip
                title="Оценка оснащённости"
                description="Средняя оценка оснащённости орг. техникой по всем отзывам"
              />
            </div>
            <div className="text-3xl font-bold text-accent mb-2">
              {stats.averageEquipment || 0}
            </div>
            <div className="w-full bg-border rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((stats.averageEquipment || 0) / 5) * 100}%`,
                }}
                className="bg-accent rounded-full h-3"
              />
            </div>
            <div className="text-sm text-text mt-2">из 5.0</div>
          </motion.div>
        </div>

        {/* Самый активный зал */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-bg rounded-lg shadow-theme p-6 border border-border"
          >
            <div className="flex items-center">
              <h2 className="flex items-center mb-4">
                <span className="mr-2">🏆</span> Самый активный лекционный зал
              </h2>
              <CommonInfoTooltip
                title="Самый активный зал"
                description="Лекционный зал с наибольшим количеством отзывов"
              />
            </div>
            <div className="text-center">
              <button
                onClick={() => {
                  const activeHall = halls.find(
                    (h) => h.id === stats.mostActiveEntity.id,
                  );
                  if (activeHall) handleOpenModal(activeHall);
                }}
                className="text-2xl font-bold text-accent mb-2 hover:underline"
              >
                {stats.mostActiveEntity.name}
              </button>
              <div className="text-text">
                Количество отзывов: {stats.mostActiveEntity.ratingCount}
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
                  <span className="mr-2">⭐</span> Топ-5 залов по рейтингу
                </h2>
              </div>
            </div>
            <div className="flex flex-col">
              {stats.topRatedEntities.map((hall, index) => (
                <motion.div
                  key={hall.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "var(--accent-bg)" }}
                  className="p-4 border-b border-border cursor-pointer transition-colors"
                  onClick={() => handleOpenModal(hall as LectureHall)}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-text-h">
                          {hall.name}
                        </div>
                        <div className="text-sm text-text">
                          {hall.ratings?.length || 0} отзывов
                        </div>
                      </div>
                    </div>
                    <div className="text-yellow-500 font-bold">
                      ⭐{" "}
                      {hall.ratings?.length > 0
                        ? (
                            hall.ratings.reduce(
                              (sum: number, r: any) =>
                                sum +
                                (r.cleanliness + r.comfort + r.equipment) / 3,
                              0,
                            ) / hall.ratings.length
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
                  <span className="mr-2">📉</span> Залы для улучшения
                </h2>
              </div>
            </div>
            <div className="flex flex-col">
              {stats.worstRatedEntities.map((hall, index) => (
                <motion.div
                  key={hall.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "var(--accent-bg)" }}
                  className="p-4 border-b border-border cursor-pointer transition-colors"
                  onClick={() => handleOpenModal(hall as LectureHall)}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-text-h">
                          {hall.name}
                        </div>
                        <div className="text-sm text-text">
                          {hall.ratings?.length || 0} отзывов
                        </div>
                      </div>
                    </div>
                    <div className="text-red-500 font-bold">
                      ⭐{" "}
                      {hall.ratings?.length > 0
                        ? (
                            hall.ratings.reduce(
                              (sum: number, r: any) =>
                                sum +
                                (r.cleanliness + r.comfort + r.equipment) / 3,
                              0,
                            ) / hall.ratings.length
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
              <span className="mr-2">📋</span> Полный список лекционных залов
            </h2>

            <button
              onClick={handleCreateHall}
              className="px-3 py-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-all flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Добавить
            </button>
          </div>

          <div>
            {halls.map((hall, index) => {
              const avgCleanliness = hall.ratings?.length
                ? (
                    hall.ratings.reduce(
                      (sum: number, r: any) => sum + r.cleanliness,
                      0,
                    ) / hall.ratings.length
                  ).toFixed(1)
                : "Нет оценок";
              const avgComfort = hall.ratings?.length
                ? (
                    hall.ratings.reduce(
                      (sum: number, r: any) => sum + r.comfort,
                      0,
                    ) / hall.ratings.length
                  ).toFixed(1)
                : "Нет оценок";
              const avgEquipment = hall.ratings?.length
                ? (
                    hall.ratings.reduce(
                      (sum: number, r: any) => sum + r.equipment,
                      0,
                    ) / hall.ratings.length
                  ).toFixed(1)
                : "Нет оценок";

              return (
                <motion.div
                  key={hall.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ backgroundColor: "var(--accent-bg)" }}
                  className="p-6 border-b border-border transition-colors cursor-pointer"
                  onClick={() => handleOpenModal(hall)}
                >
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-text-h m-0">
                        {hall.name}
                      </h3>
                      <p className="text-sm text-text mt-1">
                        Добавлен:{" "}
                        {new Date(hall.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                    <div className="text-sm bg-accent-bg text-accent px-3 py-1 rounded-full border border-accent-border">
                      📝 {hall.ratings?.length || 0} отзывов
                    </div>
                  </div>

                  {hall.ratings?.length > 0 && (
                    <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                      <div className="bg-code-bg rounded-md p-3">
                        <div className="text-sm text-text mb-1">Чистота</div>
                        <div className="text-lg font-semibold text-accent">
                          {avgCleanliness} / 5
                        </div>
                      </div>
                      <div className="bg-code-bg rounded-md p-3">
                        <div className="text-sm text-text mb-1">Комфорт</div>
                        <div className="text-lg font-semibold text-accent">
                          {avgComfort} / 5
                        </div>
                      </div>
                      <div className="bg-code-bg rounded-md p-3">
                        <div className="text-sm text-text mb-1">Техника</div>
                        <div className="text-lg font-semibold text-accent">
                          {avgEquipment} / 5
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(hall);
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

      {/* Модальное окно с деталями (нужно создать отдельно для LectureHall) */}
      {/* <LectureHallDetailsModal hall={selectedHall} isOpen={isModalOpen} onClose={handleCloseModal} /> */}
    </>
  );
};

// Основной компонент для react-admin
export const LectureHallPanel = () => {
  const { data, isLoading, error, refetch } = useGetList("lecture-hall", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "createdAt", order: "DESC" },
  });

  if (isLoading) return <Loading />;
  if (error) return null;

  return (
    <LectureHallStats
      data={data || []}
      isLoading={isLoading}
      onRefresh={refetch}
    />
  );
};

// Список лекционных залов
export const LectureHallList = () => (
  <List filters={lectureHallFilters} actions={<ListActions />}>
    <Datagrid rowClick="show">
      <TextField source="name" label="Название" />
      <TextField source="location" label="Местоположение" />
      <DateField source="createdAt" label="Создан" />
      <ShowButton />
      <EditButton />
      <DeleteButton mutationMode="pessimistic" />
    </Datagrid>
  </List>
);

// Просмотр лекционного зала
export const LectureHallShow = () => {
  const { record } = useShowController();
  if (!record) return null;

  const avgCleanliness = record.ratings?.length
    ? (
        record.ratings.reduce((sum: number, r: any) => sum + r.cleanliness, 0) /
        record.ratings.length
      ).toFixed(1)
    : "Нет оценок";
  const avgComfort = record.ratings?.length
    ? (
        record.ratings.reduce((sum: number, r: any) => sum + r.comfort, 0) /
        record.ratings.length
      ).toFixed(1)
    : "Нет оценок";
  const avgEquipment = record.ratings?.length
    ? (
        record.ratings.reduce((sum: number, r: any) => sum + r.equipment, 0) /
        record.ratings.length
      ).toFixed(1)
    : "Нет оценок";

  return (
    <Show>
      <TabbedShowLayout>
        <Tab label="Основная информация">
          <TextField source="name" label="Название" />
          <TextField source="location" label="Местоположение" />
          <DateField source="createdAt" label="Создан" />
          <DateField source="updatedAt" label="Обновлен" />
        </Tab>
        <Tab label="Статистика оценок">
          <div className="p-4">
            <h3>Средняя оценка чистоты: {avgCleanliness} / 5</h3>
            <h3>Средняя оценка комфорта: {avgComfort} / 5</h3>
            <h3>Средняя оценка техники: {avgEquipment} / 5</h3>
            <h3>Всего оценок: {record.ratings?.length || 0}</h3>
          </div>
        </Tab>
        <Tab label="Отзывы">
          <Datagrid data={record.ratings || []} resource="ratings">
            <NumberField source="cleanliness" label="Чистота" />
            <NumberField source="comfort" label="Комфорт" />
            <NumberField source="equipment" label="Техника" />
            <TextField source="comment" label="Комментарий" />
            <DateField source="createdAt" label="Дата" />
          </Datagrid>
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};

// Создание лекционного зала
export const LectureHallCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Название" required />
      <TextInput source="location" label="Местоположение" required />
    </SimpleForm>
  </Create>
);

// Редактирование лекционного зала
export const LectureHallEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Название" />
      <TextInput source="location" label="Местоположение" />
    </SimpleForm>
  </Edit>
);
