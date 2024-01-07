import { i88n } from "@/i18n";
import { Modal, Button, ScrollView, Text, Column } from "native-base";

interface MessageModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  message: string;
  primaryButtonLabel?: string;
  primaryButtonColorScheme?: string;
}

export const MessageModal = ({
  isOpen,
  onClose,
  title,
  message,
  primaryButtonLabel,
  primaryButtonColorScheme,
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
              <Button
                colorScheme={primaryButtonColorScheme || "success"}
                width="full"
                onPress={onClose}
              >
                {primaryButtonLabel || i88n.common.continue}
              </Button>
            </Column>
          </ScrollView>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
