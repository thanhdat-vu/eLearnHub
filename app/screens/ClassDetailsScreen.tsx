import { i88n } from "@/i18n";
import { Class } from "@/models/Class";
import { userService } from "@/services/user.service";
import { Column, ScrollView, Text, theme } from "native-base";
import { useEffect, useState } from "react";
import { TabView, TabBar } from "react-native-tab-view";

const FirstRoute = ({ route }: any) => {
  const classInfo: Class = route.params.classInfo;
  const [teachers, setTeachers] = useState<string[]>([]);
  const [assistants, setAssistants] = useState<string[]>([]);
  useEffect(() => {
    userService.getUserByIds(classInfo.teacherIds as string[]).then((res) => {
      if (res) {
        setTeachers(res.map((user) => user.fullName));
      }
    });
    userService.getUserByIds(classInfo.assistantIds as string[]).then((res) => {
      if (res) {
        setAssistants(res.map((user) => user.fullName));
      }
    });
  }, []);

  return (
    <ScrollView background="white">
      <Column p="5" space="2">
        <Text color="coolGray.500">{i88n.manageClass.name}</Text>
        <Text>{classInfo.name}</Text>
        <Text color="coolGray.500">{i88n.manageClass.description}</Text>
        <Text>{classInfo.description?.replaceAll("<br/>", "\n")}</Text>
        <Text color="coolGray.500">{i88n.manageClass.startDate}</Text>
        <Text>{classInfo.startDate}</Text>
        <Text color="coolGray.500">{i88n.manageClass.endDate}</Text>
        <Text>{classInfo.endDate}</Text>
        <Text color="coolGray.500">{i88n.manageClass.startTime}</Text>
        <Text>{classInfo.startTime}</Text>
        <Text color="coolGray.500">{i88n.manageClass.endTime}</Text>
        <Text>{classInfo.endTime}</Text>
        <Text color="coolGray.500">{i88n.manageClass.teacher}</Text>
        {teachers.map((teacher, i) => (
          <Text key={i}>{teacher}</Text>
        ))}
        <Text color="coolGray.500">{i88n.manageClass.assistant}</Text>
        {assistants.map((assistant, i) => (
          <Text key={i}>{assistant}</Text>
        ))}
      </Column>
    </ScrollView>
  );
};

const SecondRoute = () => (
  <ScrollView>
    <Text>SecondRoute</Text>
  </ScrollView>
);

export const ThirdRoute = () => (
  <ScrollView>
    <Text>ThirdRoute</Text>
  </ScrollView>
);

export const FourthRoute = () => (
  <ScrollView>
    <Text>FourthRoute</Text>
  </ScrollView>
);

const renderScene = ({ route }: any) => {
  switch (route.key) {
    case "first":
      return <FirstRoute route={route} />;
    case "second":
      return <SecondRoute />;
    case "third":
      return <ThirdRoute />;
    case "fourth":
      return <FourthRoute />;
    default:
      return null;
  }
};

export const ClassDetailsScreen = ({ route }: any) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "first",
      title: i88n.screens.details,
    },
    {
      key: "second",
      title: i88n.screens.members,
    },
    {
      key: "third",
      title: i88n.screens.resources,
    },
    {
      key: "fourth",
      title: i88n.screens.assignments,
    },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={(props) =>
        renderScene({
          ...props,
          route: { ...props.route, params: route.params },
        })
      }
      onIndexChange={setIndex}
      style={{
        elevation: 0,
      }}
      renderTabBar={(props) => (
        <TabBar
          inactiveColor={theme.colors.coolGray[800]}
          activeColor={theme.colors.primary[600]}
          pressColor={theme.colors.primary[100]}
          tabStyle={{
            paddingVertical: 8,
            paddingHorizontal: 0,
          }}
          style={{
            elevation: 0,
            backgroundColor: "white",
          }}
          labelStyle={{
            fontSize: 12,
            textTransform: "capitalize",
          }}
          indicatorStyle={{
            backgroundColor: theme.colors.primary[600],
          }}
          {...props}
        />
      )}
    />
  );
};
