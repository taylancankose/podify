import colors from '@utils/colors';
import {useFormikContext} from 'formik';
import {FC} from 'react';
import React = require('react');
import {StyleSheet, Pressable, Text} from 'react-native';

interface Props {
  title: string;
}

const SubmitBtn: FC<Props> = props => {
  const {handleSubmit} = useFormikContext();
  return (
    <Pressable onPress={() => handleSubmit()} style={styles.btn}>
      <Text style={styles.btnText}>{props.title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginTop: 14,
    backgroundColor: colors.SECONDARY,
    paddingHorizontal: 2,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  btnText: {
    color: colors.CONTRAST,
    fontWeight: '600',
  },
});

export default SubmitBtn;
