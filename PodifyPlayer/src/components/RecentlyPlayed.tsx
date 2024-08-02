import GridView from '@ui/GridView';
import PulseContainer from '@ui/PulseContainer';
import RecentlyPlayedCard from '@ui/RecentlyPlayedCard';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {useGetRecentlyPlayed} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';

interface Props {}

const dummyData = new Array(4).fill('');
const RecentlyPlayed: FC<Props> = props => {
  const {data, isLoading} = useGetRecentlyPlayed();
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();

  if (isLoading) {
    return (
      <PulseContainer>
        <GridView
          data={dummyData}
          renderItem={() => {
            return <View style={styles.dummyView} />;
          }}
        />
      </PulseContainer>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Played</Text>
      <GridView
        data={data || []}
        renderItem={item => {
          return (
            <View key={item.id} style={styles.listContainer}>
              <RecentlyPlayedCard
                title={item.title}
                poster={item.poster}
                onPress={() => onAudioPress(item, data || [])}
                isPlaying={onGoingAudio?.id === item.id}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dummyView: {
    height: 50,
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderRadius: 5,
    marginBottom: 10,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listContainer: {
    marginBottom: 10,
  },
});

export default RecentlyPlayed;
