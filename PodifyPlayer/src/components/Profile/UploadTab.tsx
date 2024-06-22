import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import React, {FC} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useGetUploadsByProfile} from 'src/hooks/query';

interface Props {}

const UploadTab: FC<Props> = props => {
  const {data, isLoading} = useGetUploadsByProfile();

  if (isLoading) {
    return <AudioListLoadingUI />;
  }

  return (
    <ScrollView style={styles.container}>
      {data.length > 0 ? (
        data?.map(item => {
          return <AudioListItem audio={item} key={item.id} />;
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
