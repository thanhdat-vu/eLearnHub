import { db } from "@/libs/firebase.lib";
import { Assignment } from "@/models/Assignment";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

export const assignmentService = {
  addAssignment: async (assignment: Assignment) => {
    try {
      await addDoc(collection(db, "assignments"), assignment);
    } catch (error) {
      console.log(error);
    }
  },
  getAssignmentByClassId: async (classId: string) => {
    try {
      const q = query(
        collection(db, "assignments"),
        where("classIds", "array-contains", classId)
      );
      const querySnapshot = await getDocs(q);
      const assignments: Assignment[] = [];
      querySnapshot.forEach((doc) => {
        assignments.push({ ...(doc.data() as Assignment), id: doc.id });
      });
      return assignments;
    } catch (error) {
      console.log(error);
    }
  },
};
