import LatestUploads from '@components/LatestUploads';
import OptionsModal from '@components/OptionsModal';
import RecommendedAudios from '@components/RecommendedAudios';
import React, {FC, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '@utils/colors';
import {AudioData, Playlist} from 'src/@types/audio';
import {getClient} from 'src/api/client';
import catchError from 'src/api/catchError';
import {useDispatch} from 'react-redux';
import {updateNotification} from 'src/store/notification';
import PlaylistModal from '@components/PlaylistModal';
import PlaylistForm, {PlaylistInfo} from '@components/form/PlaylistForm';
import {useGetPlaylist} from 'src/hooks/query';
import TrackPlayer, {Track} from 'react-native-track-player';
import useAudioController from 'src/hooks/useAudioController';
import AppView from '@components/AppView';
import RecentlyPlayed from '@components/RecentlyPlayed';
import RecommendedPlaylist from '@components/RecommendedPlaylist';

interface Props {}

const Home: FC<Props> = props => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const [showPlaylistsModal, setShowPlaylistsModal] = useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const {onAudioPress} = useAudioController();

  const {data} = useGetPlaylist();

  const dispatch = useDispatch();

  const handleFavoritePress = async () => {
    if (!selectedAudio) return;

    try {
      const client = await getClient();

      const {data} = await client.post(`/favorite?audioId=${selectedAudio.id}`);
    } catch (error) {
      const errorMsg = catchError(error);
      dispatch(updateNotification({message: errorMsg, type: 'error'}));
      console.error('Error adding to favorite:', error);
    }

    setSelectedAudio(undefined);
    setShowOptions(false);
  };

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleAddToPlaylist = () => {
    setShowOptions(false);
    setShowPlaylistsModal(true);
  };

  const handlePlaylistSubmit = async (value: PlaylistInfo) => {
    if (!value.title.trim()) return;
    try {
      const client = await getClient();
      const {data} = await client.post('/playlist/create', {
        resId: selectedAudio?.id,
        title: value.title,
        visibility: value.private ? 'private' : 'public',
      });
    } catch (error) {
      const errMsg = catchError(error);
      console.log(errMsg);
    }
  };

  const updatePlaylist = async (item: Playlist) => {
    try {
      const client = await getClient();
      const {data} = await client.patch('/playlist', {
        id: item.id,
        item: selectedAudio?.id,
        title: item.title,
        visibility: item.visibility,
      });

      setSelectedAudio(undefined);
      setShowPlaylistsModal(false);
      dispatch(
        updateNotification({message: 'New audio added', type: 'success'}),
      );
    } catch (error) {
      const errMsg = catchError(error);
      console.log(errMsg);
    }
  };

  return (
    <AppView>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.space}>
          <RecentlyPlayed />
        </View>
        <View style={styles.space}>
          <LatestUploads
            onAudioPress={onAudioPress}
            onAudioLongPress={handleOnLongPress}
          />
        </View>
        <View style={styles.space}>
          <RecommendedAudios
            onAudioPress={onAudioPress}
            onAudioLongPress={handleOnLongPress}
          />
        </View>

        <View style={styles.space}>
          <RecommendedPlaylist />
        </View>

        <OptionsModal
          visible={showOptions}
          onRequestClose={() => {
            setShowOptions(false);
          }}
          options={[
            {
              title: 'Add to playlist',
              icon: 'playlist-music',
              onPress: handleAddToPlaylist,
            },
            {
              title: 'Add to favorite',
              icon: 'cards-heart',
              onPress: handleFavoritePress,
            },
          ]}
          renderItem={item => {
            return (
              <Pressable onPress={item.onPress} style={styles.optionContainer}>
                <MaterialCommunityIcons
                  size={20}
                  name={item.icon}
                  color={colors.PRIMARY}
                />
                <Text style={styles.optionTitle}>{item.title}</Text>
              </Pressable>
            );
          }}
        />

        <PlaylistModal
          visible={showPlaylistsModal}
          onRequestClose={() => {
            setShowPlaylistsModal(false);
          }}
          list={data || []}
          onCreateNewPress={() => {
            setShowPlaylistsModal(false);
            setShowPlaylistForm(true);
          }}
          onPlaylistPress={updatePlaylist}
        />
        <PlaylistForm
          visible={showPlaylistForm}
          onRequestClose={() => {
            setShowPlaylistForm(false);
          }}
          onSubmit={handlePlaylistSubmit}
        />
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 12,
  },
  optionTitle: {color: colors.PRIMARY, fontSize: 16, marginLeft: 4},
  space: {
    marginBottom: 15,
  },
});

export default Home;
