import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, Pressable, Image, FlatList} from 'react-native';
import {Playlist} from 'src/@types/audio';
import {useGetRecommendedPlaylist} from 'src/hooks/query';

interface Props {
  onListPress(item: Playlist): void;
}

const RecommendedPlaylist: FC<Props> = ({onListPress}) => {
  const {data, isLoading} = useGetRecommendedPlaylist();

  return (
    <View style={{marginVertical: 10}}>
      <Text style={styles.title}>Playlists for You</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <Pressable
              onPress={() => onListPress(item)}
              style={styles.container}>
              <Image
                source={require('../assets/music.png')}
                style={styles.img}
              />
              <View style={styles.overlay}>
                <Text style={styles.playlistTitle}>{item.title}</Text>
                <Text style={styles.playlistTitle}>{item.itemsCount}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const cardSize = 150;

const styles = StyleSheet.create({
  container: {
    width: cardSize,
    marginRight: 14,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  img: {
    width: cardSize,
    height: cardSize,
    borderRadius: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.OVERLAY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  playlistTitle: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default RecommendedPlaylist;
