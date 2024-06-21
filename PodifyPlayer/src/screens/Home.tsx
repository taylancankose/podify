import LatestUploads from '@components/LatestUploads';
import OptionsModal from '@components/OptionsModal';
import RecommendedAudios from '@components/RecommendedAudios';
import React, {FC, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '@utils/colors';
import {AudioData} from 'src/@types/audio';
import client from 'src/api/client';
import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';
import catchError from 'src/api/catchError';
import {useDispatch} from 'react-redux';
import {updateNotification} from 'src/store/notification';
import PlaylistModal from '@components/PlaylistModal';
import PlaylistForm from '@components/form/PlaylistForm';

interface Props {}

const Home: FC<Props> = props => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const [showPlaylistsModal, setShowPlaylistsModal] = useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);

  const dispatch = useDispatch();

  const handleFavoritePress = async () => {
    if (!selectedAudio) return;

    try {
      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

      const response = await client.post(
        `/favorite?audioId=${selectedAudio.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSelectedAudio(undefined);
      setShowOptions(false);
    } catch (error) {
      const errorMsg = catchError(error);
      dispatch(updateNotification({message: errorMsg, type: 'error'}));
      console.error('Error adding to favorite:', error);
    }
  };

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleAddToPlaylist = () => {
    setShowOptions(false);
    setShowPlaylistsModal(true);
  };

  return (
    <View style={styles.container}>
      <LatestUploads
        onAudioPress={item => console.log(item)}
        onAudioLongPress={handleOnLongPress}
      />
      <RecommendedAudios
        onAudioPress={item => console.log(item)}
        onAudioLongPress={handleOnLongPress}
      />
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
        list={[]}
        onCreateNewPress={() => {
          setShowPlaylistsModal(false);
          setShowPlaylistForm(true);
        }}
      />
      <PlaylistForm
        visible={showPlaylistForm}
        onRequestClose={() => {
          setShowPlaylistForm(false);
        }}
      />
    </View>
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
});

export default Home;
