import { StudentApplicationForm } from "@/widgets/student/";
import { WrapperStudent } from "@/widgets/student/ui/wrapper.ui";

export function StudentApplicationCreatePage() {
  return (
    <WrapperStudent title="Создание заявки">
      <StudentApplicationForm />
    </WrapperStudent>
  );
}
