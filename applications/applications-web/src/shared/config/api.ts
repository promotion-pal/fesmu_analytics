import { Configuration } from "@/features/lib/application";
import { ENV } from "./env";

export const apiConfig = () => {
  return new Configuration({
    basePath: ENV.API,
  });
};
