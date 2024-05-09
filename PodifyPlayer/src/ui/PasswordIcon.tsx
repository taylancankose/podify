import colors from '@utils/colors';
import React = require('react');
import {FC} from 'react';
import Icon from 'react-native-vector-icons/Entypo';

interface Props {
  privateIcon: boolean;
}

const PasswordIcon: FC<Props> = ({privateIcon}) => {
  return privateIcon ? (
    <Icon name="eye" color={colors.SECONDARY} size={18} />
  ) : (
    <Icon name="eye-with-line" color={colors.SECONDARY} size={18} />
  );
};

export default PasswordIcon;
