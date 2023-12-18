import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ResetPasswordScreen, SignInScreen, SignUpScreen } from "@/screens";
import { SCREENS } from "@/constants";

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SCREENS.SIGN_IN}
    >
      <Stack.Screen name={SCREENS.SIGN_IN} component={SignInScreen} />
      <Stack.Screen name={SCREENS.SIGN_UP} component={SignUpScreen} />
      <Stack.Screen
        name={SCREENS.RESET_PASSWORD}
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  );
};
