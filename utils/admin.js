import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(
                JSON.parse(process.env.SERVICE_ACCOUNT_KEY)
            ),
        });
    } catch (error) {
        console.log("Firebase admin initialization error", error.stack);
    }
}
export default admin;
