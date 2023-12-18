import { NavigationContainer } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { useStores } from "@/stores";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";

export const RootNavigator = observer(function AppNavigator() {
  const {
    authStore: { isAuthenticated },
  } = useStores();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
});
