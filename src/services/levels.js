import { db } from "../firebase";
import { 
  collection, addDoc, getDocs, query, orderBy, serverTimestamp 
} from "firebase/firestore";

const LEVELS_COLLECTION = "levels";

export const publishLevel = async (levelName, author, grid, kValue, parData) => {
  try {

    let noBreak = parData?.noBreak;
    let withBreak = parData?.withBreak;

    if (noBreak === undefined || noBreak === Infinity) noBreak = -1;
    if (withBreak === undefined || withBreak === Infinity) withBreak = -1;

    await addDoc(collection(db, LEVELS_COLLECTION), {
      name: levelName,
      author: author || "Anonymous",
      grid: grid,
      kValue: parseInt(kValue) || 0,
      parNoBreak: noBreak,      
      parWithBreak: withBreak,  
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error publishing level:", error);
    return false;
  }
};

export const getCommunityLevels = async () => {
  try {
    const q = query(collection(db, LEVELS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      
      return { 
        id: doc.id, 
        ...data,
        parNoBreak: data.parNoBreak === -1 ? Infinity : data.parNoBreak,
        parWithBreak: data.parWithBreak === -1 ? Infinity : data.parWithBreak
      };
    });
  } catch (error) {
    console.error("Error fetching levels:", error);
    return [];
  }
};