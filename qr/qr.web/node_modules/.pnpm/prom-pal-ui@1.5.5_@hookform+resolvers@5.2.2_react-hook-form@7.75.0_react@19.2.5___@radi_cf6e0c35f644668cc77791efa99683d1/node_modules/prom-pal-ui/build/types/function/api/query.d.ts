declare const usePromPromiseQuery: <T>(fetchFn?: () => Promise<T>) => {
    data: T;
    error: string;
    execute: (fn?: () => Promise<T>) => Promise<void>;
    loading: boolean;
    onRefetch: () => Promise<void>;
};
export { usePromPromiseQuery };
