import { ToiletIcon, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DefaultApi } from "../../features/lib";
import { apiConfig } from "../../shared/config/api";

export function QuestionnairePage() {
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get("id");

  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Toilet questions state
  const [smellRating, setSmellRating] = useState<number>(3);
  const [purityRating, setPurityRating] = useState<number>(3);
  const [hasToiletPaper, setHasToiletPaper] = useState<boolean>(true);
  const [hasSoap, setHasSoap] = useState<boolean>(true);

  // Lecture Hall questions state
  const [cleanliness, setCleanliness] = useState<number>(3);
  const [comfort, setComfort] = useState<number>(3);
  const [equipment, setEquipment] = useState<number>(3);

  const [entityType, setEntityType] = useState<"toilet" | "lectureHall" | null>(
    null,
  );

  // ✅ Добавляем state для mappedId
  const [mappedId, setMappedId] = useState<number | null>(null);

  const api = new DefaultApi(apiConfig);

  interface RatingQuestion {
    title: string;
    description: string;
    value: number;
    setValue: (value: number) => void;
    type: "rating";
    min: number;
    max: number;
    labels: Record<number, string>;
  }

  interface BooleanQuestion {
    title: string;
    description: string;
    value: boolean;
    setValue: (value: boolean) => void;
    type: "boolean";
    options: Record<string, string>;
  }

  interface TextareaQuestion {
    title: string;
    description: string;
    value: string;
    setValue: (value: string) => void;
    type: "textarea";
    placeholder: string;
  }

  type Question = RatingQuestion | BooleanQuestion | TextareaQuestion;

  const toiletQuestions: Question[] = [
    {
      title: "🧹 Оцените чистоту",
      description: "Насколько чистая туалетная комната?",
      value: purityRating,
      setValue: setPurityRating,
      type: "rating",
      min: 1,
      max: 5,
      labels: {
        1: "Очень грязно",
        2: "Грязно",
        3: "Средне",
        4: "Чисто",
        5: "Стерильно",
      },
    },
    {
      title: "👃 Оцените аромат",
      description: "Насколько приятный/неприятный запах в помещении?",
      value: smellRating,
      setValue: setSmellRating,
      type: "rating",
      min: 1,
      max: 5,
      labels: {
        1: "Очень неприятный",
        2: "Неприятный",
        3: "Нормально",
        4: "Хорошо",
        5: "Отлично, свежо",
      },
    },
    {
      title: "🧻 Наличие туалетной бумаги",
      description: "Есть ли туалетная бумага?",
      value: hasToiletPaper,
      setValue: setHasToiletPaper,
      type: "boolean",
      options: { true: "✅ Есть", false: "❌ Нет" },
    },
    {
      title: "🧼 Наличие мыла",
      description: "Есть ли мыло?",
      value: hasSoap,
      setValue: setHasSoap,
      type: "boolean",
      options: { true: "✅ Есть", false: "❌ Нет" },
    },
    {
      title: "💬 Комментарий",
      description: "Как мы можем стать лучше (необязательно)",
      value: comment,
      setValue: setComment,
      type: "textarea",
      placeholder: "Ваш комментарий...",
    },
  ];

  const lectureHallQuestions: Question[] = [
    {
      title: "🧹 Оцените чистоту",
      description: "Насколько чисто в лекционном зале?",
      value: cleanliness,
      setValue: setCleanliness,
      type: "rating",
      min: 1,
      max: 5,
      labels: {
        1: "Очень грязно",
        2: "Грязно",
        3: "Средне",
        4: "Чисто",
        5: "Стерильно",
      },
    },
    {
      title: "🪑 Оцените комфортность",
      description: "Насколько комфортно находиться в зале?",
      value: comfort,
      setValue: setComfort,
      type: "rating",
      min: 1,
      max: 5,
      labels: {
        1: "Очень некомфортно",
        2: "Некомфортно",
        3: "Нормально",
        4: "Комфортно",
        5: "Очень комфортно",
      },
    },
    {
      title: "💻 Оцените оснащённость",
      description: "Насколько хорошо зал оснащён орг. техникой?",
      value: equipment,
      setValue: setEquipment,
      type: "rating",
      min: 1,
      max: 5,
      labels: {
        1: "Очень плохо",
        2: "Плохо",
        3: "Удовлетворительно",
        4: "Хорошо",
        5: "Отлично",
      },
    },
    {
      title: "💬 Комментарий",
      description: "Как мы можем стать лучше (необязательно)",
      value: comment,
      setValue: setComment,
      type: "textarea",
      placeholder: "Ваш комментарий...",
    },
  ];

  // ✅ Исправлено: определяем тип объекта и mappedId
  useEffect(() => {
    if (rawId) {
      const numId = parseInt(rawId);
      if (numId > 11) {
        setMappedId(numId - 11);
        setEntityType("lectureHall");
      } else {
        setMappedId(numId);
        setEntityType("toilet");
      }
    }
  }, [rawId]);

  const questions =
    entityType === "lectureHall" ? lectureHallQuestions : toiletQuestions;
  const currentQuestion = questions[currentStep];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    if (!rawId || mappedId === null) {
      setError("ID не указан");
      setIsLoading(false);
      return;
    }

    // ✅ Добавляем лог для проверки
    console.log("Отправка комментария:", comment);
    console.log("Тип:", entityType);
    console.log("mappedId:", mappedId);

    try {
      if (entityType === "toilet") {
        const res = await api.toiletsControllerAddRating({
          id: mappedId,
          toiletCreateRatingDto: {
            hasSoap,
            comment: comment || "", // ✅ гарантируем строку
            smellRating,
            purityRating,
            hasToiletPaper,
          },
        });
        console.log("Успешно отправлено (туалет):", res);
      } else if (entityType === "lectureHall") {
        const res = await api.lectureHallControllerAddRating({
          id: mappedId,
          lectureHallRatingCreateDto: {
            comment: comment || "", // ✅ гарантируем строку
            cleanliness,
            comfort,
            equipment,
          },
        });
        console.log("Успешно отправлено (лекционный зал):", res);
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      setError("Не удалось отправить оценку. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!rawId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2>QR код не распознан</h2>
          <p className="text-text">Не удалось определить ID объекта</p>
        </div>
      </div>
    );
  }

  if (!entityType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p>Загрузка...</p>
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
            Ваша оценка{" "}
            {entityType === "toilet" ? "туалета" : "лекционного зала"} №
            {mappedId} успешно отправлена
          </p>

          <div className="space-y-3">
            <div className="bg-accent-bg rounded-lg p-4 text-left text-sm space-y-2">
              {entityType === "toilet" ? (
                <>
                  <div className="flex justify-between">
                    <span>👃 Запах:</span>
                    <span className="font-bold">{smellRating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🧹 Чистота:</span>
                    <span className="font-bold">{purityRating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🧻 Бумага:</span>
                    <span className="font-bold">
                      {hasToiletPaper ? "✅ Есть" : "❌ Нет"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>🧼 Мыло:</span>
                    <span className="font-bold">
                      {hasSoap ? "✅ Есть" : "❌ Нет"}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>🧹 Чистота:</span>
                    <span className="font-bold">{cleanliness}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🪑 Комфорт:</span>
                    <span className="font-bold">{comfort}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>💻 Техника:</span>
                    <span className="font-bold">{equipment}/5</span>
                  </div>
                </>
              )}
              {comment && comment.trim() !== "" && (
                <div className="pt-2 border-t border-border">
                  <span>💬 {comment}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8 px-4 mt-10">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 space-y-3">
          {entityType === "toilet" ? (
            <ToiletIcon size={50} className="mx-auto" />
          ) : (
            <GraduationCap size={50} className="mx-auto" />
          )}
          <h2>
            {entityType === "toilet"
              ? "Оценка состояния туалета"
              : "Оценка актового зала"}
          </h2>
          <p className="text-text text-sm">
            {entityType === "toilet" ? "Туалет" : "Лекционный зал"} №{mappedId}
          </p>
          <div className="flex justify-center gap-2 mt-4">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? "w-6 bg-accent"
                    : idx < currentStep
                      ? "w-4 bg-accent/50"
                      : "w-4 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="border border-border rounded-xl p-6"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-bold text-text-h mb-2">
              {currentQuestion.title}
            </h3>
            <p className="text-text mb-6">{currentQuestion.description}</p>

            {currentQuestion.type === "rating" && (
              <div className="space-y-6 mt-6">
                <div className="flex gap-2 flex-wrap items-center justify-center">
                  {Array.from(
                    { length: currentQuestion.max - currentQuestion.min + 1 },
                    (_, i) => i + currentQuestion.min,
                  ).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => currentQuestion.setValue(value)}
                      className={`
                        w-12 h-12 rounded-full font-bold transition-all cursor-pointer
                        ${
                          currentQuestion.value === value
                            ? "bg-accent-bg text-accent border-2 border-accent scale-110"
                            : "border border-border text-text hover:border-accent"
                        }
                      `}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="text-center text-sm text-text">
                  {currentQuestion.labels[currentQuestion.value]}
                </div>
              </div>
            )}

            {currentQuestion.type === "boolean" && (
              <div className="flex gap-4 mt-6">
                {Object.entries(currentQuestion.options).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => currentQuestion.setValue(key === "true")}
                    className={`
                      flex-1 py-3 rounded-lg font-medium transition-all cursor-pointer
                      ${
                        currentQuestion.value === (key === "true")
                          ? "bg-accent text-white"
                          : "border border-border text-text hover:border-accent"
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "textarea" && (
              <textarea
                value={currentQuestion.value}
                onChange={(e) => currentQuestion.setValue(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full border border-border mt-6 rounded-lg p-3 bg-transparent text-current resize-none focus:outline-none focus:border-accent transition-colors"
                rows={4}
              />
            )}
          </div>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 border border-border text-text font-medium py-3 rounded-lg cursor-pointer transition hover:border-accent"
              >
                ← Назад
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className={`${
                currentStep > 0 ? "flex-1" : "w-full"
              } bg-accent text-white font-bold py-3 rounded-lg cursor-pointer transition hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Отправка...
                </>
              ) : currentStep === questions.length - 1 ? (
                "📤 Отправить оценку"
              ) : (
                "Далее →"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <div className="bg-accent-bg rounded-lg p-3">
            <p className="text-xs text-text">
              {entityType === "toilet"
                ? "QR код: туалет"
                : "QR код: лекционный зал"}{" "}
              №{mappedId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { ToiletIcon, GraduationCap } from "lucide-react";
// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { DefaultApi } from "../../features/lib";
// import { apiConfig } from "../../shared/config/api";

// export function QuestionnairePage() {
//   const [searchParams] = useSearchParams();
//   const rawId = searchParams.get("id");

//   const [comment, setComment] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const [currentStep, setCurrentStep] = useState<number>(0);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

//   // Toilet questions state
//   const [smellRating, setSmellRating] = useState<number>(3);
//   const [purityRating, setPurityRating] = useState<number>(3);
//   const [hasToiletPaper, setHasToiletPaper] = useState<boolean>(true);
//   const [hasSoap, setHasSoap] = useState<boolean>(true);

//   // Lecture Hall questions state
//   const [cleanliness, setCleanliness] = useState<number>(3);
//   const [comfort, setComfort] = useState<number>(3);
//   const [equipment, setEquipment] = useState<number>(3);

//   const [entityType, setEntityType] = useState<"toilet" | "lectureHall" | null>(
//     null,
//   );

//   // Маппинг ID: для лекционных залов преобразуем ID > 11 в последовательные (12→1, 13→2, 14→3...)
//   let id: string | null = rawId;
//   let mappedId: number | null = null;

//   if (rawId) {
//     const numId = parseInt(rawId);
//     if (numId > 11) {
//       // Преобразуем ID лекционного зала: 12 → 1, 13 → 2, 14 → 3, ...
//       mappedId = numId - 11;
//       entityType === "lectureHall";
//     } else {
//       mappedId = numId;
//       entityType === "toilet";
//     }
//   }

//   const api = new DefaultApi(apiConfig);

//   interface RatingQuestion {
//     title: string;
//     description: string;
//     value: number;
//     setValue: (value: number) => void;
//     type: "rating";
//     min: number;
//     max: number;
//     labels: Record<number, string>;
//   }

//   interface BooleanQuestion {
//     title: string;
//     description: string;
//     value: boolean;
//     setValue: (value: boolean) => void;
//     type: "boolean";
//     options: Record<string, string>;
//   }

//   interface TextareaQuestion {
//     title: string;
//     description: string;
//     value: string;
//     setValue: (value: string) => void;
//     type: "textarea";
//     placeholder: string;
//   }

//   type Question = RatingQuestion | BooleanQuestion | TextareaQuestion;

//   const toiletQuestions: Question[] = [
//     {
//       title: "🧹 Оцените чистоту",
//       description: "Насколько чистая туалетная комната?",
//       value: purityRating,
//       setValue: setPurityRating,
//       type: "rating",
//       min: 1,
//       max: 5,
//       labels: {
//         1: "Очень грязно",
//         2: "Грязно",
//         3: "Средне",
//         4: "Чисто",
//         5: "Стерильно",
//       },
//     },
//     {
//       title: "👃 Оцените аромат",
//       description: "Насколько приятный/неприятный запах в помещении?",
//       value: smellRating,
//       setValue: setSmellRating,
//       type: "rating",
//       min: 1,
//       max: 5,
//       labels: {
//         1: "Очень неприятный",
//         2: "Неприятный",
//         3: "Нормально",
//         4: "Хорошо",
//         5: "Отлично, свежо",
//       },
//     },
//     {
//       title: "🧻 Наличие туалетной бумаги",
//       description: "Есть ли туалетная бумага?",
//       value: hasToiletPaper,
//       setValue: setHasToiletPaper,
//       type: "boolean",
//       options: { true: "✅ Есть", false: "❌ Нет" },
//     },
//     {
//       title: "🧼 Наличие мыла",
//       description: "Есть ли мыло?",
//       value: hasSoap,
//       setValue: setHasSoap,
//       type: "boolean",
//       options: { true: "✅ Есть", false: "❌ Нет" },
//     },
//     {
//       title: "💬 Комментарий",
//       description: "Как мы можем стать лучше (необязательно)",
//       value: comment,
//       setValue: setComment,
//       type: "textarea",
//       placeholder: "Ваш комментарий...",
//     },
//   ];

//   const lectureHallQuestions: Question[] = [
//     {
//       title: "🧹 Оцените чистоту",
//       description: "Насколько чисто в лекционном зале?",
//       value: cleanliness,
//       setValue: setCleanliness,
//       type: "rating",
//       min: 1,
//       max: 5,
//       labels: {
//         1: "Очень грязно",
//         2: "Грязно",
//         3: "Средне",
//         4: "Чисто",
//         5: "Стерильно",
//       },
//     },
//     {
//       title: "🪑 Оцените комфортность",
//       description: "Насколько комфортно находиться в зале?",
//       value: comfort,
//       setValue: setComfort,
//       type: "rating",
//       min: 1,
//       max: 5,
//       labels: {
//         1: "Очень некомфортно",
//         2: "Некомфортно",
//         3: "Нормально",
//         4: "Комфортно",
//         5: "Очень комфортно",
//       },
//     },
//     {
//       title: "💻 Оцените оснащённость",
//       description: "Насколько хорошо зал оснащён орг. техникой?",
//       value: equipment,
//       setValue: setEquipment,
//       type: "rating",
//       min: 1,
//       max: 5,
//       labels: {
//         1: "Очень плохо",
//         2: "Плохо",
//         3: "Удовлетворительно",
//         4: "Хорошо",
//         5: "Отлично",
//       },
//     },
//     {
//       title: "💬 Комментарий",
//       description: "Как мы можем стать лучше (необязательно)",
//       value: comment,
//       setValue: setComment,
//       type: "textarea",
//       placeholder: "Ваш комментарий...",
//     },
//   ];

//   // Определяем тип объекта по ID
//   useEffect(() => {
//     if (rawId) {
//       const numId = parseInt(rawId);
//       if (numId > 11) {
//         setEntityType("lectureHall");
//       } else {
//         setEntityType("toilet");
//       }
//     }
//   }, [rawId]);

//   const questions =
//     entityType === "lectureHall" ? lectureHallQuestions : toiletQuestions;
//   const currentQuestion = questions[currentStep];

//   const handleNext = () => {
//     if (currentStep < questions.length - 1) {
//       setCurrentStep(currentStep + 1);
//     } else {
//       handleSubmit();
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     setError(null);

//     if (!rawId || mappedId === null) {
//       setError("ID не указан");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       if (entityType === "toilet") {
//         // Отправка для туалета - используем оригинальный ID
//         const res = await api.toiletsControllerAddRating({
//           id: mappedId,
//           toiletCreateRatingDto: {
//             hasSoap,
//             comment,
//             smellRating,
//             purityRating,
//             hasToiletPaper,
//           },
//         });
//         console.log("Успешно отправлено (туалет):", res);
//       } else {
//         // Отправка для лекционного зала - используем маппированный ID (1, 2, 3...)
//         const res = await api.lectureHallControllerAddRating({
//           id: mappedId,
//           lectureHallRatingCreateDto: {
//             comment,
//             cleanliness,
//             comfort,
//             equipment,
//           },
//         });
//         console.log("Успешно отправлено (лекционный зал):", res);
//       }
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error("Ошибка при отправке:", error);
//       setError("Не удалось отправить оценку. Попробуйте позже.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!rawId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">⚠️</div>
//           <h2>QR код не распознан</h2>
//           <p className="text-text">Не удалось определить ID объекта</p>
//         </div>
//       </div>
//     );
//   }

//   if (!entityType) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin text-4xl mb-4">⏳</div>
//           <p>Загрузка...</p>
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
//             Ваша оценка{" "}
//             {entityType === "toilet" ? "туалета" : "лекционного зала"} №
//             {mappedId} успешно отправлена
//           </p>

//           <div className="space-y-3">
//             <div className="bg-accent-bg rounded-lg p-4 text-left text-sm space-y-2">
//               {entityType === "toilet" ? (
//                 <>
//                   <div className="flex justify-between">
//                     <span>👃 Запах:</span>
//                     <span className="font-bold">{smellRating}/5</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>🧹 Чистота:</span>
//                     <span className="font-bold">{purityRating}/5</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>🧻 Бумага:</span>
//                     <span className="font-bold">
//                       {hasToiletPaper ? "✅ Есть" : "❌ Нет"}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>🧼 Мыло:</span>
//                     <span className="font-bold">
//                       {hasSoap ? "✅ Есть" : "❌ Нет"}
//                     </span>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="flex justify-between">
//                     <span>🧹 Чистота:</span>
//                     <span className="font-bold">{cleanliness}/5</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>🪑 Комфорт:</span>
//                     <span className="font-bold">{comfort}/5</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>💻 Техника:</span>
//                     <span className="font-bold">{equipment}/5</span>
//                   </div>
//                 </>
//               )}
//               {comment && (
//                 <div className="pt-2 border-t border-border">
//                   <span>💬 {comment}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center py-8 px-4 mt-10">
//       <div className="max-w-md w-full">
//         <div className="text-center mb-8 space-y-3">
//           {entityType === "toilet" ? (
//             <ToiletIcon size={50} className="mx-auto" />
//           ) : (
//             <GraduationCap size={50} className="mx-auto" />
//           )}
//           <h2>
//             {entityType === "toilet"
//               ? "Оценка состояния туалета"
//               : // : "Оценка лекционного зала"}
//                 "Оценка актового зала"}
//           </h2>
//           <p className="text-text text-sm">
//             {entityType === "toilet" ? "Туалет" : "Лекционный зал"} №{mappedId}
//           </p>
//           <div className="flex justify-center gap-2 mt-4">
//             {questions.map((_, idx) => (
//               <div
//                 key={idx}
//                 className={`h-1.5 rounded-full transition-all ${
//                   idx === currentStep
//                     ? "w-6 bg-accent"
//                     : idx < currentStep
//                       ? "w-4 bg-accent/50"
//                       : "w-4 bg-border"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>

//         <form
//           onSubmit={(e) => e.preventDefault()}
//           className="border border-border rounded-xl p-6"
//         >
//           {error && (
//             <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
//               {error}
//             </div>
//           )}

//           <div className="mb-6">
//             <h3 className="text-xl font-bold text-text-h mb-2">
//               {currentQuestion.title}
//             </h3>
//             <p className="text-text mb-6">{currentQuestion.description}</p>

//             {currentQuestion.type === "rating" && (
//               <div className="space-y-6 mt-6">
//                 <div className="flex gap-2 flex-wrap items-center justify-center">
//                   {Array.from(
//                     { length: currentQuestion.max - currentQuestion.min + 1 },
//                     (_, i) => i + currentQuestion.min,
//                   ).map((value) => (
//                     <button
//                       key={value}
//                       type="button"
//                       onClick={() => currentQuestion.setValue(value)}
//                       className={`
//                         w-12 h-12 rounded-full font-bold transition-all cursor-pointer
//                         ${
//                           currentQuestion.value === value
//                             ? "bg-accent-bg text-accent border-2 border-accent scale-110"
//                             : "border border-border text-text hover:border-accent"
//                         }
//                       `}
//                     >
//                       {value}
//                     </button>
//                   ))}
//                 </div>
//                 <div className="text-center text-sm text-text">
//                   {currentQuestion.labels[currentQuestion.value]}
//                 </div>
//               </div>
//             )}

//             {currentQuestion.type === "boolean" && (
//               <div className="flex gap-4 mt-6">
//                 {Object.entries(currentQuestion.options).map(([key, label]) => (
//                   <button
//                     key={key}
//                     type="button"
//                     onClick={() => currentQuestion.setValue(key === "true")}
//                     className={`
//                       flex-1 py-3 rounded-lg font-medium transition-all cursor-pointer
//                       ${
//                         currentQuestion.value === (key === "true")
//                           ? "bg-accent text-white"
//                           : "border border-border text-text hover:border-accent"
//                       }
//                     `}
//                   >
//                     {label}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {currentQuestion.type === "textarea" && (
//               <textarea
//                 value={currentQuestion.value}
//                 onChange={(e) => currentQuestion.setValue(e.target.value)}
//                 placeholder={currentQuestion.placeholder}
//                 className="w-full border border-border mt-6 rounded-lg p-3 bg-transparent text-current resize-none focus:outline-none focus:border-accent transition-colors"
//                 rows={4}
//               />
//             )}
//           </div>

//           <div className="flex gap-3">
//             {currentStep > 0 && (
//               <button
//                 type="button"
//                 onClick={handleBack}
//                 className="flex-1 border border-border text-text font-medium py-3 rounded-lg cursor-pointer transition hover:border-accent"
//               >
//                 ← Назад
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={handleNext}
//               disabled={isLoading}
//               className={`${
//                 currentStep > 0 ? "flex-1" : "w-full"
//               } bg-accent text-white font-bold py-3 rounded-lg cursor-pointer transition hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-2`}
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Отправка...
//                 </>
//               ) : currentStep === questions.length - 1 ? (
//                 "📤 Отправить оценку"
//               ) : (
//                 "Далее →"
//               )}
//             </button>
//           </div>
//         </form>

//         <div className="mt-6 text-center">
//           <div className="bg-accent-bg rounded-lg p-3">
//             <p className="text-xs text-text">
//               {entityType === "toilet"
//                 ? "QR код: туалет"
//                 : "QR код: лекционный зал"}{" "}
//               №{mappedId}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // import { ToiletIcon, GraduationCap } from "lucide-react";
// // import { useState, useEffect } from "react";
// // import { useSearchParams } from "react-router-dom";
// // import { DefaultApi } from "../../features/lib";
// // import { apiConfig } from "../../shared/config/api";

// // export function QuestionnairePage() {
// //   const [searchParams] = useSearchParams();
// //   const id = searchParams.get("id");

// //   const [comment, setComment] = useState<string>("");
// //   const [error, setError] = useState<string | null>(null);
// //   const [currentStep, setCurrentStep] = useState<number>(0);
// //   const [isLoading, setIsLoading] = useState<boolean>(false);
// //   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

// //   // Toilet questions state
// //   const [smellRating, setSmellRating] = useState<number>(3);
// //   const [purityRating, setPurityRating] = useState<number>(3);
// //   const [hasToiletPaper, setHasToiletPaper] = useState<boolean>(true);
// //   const [hasSoap, setHasSoap] = useState<boolean>(true);

// //   // Lecture Hall questions state
// //   const [cleanliness, setCleanliness] = useState<number>(3);
// //   const [comfort, setComfort] = useState<number>(3);
// //   const [equipment, setEquipment] = useState<number>(3);

// //   const [entityType, setEntityType] = useState<"toilet" | "lectureHall" | null>(
// //     null,
// //   );

// //   const api = new DefaultApi(apiConfig);

// //   interface RatingQuestion {
// //     title: string;
// //     description: string;
// //     value: number;
// //     setValue: (value: number) => void;
// //     type: "rating";
// //     min: number;
// //     max: number;
// //     labels: Record<number, string>;
// //   }

// //   interface TextareaQuestion {
// //     title: string;
// //     description: string;
// //     value: string;
// //     setValue: (value: string) => void;
// //     type: "textarea";
// //     placeholder: string;
// //   }

// //   type Question = RatingQuestion | TextareaQuestion;

// //   // Вопросы для туалета
// //   const toiletQuestions: Question[] = [
// //     {
// //       title: "🧹 Оцените чистоту",
// //       description: "Насколько чистая туалетная комната?",
// //       value: purityRating,
// //       setValue: setPurityRating,
// //       type: "rating",
// //       min: 1,
// //       max: 5,
// //       labels: {
// //         1: "Очень грязно",
// //         2: "Грязно",
// //         3: "Средне",
// //         4: "Чисто",
// //         5: "Стерильно",
// //       },
// //     },
// //     {
// //       title: "👃 Оцените аромат",
// //       description: "Насколько приятный/неприятный запах в помещении?",
// //       value: smellRating,
// //       setValue: setSmellRating,
// //       type: "rating",
// //       min: 1,
// //       max: 5,
// //       labels: {
// //         1: "Очень неприятный",
// //         2: "Неприятный",
// //         3: "Нормально",
// //         4: "Хорошо",
// //         5: "Отлично, свежо",
// //       },
// //     },
// //     {
// //       title: "🧻 Наличие туалетной бумаги",
// //       description: "Есть ли туалетная бумага?",
// //       value: hasToiletPaper ? 1 : 0,
// //       setValue: (val: number) => setHasToiletPaper(val === 1),
// //       type: "rating",
// //       min: 0,
// //       max: 1,
// //       labels: {
// //         0: "❌ Нет",
// //         1: "✅ Есть",
// //       },
// //     },
// //     {
// //       title: "🧼 Наличие мыла",
// //       description: "Есть ли мыло?",
// //       value: hasSoap ? 1 : 0,
// //       setValue: (val: number) => setHasSoap(val === 1),
// //       type: "rating",
// //       min: 0,
// //       max: 1,
// //       labels: {
// //         0: "❌ Нет",
// //         1: "✅ Есть",
// //       },
// //     },
// //     {
// //       title: "💬 Комментарий",
// //       description: "Как мы можем стать лучше (необязательно)",
// //       value: comment,
// //       setValue: setComment,
// //       type: "textarea",
// //       placeholder: "Ваш комментарий...",
// //     },
// //   ];

// //   // Вопросы для лекционного зала
// //   const lectureHallQuestions: Question[] = [
// //     {
// //       title: "🧹 Оцените чистоту",
// //       description: "Насколько чисто в лекционном зале?",
// //       value: cleanliness,
// //       setValue: setCleanliness,
// //       type: "rating",
// //       min: 1,
// //       max: 5,
// //       labels: {
// //         1: "Очень грязно",
// //         2: "Грязно",
// //         3: "Средне",
// //         4: "Чисто",
// //         5: "Стерильно",
// //       },
// //     },
// //     {
// //       title: "🪑 Оцените комфортность",
// //       description: "Насколько комфортно находиться в зале?",
// //       value: comfort,
// //       setValue: setComfort,
// //       type: "rating",
// //       min: 1,
// //       max: 5,
// //       labels: {
// //         1: "Очень некомфортно",
// //         2: "Некомфортно",
// //         3: "Нормально",
// //         4: "Комфортно",
// //         5: "Очень комфортно",
// //       },
// //     },
// //     {
// //       title: "💻 Оцените оснащённость",
// //       description: "Насколько хорошо зал оснащён орг. техникой?",
// //       value: equipment,
// //       setValue: setEquipment,
// //       type: "rating",
// //       min: 1,
// //       max: 5,
// //       labels: {
// //         1: "Очень плохо",
// //         2: "Плохо",
// //         3: "Удовлетворительно",
// //         4: "Хорошо",
// //         5: "Отлично",
// //       },
// //     },
// //     {
// //       title: "💬 Комментарий",
// //       description: "Как мы можем стать лучше (необязательно)",
// //       value: comment,
// //       setValue: setComment,
// //       type: "textarea",
// //       placeholder: "Ваш комментарий...",
// //     },
// //   ];

// //   // Определяем тип объекта по ID
// //   useEffect(() => {
// //     if (id) {
// //       const idNumber = parseInt(id);
// //       if (idNumber > 11) {
// //         setEntityType("lectureHall");
// //       } else {
// //         setEntityType("toilet");
// //       }
// //     }
// //   }, [id]);

// //   const questions =
// //     entityType === "lectureHall" ? lectureHallQuestions : toiletQuestions;
// //   const currentQuestion = questions[currentStep];

// //   const handleNext = () => {
// //     if (currentStep < questions.length - 1) {
// //       setCurrentStep(currentStep + 1);
// //     } else {
// //       handleSubmit();
// //     }
// //   };

// //   const handleBack = () => {
// //     if (currentStep > 0) {
// //       setCurrentStep(currentStep - 1);
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     setIsLoading(true);
// //     setError(null);

// //     if (!id) {
// //       setError("ID не указан");
// //       setIsLoading(false);
// //       return;
// //     }

// //     try {
// //       if (entityType === "toilet") {
// //         // Отправка для туалета
// //         const res = await api.toiletsControllerAddRating({
// //           id: parseInt(id),
// //           toiletCreateRatingDto: {
// //             hasSoap,
// //             comment,
// //             smellRating,
// //             purityRating,
// //             hasToiletPaper,
// //           },
// //         });
// //         console.log("Успешно отправлено (туалет):", res);
// //       } else {

// //         const lectionHallId = id > 11 ?  :
// //         // Отправка для лекционного зала
// //         const res = await api.lectureHallControllerAddRating({
// //           id: parseInt(id),
// //           lectureHallRatingCreateDto: {
// //             comment,
// //             cleanliness,
// //             comfort,
// //             equipment,
// //           },
// //         });
// //         console.log("Успешно отправлено (лекционный зал):", res);
// //       }
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
// //           <p className="text-text">Не удалось определить ID объекта</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!entityType) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin text-4xl mb-4">⏳</div>
// //           <p>Загрузка...</p>
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
// //             Ваша оценка{" "}
// //             {entityType === "toilet" ? "туалета" : "лекционного зала"} №{id}{" "}
// //             успешно отправлена
// //           </p>

// //           <div className="space-y-3">
// //             <div className="bg-accent-bg rounded-lg p-4 text-left text-sm space-y-2">
// //               {entityType === "toilet" ? (
// //                 <>
// //                   <div className="flex justify-between">
// //                     <span>👃 Запах:</span>
// //                     <span className="font-bold">{smellRating}/5</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span>🧹 Чистота:</span>
// //                     <span className="font-bold">{purityRating}/5</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span>🧻 Бумага:</span>
// //                     <span className="font-bold">
// //                       {hasToiletPaper ? "✅ Есть" : "❌ Нет"}
// //                     </span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span>🧼 Мыло:</span>
// //                     <span className="font-bold">
// //                       {hasSoap ? "✅ Есть" : "❌ Нет"}
// //                     </span>
// //                   </div>
// //                 </>
// //               ) : (
// //                 <>
// //                   <div className="flex justify-between">
// //                     <span>🧹 Чистота:</span>
// //                     <span className="font-bold">{cleanliness}/5</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span>🪑 Комфорт:</span>
// //                     <span className="font-bold">{comfort}/5</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span>💻 Техника:</span>
// //                     <span className="font-bold">{equipment}/5</span>
// //                   </div>
// //                 </>
// //               )}
// //               {comment && (
// //                 <div className="pt-2 border-t border-border">
// //                   <span>💬 {comment}</span>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex justify-center py-8 px-4 mt-10">
// //       <div className="max-w-md w-full">
// //         <div className="text-center mb-8 space-y-3">
// //           {entityType === "toilet" ? (
// //             <ToiletIcon size={50} className="mx-auto" />
// //           ) : (
// //             <GraduationCap size={50} className="mx-auto" />
// //           )}
// //           <h2>
// //             {entityType === "toilet"
// //               ? "Оценка состояния туалета"
// //               : "Оценка лекционного зала"}
// //           </h2>
// //           <p className="text-text text-sm">
// //             {entityType === "toilet" ? "Туалет" : "Лекционный зал"} №{id}
// //           </p>
// //           <div className="flex justify-center gap-2 mt-4">
// //             {questions.map((_, idx) => (
// //               <div
// //                 key={idx}
// //                 className={`h-1.5 rounded-full transition-all ${
// //                   idx === currentStep
// //                     ? "w-6 bg-accent"
// //                     : idx < currentStep
// //                       ? "w-4 bg-accent/50"
// //                       : "w-4 bg-border"
// //                 }`}
// //               />
// //             ))}
// //           </div>
// //         </div>

// //         <form
// //           onSubmit={(e) => e.preventDefault()}
// //           className="border border-border rounded-xl p-6"
// //         >
// //           {error && (
// //             <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
// //               {error}
// //             </div>
// //           )}

// //           <div className="mb-6">
// //             <h3 className="text-xl font-bold text-text-h mb-2">
// //               {currentQuestion.title}
// //             </h3>
// //             <p className="text-text mb-6">{currentQuestion.description}</p>

// //             {currentQuestion.type === "rating" && (
// //               <div className="space-y-6 mt-6">
// //                 <div className="flex gap-2 flex-wrap items-center justify-center">
// //                   {Array.from(
// //                     { length: currentQuestion.max - currentQuestion.min + 1 },
// //                     (_, i) => i + currentQuestion.min,
// //                   ).map((value) => (
// //                     <button
// //                       key={value}
// //                       type="button"
// //                       onClick={() => currentQuestion.setValue(value)}
// //                       className={`
// //                         w-12 h-12 rounded-full font-bold transition-all cursor-pointer
// //                         ${
// //                           currentQuestion.value === value
// //                             ? "bg-accent-bg text-accent border-2 border-accent scale-110"
// //                             : "border border-border text-text hover:border-accent"
// //                         }
// //                       `}
// //                     >
// //                       {value === 0 ? "❌" : value === 1 ? "✅" : value}
// //                     </button>
// //                   ))}
// //                 </div>
// //                 <div className="text-center text-sm text-text">
// //                   {currentQuestion.labels[currentQuestion.value]}
// //                 </div>
// //               </div>
// //             )}

// //             {currentQuestion.type === "textarea" && (
// //               <textarea
// //                 value={currentQuestion.value}
// //                 onChange={(e) => currentQuestion.setValue(e.target.value)}
// //                 placeholder={currentQuestion.placeholder}
// //                 className="w-full border border-border mt-6 rounded-lg p-3 bg-transparent text-current resize-none focus:outline-none focus:border-accent transition-colors"
// //                 rows={4}
// //               />
// //             )}
// //           </div>

// //           <div className="flex gap-3">
// //             {currentStep > 0 && (
// //               <button
// //                 type="button"
// //                 onClick={handleBack}
// //                 className="flex-1 border border-border text-text font-medium py-3 rounded-lg cursor-pointer transition hover:border-accent"
// //               >
// //                 ← Назад
// //               </button>
// //             )}
// //             <button
// //               type="button"
// //               onClick={handleNext}
// //               disabled={isLoading}
// //               className={`${
// //                 currentStep > 0 ? "flex-1" : "w-full"
// //               } bg-accent text-white font-bold py-3 rounded-lg cursor-pointer transition hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-2`}
// //             >
// //               {isLoading ? (
// //                 <>
// //                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// //                   Отправка...
// //                 </>
// //               ) : currentStep === questions.length - 1 ? (
// //                 "📤 Отправить оценку"
// //               ) : (
// //                 "Далее →"
// //               )}
// //             </button>
// //           </div>
// //         </form>

// //         <div className="mt-6 text-center">
// //           <div className="bg-accent-bg rounded-lg p-3">
// //             <p className="text-xs text-text">
// //               {entityType === "toilet"
// //                 ? "QR код: туалет"
// //                 : "QR код: лекционный зал"}{" "}
// //               №{id}
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // import { ToiletIcon } from "lucide-react";
// // // import { useState } from "react";
// // // import { useSearchParams } from "react-router-dom";
// // // import { DefaultApi } from "../../features/lib";
// // // import { apiConfig } from "../../shared/config/api";

// // // export function QuestionnairePage() {
// // //   const [searchParams] = useSearchParams();
// // //   const id = searchParams.get("id");

// // //   const [comment, setComment] = useState<string>("");
// // //   const [hasSoap, setHasSoap] = useState<boolean>(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [currentStep, setCurrentStep] = useState<number>(0);
// // //   const [smellRating, setSmellRating] = useState<number>(3);
// // //   const [isLoading, setIsLoading] = useState<boolean>(false);
// // //   const [purityRating, setPurityRating] = useState<number>(3);
// // //   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
// // //   const [hasToiletPaper, setHasToiletPaper] = useState<boolean>(true);

// // //   const api = new DefaultApi(apiConfig);

// // //   interface RatingQuestion {
// // //     title: string;
// // //     description: string;
// // //     value: number;
// // //     setValue: (value: number) => void;
// // //     type: "rating";
// // //     min: number;
// // //     max: number;
// // //     labels: Record<number, string>;
// // //   }

// // //   interface BooleanQuestion {
// // //     title: string;
// // //     description: string;
// // //     value: boolean;
// // //     setValue: (value: boolean) => void;
// // //     type: "boolean";
// // //     options: Record<string, string>;
// // //   }

// // //   interface TextareaQuestion {
// // //     title: string;
// // //     description: string;
// // //     value: string;
// // //     setValue: (value: string) => void;
// // //     type: "textarea";
// // //     placeholder: string;
// // //   }

// // //   type Question = RatingQuestion | BooleanQuestion | TextareaQuestion;

// // //   const questions: Question[] = [
// // //     {
// // //       title: "🧹 Оцените чистоту",
// // //       description: "Насколько чистая туалетная комната?",
// // //       value: purityRating,
// // //       setValue: setPurityRating,
// // //       type: "rating",
// // //       min: 1,
// // //       max: 5,
// // //       labels: {
// // //         1: "Очень грязно",
// // //         2: "Грязно",
// // //         3: "Средне",
// // //         4: "Чисто",
// // //         5: "Стерильно",
// // //       },
// // //     },
// // //     {
// // //       title: "👃 Оцените аромат",
// // //       description: "Насколько приятный/неприятный запах в помещении?",
// // //       value: smellRating,
// // //       setValue: setSmellRating,
// // //       type: "rating",
// // //       min: 1,
// // //       max: 5,
// // //       labels: {
// // //         1: "Очень неприятный",
// // //         2: "Неприятный",
// // //         3: "Нормально",
// // //         4: "Хорошо",
// // //         5: "Отлично, свежо",
// // //       },
// // //     },
// // //     {
// // //       title: "🧻 Наличие туалетной бумаги",
// // //       description: "Есть ли туалетная бумага?",
// // //       value: hasToiletPaper,
// // //       setValue: setHasToiletPaper,
// // //       type: "boolean",
// // //       options: { true: "✅ Есть", false: "❌ Нет" },
// // //     },
// // //     {
// // //       title: "🧼 Наличие мыло",
// // //       description: "Есть ли мыло?",
// // //       value: hasSoap,
// // //       setValue: setHasSoap,
// // //       type: "boolean",
// // //       options: { true: "✅ Есть", false: "❌ Нет" },
// // //     },
// // //     {
// // //       title: "💬 Комментарий",
// // //       description: "Как мы можем стать лучше (необязательно)",
// // //       value: comment,
// // //       setValue: setComment,
// // //       type: "textarea",
// // //       placeholder: "Ваш комментарий...",
// // //     },
// // //   ];

// // //   const handleNext = () => {
// // //     if (currentStep < questions.length - 1) {
// // //       setCurrentStep(currentStep + 1);
// // //     } else {
// // //       handleSubmit();
// // //     }
// // //   };

// // //   const handleBack = () => {
// // //     if (currentStep > 0) {
// // //       setCurrentStep(currentStep - 1);
// // //     }
// // //   };

// // //   const handleSubmit = async () => {
// // //     setIsLoading(true);
// // //     setError(null);

// // //     if (!id) {
// // //       setError("ID туалета не указан");
// // //       setIsLoading(false);
// // //       return;
// // //     }

// // //     try {
// // //       const res = await api.toiletsControllerAddRating({
// // //         id: parseInt(id),
// // //         toiletCreateRatingDto: {
// // //           hasSoap,
// // //           comment,
// // //           smellRating,
// // //           purityRating,
// // //           hasToiletPaper,
// // //         },
// // //       });

// // //       console.log("Успешно отправлено:", res);
// // //       setIsSubmitted(true);
// // //     } catch (error) {
// // //       console.error("Ошибка при отправке:", error);
// // //       setError("Не удалось отправить оценку. Попробуйте позже.");
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const currentQuestion = questions[currentStep];

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

// // //           <div className="space-y-3">
// // //             <div className="bg-accent-bg rounded-lg p-4 text-left text-sm space-y-2">
// // //               <div className="flex justify-between">
// // //                 <span>👃 Запах:</span>
// // //                 <span className="font-bold">{smellRating}/5</span>
// // //               </div>
// // //               <div className="flex justify-between">
// // //                 <span>🧹 Чистота:</span>
// // //                 <span className="font-bold">{purityRating}/5</span>
// // //               </div>
// // //               <div className="flex justify-between">
// // //                 <span>🧻 Бумага:</span>
// // //                 <span className="font-bold">
// // //                   {hasToiletPaper ? "✅ Есть" : "❌ Нет"}
// // //                 </span>
// // //               </div>
// // //               <div className="flex justify-between">
// // //                 <span>🧼 Мыло:</span>
// // //                 <span className="font-bold">
// // //                   {hasSoap ? "✅ Есть" : "❌ Нет"}
// // //                 </span>
// // //               </div>
// // //               {comment && (
// // //                 <div className="pt-2 border-t border-border">
// // //                   <span>💬 {comment}</span>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="flex justify-center py-8 px-4 mt-10">
// // //       <div className="max-w-md w-full">
// // //         <div className="text-center mb-8 space-y-3">
// // //           <ToiletIcon size={50} className="mx-auto" />
// // //           <h2>Оценка состояния туалета</h2>
// // //           <p className="text-text text-sm">Туалет №{id}</p>
// // //           <div className="flex justify-center gap-2 mt-4">
// // //             {questions.map((_, idx) => (
// // //               <div
// // //                 key={idx}
// // //                 className={`h-1.5 rounded-full transition-all ${
// // //                   idx === currentStep
// // //                     ? "w-6 bg-accent"
// // //                     : idx < currentStep
// // //                       ? "w-4 bg-accent/50"
// // //                       : "w-4 bg-border"
// // //                 }`}
// // //               />
// // //             ))}
// // //           </div>
// // //         </div>

// // //         <form
// // //           onSubmit={(e) => e.preventDefault()}
// // //           className="border border-border rounded-xl p-6"
// // //         >
// // //           {error && (
// // //             <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
// // //               {error}
// // //             </div>
// // //           )}

// // //           <div className="mb-6">
// // //             <h3 className="text-xl font-bold text-text-h mb-2">
// // //               {currentQuestion.title}
// // //             </h3>
// // //             <p className="text-text mb-6">{currentQuestion.description}</p>

// // //             {currentQuestion.type === "rating" && (
// // //               <div className="space-y-6 mt-6">
// // //                 <div className="flex gap-2 flex-wrap items-center justify-center">
// // //                   {Array.from(
// // //                     { length: currentQuestion.max - currentQuestion.min + 1 },
// // //                     (_, i) => i + currentQuestion.min,
// // //                   ).map((value) => (
// // //                     <button
// // //                       key={value}
// // //                       type="button"
// // //                       onClick={() => currentQuestion.setValue(value)}
// // //                       className={`
// // //                         w-12 h-12 rounded-full font-bold transition-all cursor-pointer
// // //                         ${
// // //                           currentQuestion.value === value
// // //                             ? "bg-accent-bg text-accent border-2 border-accent scale-110"
// // //                             : "border border-border text-text hover:border-accent"
// // //                         }
// // //                       `}
// // //                     >
// // //                       {value}
// // //                     </button>
// // //                   ))}
// // //                 </div>
// // //                 <div className="text-center text-sm text-text">
// // //                   {currentQuestion.labels[currentQuestion.value]}
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {currentQuestion.type === "boolean" && (
// // //               <div className="flex gap-4 mt-6">
// // //                 {Object.entries(currentQuestion.options).map(([key, label]) => (
// // //                   <button
// // //                     key={key}
// // //                     type="button"
// // //                     onClick={() => currentQuestion.setValue(key === "true")}
// // //                     className={`
// // //                       flex-1 py-3 rounded-lg font-medium transition-all cursor-pointer
// // //                       ${
// // //                         currentQuestion.value === (key === "true")
// // //                           ? "bg-accent text-white"
// // //                           : "border border-border text-text hover:border-accent"
// // //                       }
// // //                     `}
// // //                   >
// // //                     {label}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             )}

// // //             {currentQuestion.type === "textarea" && (
// // //               <textarea
// // //                 value={currentQuestion.value}
// // //                 onChange={(e) => currentQuestion.setValue(e.target.value)}
// // //                 placeholder={currentQuestion.placeholder}
// // //                 className="w-full border border-border mt-6 rounded-lg p-3 bg-transparent text-current resize-none focus:outline-none focus:border-accent transition-colors"
// // //                 rows={4}
// // //               />
// // //             )}
// // //           </div>

// // //           <div className="flex gap-3">
// // //             {currentStep > 0 && (
// // //               <button
// // //                 type="button"
// // //                 onClick={handleBack}
// // //                 className="flex-1 border border-border text-text font-medium py-3 rounded-lg cursor-pointer transition hover:border-accent"
// // //               >
// // //                 ← Назад
// // //               </button>
// // //             )}
// // //             <button
// // //               type="button"
// // //               onClick={handleNext}
// // //               disabled={isLoading}
// // //               className={`${
// // //                 currentStep > 0 ? "flex-1" : "w-full"
// // //               } bg-accent text-white font-bold py-3 rounded-lg cursor-pointer transition hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-2`}
// // //             >
// // //               {isLoading ? (
// // //                 <>
// // //                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// // //                   Отправка...
// // //                 </>
// // //               ) : currentStep === questions.length - 1 ? (
// // //                 "📤 Отправить оценку"
// // //               ) : (
// // //                 "Далее →"
// // //               )}
// // //             </button>
// // //           </div>
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
