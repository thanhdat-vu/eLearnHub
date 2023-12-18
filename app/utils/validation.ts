import { i88n } from "@/i18n";

const isValidEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validation = {
  checkEmail: (email: string): string => {
    if (!email) {
      return i88n.auth.requiredEmail;
    }

    if (!isValidEmail(email)) {
      return i88n.auth.invalidEmail;
    }

    return "";
  },
  checkPassword: (password: string): string => {
    if (!password) {
      return i88n.auth.requiredPassword;
    }

    return "";
  },
  checkRepeatPassword: (password: string, repeatPassword: string): string => {
    if (!repeatPassword) {
      return i88n.auth.requiredRepeatPassword;
    }

    if (password !== repeatPassword) {
      return i88n.auth.invalidRepeatPassword;
    }

    return "";
  },
};
