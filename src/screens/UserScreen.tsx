import { Avatar, Box, FlatList, HStack, Image, Text } from 'native-base';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Dimensions } from 'react-native';

import { fetchProfileRdx, selectAuthReducerSafe } from '@/redux/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchMyPostListNextRdx,
  fetchMyPostListRdx,
  myPostsSelectors,
  selectMyPostsReducerSafe,
} from '@/redux/post/my-posts.slice';
import { getImageBySize } from '@/utils/s3.helper';

const { width } = Dimensions.get('window');
const cardSize = (width - 4) / 3;
const myPostsLimit = 30;

export function UserScreen() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthReducerSafe);
  const myPostsReducer = useAppSelector(selectMyPostsReducerSafe);
  const myPosts = myPostsSelectors.selectAll(myPostsReducer);

  useEffect(() => {
    dispatch(fetchProfileRdx({ sig: auth.signature }));
    return () => {};
  }, [dispatch, auth.signature]);

  useEffect(() => {
    dispatch(fetchMyPostListRdx({ sig: auth.signature, params: { limit: myPostsLimit } }));
    return () => {};
  }, [dispatch, auth.signature]);

  const onRefresh = useCallback(() => {
    dispatch(fetchMyPostListRdx({ sig: auth.signature, params: { limit: myPostsLimit } }));
  }, [dispatch, auth.signature]);

  const posts2d = useMemo(() => {
    const result: { posts: any[]; key: string }[] = [];
    let sub: any[] = [];
    let key = '';
    myPosts.forEach((myPost, idx) => {
      sub.push(myPost);
      key += myPost.id;
      if (idx % 3 === 2 || idx === myPosts.length - 1) {
        result.push({ posts: sub, key });
        sub = [];
        key = '';
      }
    });
    return result;
  }, [myPosts]);

  const fetchMoreMyPosts = useCallback(() => {
    // console.log(
    //   `fetchMore: hasNext=>${myPostsReducer.pagination.hasNext} status=>${myPostsReducer.status}`,
    // );
    if (
      myPostsReducer.pagination.page < myPostsReducer.pagination.totalPages &&
      myPostsReducer.status !== 'loading'
    ) {
      dispatch(
        fetchMyPostListNextRdx({
          sig: auth.signature,
          params: {
            page: myPostsReducer.page + 1,
            limit: myPostsLimit,
          },
        }),
      );
    }
  }, [
    auth.signature,
    dispatch,
    myPostsReducer.page,
    myPostsReducer.pagination.page,
    myPostsReducer.pagination.totalPages,
    myPostsReducer.status,
  ]);

  return (
    <>
      <Box>
        <HStack py={4} px={4} alignItems={'center'}>
          <Avatar bg="gray.500" mr="2" size={'xl'}>
            {auth.user?.name ? auth.user.name[0] : '?'}
          </Avatar>
          <HStack py={2} px={4} alignItems={'center'} flexGrow={'1'}>
            <Text fontSize={'2xl'}>{auth.user?.name}</Text>
          </HStack>
        </HStack>
      </Box>
      <FlatList
        nestedScrollEnabled
        onRefresh={onRefresh}
        refreshing={myPostsReducer.status === 'loading'}
        data={posts2d}
        keyExtractor={(item) => `${item.key}`}
        renderItem={({ item }) => {
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
