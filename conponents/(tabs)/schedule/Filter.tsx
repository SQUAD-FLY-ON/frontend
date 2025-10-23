import CustomButton from "@/conponents/CustomButton";
import { SetStateAction } from "react";
import { ScrollView, StyleSheet } from "react-native";

interface FilterProps {
  filters: {
    key: string;
    text: string;
  }[] | undefined;
  gap?: number;
  currentFilter: string;
  setCurrentFilter: React.Dispatch<SetStateAction<string>>;
}

export default function Filter({ 
  filters, 
  gap = 12, 
  currentFilter, 
  setCurrentFilter 
}: FilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContainer, { gap }]}
      style={styles.scrollView}
    >
      {filters?.map((item) => (
        <CustomButton
          backgroundColor={currentFilter === item.key ? 'main' : '#EFEFEF'}
          key={item.key}
          textStyle={{ 
            color: currentFilter === item.key ? '#FFFFFF' : '#333333' 
          }}
          text={item.text}
          buttonType="small"
          onPress={() => setCurrentFilter(item.key)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
    height: 44,
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 0,
  },
});