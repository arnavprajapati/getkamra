import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import "../../global.css";

const properties = [
  { id: '1', title: 'Modern Villa', city: 'Mumbai', price: '₹1.2Cr' },
  { id: '2', title: 'Sea View Flat', city: 'Mumbai', price: '₹85L' },
  { id: '3', title: 'Studio Loft', city: 'Bangalore', price: '₹32L' },
];

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <View className="py-10">
        <Text className="text-base font-medium mb-1 text-black">
          Hello here Arnav
        </Text>

        <TextInput
          placeholder="Search city.."
          placeholderTextColor="#999"
          className="border border-gray-300 rounded-lg p-2.5 mt-3 text-base bg-white text-black"
        />

        <TouchableOpacity
          onPress={() => alert('Searching')}
          className="bg-blue-600 rounded-lg p-3 items-center mt-3 mb-2"
        >
          <Text className="text-white font-semibold text-base">Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        renderItem={({ item }) => (
          <View className="mb-4">
            <Text className="text-base font-bold text-black">{item.title}</Text>
            <Text className="text-gray-600 text-sm">{item.city}</Text>
            <Text className="text-blue-600 text-[15px] font-medium">{item.price}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}