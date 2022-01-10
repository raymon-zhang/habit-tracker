import admin from "../../utils/admin";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).send({ message: "Only POST requests allowed!" });
        return;
    }

    try {
        const db = admin.firestore();

        const body = req.body;

        if (!validateBody(body)) {
            res.status(400).end();
        }

        const idToken = req.headers["authorization"]?.split(" ")[1];
        if (!idToken) {
            res.status(401).send({ message: "Need Authorization header!" });
            return;
        }

        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (e) {
            console.log(e);
            res.status(401).end();
            return;
        }

        const doc = await db.collection("users").doc(decodedToken.uid).get();
        if (!doc.exists) {
            res.status(403).end();
            return;
        }

        if ((await doc.ref.collection("habits").get()).size >= 25) {
            res.status(403).send({ message: "Cannot exceed 25 habits!" });
        }

        await doc.ref.collection("habits").add({
            name: body.name,
            xiguanName: body.xiguanName,
            type: body.type,
            special: Math.random() < 0.001,
        });

        res.status(201).end();
    } catch (e) {
        console.log(e);
        res.status(500).end();
    }
}

const validateBody = (body) => {
    if (typeof body.name !== "string") {
        return false;
    }
    if (body.name.length < 1) {
        return false;
    }
    if (body.name.length > 75) {
        return false;
    }

    if (typeof body.xiguanName !== "string") {
        return false;
    }
    if (body.name.xiguanName < 1) {
        return false;
    }
    if (body.name.xiguanName > 30) {
        return false;
    }

    if (typeof body.type !== "number") {
        return false;
    }
    if (body.type < 1) {
        return false;
    }
    if (body.type > 4) {
        return false;
    }

    return true;
};
