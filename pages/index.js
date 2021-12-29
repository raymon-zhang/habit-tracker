import AuthCheck from "@components/AuthCheck";
import Redirect from "@components/Redirect";

export default function Home() {
    return (
        <main>
            <AuthCheck>
                <Redirect to="/habits" />
            </AuthCheck>
        </main>
    );
}
