import { db } from "@/libs/firebase.lib";
import { Class } from "@/models/Class";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

export const classService = {
  createClass: async (classData: Class) => {
    try {
      await addDoc(collection(db, "classes"), classData);
    } catch (error) {
      console.log(error);
    }
  },
  getAllClasses: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "classes"));
      const classes: Class[] = [];
      querySnapshot.forEach((doc) => {
        classes.push({ ...(doc.data() as Class), id: doc.id });
      });
      return classes;
    } catch (error) {
      console.log(error);
    }
  },
  getClassByUserId: async (userId: string) => {
    try {
      const q = query(
        collection(db, "classes"),
        where("learnerIds", "array-contains", userId)
      );
      const querySnapshot = await getDocs(q);
      const classes: Class[] = [];
      querySnapshot.forEach((doc) => {
        classes.push({ ...(doc.data() as Class), id: doc.id });
      });
      return classes;
    } catch (error) {
      console.log(error);
    }
  },
  getClassByRole: async (userId: string, role: string) => {
    try {
      const q = query(
        collection(db, "classes"),
        where(`${role}Ids`, "array-contains", userId)
      );
      const querySnapshot = await getDocs(q);
      const classes: Class[] = [];
      querySnapshot.forEach((doc) => {
        classes.push({ ...(doc.data() as Class), id: doc.id });
      });
      return classes;
    } catch (error) {
      console.log(error);
    }
  },
};
