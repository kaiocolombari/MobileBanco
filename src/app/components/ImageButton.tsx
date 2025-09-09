import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet, Dimensions, View } from "react-native";

const { width, } = Dimensions.get("window");

type Props = {
  image: any;
  label: string;
  onPress?: () => void;
};

export default function ImageButton({ image, label, onPress }: Props) {
  const circleSize = width / 8;
  const imageSize = width / 12; 
  const fontSize = width / 30;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.circle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2 }]}>
        <Image source={image} style={[styles.image, { width: imageSize, height: imageSize }]} />
      </View>
      <Text style={[styles.label, { fontSize }]}>{label}</Text>
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
    backgroundColor: "#E8F1F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    
  },
  image: {
    resizeMode: "contain",
    tintColor: '#1B98E0'
  },
  label: {
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
});
