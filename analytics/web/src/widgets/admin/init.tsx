import { Admin, Resource } from "react-admin";
import { GraduationCap, Toilet } from "lucide-react";
import { dataProvider } from "./core/dataProvider";
import {
  ToilePanel,
  ToiletShow,
  ToiletCreate,
  ToiletEdit,
} from "./resources/toilet";
import {
  LectureHallCreate,
  LectureHallEdit,
  LectureHallPanel,
  LectureHallShow,
} from "./resources/lecture-hall";

const ToiletIcon = () => <Toilet size={24} />;
const LectureHallIcon = () => <GraduationCap size={24} />;

const AdminPanel = () => (
  <Admin
    dataProvider={dataProvider}
    basename="/admin/dashboard"
    title="Моя Кастомная Админка"
  >
    <Resource
      name="toilets"
      list={ToilePanel}
      show={ToiletShow}
      edit={ToiletEdit}
      icon={ToiletIcon}
      create={ToiletCreate}
      options={{ label: "Туалеты" }}
    />
    <Resource
      name="lecture-hall"
      list={LectureHallPanel}
      show={LectureHallShow}
      edit={LectureHallEdit}
      create={LectureHallCreate}
      options={{ label: "Лекционные залы" }}
      icon={LectureHallIcon}
    />
  </Admin>
);

export { AdminPanel };
