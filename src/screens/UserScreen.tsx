import React, {useCallback, useEffect, useMemo} from 'react';
import {Avatar, Box, FlatList, HStack, Image, Text} from 'native-base';
import {Dimensions} from 'react-native';
import {getImageBySize} from '../utils/s3.helper';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {fetchProfileRdx} from '../redux/auth/auth.slice';
import {fetchMyPostListNextRdx, fetchMyPostListRdx} from '../redux/post/post.slice';

const {width} = Dimensions.get('window');
const cardSize = (width - 4) / 3;
const myPostsLimit = 30;

export function UserScreen() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const {myPosts, myPostsStatus, myPostsPagination, myPostsPage} = useAppSelector(
    (state) => state.posts,
  );

  useEffect(() => {
    dispatch(fetchProfileRdx({sig: auth.signature}));
    return () => {};
  }, [dispatch, auth.signature]);

  useEffect(() => {
    dispatch(fetchMyPostListRdx({sig: auth.signature, params: {limit: myPostsLimit}}));
    return () => {};
  }, [dispatch, auth.signature]);

  const onRefresh = useCallback(() => {
    dispatch(fetchMyPostListRdx({sig: auth.signature, params: {limit: myPostsLimit}}));
  }, [dispatch, auth.signature]);

  const posts2d = useMemo(() => {
    const result: {posts: any[]; key: string}[] = [];
    let sub: any[] = [];
    let key = '';
    myPosts.forEach((myPost, idx) => {
      sub.push(myPost);
      key += myPost.id;
      if (idx % 3 === 2 || idx === myPosts.length - 1) {
        result.push({posts: sub, key});
        sub = [];
        key = '';
      }
    });
    return result;
  }, [myPosts]);

  const fetchMoreMyPosts = () => {
    // console.log(
    //   `fetchMore: hasNext=>${myPostsPagination.hasNext} status=>${myPostsStatus}`,
    // );
    if (myPostsPagination.hasNext && myPostsStatus !== 'loading') {
      dispatch(
        fetchMyPostListNextRdx({
          sig: auth.signature,
          params: {
            page: myPostsPage + 1,
            limit: myPostsLimit,
          },
        }),
      );
    }
  };

  return (
    <>
      <Box>
        <HStack py={4} px={4} alignItems={'center'}>
          <Avatar bg="gray.500" mr="2" size={'xl'}>
            {auth.user.name ? auth.user.name[0] : '?'}
          </Avatar>
          <HStack py={2} px={4} alignItems={'center'} flexGrow={'1'}>
            <Text fontSize={'2xl'}>{auth.user.name}</Text>
          </HStack>
        </HStack>
      </Box>
      <FlatList
        nestedScrollEnabled
        onRefresh={onRefresh}
        refreshing={myPostsStatus === 'loading'}
        data={posts2d}
        keyExtractor={(item) => `${item.key}`}
        renderItem={({item}) => {
          // console.log(`item.key=>${item.key}`);
          return (
            <HStack flexWrap={'wrap'}>
              {item.posts.map((post, idx) => {
                // console.log(`post.id=>${post.id}`);
                if (post.photos.length) {
                  return (
                    <Image
                      key={idx}
                      source={{
                        uri: getImageBySize(post.photos[0].photo.keypath, 500),
                      }}
                      alt="Alternate Text"
                      width={cardSize}
                      height={cardSize}
                      mx={idx % 3 === 1 ? '2px' : 0}
                      mb={'2px'}
                    />
                  );
                }
                return (
                  <Box
                    key={idx}
                    width={cardSize}
                    pb={cardSize}
                    bgColor={'emerald.200'}
                    mx={idx % 3 === 1 ? '2px' : 0}
                    mb={'2px'}
                  />
                );
              })}
            </HStack>
          );
        }}
        onEndReachedThreshold={0.2}
        onEndReached={fetchMoreMyPosts}
      />
    </>
  );
}
