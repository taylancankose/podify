import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  color?: string;
  playing?: boolean;
  onPress?(): void;
}

const PlayPauseBtn: FC<Props> = ({
  color = colors.CONTRAST,
  playing,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} style={styles.btn}>
      {playing ? (
        <AntDesign name="pause" size={24} color={color} />
      ) : (
        <AntDesign name="caretright" size={24} color={color} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  btn: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlayPauseBtn;
