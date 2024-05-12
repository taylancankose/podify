import colors from '@utils/colors';
import React, {FC} from 'react';
import {Text} from 'react-native';
import {StyleSheet, Pressable} from 'react-native';
import Loader from './Loader';

interface Props {
  title: string;
  onPress?(): void;
  loading?: boolean;
}

const AppLink: FC<Props> = ({title, onPress, loading}) => {
  return (
    <Pressable onPress={onPress}>
      {!loading ? <Text style={styles.title}>{title}</Text> : <Loader />}
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
