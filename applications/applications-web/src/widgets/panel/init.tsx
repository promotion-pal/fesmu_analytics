import { Admin, ListGuesser, Resource } from "react-admin";
import { GraduationCap, Toilet } from "lucide-react";
import { dataProvider } from "./core/dataProvider";

const ToiletIcon = () => <Toilet size={24} />;
const LectureHallIcon = () => <GraduationCap size={24} />;

const Panel = () => (
  <Admin
    dataProvider={dataProvider}
    basename="/panel"
    title="Моя Кастомная Админка"
  >
    {/* <Resource
      name="applications"
      // list={ToilePanel}
      // show={ToiletShow}
      // edit={ToiletEdit}
      // list={}
      icon={ToiletIcon}
      // create={ToiletCreate}
      options={{ label: "Туалеты" }}
    /> */}

    <Resource name="applications" list={ListGuesser} />
  </Admin>
);

export { Panel };
