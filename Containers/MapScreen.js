import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

export default function MapScreen({ navigation, route }) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [coords, setCoords] = useState({
    latitude: 48.856614,
    longitude: 2.3522219,
  });
  const [roomsList, setRoomsList] = useState([]);
  const [errorMessage, SetErrorMessage] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let latitude = "";
      let longitude = "";
      if (status === "granted") {
        let location = await Location.getLastKnownPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;
        setCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        try {
          const fetchData = await axios.get(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${latitude}&longitude=${longitude}`
          );
          // console.log(JSON.stringify(fetchData.data, null, 2));
          setRoomsList([...fetchData.data]);
          setIsLoading(false);
        } catch (error) {
          SetErrorMessage("Une erreur est survenue.");
          console.log(error);
          setIsLoading(false);
        }
      } else {
        alert("Accès à la géolocalisation non autorisé.");
        try {
          const fetchData = await axios.get(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${coords.latitude}&longitude=${coords.longitude}`
          );

          // console.log(JSON.stringify(fetchData.data, null, 2));
          setRoomsList([...fetchData.data]);
          setError(true);
          setIsLoading(false);
        } catch (error) {}
      }
    })();
  }, []);

  // const markers = (value) => {
  //   const markersArray = [];
  //   value.forEach((room) => {
  //     markersArray.push(
  //       <Marker
  //         key={room._id}
  //         coordinate={{
  //           latitude: room.location[1],
  //           longitude: room.location[0],
  //         }}
  //         title={room.title}
  //         onPress={() => {
  //           navigation.navigate("RoomMap", { id: room._id });
  //         }}
  //       ></Marker>
  //     );
  //   });
  //   return markersArray;
  // };

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
      {error && (
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            paddingVertical: 10,
          }}
        >
          Vous avez refusé la géolocalisation.Pour l'activer, rendez-vous dans
          vos paramètres.
        </Text>
      )}
      <MapView
        style={{ width: "100%", height: "100%" }}
        initialRegion={{
          latitude: coords ? coords.latitude : 48.856614,
          longitude: coords ? coords.longitude : 2.3522219,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation={true}
      >
        {roomsList.map((room) => {
          return (
            <Marker
              key={room._id}
              coordinate={{
                latitude: room.location[1],
                longitude: room.location[0],
              }}
              title={room.title}
              onPress={() => {
                navigation.navigate("RoomMap", { id: room._id });
              }}
            ></Marker>
          );
        })}
        {/* {markers(roomsList)} */}
      </MapView>
    </View>
  );
}
