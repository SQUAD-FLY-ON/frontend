import { typeToLabel } from '@/constants/screens';
import { transformSchedulesToDayData } from '@/libs/schedule/transformSchedulesToDayData ';
import { useScheduleStore } from '@/store/useScheduleStore';
import { Plan } from '@/types';
import Entypo from '@expo/vector-icons/Entypo';
import React, { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import DraggablePlanCard from './DraggablePlanCard';
import { FloatingPortalContext } from './FloatingPortal';


interface DayData {
  [dayId: string]: {
    title: string;
    plans: Plan[];
    color: string;
  };
}
// 메인 여행 계획 칸반 보드
const TravelPlanKanban = () => {
  const [draggingItem, setDraggingItem] = useState<{
    item: Plan;
    sourceDay: string;
    sourceIndex: number;
  } | null>(null);

  const [dayLayouts, setDayLayouts] = useState<{ [key: string]: any }>({});
  const [cardLayouts, setCardLayouts] = useState<{ [key: string]: any[] }>({});
  const scrollOffsetRef = useRef(0); // 상태에서 useRef로 변경
  const [scrollViewLayout, setScrollViewLayout] = useState({ y: 0, height: 0 });
  const scrollViewLayoutRef = useRef({ y: 0, height: 0 });
  const isAutoScrollingRef = useRef(false);
  const autoScrollDirectionRef = useRef<'up' | 'down' | null>(null)
  const dayRefs = useRef<{ [key: string]: View }>({});
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  // 드래그 시작 시의 스크롤 오프셋을 저장
  const initialScrollOffsetRef = useRef(0);

  const { schedule, dayData, setDayData } = useScheduleStore();
  const dummySchedule = [
    [
      {
        "id": 9007199254740991,
        "tourismType": "ATTRACTION_SPOT",
        "name": "경복궁",
        "fullAddress": "서울특별시 종로구 사직로 161",
        "longitude": 126.9770,
        "latitude": 37.5796,
        "phoneNumber": "02-3700-3900",
        "imgUrl": "https://picsum.photos/seed/gyeongbokgung/400/300"
      },
      {
        "id": 9007199254740992,
        "tourismType": "RESTAURANT",
        "name": "토속촌 삼계탕",
        "fullAddress": "서울특별시 종로구 자하문로5길 5",
        "longitude": 126.9721,
        "latitude": 37.5795,
        "phoneNumber": "02-737-7444",
        "imgUrl": "https://picsum.photos/seed/tosokchon/400/300"
      },
      {
        "id": 9007199254740993,
        "tourismType": "ATTRACTION_SPOT",
        "name": "N서울타워",
        "fullAddress": "서울특별시 용산구 남산공원길 105",
        "longitude": 126.9882,
        "latitude": 37.5512,
        "phoneNumber": "02-3455-9277",
        "imgUrl": "https://picsum.photos/seed/nseoultower/400/300"
      }
    ],
    [
      {
        "id": 9007199254740994,
        "tourismType": "ATTRACTION_SPOT",
        "name": "해운대 해수욕장",
        "fullAddress": "부산광역시 해운대구 우동",
        "longitude": 129.1586,
        "latitude": 35.1581,
        "phoneNumber": "051-749-4335",
        "imgUrl": "https://picsum.photos/seed/haeundae/400/300"
      },
      {
        "id": 9007199254740995,
        "tourismType": "RESTAURANT",
        "name": "해운대암소갈비집",
        "fullAddress": "부산광역시 해운대구 중동2로10번길 32-10",
        "longitude": 129.1634,
        "latitude": 35.1611,
        "phoneNumber": "051-746-0033",
        "imgUrl": "https://picsum.photos/seed/haewundae-galbi/400/300"
      }
    ],
    [
      {
        "id": 9007199254740996,
        "tourismType": "ATTRACTION_SPOT",
        "name": "성산일출봉",
        "fullAddress": "제주특별자치도 서귀포시 성산읍 성산리 1",
        "longitude": 126.9423,
        "latitude": 33.4581,
        "phoneNumber": "064-783-0959",
        "imgUrl": "https://picsum.photos/seed/sungsan/400/300"
      },
      {
        "id": 9007199254740997,
        "tourismType": "RESTAURANT",
        "name": "제주 흑돼지 맛집 '돈사돈'",
        "fullAddress": "제주특별자치도 제주시 우평로 19",
        "longitude": 126.4786,
        "latitude": 33.4851,
        "phoneNumber": "064-746-8989",
        "imgUrl": "https://picsum.photos/seed/donsadon/400/300"
      },
      {
        "id": 9007199254740998,
        "tourismType": "CAFE",
        "name": "카페 봄날",
        "fullAddress": "제주특별자치도 제주시 애월읍 애월로1길 25",
        "longitude": 126.3106,
        "latitude": 33.4939,
        "phoneNumber": "064-799-4999",
        "imgUrl": "https://picsum.photos/seed/bomnalcafe/400/300"
      }
    ]
  ]
  useEffect(() => {
    const dayData = transformSchedulesToDayData(schedule)
    setDayData(dayData);
  }, [schedule])
  // ScrollView 레이아웃 측정 - measureInWindow로 화면 기준 절대 좌표 획득
  const scrollViewRef = useRef<ScrollView>(null);
  const containerRef = useRef<View>(null);

  const [floatingCardData, setFloatingCardData] = useState<{
    item: Plan;
    dayId: string;
    index: number;
    layout: { x: number; y: number; width: number; height: number };
    gestureState: any;
    initialPosition: { x: number; y: number };
  } | null>(null);

  const floatingPan = useRef(new Animated.ValueXY()).current;
  const floatingOpacity = useRef(new Animated.Value(0)).current;
  const floatingPortal = useContext(FloatingPortalContext);
  const autoScrollFrameId = useRef<number | null>(null);

  // measureScrollViewPosition 함수 수정 - 정확한 위치 측정
  const measureScrollViewPosition = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.measureInWindow((x, y, width, height) => {
        const layout = { y, height, x, width };
        setScrollViewLayout(layout);
        scrollViewLayoutRef.current = layout; // ref에도 저장
      });
    }
  }, []);

  // Day 컬럼의 레이아웃 측정 (ScrollView 기준 절대 좌표)
  const measureDay = useCallback((dayId: string, event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setDayLayouts(prev => ({
      ...prev,
      [dayId]: {
        x,
        y,
        width,
        height,
        originalY: y
      }
    }));
  }, []);

  // 카드의 레이아웃 측정 (Day 컨테이너 기준 상대 좌표)
  const measureCard = useCallback((dayId: string, index: number, event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setCardLayouts(prev => {
      const dayCards = [...(prev[dayId] || [])];
      dayCards[index] = {
        x,
        y,
        width,
        height,
        index
      };
      return {
        ...prev,
        [dayId]: dayCards
      };
    });
  }, []);

  const remeasureDayLayouts = useCallback(() => {

  return new Promise<void>((resolve) => {
    const dayIds = Object.keys(dayRefs.current);

    if (dayIds.length === 0) {
      resolve();
      return;
    }

    // ✅ 현재 스크롤 오프셋 저장
    const currentScrollOffset = scrollOffsetRef.current;

    let measured = 0;
    let resolved = false;

    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    }, 3000);

    const checkComplete = () => {
      if (measured >= dayIds.length && !resolved) {
        resolved = true;
        clearTimeout(timeoutId);
        resolve();
      }
    };

    dayIds.forEach((dayId, index) => {

      const dayRef = dayRefs.current[dayId];
      if (dayRef && dayRef.measureInWindow) {
        try {
          dayRef.measureInWindow((x, y, width, height) => {
            if (!resolved) {
              // ✅ 화면 좌표를 콘텐츠 좌표로 변환
              const contentY = y + currentScrollOffset;
              

              setDayLayouts(prev => ({
                ...prev,
                [dayId]: { 
                  x, 
                  y: contentY,  // ✅ 콘텐츠 좌표 저장
                  width, 
                  height 
                }
              }));
            }

            measured++;
            checkComplete();
          });
        } catch (error) {
          measured++;
          checkComplete();
        }
      } else {
        measured++;
        setTimeout(checkComplete, 0);
      }
    });
  });
}, []);

  // startAutoScroll 함수도 수정 - 이미 스크롤 중인 경우 처리
  const startAutoScroll = useCallback((direction: 'up' | 'down') => {
    if (isAutoScrollingRef.current && autoScrollDirectionRef.current === direction) {
      return;
    }

    stopAutoScroll();

    isAutoScrollingRef.current = true;
    autoScrollDirectionRef.current = direction;

    const scrollSpeed = 15;

    const scroll = () => {

      if (!isAutoScrollingRef.current) {
        return;
      }

      const currentOffset = scrollOffsetRef.current;
      const newOffset = direction === 'up'
        ? Math.max(0, currentOffset - scrollSpeed)
        : currentOffset + scrollSpeed;


      if (direction === 'up' && newOffset <= 0) {
        stopAutoScroll();
        return;
      }

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: newOffset,
          animated: false
        });
      } else {
      }

      autoScrollFrameId.current = requestAnimationFrame(scroll);
    };

    autoScrollFrameId.current = requestAnimationFrame(scroll);
  }, []);
  // 자동 스크롤 중지
  const stopAutoScroll = useCallback(() => {

    if (autoScrollInterval.current) {

      clearInterval(autoScrollInterval.current);

      autoScrollInterval.current = null;

    }

    isAutoScrollingRef.current = false;

    autoScrollDirectionRef.current = null;

  }, []);


  // 스크롤 오프셋 추적
  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollOffsetRef.current = offsetY;
  }, []);



  // handleDragStart 수정 - 측정 타이밍 개선
  // 🎯 드래그 시작 - Floating 카드 생성

  const createFloatingCard = useCallback((
    item: Plan,
    dayId: string,
    index: number,
    layout: { x: number; y: number; width: number; height: number },
    initialPosition: { x: number; y: number },
    gestureState: any
  ) => {
    if (!floatingPortal) return;
    // ⚠️ layout.x, layout.y는 초기 offset 계산용
    // 실제 위치는 현재 터치 위치로!

    const floatingCard = (
      <Animated.View
        style={[
          {
            position: 'absolute',
            // ✅ 초기 터치 위치를 기준으로 시작
            left: initialPosition.x - layout.width / 2,
            top: initialPosition.y - layout.height / 2,
            width: layout.width,
            height: layout.height,
            zIndex: 999,
          },
          {
            opacity: floatingOpacity,
            // ✅ gestureState로 이동
            transform: [
              { translateX: floatingPan.x },
              { translateY: floatingPan.y }
            ],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 16,
          }
        ]}
      >
        {/* 🎯 카드 내용 다시 추가 */}
        <View style={styles.rowContainer}>
          <View style={styles.leftContainer}>
            <View style={styles.indexCircle}>
              <Text style={styles.index}>{index + 1}</Text>
            </View>
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.type}>{typeToLabel[item?.type]}</Text>
            <View style={styles.card}>
              {item?.image ? (
                <Image style={styles.imagePlaceholder} source={{ uri: item?.image }} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imageText}>IMG</Text>
                </View>
              )}
              <View style={styles.cardTextContainer}>
                <Text style={styles.place} numberOfLines={1}>
                  {item?.place}
                </Text>
                <Text style={styles.address} numberOfLines={2} ellipsizeMode="tail">
                  {item?.address}
                </Text>
              </View>
              <View>
                <Entypo name="menu" size={24} color="black" />
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    );

    try {
      floatingPortal.setFloatingElement(floatingCard);
    } catch (error) {
    }
  }, []);

  const handleDragStart = useCallback(async (
    item: Plan,
    dayId: string,
    index: number,
    cardLayout: { x: number; y: number; width: number; height: number },
    initialPosition: { x: number; y: number }
  ) => {

    setDraggingItem({ item, sourceDay: dayId, sourceIndex: index });
    initialScrollOffsetRef.current = scrollOffsetRef.current;

    measureScrollViewPosition();
    await remeasureDayLayouts();

    // 레이아웃 데이터 검증
    if (!cardLayout.width || !cardLayout.height) {
      console.warn('Invalid card layout:', cardLayout);
      return;
    }

    setFloatingCardData({
      item,
      dayId,
      index,
      layout: cardLayout,
      initialPosition,
      gestureState: { dx: 0, dy: 0 }
    });


    // 직접 호출해보기
    try {
      const result = createFloatingCard(item, dayId, index, cardLayout, initialPosition, { dx: 0, dy: 0 });
    } catch (error) {
    }

    Animated.timing(floatingOpacity, {
      toValue: 0.9,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [createFloatingCard, floatingOpacity]);

  // 부모 컴포넌트의 handleDragMove 수정
  const handleDragMove = useCallback((x: number, y: number, gestureState: any, evt: any, initialPosition: {x:number; y:number}) => {
    if (!scrollViewLayout.height) return;

    // gestureState가 undefined인 경우 방어 처리
    if (!gestureState) {
      console.warn('gestureState is undefined in handleDragMove');
      return;
    }

    // 자동스크롤 로직 (기존과 동일)
    const SCROLL_THRESHOLD = 40;
    const scrollViewTop = scrollViewLayout.y;
    const scrollViewBottom = scrollViewLayout.y + scrollViewLayout.height;

    const isInTopScrollZone = y <= scrollViewTop + SCROLL_THRESHOLD;
    const isInBottomScrollZone = y >= scrollViewBottom - SCROLL_THRESHOLD;

    if (isInTopScrollZone && scrollOffsetRef.current > 0) {
      if (!isAutoScrollingRef.current || autoScrollDirectionRef.current !== 'up') {
        startAutoScroll('up');
      }
    } else if (isInBottomScrollZone) {
      if (!isAutoScrollingRef.current || autoScrollDirectionRef.current !== 'down') {
        startAutoScroll('down');
      }
    } else {
      if (isAutoScrollingRef.current) {
        stopAutoScroll();
      }
    }

    // Floating 카드 위치 업데이트
    if (floatingCardData && gestureState.dx !== undefined && gestureState.dy !== undefined) {
      // gestureState의 변화를 floatingPan에 즉시 반영
      floatingPan.setValue({ x: gestureState.dx, y: gestureState.dy });

      // 필요시 floating 카드 재생성 (자동스크롤 상태 변화 등)
      if (gestureState.isAutoScrolling !== floatingCardData.gestureState?.isAutoScrolling) {
        setFloatingCardData(prev => prev ? {
          ...prev,
          gestureState
        } : null);

        createFloatingCard(
          floatingCardData.item,
          floatingCardData.dayId,
          floatingCardData.index,
          floatingCardData.layout,
          initialPosition,
          gestureState
        );
      }
    }
  }, [scrollViewLayout, floatingCardData, createFloatingCard, startAutoScroll, stopAutoScroll]);

  // const getDropTargetInternal = useCallback((x: number, y: number) => {
  //   const dayIds = Object.keys(dayLayouts);

  //   for (const dayId of dayIds) {
  //     const dayLayout = dayLayouts[dayId];
  //     if (!dayLayout) continue;

  //     // 스크롤 변화량을 고려한 dayLayout 위치 보정
  //     const scrollDelta = scrollOffsetRef.current - initialScrollOffsetRef.current;
  //     const adjustedDayTop = dayLayout.y + scrollDelta;
  //     const adjustedDayBottom = adjustedDayTop + dayLayout.height;

  //     if (y >= adjustedDayTop - 50 && y <= adjustedDayBottom + 50) {
  //       const cards = cardLayouts[dayId] || [];

  //       if (cards.length === 0) {
  //         return { dayId, insertIndex: 0 };
  //       }

  //       for (let i = 0; i < cards.length; i++) {
  //         const card = cards[i];
  //         if (!card) continue;

  //         const cardScreenY = adjustedDayTop + card.y + card.height / 2;

  //         if (y < cardScreenY) {
  //           return { dayId, insertIndex: i };
  //         }
  //       }

  //       return { dayId, insertIndex: cards.length };
  //     }
  //   }

  //   return null;
  // }, [dayLayouts, cardLayouts]);

  // 타겟 Day와 위치 찾기 (실시간 스크롤 오프셋 적용)
  const getDropTarget = useCallback(( pageY: number) => {

    const dayIds = Object.keys(dayLayouts);
    const currentScrollOffset = scrollOffsetRef.current;

    // ✅ pageY를 콘텐츠 좌표로 변환
    const contentY = pageY + currentScrollOffset;
    for (const dayId of dayIds) {
      const dayLayout = dayLayouts[dayId];
      if (!dayLayout) continue;

      const dayContentTop = dayLayout.y;
      const dayContentBottom = dayLayout.y + dayLayout.height;

      if (contentY >= dayContentTop - 50 && contentY <= dayContentBottom + 50) {
        const cards = cardLayouts[dayId] || [];

        if (cards.length === 0) {
          return { dayId, insertIndex: 0 };
        }

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          if (!card) continue;

          const cardCenterContentY = dayLayout.y + card.y + card.height / 2;

          if (contentY < cardCenterContentY) {
            return { dayId, insertIndex: i };
          }
        }

        return { dayId, insertIndex: cards.length };
      }
    }

    return null;
  }, [dayLayouts, cardLayouts]);

  const handleDragEnd = useCallback(( y: number) => {
    stopAutoScroll();

    if (!draggingItem) return;
    // 드롭 로직 (기존과 동일)

    const dropTarget = getDropTarget(y);

    if (dropTarget) {
      const { dayId: targetDay, insertIndex } = dropTarget;
      const { item, sourceDay, sourceIndex } = draggingItem;


      if (targetDay === sourceDay) {
        // 같은 Day 내에서 순서 변경
        if (insertIndex !== sourceIndex && insertIndex !== sourceIndex + 1) {
          setDayData(prevData => {
            const newDayData = { ...prevData };
            const plans = [...newDayData[sourceDay].plans];

            // 아이템 제거
            const [movedItem] = plans.splice(sourceIndex, 1);

            // 새 위치에 삽입 (인덱스 조정)
            const finalInsertIndex = insertIndex > sourceIndex ? insertIndex - 1 : insertIndex;
            plans.splice(finalInsertIndex, 0, movedItem);

            newDayData[sourceDay].plans = plans;
            return newDayData;
          });
        }
      } else {
        // 다른 Day로 이동
        const newDayData = { ...dayData };


        // 소스에서 제거
        const [movedItem] = newDayData[sourceDay].plans.splice(sourceIndex, 1);

        // 타겟에 삽입 (새로운 key 생성)
        const newItem = {
          ...movedItem,
          day: targetDay,
          key: `${targetDay}-${Date.now()}`
        };
        newDayData[targetDay].plans.splice(insertIndex, 0, newItem);

        setDayData(newDayData);
      }
    }
    // 🎯 Floating 카드 제거
    if (floatingPortal) {
      Animated.timing(floatingOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        floatingPortal.setFloatingElement(null);
        setFloatingCardData(null);
      });
    }

    // Pan 리셋
    floatingPan.setValue({ x: 0, y: 0 });
    setDraggingItem(null);
  }, [draggingItem, getDropTarget, stopAutoScroll, floatingPortal]);

  // Day 컬럼 렌더링
  const renderDayColumn = (dayId: string, index: number) => {
    const day = dayData[dayId];
    if (!day) return null;

    return (
      <View
        key={dayId}
        style={[styles.dayColumn, index > 0 && styles.dayColumnSpacing]}
        onLayout={(event) => measureDay(dayId, event)}
        ref={(ref) => {
          if (ref) {
            dayRefs.current[dayId] = ref;
          }
        }}
      >
        {/* Day 헤더 */}
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>{day.title}</Text>
        </View>

        {/* 계획 리스트 */}
        <View style={styles.dayContent}>
          {day.plans.length === 0 ? (
            // 비어있는 day의 경우 드롭 영역 표시
            <View style={[
              styles.emptyDayDropZone,
              draggingItem && styles.emptyDayDropZoneHighlight // 드래그 중일 때 하이라이트
            ]}>
              <Text style={styles.emptyDayText}>
                여기에 일정을 드래그하세요
              </Text>
            </View>
          ) : (
            day.plans.map((plan, planIndex) => (
              <Fragment key={plan.key}>
                <View
                  onLayout={(event) => measureCard(dayId, planIndex, event)}
                >
                  <DraggablePlanCard
                    key={plan.key}
                    item={plan}
                    index={planIndex}
                    dayId={dayId}
                    isLast={planIndex === day.plans.length - 1}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    isDragging={draggingItem?.item.key === plan.key}
  
                  />
                </View>
              </Fragment>
            ))
          )}
        </View>
      </View>
    );
  };
  // 메인 컴포넌트 return
  return (
    <View style={styles.container} ref={containerRef}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setScrollViewLayout({ y, height });
        }}
      >
        {Object.keys(dayData).sort().map((dayId, index) => renderDayColumn(dayId, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    position: 'relative',
  },
  dayColumn: {
    width: '100%',
  },
  dayColumnSpacing: {
    marginTop: 20,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#1A202C',
  },
  countBadge: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#4A5568',
  },
  dayContent: {
    paddingLeft: 12,
    marginBottom: 32,
  },
  cardContainer: {
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  leftContainer: {
    alignItems: 'center',
  },
  line: {
    width: 1,
    backgroundColor: '#DDE1E6',
    paddingBottom: 19,
  },
  indexCircle: {
    width: 24,
    height: 24,
    borderWidth: 0.8,
    borderColor: '#93BEF9',
    backgroundColor: '#ECF4FE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  index: {
    color: '#3A88F4',
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
  },
  rightContainer: {
    flex: 1,
    gap: 12.5,
  },
  type: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#1A202C',
  },
  card: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  imageText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Pretendard-Medium',
  },
  cardTextContainer: {
    flex: 1,
    gap: 4,
    maxWidth: '60%',
  },
  place: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#1A202C',
    flexShrink: 1,
  },
  address: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#747474',
    flexShrink: 1,
  },
  portal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  emptyDayDropZone: {
    minHeight: 100,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: '#F9FAFB',
  },

  emptyDayText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
  },

  // 드래그 중일 때 비어있는 영역 하이라이트
  emptyDayDropZoneHighlight: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
});

export default TravelPlanKanban;