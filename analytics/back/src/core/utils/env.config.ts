export const isDev =
  process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';
export const isTest = process.env.NODE_ENV === 'test';
export const isProd = process.env.NODE_ENV === 'production';

export const ENV = {
  IS_DEV: isDev,
  IS_PROD: isProd,
  IS_TEST: isTest,
  NODE_ENV: process.env.NODE_ENV,
};
