import { Routes, Route } from "react-router-dom";
import { AnalyticPage, HomePage } from "./widgets/pages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analytic/qr" element={<AnalyticPage />} />
      <Route path="/analytic" element={<AnalyticPage />} />
    </Routes>
  );
}

export default App;

// import { appConfig } from "./shared/config.ts";
// import { useState } from "react";
// import { AnalyticsApi, type AnalyticsCreate } from "./features/lib";
// import { PromFrom, PromInput, PromSwitchField } from "prom-pal-ui";
// import { z } from "zod";

// const schemaSend = z.object({
//   soap: z.boolean({ message: "Обязательно" }),
//   idToilet: z.coerce.number({ message: "Обязательно" }),
//   conditionRoom: z.coerce.number({ message: "Обязательно" }),
// });

// function App() {
//   const apiAnalytics = new AnalyticsApi();

//   const [isSent, setIsSent] = useState<boolean>(false);
//   const [error, setError] = useState<boolean>(false);

//   const send = async (data: AnalyticsCreate) => {
//     console.log(data);

//     try {
//       const res = await apiAnalytics.createAnalyticsAnalyticsPost({
//         analyticsCreate: data,
//       });
//       console.log(res);

//       setIsSent(true);
//       setError(false);
//     } catch (error) {
//       setIsSent(false);
//       setError(true);
//       console.log(error);
//     }
//   };

//   return (
//     <main className="mt-10">
//       <p>{appConfig.name}</p>
//       <h2>Оценка состояния 🚽</h2>

//       <PromFrom
//         defaultValues={{
//           soap: true,
//           idToilet: 1,
//           conditionRoom: 5,
//         }}
//         schema={schemaSend}
//         onSubmit={(data) => send(data)}
//       >
//         <PromSwitchField name="soap" label="Наличие мыла" />
//         <PromInput
//           name="conditionRoom"
//           type="number"
//           label="Состояние комнаты (0-10)"
//         />

//         <button type="submit">Отправить</button>
//       </PromFrom>

//       {isSent && (
//         <p style={{ color: "green" }}>✅ Данные успешно отправлены!</p>
//       )}
//       {error && <p style={{ color: "red" }}>❌ Ошибка при отправке данных</p>}

//       {/*<ErrorLog/>*/}
//     </main>
//   );
// }

// export default App;
