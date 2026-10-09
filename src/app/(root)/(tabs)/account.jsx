import { useAuth } from "@clerk/expo"
import { useRouter } from "expo-router"
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"

export default function HomeScreem() {
    const router = useRouter()
    const { signOut } = useAuth()

    const handleSignOut = async () => {
        try {
            await signOut()
            router.replace("/sign-in")
        } catch (error) {
            console.log("Error signing out:", error);
        }
    }

    return (
        <SafeAreaView classname="flex-1">
            <View className="px-6 py-6">
                <Text className="text-3xl font-bold text-gray-900 mb-8">
                    Account
                </Text>

                <TouchableOpacity
                    onPress={handleSignOut}
                    className="bg-orange-500 py-4 rounded-2xl items-center"
                    activeOpacity={0.8}
                >
                    <Text className="text-white font-bold text-base">
                        Log out
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}