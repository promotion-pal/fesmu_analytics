// import { AuthProvider, fetchUtils } from "react-admin";

// // const apiUrl = "https://api.mirtraveler.ru/api/v1";
// const apiUrl = "http://localhost:3010/";
// const httpClient = fetchUtils.fetchJson;

// export const authProvider: AuthProvider = {
//   login: async ({ username, password }) => {
//     try {
//       const { json } = await httpClient(`${apiUrl}/auth/login`, {
//         method: "POST",
//         body: JSON.stringify({ email: username, password }),
//       });

//       // Сохраняем токен в localStorage
//       localStorage.setItem("token", json.token);
//       localStorage.setItem("user", JSON.stringify(json.user));

//       return Promise.resolve();
//     } catch (error) {
//       return Promise.reject(new Error("Неверный email или пароль"));
//     }
//   },

//   // Выход из системы
//   logout: () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     return Promise.resolve();
//   },

//   // Проверка ошибок API
//   checkError: ({ status }) => {
//     if (status === 401 || status === 403) {
//       localStorage.removeItem("token");
//       return Promise.reject();
//     }
//     return Promise.resolve();
//   },

//   // Проверка аутентификации
//   checkAuth: () => {
//     return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
//   },

//   // Получение прав пользователя
//   getPermissions: () => {
//     const user = localStorage.getItem("user");
//     return user ? Promise.resolve(JSON.parse(user).role) : Promise.reject();
//   },

//   // Получение информации о пользователе
//   getIdentity: () => {
//     try {
//       const user = localStorage.getItem("user");
//       if (!user) return Promise.reject();

//       const userData = JSON.parse(user);
//       return Promise.resolve({
//         id: userData.id,
//         fullName: userData.name || userData.email,
//         avatar: userData.avatar,
//       });
//     } catch {
//       return Promise.reject();
//     }
//   },
// };
