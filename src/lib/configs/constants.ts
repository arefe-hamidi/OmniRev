export const IS_STAGING = process.env.IS_STAGING === "true";

const MOCK_API_BASE_URL = "https://api-mock.omnirev.ai";

export const API_BASE_URL =
  process.env.API_BASE_URL || MOCK_API_BASE_URL;

export const API_SUB_KEY = process.env.API_SUB_KEY || "";

export const NEXT_PUBLIC_API_SUB_KEY = process.env.NEXT_PUBLIC_API_SUB_KEY || "";

export const NEXT_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL;

export const NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  MOCK_API_BASE_URL;

export const IS_SERVER = typeof window === "undefined";
export const IS_CLIENT = typeof window !== "undefined";
