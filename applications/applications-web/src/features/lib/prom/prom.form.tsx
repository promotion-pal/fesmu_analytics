import { Label } from "@/shared/ui/label";
import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import z from "zod";

export interface PromFormFields extends InputHTMLAttributes<HTMLInputElement> {}

export interface PromFieldsConfig<S extends z.ZodSchema> {
  schema: S;
  defaultValues: z.infer<S>;
}

interface UseFormFieldProps<T extends FieldValues> {
  name: Path<T>;
}
export const useFormField = <T extends FieldValues>({
  name,
}: UseFormFieldProps<T>) => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useFormContext<T>();

  const error = errors[name]?.message as string;
  const value = watch(name);

  return {
    name,
    register: register(name),
    error,
    value,
    setValue: (val: any) => setValue(name, val),
    getValue: () => getValues(name),
  };
};

interface PromFieldInputProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "password";
  className?: string;
}
export const PromFieldInput = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  className = "border rounded-lg p-2 w-full",
}: PromFieldInputProps<T>) => {
  const { register, error } = useFormField<T>({ name });

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="font-medium">
          {label}
        </label>
      )}

      <input
        id={name}
        type={type}
        {...register}
        placeholder={placeholder}
        className={className}
      />

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

interface PromFieldTextareaProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}
export const PromFieldTextarea = <T extends FieldValues>({
  name,
  label,
  placeholder,
  rows = 3,
  className = "border rounded-lg p-2 w-full resize-y",
}: PromFieldTextareaProps<T>) => {
  const { register, error } = useFormField<T>({ name });

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="font-medium">
          {label}
        </label>
      )}

      <textarea
        id={name}
        rows={rows}
        {...register}
        placeholder={placeholder}
        className={className}
      />

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

interface PromFieldSwitchProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  className?: string;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}
export const PromFieldSwitch = <T extends FieldValues>({
  name,
  label,
  className = "",
  disabled = false,
  onCheckedChange,
}: PromFieldSwitchProps<T>) => {
  const { setValue, getValue, error, value } = useFormField<T>({ name });

  const handleCheckedChange = (checked: boolean) => {
    setValue(checked);
    if (onCheckedChange) {
      onCheckedChange(checked);
    }
  };

  const currentValue = value ?? false;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        id={name}
        role="switch"
        aria-checked={currentValue}
        disabled={disabled}
        onClick={() => handleCheckedChange(!currentValue)}
        className={`
          relative inline-flex h-5 w-9 items-center rounded-full transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
          ${currentValue ? "bg-primary" : "bg-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `}
      >
        <span
          className={`
            inline-block h-3 w-3 transform rounded-full bg-white transition-transform
             ${currentValue ? "translate-x-5" : "translate-x-1"}
          `}
        />
      </button>

      {label && (
        <Label htmlFor={name} className="font-medium cursor-pointer">
          {label}
        </Label>
      )}

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

interface PromFieldFileProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  accept?: string;
  preview?: boolean;
  maxFileSize?: number;
  disabled?: boolean;
  className?: string;
}
export const PromFieldFile = <T extends FieldValues>({
  name,
  label,
  placeholder = "Выберите файл",
  accept = ".jpg,.jpeg,.png,.webp",
  maxFileSize = 10 * 1024 * 1024,
  preview = true,
  disabled = false,
  className = "",
}: PromFieldFileProps<T>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { setValue, error, value } = useFormField<T>({ name });
  const currentValue = value;

  useEffect(() => {
    if (currentValue) {
      if (typeof currentValue === "string") {
        setPreviewUrl(currentValue);
      } else if (
        currentValue &&
        typeof currentValue === "object" &&
        "name" in currentValue
      ) {
        const url = URL.createObjectURL(currentValue as File);
        setPreviewUrl(url);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [currentValue]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (file.size > maxFileSize) {
      alert(
        `Файл превышает максимальный размер ${maxFileSize / 1024 / 1024}MB`,
      );
      return;
    }

    setValue(file as any);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    setValue(null as any);
    setPreviewUrl(null);
  };

  const handleReplaceFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col gap-1 mt-5 ${className}`}>
      {label && <label className="font-medium text-sm">{label}</label>}

      <div>
        {preview && previewUrl && (
          <div className="mb-3 relative group">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-[120px] object-cover rounded-lg border"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 rounded-lg flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleReplaceFile}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
              >
                <svg
                  className="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {!previewUrl && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex flex-col items-center">
              <svg
                className="w-6 h-6 mb-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>{placeholder}</span>
              <span className="text-xs text-gray-500 mt-1">
                Макс. размер: {maxFileSize / 1024 / 1024}MB
              </span>
            </div>
          </button>
        )}
      </div>

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

interface PromSelectOption {
  value: string | number;
  label: string;
}

interface PromFieldSelectProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  options: PromSelectOption[];
  placeholder?: string;
  className?: string;
}

export const PromFieldSelect = <T extends FieldValues>({
  name,
  label,
  options,
  placeholder = "Выберите значение...",
  className = "border rounded-lg p-2 w-full bg-background",
}: PromFieldSelectProps<T>) => {
  const { register, error } = useFormField<T>({ name });

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="font-medium">
          {label}
        </label>
      )}

      <select id={name} {...register} className={className} defaultValue="">
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

// ---- Common ----

import { cn } from "@/shared/lib/utils";
import { Loader2Icon } from "lucide-react";
import { FC } from "react";

interface CommonLoaderProps {
  type: "page" | "modal";
  className?: string;
  text?: string;
}
export const CommonLoader: FC<CommonLoaderProps> = ({
  type,
  className,
  text = "Загрузка данных...",
}) => {
  if (type === "page") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center min-h-[50vh] w-full gap-3 animate-fade-in",
          className,
        )}
      >
        <Loader2Icon className="h-10 w-full max-w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">{text}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg animate-fade-in",
        className,
      )}
    >
      <Loader2Icon className="h-8 w-full max-w-8 animate-spin text-primary" />
      {text && (
        <p className="text-xs text-muted-foreground font-medium mt-2">{text}</p>
      )}
    </div>
  );
};
