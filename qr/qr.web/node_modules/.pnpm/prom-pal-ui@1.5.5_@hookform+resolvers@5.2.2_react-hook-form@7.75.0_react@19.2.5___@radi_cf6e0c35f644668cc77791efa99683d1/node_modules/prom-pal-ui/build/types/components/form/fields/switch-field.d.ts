import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { PromFieldProps } from "./types";
interface PromSwitchFieldProps extends React.ComponentProps<typeof SwitchPrimitive.Root>, PromFieldProps {
    name: string;
}
declare const PromSwitchField: React.FC<PromSwitchFieldProps>;
export { PromSwitchField };
