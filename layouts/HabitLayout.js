import AuthCheck from "@components/AuthCheck";

export default function HabitLayout({ children }) {
    return (
        <main>
            <AuthCheck>{children}</AuthCheck>
        </main>
    );
}
