import admin from "../../utils/admin";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).send({ message: "Only POST requests allowed!" });
        return;
    }

    try {
        const db = admin.firestore();

        const body = req.body;

        const idToken = req.headers["authorization"]?.split(" ")[1];
        if (!idToken) {
            res.status(401).send({ message: "Need Authorization header!" });
            return;
        }

        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (e) {
            res.status(401).end();
            return;
        }

        const doc = await db.collection("users").doc(decodedToken.uid).get();
        if (!doc.exists) {
            res.status(403).end();
            return;
        }
    } catch (e) {
        console.log(e);
        res.status(500).end();
    }
}
