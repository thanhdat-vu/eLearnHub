import { NativeBaseProvider } from "native-base";
import { RootNavigator } from "@/navigators";

export default function App() {
  return (
    <NativeBaseProvider>
      <RootNavigator />
    </NativeBaseProvider>
  );
}
