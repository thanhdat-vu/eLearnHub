import { types } from "mobx-state-tree";
import { User } from "./UserStore";

export const AuthStore = types
  .model({
    authToken: types.string,
    currentUser: types.maybe(types.frozen<User>()),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken;
    },
    get getUser() {
      return store.currentUser;
    },
  }))
  .actions((store) => ({
    setAuthToken(token: string) {
      store.authToken = token;
    },
    setCurrentUser(user: User) {
      store.currentUser = user;
    },
    signOut() {
      store.authToken = "";
      store.currentUser = undefined;
    },
  }));
