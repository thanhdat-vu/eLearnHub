import { types } from "mobx-state-tree";
import { AuthStore } from "./AuthStore";
import { createContext, useContext } from "react";

export const RootStore = types.model({
  authStore: types.optional(AuthStore, {
    authToken: "",
    currentUser: undefined,
  }),
});

const _rootStore = RootStore.create({});

const rootStoreContext = createContext<typeof _rootStore>(_rootStore);

export const useStores = () => useContext(rootStoreContext);
