import { RefObject } from "react";

export const scrollToSection = (ref: RefObject<HTMLDivElement | null>) => {
  ref.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};
