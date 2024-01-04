import { Instance, SnapshotOut, types } from "mobx-state-tree";

export const UserStore = types
  .model({
    id: types.optional(types.string, ""),
    email: types.string,
    password: types.string,
    fullName: types.maybe(types.string),
    memberId: types.optional(types.string, ""),
    role: types.optional(types.string, ""),
    dateOfBirth: types.optional(types.string, ""),
    phoneNumber: types.optional(types.string, ""),
  })
  .views((store) => ({}))
  .actions((store) => ({}));

export interface User extends Instance<typeof UserStore> {}
