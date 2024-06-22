import colors from '@utils/colors';
import React, {FC} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import {useGetUploadsByProfile} from 'src/hooks/query';

interface Props {}

const UploadTab: FC<Props> = props => {
  const {data, isLoading} = useGetUploadsByProfile();

  const getSource = (poster?: string) => {
    return poster ? {uri: poster} : require('../../assets/music_small.png');
  };
  return (
    <ScrollView style={styles.container}>
      {data?.map(item => {
        return (
          <Pressable key={item.id} style={styles.listItem}>
            <Image source={getSource(item.poster)} style={styles.poster} />
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {item.title}
              </Text>
              <Text style={styles.owner} numberOfLines={1} ellipsizeMode="tail">
                {item.owner.name}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.OVERLAY,
    marginBottom: 15,
    borderRadius: 5,
  },
  titleContainer: {
    flex: 1,
  },
  poster: {
    width: 60,
    aspectRatio: 1,
    marginRight: 8,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '700',
  },
  owner: {
    color: colors.SECONDARY,
    fontWeight: '700',
  },
});

export default UploadTab;
