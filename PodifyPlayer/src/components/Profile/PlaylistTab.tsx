import PlaylistItem from '@ui/PlaylistItem';
import React, {FC} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useGetPlaylist} from 'src/hooks/query';

interface Props {}

const PlaylistTab: FC<Props> = props => {
  const {data, isLoading} = useGetPlaylist();
  return (
    <ScrollView style={styles.container}>
      {data?.map(playlist => {
        return <PlaylistItem key={playlist.id} playlist={playlist} />;
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default PlaylistTab;
