import { useAuth } from "@clerk/expo";
import { Redirect, Slot, Stack } from "expo-router";

export default function Index() {
    const { isLoaded, isSignedIn } = useAuth()
    if (!isLoaded) return null

    if (isSignedIn) return <Redirect href={"/"} />

    return (
        <Stack screenOptions={{ headerShown: false }} />
    );
}