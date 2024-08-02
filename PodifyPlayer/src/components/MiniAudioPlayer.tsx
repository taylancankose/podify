import colors from '@utils/colors';
import React, {FC, useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import useAudioController from 'src/hooks/useAudioController';
import Loader from '@ui/Loader';
import {mapRange} from '@utils/math';
import {useProgress} from 'react-native-track-player';
import AudioPlayer from './AudioPlayer';
import CurrentAudioList from './CurrentAudioList';
import {useGetIsFav} from 'src/hooks/query';
import {useMutation, useQueryClient} from 'react-query';
import {getClient} from 'src/api/client';

interface Props {}

export const MiniPlayerHeight = 60;

const MiniAudioPlayer: FC<Props> = props => {
  const [playerVisibility, setPlayerVisibility] = useState(false);
  const [showCurrentList, setShowCurrentList] = useState(false);
  const {onGoingAudio} = useSelector(getPlayerState);
  const {isPlaying, isBusy, togglePlayPause} = useAudioController();
  const progress = useProgress();
  const {data: isFav} = useGetIsFav(onGoingAudio?.id || '');
  const queryClient = useQueryClient();

  const toggleIsFavorite = async (id: string) => {
    if (!id) return;
    const client = await getClient();
    await client.post('/favorite?audioId=' + id);
  };

  const favoriteMutation = useMutation({
    mutationFn: async id => toggleIsFavorite(id),
    onMutate: (id: string) => {
      queryClient.setQueryData<boolean>(
        ['favorite', onGoingAudio?.id],
        prevData => !prevData,
      );
    },
  });

  const closePlayerModal = () => {
    setPlayerVisibility(false);
  };

  const showPlayerModal = () => {
    setPlayerVisibility(true);
  };

  const handleOnCurrentListClose = () => {
    setShowCurrentList(false);
  };

  const handleOnListOptionPress = () => {
    closePlayerModal();
    setShowCurrentList(true);
  };

  const poster = onGoingAudio?.poster;
  const source = poster ? {uri: poster} : require('../assets/music.png');
  return (
    <>
      <View
        style={{
          height: 2,
          backgroundColor: colors.SECONDARY,
          width: `${mapRange({
            outputMin: 0,
            outputMax: 100,
            inputMin: 0,
            inputMax: progress.duration,
            inputValue: progress.position,
          })}%`,
        }}
      />
      <View style={styles.container}>
        <Image source={source} style={styles.poster} />

        <Pressable onPress={showPlayerModal} style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>
          <Text style={styles.name}>{onGoingAudio?.owner.name}</Text>
        </Pressable>

        <Pressable
          onPress={() => favoriteMutation.mutate(onGoingAudio?.id || '')}
          style={{paddingHorizontal: 10}}>
          <AntDesign
            name={isFav ? 'heart' : 'hearto'}
            size={24}
            color={colors.CONTRAST}
          />
        </Pressable>
        {isBusy ? (
          <Loader />
        ) : (
          <PlayPauseBtn playing={isPlaying} onPress={togglePlayPause} />
        )}
      </View>

      <AudioPlayer
        visible={playerVisibility}
        onRequestClose={closePlayerModal}
        onListOptionPress={handleOnListOptionPress}
      />

      <CurrentAudioList
        visible={showCurrentList}
        onRequestClose={handleOnCurrentListClose}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: MiniPlayerHeight,
    backgroundColor: colors.PRIMARY,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  poster: {
    height: MiniPlayerHeight - 14,
    width: MiniPlayerHeight - 14,
    borderRadius: 5,
    marginVertical: 'auto',
    marginLeft: 10,
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    padding: 5,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
  name: {
    color: colors.SECONDARY,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
});

export default MiniAudioPlayer;
