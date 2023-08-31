import { ActivityIndicator, StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import HomeScreen from "./Containers/HomeScreen";
import RoomScreen from "./Containers/RoomScreen";
import SingUpScreen from "./Containers/SingUpScreen";
import LoginScreen from "./Containers/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Arrow from "./components/Arrow";
import MapScreen from "./Containers/MapScreen";
import ProfileScreen from "./Containers/ProfileScreen";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const setToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      await AsyncStorage.removeItem("userToken");
    }
    setUserToken(token);
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      setUserToken(userToken);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken === null ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" options={{ title: "Se connecter" }}>
            {(props) => <LoginScreen {...props} setToken={setToken} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp" option={{ title: "S'inscrir" }}>
            {(props) => <SingUpScreen {...props} setToken={setToken} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "red",
            tabBarInactiveTintColor: "black",
          }}
        >
          <Tab.Screen
            name="TabHome"
            options={{
              tabBarLabel: "home",
              tabBarIcon: ({ color, size }) => {
                return <Ionicons name="home" size={size} color={color} />;
              },
              headerShown: false,
            }}
          >
            {() => (
              <Stack.Navigator
                screenOptions={{
                  headerTitle: () => {
                    return (
                      <View
                        style={{
                          height: "150%",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Image
                          style={{
                            width: 30,
                            height: 35,
                            resizeMode: "contain",
                          }}
                          source={require("./assets/Logo.png")}
                        />
                      </View>
                    );
                  },

                  headerTitleAlign: "center",
                }}
              >
                <Stack.Screen
                  name="Home"
                  options={{
                    headerLeft: ({ canGoBack }) => {
                      return canGoBack ? <Arrow /> : null;
                    },
                  }}
                >
                  {(props) => (
                    <HomeScreen
                      {...props}
                      Token={userToken}
                      setToken={setToken}
                      setIsLoading={setIsLoading}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen
                  name="Room"
                  options={{
                    headerLeft: (props) => {
                      return <Arrow />;
                    },
                  }}
                >
                  {(props) => (
                    <RoomScreen
                      {...props}
                      userToken={userToken}
                      setToken={setToken}
                      setIsLoading={setIsLoading}
                    />
                  )}
                </Stack.Screen>
              </Stack.Navigator>
            )}
          </Tab.Screen>
          <Tab.Screen
            name="TabMap"
            options={{
              tabBarLabel: "Arround me",
              tabBarIcon: ({ color, size }) => {
                return (
                  <Ionicons name="location-outline" size={size} color={color} />
                );
              },
            }}
          >
            {() => (
              <Stack.Navigator
                screenOptions={{
                  headerTitle: () => {
                    return (
                      <View
                        style={{
                          height: "150%",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Image
                          style={{
                            width: 30,
                            height: 35,
                            resizeMode: "contain",
                          }}
                          source={require("./assets/Logo.png")}
                        />
                      </View>
                    );
                  },

                  headerTitleAlign: "center",
                }}
              >
                <Stack.Screen
                  name="Map"
                  options={{
                    headerLeft: ({ canGoBack }) => {
                      return canGoBack ? <Arrow /> : null;
                    },
                  }}
                >
                  {(props) => <MapScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen
                  name="RoomMap"
                  options={{
                    headerLeft: (props) => {
                      return <Arrow />;
                    },
                  }}
                >
                  {(props) => <RoomScreen {...props} />}
                </Stack.Screen>
              </Stack.Navigator>
            )}
          </Tab.Screen>
          <Tab.Screen
            name="TabProfile"
            options={{
              tabBarLabel: "My profile",
              tabBarIcon: ({ color, size }) => {
                return (
                  <Ionicons name="person-outline" size={size} color={color} />
                );
              },
              headerShown: true,
              headerTitle: () => {
                return (
                  <View
                    style={{
                      height: "95%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Image
                      style={{
                        width: 30,
                        height: 35,
                        resizeMode: "contain",
                      }}
                      source={require("./assets/Logo.png")}
                    />
                  </View>
                );
              },

              headerTitleAlign: "center",
            }}
          >
            {(props) => (
              <ProfileScreen
                {...props}
                setToken={setToken}
                userToken={userToken}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
