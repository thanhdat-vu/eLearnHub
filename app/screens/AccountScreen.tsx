import { User } from "@/models/User";
import { userService } from "@/services/user.service";
import { useStores } from "@/stores";
import { Column, Heading, ScrollView, Text, Link, Row } from "native-base";
import { useEffect, useState } from "react";
import { i88n } from "@/i18n";

export const AccountScreen = () => {
  const { authStore } = useStores();

  const [userInfo, setUserInfo] = useState<User>();
  useEffect(() => {
    const userId = authStore.getUserId;
    if (!userId) return;
    userService.getUser(userId).then((user) => {
      setUserInfo(user as User);
    });
  }, []);

  return (
    <ScrollView background="white" p="5">
      <Column space="4">
        <Heading fontSize="md" fontWeight="bold">
          {i88n.account.personalInfo}
        </Heading>
        <Text>
          {i88n.form.fullName}: {userInfo?.fullName}
        </Text>
        <Text>
          {i88n.form.memberId}: {userInfo?.memberId}
        </Text>
        <Text>
          {i88n.form.role}:{" "}
          {userInfo && userInfo.role
            ? i88n.roles[userInfo.role.toLowerCase() as keyof typeof i88n.roles]
            : ""}
        </Text>
        <Text>
          {i88n.form.dateOfBirth}: {userInfo?.dateOfBirth}
        </Text>
        <Row>
          <Text>{i88n.form.email}: </Text>
          <Link href={`mailto:${userInfo?.email}`}>
            <Text color="primary.500">{userInfo?.email}</Text>
          </Link>
        </Row>
        {/* phone to */}
        <Row>
          <Text>{i88n.form.phoneNumber}: </Text>
          <Link href={`tel:${userInfo?.phoneNumber}`}>
            <Text color="primary.500">{userInfo?.phoneNumber}</Text>
          </Link>
        </Row>
      </Column>
    </ScrollView>
  );
};
