import AppInput from '@ui/AppInput';
import colors from '@utils/colors';
import {FC} from 'react';
import React = require('react');
import {
  View,
  StyleSheet,
  Text,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface Props {
  placeholder?: string;
  label: string;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: TextInputProps['secureTextEntry'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  containerStyle?: StyleProp<ViewStyle>; // style 'ın kendinden aldık bunu multiplestyle kullanmak için
  onChange?: (text: string) => void; // this func return nothing
}

const AuthInputField: FC<Props> = props => {
  const {
    label,
    placeholder,
    keyboardType,
    secureTextEntry,
    autoCapitalize,
    containerStyle,
    onChange,
  } = props;
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <AppInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        onChangeText={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {
    color: colors.CONTRAST,
    padding: 5,
  },
});

export default AuthInputField;
