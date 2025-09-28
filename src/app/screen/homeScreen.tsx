import React, { use, useEffect, useState } from "react";
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
import { fetchUser } from "../api/user";
import { fetchUserMock } from "../api/user";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { theme } = useTheme();
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [ratingText, setRatingText] = useState("");
  const [nome, setNome] = useState("");
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

  type Avaliacao = {
    user: string;
    rating: string;
    ratingReview: string;
  };

  const handleRatingPress = () => {
    if (selectedRating !== null && ratingText !== "") {
      setAvaliacoes((prev) => [
        ...prev,
        {
          user: nome,
          rating: selectedRating,
          ratingReview: ratingText,
        },
      ]);

      setSelectedRating(null);
      setRatingText("");
    }
  };
  const testTransferencia = (amount: number) => {
    if (amount <= saldo) {
      setSaldo(saldo - amount);
    }
  }

  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchUserMock();
      if (data && data.usuario) {
        setNome(data.usuario.full_name);
        setSaldo(data.conta_bancaria.saldo);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { backgroundColor: theme.header }]}>
          <Image
            source={require("../../assets/avatar.png")}
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
            <Text style={[styles.hello, { color: '#FFFFFF' }]}>Olá, {nome}</Text>
          </View>
          <View style={styles.headerIcons}>
            <Ionicons name="help-circle-outline" size={25} color="white" />
            <TouchableOpacity onPress={() => { router.push(Rotas.CONFIG) }}>
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
          <Text style={[styles.balanceTitle, { color: theme.textSecondary }]}>Conta</Text>
          <Text style={[styles.balanceValue, { color: theme.imageTintColor }]}>R$ {saldo.toFixed(2)}</Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
          >
            <ImageButton image={require("../../assets/pixIcon.png")} label="Pix" onPress={() => { testTransferencia(Math.random() * 100) }} />
            <ImageButton image={require("../../assets/barraIcon.png")} label="Boleto" onPress={() => { }} />
            <ImageButton image={require("../../assets/recarga.png")} label="Recarga" onPress={() => { router.push(Rotas.RECARGA) }} />
            <ImageButton image={require("../../assets/emprestimo.png")} label="Emprestimo" onPress={() => { router.push(Rotas.EMPRESTIMO) }} />
            <ImageButton image={require("../../assets/Qr_Code.png")} label="QR" onPress={() => { }} />
            <ImageButton image={require("../../assets/cofrinho.png")} label="Cofrinho" onPress={() => { router.push(Rotas.COFRINHO) }} />
          </ScrollView>
        </View>

        <TouchableOpacity style={[styles.extratoBtn, { backgroundColor: theme.card }]} onPress={() => router.push(Rotas.EXTRATO)}>
          <Ionicons name="document-text-outline" size={20} color={theme.imageTintColor} />
          <Text style={[styles.extratoText, { color: theme.imageTintColor }]}>Extratos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.extratoBtn, { backgroundColor: theme.card }]} onPress={() => router.push(Rotas.DASHBOARD)}>
          <Ionicons name="pie-chart-outline" size={20} color={theme.imageTintColor} />
          <Text style={[styles.extratoText, { color: theme.imageTintColor }]}>DashBoard</Text>
        </TouchableOpacity>

        <View style={[styles.cardBox, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Cofrinho</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            Comece hoje mesmo! Faça do seu cofrinho digital o seu melhor aliado para conquistar o futuro que você merece.
          </Text>
          <TouchableOpacity style={[styles.cardButton, { backgroundColor: theme.button }]} onPress={() => { router.push(Rotas.COFRINHO) }}>
            <Text style={[styles.cardButtonText, { color: "#FFFFFF" }]}>Comece agora</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ratingBox}>
          <Text style={[styles.ratingTitle, { color: theme.text }]}>Avalie sua experiência</Text>
          <Text style={[styles.ratingSubtitle, { color: theme.textSecondary }]}>
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
          <TextInput style={[styles.input, { borderColor: theme.primary, color: theme.text }]} placeholder="Escreva aqui..." placeholderTextColor={theme.textSecondary} value={ratingText} onChangeText={setRatingText} />
          <TouchableOpacity style={[styles.rateButton, { backgroundColor: theme.button }]} onPress={() => { handleRatingPress() }}>
            <Text style={[styles.rateButtonText, { color: "#FFFFFF" }]}>Enviar avaliação</Text>
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
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={styles.ratingItem} onPress={onPress}>
      <FontAwesome6
        name={icon}
        size={26}
        color={selected ? "#FFD700" : theme.primary}
      />
      <Text
        style={[
          styles.ratingLabel,
          { color: selected ? "#FFD700" : theme.text },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function BottomNav() {
  const { theme } = useTheme();
  return (
    <View style={[styles.bottomNav, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <TouchableOpacity>
        <Ionicons name="person-outline" size={28} color={theme.imageTintColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { router.push(Rotas.EXTRATO) }}>
        <Ionicons name="document-text-outline" size={28} color={theme.imageTintColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { router.push(Rotas.DASHBOARD) }}>
        <Ionicons name="pie-chart-outline" size={28} color={theme.imageTintColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },

  header: {
    alignItems: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 18,
  },
  cofreImage: {
    width: width * 0.3,
    height: width * 0.3,
    alignSelf: "center",
    tintColor: "#1B98E0",
    resizeMode: "contain",
    marginBottom: 10,
  },
  hello: {
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
  },
  balanceValue: {
    fontSize: 22,
    fontFamily: "Roboto_700Bold",
    marginTop: 4,
  },

  extratoBtn: {
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
    fontSize: 15,
    fontFamily: "Roboto_500Medium",
  },

  cardBox: {
    marginTop: 20,
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
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    marginVertical: 10,
  },
  cardButton: {
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
    fontFamily: "Roboto_500Medium",
    fontSize: 15,
  },

  rateButton: {
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
  },
  ratingSubtitle: {
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
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
  },

  input: {
    borderWidth: 1,
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
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 6,
  },
});
