import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function ListComponent({
  name,
  current_price,
  symbol,
  image,
  price_change_percentage_24h,
  id,
}: Coin) {
  const formatPriceChange = (num: number) => {
    const is_negative = num < 0;

    return (
      <Text
        style={{
          fontFamily: "regular",
          color: is_negative ? "red" : "green",
          fontSize: 14,
        }}
      >
        {is_negative ? num : `+${num}`}
      </Text>
    );
  };

  const truncateText = (text: string, maxLength = 13): string => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const router = useRouter();
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 8,
        display: "flex",
        columnGap: 15,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginTop: 15,
        borderRadius: 8,
      }}
      onPress={() => router.push(`/coin/${id}`)}
    >
      <View
        style={{
          backgroundColor: "rgba(46, 111, 239, 0.3)",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          height: 80,
          width: 80,
        }}
      >
        <Image source={{ uri: image }} height={60} width={60} style={{}} />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          rowGap: 10,
          paddingRight: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{ fontSize: 20, fontFamily: "semi-bold", color: "#fff" }}
          >
            {truncateText(name)}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "semi-bold",
              color: "#fff",
              textTransform: "uppercase",
            }}
          >
            {symbol}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.8)",
              fontFamily: "regular",
            }}
          >
            ${current_price}
          </Text>
          {formatPriceChange(price_change_percentage_24h)}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});

// #2e6fef
