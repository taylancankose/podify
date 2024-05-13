import colors from '@utils/colors';
import React, {FC} from 'react';
import {StyleSheet, Pressable, Text} from 'react-native';
import Loader from './Loader';

interface Props {
  title: string;
  onPress?(): void;
  disabled?: boolean;
  loading?: boolean;
  borderRadius?: number;
}

const AppButton: FC<Props> = props => {
  return (
    <Pressable
      onPress={props.onPress}
      style={[
        styles.container,
        {
          borderRadius: props.borderRadius || 25,
        },
      ]}
      disabled={props.disabled}>
      {!props.loading ? (
        <Text style={styles.title}>{props.title}</Text>
      ) : (
        <Loader />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default AppButton;
