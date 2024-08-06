import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import {AudioData} from 'src/@types/audio';
import PlayAnimation from './PlayAnimation';

interface Props {
  audio: AudioData;
  onPress?(): void;
  onLongPress?(): void;
  isPlaying?: boolean;
}

const AudioListItem: FC<Props> = ({
  audio,
  onPress,
  isPlaying = false,
  onLongPress,
}) => {
  const getSource = (poster?: string) => {
    return poster ? {uri: poster} : require('../assets/music_small.png');
  };

  return (
    <Pressable
      onLongPress={onLongPress}
      onPress={onPress}
      style={styles.listItem}>
      <View>
        <Image source={getSource(audio.poster)} style={styles.poster} />
        <PlayAnimation visible={isPlaying} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {audio.title}
        </Text>
        <Text style={styles.owner} numberOfLines={1} ellipsizeMode="tail">
          {audio.owner.name}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.OVERLAY,
    marginBottom: 15,
    borderRadius: 5,
    overflow: 'hidden',
  },
  titleContainer: {
    flex: 1,
  },
  poster: {
    width: 60,
    aspectRatio: 1,
    marginRight: 8,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '700',
  },
  owner: {
    color: colors.SECONDARY,
    fontWeight: '700',
  },
});

export default AudioListItem;
