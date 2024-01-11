import {
  Pressable,
  Column,
  Fab,
  Heading,
  Icon,
  ScrollView,
  Text,
  Center,
  Spinner,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from "@/constants";
import { useStores } from "@/stores";
import { useEffect, useState } from "react";
import { classService } from "@/services/class.service";
import { Class } from "@/models/Class";
import { i88n } from "@/i18n";
import { userService } from "@/services/user.service";
import { format } from "date-fns";
import { convertDateFormat } from "@/utils/dateTime";

export const HomeScreen = () => {
  const { authStore } = useStores();

  const navigation = useNavigation();

  const handleAddNew = () => {
    // @ts-ignore
    navigation.navigate(SCREENS.CREATE_CLASS);
  };

  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([] as Class[]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      try {
        classService
          .getClassByRole(
            authStore.user?.id as string,
            authStore.user?.role as string
          )
          .then((res) => {
            setClasses(res as Class[]);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <ScrollView background="white">
        <Column p="5" space="4">
          <Heading fontSize="md" fontWeight="normal">
            {i88n.home.classList}
          </Heading>
          <Column space="4">
            {loading ? (
              <Center>
                <Spinner />
              </Center>
            ) : classes.length ? (
              classes.map((classInfo) => (
                <ClassCard key={classInfo.id} classInfo={classInfo} />
              ))
            ) : (
              <Text color="coolGray.500" fontStyle="italic">
                {i88n.home.noClass}
              </Text>
            )}
          </Column>
        </Column>
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

interface ClassCardProps {
  classInfo: Class;
}

export const ClassCard = ({ classInfo }: ClassCardProps) => {
  const navigation = useNavigation();

  const [teachers, setTeachers] = useState<string[]>([]);
  useEffect(() => {
    userService.getUserByIds(classInfo.teacherIds as string[]).then((res) => {
      if (res) {
        setTeachers(res.map((user) => user.fullName));
      }
    });
  }, []);

  const getNextClassTime = () => {
    const dayOfWeek = new Date(
      convertDateFormat(classInfo.startDate as string)
    ).getDay();
    const today = new Date().getDay();
    const diff = (dayOfWeek - today + 7) % 7;
    const nextClassDate = new Date();
    nextClassDate.setDate(nextClassDate.getDate() + diff);
    return `${
      i88n.datetime.daysOfWeek[
        dayOfWeek as keyof typeof i88n.datetime.daysOfWeek
      ]
    } ${
      diff === 0
        ? `(${i88n.datetime.today})`
        : diff === 1
        ? `(${i88n.datetime.tomorrow})`
        : ""
    }, ${format(nextClassDate, "dd/MM/yyyy")}`;
  };

  return (
    <Pressable
      bg="white"
      onPress={() => {
        // @ts-ignore
        navigation.navigate(SCREENS.CLASS_DETAILS, {
          classInfo,
        });
      }}
      _pressed={{
        bg: "gray.100",
        shadow: "0",
      }}
      shadow="2"
      rounded="lg"
    >
      <Column p="5" space="2">
        <Heading size="sm">{classInfo.name}</Heading>
        <Text>{teachers.join(", ")}</Text>
        <Text>{getNextClassTime()}</Text>
        <Text>
          {classInfo.startTime} - {classInfo.endTime}
        </Text>
      </Column>
    </Pressable>
  );
};
