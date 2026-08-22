import { useCameraPermissions } from 'expo-camera';

export function useCameraPermission() {
  const [permission, requestPermission] = useCameraPermissions();
  return {
    isGranted: permission?.granted ?? false,
    isLoading: permission === null,
    requestPermission,
  };
}
