import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Form from '@components/form';
import {forgetPasswordSchema} from '@utils/schemas';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/form/AuthFormContainer';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import client from 'src/api/client';
import catchError from 'src/api/catchError';
import {updateNotification} from 'src/store/notification';
import {useDispatch} from 'react-redux';

const initialValues = {
  email: '',
};

interface initialValue {
  email: string;
}

interface Props {}

const ForgotPassword: FC<Props> = props => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const dispatch = useDispatch();
  const handleSubmit = async (values: initialValue, actions) => {
    actions.setSubmitting(true);
    try {
      const {data} = await client.post('/auth/forget-password', {...values});
    } catch (error) {
      const errorMsg = catchError(error);
      dispatch(updateNotification({message: errorMsg, type: 'error'}));
      console.log('forget password error:', error);
    }
    actions.setSubmitting(true);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={forgetPasswordSchema}>
      <AuthFormContainer
        title="Forget Password"
        subtitle="Oops, did you forget your password? Don't worry, we'll help you to get back in.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            placeholder="john@email.com"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <SubmitBtn title="Send Link" />

          <View style={styles.linkContainer}>
            <AppLink
              title="Sign In"
              onPress={() => navigation.navigate('SignIn')}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  marginBottom: {
    marginBottom: 20,
  },
  linkContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
  },
});
export default ForgotPassword;
