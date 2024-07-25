import colors from '@utils/colors';
import React, {FC, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  delay: number;
  height: number;
}

const AnimatedStroke: FC<Props> = ({delay, height}) => {
  const sharedValue = useSharedValue(5);
  const heightStyle = useAnimatedStyle(() => {
    return {
      height: sharedValue.value,
    };
  });
  useEffect(() => {
    sharedValue.value = withDelay(
      delay,
      withRepeat(withTiming(height), -1, true),
    ); // repeat at every 20 sec, infinite reverse true
    // içine height alıyor
  }, []);
  return <Animated.View style={[styles.stroke, heightStyle]} />;
};

const styles = StyleSheet.create({
  stroke: {
    width: 4,
    backgroundColor: colors.CONTRAST,
    marginRight: 5,
  },
});

export default AnimatedStroke;
