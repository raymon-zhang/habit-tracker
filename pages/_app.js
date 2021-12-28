import Head from "next/head";

import Navbar from "@components/navbar";
import { UserContext } from "@lib/context";
import { useUserData } from "@lib/hooks";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const userData = useUserData();

    return (
        <UserContext.Provider value={userData}>
            <Head></Head>
            <Navbar />
            <Component {...pageProps} />
        </UserContext.Provider>
    );
}

export default MyApp;
