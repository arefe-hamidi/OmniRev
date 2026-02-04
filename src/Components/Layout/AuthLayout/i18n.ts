import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  logo: "OminRev",
  login: {
    title: "Login",
    description: "Enter your credentials to access your account",
    email: "Email",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    submit: "Login",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
  },
  signUp: {
    title: "Sign Up",
    description: "Create a new account to get started",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    submit: "Sign Up",
    haveAccount: "Already have an account?",
    login: "Login",
  },
} satisfies iDictionaryBaseStructure;

const fr = {
  logo: "OminRev",
  login: {
    title: "Connexion",
    description: "Entrez vos identifiants pour accéder à votre compte",
    email: "E-mail",
    password: "Mot de passe",
    rememberMe: "Se souvenir de moi",
    forgotPassword: "Mot de passe oublié ?",
    submit: "Connexion",
    noAccount: "Pas encore de compte ?",
    signUp: "S'inscrire",
  },
  signUp: {
    title: "Inscription",
    description: "Créez un nouveau compte pour commencer",
    email: "E-mail",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    submit: "S'inscrire",
    haveAccount: "Déjà un compte ?",
    login: "Connexion",
  },
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary: (locale: string) => iDictionary =
  getDictionaryGenerator({ en, fr });
