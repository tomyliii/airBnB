import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import Stars from "../components/Stars";
import axios from "axios";
import { useEffect, useState } from "react";
export default function HomeScreen({ navigation }) {
  const [listOffers, setListOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, SetErrorMessage] = useState("");
  const styles = useStyle();

  useEffect(() => {
    try {
      (async () => {
        const fetchData = await axios.get(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
        );

        setListOffers([...fetchData.data]);
        setIsLoading(false);
      })();
    } catch (error) {
      SetErrorMessage("Une erreur est survenue.");
      isLoading(false);
      console.log(error);
    }
  }, []);

  return isLoading === true ? (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        height: "100%",
      }}
    >
      <ActivityIndicator size="large" color="red" />
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
    <View>
      <FlatList
        contentContainerStyle={{
          alignContent: "center",
          paddingHorizontal: 20,
          paddingTop: 5,
        }}
        data={listOffers}
        keyExtractor={(item) => String(item._id)}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{
                width: "100%",
                borderBottomWidth: 1,
                borderBottomColor: "#BBBBBB",
                paddingBottom: 15,
              }}
              onPress={() => {
                navigation.navigate("Room", { id: item._id });
              }}
            >
              <View gap={20}>
                <View style={{ position: "relative" }}>
                  <Image
                    source={{ uri: item.photos[0].url }}
                    style={{ width: "100%", height: 180 }}
                  ></Image>
                  <View
                    style={{
                      position: "absolute",
                      bottom: 10,
                      backgroundColor: "black",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 90,
                      height: 45,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 17,
                      }}
                    >
                      {item.price} €
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View gap={15} width="80%">
                    <Text
                      numberOfLines={1}
                      style={{
                        fontWeight: "bold",
                        fontSize: 17,
                        width: "100%",
                      }}
                      ellipsizeMode="tail"
                    >
                      {item.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <View>
                        <Stars value={item.ratingValue} />
                      </View>
                      <Text style={{ color: "#BBBBBB" }}>
                        {item.reviews} reviews
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Image
                      style={{ width: 60, height: 60, borderRadius: 30 }}
                      source={{ uri: item.user.account.photo.url }}
                    ></Image>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const useStyle = () => {
  const { height, width } = useWindowDimensions();

  const styles = StyleSheet.create({});
};
