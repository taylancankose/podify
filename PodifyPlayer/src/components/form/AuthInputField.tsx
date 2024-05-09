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
} from 'react-native';

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
}

const AuthInputField: FC<Props> = props => {
  const {handleChange, values, errors, touched} = useFormikContext<{
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
  } = props;

  const errorMsg = touched[name] && errors[name] ? errors[name] : '';

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
        onChangeText={handleChange(name)}
        value={values[name]}
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
