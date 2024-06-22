import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface Props {}

const FavoriteTab: FC<Props> = props => {
  return (
    <View style={styles.container}>
      <Text>FavoriteTab</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default FavoriteTab;
