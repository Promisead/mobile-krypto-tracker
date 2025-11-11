import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function Header() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#2e6fef",
      }}
    >
      <Text style={{ fontSize: 24, color: "#fff", fontFamily: "bold" }}>
        Krypto Tracker
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "rgba(46, 111, 239, 0.5)",
          borderRadius: "100%",
          padding: 8,
        }}
      >
        {/*@ts-ignore*/}
        <Link href={"/favourites"}>
          <Ionicons name="heart" size={30} color="#ff001eff" />
        </Link>
      </TouchableOpacity>
    </View>
  );
}
