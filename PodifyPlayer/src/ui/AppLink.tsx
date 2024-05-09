import colors from '@utils/colors';
import React = require('react');
import {FC} from 'react';
import {Text} from 'react-native';
import {StyleSheet, Pressable} from 'react-native';

interface Props {
  title: string;
  onPress?(): void;
}

const AppLink: FC<Props> = ({title, onPress}) => {
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.SECONDARY,
    textDecorationLine: 'underline',
  },
});

export default AppLink;
