import db from "../../../utils/admin";

export default async function handler(req, res) {
    const { username } = req.query;

    try {
        if (req.method === "GET") {
            const doc = await db.collection("usernames").doc(username).get();
            if (!doc.exists) {
                res.status(404).end();
            } else {
                res.status(200).json(doc.data());
            }
        }
        res.status(200).end();
    } catch (e) {
        res.status(400).end();
    }
}
