import { Configuration } from "../features/lib";

const apiConfig = new Configuration({
  basePath: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

export { apiConfig };
