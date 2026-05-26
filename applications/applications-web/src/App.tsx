import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./widgets/page/LoginPage";
import { PanelPage } from "./widgets/page/PanelPage";
import { StudentSidebar } from "./widgets/student/layout";
import {
  StudentApplicationCreatePage,
  StudentApplicationPage,
} from "./widgets/page/student";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<LoginPage />} />

      <Route path="/panel/*" element={<PanelPage />} />

      <Route path="/student" element={<StudentSidebar />}>
        <Route path="applications" element={<StudentApplicationPage />} />
        <Route
          path="application/create"
          element={<StudentApplicationCreatePage />}
        />
      </Route>

      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
