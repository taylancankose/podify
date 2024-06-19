import {Text, Pressable, Image, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import colors from '@utils/colors';

interface Props {
  title: string;
  poster?: string;
}

const AudioCard: FC<Props> = ({title, poster}) => {
  const source = poster ? {uri: poster} : require('../assets/music.png');
  return (
    <Pressable
      onPress={() => {
        console.log('On audio press');
      }}
      onLongPress={() => {
        console.log('On audio long press');
      }}
      style={styles.container}>
      <Image source={source} style={styles.poster} />
      <Text ellipsizeMode="tail" style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {width: 100, marginRight: 15},
  poster: {height: 100, aspectRatio: 1, borderRadius: 7},
  title: {
    color: colors.CONTRAST,
    fontWeight: '500',
    fontSize: 16,
    marginTop: 5,
  },
});

export default AudioCard;
