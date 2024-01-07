import { i88n } from "@/i18n";
import { Class } from "@/models/Class";
import { userService } from "@/services/user.service";
import {
  Box,
  Button,
  Column,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  Row,
  ScrollView,
  Text,
  WarningOutlineIcon,
  theme,
  useToast,
} from "native-base";
import { useEffect, useState } from "react";
import { TabView, TabBar } from "react-native-tab-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useStores } from "@/stores";
import { ROLES } from "@/constants";
import { ResourceItem } from "@/models/ResourceItem";
import { validation } from "@/utils/validation";
import { resourceService } from "@/services/resource.service";
import { ResourceItemBlock } from "@/components";

const FirstRoute = ({ route }: any) => {
  const classInfo: Class = route.params.classInfo;
  const [teachers, setTeachers] = useState<string[]>([]);
  const [assistants, setAssistants] = useState<string[]>([]);
  useEffect(() => {
    if (classInfo.teacherIds?.length) {
      userService.getUserByIds(classInfo.teacherIds as string[]).then((res) => {
        if (res) {
          setTeachers(res.map((user) => user.fullName));
        }
      });
    }
    if (classInfo.assistantIds?.length) {
      userService
        .getUserByIds(classInfo.assistantIds as string[])
        .then((res) => {
          if (res) {
            setAssistants(res.map((user) => user.fullName));
          }
        });
    }
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
  <ScrollView background="white">
    <Column p="5" space="2"></Column>
  </ScrollView>
);

interface ResourceFormError extends Partial<ResourceItem> {}

export const ThirdRoute = ({ route }: any) => {
  const classInfo: Class = route.params.classInfo;

  const { authStore } = useStores();
  const [modalVisible, setModalVisible] = useState(false);
  const [resourceItem, setResourceItem] = useState({} as ResourceItem);
  const [formError, setFormError] = useState({} as ResourceFormError);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [classResources, setClassResources] = useState<ResourceItem[]>([]);
  useEffect(() => {
    resourceService.getResourceByClassId(classInfo.id as string).then((res) => {
      setClassResources(res as ResourceItem[]);
    });
  }, []);

  const addResourceItem = async () => {
    const currentFormError: ResourceFormError = {
      name: validation.checkRequired(resourceItem.name),
      url: validation.checkRequired(resourceItem.url),
      description: "",
    };
    for (const key in currentFormError) {
      if (currentFormError[key as keyof ResourceFormError]) {
        setFormError(currentFormError);
        return;
      }
    }
    setLoading(true);
    try {
      await resourceService.addResourceItem({
        ...resourceItem,
        classIds: [classInfo.id as string],
      });
      resourceService
        .getResourceByClassId(classInfo.id as string)
        .then((res) => {
          setClassResources(res as ResourceItem[]);
        });
      setResourceItem({} as ResourceItem);
      setFormError({} as ResourceFormError);
      setModalVisible(false);
      toast.show({
        render: () => (
          <Row bg="success.500" px="8" py="2" rounded="md" shadow={1}>
            <Icon
              as={MaterialCommunityIcons}
              name="check-circle-outline"
              color="white"
              size={5}
              mr="2"
            />
            <Text color="white" fontWeight="bold">
              {i88n.common.success}
            </Text>
          </Row>
        ),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView background="white">
      <Column p="5" space="2">
        {authStore.user?.role === ROLES.TEACHER && (
          <>
            <Button
              colorScheme="primary"
              variant="outline"
              leftIcon={
                <Icon as={MaterialCommunityIcons} name="plus" size={5} />
              }
              onPress={() => setModalVisible(true)}
            >
              {i88n.manageClass.addResource}
            </Button>
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{i88n.manageClass.addResource}</Modal.Header>
                <Modal.Body>
                  <Column space="2">
                    <FormControl isRequired isInvalid={!!formError.name}>
                      <FormControl.Label>
                        {i88n.manageResource.name}
                      </FormControl.Label>
                      <Input
                        value={resourceItem.name}
                        onChange={(e) =>
                          setResourceItem({
                            ...resourceItem,
                            name: e.nativeEvent.text,
                          })
                        }
                      />
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {formError.name}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={!!formError.url}>
                      <FormControl.Label>
                        {i88n.manageResource.url}
                      </FormControl.Label>
                      <InputGroup display="flex">
                        <InputLeftAddon
                          px="3"
                          background="coolGray.100"
                          children={
                            <Icon
                              as={MaterialCommunityIcons}
                              name="link-variant"
                            />
                          }
                        />
                        <Input
                          flexGrow="1"
                          value={resourceItem.url}
                          onChange={(e) =>
                            setResourceItem({
                              ...resourceItem,
                              url: e.nativeEvent.text,
                            })
                          }
                        />
                      </InputGroup>
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {formError.url}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!formError.description}>
                      <FormControl.Label>
                        {i88n.manageResource.description}
                      </FormControl.Label>
                      <Input
                        multiline
                        height={12 * 2}
                        textAlignVertical="top"
                        value={resourceItem.description}
                        onChange={(e) =>
                          setResourceItem({
                            ...resourceItem,
                            description: e.nativeEvent.text,
                          })
                        }
                      />
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {formError.description}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  </Column>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space="2">
                    <Button
                      px="4"
                      variant="ghost"
                      onPress={() => setModalVisible(false)}
                    >
                      {i88n.common.cancel}
                    </Button>
                    <Button
                      px="4"
                      isLoading={loading}
                      onPress={() => {
                        addResourceItem();
                      }}
                    >
                      {i88n.common.save}
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </>
        )}
        {classResources.map((resourceItem, i) => (
          <ResourceItemBlock key={i} resourceItem={resourceItem} />
        ))}
      </Column>
    </ScrollView>
  );
};

export const FourthRoute = () => {
  const { authStore } = useStores();
  return (
    <ScrollView background="white">
      <Column p="5" space="2">
        {authStore.user?.role === ROLES.TEACHER && (
          <Button
            colorScheme="primary"
            variant="outline"
            leftIcon={<Icon as={MaterialCommunityIcons} name="plus" size={5} />}
          >
            {i88n.manageClass.addAssignment}
          </Button>
        )}
      </Column>
    </ScrollView>
  );
};

const renderScene = ({ route }: any) => {
  switch (route.key) {
    case "first":
      return <FirstRoute route={route} />;
    case "second":
      return <SecondRoute />;
    case "third":
      return <ThirdRoute route={route} />;
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
