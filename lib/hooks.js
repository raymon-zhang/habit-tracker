import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { useRouter } from "next/router";

import { doc, onSnapshot } from "firebase/firestore";

import { auth, firestore } from "./firebase";

export function useUserData() {
    const [user, loading] = useAuthState(auth);
    const [username, setUsername] = useState(undefined);
    const [userDoc, setUserDoc] = useState(undefined);

    useEffect(() => {
        if (loading) {
            return;
        }

        let unsubscribe;

        if (user) {
            const docRef = doc(firestore, "users", user.uid);
            unsubscribe = onSnapshot(docRef, (doc) => {
                const data = doc.data();
                if (data) {
                    setUserDoc(data);
                    setUsername(data?.username);
                } else {
                    setUserDoc(null);
                    setUsername(null);
                }
            });
        }

        return unsubscribe;
    }, [user, loading]);

    return { user, username, userDoc, loading };
}

export function useAuthRedirect({
    username,
    loading,
    redirectTo = false,
    redirectIfFound = false,
} = {}) {
    const router = useRouter();

    useEffect(() => {
        if (!redirectTo || !username || loading) {
            return;
        }

        if (
            (redirectTo && !redirectIfFound && !username) ||
            (redirectIfFound && username)
        ) {
            router.push(redirectTo);
        }
    }, [username, redirectTo, loading, router, redirectIfFound]);
}
