import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import React, {FC} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {useGetUploadsByProfile} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';

interface Props {}

const UploadTab: FC<Props> = props => {
  const {onGoingAudio} = useSelector(getPlayerState);
  const {data, isLoading} = useGetUploadsByProfile();
  const {onAudioPress} = useAudioController();

  if (isLoading) {
    return <AudioListLoadingUI />;
  }

  return (
    <ScrollView style={styles.container}>
      {data.length > 0 ? (
        data?.map(item => {
          return (
            <AudioListItem
              onPress={() => onAudioPress(item, data)}
              audio={item}
              key={item.id}
              isPlaying={onGoingAudio.id === item.id}
            />
          );
        })
      ) : (
        <EmptyRecords title="There is no audio" />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default UploadTab;
