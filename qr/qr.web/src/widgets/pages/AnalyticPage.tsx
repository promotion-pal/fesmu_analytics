import { useState } from "react";
import { ToiletIcon } from "lucide-react";
import { RatingsApi } from "../../features/lib";
import { useSearchParams } from "react-router-dom";

export function AnalyticPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [rating, setRating] = useState<number>(5);
  const [hasSoap, setHasSoap] = useState<boolean>(true);
  const [comment, setComment] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Инициализация API клиента
  const apiRatings = new RatingsApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!id) {
      setError("ID туалета не указан");
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiRatings.apiToiletsIdRatingsPost({
        id: parseInt(id),
        rating: {
          conditionRoom: rating,
          soapAvailable: hasSoap,
          comment: comment || undefined,
        },
      });

      console.log(res);

      setIsSubmitted(true);
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      setError("Не удалось отправить оценку. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2>QR код не распознан</h2>
          <p className="text-text">Не удалось определить ID туалета</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-accent mb-2">Спасибо за оценку!</h2>
          <p className="text-text mb-4">
            Ваша оценка туалета №{id} успешно отправлена
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-accent text-white px-4 py-2 rounded-lg cursor-pointer transition hover:opacity-80"
          >
            Оценить еще раз
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 space-y-3">
          <ToiletIcon size={50} className="mx-auto" />
          <h2>Оценка состояния туалета</h2>
          <p className="text-text text-sm">Туалет №{id}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-border rounded-xl p-6"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Рейтинг */}
          <div className="mb-6">
            <label className="block text-text-h mb-2">
              Как оцениваете состояние? ⭐
            </label>
            <div className="flex gap-2 flex-wrap items-center justify-center mt-5">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`
                    w-10 h-10 rounded-full font-bold transition-all cursor-pointer
                    ${
                      rating === value
                        ? "bg-accent-bg text-accent border-2 border-accent"
                        : "border border-border text-text hover:border-accent"
                    }
                  `}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Наличие мыла */}
          <div className="mb-6">
            <label className="block text-text-h mb-2">🧼 Наличие мыла</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setHasSoap(true)}
                className={`
                  flex-1 py-2 rounded-lg font-medium transition-all cursor-pointer
                  ${
                    hasSoap === true
                      ? "bg-accent text-white"
                      : "border border-border text-text hover:border-accent"
                  }
                `}
              >
                ✅ Есть
              </button>
              <button
                type="button"
                onClick={() => setHasSoap(false)}
                className={`
                  flex-1 py-2 rounded-lg font-medium transition-all cursor-pointer
                  ${
                    hasSoap === false
                      ? "bg-accent text-white"
                      : "border border-border text-text hover:border-accent"
                  }
                `}
              >
                ❌ Нет
              </button>
            </div>
          </div>

          {/* Комментарий */}
          <div className="mb-6">
            <label className="block text-text-h mb-2">
              💬 Комментарий (необязательно)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Поделитесь впечатлениями..."
              className="w-full border border-border rounded-lg p-3 bg-transparent text-current resize-none focus:outline-none focus:border-accent transition-colors"
              rows={3}
            />
          </div>

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-white font-bold py-3 rounded-lg cursor-pointer transition hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Отправка...
              </>
            ) : (
              "📤 Отправить оценку"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="bg-accent-bg rounded-lg p-3">
            <p className="text-xs text-text">QR код: туалет №{id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// export function AnalyticPage() {
//   const [searchParams] = useSearchParams();
//   const id = searchParams.get("id");

//   const [rating, setRating] = useState<number>(5);
//   const [hasSoap, setHasSoap] = useState<boolean>(true);
//   const [comment, setComment] = useState<string>("");
//   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // Инициализация API клиента
//   const apiRatings = new RatingsApi();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     if (!id) {
//       setError("ID туалета не указан");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Отправляем оценку используя API
//       // Название метода может отличаться, проверьте в RatingsApi
//       await apiRatings.apiToiletsIdRatingsPost({
//         id: parseInt(id),
//         modelsToiletRating: {
//           condition_room: rating,
//           soap_available: hasSoap,
//           comment: comment || undefined,
//         },
//       });

//       setIsSubmitted(true);
//     } catch (error) {
//       console.error("Ошибка при отправке:", error);
//       setError("Не удалось отправить оценку. Попробуйте позже.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!id) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">⚠️</div>
//           <h2>QR код не распознан</h2>
//           <p className="text-text">Не удалось определить ID туалета</p>
//         </div>
//       </div>
//     );
//   }

//   if (isSubmitted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <div className="text-6xl mb-4">✅</div>
//           <h2 className="text-accent mb-2">Спасибо за оценку!</h2>
//           <p className="text-text mb-4">
//             Ваша оценка туалета №{id} успешно отправлена
//           </p>
//           <button
//             onClick={() => setIsSubmitted(false)}
//             className="bg-accent text-white px-4 py-2 rounded-lg cursor-pointer transition hover:opacity-80"
//           >
//             Оценить еще раз
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center py-8 px-4">
//       <div className="max-w-md w-full">
//         <div className="text-center mb-8 space-y-3">
//           <ToiletIcon size={50} className="mx-auto" />
//           <h2>Оценка состояния туалета</h2>
//           <p className="text-text text-sm">Туалет №{id}</p>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="border border-border rounded-xl p-6"
//         >
//           {error && (
//             <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
//               {error}
//             </div>
//           )}

//           {/* Рейтинг */}
//           <div className="mb-6">
//             <label className="block text-text-h mb-2">
//               Как оцениваете состояние? ⭐
//             </label>
//             <div className="flex gap-2 flex-wrap items-center justify-center mt-5">
//               {[1, 2, 3, 4, 5].map((value) => (
//                 <button
//                   key={value}
//                   type="button"
//                   onClick={() => setRating(value)}
//                   className={`
//                     w-10 h-10 rounded-full font-bold transition-all cursor-pointer
//                     ${
//                       rating === value
//                         ? "bg-accent-bg text-accent border-2 border-accent"
//                         : "border border-border text-text hover:border-accent"
//                     }
//                   `}
//                 >
//                   {value}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Наличие мыла */}
//           <div className="mb-6">
//             <label className="block text-text-h mb-2">🧼 Наличие мыла</label>
//             <div className="flex gap-4">
//               <button
//                 type="button"
//                 onClick={() => setHasSoap(true)}
//                 className={`
//                   flex-1 py-2 rounded-lg font-medium transition-all cursor-pointer
//                   ${
//                     hasSoap === true
//                       ? "bg-accent text-white"
//                       : "border border-border text-text hover:border-accent"
//                   }
//                 `}
//               >
//                 ✅ Есть
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setHasSoap(false)}
//                 className={`
//                   flex-1 py-2 rounded-lg font-medium transition-all cursor-pointer
//                   ${
//                     hasSoap === false
//                       ? "bg-accent text-white"
//                       : "border border-border text-text hover:border-accent"
//                   }
//                 `}
//               >
//                 ❌ Нет
//               </button>
//             </div>
//           </div>

//           {/* Комментарий */}
//           <div className="mb-6">
//             <label className="block text-text-h mb-2">
//               💬 Комментарий (необязательно)
//             </label>
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Поделитесь впечатлениями..."
//               className="w-full border border-border rounded-lg p-3 bg-transparent text-current resize-none focus:outline-none focus:border-accent transition-colors"
//               rows={3}
//             />
//           </div>

//           {/* Кнопка отправки */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-accent text-white font-bold py-3 rounded-lg cursor-pointer transition hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             {isLoading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Отправка...
//               </>
//             ) : (
//               "📤 Отправить оценку"
//             )}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <div className="bg-accent-bg rounded-lg p-3">
//             <p className="text-xs text-text">QR код: туалет №{id}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // import { useSearchParams } from "react-router-dom";
// // import { useState } from "react";
// // import { ToiletIcon } from "lucide-react";
// // import { RatingsApi, ToiletsApi } from "../../features/lib";

// // export function AnalyticPage() {
// //   const [searchParams] = useSearchParams();
// //   const id = searchParams.get("id");

// //   const [rating, setRating] = useState<number>(5);
// //   const [hasSoap, setHasSoap] = useState<boolean>(true);
// //   const [comment, setComment] = useState<string>("");
// //   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
// //   const [isLoading, setIsLoading] = useState<boolean>(false);
// //   const [error, setError] = useState<string | null>(null);

// //   // Инициализация API клиента
// //   // const apiToilets = new ToiletsApi();
// //   const apiRatings = new RatingsApi();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsLoading(true);
// //     setError(null);

// //     if (!id) {
// //       setError("ID туалета не указан");
// //       setIsLoading(false);
// //       return;
// //     }

// //     try {
// //       // Отправляем оценку используя API
// //       await apiRatings.apiToiletsIdRatingsPost({
// //         id: parseInt(id),
// //         modelsToiletRating: {
// //           condition_room: rating,
// //           soap_available: hasSoap,
// //           comment: comment || undefined,
// //         },
// //       });

// //       setIsSubmitted(true);
// //     } catch (error) {
// //       console.error("Ошибка при отправке:", error);
// //       setError("Не удалось отправить оценку. Попробуйте позже.");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   if (!id) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="text-6xl mb-4">⚠️</div>
// //           <h2>QR код не распознан</h2>
// //           <p className="text-text">Не удалось определить ID туалета</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (isSubmitted) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center max-w-md">
// //           <div className="text-6xl mb-4">✅</div>
// //           <h2 className="text-accent mb-2">Спасибо за оценку!</h2>
// //           <p className="text-text mb-4">
// //             Ваша оценка туалета №{id} успешно отправлена
// //           </p>
// //           <button
// //             onClick={() => setIsSubmitted(false)}
// //             className="bg-accent text-white px-4 py-2 rounded-lg cursor-pointer transition hover:opacity-80"
// //           >
// //             Оценить еще раз
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex justify-center py-8 px-4">
// //       <div className="max-w-md w-full">
// //         <div className="text-center mb-8 space-y-3">
// //           <ToiletIcon size={50} className="mx-auto" />
// //           <h2>Оценка состояния туалета</h2>
// //           <p className="text-text text-sm">Туалет №{id}</p>
// //         </div>

// //         <form
// //           onSubmit={handleSubmit}
// //           className="border border-border rounded-xl p-6"
// //         >
// //           {error && (
// //             <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
// //               {error}
// //             </div>
// //           )}

// //           {/* Рейтинг */}
// //           <div className="mb-6">
// //             <label className="block text-text-h mb-2">
// //               Как оцениваете состояние? ⭐
// //             </label>
// //             <div className="flex gap-2 flex-wrap items-center justify-center mt-5">
// //               {[1, 2, 3, 4, 5].map((value) => (
// //                 <button
// //                   key={value}
// //                   type="button"
// //                   onClick={() => setRating(value)}
// //                   className={`
// //                     w-10 h-10 rounded-full font-bold transition-all cursor-pointer
// //                     ${
// //                       rating === value
// //                         ? "bg-accent-bg text-accent border-2 border-accent"
// //                         : "border border-border text-text hover:border-accent"
// //                     }
// //                   `}
// //                 >
// //                   {value}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Наличие мыла */}
// //           <div className="mb-6">
// //             <label className="block text-text-h mb-2">🧼 Наличие мыла</label>
// //             <div className="flex gap-4">
// //               <button
// //                 type="button"
// //                 onClick={() => setHasSoap(true)}
// //                 className={`
// //                   flex-1 py-2 rounded-lg font-medium transition-all cursor-pointer
// //                   ${
// //                     hasSoap === true
// //                       ? "bg-accent text-white"
// //                       : "border border-border text-text hover:border-accent"
// //                   }
// //                 `}
// //               >
// //                 ✅ Есть
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setHasSoap(false)}
// //                 className={`
// //                   flex-1 py-2 rounded-lg font-medium transition-all cursor-pointer
// //                   ${
// //                     hasSoap === false
// //                       ? "bg-accent text-white"
// //                       : "border border-border text-text hover:border-accent"
// //                   }
// //                 `}
// //               >
// //                 ❌ Нет
// //               </button>
// //             </div>
// //           </div>

// //           {/* Комментарий */}
// //           <div className="mb-6">
// //             <label className="block text-text-h mb-2">
// //               💬 Комментарий (необязательно)
// //             </label>
// //             <textarea
// //               value={comment}
// //               onChange={(e) => setComment(e.target.value)}
// //               placeholder="Поделитесь впечатлениями..."
// //               className="w-full border border-border rounded-lg p-3 bg-transparent text-current resize-none focus:outline-none focus:border-accent transition-colors"
// //               rows={3}
// //             />
// //           </div>

// //           {/* Кнопка отправки */}
// //           <button
// //             type="submit"
// //             disabled={isLoading}
// //             className="w-full bg-accent text-white font-bold py-3 rounded-lg cursor-pointer transition hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-2"
// //           >
// //             {isLoading ? (
// //               <>
// //                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// //                 Отправка...
// //               </>
// //             ) : (
// //               "📤 Отправить оценку"
// //             )}
// //           </button>
// //         </form>

// //         <div className="mt-6 text-center">
// //           <div className="bg-accent-bg rounded-lg p-3">
// //             <p className="text-xs text-text">QR код: туалет №{id}</p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // import { useSearchParams } from "react-router-dom";
// // // import { useState } from "react";
// // // import { ToiletIcon } from "lucide-react";
// // // import { ToiletsApi } from "../../features/lib";

// // // export function AnalyticPage() {
// // //   const [searchParams] = useSearchParams();
// // //   const id = searchParams.get("id");

// // //   const [rating, setRating] = useState<number>(5);
// // //   const [hasSoap, setHasSoap] = useState<boolean>(true);
// // //   const [comment, setComment] = useState<string>("");
// // //   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
// // //   const [isLoading, setIsLoading] = useState<boolean>(false);

// // //   const apiToilets = new ToiletsApi();

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     setIsLoading(true);

// // //     try {
// // //       // await new Promise((resolve) => setTimeout(resolve, 1000));

// // //       // const res = await apiToilets.apiToiletsPost({
// // //       //   // toilet: {},
// // //       // });

// // //       console.log({ id, rating, hasSoap, comment });
// // //       setIsSubmitted(true);
// // //     } catch (error) {
// // //       console.error("Ошибка:", error);
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   if (!id) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center">
// // //         <div className="text-center">
// // //           <div className="text-6xl mb-4">⚠️</div>
// // //           <h2>QR код не распознан</h2>
// // //           <p className="text-text">Не удалось определить ID туалета</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (isSubmitted) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center">
// // //         <div className="text-center max-w-md">
// // //           <div className="text-6xl mb-4">✅</div>
// // //           <h2 className="text-accent mb-2">Спасибо за оценку!</h2>
// // //           <p className="text-text mb-4">
// // //             Ваша оценка туалета №{id} успешно отправлена
// // //           </p>
// // //           <button
// // //             onClick={() => setIsSubmitted(false)}
// // //             className="bg-accent text-white px-4 py-2 rounded-lg cursor-pointer transition hover:opacity-80"
// // //           >
// // //             Оценить еще раз
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="flex justify-center py-8 px-4">
// // //       <div className="max-w-md w-full">
// // //         <div className="text-center mb-8 space-y-3">
// // //           <ToiletIcon size={50} className="mx-auto" />

// // //           <h2>Оценка состояния туалета</h2>

// // //           <p className="text-text text-sm">Туалет №{id}</p>
// // //         </div>

// // //         <form
// // //           onSubmit={handleSubmit}
// // //           className="border border-border rounded-xl p-6"
// // //         >
// // //           <div className="mb-6">
// // //             <label className="block text-text-h mb-2">
// // //               Как оцениваете состояние? ⭐
// // //             </label>
// // //             <div className="flex gap-2 flex-wrap items-center justify-center mt-5">
// // //               {[1, 2, 3, 4, 5].map((value) => (
// // //                 <button
// // //                   key={value}
// // //                   type="button"
// // //                   onClick={() => setRating(value)}
// // //                   className={`
// // //                     w-10 h-10 rounded-full font-bold transition-all
// // //                     ${
// // //                       rating === value
// // //                         ? "bg-accent-bg text-accent border-2 border-accent"
// // //                         : "border border-border text-text hover:border-accent"
// // //                     }
// // //                   `}
// // //                 >
// // //                   {value}
// // //                 </button>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           <div className="mb-6">
// // //             <label className="block text-text-h mb-2">🧼 Наличие мыла</label>

// // //             <div className="flex gap-4">
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setHasSoap(true)}
// // //                 className={`
// // //                   flex-1 py-2 rounded-lg font-medium transition-all
// // //                   ${
// // //                     hasSoap === true
// // //                       ? "bg-accent text-white"
// // //                       : "border border-border text-text hover:border-accent"
// // //                   }
// // //                 `}
// // //               >
// // //                 ✅ Есть
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setHasSoap(false)}
// // //                 className={`
// // //                   flex-1 py-2 rounded-lg font-medium transition-all
// // //                   ${
// // //                     hasSoap === false
// // //                       ? "bg-accent text-white"
// // //                       : "border border-border text-text hover:border-accent"
// // //                   }
// // //                 `}
// // //               >
// // //                 ❌ Нет
// // //               </button>
// // //             </div>
// // //           </div>

// // //           <div className="mb-6">
// // //             <label className="block text-text-h mb-2">
// // //               💬 Комментарий (необязательно)
// // //             </label>
// // //             <textarea
// // //               value={comment}
// // //               onChange={(e) => setComment(e.target.value)}
// // //               placeholder="Поделитесь впечатлениями..."
// // //               className="w-full border border-border rounded-lg p-3 bg-transparent text-current resize-none focus:outline-none focus:border-accent transition-colors"
// // //               rows={3}
// // //             />
// // //           </div>

// // //           <button
// // //             type="submit"
// // //             disabled={isLoading}
// // //             className="w-full bg-accent text-white font-bold py-3 rounded-lg cursor-pointer transition hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-2"
// // //           >
// // //             {isLoading ? (
// // //               <>
// // //                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// // //                 Отправка...
// // //               </>
// // //             ) : (
// // //               "📤 Отправить оценку"
// // //             )}
// // //           </button>
// // //         </form>

// // //         <div className="mt-6 text-center">
// // //           <div className="bg-accent-bg rounded-lg p-3">
// // //             <p className="text-xs text-text">QR код: туалет №{id}</p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
