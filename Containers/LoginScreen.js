import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";

import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function LoginScreen({ setToken, navigation }) {
  const styles = useStyles();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, SetErrorMessage] = useState("");
  const [displayPassword, setDisplaypassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const handleOnClick = async () => {
    if ((mail, password)) {
      setIsLoading(true);
      try {
        response = await axios.post(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
          {
            email: mail,
            password,
          }
        );

        setToken(response.data.token, response.data.id);
        // await AsyncStorage.setItem("id", response.data.id);
        // console.log(JSON.stringify(response, null, 2));
      } catch (error) {
        // console.log(JSON.stringify(error.response, null, 2));
        SetErrorMessage("Une erreur est survenue.");
        setTimeout(() => {
          SetErrorMessage("");
        }, 5000);
      }
      setIsLoading(false);
    } else {
      SetErrorMessage("Veuillez remplir tous les champs.");
      setTimeout(() => {
        SetErrorMessage("");
      }, 5000);
    }
  };
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <View style={{ alignItems: "center", gap: 30 }}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require("../assets/Logo.png")}
          />
          <Text style={{ fontWeight: "bold", color: "grey", fontSize: 20 }}>
            Sign in
          </Text>
        </View>
        <View style={{ gap: 30 }}>
          <TextInput
            placeholder="Email"
            value={mail}
            onChangeText={(text) => {
              setMail(text);
            }}
            style={styles.input}
          />
          <View style={styles.passwordSection}>
            <TextInput
              placeholder="Mot de passe"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
              }}
              secureTextEntry={displayPassword}
            />
            <TouchableOpacity
              onPress={() => {
                setDisplaypassword(!displayPassword);
              }}
            >
              {displayPassword ? (
                <Entypo name="eye" size={24} color="black" />
              ) : (
                <Entypo name="eye-with-line" size={24} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: "center", paddingBottom: 30, gap: 20 }}>
          {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
          <TouchableOpacity
            style={styles.LoginBtn}
            onPress={() => {
              handleOnClick();
            }}
            disabled={isLoading}
          >
            <Text style={{ color: "grey" }}>Se connecter</Text>
          </TouchableOpacity>
          <View>
            <Text>
              Pas de compte ?
              <Text
                onPress={() => {
                  navigation.navigate("SignUp");
                }}
                style={{ justifyContent: "center" }}
              >
                &nbsp; Créer un compte
              </Text>
            </Text>
          </View>
        </View>
      </View>
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="red" />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
}
const useStyles = () => {
  const { height, width } = useWindowDimensions();

  const Styles = StyleSheet.create({
    container: { marginTop: Constants.statusBarHeight },
    body: {
      height: height,
      width: width,
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    logo: { width: 150, height: 150 },

    input: {
      width: width - 100,
      borderBottomWidth: 1,
      borderBottomColor: "red",
    },
    passwordSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: width - 100,
      borderBottomWidth: 1,
      borderBottomColor: "red",
    },
    LoginBtn: {
      height: 50,
      paddingHorizontal: 50,
      justifyContent: "center",
      alignItems: "center",
      borderColor: "red",
      borderRadius: 25,
      borderWidth: 3,
    },
    loading: {
      position: "absolute",
      height: height,
      width: width,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      opacity: 0.5,
    },
  });
  return Styles;
};
