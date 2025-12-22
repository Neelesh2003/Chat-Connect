export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface ModalData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}