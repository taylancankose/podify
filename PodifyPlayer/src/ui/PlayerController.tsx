import colors from '@utils/colors';
import React, {FC, ReactNode} from 'react';
import {StyleSheet, Pressable} from 'react-native';

interface Props {
  size?: number;
  children?: ReactNode;
  ignoreContainer?: boolean;
  onPress?(): void;
}

const PlayerController: FC<Props> = ({
  ignoreContainer,
  size = 45,
  children,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ignoreContainer ? 'transparent' : colors.CONTRAST,
      }}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default PlayerController;
