import LatestUploads from '@components/LatestUploads';
import RecommendedAudios from '@components/RecommendedAudios';
import PulseContainer from '@ui/PulseContainer';
import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useFetchLatestAudios} from 'src/hooks/query';

interface Props {}

const Home: FC<Props> = props => {
  const {data, isLoading} = useFetchLatestAudios();
  if (isLoading)
    return (
      <PulseContainer style={styles.container}>
        <Text style={{color: 'white', fontSize: 25}}>Loading</Text>
      </PulseContainer>
    );

  return (
    <View style={styles.container}>
      <LatestUploads />
      <RecommendedAudios />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
});

export default Home;
