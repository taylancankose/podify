import {
  Text,
  Pressable,
  Image,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {FC} from 'react';
import colors from '@utils/colors';
import PlayAnimation from './PlayAnimation';

interface Props {
  title: string;
  poster?: string;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  onLongPress?: () => void;
  playing?: boolean;
}

const AudioCard: FC<Props> = ({
  title,
  poster,
  onPress,
  containerStyle,
  onLongPress,
  playing = false,
}) => {
  const source = poster ? {uri: poster} : require('../assets/music.png');
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.container, containerStyle]}>
      <View>
        <Image source={source} style={styles.poster} />
        <PlayAnimation visible={playing} />
      </View>
      <Text ellipsizeMode="tail" style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {width: 100, marginRight: 15},
  poster: {width: '100%', aspectRatio: 1, borderRadius: 7},
  title: {
    color: colors.CONTRAST,
    fontWeight: '500',
    marginTop: 5,
  },
});

export default AudioCard;
