import { Button, Text } from "native-base";
import {
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
} from "native-base";
import { useState } from "react";
import { Link } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { i88n } from "@/i18n";
import { SCREENS } from "@/constants";
import { validation } from "@/utils/validation";
import { CustomError, authService } from "@/services/auth.service";
import { useStores } from "@/stores";

interface Form {
  email: string;
  password: string;
  repeatPassword: string;
}

interface FormError {
  email: string;
  password: string;
  repeatPassword: string;
  default: string;
}

export const AuthForm = ({ isSignUp = false }) => {
  const { authStore } = useStores();

  const [form, setForm] = useState<Form>({
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [formError, setFormError] = useState<FormError>({
    email: "",
    password: "",
    repeatPassword: "",
    default: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const currentFormError: FormError = {
      email: "",
      password: "",
      repeatPassword: "",
      default: "",
    };
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
      email: "",
      password: "",
      repeatPassword: "",
      default: "",
    };
    currentFormError.email = validation.checkEmail(form.email);
    currentFormError.password = validation.checkPassword(form.password);
    currentFormError.repeatPassword = validation.checkRepeatPassword(
      form.password,
      form.repeatPassword
    );
    if (
      currentFormError.email ||
      currentFormError.password ||
      currentFormError.repeatPassword
    ) {
      setFormError(currentFormError);
      return;
    }
    try {
      setLoading(true);
      await authService.signUp(authStore, form.email, form.password);
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
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      background="white"
    >
      <Box px="5" w="full">
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
              onChange={(e) => setForm({ ...form, email: e.nativeEvent.text })}
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
            onChange={(e) => setForm({ ...form, password: e.nativeEvent.text })}
            errorMessage={formError.password}
          />

          {isSignUp && (
            <PasswordInput
              isInvalid={!!formError.repeatPassword}
              label={i88n.auth.repeatPassword}
              value={form.repeatPassword}
              onChange={(e) =>
                setForm({ ...form, repeatPassword: e.nativeEvent.text })
              }
              errorMessage={formError.repeatPassword}
            />
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
