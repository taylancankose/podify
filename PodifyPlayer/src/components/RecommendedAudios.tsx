import GridView from '@ui/GridView';
import PulseContainer from '@ui/PulseContainer';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import {usegetRecommendedAudios} from 'src/hooks/query';

interface Props {}

const dummyData = new Array(6).fill('');
const RecommendedAudios: FC<Props> = props => {
  const {data, isLoading} = usegetRecommendedAudios();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Uploads</Text>
      <GridView
        column={3}
        data={data || []}
        renderItem={item => {
          return (
            <Pressable>
              <Image source={getPoster(item.poster)} style={styles.poster} />
              <Text
                ellipsizeMode="tail"
                style={styles.itemTitle}
                numberOfLines={2}>
                {item.title}
              </Text>
            </Pressable>
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
