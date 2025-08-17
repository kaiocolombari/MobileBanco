import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const registerStyles = StyleSheet.create({
  container: {
    backgroundColor: "#1B98E0",
    flex: 1,
  },
  title: {
    fontSize: width * 0.15,
    color: "white",
    textAlign: "center",
    marginTop: height * 0.05,
    fontFamily: "Sanchez_400Regular",
    marginBottom: height * 0.05,
  },
  loginContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: "8%",
    paddingVertical: "6%",
    flexGrow: 1,
  },
  loginTitle: {
    fontSize: width * 0.08,
    color: "black",
    fontFamily: "Roboto_400Regular",
    marginBottom: 5,
  },
  loginSubtitle: {
    fontSize: width * 0.045,
    color: "black",
    fontFamily: "Roboto_400Regular",
    marginBottom: 20,
  },
  stepScrollView: {
    flex: 1,
  },
  loginBackButton: {
    marginTop: 8,
    alignItems: "center",
  },
  loginBackText: {
    color: "blue",
    fontSize: width * 0.04,
  },
});
