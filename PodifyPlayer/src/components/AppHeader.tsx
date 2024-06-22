import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  title: string;
}

const AppHeader: FC<Props> = ({title}) => {
  return (
    <View style={styles.container}>
      <Pressable>
        <AntDesign name="arrowleft" size={24} color={colors.CONTRAST} />
      </Pressable>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.PRIMARY,
    height: 45,
    padding: 10,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default AppHeader;
