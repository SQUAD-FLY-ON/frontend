import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

type TData = {
  label: string;
  value: string;
};

const ReportText = memo(({ data }: { data: TData }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{data.label}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.value}>{data.value}</Text>
    </View>
  );
});

export default ReportText;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  label: {
    color: "#333",
    fontFamily: "Pretendard-SemiBold",
    fontSize: 16,
    width: 94,
  },
  colon: {
    color: "#333",
    fontFamily: "Pretnedard-SemiBold",
    fontSize: 16,
    marginHorizontal: 8,
  },
  value: {
    color: "#333",
    fontFamily: "Pretendard-Regular",
    fontSize: 16,
  },
});
