import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet, Dimensions, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

const { width, } = Dimensions.get("window");

type Props = {
  image: any;
  label: string;
  onPress?: () => void;
};

export default function ImageButton({ image, label, onPress }: Props) {
  const { theme } = useTheme();
  const circleSize = width / 8;
  const imageSize = width / 12;
  const fontSize = width / 30;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.circle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: theme.imageButtonCircle }]}>
        <Image source={image} style={[styles.image, { width: imageSize, height: imageSize, tintColor: theme.imageTintColor }]} />
      </View>
      <Text style={[styles.label, { fontSize, color: theme.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,

  },
  image: {
    resizeMode: "contain",
  },
  label: {
    fontWeight: "500",
    textAlign: "center",
  },
});
