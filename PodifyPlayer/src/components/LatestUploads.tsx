import AudioCard from '@ui/AudioCard';
import PulseContainer from '@ui/PulseContainer';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {useFetchLatestAudios} from 'src/hooks/query';

interface Props {}

const dummyData = new Array(4).fill('');
const LatestUploads: FC<Props> = props => {
  const {data, isLoading} = useFetchLatestAudios();

  if (isLoading)
    return (
      <PulseContainer style={styles.container}>
        <View style={styles.container}>
          <View style={styles.dummyTitleView} />
          <View style={styles.dummyAudioContainer}>
            {dummyData.map((_, index) => {
              return <View key={index} style={styles.dummyAudioView} />;
            })}
          </View>
        </View>
      </PulseContainer>
    );
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest Uploads</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {data?.map(item => {
          return (
            <AudioCard key={item.id} title={item.title} poster={item.poster} />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dummyTitleView: {
    height: 20,
    width: 150,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginBottom: 15,
    borderRadius: 5,
  },
  dummyAudioContainer: {
    flexDirection: 'row',
  },
  dummyAudioView: {
    height: 100,
    width: 100,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginRight: 15,
    borderRadius: 5,
  },
});

export default LatestUploads;
