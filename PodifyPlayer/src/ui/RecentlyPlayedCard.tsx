import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import PlayAnimation from './PlayAnimation';

interface Props {
  title: string;
  poster?: string;
  onPress?(): void;
  isPlaying?: boolean;
}

const RecentlyPlayedCard: FC<Props> = ({
  title,
  poster,
  onPress,
  isPlaying = false,
}) => {
  const source = poster ? {uri: poster} : require('../assets/music.png');

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View>
        <Image source={source} style={styles.poster} />
      </View>
      <PlayAnimation visible={isPlaying} />
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.OVERLAY,
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  poster: {
    width: 50,
    height: 50,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '500',
    paddingHorizontal: 6,
  },
});

export default RecentlyPlayedCard;
