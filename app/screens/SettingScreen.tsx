import { Box, FlatList, Icon, Row, Text, Pressable } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { i88n } from "@/i18n";
import { authService } from "@/services/auth.service";
import { useStores } from "@/stores";

export const SettingScreen = () => {
  const { authStore } = useStores();

  const handleSignOut = () => {
    authService.signOut(authStore);
  };

  const settingOptions = [
    {
      id: 1,
      iconName: "logout",
      text: i88n.settings.signOut,
      onPress: handleSignOut,
    },
  ];

  return (
    <FlatList
      background="white"
      data={settingOptions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable
          onPress={item.onPress}
          _pressed={{
            backgroundColor: "gray.100",
          }}
        >
          <Row
            borderBottomWidth={1}
            borderBottomColor="gray.200"
            alignItems="center"
            justifyContent="space-between"
            px="5"
            py="4"
          >
            <Row alignItems="center" space="4">
              <Icon
                as={MaterialCommunityIcons}
                name={item.iconName}
                size="md"
                color="coolGray.800"
              />
              <Text>{item.text}</Text>
            </Row>
            <Icon
              as={MaterialCommunityIcons}
              name="chevron-right"
              size="md"
              color="coolGray.800"
            />
          </Row>
        </Pressable>
      )}
    />
  );
};
