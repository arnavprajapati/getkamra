import { Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView } from "react-native";

const properties = [
  { id: '1', title: 'Modern Villa', city: 'Mumbai', price: '₹1.2Cr' },
  { id: '2', title: 'Sea View Flat', city: 'Mumbai', price: '₹85L' },
  { id: '3', title: 'Studio Loft', city: 'Bangalore', price: '₹32L' },
];

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <View style={{ paddingTop: 30 }}>
        <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4 }}>
          Hello here Arnav
        </Text>
        
        <TextInput
          placeholder="Search city.."
          placeholderTextColor="#999"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 10,
            marginTop: 12,
          }}
        />

        <TouchableOpacity
          onPress={() => alert('Seraching')}
          style={{
            backgroundColor: "#2563EB",
            borderRadius: 8,
            padding: 12,
            alignItems: "center",
            marginTop: 12,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.title}</Text>
            <Text style={{ color: "#666", fontSize: 14 }}>{item.city}</Text>
            <Text style={{ color: "#2563EB", fontSize: 15, fontWeight: "500" }}>{item.price}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}