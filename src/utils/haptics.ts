import * as Haptics from 'expo-haptics';

export function successFeedback(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function errorFeedback(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
