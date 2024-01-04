import { Fab, Icon, ScrollView, Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from "@/constants";

export const HomeScreen = () => {
  const navigation = useNavigation();

  const handleAddNew = () => {
    // @ts-ignore
    navigation.navigate(SCREENS.CREATE_CLASS);
  };

  return (
    <>
      <ScrollView background="white" p="5">
        <Text>Home</Text>
      </ScrollView>
      <Fab
        renderInPortal={false}
        shadow={2}
        position="absolute"
        bottom="5"
        right="5"
        size="lg"
        icon={<Icon color="white" as={<MaterialIcons name="add" />} />}
        onPress={handleAddNew}
      />
    </>
  );
};
