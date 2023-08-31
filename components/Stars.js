import { VirtualizedList } from "react-native";
import { Entypo } from "@expo/vector-icons";

const Stars = ({ value }) => {
  const DATA = [];
  const getItem = (data, index) => {
    return { id: index, value: value };
  };

  const getItemCount = (data) => {
    return 5;
  };
  const Item = ({ value, i }) => {
    return i + 1 <= value ? (
      <Entypo name="star" size={24} color="#FFB100" />
    ) : (
      <Entypo name="star" size={24} color="#BBBBBB" />
    );
  };

  return (
    <VirtualizedList
      data={DATA}
      horizontal
      initialNumToRender={4}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Item value={item.value} i={item.id} />}
      getItem={getItem}
      getItemCount={getItemCount}
    />
  );
};

export default Stars;
