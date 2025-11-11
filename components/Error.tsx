import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SIZES } from "@/constants";

export default function Error({
  error,
  onPress,
  text = "Try Again",
}: {
  error: string | null;
  onPress: () => void;
  text?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#3b80e0ff",
        justifyContent: "center",
        alignItems: "center",
        rowGap: 10,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 20,
          fontFamily: "semi-bold",
          textAlign: "center",
        }}
      >
        {error}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#2e6fef",
          borderRadius: 8,
          width: SIZES.width / 2,
          justifyContent: "center",
          alignContent: "center",
          paddingVertical: 10,
        }}
        onPress={onPress}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 20,
            fontFamily: "semi-bold",
            textAlign: "center",
            lineHeight: 35,
          }}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
