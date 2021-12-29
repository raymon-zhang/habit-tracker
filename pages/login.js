import { useState, useContext, useEffect, useCallback, useMemo } from "react";

import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";

import { UserContext } from "@lib/context";
import { useAuthRedirect } from "@lib/hooks";
import { auth, firestore } from "@lib/firebase";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import debounce from "lodash.debounce";

import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-identicon-sprites";

import LoginSideIllustration from "@icons/login-side.svg";
import HabitualLogo from "@icons/habitual.svg";
import Loader from "@components/Loader";

export default function Login(props) {
    const { user, username, loading } = useContext(UserContext);

    useAuthRedirect({
        username,
        loading,
        redirectTo: "/",
        redirectIfFound: true,
    });

    return (
        <main>
            <div className="flex justify-center items-center mt-10 md:mt-16 lg:mt-16 w-full">
                <div className="flex shadow-xl rounded-xl overflow-hidden w-9/12 max-w-3xl">
                    <div className="bg-blue-200 p-6 hidden md:flex w-[45%] items-center">
                        <LoginSideIllustration className="w-full h-auto" />
                    </div>
                    {loading ? (
                        <div className="bg-white p-12 w-full md:w-[55%] relative">
                            <Loader show={true} />
                        </div>
                    ) : user ? (
                        username === null ? (
                            <UsernameForm />
                        ) : (
                            <div className="bg-white p-12 w-full md:w-[55%] relative">
                                <Loader show={true} />
                            </div>
                        )
                    ) : (
                        <SignInForm />
                    )}
                </div>
            </div>
        </main>
    );
}

const SignInForm = () => {
    const [phoneInput, setPhoneInput] = useState("");
    const [verificationInput, setVerificationInput] = useState("");
    const [recaptchaVerified, setRecaptchaVerified] = useState(false);
    const [codeSent, setCodeSent] = useState(false);

    const onSubmitPhoneNumber = (e) => {
        e.preventDefault();
        window.recaptchaVerifier = new RecaptchaVerifier(
            "sign-in-button",
            {
                size: "invisible",
                callback: (response) => {
                    setRecaptchaVerified(true);
                },
            },
            auth
        );
        console.log(phoneInput);
        signInWithPhoneNumber(auth, phoneInput, window.recaptchaVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setCodeSent(true);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onSubmitVerificationCode = (e) => {
        e.preventDefault();
        console.log("hello");
        console.log(verificationInput);
        window.confirmationResult.confirm(verificationInput);
    };

    return !codeSent ? (
        <div className="bg-white p-12 w-full md:w-[55%]">
            <div className="w-full">
                <HabitualLogo className="mx-auto w-12 h-12" />
                <h1 className="mt-6 text-center text-3xl">
                    Sign in to your account
                </h1>
            </div>
            <form onSubmit={onSubmitPhoneNumber} className="mt-12 space-y-12">
                <div>
                    <PhoneInput
                        placeholder="Enter your phone number"
                        value={phoneInput}
                        onChange={setPhoneInput}
                        defaultCountry="US"
                    />
                </div>
                <div className="text-center text-gray-500">
                    We&apos;ll never share your personal information with
                    anyone.
                </div>
                <div>
                    <button
                        type="submit"
                        id="sign-in-button"
                        className="bg-blue-600 w-full px-4 py-2 flex justify-center text-white rounded-md hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    ) : (
        <div className="bg-white p-12 w-full md:w-[55%]">
            <div className="w-full">
                <HabitualLogo className="mx-auto w-12 h-12" />
                <h1 className="mt-6 text-center text-3xl">Enter code</h1>
            </div>
            <div className="text-center text-gray-700 mt-4">
                We&apos;ve sent a 6-digit code to your phone number.
            </div>
            <form
                onSubmit={onSubmitVerificationCode}
                className="mt-6 space-y-8"
            >
                <div>
                    <input
                        value={verificationInput}
                        onChange={(event) =>
                            setVerificationInput(event.target.value)
                        }
                        type="text"
                        placeholder="Confirmation code"
                        className="border-none ring-1 ring-gray-200 focus:ring-blue-600 rounded-md block w-full"
                    />
                </div>
                <div className="text-center text-gray-500">
                    By signing in, you agree to our Terms of service and Privacy
                    policy.
                </div>
                <div>
                    <button
                        type="submit"
                        className="bg-blue-600 w-full px-4 py-2 flex justify-center text-white rounded-md hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

const UsernameForm = () => {
    const [usernameValue, setUsernameValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const [isNameValid, setIsNameValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();

        // Create refs for both documents
        // const userDoc = doc(`users/${user.uid}`);
        const userDoc = doc(firestore, "users", user.uid);
        // const usernameDoc = doc(`usernames/${formValue}`);
        const usernameDoc = doc(firestore, "usernames", usernameValue);

        const pfp = createAvatar(style, {
            seed: usernameValue,
            colorLevel: 400,
        });

        pfp = `data:image/svg+xml;utf8,${encodeURIComponent(pfp)}`;

        // Commit both docs together as a batch write.
        const batch = writeBatch(firestore);
        batch.set(userDoc, {
            username: usernameValue,
            photoURI: pfp,
            displayName: nameValue,
            email: emailValue,
            createdAt: serverTimestamp(),
            bio: null,
            new: true,
        });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
    };

    const onUsernameChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setUsernameValue(val);
            setLoading(false);
            setIsUsernameValid(false);
        }

        if (re.test(val)) {
            setUsernameValue(val);
            setLoading(true);
            setIsUsernameValid(false);
        }
    };

    const onNameChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value;
        const re = /^[a-z ,.'-]+$/i;

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setNameValue(val);
            setIsNameValid(false);
        }

        if (re.test(val)) {
            setNameValue(val);
            setIsNameValid(val.length >= 3);
        }
    };

    const onEmailChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value;
        const re =
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        setEmailValue(val);

        if (re.test(val)) {
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
        }

        if (val.length === 0) {
            setIsEmailValid(true);
        }
    };

    //

    useEffect(() => {
        checkUsername(usernameValue);
    }, [usernameValue, checkUsername]);

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work
    const checkUsername = useMemo(
        () =>
            debounce(async (username) => {
                if (username.length >= 3) {
                    console.log("read");
                    const ref = doc(firestore, "usernames", username);
                    const exists = (await getDoc(ref)).exists();
                    setIsUsernameValid(!exists);
                    setLoading(false);
                }
            }, 500),
        []
    );

    return (
        !username && (
            <div className="bg-white p-12 w-full md:w-[55%]">
                <div className="w-full">
                    <HabitualLogo className="mx-auto w-12 h-12" />
                    <h1 className="mt-6 text-center text-3xl">
                        Welcome to Habitual!
                    </h1>
                </div>
                <div className="text-center text-gray-600 mt-4">
                    Before you continue, we&apos;ll need some basic information.
                </div>
                <form onSubmit={onSubmit} className="mt-4 space-y-2">
                    <div>
                        <label
                            htmlFor="name"
                            className="text-gray-500 mb-1 text-sm"
                        >
                            Enter your name
                        </label>
                        <input
                            name="name"
                            id="name"
                            placeholder="John Doe"
                            type="text"
                            value={nameValue}
                            onChange={onNameChange}
                            className="w-full border-none ring-1 ring-gray-200 focus:ring-blue-600 rounded-md"
                        />
                        {nameValue ? (
                            isNameValid ? (
                                <p className="text-xs">&nbsp;</p>
                            ) : (
                                <p className="text-xs text-red-500">
                                    Are you sure you typed this correctly?
                                </p>
                            )
                        ) : (
                            <p className="text-xs">&nbsp;</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="username"
                            className="text-gray-500 mb-1 text-sm"
                        >
                            Pick a username
                        </label>
                        <input
                            name="username"
                            id="username"
                            placeholder="myname"
                            type="text"
                            value={usernameValue}
                            onChange={onUsernameChange}
                            className="w-full border-none ring-1 ring-gray-200 focus:ring-blue-600 rounded-md"
                        />
                        <UsernameMessage
                            username={usernameValue}
                            isValid={isUsernameValid}
                            loading={loading}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="text-gray-500 mb-1 text-sm"
                        >
                            (Optional) Enter your email
                        </label>
                        <input
                            name="email"
                            id="email"
                            placeholder="johndoe@example.com"
                            type="text"
                            value={emailValue}
                            onChange={onEmailChange}
                            className="w-full border-none ring-1 ring-gray-200 focus:ring-blue-600 rounded-md"
                        />
                        {emailValue ? (
                            isEmailValid ? (
                                <p className="text-xs">&nbsp;</p>
                            ) : (
                                <p className="text-xs text-red-500">
                                    Invalid email.
                                </p>
                            )
                        ) : (
                            <p className="text-xs">&nbsp;</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 w-full px-4 py-2 flex justify-center text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                        disabled={
                            !isUsernameValid || !isNameValid || !isEmailValid
                        }
                    >
                        Submit
                    </button>
                </form>
            </div>
        )
    );
};

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p className="text-gray-500 text-xs">Checking...</p>;
    } else if (isValid) {
        return (
            <p className="text-green-500 text-xs">{username} is available!</p>
        );
    } else if (username && !isValid) {
        return (
            <p className="text-red-500 text-xs">
                That username is not available!
            </p>
        );
    } else {
        return <p className="text-xs">&nbsp;</p>;
    }
}
