import AudioCard from '@ui/AudioCard';
import GridView from '@ui/GridView';
import PulseContainer from '@ui/PulseContainer';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import {usegetRecommendedAudios} from 'src/hooks/query';
import {getPlayerState} from 'src/store/player';

interface Props {
  onAudioPress(item: AudioData, data: AudioData[]): void;
  onAudioLongPress(item: AudioData, data: AudioData[]): void;
}

const dummyData = new Array(6).fill('');
const RecommendedAudios: FC<Props> = ({onAudioPress, onAudioLongPress}) => {
  const {data = [], isLoading} = usegetRecommendedAudios();
  const {onGoingAudio} = useSelector(getPlayerState);

  const getPoster = (poster?: string) => {
    return poster ? {uri: poster} : require('../assets/music.png');
  };

  if (isLoading)
    return (
      <PulseContainer style={styles.container}>
        <GridView
          column={3}
          data={dummyData}
          renderItem={item => {
            return <View style={styles.dummyAudioView} />;
          }}
        />
      </PulseContainer>
    );
  console.log(onGoingAudio);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Uploads</Text>
      <GridView
        column={3}
        data={data || []}
        renderItem={item => {
          return (
            <AudioCard
              title={item.title}
              poster={item.poster}
              onPress={() => onAudioPress(item, data)}
              onLongPress={() => onAudioLongPress(item, data)}
              containerStyle={{width: '100%'}}
              playing={onGoingAudio?.id === item?.id}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  itemTitle: {
    color: colors.CONTRAST,
    fontWeight: '500',
    fontSize: 16,
    marginTop: 5,
  },
  poster: {width: '100%', aspectRatio: 1, borderRadius: 7},
  dummyAudioView: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderRadius: 7,
  },
});

export default RecommendedAudios;
