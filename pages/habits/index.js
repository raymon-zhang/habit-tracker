import HabitLayout from "@layouts/HabitLayout";
import { UserContext } from "@lib/context";
import { format } from "date-fns";
import { useContext, useEffect } from "react";

export default function Habits() {
    const d = new Date();
    const formattedDate = format(d, "eeee, MMM do");
    const hours = d.getHours();
    const timeOfDay =
        d.getHours() < 12
            ? "morning"
            : d.getHours() < 18
            ? "afternoon"
            : d.getHours() < 21
            ? "evening"
            : "night";

    const greetings = {
        morning: ["Have a good day!"],
        afternoon: ["What's up?", "It's a beautiful day outside!"],
        evening: ["How was your day?"],
        night: ["Sleep well!", "See you tomorrow!", "Don't stay up too late!"],
    };

    const greeting =
        Math.random() < 0.99
            ? greetings[timeOfDay][
                  Math.floor(Math.random() * greetings[timeOfDay].length)
              ]
            : "";

    const { username, userDoc, user } = useContext(UserContext);

    useEffect(() => {
        user.getIdToken(true).then((idToken) => {
            console.log(idToken);
        });
    });

    return (
        <HabitLayout>
            <div className="grid gap-6 grid-cols-5 p-10 sm:p-16">
                <div className="col-span-3">
                    <div className="shadow-md rounded-lg px-10 py-8 bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                        <h3 className="text-3xl mb-4">
                            Good {timeOfDay}, {username}.
                        </h3>
                        <h4 className="text-xl">Today is {formattedDate}.</h4>
                        {greeting && (
                            <p className="text-xs text-blue-100 mt-1">
                                {greeting}
                            </p>
                        )}
                    </div>
                </div>
                <div className="col-span-2"></div>
            </div>
        </HabitLayout>
    );
}
