import colors from '@utils/colors';
import React, {FC, useEffect} from 'react';
import {Text, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {getNotificationState, updateNotification} from 'src/store/notification';

interface Props {}

const AppNotif: FC<Props> = props => {
  const {message, type} = useSelector(getNotificationState);
  const height = useSharedValue(0);
  const dispatch = useDispatch();

  const heightStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  let backgroundColor = colors.ERROR;
  let textColor = colors.CONTRAST;

  switch (type) {
    case 'success':
      backgroundColor = colors.SUCCESS;
      textColor = colors.PRIMARY;
      break;
  }

  useEffect(() => {
    let timeoutId: any = 0;
    const animationStarts = () =>
      (height.value = withTiming(45, {
        duration: 200,
      }));
    timeoutId = setTimeout(() => {
      height.value = withTiming(0, {
        duration: 200,
      });

      dispatch(updateNotification({message: '', type}));
    }, 3000);

    if (message) animationStarts();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message]);

  return (
    <Animated.View style={[styles.container, {backgroundColor}, heightStyle]}>
      <Text style={[styles.message, {color: textColor}]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    alignItems: 'center',
  },
});

export default AppNotif;
