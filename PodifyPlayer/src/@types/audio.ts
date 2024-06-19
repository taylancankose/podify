import {categoriesTypes} from '@utils/audio_category';

export interface AudioData {
  id: string;
  title: string;
  about: string;
  category: categoriesTypes;
  file: string;
  poster?: string | undefined;
  owner: {
    name: string;
    id: string;
  };
}
