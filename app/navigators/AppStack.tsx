import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CollectionScreen, HomeScreen, NotificationScreen } from "@/screens";
import { SCREENS } from "@/constants";
import { BottomNavigator } from "./BottomNavigator";

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BottomNavigator" component={BottomNavigator} />
    </Stack.Navigator>
  );
};
