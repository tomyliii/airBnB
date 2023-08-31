import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import Swiper from "react-native-swiper";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import Stars from "../components/Stars";
export default function RoomScreen({ navigation, route }) {
  const [room, setRoom] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [fullDescription, setFullDescription] = useState(false);
  const [errorMessage, SetErrorMessage] = useState("");

  useEffect(() => {
    try {
      (async () => {
        const fetchData = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${route.params.id}`
        );
        // console.log(
        //   "fetchData-----------------------------",
        //   JSON.stringify(fetchData.data, null, 2)
        // );

        setRoom(fetchData.data);
        setIsReady(true);
      })();
    } catch (error) {
      SetErrorMessage("Une erreur est survenue.");
      setIsReady(true);
      console.log(error);
    }
  }, []);

  const displayImages = (value) => {
    const images = [];

    for (let i = 0; i < value.length; i++) {
      images.push(
        <Image
          source={{ uri: value[i].url }}
          style={{ flex: 1 }}
          key={i}
        ></Image>
      );
    }
    return images;
  };
  // console.log(JSON.stringify(room, null, 2));
  return (
    isReady &&
    (errorMessage ? (
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
      <ScrollView contentContainerStyle={{ gap: 20 }}>
        <View>
          <View style={{ position: "relative" }}>
            <Swiper
              showsButtons={true}
              style={{ height: 180 }}
              dotColor="white"
              activeDotColor="red"
              nextButtonColor="red"
            >
              {displayImages(room.photos)}
            </Swiper>

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
                {room.price} €
              </Text>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 10, gap: 15 }}>
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
                {room.title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <View>
                  <Stars value={room.ratingValue} />
                </View>
                <Text style={{ color: "#BBBBBB" }}>{room.reviews} reviews</Text>
              </View>
            </View>
            <View>
              <Image
                style={{ width: 60, height: 60, borderRadius: 30 }}
                source={{ uri: room.user.account.photo.url }}
              ></Image>
            </View>
          </View>
          <View>
            <Text numberOfLines={fullDescription ? 0 : 3} ellipsizeMode="tail">
              {room.description}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setFullDescription(!fullDescription);
              }}
            >
              <Text>
                Show more&nbsp;
                {fullDescription ? (
                  <AntDesign name="caretup" size={14} color="#BBBBBB" />
                ) : (
                  <AntDesign name="caretdown" size={14} color="#BBBBBB" />
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <MapView
          style={{ width: "100%", height: 250 }}
          initialRegion={{
            latitude: 48.856614,
            longitude: 2.3522219,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
          showsUserLocation={true}
        >
          <Marker
            coordinate={{
              latitude: room.location[1],
              longitude: room.location[0],
            }}
            title={room.title}
          ></Marker>
        </MapView>
      </ScrollView>
    ))
  );
}
