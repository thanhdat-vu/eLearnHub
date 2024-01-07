import { db } from "@/libs/firebase.lib";
import { ResourceItem } from "@/models/ResourceItem";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

export const resourceService = {
  addResourceItem: async (resourceItem: ResourceItem) => {
    try {
      await addDoc(collection(db, "resources"), resourceItem);
    } catch (error) {
      console.log(error);
    }
  },
  getResourceByClassId: async (classId: string) => {
    try {
      const q = query(
        collection(db, "resources"),
        where("classIds", "array-contains", classId)
      );
      const querySnapshot = await getDocs(q);
      const resources: ResourceItem[] = [];
      querySnapshot.forEach((doc) => {
        resources.push({ ...(doc.data() as ResourceItem), id: doc.id });
      });
      return resources;
    } catch (error) {
      console.log(error);
    }
  },
};
