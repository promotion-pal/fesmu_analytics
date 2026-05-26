import { ROUTE } from "@/shared/config/path";
import { StudentApplicationContent } from "@/widgets/student/application/student.application.ui";
import { WrapperStudent } from "@/widgets/student/ui/wrapper.ui";
import { PlusIcon } from "lucide-react";

export function StudentApplicationPage() {
  return (
    <WrapperStudent
      title="История заявок"
      description="  Здесь отображаются все созданные вами запросы в технические службы."
      action={
        <a
          href={ROUTE.STUDENT.APPLICATION.CREATE}
          className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <PlusIcon className="size-4" />
        </a>
      }
    >
      <StudentApplicationContent />
    </WrapperStudent>
  );
}
