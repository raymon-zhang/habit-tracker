import Head from "next/head";
import Image from "next/image";

import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-identicon-sprites";

export default function Home() {
    const pfp = createAvatar(style, {
        seed: "raymonzhang",
        colorLevel: 400,
    });

    return (
        <div className="flex justify-center items-center h-80">
            <div className="bg-white shadow-2xl p-6 rounded-lg">
                <h1 className="text-3xl font-bold underline">Hello world!</h1>
                <button className="bg-blue-600">Hello</button>
                <img
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(pfp)}`}
                    className="rounded-full"
                />
            </div>
        </div>
    );
}
