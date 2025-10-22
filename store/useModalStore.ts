// store/useModalStore.ts
import { create } from 'zustand';

type AlertConfig = {
  title: string;
  description?: string;
  description2?: string;
  isError?: boolean;
  pressButtonText?: string;
};

type ConfirmConfig = {
  title: string;
  description?: string;
  description2?: string;
  pressButtonText?: string;
};

type AlertState = AlertConfig & {
  isVisible: boolean;
  resolve?: () => void;
};

type ConfirmState = ConfirmConfig & {
  isVisible: boolean;
  resolve?: (value: boolean) => void;
};

type ModalStore = {
  alert: AlertState;
  confirm: ConfirmState;
  showAlert: (config: AlertConfig) => Promise<void>;
  hideAlert: () => void;
  showConfirm: (config: ConfirmConfig) => Promise<boolean>;
  hideConfirm: (result: boolean) => void;
};

export const useModalStore = create<ModalStore>((set, get) => ({
  alert: {
    isVisible: false,
    title: '',
  },
  confirm: {
    isVisible: false,
    title: '',
  },

  showAlert: (config: AlertConfig) => {
    return new Promise<void>((resolve) => {
      set({
        alert: {
          ...config,
          isVisible: true,
          pressButtonText: config.pressButtonText || '확인',
          resolve,
        },
      });
    });
  },

  hideAlert: () => {
    const { alert } = get();
    if (alert.resolve) {
      alert.resolve();
    }
    set({
      alert: {
        isVisible: false,
        title: '',
      },
    });
  },

  showConfirm: (config: ConfirmConfig) => {
    return new Promise<boolean>((resolve) => {
      set({
        confirm: {
          ...config,
          isVisible: true,
          pressButtonText: config.pressButtonText || '확인',
          resolve,
        },
      });
    });
  },

  hideConfirm: (result: boolean) => {
    const { confirm } = get();
    if (confirm.resolve) {
      confirm.resolve(result);
    }
    set({
      confirm: {
        isVisible: false,
        title: '',
      },
    });
  },
}));