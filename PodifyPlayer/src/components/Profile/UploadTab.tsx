import OptionsModal from '@components/OptionsModal';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import colors from '@utils/colors';
import React, {FC, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  Text,
} from 'react-native';
import {useQueryClient} from 'react-query';
import {useSelector} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import {useGetUploadsByProfile} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';

interface Props {}

const UploadTab: FC<Props> = props => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const {onGoingAudio} = useSelector(getPlayerState);
  const {data, isLoading, isFetching} = useGetUploadsByProfile();
  const queryClient = useQueryClient();
  const {onAudioPress} = useAudioController();

  const navigation =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  if (isLoading) {
    return <AudioListLoadingUI />;
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['upload']});
  };

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleEdit = () => {
    setShowOptions(false);
    if (selectedAudio) {
      navigation.navigate('UpdateAudio', {audio: selectedAudio});
    }
  };
  console.log(selectedAudio);
  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleRefresh}
            tintColor={colors.CONTRAST}
          />
        }
        style={styles.container}>
        {data.length > 0 ? (
          data?.map(item => {
            return (
              <AudioListItem
                onPress={() => onAudioPress(item, data)}
                audio={item}
                key={item.id}
                isPlaying={onGoingAudio?.id === item?.id}
                onLongPress={() => handleOnLongPress(item)}
              />
            );
          })
        ) : (
          <EmptyRecords title="There is no audio" />
        )}
      </ScrollView>

      <OptionsModal
        visible={showOptions}
        onRequestClose={() => {
          setShowOptions(false);
        }}
        options={[
          {
            title: 'Edit',
            icon: 'edit',
            onPress: handleEdit,
          },
        ]}
        renderItem={item => {
          return (
            <Pressable onPress={item.onPress} style={styles.optionContainer}>
              <AntDesign size={20} name={item.icon} color={colors.PRIMARY} />
              <Text style={styles.optionTitle}>{item.title}</Text>
            </Pressable>
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 12,
  },
  optionTitle: {color: colors.PRIMARY, fontSize: 16, marginLeft: 6},
});

export default UploadTab;
