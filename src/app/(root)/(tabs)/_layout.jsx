import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#F97316',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarRippleColor: 'transparent',
                tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
                tabBarStyle: {
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom + 6,
                    paddingTop: 8,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => <Ionicons name="compass" size={26} color={color} />,
                }}
            />
            <Tabs.Screen
                name="find"
                options={{
                    title: 'Find PG',
                    tabBarIcon: ({ color }) => <Ionicons name="search" size={26} color={color} />,
                }}
            />
            <Tabs.Screen
                name="shortlist"
                options={{
                    title: 'Shortlist',
                    tabBarIcon: ({ color }) => <Ionicons name="heart" size={26} color={color} />,
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={26} color={color} />,
                }}
            />
        </Tabs>
    );
}