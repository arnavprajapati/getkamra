import { useSignIn, useAuth } from "@clerk/expo";
import { Link, useRouter, Redirect } from "expo-router";
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

export default function SignInScreen() {
    const { signIn, errors, fetchStatus } = useSignIn();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");

    const { isLoaded, isSignedIn } = useAuth();

    const onSignInPress = async () => {

        if (isSignedIn) {
            router.replace("/(root)/(tabs)");
            return;
        }

        const { error } = await signIn.password({
            emailAddress: email,
            password,
        });

        if (error) {
            Alert.alert("Unable to log in", error.message);
            return;
        }

        if (signIn.status === "complete") {
            await signIn.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) {
                        console.log(session.currentTask);
                        return;
                    }

                    router.replace(decorateUrl("/") as any);
                },
            });
        } else {
            console.error("Sign-in attempt not complete:", signIn.status);
        }
    };

    const onVerifyPress = async () => {
        const { error } = await signIn.mfa.verifyEmailCode({ code });

        if (error) return;

        if (signIn.status === "complete") {
            await signIn.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) {
                        console.log(session.currentTask);
                        return;
                    }

                    router.replace(decorateUrl("/") as any);
                },
            });
        }
    };

    const isLoading = fetchStatus === "fetching";

    if (!isLoaded) return null;

    if (isSignedIn) {
        return <Redirect href="/(root)/(tabs)" />;
    }

    if (signIn.status === "needs_client_trust") {
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
                        QUICK SECURITY CHECK
                    </Text>
                    <Text className="text-3xl font-bold text-gray-900 mb-3">
                        Let's make sure{"\n"}it's you.
                    </Text>
                    <Text className="text-gray-500 text-base mb-2">
                        Enter the verification code sent to
                    </Text>
                    <Text className="text-gray-900 font-semibold mb-8">
                        {email}
                    </Text>

                    <Text className="text-gray-700 font-semibold mb-2">
                        Verification code
                    </Text>
                    <TextInput
                        className="w-full bg-white border border-orange-100 rounded-2xl px-4 py-4 text-center text-2xl tracking-widest"
                        placeholder="Enter code"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        value={code}
                        onChangeText={setCode}
                    />

                    {errors.fields.code && (
                        <Text className="text-red-500 mt-2">
                            {errors.fields.code.message}
                        </Text>
                    )}

                    <TouchableOpacity
                        onPress={onVerifyPress}
                        disabled={isLoading}
                        activeOpacity={0.8}
                        className={`w-full bg-orange-500 py-4 rounded-2xl items-center mt-7 mb-6 ${isLoading ? "opacity-60" : ""
                            }`}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-base">
                                Verify and log in
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View className="flex-row justify-center items-center">
                        <Text className="text-gray-500">Didn't get the code? </Text>
                        <TouchableOpacity
                            onPress={() => signIn.mfa.sendEmailCode()}
                            disabled={isLoading}
                            className="py-2"
                        >
                            <Text className="text-orange-600 font-bold">Resend</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={async () => {
                            await signIn.reset();
                            setCode("");
                        }}
                        disabled={isLoading}
                        className="items-center py-3 mt-2"
                    >
                        <Text className="text-gray-600 font-semibold">
                            Back to login
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

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

                <Text className="text-3xl font-bold text-gray-900 mb-3">
                    Welcome back.{"\n"}Find your space.
                </Text>
                <Text className="text-gray-500 text-base mb-8">
                    Log in to explore PGs and pick up your room search.
                </Text>

                <Text className="text-gray-700 font-semibold mb-2">
                    Email
                </Text>
                <TextInput
                    className="w-full bg-white border border-orange-100 rounded-2xl px-4 py-4 mb-2"
                    placeholder="you@example.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {errors.fields.identifier && (
                    <Text className="text-red-500 mt-1">
                        {errors.fields.identifier.message}
                    </Text>
                )}

                <Text className="text-gray-700 font-semibold mt-5 mb-2">
                    Password
                </Text>
                <TextInput
                    className="w-full bg-white border border-orange-100 rounded-2xl px-4 py-4 mb-2"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                />

                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: "/forgot-password",
                            params: { email },
                        })
                    }
                    className="self-end mt-3"
                >
                    <Text className="text-orange-600 font-semibold">
                        Forgot password?
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onSignInPress}
                    disabled={isLoading}
                    activeOpacity={0.8}
                    className={`w-full bg-orange-500 py-4 rounded-2xl items-center mt-7 mb-6 ${isLoading ? "opacity-60" : ""
                        }`}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-base">
                            Log in to GetKamra
                        </Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center">
                    <Text className="text-gray-500">New to GetKamra? </Text>
                    <Link href="/sign-up">
                        <Text className="text-orange-600 font-bold">
                            Create an account
                        </Text>
                    </Link>
                </View>
            </View>
        </ScrollView>
    );
}