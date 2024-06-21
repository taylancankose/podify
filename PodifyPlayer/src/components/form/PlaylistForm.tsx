import BasicModalContainer from '@ui/BasicModalContainer';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, TextInput, Pressable} from 'react-native';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  status: 'private';
  visible: boolean;
  onRequestClose(): void;
}

const PlaylistForm: FC<Props> = ({status, visible, onRequestClose}) => {
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      <View>
        <Text style={styles.title}>Create New Playlist</Text>
        <TextInput placeholder="Title" style={styles.input} />
        <Pressable style={styles.privateSelector}>
          {status === 'private' ? (
            <MaterialComIcon name="radiobox-marked" color={colors.PRIMARY} />
          ) : (
            <MaterialComIcon name="radiobox-blank" color={colors.PRIMARY} />
          )}
          <Text style={styles.privateLabel}>Private</Text>
        </Pressable>
        <Pressable style={styles.submitBtn}>
          <Text style={styles.submitBtnLabel}>Create</Text>
        </Pressable>
      </View>
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 18,
    color: colors.PRIMARY,
    fontWeight: '700',
  },
  input: {
    height: 45,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.PRIMARY,
    color: colors.PRIMARY,
  },
  privateSelector: {
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
  },
  privateLabel: {
    color: colors.PRIMARY,
    marginLeft: 5,
  },
  submitBtn: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.PRIMARY,
    borderRadius: 7,
  },
  submitBtnLabel: {
    color: colors.CONTRAST,
    marginLeft: 5,
  },
});

export default PlaylistForm;
