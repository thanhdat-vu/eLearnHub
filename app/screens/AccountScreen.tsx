import { User } from "@/stores/UserStore";
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
        <AccountInfoItem
          label={i88n.form.fullName}
          value={userInfo?.fullName}
        />
        <AccountInfoItem
          label={i88n.form.memberId}
          value={userInfo?.memberId}
        />
        <AccountInfoItem
          label={i88n.form.role}
          value={
            userInfo && userInfo.role
              ? i88n.roles[
                  userInfo.role.toLowerCase() as keyof typeof i88n.roles
                ]
              : ""
          }
        />
        <AccountInfoItem
          label={i88n.form.dateOfBirth}
          value={userInfo?.dateOfBirth}
        />
        <AccountInfoItem
          label={i88n.form.email}
          value={userInfo?.email}
          linkTo={`mailto:${userInfo?.email}`}
        />
        <AccountInfoItem
          label={i88n.form.phoneNumber}
          value={userInfo?.phoneNumber}
          linkTo={`tel:${userInfo?.phoneNumber}`}
        />
      </Column>
    </ScrollView>
  );
};

export const AccountInfoItem = ({
  label,
  value,
  linkTo,
}: {
  label: string;
  value: string | undefined;
  linkTo?: string;
}) => {
  return (
    <Row justifyContent="space-between">
      <Text color="coolGray.500">{label}: </Text>
      {linkTo ? (
        <Link href={linkTo}>
          <Text color="primary.500">{value}</Text>
        </Link>
      ) : (
        <Text>{value}</Text>
      )}
    </Row>
  );
};
