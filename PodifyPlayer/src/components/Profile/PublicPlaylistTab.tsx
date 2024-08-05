import {NativeStackScreenProps} from '@react-navigation/native-stack';
import PlaylistItem from '@ui/PlaylistItem';
import React, {FC} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {Playlist} from 'src/@types/audio';
import {PublicProfileTabParamList} from 'src/@types/navigation';
import {useGetPublicPlaylists} from 'src/hooks/query';
import {
  updatePlaylistVisibility,
  updateSelectedListId,
} from 'src/store/playlistModal';

type Props = NativeStackScreenProps<
  PublicProfileTabParamList,
  'PublicPlaylist'
>;

const PublicPlaylistTab: FC<Props> = props => {
  const {data} = useGetPublicPlaylists(props.route.params.profileId);

  const dispatch = useDispatch();

  const handleOnListPress = (item: Playlist) => {
    dispatch(updateSelectedListId(item.id));
    dispatch(updatePlaylistVisibility(true));
  };

  return (
    <ScrollView style={styles.container}>
      {data?.map(playlist => {
        return (
          <PlaylistItem
            onPress={() => handleOnListPress(playlist)}
            key={playlist.id}
            playlist={playlist}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
});

export default PublicPlaylistTab;
