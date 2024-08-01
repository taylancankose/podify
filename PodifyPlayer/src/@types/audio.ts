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

export interface Playlist {
  id: string;
  title: string;
  itemsCount: number;
  visibility: 'public' | 'private';
}

export type historyAudio = {
  audioId: string;
  date: string;
  id: string;
  title: string;
};

export interface History {
  date: string;
  audios: historyAudio[];
}
