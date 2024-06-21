import BasicModalContainer from '@ui/BasicModalContainer';
import colors from '@utils/colors';
import React, {FC, ReactNode} from 'react';
import {Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Playlist} from 'src/@types/audio';

interface Props {
  visible: boolean;
  onRequestClose(): void;
  list: Playlist[];
  onCreateNewPress(): void;
  onPlaylistPress(item: Playlist): void;
}

interface ListItemProps {
  title: string;
  icon: ReactNode;
  onPress?(): void;
}

const ListItem: FC<ListItemProps> = ({title, icon, onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.listItemContainer}>
      {icon}
      <Text style={styles.listItemTitle}>{title}</Text>
    </Pressable>
  );
};

const PlaylistModal: FC<Props> = ({
  visible,
  onRequestClose,
  list,
  onCreateNewPress,
  onPlaylistPress,
}) => {
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      <ScrollView>
        {list.map(item => (
          <ListItem
            key={item.id}
            onPress={() => onPlaylistPress(item)} // Adjust this line as needed
            title={item.title}
            icon={
              <FontAwesomeIcon
                size={20}
                name={item.visibility === 'public' ? 'globe' : 'lock'}
                color={colors.PRIMARY}
              />
            }
          />
        ))}
      </ScrollView>
      <ListItem
        title="Create New"
        icon={<AntDesign size={20} name="plus" color={colors.PRIMARY} />}
        onPress={onCreateNewPress}
      />
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {flexDirection: 'row', alignItems: 'center', height: 45},
  listItemTitle: {fontSize: 16, color: colors.PRIMARY, marginLeft: 5},
  container: {},
});

export default PlaylistModal;
