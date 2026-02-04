import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  identifier: "Email or Username",
  password: "Password",
  rememberMe: "Remember me",
  forgotPassword: "Forgot password?",
  submit: "Login",
  loading: "Logging in...",
  error: "Invalid email/username or password.",
  success: "Logged in successfully",
} satisfies iDictionaryBaseStructure;

const fr = {
  identifier: "E-mail ou nom d'utilisateur",
  password: "Mot de passe",
  rememberMe: "Se souvenir de moi",
  forgotPassword: "Mot de passe oublié ?",
  submit: "Connexion",
  loading: "Connexion en cours...",
  error: "E-mail/nom d'utilisateur ou mot de passe incorrect.",
  success: "Connexion réussie",
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator({ en, fr });
