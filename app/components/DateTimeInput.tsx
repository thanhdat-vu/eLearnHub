import { FormControl, Icon, Button, WarningOutlineIcon } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { i88n } from "@/i18n";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

interface DateTimeInputProps {
  label: string;
  isInvalid: boolean;
  value: string;
  errorMessage?: string;
  onChangeDate: (date: string) => void;
  isTimeMode?: boolean;
}

export const DateTimeInput = ({
  label,
  isInvalid,
  value,
  errorMessage,
  onChangeDate,
  isTimeMode = false,
}: DateTimeInputProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <FormControl isRequired isInvalid={isInvalid}>
      <FormControl.Label>{label}</FormControl.Label>
      <Button
        leftIcon={
          <Icon as={<MaterialCommunityIcons name="calendar" />} size="sm" />
        }
        colorScheme="primary"
        onPress={() => setShowDatePicker(true)}
        variant="outline"
      >
        {value || (isTimeMode ? i88n.form.chooseDate : i88n.form.chooseTime)}
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode={isTimeMode ? "time" : "date"}
          display="spinner"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              onChangeDate(
                format(selectedDate, isTimeMode ? "HH:mm" : "dd/MM/yyyy")
              );
            }
          }}
        />
      )}
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
};
