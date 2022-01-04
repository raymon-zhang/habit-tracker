import { useContext, useEffect, useState } from "react";
import Image from "next/image";

import { format } from "date-fns";

import HabitLayout from "@layouts/HabitLayout";
import { UserContext } from "@lib/context";

import Xiguan_1_0 from "@icons/xiguans/1/0.svg";
import Xiguan_2_0 from "@icons/xiguans/2/0.svg";
import Xiguan_3_0 from "@icons/xiguans/3/0.svg";

export default function Habits() {
    const [greeting, setGreeting] = useState("");
    const [timeOfDay, setTimeOfDay] = useState("");
    const { username, userDoc, user } = useContext(UserContext);

    useEffect(() => {
        user &&
            user.getIdToken(true).then((idToken) => {
                console.log(idToken);
            });
    }, [user]);

    const d = new Date();
    const formattedDate = format(d, "eeee, MMM do");

    useEffect(() => {
        const greetings = {
            morning: ["Have a good day!"],
            afternoon: ["What's up?", "It's a beautiful day outside!"],
            evening: ["How was your day?"],
            night: [
                "Sleep well!",
                "See you tomorrow!",
                "Don't stay up too late!",
            ],
        };

        const d = new Date();

        const tod =
            d.getHours() < 12
                ? "morning"
                : d.getHours() < 18
                ? "afternoon"
                : d.getHours() < 21
                ? "evening"
                : "night";

        setGreeting(
            Math.random() < 0.1
                ? greetings[tod][
                      Math.floor(Math.random() * greetings[tod].length)
                  ]
                : ""
        );

        console.log(greetings);

        setTimeOfDay(tod);
    }, []);

    return (
        <HabitLayout>
            {userDoc?.new ? (
                <HabitOnboarding />
            ) : (
                <div className="grid gap-6 grid-cols-5 p-10 sm:p-16">
                    <div className="col-span-3">
                        <div className="shadow-lg rounded-lg px-10 py-8 bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                            <h3 className="text-3xl mb-4">
                                Good {timeOfDay}, {username}.
                            </h3>
                            <h4 className="text-xl">
                                Today is {formattedDate}.
                            </h4>
                            {greeting && (
                                <p className="text-xs text-blue-100 mt-1">
                                    {greeting}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2"></div>
                </div>
            )}
        </HabitLayout>
    );
}

const HabitOnboarding = () => {
    const [completedIntro, setCompletedIntro] = useState(false);

    const onSubmitSelection = () => {};

    const HabitIntro = () => {
        const [page, setPage] = useState(0);

        const { username, userDoc, user } = useContext(UserContext);

        const introPageContent = [
            <p key="1">
                In Habitual, each habit takes the form of a creature known as a
                xiguan.
                <br />
                <br />
                Over time, as your habits start to develop, so will your
                xiguans.
            </p>,
            <p key="2">
                Each xiguan is a sentient creature that is capable of forming a
                bond with you.
                <br />
                <br />
                They all have a distincitive set of features that makes them
                unique.
            </p>,
            <p key="3">
                Although each xiguan later becomes unique, they all start out as
                one of four different types.
                <br />
                <br />
                Each of these types has special abilities that the others do not
                have.
            </p>,
        ];

        return (
            <div className="max-w-sm w-full p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl mb-4">Welcome, {username}!</h3>
                <div className="text-gray-500 text-md leading-6 mb-6">
                    {introPageContent[page]}
                </div>
                <div className="flex justify-center">
                    <div className="flex space-x-2 mb-4">
                        {introPageContent.map((v, i) => (
                            <div
                                key={i}
                                className={`rounded-[50%] w-1 h-1  transition-colors ${
                                    i <= page ? "bg-blue-600" : "bg-blue-200"
                                }`}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    {page > 0 && (
                        <button
                            onClick={() => {
                                setPage((page) => page - 1);
                            }}
                            className="py-1.5 px-5 rounded-md shadow-md text-blue-600"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={() => {
                            page === introPageContent.length - 1
                                ? setCompletedIntro(true)
                                : setPage((page) => page + 1);
                        }}
                        className="ml-auto bg-blue-600 hover:bg-blue-700 text-white rounded-md py-1.5 px-5"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    const SelectionPage = () => {
        const [selectedCategory, setSelectedCategory] = useState(0);
        const [categoryHist, setCategoryHist] = useState([]);

        const addSelection = (selection) => {
            setSelectedCategory(selection);
            setCategoryHist((prevHist) => [...prevHist, selection].slice(-3));
        };

        const eggDescriptions = [
            "",
            "Good choice! Green xiguans are very easy to raise and make great companions.",
            "Hm! Blue xiguans are very interesting and worth developing. ",
            "Red xiguans require a lot of patience, but can be very powerful once fully developed.",
        ];

        return (
            <div className="max-w-sm w-full p-6 rounded-lg shadow-lg">
                {selectedCategory !== 4 ? (
                    <div>
                        <h3 className="text-2xl mb-4">Choose your starter</h3>
                        <div className="text-gray-500 text-md leading-6 mb-6">
                            <p>
                                Here are three xiguan eggs. The different colors
                                correspond to the different types. Choose
                                wisely!
                            </p>
                        </div>
                        <div className="flex justify-between mb-6">
                            <button onClick={() => addSelection(1)}>
                                <div
                                    className={
                                        selectedCategory === 1
                                            ? "bg-green-100 rounded-lg p-4"
                                            : "bg-green-50 rounded-lg p-4"
                                    }
                                >
                                    <div className="w-16 h-16 relative">
                                        <Xiguan_1_0 className="w-full h-full" />
                                    </div>
                                </div>
                            </button>
                            <button onClick={() => addSelection(2)}>
                                <div
                                    className={
                                        selectedCategory === 2
                                            ? "bg-blue-100 rounded-lg p-4"
                                            : "bg-blue-50 rounded-lg p-4"
                                    }
                                >
                                    <div className="w-16 h-16 relative">
                                        <Xiguan_2_0 className="w-full h-full" />
                                    </div>
                                </div>
                            </button>
                            <button onClick={() => addSelection(3)}>
                                <div
                                    className={
                                        selectedCategory === 3
                                            ? "bg-red-100 rounded-lg p-4"
                                            : "bg-red-50 rounded-lg p-4"
                                    }
                                >
                                    <div className="w-16 h-16 relative">
                                        <Xiguan_3_0 className="w-full h-full" />
                                    </div>
                                </div>
                            </button>
                        </div>
                        <p className="text-gray-500 text-md leading-6 mb-6">
                            {eggDescriptions[selectedCategory]}
                        </p>
                        {selectedCategory !== 0 && (
                            <button className="bg-blue-600 hover:bg-blue-700 w-full py-1.5 rounded-md text-white">
                                I want the{" "}
                                {["", "green", "blue", "red"][selectedCategory]}{" "}
                                egg
                            </button>
                        )}
                        {categoryHist.length === 3 && (
                            <button
                                className="shadow-md rounded-md w-full py-1.5 mt-4 text-gray-400"
                                onClick={() => setSelectedCategory(4)}
                            >
                                I don&apos;t like any of them
                            </button>
                        )}
                    </div>
                ) : (
                    <div>
                        <h3 className="text-2xl mb-4"></h3>
                        <p className="text-gray-500 text-md leading-6 mb-6">
                            If you insist...there is a fourth type of egg.
                        </p>
                        <div className="flex justify-center mb-6">
                            <div className="bg-yellow-100 rounded-lg p-4">
                                <div className="w-16 h-16 relative">
                                    <Xiguan_3_0 className="w-full h-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col pt-20 px-5 items-center">
            {!completedIntro ? <HabitIntro /> : <SelectionPage />}
        </div>
    );
};
