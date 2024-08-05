import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useMutation, useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import catchError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {useGetIsFollowing} from 'src/hooks/query';
import {updateNotification} from 'src/store/notification';

interface Props {
  profile?: PublicProfile;
}

const PublicProfileContainer: FC<Props> = ({profile}) => {
  const {data: isFollowing} = useGetIsFollowing(profile?.id || '');
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: async id => toggleFollow(id),
    onMutate: (id: string) => {
      queryClient.setQueryData<boolean>(
        ['is-following', id],
        prevData => !prevData,
      );
    },
  });

  const toggleFollow = async (id: string) => {
    if (!id) return;
    try {
      const client = await getClient();
      await client.post('/profile/update-follower/' + id);
      queryClient.invalidateQueries({queryKey: ['profile', id]});
    } catch (error) {
      console.log(error);
      const errorMsg = catchError(error);
      dispatch(updateNotification({message: errorMsg, type: 'error'}));
    }
  };

  if (!profile) return null;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <AvatarField source={profile.avatar} />

        <View style={styles.infoContainer}>
          <View style={styles.flexRow}>
            <Text style={styles.profileName}>{profile.name}</Text>
          </View>

          <Text style={[styles.followerText, {marginVertical: 4}]}>
            {profile.followers} Followers
          </Text>
          <Pressable
            onPress={() => followMutation.mutate(profile?.id)}
            style={styles.flexRow}>
            <Text style={styles.profileActionLink}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    marginLeft: 8,
  },
  profileName: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 4,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  email: {
    color: colors.SECONDARY,
  },
  profileActionLink: {
    backgroundColor: colors.SECONDARY,
    color: colors.PRIMARY,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 5,
    fontWeight: '500',
  },
  followerText: {
    color: colors.CONTRAST,
    paddingVertical: 2,
    marginTop: 5,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PublicProfileContainer;
