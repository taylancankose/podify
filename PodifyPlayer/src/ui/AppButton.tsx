import colors from '@utils/colors';
import React, {FC} from 'react';
import {StyleSheet, Pressable, Text} from 'react-native';

interface Props {
  title: string;
  onPress?(): void;
  disabled?: boolean;
}

const AppButton: FC<Props> = props => {
  return (
    <Pressable
      onPress={props.onPress}
      style={styles.container}
      disabled={props.disabled}>
      <Text style={styles.title}>{props.title}</Text>
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
    borderRadius: 25,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default AppButton;
