import { i88n } from "@/i18n";
import { Class } from "@/models/Class";
import { userService } from "@/services/user.service";
import {
  Avatar,
  Box,
  Button,
  Column,
  FormControl,
  Heading,
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
import { ROLES, SCREENS } from "@/constants";
import { ResourceItem } from "@/models/ResourceItem";
import { validation } from "@/utils/validation";
import { resourceService } from "@/services/resource.service";
import { DateTimeInput, ResourceItemBlock } from "@/components";
import { Assignment } from "@/models/Assignment";
import { assignmentService } from "@/services/assignment.service";
import { User } from "@/stores/UserStore";
import { Link } from "@react-navigation/native";
import { Linking } from "react-native";

const FirstRoute = ({ route }: any) => {
  const classInfo: Class = route.params.classInfo;
  const [teachers, setTeachers] = useState<User[]>([]);
  const [assistants, setAssistants] = useState<User[]>([]);
  useEffect(() => {
    if (classInfo.teacherIds?.length) {
      userService.getUserByIds(classInfo.teacherIds as string[]).then((res) => {
        if (res) {
          setTeachers(res as User[]);
        }
      });
    }
    if (classInfo.assistantIds?.length) {
      userService
        .getUserByIds(classInfo.assistantIds as string[])
        .then((res) => {
          if (res) {
            setAssistants(res as User[]);
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
          <Link
            key={i}
            // @ts-ignore
            to={{ screen: SCREENS.ACCOUNT, params: { userInfo: teacher } }}
          >
            <Text color="primary.500">{teacher.fullName}</Text>
          </Link>
        ))}
        <Text color="coolGray.500">{i88n.manageClass.assistant}</Text>
        {assistants.map((assistant, i) => (
          <Link
            key={i}
            // @ts-ignore
            to={{ screen: SCREENS.ACCOUNT, params: { userInfo: assistant } }}
          >
            <Text color="primary.500">{assistant.fullName}</Text>
          </Link>
        ))}
      </Column>
    </ScrollView>
  );
};

const SecondRoute = ({ route }: any) => {
  const classInfo: Class = route.params.classInfo;
  const { authStore } = useStores();

  const [learners, setLearners] = useState<User[]>([]);
  useEffect(() => {
    if (classInfo.learnerIds?.length) {
      userService.getUserByIds(classInfo.learnerIds as string[]).then((res) => {
        if (res) {
          setLearners(res as User[]);
        }
      });
    }
  }, []);

  return (
    <ScrollView background="white">
      <Column p="5" space="2">
        {authStore.user?.role === ROLES.TEACHER && (
          <>
            <Button colorScheme="primary" variant="outline">
              {i88n.manageClass.attendanceInfo}
            </Button>
            <Button
              colorScheme="primary"
              variant="outline"
              leftIcon={
                <Icon as={MaterialCommunityIcons} name="plus" size={5} />
              }
            >
              {i88n.manageClass.addMember}
            </Button>
          </>
        )}
        {learners.map((learner, i) => (
          <Row
            key={i}
            p="2"
            alignItems="center"
            space="2"
            borderBottomWidth="1"
            borderBottomColor="coolGray.200"
          >
            <Text color="coolGray.500">{i + 1}.</Text>
            <Row space="2">
              <Avatar bg="gray.200">
                <Text color="coolGray.800">{(learner.fullName || "?")[0]}</Text>
              </Avatar>
            </Row>
            <Column>
              <Link
                // @ts-ignore
                to={{ screen: SCREENS.ACCOUNT, params: { userInfo: learner } }}
              >
                <Text color="primary.500">{learner.fullName}</Text>
              </Link>
              <Text color="coolGray.500">{learner.memberId}</Text>
            </Column>
          </Row>
        ))}
      </Column>
    </ScrollView>
  );
};

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

interface AssignmentFormError extends Partial<Assignment> {}

export const FourthRoute = ({ route }: any) => {
  const classInfo: Class = route.params.classInfo;

  const { authStore } = useStores();
  const [modalVisible, setModalVisible] = useState(false);
  const [assignment, setAssignment] = useState({} as Assignment);
  const [formError, setFormError] = useState({} as AssignmentFormError);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [classAssignments, setClassAssignments] = useState<Assignment[]>([]);
  useEffect(() => {
    assignmentService
      .getAssignmentByClassId(classInfo.id as string)
      .then((res) => {
        setClassAssignments(res as Assignment[]);
      });
  }, []);

  const addResourceItem = async () => {
    const currentFormError: AssignmentFormError = {
      name: validation.checkRequired(assignment.name),
    };
    for (const key in currentFormError) {
      if (currentFormError[key as keyof AssignmentFormError]) {
        setFormError(currentFormError);
        return;
      }
    }
    setLoading(true);
    try {
      await assignmentService.addAssignment({
        ...assignment,
        classIds: [classInfo.id as string],
      });
      assignmentService
        .getAssignmentByClassId(classInfo.id as string)
        .then((res) => {
          setClassAssignments(res as Assignment[]);
        });
      setAssignment({} as Assignment);
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
              {i88n.manageClass.addAssignment}
            </Button>
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{i88n.manageClass.addResource}</Modal.Header>
                <Modal.Body>
                  <Column space="2">
                    <FormControl isRequired isInvalid={!!formError.name}>
                      <FormControl.Label>
                        {i88n.manageAssignment.name}
                      </FormControl.Label>
                      <Input
                        value={assignment.name}
                        onChange={(e) =>
                          setAssignment({
                            ...assignment,
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
                    <FormControl isInvalid={!!formError.url}>
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
                          value={assignment.url}
                          onChange={(e) =>
                            setAssignment({
                              ...assignment,
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
                    <FormControl isInvalid={!!formError.note}>
                      <FormControl.Label>
                        {i88n.manageAssignment.note}
                      </FormControl.Label>
                      <Input
                        multiline
                        height={12 * 2}
                        textAlignVertical="top"
                        value={assignment.note}
                        onChange={(e) =>
                          setAssignment({
                            ...assignment,
                            note: e.nativeEvent.text,
                          })
                        }
                      />
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {formError.note}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <DateTimeInput
                      label={i88n.manageAssignment.dueDate}
                      value={
                        assignment.dueDate ||
                        i88n.manageAssignment.chooseDueDate
                      }
                      onChangeDate={(date) =>
                        setAssignment({
                          ...assignment,
                          dueDate: date,
                        })
                      }
                      isInvalid={!!formError.dueDate}
                      errorMessage={formError.dueDate}
                    />
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
        {classAssignments.map((assignment, i) => (
          <Box
            key={i}
            bg="white"
            borderWidth="1"
            borderColor="coolGray.200"
            rounded="lg"
          >
            <Row justifyContent="space-between">
              <Column p="5" space="2">
                <Heading size="sm" color="primary.500">
                  {assignment.name}
                </Heading>
                <Text>{assignment.note}</Text>
                <Row alignItems="center" space="1">
                  <Icon as={MaterialCommunityIcons} name="clock-outline" />
                  <Text color="coolGray.500">
                    {i88n.manageAssignment.dueDate}: {assignment.dueDate}
                  </Text>
                </Row>
              </Column>
              <Column justifyContent="center" p="2">
                <Button
                  colorScheme="primary"
                  variant="outline"
                  size="sm"
                  onPress={() => Linking.openURL(assignment.url as string)}
                >
                  {i88n.manageAssignment.submit}
                </Button>
              </Column>
            </Row>
          </Box>
        ))}
      </Column>
    </ScrollView>
  );
};

const renderScene = ({ route }: any) => {
  switch (route.key) {
    case "first":
      return <FirstRoute route={route} />;
    case "second":
      return <SecondRoute route={route} />;
    case "third":
      return <ThirdRoute route={route} />;
    case "fourth":
      return <FourthRoute route={route} />;
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
