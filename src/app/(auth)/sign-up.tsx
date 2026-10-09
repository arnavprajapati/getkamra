import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SignUpScreen() {
    const { signUp, errors, fetchStatus } = useSignUp();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");

    const isLoading = fetchStatus === "fetching";

    const onSignUpPress = async () => {
        const { error } = await signUp.password({
            emailAddress: email,
            password,
            firstName,
            lastName,
        });

        if (error) {
            alert(error.message)
            return
        }

        await signUp.verifications.sendEmailCode();
    };

    const onVerifyPress = async () => {
        await signUp.verifications.verifyEmailCode({ code });

        if (signUp.status === "complete") {
            await signUp.finalize({
                navigate: ({ session, decorateUrl }) => {

                    if(session?.currentTask){
                        console.log(session?.currentTask);
                        return
                    }

                    const url = decorateUrl("/")
                    router.replace(url as any);
                },
            });
        } else {
            console.error("Sign-up attempt not complete:", signUp);
        }
    };

    if (signUp.status === "complete" || isSignedIn) {
        return null;
    }

    if (
        signUp.status === "missing_requirements" &&
        signUp.unverifiedFields.includes("email_address") &&
        signUp.missingFields.length === 0
    ) {
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
                        ONE LAST STEP
                    </Text>
                    <Text className="text-3xl font-bold text-gray-900 mb-3">
                        Check your{"\n"}inbox.
                    </Text>
                    <Text className="text-gray-500 text-base mb-2">
                        Enter the verification code we sent to
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
                                Verify and continue
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View className="flex-row justify-center items-center">
                        <Text className="text-gray-500">Didn't get the code? </Text>
                        <TouchableOpacity
                            onPress={() => signUp.verifications.sendEmailCode()}
                            disabled={isLoading}
                            className="py-2"
                        >
                            <Text className="text-orange-600 font-bold">
                                Resend
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            setCode("");
                            signUp.reset();
                        }}
                        disabled={isLoading}
                        className="items-center py-3 mt-2"
                    >
                        <Text className="text-gray-600 font-semibold">
                            Use a different email
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
                    Your next room{"\n"}starts here.
                </Text>
                <Text className="text-gray-500 text-base mb-8">
                    Join GetKamra to explore PGs and save your favourites.
                </Text>

                <Text className="text-gray-700 font-semibold mb-2">
                    Your name
                </Text>
                <View className="flex-row gap-3 mb-5">
                    <TextInput
                        className="flex-1 bg-white border border-orange-100 rounded-2xl px-4 py-4"
                        placeholder="First name"
                        placeholderTextColor="#9CA3AF"
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCapitalize="words"
                    />
                    <TextInput
                        className="flex-1 bg-white border border-orange-100 rounded-2xl px-4 py-4"
                        placeholder="Last name"
                        placeholderTextColor="#9CA3AF"
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize="words"
                    />
                </View>

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

                {errors.fields.emailAddress && (
                    <Text className="text-red-500 mt-1">
                        {errors.fields.emailAddress.message}
                    </Text>
                )}

                <Text className="text-gray-700 font-semibold mt-5 mb-2">
                    Create a password
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

                {errors.fields.password && (
                    <Text className="text-red-500 mt-1">
                        {errors.fields.password.message}
                    </Text>
                )}

                <TouchableOpacity
                    onPress={onSignUpPress}
                    disabled={isLoading}
                    activeOpacity={0.8}
                    className={`w-full bg-orange-500 py-4 rounded-2xl items-center mt-7 mb-6 ${isLoading ? "opacity-60" : ""
                        }`}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-base">
                            Create my account
                        </Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center">
                    <Text className="text-gray-500">Already on GetKamra? </Text>
                    <Link href="/sign-in">
                        <Text className="text-orange-600 font-bold">
                            Log in
                        </Text>
                    </Link>
                </View>

                <View nativeID="clerk-captcha" />
            </View>
        </ScrollView>
    );
}