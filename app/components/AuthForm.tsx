import {
  Button,
  Text,
  View,
  ScrollView,
  Box,
  Heading,
  Column,
  Row,
  FormControl,
  Input,
  Pressable,
  Icon,
  WarningOutlineIcon,
  Select,
} from "native-base";
import { useState } from "react";
import { Link } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { i88n } from "@/i18n";
import { ROLES, SCREENS } from "@/constants";
import { validation } from "@/utils/validation";
import { CustomError, authService } from "@/services/auth.service";
import { useStores } from "@/stores";
import { User } from "@/stores/UserStore";
import { DateTimeInput } from "./DateTimeInput";

interface Form extends User {
  repeatPassword: string;
}

interface FormError extends User {
  repeatPassword: string;
  default: string;
}

export const AuthForm = ({ isSignUp = false }) => {
  const { authStore } = useStores();

  const [form, setForm] = useState<Form>({} as Form);

  const [formError, setFormError] = useState<FormError>({} as FormError);

  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const currentFormError: FormError = {} as FormError;
    currentFormError.email = validation.checkEmail(form.email);
    currentFormError.password = validation.checkPassword(form.password);
    if (currentFormError.email || currentFormError.password) {
      setFormError(currentFormError);
      return;
    }
    try {
      setLoading(true);
      await authService.signIn(authStore, form.email, form.password);
    } catch (error) {
      const customError = error as CustomError;
      setFormError({
        ...currentFormError,
        [customError.errorType]: customError.errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    const currentFormError: FormError = {
      id: "",
      email: validation.checkEmail(form.email),
      password: validation.checkPassword(form.password),
      repeatPassword: validation.checkRepeatPassword(
        form.password,
        form.repeatPassword
      ),
      fullName: validation.checkFullName(form.fullName),
      phoneNumber: validation.checkPhoneNumber(form.phoneNumber),
      memberId: validation.checkMemberId(form.memberId),
      role: validation.checkRole(form.role),
      dateOfBirth: validation.checkDateOfBirth(form.dateOfBirth),
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
      const signUpInfo: Partial<User> = {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        memberId: form.memberId,
        role: form.role,
        dateOfBirth: form.dateOfBirth,
      };
      // @ts-ignore
      await authService.signUp(authStore, signUpInfo);
    } catch (error) {
      const customError = error as CustomError;
      setFormError({
        ...currentFormError,
        [customError.errorType]: customError.errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View flex={1}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        background="white"
      >
        <Box px="5" py="20" w="full">
          <Heading size="lg" fontWeight="600" color="coolGray.800">
            {i88n.auth.heading}
          </Heading>
          <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
            {isSignUp ? i88n.auth.signUpSubHeading : i88n.auth.signInSubHeading}
          </Heading>

          <Column mt="5" space={3}>
            <FormControl isRequired isInvalid={!!formError.email}>
              <FormControl.Label>{i88n.form.email}</FormControl.Label>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.nativeEvent.text })
                }
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {formError.email}
              </FormControl.ErrorMessage>
            </FormControl>

            <PasswordInput
              isInvalid={!!formError.password}
              label={i88n.form.password}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.nativeEvent.text })
              }
              errorMessage={formError.password}
            />

            {isSignUp && (
              <>
                <PasswordInput
                  isInvalid={!!formError.repeatPassword}
                  label={i88n.auth.repeatPassword}
                  value={form.repeatPassword}
                  onChange={(e) =>
                    setForm({ ...form, repeatPassword: e.nativeEvent.text })
                  }
                  errorMessage={formError.repeatPassword}
                />

                <FormControl isRequired isInvalid={!!formError.fullName}>
                  <FormControl.Label>{i88n.form.fullName}</FormControl.Label>
                  <Input
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.nativeEvent.text })
                    }
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {formError.fullName}
                  </FormControl.ErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!formError.phoneNumber}>
                  <FormControl.Label>{i88n.form.phoneNumber}</FormControl.Label>
                  <Input
                    keyboardType="phone-pad"
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm({ ...form, phoneNumber: e.nativeEvent.text })
                    }
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {formError.phoneNumber}
                  </FormControl.ErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!formError.memberId}>
                  <FormControl.Label>{i88n.form.memberId}</FormControl.Label>
                  <Input
                    keyboardType="number-pad"
                    value={form.memberId}
                    onChange={(e) =>
                      setForm({ ...form, memberId: e.nativeEvent.text })
                    }
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {formError.memberId}
                  </FormControl.ErrorMessage>
                </FormControl>

                <FormControl isRequired isReadOnly isInvalid={!!formError.role}>
                  <FormControl.Label>{i88n.form.role}</FormControl.Label>
                  <Select
                    onValueChange={(itemValue) =>
                      setForm({ ...form, role: itemValue })
                    }
                    accessibilityLabel={i88n.form.chooseRole}
                    placeholder={i88n.form.chooseRole}
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
                    {Object.entries(ROLES).map(([key, value]) => (
                      <Select.Item
                        key={key}
                        label={i88n.roles[value as keyof typeof i88n.roles]}
                        value={value}
                      />
                    ))}
                  </Select>
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {formError.role}
                  </FormControl.ErrorMessage>
                </FormControl>

                <DateTimeInput
                  label={i88n.form.dateOfBirth}
                  isInvalid={!!formError.dateOfBirth}
                  errorMessage={formError.dateOfBirth}
                  value={form.dateOfBirth || i88n.form.chooseDateOfBirth}
                  onChangeDate={(dateOfBirth) =>
                    setForm({ ...form, dateOfBirth })
                  }
                />
              </>
            )}

            {!isSignUp && (
              <Text
                color="primary.500"
                fontWeight="medium"
                fontSize="sm"
                alignSelf="flex-end"
              >
                <Link to={`/${SCREENS.RESET_PASSWORD}`}>
                  {i88n.auth.forgotPassword}
                </Link>
              </Text>
            )}

            <FormControl isInvalid={!!formError.default}>
              <Button
                mt="2"
                colorScheme="primary"
                isLoading={loading}
                onPress={isSignUp ? handleSignUp : handleSignIn}
              >
                {isSignUp ? i88n.auth.signUp : i88n.auth.signIn}
              </Button>
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {formError.default}
              </FormControl.ErrorMessage>
            </FormControl>

            <Row mt="8" justifyContent="center">
              <Text fontSize="sm" color="coolGray.600">
                {isSignUp ? i88n.auth.haveAccount : i88n.auth.haveNoAccount}{" "}
              </Text>
              <Text color="primary.500" fontWeight="medium" fontSize="sm">
                <Link to={`/${isSignUp ? SCREENS.SIGN_IN : SCREENS.SIGN_UP}`}>
                  {isSignUp ? i88n.auth.signIn : i88n.auth.signUp}
                </Link>
              </Text>
            </Row>
          </Column>
        </Box>
      </ScrollView>
    </View>
  );
};

interface PasswordInputProps {
  isInvalid: boolean;
  label: string;
  value: string;
  onChange: (e: any) => void;
  errorMessage: string;
}

const PasswordInput = ({
  isInvalid,
  label,
  value,
  onChange,
  errorMessage,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl isRequired isInvalid={isInvalid}>
      <FormControl.Label>{label}</FormControl.Label>
      <Input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        InputRightElement={
          <Pressable p={3} onPress={() => setShowPassword(!showPassword)}>
            <Icon
              as={
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="black"
                />
              }
            />
          </Pressable>
        }
      />
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
};
