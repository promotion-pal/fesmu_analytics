import { Route, Routes } from "react-router-dom";
import { QuestionnairePage, NotFoundPage } from "./widgets/pages";
import { DashboardPage } from "./widgets/pages/DashboardPage";
import { AdminPage } from "./widgets/pages/AdminPage";

function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/analytic" element={<QuestionnairePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin/dashboard/*" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
