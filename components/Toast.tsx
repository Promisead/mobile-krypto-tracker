import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  message: string;
  type: "info" | "warning" | "error" | "success";
  duration?: number;
  onHide: () => void;
};

const Toast = ({
  visible,
  message,
  type = "info",
  duration = 2000,
  onHide,
}: Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Fade out after duration
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide && onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const backgroundColors = {
    success: "#4CAF50",
    error: "#F44336",
    warning: "#FFC107",
    info: "#2196F3",
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.toast,
          {
            backgroundColor: backgroundColors[type] || backgroundColors.info,
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  toast: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});
