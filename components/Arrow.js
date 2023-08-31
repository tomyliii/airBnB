import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Arrow = () => {
  const navigation = useNavigation();

  return (
    <Ionicons
      name="arrow-back"
      size={24}
      color="black"
      style={styles.arrow}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );
};

export default Arrow;

const styles = StyleSheet.create({
  arrow: {
    paddingRight: 10,
  },
});
