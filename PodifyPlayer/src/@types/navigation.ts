import {AudioData} from './audio';

export type ProfileNavigatorStackParamList = {
  Profile: undefined;
  ProfileSettings: undefined;
  UpdateAudio: {audio: AudioData};
  Verification: {
    userInfo: {
      email: string;
      name: string;
      id: string;
    };
  };
};

export type HomeNavigatorStackParamList = {
  PublicProfile: {profileId: string};
  ProfileNavigator: undefined;
  Home: undefined;
};

export type PublicProfileTabParamList = {
  PublicUploads: {profileId: string};
  PublicPlaylist: {profileId: string};
};
