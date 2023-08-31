import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  TextInput,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function ProfileScreen({ userToken, setToken }) {
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, SetErrorMessage] = useState("");
  const styles = useStyle();
  useEffect(() => {
    try {
      (async () => {
        const id = await AsyncStorage.getItem("id");
        const fetchData = await axios.get(
          ` https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${id}`,
          { headers: { Authorization: "Bearer " + userToken } }
        );
        // console.log(JSON.stringify(fetchData, null, 2));
        setUser({ ...fetchData.data });
      })();

      setIsReady(true);
    } catch (error) {
      SetErrorMessage("Une erreur est survenue.");
      setIsReady(true);
      console.log(error);
    }
  }, []);
  const getPermissionAndGetPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (result.canceled === true) {
        alert("Pas de photo séléctionnée.");
      } else {
        setSelectedPicture(result.assets[0].uri);
      }
    } else {
      alert("Permision refusée.");
    }
  };
  const getPermissionAndTakePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (result.canceled === true) {
        alert("Pas de photo sélectionnée.");
      } else {
        setSelectedPicture(result.assets[0].uri);
      }
    } else {
      alert("Permission refusée.");
    }
  };
  const update = async () => {
    setIsReady(false);
    try {
      if (selectedPicture) {
        const tab = selectedPicture.split(".");
        console.log(tab.at(-1));
        const formData = new FormData();
        formData.append("photo", {
          uri: selectedPicture,
          name: `My-Avatar.${tab.at(-1)}`,
          type: `image/${tab.at(-1)}`,
        });

        const response = await axios.put(
          " https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture",
          formData,
          {
            headers: {
              Authorization: "Bearer " + userToken,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSelectedPicture(null);
        setUser({ ...response.data });
        // console.log("photo-----------", JSON.stringify(response, null, 2));
        setIsReady(true);
      }
      if (username || email || description) {
        const response = await axios.put(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update",
          {
            email: email,
            username: username,
            description: description,
          },
          { headers: { Authorization: "Bearer " + userToken } }
        );
        // console.log("donnees-----------", JSON.stringify(response, null, 2));
        setEmail("");
        setDescription("");
        setUsername("");
        setUser({ ...response.data });
        setIsReady(true);
      }
    } catch (error) {
      setIsReady(true);
      alert("Une erreur est survenue.");
      console.log(error);
    }
  };
  const ShowPicture = () => {
    if (selectedPicture) {
      return (
        <Image source={{ uri: selectedPicture }} style={styles.img}></Image>
      );
    } else if (user.photo) {
      return (
        <Image source={{ uri: user.photo.url }} style={styles.img}></Image>
      );
    } else {
      return (
        <View style={styles.img}>
          <Text>
            <Ionicons name="person-sharp" size={24} color="black" />
          </Text>
        </View>
      );
    }
  };

  return !isReady ? (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        height: "100%",
      }}
    >
      <ActivityIndicator size={"large"}></ActivityIndicator>
    </View>
  ) : errorMessage ? (
    <View
      style={{
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
      }}
    >
      <Text>{errorMessage}</Text>
    </View>
  ) : (
    <KeyboardAwareScrollView
      contentContainerStyle={{ alignItems: "center", paddingTop: 20, gap: 50 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        {ShowPicture()}
        <View style={{ gap: 20 }}>
          <TouchableOpacity
            onPress={() => {
              getPermissionAndGetPicture();
            }}
          >
            <Ionicons name="ios-images" size={30} color="#717171" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              getPermissionAndTakePicture();
            }}
          >
            <Ionicons name="ios-camera" size={30} color="#717171" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ width: "80%", gap: 30, alignItems: "center" }}>
        <TextInput
          style={styles.input}
          placeholder={user.email}
          value={email}
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          style={styles.input}
          placeholder={user.username}
          value={username}
          onChangeText={(text) => {
            setUsername(text);
          }}
        ></TextInput>
        <TextInput
          multiline
          textAlignVertical="top"
          placeholder={user.description}
          value={description}
          onChangeText={(text) => {
            setDescription(text);
          }}
          style={{
            width: "100%",
            borderColor: "red",
            borderWidth: 1,
            height: 100,
            padding: 10,
          }}
        ></TextInput>
      </View>
      <View style={{ gap: 20 }}>
        <TouchableOpacity
          onPress={() => {
            update();
          }}
          style={styles.btn}
        >
          <Text>Mise à jour</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setToken(null);
          }}
          style={[styles.btn, styles.btnDisconect]}
        >
          <Text>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const useStyle = () => {
  const { width, height } = useWindowDimensions();

  const styles = StyleSheet.create({
    img: {
      height: 150,
      width: 150,
      borderRadius: 75,
      borderColor: "red",
      borderWidth: 1,
    },
    input: { width: "100%", borderBottomColor: "red", borderBottomWidth: 1 },
    btn: {
      height: 50,
      paddingHorizontal: 50,
      justifyContent: "center",
      alignItems: "center",
      borderColor: "red",
      borderRadius: 25,
      borderWidth: 3,
    },
    btnDisconect: { backgroundColor: "#E7E7E7" },
  });
  return styles;
};
