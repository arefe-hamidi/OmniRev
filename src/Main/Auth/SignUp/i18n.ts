import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  username: "Username",
  email: "Email",
  firstName: "First Name",
  lastName: "Last Name",
  password: "Password",
  confirmPassword: "Confirm Password",
  submit: "Sign Up",
  loading: "Signing up...",
  success: "Account created successfully!",
  error: "An error occurred. Please try again.",
  passwordsMismatch: "Passwords do not match",
} satisfies iDictionaryBaseStructure;

const fr = {
  username: "Nom d'utilisateur",
  email: "E-mail",
  firstName: "Prénom",
  lastName: "Nom de famille",
  password: "Mot de passe",
  confirmPassword: "Confirmer le mot de passe",
  submit: "S'inscrire",
  loading: "Inscription en cours...",
  success: "Compte créé avec succès !",
  error: "Une erreur s'est produite. Veuillez réessayer.",
  passwordsMismatch: "Les mots de passe ne correspondent pas",
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator({ en, fr });
