import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
    getFirestore,
    collection,
    query,
    where,
    limit,
    getDocs,
} from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyB948CDaQ_ISzen59LzAwtU-8YjK_Mntig",
    authDomain: "raymon-zhang-habit-tracker.firebaseapp.com",
    projectId: "raymon-zhang-habit-tracker",
    storageBucket: "raymon-zhang-habit-tracker.appspot.com",
    messagingSenderId: "511688388499",
    appId: "1:511688388499:web:f576701973bf3bc5a04266",
    measurementId: "G-ZNM30M5K1S",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" && getAnalytics(app);
export const firestore = getFirestore(app);

export const googleAuthProvider = new GoogleAuthProvider();

/**`
 * Signs out the user
 * @param {Object} router - The Next router object, if you want to reload. Example: useRouter()
 */
export const signOut = (router = null) => {
    auth.signOut();
    router && router.reload();
};

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("username", "==", username), limit(1));
    const userDoc = (await getDocs(q)).docs[0];
    return userDoc;
}
