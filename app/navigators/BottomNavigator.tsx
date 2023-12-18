import { SCREENS } from "@/constants";
import { i88n } from "@/i18n";
import {
  CollectionScreen,
  HomeScreen,
  NotificationScreen,
  SettingScreen,
} from "@/screens";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Icon, Text, theme } from "native-base";

const Tab = createBottomTabNavigator();

export const BottomNavigator = () => {
  const navItems = {
    [SCREENS.HOME]: {
      title: i88n.screens.home,
      inactiveIcon: "home-outline",
      activeIcon: "home",
      component: HomeScreen,
    },
    [SCREENS.COLLECTION]: {
      title: i88n.screens.collection,
      inactiveIcon: "bookmark-outline",
      activeIcon: "bookmark",
      component: CollectionScreen,
    },
    [SCREENS.NOTIFICATIONS]: {
      title: i88n.screens.notifications,
      inactiveIcon: "bell-outline",
      activeIcon: "bell",
      component: NotificationScreen,
    },
    [SCREENS.SETTINGS]: {
      title: i88n.screens.settings,
      inactiveIcon: "cog-outline",
      activeIcon: "cog",
      component: SettingScreen,
    },
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        title: navItems[route.name].title,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          // elevation: 0,
          height: 64,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarInactiveTintColor: theme.colors.coolGray[600],
        tabBarActiveTintColor: theme.colors.primary[600],
        tabBarActiveBackgroundColor: theme.colors.primary[50],
        tabBarLabel: ({ focused, color }) => {
          return (
            <Text
              fontSize="xs"
              color={color}
              style={{
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              {navItems[route.name].title}
            </Text>
          );
        },
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <Icon
              as={MaterialCommunityIcons}
              name={
                focused
                  ? navItems[route.name].activeIcon
                  : navItems[route.name].inactiveIcon
              }
              color={color}
              size={size}
            />
          );
        },
      })}
    >
      {Object.keys(navItems).map((key) => {
        return (
          <Tab.Screen
            key={key}
            name={key}
            component={navItems[key].component}
          />
        );
      })}
    </Tab.Navigator>
  );
};
