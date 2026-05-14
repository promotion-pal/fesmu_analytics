import { ToiletResDtoLocationEnum, ToiletResDtoPersonEnum } from "../lib";

const extractToiletsLocation = (location: ToiletResDtoLocationEnum): string => {
  const map: Record<ToiletResDtoLocationEnum, string> = {
    first_building: "Первый корпус",
    second_building: "Второй корпус",
    third_building: "Третий корпус",
  };

  return map[location] || location;
};

const extractToiletsPerson = (persone: ToiletResDtoPersonEnum): string => {
  const map: Record<ToiletResDtoPersonEnum, string> = {
    man: "Мужской",
    woman: "Женский",
    universal: "Универсальный",
  };

  return map[persone] || persone;
};

export { extractToiletsLocation, extractToiletsPerson };
