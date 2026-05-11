import { ReactNode } from "react";
export interface PromFieldProps {
    errorStyle?: "";
    errorMsg?: string;
    errorDisplay?: boolean;
    error?: (error: string) => ReactNode;
    label?: string;
    isLoad?: boolean;
    skeleton?: ReactNode;
}
