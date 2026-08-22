import { StyleSheet, View } from 'react-native';

export function CameraOverlay() {
  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.frame} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 16,
  },
});
