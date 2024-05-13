import colors from '@utils/colors';
import React, {FC} from 'react';
import {Text} from 'react-native';
import {StyleSheet, Pressable} from 'react-native';
import Loader from './Loader';

interface Props {
  title: string;
  onPress?(): void;
  loading?: boolean;
  active?: boolean;
}

const AppLink: FC<Props> = ({title, onPress, loading, active = true}) => {
  return (
    <Pressable
      onPress={active ? onPress : null}
      style={{opacity: active ? 1 : 0.4}}>
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
