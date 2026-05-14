import { Route, Routes } from "react-router-dom";
import { AnalyticPage, NotFoundPage } from "./widgets/pages";
import { DashboardPage } from "./widgets/pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/analytic" element={<AnalyticPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
