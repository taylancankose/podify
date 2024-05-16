import {isAxiosError} from 'axios';

const catchError = (error: any) => {
  let errorMessage = error.message;

  if (isAxiosError(error)) {
    const errorResponse = error.response?.data;

    if (errorResponse) errorMessage = errorResponse.error;
  }

  return errorMessage;
};

export default catchError;
