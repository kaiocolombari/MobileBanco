import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import ImageButton from "../components/ImageButton";
import Rotas from "../../types/types.route";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/user.png")}
            style={{
              width: 60,
              height: 60,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.25,
              shadowRadius: 3.5,
            }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.hello}>Olá, Gustavo</Text>
          </View>
          <View style={styles.headerIcons}>
            <Ionicons name="help-circle-outline" size={25} color="white" />
            <TouchableOpacity onPress={()=>{router.push(Rotas.CONFIG)}}>
              <Ionicons
                name="settings-outline"
                size={25}
                color="white"
                style={{ marginLeft: 15 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTitle}>Conta</Text>
          <Text style={styles.balanceValue}>R$ 0,00</Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
          >
            <ImageButton image={require("../../assets/pixIcon.png")} label="Pix" onPress={() => { }} />
            <ImageButton image={require("../../assets/barraIcon.png")} label="Pagar" onPress={() => { }} />
            <ImageButton image={require("../../assets/recarga.png")} label="Recarga" onPress={() => { }} />
            <ImageButton image={require("../../assets/depositarIcon.png")} label="Depositar" onPress={() => { }} />
            <ImageButton image={require("../../assets/trans.png")} label="Transferir" onPress={() => { }} />
            <ImageButton image={require("../../assets/Qr_Code.png")} label="QR" onPress={() => { }} />
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.extratoBtn}>
          <Ionicons name="document-text-outline" size={20} color="#008CFF" />
          <Text style={styles.extratoText}>Extratos</Text>
        </TouchableOpacity>

        <View style={styles.cardBox}>
          <Text style={styles.cardTitle}>Cartão de crédito</Text>
          <Text style={styles.cardSubtitle}>
            Peça seu cartão de crédito sem anuidade e tenha mais controle da sua
            vida financeira.
          </Text>
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Pedir Cartão</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ratingBox}>
          <Text style={styles.ratingTitle}>Avalie sua experiência</Text>
          <Text style={styles.ratingSubtitle}>
            O que achou da tela inicial do aplicativo?
          </Text>
          <View style={styles.ratingRow}>
            <RatingItem
              icon="grin-stars"
              label="Incrível"
              selected={selectedRating === "Incrível"}
              onPress={() => setSelectedRating("Incrível")}
            />
            <RatingItem
              icon="smile"
              label="Bom"
              selected={selectedRating === "Bom"}
              onPress={() => setSelectedRating("Bom")}
            />
            <RatingItem
              icon="meh"
              label="Médio"
              selected={selectedRating === "Médio"}
              onPress={() => setSelectedRating("Médio")}
            />
            <RatingItem
              icon="frown"
              label="Ruim"
              selected={selectedRating === "Ruim"}
              onPress={() => setSelectedRating("Ruim")}
            />
            <RatingItem
              icon="sad-tear"
              label="Péssimo"
              selected={selectedRating === "Péssimo"}
              onPress={() => setSelectedRating("Péssimo")}
            />
          </View>
          <TextInput style={styles.input} placeholder="Escreva aqui..." />
          <TouchableOpacity style={styles.rateButton} onPress={() => { }}>
            <Text style={styles.rateButtonText}>Enviar avaliação</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

function RatingItem({
  icon,
  label,
  selected,
  onPress,
}: {
  icon: React.ComponentProps<typeof FontAwesome6>["name"];
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.ratingItem} onPress={onPress}>
      <FontAwesome6
        name={icon}
        size={26}
        color={selected ? "#FFD700" : "#008CFF"}
      />
      <Text
        style={[
          styles.ratingLabel,
          { color: selected ? "#FFD700" : "#333" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function BottomNav() {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity>
        <Ionicons name="person-outline" size={28} color="#008CFF" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="document-text-outline" size={28} color="#008CFF" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="pie-chart-outline" size={28} color="#008CFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
  },
  scrollContent: {
    paddingBottom: 90,
  },

  header: {
    backgroundColor: "#1B98E0",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 18,
  },
  hello: {
    color: "white",
    fontSize: 20,
    fontFamily: "Roboto_500Medium",
  },
  headerIcons: {
    flexDirection: "row",
    position: "absolute",
    right: 15,
  },

  balanceContainer: {
    padding: 20,
  },
  balanceTitle: {
    fontSize: 17,
    fontFamily: "Roboto_400Regular",
    color: "#444",
  },
  balanceValue: {
    fontSize: 22,
    fontFamily: "Roboto_700Bold",
    color: "#0686D0",
    marginTop: 4,
  },

  extratoBtn: {
    backgroundColor: "#E6F4FB",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginHorizontal: 18,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  extratoText: {
    marginLeft: 10,
    color: "#0686D0",
    fontSize: 15,
    fontFamily: "Roboto_500Medium",
  },

  cardBox: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: "Roboto_500Medium",
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    color: "#555",
    marginVertical: 10,
  },
  cardButton: {
    backgroundColor: "#0686D0",
    paddingVertical: 12,
    borderRadius: 23,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    width: 120,
  },
  cardButtonText: {
    color: "white",
    fontFamily: "Roboto_500Medium",
    fontSize: 15,
  },

  rateButton: {
    backgroundColor: "#0686D0",
    paddingVertical: 12,
    borderRadius: 23,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    width: 120,
    alignSelf: "flex-end"
  },
  rateButtonText: {
    color: "white",
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
  },

  ratingBox: {
    marginTop: 25,
    marginHorizontal: 18,
    paddingBottom: 20,
  },
  ratingTitle: {
    fontSize: 17,
    fontFamily: "Roboto_500Medium",
    color: "#222",
  },
  ratingSubtitle: {
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    color: "#555",
    marginVertical: 6,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  ratingItem: {
    alignItems: "center",
    width: width / 6,
  },
  ratingLabel: {
    fontSize: 12,
    marginTop: 3,
    fontFamily: "Roboto_400Regular",
    color: "#333",
  },

  input: {
    borderWidth: 1,
    borderColor: "#1B98E0",
    borderRadius: 10,
    padding: 6,
    marginTop: 5,
    fontFamily: "Roboto_400Regular",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 6,
  },
});
