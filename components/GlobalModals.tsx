import { useModalStore } from '@/store/useModalStore';
import React from 'react';
import AlertModal from './AlertModal';
import ConfirmModal from './ConfirmModal';

export function GlobalModals() {
  const alert = useModalStore((state) => state.alert);
  const confirm = useModalStore((state) => state.confirm);
  const hideAlert = useModalStore((state) => state.hideAlert);
  const hideConfirm = useModalStore((state) => state.hideConfirm);

  return (
    <>
      {/* Alert Modal */}
      <AlertModal
        isModalVisible={alert.isVisible}
        setIsModalVisible={() => hideAlert()}
        title={alert.title}
        description={alert.description}
        description2={alert.description2}
        onPressConfirm={() => hideAlert()}
        isError = {alert.isError || false}
        pressButtonText={alert.pressButtonText || '확인'}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isModalVisible={confirm.isVisible}
        setIsModalVisible={() => hideConfirm(false)}
        title={confirm.title}
        description={confirm.description}
        description2={confirm.description2}
        onPressConfirm={() => hideConfirm(true)}
        pressButtonText={confirm.pressButtonText || '확인'}
      />
    </>
  );
}