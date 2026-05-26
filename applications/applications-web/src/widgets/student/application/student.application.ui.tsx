import {
  ApplicationsApi,
  ModelsApplicationCategory,
  ModelsApplicationEntity,
  type ServiceApplicationCreateDto,
} from "@/features/lib/application";
import z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PromFieldInput,
  PromFieldSelect,
  PromFieldTextarea,
} from "@/features/lib/prom/prom.form";
import { apiConfig } from "@/shared/config/api";
import { useEffect, useState } from "react";

const applicationSchema = z.object({
  name: z.string().min(3, "Название должно быть не менее 3 символов"),
  description: z.string().min(5, "Пожалуйста, опишите проблему подробнее"),
  category: z.nativeEnum(ModelsApplicationCategory, {
    error: "Пожалуйста, выберите службу из списка",
  }),
}) satisfies z.ZodType<Omit<ServiceApplicationCreateDto, "userId">>;

export type ApplicationSchema = z.infer<typeof applicationSchema>;

const categoryOptions = [
  { value: ModelsApplicationCategory.CategoryPlumber, label: "Сантехник" },
  { value: ModelsApplicationCategory.CategoryCarpenter, label: "Плотник" },
  { value: ModelsApplicationCategory.CategoryElectrician, label: "Электрик" },
];

const StudentApplicationForm = () => {
  const api = new ApplicationsApi(apiConfig());

  type FormData = ApplicationSchema;
  const FieldInput = PromFieldInput<FormData>;
  const FieldTextarea = PromFieldTextarea<FormData>;
  const FieldSelect = PromFieldSelect<FormData>;

  const form = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "Течет кран в раковине",
      description:
        "В комнате буду в 17.00, кран начал течь после вчерашнего дождя. Прошу помочь с ремонтом.",
      category: ModelsApplicationCategory.CategoryCarpenter,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await api.applicationsPost({
        application: values,
      });
      alert("Заявка успешно создана!");
      form.reset();
    } catch (error) {
      console.error("Ошибка при отправке заявки:", error);
      alert("Не удалось отправить заявку");
    }
  });

  return (
    <section className="p-4 bg-card rounded-xl border border-border shadow-sm">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldInput
            name="name"
            label="Название заявки"
            placeholder="Например: Течет кран в раковине"
          />

          <FieldTextarea
            name="description"
            label="Подробное описание"
            placeholder="Укажите номер комнаты общежития и детали поломки..."
            rows={4}
          />

          <FieldSelect
            name="category"
            label="Категория проблемы"
            placeholder="Выберите необходимую службу"
            options={categoryOptions}
          />

          <button
            type="submit"
            className="ml-auto w-fit bg-primary text-primary-foreground py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
          >
            Создать заявку
          </button>
        </form>
      </FormProvider>
    </section>
  );
};
export { StudentApplicationForm };

const statusMap = {
  pending: {
    label: "В ожидании",
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  approved: {
    label: "Принята",
    className:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Отклонена",
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  },
};

const categoryMap = {
  plumber: "Сантехник",
  electrician: "Электрик",
  carpenter: "Плотник / Столяр",
};

const StudentApplicationContent = () => {
  const api = new ApplicationsApi(apiConfig());

  const [applications, setApplications] = useState<ModelsApplicationEntity[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.applicationsGet();
      setApplications(response);
      console.log("Полученные данные:", response);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Загрузка заявок...
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {applications.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground">
          У вас пока нет ни одной созданной заявки.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {applications.map((app) => {
            const statusInfo = statusMap[
              app.status as keyof typeof statusMap
            ] || { label: app.status, className: "bg-gray-100" };
            const categoryLabel =
              categoryMap[app.category as keyof typeof categoryMap] ||
              app.category;
            const formattedDate = app.createdAt
              ? new Date(app.createdAt).toLocaleDateString("ru-RU")
              : "—";

            return (
              <div
                key={app.id}
                className="p-4 bg-card rounded-xl border border-border shadow-sm flex flex-col justify-between gap-4 hover:border-accent-border transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-base text-foreground leading-snug">
                      {app.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full border ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {app.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium px-2 py-0.5 bg-muted rounded text-foreground">
                      {categoryLabel}
                    </span>
                  </div>
                  <span>{formattedDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export { StudentApplicationContent };
