import admin from "../../../utils/admin";

export default async function handler(req, res) {
    const db = admin.firestore();

    try {
        if (req.method === "GET") {
            const idToken = req.headers["authorization"].split(" ")[1];
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const doc = await db
                .collection("users")
                .doc(decodedToken.uid)
                .get();
            if (!doc.exists) {
                res.status(404).end();
            } else {
                res.status(200).json(doc.data());
            }
        }
        res.status(200).end();
    } catch (e) {
        console.log(e);
        res.status(400).end();
    }
}
