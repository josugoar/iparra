import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  IOSReferenceFrame,
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function App() {
  const rotation = useAnimatedSensor(SensorType.ROTATION, {
    iosReferenceFrame: IOSReferenceFrame.XMagneticNorthZVertical,
  });

  useEffect(() => {
    return () => {
      rotation.unregister();
    };
  }, []);

  const heading = useSharedValue(0);

  useDerivedValue(() => {
    const tau = 2 * Math.PI;
    let delta = (rotation.sensor.value.yaw - heading.value) % tau;
    if (delta > Math.PI) {
      delta -= tau;
    } else if (delta < -Math.PI) {
      delta += tau;
    }
    heading.value = withSpring(heading.value + delta);
  });

  const compassNeedleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${heading.value}rad` }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("./assets/compass-needle.png")}
        style={compassNeedleStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
