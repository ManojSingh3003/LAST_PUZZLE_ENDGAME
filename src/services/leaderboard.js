import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp 
} from "firebase/firestore";

const LEADERBOARD_COLLECTION = "scores";


export const saveScore = async (username, mode, steps, time) => {
  try {
    await addDoc(collection(db, LEADERBOARD_COLLECTION), {
      username: username || "Anonymous", 
      mode: mode,
      uniqueSteps: steps,
      timeElapsed: parseFloat(time), 
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error saving score:", error);
    return false;
  }
};

export const getLeaderboard = async (mode) => {
  try {
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      where("mode", "==", mode),
      orderBy("uniqueSteps", "asc"), 
      orderBy("timeElapsed", "asc"), 
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const scores = [];
    
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() });
    });

    return scores;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};