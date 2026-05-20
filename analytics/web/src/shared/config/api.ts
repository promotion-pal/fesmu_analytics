import { Configuration } from "../../features/lib";
import { ENV } from "./env";

const apiConfig = new Configuration({
  basePath: ENV.API,
});

export { apiConfig };
