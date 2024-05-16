import React, {FC, ReactNode} from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';
import AppNotif from './AppNotif';

interface Props {
  children: ReactNode;
}

const AppContainer: FC<Props> = props => {
  return (
    <SafeAreaView style={styles.container}>
      <AppNotif />
      {props.children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppContainer;
