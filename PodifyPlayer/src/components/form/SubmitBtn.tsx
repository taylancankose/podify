import AppButton from '@ui/AppButton';
import {useFormikContext} from 'formik';
import React, {FC} from 'react';

interface Props {
  title: string;
}

const SubmitBtn: FC<Props> = props => {
  const {handleSubmit, isSubmitting} = useFormikContext();
  return (
    <AppButton
      loading={isSubmitting}
      onPress={() => handleSubmit()}
      title={props.title}
    />
  );
};

export default SubmitBtn;
