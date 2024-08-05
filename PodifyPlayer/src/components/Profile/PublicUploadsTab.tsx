import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AudioListItem from '@ui/AudioListItem';
import React, {FC} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {PublicProfileTabParamList} from 'src/@types/navigation';
import {useGetPublicUploads} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';

type Props = NativeStackScreenProps<PublicProfileTabParamList, 'PublicUploads'>;

const PublicUploadsTab: FC<Props> = props => {
  const {data} = useGetPublicUploads(props.route.params.profileId);
  const {onAudioPress} = useAudioController();
  const {onGoingAudio} = useSelector(getPlayerState);

  return (
    <ScrollView style={styles.container}>
      {data?.map(item => {
        return (
          <AudioListItem
            onPress={() => onAudioPress(item, data)}
            audio={item}
            key={item.id}
            isPlaying={onGoingAudio.id === item.id}
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

export default PublicUploadsTab;
