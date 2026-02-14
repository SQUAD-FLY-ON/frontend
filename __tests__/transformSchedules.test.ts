import { transformSchedulesToDayData } from '@/libs/schedule/transformSchedulesToDayData';
import { transformDayDataToSchedules } from '@/libs/schedule/transformDayDataToSchedules';
import { DayData, Schedules, TourismType } from '@/types';

describe('transformSchedulesToDayData', () => {
  it('빈 스케줄 배열을 빈 DayData로 변환한다', () => {
    const schedules: Schedules = [];
    const result = transformSchedulesToDayData(schedules);
    expect(result).toEqual({});
  });

  it('단일 날짜 스케줄을 올바르게 변환한다', () => {
    const schedules: Schedules = [
      [
        { id: 1, tourismType: TourismType.ATTRACTION_SPOT, name: '경복궁', fullAddress: '서울시 종로구', longitude: 126.97, latitude: 37.58, phoneNumber: '02-1234', imgUrl: 'img1.jpg' } as any,
      ],
    ];

    const result = transformSchedulesToDayData(schedules);

    expect(result).toHaveProperty('day1');
    expect(result.day1.title).toBe('Day 1');
    expect(result.day1.plans).toHaveLength(1);
    expect(result.day1.plans[0].place).toBe('경복궁');
    expect(result.day1.plans[0].address).toBe('서울시 종로구');
    expect(result.day1.plans[0].day).toBe('day1');
  });

  it('여러 날짜 스케줄을 올바르게 변환한다', () => {
    const schedules: Schedules = [
      [
        { id: 1, tourismType: TourismType.ATTRACTION_SPOT, name: '경복궁', fullAddress: '서울', longitude: 126.97, latitude: 37.58, phoneNumber: '', imgUrl: '' } as any,
      ],
      [
        { id: 2, tourismType: TourismType.RESTAURANT, name: '맛집', fullAddress: '부산', longitude: 129.05, latitude: 35.15, phoneNumber: '', imgUrl: '' } as any,
        { id: 3, tourismType: TourismType.ACCOMMODATION, name: '호텔', fullAddress: '부산', longitude: 129.06, latitude: 35.16, phoneNumber: '', imgUrl: '' } as any,
      ],
    ];

    const result = transformSchedulesToDayData(schedules);

    expect(Object.keys(result)).toHaveLength(2);
    expect(result.day1.plans).toHaveLength(1);
    expect(result.day2.plans).toHaveLength(2);
    expect(result.day2.title).toBe('Day 2');
  });

  it('각 Day에 고유한 색상이 할당된다', () => {
    const schedules: Schedules = [
      [{ id: 1, tourismType: TourismType.ATTRACTION_SPOT, name: 'A', fullAddress: '', longitude: 0, latitude: 0, phoneNumber: '', imgUrl: '' } as any],
      [{ id: 2, tourismType: TourismType.ATTRACTION_SPOT, name: 'B', fullAddress: '', longitude: 0, latitude: 0, phoneNumber: '', imgUrl: '' } as any],
    ];

    const result = transformSchedulesToDayData(schedules);

    expect(result.day1.color).toBeDefined();
    expect(result.day2.color).toBeDefined();
    expect(result.day1.color).not.toBe(result.day2.color);
  });
});

describe('transformDayDataToSchedules', () => {
  it('빈 DayData를 빈 배열로 변환한다', () => {
    const dayData: DayData = {};
    const result = transformDayDataToSchedules(dayData);
    expect(result).toEqual([]);
  });

  it('DayData를 Schedules 형태로 올바르게 변환한다', () => {
    const dayData: DayData = {
      day1: {
        title: 'Day 1',
        color: '#3B82F6',
        plans: [
          {
            key: 'day1-0',
            place: '경복궁',
            address: '서울시 종로구',
            type: TourismType.ATTRACTION_SPOT,
            day: 'day1',
            image: 'img1.jpg',
            id: 1,
            tourismType: TourismType.ATTRACTION_SPOT,
            name: '경복궁',
            fullAddress: '서울시 종로구',
            longitude: 126.97,
            latitude: 37.58,
            phoneNumber: '02-1234',
            imgUrl: 'img1.jpg',
          } as any,
        ],
      },
    };

    const result = transformDayDataToSchedules(dayData);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(1);
    expect(result[0][0].id).toBe(1);
    expect(result[0][0].tourismType).toBe(TourismType.ATTRACTION_SPOT);
  });

  it('day 키가 숫자 순서대로 정렬된다', () => {
    const dayData: DayData = {
      day3: {
        title: 'Day 3',
        plans: [{ key: 'day3-0', place: 'C', address: '', type: 'ATTRACTION_SPOT', day: 'day3', id: 3, tourismType: TourismType.ATTRACTION_SPOT, name: 'C', fullAddress: '', longitude: 0, latitude: 0, phoneNumber: '', imgUrl: '' } as any],
      },
      day1: {
        title: 'Day 1',
        plans: [{ key: 'day1-0', place: 'A', address: '', type: 'ATTRACTION_SPOT', day: 'day1', id: 1, tourismType: TourismType.ATTRACTION_SPOT, name: 'A', fullAddress: '', longitude: 0, latitude: 0, phoneNumber: '', imgUrl: '' } as any],
      },
      day2: {
        title: 'Day 2',
        plans: [{ key: 'day2-0', place: 'B', address: '', type: 'ATTRACTION_SPOT', day: 'day2', id: 2, tourismType: TourismType.ATTRACTION_SPOT, name: 'B', fullAddress: '', longitude: 0, latitude: 0, phoneNumber: '', imgUrl: '' } as any],
      },
    };

    const result = transformDayDataToSchedules(dayData);

    expect(result).toHaveLength(3);
    expect((result[0][0] as any).name).toBe('A');
    expect((result[1][0] as any).name).toBe('B');
    expect((result[2][0] as any).name).toBe('C');
  });
});
