import { i88n } from "@/i18n";
import { Modal, Button, ScrollView, Text, Column } from "native-base";

interface MessageModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  message: string;
}

export const MessageModal = ({
  isOpen,
  onClose,
  title,
  message,
}: MessageModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <ScrollView>
            <Column space={8} alignItems="center">
              <Text width="full" textAlign="justify">
                {message}
              </Text>
              <Button width="full" colorScheme="success" onPress={onClose}>
                {i88n.common.continue}
              </Button>
            </Column>
          </ScrollView>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
