import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AccountScreen, CreateClassScreen } from "@/screens";
import { SCREENS } from "@/constants";
import { BottomNavigator } from "./BottomNavigator";
import { i88n } from "@/i18n";

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BottomNavigator" component={BottomNavigator} />
      <Stack.Screen
        name={SCREENS.ACCOUNT}
        component={AccountScreen}
        options={{
          headerShown: true,
          headerTitle: i88n.settings.account,
        }}
      />
      <Stack.Screen
        name={SCREENS.CREATE_CLASS}
        component={CreateClassScreen}
        options={{
          headerShown: true,
          headerTitle: i88n.screens.createClass,
        }}
      />
    </Stack.Navigator>
  );
};
