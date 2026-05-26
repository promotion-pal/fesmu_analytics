import { cn } from "@/shared/lib/utils";
import { ReactNode } from "react";

interface WrapperStudentProps {
  title: string;
  description?: string;
  children: React.ReactNode;

  action?: ReactNode;

  styleChildren?: string;
}

const WrapperStudent = ({
  title,
  children,
  description,
  action,
  styleChildren,
}: WrapperStudentProps) => {
  return (
    <section className="px-6 py-4 relative">
      <div className="flex flex-col gap-2">
        <h2 className="h1">{title}</h2>

        {description && (
          <p className="text-sm text-muted-foreground">
            Здесь отображаются все созданные вами запросы в технические службы.
          </p>
        )}
      </div>

      <div className={cn(styleChildren, "mt-7")}>{children}</div>

      {action && <div className="absolute top-4 right-4">{action}</div>}
    </section>
  );
};

export { WrapperStudent };
