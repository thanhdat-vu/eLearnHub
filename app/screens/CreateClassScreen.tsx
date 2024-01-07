import { DateTimeInput, MessageModal } from "@/components";
import { i88n } from "@/i18n";
import { Class } from "@/models/Class";
import {
  Box,
  Button,
  Column,
  FormControl,
  Icon,
  Input,
  ScrollView,
  Select,
  View,
  WarningOutlineIcon,
} from "native-base";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { User } from "@/stores/UserStore";
import { userService } from "@/services/user.service";
import { ROLES, SCREENS } from "@/constants";
import { classService } from "@/services/class.service";
import { validation } from "@/utils/validation";
import { useStores } from "@/stores";
import { useNavigation } from "@react-navigation/native";

interface FormError extends Class {
  assistant: string;
  default: string;
}

export const CreateClassScreen = () => {
  const { navigate } = useNavigation();

  const { authStore } = useStores();

  const [classInfo, setClassInfo] = useState<Class>({} as Class);

  const [formError, setFormError] = useState<FormError>({} as FormError);

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [allAssistant, setAllAssistant] = useState<User[]>([]);
  useEffect(() => {
    userService.getUserByRole(ROLES.ASSISTANT).then((assistants) => {
      setAllAssistant(assistants as User[]);
    });
  }, []);

  const handleCreateClass = async () => {
    const currentFormError: FormError = {
      name: validation.checkRequired(classInfo.name),
      description: "",
      startDate: validation.checkRequired(classInfo.startDate),
      endDate: validation.checkRequired(classInfo.endDate),
      startTime: validation.checkRequired(classInfo.startTime),
      endTime: validation.checkRequired(classInfo.endTime),
      assistant: "",
      default: "",
    };
    for (const key in currentFormError) {
      if (currentFormError[key as keyof FormError]) {
        setFormError(currentFormError);
        return;
      }
    }

    try {
      setLoading(true);
      await classService
        .createClass({
          ...classInfo,
          teacherIds: [authStore.user?.id as string],
        })
        .then(() => {
          setClassInfo({} as Class);
          setFormError({} as FormError);
          setShowModal(true);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView background="white">
      <Box p="5" w="full">
        <Column space={3}>
          <FormControl isRequired isInvalid={!!formError.name}>
            <FormControl.Label>{i88n.manageClass.name}</FormControl.Label>
            <Input
              value={classInfo.name}
              onChange={(e) =>
                setClassInfo({ ...classInfo, name: e.nativeEvent.text })
              }
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {formError.name}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formError.description}>
            <FormControl.Label>
              {i88n.manageClass.description}
            </FormControl.Label>
            <Input
              multiline
              height={12 * 2}
              textAlignVertical="top"
              value={classInfo.description}
              onChange={(e) =>
                setClassInfo({
                  ...classInfo,
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

          <DateTimeInput
            label={i88n.manageClass.startDate}
            isInvalid={!!formError.startDate}
            errorMessage={formError.startDate}
            value={classInfo.startDate || i88n.manageClass.chooseStartDate}
            onChangeDate={(startDate) =>
              setClassInfo({ ...classInfo, startDate })
            }
          />

          <DateTimeInput
            label={i88n.manageClass.endDate}
            isInvalid={!!formError.endDate}
            errorMessage={formError.endDate}
            value={classInfo.endDate || i88n.manageClass.chooseEndDate}
            onChangeDate={(endDate) => setClassInfo({ ...classInfo, endDate })}
          />

          <DateTimeInput
            label={i88n.manageClass.startTime}
            isInvalid={!!formError.startTime}
            errorMessage={formError.startTime}
            value={classInfo.startTime || i88n.manageClass.chooseStartTime}
            onChangeDate={(startTime) =>
              setClassInfo({
                ...classInfo,
                startTime,
              })
            }
            isTimeMode
          />

          <DateTimeInput
            label={i88n.manageClass.endTime}
            isInvalid={!!formError.endTime}
            errorMessage={formError.endTime}
            value={classInfo.endTime || i88n.manageClass.chooseEndTime}
            onChangeDate={(endTime) =>
              setClassInfo({
                ...classInfo,
                endTime,
              })
            }
            isTimeMode
          />

          <FormControl isReadOnly isInvalid={!!formError.assistant}>
            <FormControl.Label>{i88n.roles.assistant}</FormControl.Label>
            <Select
              onValueChange={(itemValue) =>
                setClassInfo({ ...classInfo, assistantIds: [itemValue] })
              }
              accessibilityLabel={i88n.manageClass.chooseAssistant}
              placeholder={i88n.manageClass.chooseAssistant}
              _selectedItem={{
                bg: "teal.600",
                endIcon: (
                  <Icon
                    as={<MaterialCommunityIcons name="check" />}
                    size="sm"
                  />
                ),
              }}
              dropdownIcon={
                <Icon
                  as={MaterialCommunityIcons}
                  name="menu-down"
                  size="lg"
                  mr="1"
                />
              }
            >
              {allAssistant.map((assistant) => (
                <Select.Item
                  key={assistant.id}
                  label={assistant.fullName || ""}
                  value={assistant.id || ""}
                />
              ))}
            </Select>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {formError.assistant}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formError.default}>
            <Button
              mt="2"
              colorScheme="primary"
              isLoading={loading}
              onPress={handleCreateClass}
            >
              {i88n.manageClass.create}
            </Button>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {formError.default}
            </FormControl.ErrorMessage>
          </FormControl>
        </Column>
      </Box>
      <MessageModal
        isOpen={showModal}
        onClose={() => navigate(SCREENS.HOME as never)}
        title={i88n.common.success}
        message={i88n.manageClass.createSuccess}
        primaryButtonLabel={i88n.common.backToHome}
      />
    </ScrollView>
  );
};
