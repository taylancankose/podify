import AppInput from '@ui/AppInput';
import colors from '@utils/colors';
import {useFormikContext} from 'formik';
import {FC} from 'react';
import React = require('react');
import {
  View,
  StyleSheet,
  Text,
  TextInputProps,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  name: string;
  placeholder?: string;
  label: string;
  errorMsg?: string;
  value?: string;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: TextInputProps['secureTextEntry'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  containerStyle?: StyleProp<ViewStyle>; // style 'ın kendinden aldık bunu multiplestyle kullanmak için
  rightIcon?: React.ReactNode;
  onRightIconPress?(): void;
}

const AuthInputField: FC<Props> = props => {
  const inputTransformValue = useSharedValue(0);
  const {handleChange, values, errors, touched, handleBlur} = useFormikContext<{
    [key: string]: string;
  }>();
  const {
    label,
    placeholder,
    keyboardType,
    secureTextEntry,
    autoCapitalize,
    containerStyle,
    name,
    rightIcon,
    onRightIconPress,
  } = props;

  const errorMsg = touched[name] && errors[name] ? errors[name] : '';

  const shakeUI = () => {
    inputTransformValue.value = withSequence(
      withTiming(-10, {duration: 50}), // 50 ms
      withSpring(0, {
        damping: 8,
        mass: 0.5,
        stiffness: 1000,
        restDisplacementThreshold: 0.1,
      }), // üstteki bitince bu withSequence ile çağırdığımız için sırayla
    );
  };

  const inputStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: inputTransformValue.value,
        },
      ],
    };
  });

  React.useEffect(() => {
    if (errorMsg) shakeUI();
  }, [errorMsg]);

  return (
    <Animated.View style={[containerStyle, inputStyle]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
      </View>
      <View>
        <AppInput
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          onChangeText={handleChange(name)}
          value={values[name]}
          onBlur={handleBlur(name)}
        />

        {rightIcon ? (
          <Pressable
            onPress={() => onRightIconPress()}
            style={styles.rightIcon}>
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.CONTRAST,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  errorMsg: {
    color: colors.ERROR,
  },
  rightIcon: {
    width: 45,
    height: 45,
    position: 'absolute',
    top: 0,
    right: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthInputField;
