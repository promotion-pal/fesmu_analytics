import * as React from "react";
import { PromDictionariesType } from "../../types";
interface PromSwitchListFieldProps {
    name: string;
    label?: string;
    isLoad?: boolean;
    errorMsg?: string;
    className?: string;
    disabled?: boolean;
    errorDisplay?: boolean;
    options: PromDictionariesType[];
    error?: (msg: string) => React.ReactNode;
}
declare const PromSwitchListField: React.FC<PromSwitchListFieldProps>;
export { PromSwitchListField };
