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
  checkFullName: (fullName: string | undefined): string => {
    if (!fullName) {
      return i88n.auth.requiredFullName;
    }

    return "";
  },
  checkPhoneNumber: (phoneNumber: string | undefined): string => {
    if (!phoneNumber) {
      return i88n.auth.requiredPhoneNumber;
    }

    return "";
  },
  checkMemberId: (memberId: string | undefined): string => {
    if (!memberId) {
      return i88n.auth.requiredMemberId;
    }

    return "";
  },
  checkDateOfBirth: (dateOfBirth: string | undefined): string => {
    if (!dateOfBirth) {
      return i88n.auth.requiredDateOfBirth;
    }

    return "";
  },
  checkRole: (role: string | undefined): string => {
    if (!role) {
      return i88n.auth.requiredRole;
    }

    return "";
  },
};
