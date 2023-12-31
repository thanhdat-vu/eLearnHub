import { db } from "@/libs/firebase.lib";
import { doc, getDoc } from "firebase/firestore";

export const userService = {
  getUser: async (userId: string) => {
    const userDoc = doc(db, "users", userId);
    const user = await getDoc(userDoc);
    return user.data();
  },
};
