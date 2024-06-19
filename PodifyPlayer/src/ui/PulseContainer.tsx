import React, {FC, ReactNode, useEffect} from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const PulseContainer: FC<Props> = ({children, style}) => {
  const opacitySharedValue = useSharedValue(1);
  const opacity = useAnimatedStyle(() => {
    return {
      opacity: opacitySharedValue.value,
    };
  });

  useEffect(() => {
    opacitySharedValue.value = withRepeat(
      withTiming(0.3, {duration: 1000}),
      -1,
      true,
    );
  }, []);

  return <Animated.View style={[opacity,style]}>{children}</Animated.View>;
};

export default PulseContainer;
