import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";

export default function Loader() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#3b80e0ff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator color="#2e6fef" size="large" />
    </View>
  );
}

const styles = StyleSheet.create({});
