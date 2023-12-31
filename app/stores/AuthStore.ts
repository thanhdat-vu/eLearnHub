import { types } from "mobx-state-tree";
import { User } from "./UserStore";

export const AuthStore = types
  .model({
    authToken: types.string,
    userId: types.maybe(types.string),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken;
    },
    get getUserId() {
      return store.userId;
    },
  }))
  .actions((store) => ({
    setAuthToken(token: string) {
      store.authToken = token;
    },
    setUserId(userId: string) {
      store.userId = userId;
    },
    signOut() {
      store.authToken = "";
      store.userId = undefined;
    },
  }));
