import AudioListItem from '@ui/AudioListItem';
import React, {FC} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useGetUploadsByProfile} from 'src/hooks/query';

interface Props {}

const UploadTab: FC<Props> = props => {
  const {data, isLoading} = useGetUploadsByProfile();

  return (
    <ScrollView style={styles.container}>
      {data?.map(item => {
        return <AudioListItem audio={item} key={item.id} />;
      })}
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
