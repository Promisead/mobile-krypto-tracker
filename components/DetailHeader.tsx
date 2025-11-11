import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { useMainContext } from "@/providers/MainProvider";
import { useState } from "react";

export default function DetailHeader({ id }: { id: string }) {
  const router = useRouter();
  const { favourites, setFavourites } = useMainContext();

  const checkFavourites = favourites.includes(id);

  const [isFavourites, setIsFavourites] = useState<boolean>(checkFavourites);

  const handleFavouritesPress = async () => {
    try {
      setIsFavourites((prev) => !prev);
      if (!isFavourites) {
        setFavourites((prev) => [...prev, id]);
        await SecureStore.setItemAsync(
          "favourites",
          JSON.stringify([...favourites, id])
        );
      } else {
        const filteredFavourites = favourites.filter((_id) => _id !== id);
        setFavourites(filteredFavourites);
        await SecureStore.setItemAsync(
          "favourites",
          JSON.stringify(filteredFavourites)
        );
      }
    } catch (error) {
      console.error("error adding favourites: ", error);
    }
  };
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#2e6fef",
        position: "relative",
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "rgba(46, 111, 239, 0.5)",
          borderRadius: "100%",
          padding: 8,
          position: "absolute",
          right: 20,
        }}
        onPress={handleFavouritesPress}
      >
        <Ionicons
          name={isFavourites ? "heart" : "heart-outline"}
          size={30}
          color={"#FF1744"}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 24,
          color: "#fff",
          fontFamily: "bold",
          textTransform: "capitalize",
          // flex: 1,
          textAlign: "center",
        }}
      >
        {id}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "rgba(46, 111, 239, 0.5)",
          borderRadius: "100%",
          padding: 8,
          position: "absolute",
          left: 20,
        }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back-circle-sharp" size={30} color="#fff" />
        
      </TouchableOpacity>
    </View>
  );
}
