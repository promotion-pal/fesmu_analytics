import React, { FC } from "react";
import { PromComponentProps, PromStyle } from "../../types";
interface PromTextareaProps extends PromStyle, PromComponentProps, Omit<React.ComponentProps<"textarea">, "name"> {
    name: string;
    label?: string;
}
declare const PromTextarea: FC<PromTextareaProps>;
export { PromTextarea };
