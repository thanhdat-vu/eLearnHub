import { Instance, types } from "mobx-state-tree";
import { User, UserStore } from "./UserStore";

export const AuthStore = types
  .model({
    authToken: types.string,
    user: types.maybe(UserStore),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken;
    },
    get getUser() {
      return store.user;
    },
    get getUserId() {
      return store.user?.id;
    },
    get getUserRole() {
      return store.user?.role;
    },
  }))
  .actions((store) => ({
    setAuthToken(token: string) {
      store.authToken = token;
    },
    setUser(user: User) {
      store.user = user;
    },
    signOut() {
      store.authToken = "";
      store.user = undefined;
    },
  }));

export interface AuthStore extends Instance<typeof AuthStore> {}
