import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

import { SIZES } from "@/constants";

type SkeletonProps = {
  width?: number;
  height?: number;
  borderRadius?: number;
};

export default function Skeleton({
  width = 100,
  height = SIZES.width - 40,
  borderRadius = 8,
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Animated.View
      style={[styles.skeleton, { width, height, borderRadius, opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#e0e0e0",
  },
});
