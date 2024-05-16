import React, {FC} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useDispatch} from 'react-redux';
import {updateNotification} from 'src/store/notification';

interface Props {}

const Home: FC<Props> = props => {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button
        title="Test"
        onPress={() =>
          dispatch(
            updateNotification({message: 'Test message', type: 'success'}),
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Home;
