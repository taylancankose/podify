import Circle from '@ui/Circle';
import colors from '@utils/colors';
import React = require('react');
import {FC} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthFormContainer: FC<Props> = ({children, title, subtitle}) => {
  return (
    <View style={styles.container}>
      <Circle position="top-left" size={200} />
      <Circle position="top-right" size={100} />
      <Circle position="bottom-left" size={100} />
      <Circle position="bottom-right" size={200} />

      <View style={styles.titleContainer}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    width: '100%',
  },
  titleContainer: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    color: colors.SECONDARY,
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
  subtitle: {color: colors.CONTRAST},
});

export default AuthFormContainer;
