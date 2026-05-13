import { Routes, Route } from "react-router-dom";
import { AnalyticPage, HomePage } from "./widgets/pages";
import { DashboardPage } from "./widgets/pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analytic" element={<AnalyticPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
