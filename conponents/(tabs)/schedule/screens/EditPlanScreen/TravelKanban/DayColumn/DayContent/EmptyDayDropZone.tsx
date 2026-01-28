import { useDragStore } from "@/store/useDragStore";
import { Text, View } from "react-native";

// 빈 Day 드롭존 컴포넌트
interface EmptyDayDropZoneProps {
  styles: any;
}

// ✅ 이 컴포넌트에서만 isDragging 구독 - 드래그 시 이것만 리렌더링
const EmptyDayDropZone = ({ styles }: EmptyDayDropZoneProps) => {
  const isDragging = useDragStore(state => state.draggingItem !== null);

  return (
    <View
      style={[
        styles.emptyDayDropZone,
        isDragging && styles.emptyDayDropZoneHighlight,
      ]}
    >
      <Text style={styles.emptyDayText}>
        여기에 일정을 드래그하세요
      </Text>
    </View>
  );
};

export default EmptyDayDropZone;

