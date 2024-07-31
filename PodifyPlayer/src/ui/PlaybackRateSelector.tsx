import colors from '@utils/colors';
import React, {FC, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  activeRate?: string;
  onPress?(rate: number): void;
}

const speedRates = ['0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2'];
const selectorSize = 40;

const PlaybackRateSelector: FC<Props> = ({
  containerStyle,
  activeRate,
  onPress,
}) => {
  const [showButton, setShowButton] = useState(true);
  const width = useSharedValue(0);

  const handleOnPress = () => {
    setShowButton(false);
    width.value = withTiming(selectorSize * speedRates.length, {
      duration: 70,
    });
  };

  const widthStyles = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      {showButton ? (
        <Pressable onPress={handleOnPress}>
          <FontAwesome5 name="running" color={colors.CONTRAST} size={24} />
        </Pressable>
      ) : (
        <Animated.View style={[styles.buttons, widthStyles]}>
          {speedRates.map(item => (
            <Selector
              value={item}
              key={item}
              active={activeRate === item}
              onPress={() => onPress && onPress(+item)}
            />
          ))}
        </Animated.View>
      )}
    </View>
  );
};

interface SelectorProps {
  value: string;
  active?: boolean;
  onPress?(): void;
}

const Selector: FC<SelectorProps> = ({value, active, onPress}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.selector,
        active ? {backgroundColor: colors.SECONDARY} : undefined,
      ]}>
      <Text style={styles.selectorText}>{value}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  buttons: {
    flexDirection: 'row',
    backgroundColor: colors.OVERLAY,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  selector: {
    width: selectorSize,
    height: selectorSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorText: {
    color: colors.CONTRAST,
  },
});

export default PlaybackRateSelector;
