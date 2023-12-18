import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthErrorCodes,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/libs/firebase.lib";
import { FirebaseError } from "firebase/app";
import { i88n } from "@/i18n";

export interface CustomError {
  errorMessage: string;
  errorType: string;
}

export const authService = {
  errorTypes: {
    EMAIL: "email",
    PASSWORD: "password",
    DEFAULT: "default",
  },

  getFirebaseErrorMessages: (errorCode: string): CustomError => {
    console.log(errorCode);
    switch (errorCode) {
      // Sign in
      case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
        return {
          errorMessage: i88n.auth.invalidLoginCredentials,
          errorType: authService.errorTypes.DEFAULT,
        };
      case AuthErrorCodes.USER_DELETED:
        return {
          errorMessage: i88n.auth.userNotFound,
          errorType: authService.errorTypes.EMAIL,
        };
      case AuthErrorCodes.INVALID_EMAIL:
        return {
          errorMessage: i88n.auth.invalidEmail,
          errorType: authService.errorTypes.EMAIL,
        };
      case AuthErrorCodes.INVALID_PASSWORD:
        return {
          errorMessage: i88n.auth.wrongPassword,
          errorType: authService.errorTypes.PASSWORD,
        };
      // Sign up
      case AuthErrorCodes.EMAIL_EXISTS:
        return {
          errorMessage: i88n.auth.emailExists,
          errorType: authService.errorTypes.EMAIL,
        };
      case AuthErrorCodes.WEAK_PASSWORD:
        return {
          errorMessage: i88n.auth.weakPassword,
          errorType: authService.errorTypes.PASSWORD,
        };
      default:
        return {
          errorMessage: i88n.auth.unknownError,
          errorType: authService.errorTypes.DEFAULT,
        };
    }
  },

  async signIn(authStore: any, email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const authToken = await user.getIdToken();
      authStore.setAuthToken(authToken);
    } catch (error) {
      const errorCode = (error as FirebaseError).code;
      const customError = authService.getFirebaseErrorMessages(errorCode);
      throw customError;
    }
  },

  async signUp(authStore: any, email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const authToken = await user.getIdToken();
      authStore.setAuthToken(authToken);
    } catch (error) {
      const errorCode = (error as FirebaseError).code;
      const customError = authService.getFirebaseErrorMessages(errorCode);
      throw customError;
    }
  },

  async signOut(authStore: any) {
    await auth.signOut();
    authStore.setAuthToken("");
  },

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const errorCode = (error as FirebaseError).code;
      const customError = authService.getFirebaseErrorMessages(errorCode);
      throw customError;
    }
  },
};
