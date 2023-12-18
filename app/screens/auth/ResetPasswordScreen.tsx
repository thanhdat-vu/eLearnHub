import {
  Box,
  Text,
  Heading,
  Column,
  FormControl,
  Input,
  Button,
  Row,
  ScrollView,
  WarningOutlineIcon,
} from "native-base";
import { Link } from "@react-navigation/native";
import { useState } from "react";
import { SCREENS } from "../../constants";
import { i88n } from "../../i18n";
import { validation } from "@/utils/validation";
import { CustomError, authService } from "@/services/auth.service";
import { set } from "mobx";
import { MessageModal } from "@/components";

export const ResetPasswordScreen = ({ navigation }: any) => {
  const [form, setForm] = useState({
    email: "",
  });
  const [formError, setFormError] = useState({
    email: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    const currentFormError = {
      email: "",
    };
    currentFormError.email = validation.checkEmail(form.email);
    if (currentFormError.email) {
      setFormError(currentFormError);
      return;
    }
    try {
      setLoading(true);
      await authService.resetPassword(form.email);
      setIsSuccess(true);
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

  const handleGoToLogin = () => {
    setIsSuccess(false);
    navigation.navigate(SCREENS.SIGN_IN);
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
          {i88n.auth.forgotPassword}
        </Heading>
        <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
          {i88n.auth.forgotPasswordSubHeading}
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

          <Button
            isLoading={loading}
            mt="2"
            colorScheme="primary"
            onPress={handleResetPassword}
          >
            {i88n.auth.sendEmail}
          </Button>
        </Column>

        <Row mt="8" justifyContent="center">
          <Link to={`/${SCREENS.SIGN_IN}`}>
            <Text color="primary.500" fontWeight="medium" fontSize="sm">
              {i88n.auth.backToSignIn}
            </Text>
          </Link>
        </Row>
      </Box>
      <MessageModal
        isOpen={isSuccess}
        onClose={handleGoToLogin}
        title={i88n.common.success}
        message={i88n.auth.checkEmail}
      />
    </ScrollView>
  );
};
