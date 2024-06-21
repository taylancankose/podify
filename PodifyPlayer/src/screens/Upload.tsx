import CategorySelector from '@components/CategorySelector';
import FileSelector from '@components/FileSelector';
import AppButton from '@ui/AppButton';
import Progress from '@ui/Progress';
import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';
import {categories} from '@utils/audio_category';
import colors from '@utils/colors';
import {mapRange} from '@utils/math';
import {audioInfoSchema} from '@utils/schemas';
import React, {FC, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  Pressable,
} from 'react-native';
import {DocumentPickerResponse, types} from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import catchError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {updateNotification} from 'src/store/notification';

interface FormFields {
  title: string;
  category: string;
  about: string;
  file?: DocumentPickerResponse;
  poster?: DocumentPickerResponse;
}

const defaultForm: FormFields = {
  title: '',
  category: '',
  about: '',
  file: undefined,
  poster: undefined,
};

interface Props {}

const Upload: FC<Props> = props => {
  const [modal, setModal] = useState<boolean>(false);
  const [audioInfo, setAudioInfo] = useState(defaultForm);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleUpload = async () => {
    setLoading(true);
    try {
      const data = await audioInfoSchema.validate(audioInfo);
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('about', data.about);
      formData.append('category', data.category);
      formData.append('file', {
        name: data.file.name,
        type: data.file.type,
        uri: data.file.uri,
      });
      if (data.poster.uri)
        formData.append('poster', {
          name: data.poster.name,
          type: data.poster.type,
          uri: data.poster.uri,
        });
      console.log(formData['_parts']);

      const client = await getClient({'Content-Type': 'multipart/form-data;'});
      const res = await client.post('/audio/create', formData, {
        onUploadProgress(progressEvent) {
          const uploaded = mapRange({
            inputMin: 0,
            inputMax: progressEvent.total || 0,
            outputMin: 0,
            outputMax: 100,
            inputValue: progressEvent.loaded,
          });

          if (uploaded >= 100) {
            setAudioInfo(defaultForm);
            setLoading(false);
          }

          setUploadProgress(Math.floor(uploaded));
        },
      });
      console.log(res.data);
    } catch (error) {
      const errorMsg = catchError(error);
      dispatch(updateNotification({message: errorMsg, type: 'error'}));
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.fileSelectorContainer}>
        <FileSelector
          options={{type: [types.images]}}
          icon={
            <Icon name="image-outline" size={35} color={colors.SECONDARY} />
          }
          btnTitle="Select Poster"
          onSelect={poster => setAudioInfo({...audioInfo, poster})}
        />
        <FileSelector
          options={{type: [types.audio]}}
          icon={
            <Icon
              name="file-image-outline"
              size={35}
              color={colors.SECONDARY}
            />
          }
          btnTitle="Select Audio"
          style={{
            marginLeft: 20,
          }}
          onSelect={file => setAudioInfo({...audioInfo, file})}
        />
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Title"
          style={styles.input}
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          onChangeText={text => setAudioInfo({...audioInfo, title: text})}
          value={audioInfo.title}
        />

        <Pressable
          onPress={() => setModal(true)}
          style={styles.categorySelector}>
          <Text style={styles.categorySelectorTitle}>Category</Text>
          <Text style={styles.selectedCategory}>{audioInfo.category}</Text>
        </Pressable>

        <TextInput
          placeholder="About"
          style={[styles.input, {textAlignVertical: 'top'}]}
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          multiline
          numberOfLines={6}
          onChangeText={text => setAudioInfo({...audioInfo, about: text})}
          value={audioInfo.about}
        />

        <CategorySelector
          visible={modal}
          onRequestClose={() => setModal(false)}
          title="Category"
          data={categories}
          renderItem={item => {
            return <Text style={styles.category}>{item}</Text>;
          }}
          onSelect={item => setAudioInfo({...audioInfo, category: item})}
        />

        {loading ? (
          <View style={{marginVertical: 20}}>
            <Progress progress={uploadProgress} />
          </View>
        ) : null}

        <AppButton
          loading={loading}
          title="Submit"
          borderRadius={7}
          onPress={handleUpload}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
  },
  fileSelectorContainer: {
    flexDirection: 'row',
  },
  formContainer: {
    marginTop: 20,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  categorySelectorTitle: {
    color: colors.CONTRAST,
  },
  selectedCategory: {
    color: colors.SECONDARY,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    padding: 8,
    fontSize: 18,
    color: colors.CONTRAST,
    marginBottom: 20,
  },
  category: {
    padding: 10,
    color: colors.PRIMARY,
  },
});

export default Upload;
