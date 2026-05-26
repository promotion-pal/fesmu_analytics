interface BasePageProps {
  id?: string | number;
}

const DYNAMIC_PATH = (
  segments: (string | undefined | number)[],
  props?: BasePageProps,
): string => {
  const filteredSegments = segments.filter(
    (s): s is string => s !== undefined && s !== "",
  );

  return `/${filteredSegments.join("/")}`;
};

const ROUTE = {
  LK: {
    USER: DYNAMIC_PATH(["lk", "user"]),
  },
  STUDENT: {
    APPLICATION: {
      LIST: DYNAMIC_PATH(["student", "applications"]),
      CREATE: DYNAMIC_PATH(["student", "application", "create"]),
    },
  },
  AUTH: {
    LOGIN: DYNAMIC_PATH(["auth"]),
    REGISTER: DYNAMIC_PATH(["auth", "register"]),
  },
};

export { DYNAMIC_PATH, ROUTE };
