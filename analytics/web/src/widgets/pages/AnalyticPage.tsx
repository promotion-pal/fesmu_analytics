import { useState } from "react";
import { ToiletIcon } from "lucide-react";
import { DefaultApi } from "../../features/lib";
import { useSearchParams } from "react-router-dom";
import { apiConfig } from "../../config/api";

export function AnalyticPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [comment, setComment] = useState<string>("");
  const [hasSoap, setHasSoap] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [smellRating, setSmellRating] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [purityRating, setPurityRating] = useState<number>(3);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [hasToiletPaper, setHasToiletPaper] = useState<boolean>(true);

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

  const questions: Question[] = [
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
      title: "🧼 Наличие мыло",
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

    if (!id) {
      setError("ID туалета не указан");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.toiletsControllerAddRating({
        id: parseInt(id),
        toiletCreateRatingDto: {
          hasSoap,
          comment,
          smellRating,
          purityRating,
          hasToiletPaper,
        },
      });

      console.log("Успешно отправлено:", res);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      setError("Не удалось отправить оценку. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[currentStep];

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
          <div className="space-y-3">
            <div className="bg-accent-bg rounded-lg p-4 text-left text-sm space-y-2">
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
              {comment && (
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
          <ToiletIcon size={50} className="mx-auto" />
          <h2>Оценка состояния туалета</h2>
          <p className="text-text text-sm">Туалет №{id}</p>
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
            <p className="text-xs text-text">QR код: туалет №{id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
