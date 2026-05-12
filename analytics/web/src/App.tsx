import { Routes, Route } from "react-router-dom";
import { AnalyticPage, HomePage } from "./widgets/pages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analytic" element={<AnalyticPage />} />
    </Routes>
  );
}

export default App;
