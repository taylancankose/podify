import React, {FC} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import PulseContainer from './PulseContainer';
import colors from '@utils/colors';

interface Props {
  items?: number;
}

const AudioListLoadingUI: FC<Props> = ({items = 8}) => {
  const dummyData = new Array(items).fill('');
  return (
    <PulseContainer style={styles.container}>
      <View>
        {dummyData.map((_, index) => {
          return <View key={index} style={styles.dummyListItem} />;
        })}
      </View>
    </PulseContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dummyListItem: {
    height: 50,
    width: '100%',
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default AudioListLoadingUI;
