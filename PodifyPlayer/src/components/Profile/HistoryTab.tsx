import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import colors from '@utils/colors';
import React, {FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import {useGetHistory} from 'src/hooks/query';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getClient} from 'src/api/client';
import {useMutation, useQueryClient} from 'react-query';
import {History, historyAudio} from 'src/@types/audio';
import {useNavigation} from '@react-navigation/native';

interface Props {}

const HistoryTab: FC<Props> = props => {
  const {data, isLoading, isFetching} = useGetHistory();
  const queryClient = useQueryClient();
  const [selectedHistories, setSelectedHistories] = useState<string[]>([]);
  const navigation = useNavigation();
  const noData = !data?.length;

  // for slow internet, this will update the ui quickly
  const removeMutate = useMutation({
    mutationFn: async histories => removeHistories(histories),
    onMutate: (histories: string[]) => {
      queryClient.setQueryData<History[]>(['histories'], prevData => {
        let newData: History[] = [];
        if (!prevData) return newData;

        for (let data of prevData) {
          const filteredData = data?.audios?.filter(
            item => !histories.includes(item.id),
          );
          if (filteredData.length) {
            newData.push({date: data?.date, audios: filteredData});
          }
        }
        return newData;
      });
    },
  });

  useEffect(() => {
    const unselectHistories = () => {
      setSelectedHistories([]);
    };
    navigation.addListener('blur', unselectHistories);

    return () => {
      navigation.removeListener('blur', unselectHistories);
    };
  }, []);

  if (isLoading) return <AudioListLoadingUI />;

  const removeHistories = async (histories: string[]) => {
    const client = await getClient();
    await client.delete('/history?histories=' + JSON.stringify(histories));
    queryClient.invalidateQueries({queryKey: ['histories']});
  };

  const handleSingleHistoryRemove = async (history: historyAudio) => {
    removeMutate.mutate([history.id]);
  };

  const handleOnLongPress = (history: historyAudio) => {
    setSelectedHistories([history.id]);
  };

  const handleOnPress = (history: historyAudio) => {
    setSelectedHistories(prevState => {
      if (prevState.includes(history?.id)) {
        return prevState.filter(item => item !== history?.id);
      }
      return [...prevState, history?.id];
    });
  };

  const handleRemoveSelecteds = async () => {
    removeMutate.mutate([...selectedHistories]);
    setSelectedHistories([]);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['histories']});
  };

  return (
    <>
      {selectedHistories.length ? (
        <Pressable onPress={handleRemoveSelecteds} style={styles.removeBtn}>
          <Text style={styles.removeBtnText}>Remove</Text>
        </Pressable>
      ) : null}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleRefresh}
            tintColor={colors.CONTRAST}
          />
        }
        style={styles.container}>
        {noData ? <EmptyRecords title="There is no history" /> : null}
        {data?.map((item, index) => {
          return (
            <View key={item.date + index}>
              <Text style={styles.date}>{item.date}</Text>
              <View style={styles.listContainer}>
                {item.audios.map((audio, i) => {
                  return (
                    <Pressable
                      onLongPress={() => handleOnLongPress(audio)}
                      onPress={() => handleOnPress(audio)}
                      style={[
                        styles.historyContainer,
                        {
                          backgroundColor: selectedHistories.includes(audio.id)
                            ? colors.INACTIVE_CONTRAST
                            : colors.OVERLAY,
                        },
                      ]}
                      key={audio.id + i}>
                      <Text style={styles.historyTitle}>{audio.title}</Text>
                      <Pressable
                        onPress={() => handleSingleHistoryRemove(audio)}>
                        <AntDesign name="close" color={colors.CONTRAST} />
                      </Pressable>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  removeBtn: {
    paddingHorizontal: 20,
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  removeBtnText: {
    color: colors.CONTRAST,
  },
  date: {
    color: colors.SECONDARY,
  },
  historyTitle: {
    color: colors.CONTRAST,
    paddingHorizontal: 5,
    fontWeight: '700',
    flex: 1,
  },
  listContainer: {
    marginTop: 10,
    paddingLeft: 4,
  },
  historyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.OVERLAY,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default HistoryTab;
