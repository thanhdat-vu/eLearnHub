import { db } from "@/libs/firebase.lib";
import { User } from "@/stores/UserStore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const userService = {
  getUser: async (userId: string) => {
    const userDoc = doc(db, "users", userId);
    const user = await getDoc(userDoc);
    return user.data() as User;
  },

  getUserByIds: async (userIds: string[]) => {
    try {
      const q = query(collection(db, "users"), where("id", "in", userIds));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.log(error);
    }
  },

  getUserByRole: async (role: string) => {
    try {
      const q = query(collection(db, "users"), where("role", "==", role));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.log(error);
    }
  },
};
