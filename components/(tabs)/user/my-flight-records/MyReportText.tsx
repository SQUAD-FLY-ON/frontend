import { StyleSheet, Text, View } from "react-native";

type TData = {
  label: string;
  value: string;
};

const MyReportText = ({ data }: { data: TData }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={styles.label}>{data.label}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.value}>{data.value}</Text>
    </View>
  );
};

export default MyReportText;

const styles = StyleSheet.create({
  label: {
    color: "#FFF",
    fontFamily: "Pretendard-SemiBold",
    fontSize: 16,
    width: 94,
  },
  colon: {
    color: "#FFF",
    fontFamily: "Pretnedard-SemiBold",
    fontSize: 16,
    marginHorizontal: 8,
  },
  value: {
    color: "#FFF",
    fontFamily: "Pretendard-Regular",
    fontSize: 16,
  },
});
