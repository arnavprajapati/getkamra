import { useSignIn } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ForgotPasswordScreen() {
    const { signIn } = useSignIn();
    const router = useRouter();
    const params = useLocalSearchParams<{ email?: string }>();

    const [email, setEmail] = useState(params.email ?? "");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const sendCode = async () => {
        const { error: createError } = await signIn.create({
            identifier: email.trim(),
        });

        if (createError) {
            setErrorMessage(createError.message);
            return;
        }

        const { error } = await signIn.resetPasswordEmailCode.sendCode();

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        setStep(2);
    };

    const verifyCode = async () => {
        const { error } = await signIn.resetPasswordEmailCode.verifyCode({
            code: code.trim(),
        });

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        setStep(3);
    };

    const resetPassword = async () => {
        const { error } = await signIn.resetPasswordEmailCode.submitPassword({
            password,
            signOutOfOtherSessions: true,
        });

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        await signIn.reset();

        Alert.alert(
            "Password updated",
            "You can now log in with your new password.",
            [{ text: "Log in", onPress: () => router.replace("/sign-in") }]
        );
    };

    const handleContinue = async () => {
        if (isLoading) return;

        setErrorMessage("");

        if (step === 1 && !email.trim()) {
            setErrorMessage("Enter your registered email address.");
            return;
        }

        if (step === 2 && !code.trim()) {
            setErrorMessage("Enter the verification code.");
            return;
        }

        if (step === 3 && !password) {
            setErrorMessage("Enter a new password.");
            return;
        }

        setIsLoading(true);

        try {
            if (step === 1) {
                await sendCode();
            } else if (step === 2) {
                await verifyCode();
            } else {
                await resetPassword();
            }
        } catch {
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (isLoading) return;

        setIsLoading(true);
        setErrorMessage("");

        try {
            const { error } = await signIn.resetPasswordEmailCode.sendCode();

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            Alert.alert("Code sent", "Check your email for a new code.");
        } catch {
            setErrorMessage("Could not send the code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="bg-orange-50"
            keyboardShouldPersistTaps="handled"
        >
            <View className="flex-1 justify-center px-6 py-12">
                <Image
                    source={require("../../../assets/images/getkamra.png")}
                    className="w-56 h-20 mb-10"
                    resizeMode="contain"
                />

                <Text className="text-orange-600 font-bold mb-3">
                    ACCOUNT RECOVERY
                </Text>

                <Text className="text-3xl font-bold text-gray-900 mb-3">
                    {step === 1
                        ? "Forgot your\npassword?"
                        : step === 2
                            ? "Check your\ninbox."
                            : "A fresh start.\nSet your password."}
                </Text>

                <Text className="text-gray-500 text-base mb-8">
                    {step === 1
                        ? "Enter your registered email to receive a reset code."
                        : step === 2
                            ? `Enter the reset code sent to ${email.trim()}.`
                            : "Choose a new password for your GetKamra account."}
                </Text>

                {step === 1 && (
                    <>
                        <Text className="text-gray-700 font-semibold mb-2">
                            Email
                        </Text>
                        <TextInput
                            className="bg-white border border-orange-100 rounded-2xl px-4 py-4"
                            placeholder="you@example.com"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </>
                )}

                {step === 2 && (
                    <>
                        <Text className="text-gray-700 font-semibold mb-2">
                            Reset code
                        </Text>
                        <TextInput
                            className="bg-white border border-orange-100 rounded-2xl px-4 py-4 text-center text-2xl tracking-widest"
                            placeholder="Enter code"
                            placeholderTextColor="#9CA3AF"
                            value={code}
                            onChangeText={setCode}
                            keyboardType="number-pad"
                        />
                    </>
                )}

                {step === 3 && (
                    <>
                        <Text className="text-gray-700 font-semibold mb-2">
                            New password
                        </Text>
                        <TextInput
                            className="bg-white border border-orange-100 rounded-2xl px-4 py-4"
                            placeholder="Enter a new password"
                            placeholderTextColor="#9CA3AF"
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry
                        />
                    </>
                )}

                {!!errorMessage && (
                    <Text className="text-red-500 mt-3">{errorMessage}</Text>
                )}

                <TouchableOpacity
                    onPress={handleContinue}
                    disabled={isLoading}
                    activeOpacity={0.8}
                    className={`bg-orange-500 py-4 rounded-2xl items-center mt-7 mb-4 ${isLoading ? "opacity-60" : ""
                        }`}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-base">
                            {step === 1
                                ? "Send reset code"
                                : step === 2
                                    ? "Verify code"
                                    : "Reset password"}
                        </Text>
                    )}
                </TouchableOpacity>

                {step === 2 && (
                    <TouchableOpacity
                        onPress={handleResend}
                        disabled={isLoading}
                        className="items-center py-3"
                    >
                        <Text className="text-orange-600 font-bold">
                            Resend code
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={async () => {
                        await signIn.reset();
                        router.replace("/sign-in");
                    }}
                    disabled={isLoading}
                    className="items-center py-3"
                >
                    <Text className="text-gray-600 font-semibold">
                        Back to login
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}