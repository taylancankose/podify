import React, {FC, ReactNode} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MiniAudioPlayer from './MiniAudioPlayer';
import useAudioController from 'src/hooks/useAudioController';
import PlaylistAudioModel from './PlaylistAudioModel';

interface Props {
  children: ReactNode;
}

const AppView: FC<Props> = ({children}) => {
  const {isPlayerReady} = useAudioController();
  return (
    <View style={styles.container}>
      <View style={styles.children}>{children}</View>
      {isPlayerReady ? <MiniAudioPlayer /> : null}
      <PlaylistAudioModel />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  children: {
    flex: 1,
  },
});

export default AppView;
