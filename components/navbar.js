import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useContext } from "react";
import { Popover, Transition, Menu } from "@headlessui/react";
import {
    BookmarkAltIcon,
    CalendarIcon,
    ChartBarIcon,
    CursorClickIcon,
    MenuIcon,
    PhoneIcon,
    PlayIcon,
    RefreshIcon,
    ShieldCheckIcon,
    SupportIcon,
    ViewGridIcon,
    XIcon,
} from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";

import HabitualLogo from "@icons/habitual.svg";
import HabitualFullLogo from "@icons/habitualFull.svg";

import { UserContext } from "@lib/context";
import { signOut } from "@lib/firebase";

import NavbarNotLoggedIn from "./navbarNotLoggedIn";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
    const { userDoc, username } = useContext(UserContext);

    const router = useRouter();

    if (!username) {
        return <NavbarNotLoggedIn />;
    }

    return (
        <div className="relative bg-white">
            <div className="w-screen mx-auto px-8 sm:px-10 shadow-md">
                <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10 h-24 max-h-24">
                    <div className="flex justify-start flex-1 max-h-full">
                        <Link href="/">
                            <a className="text-[0rem]">
                                <span className="sr-only">Habitual</span>
                                <HabitualFullLogo className="h-8 sm:h-10 w-auto" />
                            </a>
                        </Link>
                    </div>
                    <Menu as="div" className="relative">
                        <div>
                            <Menu.Button className="bg-white flex text-[0] rounded-full">
                                <span className="sr-only">Open user menu</span>
                                <img
                                    className="rounded-full w-12 h-12"
                                    src={userDoc?.photoURI}
                                    alt=""
                                />
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-60 rounded-lg shadow-lg py-1 bg-white focus:outline-none overflow-hidden">
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={classNames(
                                                active ? "bg-gray-100" : "",
                                                "block px-6 py-4 text-md w-full"
                                            )}
                                        >
                                            Your Profile
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={classNames(
                                                active ? "bg-gray-100" : "",
                                                "block px-6 py-4 text-md w-full"
                                            )}
                                        >
                                            Settings
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => {
                                                signOut(router);
                                            }}
                                            className={classNames(
                                                active ? "bg-gray-100" : "",
                                                "block px-6 py-4 text-md text-left w-full"
                                            )}
                                        >
                                            Sign out
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </div>
    );
}
