import { ResourceItem } from "@/models/ResourceItem";
import {
  Box,
  Column,
  Heading,
  Icon,
  IconButton,
  Link,
  Row,
  Text,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ResourceItemProps {
  resourceItem: ResourceItem;
}

export const ResourceItemBlock = ({ resourceItem }: ResourceItemProps) => {
  return (
    <Box bg="white" borderWidth="1" borderColor="coolGray.200" rounded="lg">
      <Row justifyContent="space-between">
        <Column p="5" space="2">
          <Link href={resourceItem.url}>
            <Heading size="sm" color="primary.500">
              {resourceItem.name}
            </Heading>
          </Link>
          <Text>{resourceItem.description}</Text>
        </Column>
        <Row alignItems="center" justifyContent="center" p="1">
          <IconButton
            variant="ghost"
            disabled
            icon={
              <Icon
                as={MaterialCommunityIcons}
                name="download-outline"
                color="coolGray.300"
                size="lg"
              />
            }
            borderRadius="full"
          />
          <IconButton
            variant="ghost"
            icon={
              <Icon
                as={MaterialCommunityIcons}
                name="bookmark-outline"
                size="lg"
              />
            }
            borderRadius="full"
          />
        </Row>
      </Row>
    </Box>
  );
};
