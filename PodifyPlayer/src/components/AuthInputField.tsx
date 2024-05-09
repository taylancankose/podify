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
  errorMsg?: string;
  value?: string;
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
    errorMsg,
    value,
  } = props;
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
      </View>
      <AppInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        onChangeText={onChange}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
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
});

export default AuthInputField;
