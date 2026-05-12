import { Configuration } from "../features/lib";

const apiConfig = new Configuration({
  // basePath: import.meta.env.VITE_API_URL || "http://localhost:4000",
  basePath: "https://api.fesmu.promotion-pal.ru",
});

export { apiConfig };
