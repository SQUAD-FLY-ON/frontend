import { useFocusEffect } from "@react-navigation/native";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type TDropdownItem = {
  label: string;
  value: string;
};

const Dropdown = ({
  itemProps,
  setHasValue,
}: {
  itemProps: TDropdownItem[];
  setHasValue: Dispatch<SetStateAction<boolean>>;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(itemProps);

  useEffect(() => {
    if (value !== null) setHasValue(true);
  }, [value]);

  useFocusEffect(
    useCallback(() => {
      setOpen(false);
      setValue(null);
    }, [])
  );

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="비행 일정을 선택하세요"
        listMode="SCROLLVIEW"
        style={styles.dropdown}
      />
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 48,
    zIndex: 10,
  },
  dropdown: {
    borderColor: "#ccc",
  },
});
