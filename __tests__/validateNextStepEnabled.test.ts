import { validateNextStepEnabled } from '@/libs/schedule/validateNextStepEnabled';
import { ScheduleState } from '@/store/useScheduleStore';
import { Screens } from '@/constants/screens';

// 기본 상태 팩토리
const createDefaultState = (overrides?: Partial<ScheduleState>): ScheduleState => ({
  currentStep: 0,
  currentMarkedDates: {},
  selectedRegion: { key: '', name: '', coordinates: [] },
  selectedActivities: { id: '', imgUrl: '', latitude: 0, longitude: 0, name: '', fullAddress: '' },
  selectedPlaces: [],
  schedule: [],
  dayData: {},
  ...overrides,
});

describe('validateNextStepEnabled', () => {
  describe('SelectDate 단계 (step 0)', () => {
    it('날짜가 선택되지 않으면 false를 반환한다', () => {
      const state = createDefaultState({ currentStep: 0, currentMarkedDates: {} });
      expect(validateNextStepEnabled(state)).toBe(false);
    });

    it('날짜가 선택되면 true를 반환한다', () => {
      const state = createDefaultState({
        currentStep: 0,
        currentMarkedDates: { '2026-03-01': { selected: true } },
      });
      expect(validateNextStepEnabled(state)).toBe(true);
    });

    it('여러 날짜가 선택되어도 true를 반환한다', () => {
      const state = createDefaultState({
        currentStep: 0,
        currentMarkedDates: {
          '2026-03-01': { selected: true },
          '2026-03-02': { selected: true },
          '2026-03-03': { selected: true },
        },
      });
      expect(validateNextStepEnabled(state)).toBe(true);
    });
  });

  describe('SelectAreaRegion 단계 (step 1)', () => {
    it('지역이 선택되지 않으면 false를 반환한다', () => {
      const state = createDefaultState({
        currentStep: 1,
        selectedRegion: { key: '', name: '', coordinates: [] },
      });
      expect(validateNextStepEnabled(state)).toBe(false);
    });

    it('지역이 선택되면 true를 반환한다', () => {
      const state = createDefaultState({
        currentStep: 1,
        selectedRegion: { key: '42', name: '강원도', coordinates: [] },
      });
      expect(validateNextStepEnabled(state)).toBe(true);
    });
  });

  describe('SelectSubRegion 단계 (step 2)', () => {
    it('지역이 선택되지 않으면 false를 반환한다', () => {
      const state = createDefaultState({
        currentStep: 2,
        selectedRegion: { key: '', name: '', coordinates: [] },
      });
      expect(validateNextStepEnabled(state)).toBe(false);
    });

    it('지역이 선택되면 true를 반환한다', () => {
      const state = createDefaultState({
        currentStep: 2,
        selectedRegion: { key: '42', name: '강원도', coordinates: [] },
      });
      expect(validateNextStepEnabled(state)).toBe(true);
    });
  });

  describe('SelectActivity 단계 (step 3)', () => {
    it('액티비티가 선택되지 않으면 false를 반환한다', () => {
      const state = createDefaultState({
        currentStep: 3,
        selectedActivities: { id: '', imgUrl: '', latitude: 0, longitude: 0, name: '', fullAddress: '' },
      });
      expect(validateNextStepEnabled(state)).toBe(false);
    });

    it('액티비티가 선택되면 true를 반환한다', () => {
      const state = createDefaultState({
        currentStep: 3,
        selectedActivities: { id: 'spot-1', imgUrl: '', latitude: 37.5, longitude: 127.0, name: '패러글라이딩', fullAddress: '강원도' },
      });
      expect(validateNextStepEnabled(state)).toBe(true);
    });
  });

  describe('SelectPlace 단계 (step 4)', () => {
    it('장소가 선택되지 않으면 false를 반환한다', () => {
      const state = createDefaultState({
        currentStep: 4,
        selectedPlaces: [],
      });
      expect(validateNextStepEnabled(state)).toBe(false);
    });

    it('장소가 선택되면 true를 반환한다', () => {
      const state = createDefaultState({
        currentStep: 4,
        selectedPlaces: [
          { fullAddress: '서울', id: '1', imgUrl: '', latitude: '37.5', longitude: '127.0', name: '경복궁', phoneNumber: '', tourismType: 'ATTRACTION_SPOT' as any },
        ],
      });
      expect(validateNextStepEnabled(state)).toBe(true);
    });
  });

  describe('기타 단계', () => {
    it('LoadingGenerateSchedule 단계에서는 true를 반환한다', () => {
      const state = createDefaultState({ currentStep: 5 });
      expect(validateNextStepEnabled(state)).toBe(true);
    });

    it('AIRecommendPlan 단계에서는 true를 반환한다', () => {
      const state = createDefaultState({ currentStep: 6 });
      expect(validateNextStepEnabled(state)).toBe(true);
    });
  });
});
