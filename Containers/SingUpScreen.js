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
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
export default function SingUpScreen({ setToken, navigation }) {
  const styles = useStyles();
  const [mail, setMail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, SetErrorMessage] = useState("");
  const [displayPassword, setDisplaypassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const handleOnClick = async () => {
    if ((mail, password, description, confirmPassword, username)) {
      setIsLoading(true);
      if (confirmPassword === password) {
        try {
          response = await axios.post(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up",
            {
              email: mail,
              username,
              description,
              password,
            }
          );
          // await AsyncStorage.setItem("id", response.data.id);
          setToken(response.data.token, response.data.id);
          // console.log(JSON.stringify(response, null, 2));
        } catch (error) {
          console.log(error);
          SetErrorMessage(error.response.data.error);
          setTimeout(() => {
            SetErrorMessage("");
          }, 5000);
        }
      } else {
        SetErrorMessage("Les mots de passe doivent être identiques.");
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
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.body}>
        <View style={{ alignItems: "center", gap: 30 }}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require("../assets/Logo.png")}
          />
          <Text style={{ fontWeight: "bold", color: "grey", fontSize: 20 }}>
            Sign up
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
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
            }}
            style={styles.input}
          />
          <TextInput
            multiline
            placeholder="Déscription"
            value={description}
            textAlignVertical="top"
            onChangeText={(text) => {
              setDescription(text);
            }}
            style={styles.description}
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
          <View style={styles.passwordSection}>
            <TextInput
              placeholder="Confirmez le mot de passe"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
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
            <Text style={{ color: "grey" }}>S'inscrir</Text>
          </TouchableOpacity>
          <View>
            <Text>
              Déjà un compte ?
              <Text
                onPress={() => {
                  navigation.goBack();
                }}
                style={{ justifyContent: "center" }}
              >
                &nbsp; Connectez-vous
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
    container: {
      marginTop: Constants.statusBarHeight,
    },
    body: {
      width: width,
      justifyContent: "space-evenly",
      alignItems: "center",
      gap: 30,
      paddingVertical: 30,
    },
    logo: { width: 150, height: 150 },

    input: {
      width: width - 100,
      borderBottomWidth: 1,
      borderBottomColor: "red",
    },
    description: {
      padding: 10,
      height: width - 100,
      width: width - 100,
      borderWidth: 1,
      borderColor: "red",
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
