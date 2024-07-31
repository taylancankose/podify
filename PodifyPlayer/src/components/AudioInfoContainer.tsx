import AppLink from '@ui/AppLink';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';

interface Props {
  visible: boolean;
  closeHandler(state: boolean): void;
}

const AudioInfoContainer: FC<Props> = ({visible, closeHandler}) => {
  const {onGoingAudio} = useSelector(getPlayerState);
  if (!visible) return null;

  const handleClose = () => {
    closeHandler(!visible);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeBtn} onPress={handleClose}>
        <AntDesign name="close" color={colors.CONTRAST} size={24} />
      </Pressable>
      <ScrollView>
        <View>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>
          <View style={styles.ownerInfo}>
            <Text style={[styles.title, {marginRight: 8}]}>Created By:</Text>
            <AppLink title={onGoingAudio.owner.name || ''} />
          </View>
          <Text style={styles.about}>{onGoingAudio?.about}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    color: colors.CONTRAST,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  about: {
    fontSize: 14,
    color: colors.CONTRAST,
    paddingVertical: 5,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AudioInfoContainer;
