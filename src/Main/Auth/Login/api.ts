import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch";
import { apiRoute } from "@/lib/routes/utils";
import type { iLoginRequest, iLoginResponse } from "./type";

export async function login(data: iLoginRequest): Promise<iLoginResponse> {
  const endpoint = apiRoute("AUTH", "/login");
  const body = {
    username: data.username_or_email,
    password: data.password,
  };
  const response = await proxyFetch(endpoint, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw response;
  }

  const raw = await response.json();
  const access =
    raw.token ??
    raw.tokens?.access ??
    raw.access ??
    raw.access_token;
  const user = raw.user ?? raw.user_data ?? { username: raw.username ?? "" };

  if (!access) {
    throw new Error("Login response missing access token");
  }

  return {
    access,
    refresh: raw.tokens?.refresh ?? raw.refresh ?? raw.refresh_token,
    user: typeof user === "object" && user !== null ? user : { username: "" },
  } as iLoginResponse;
}
