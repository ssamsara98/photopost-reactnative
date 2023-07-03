import {Avatar, Box, HStack, Image, Text, VStack} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {Dimensions, FlatList, ScrollView} from 'react-native';
import {fetchPostListRdx, fetchPostListRefreshRdx} from '../redux/post/post.slice';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {getImageBySize} from '../utils/s3.helper';

const CARD_WIDTH = Dimensions.get('window').width;
// const CARD_HEIGHT = Dimensions.get('window').height * 0.7;
// const SPACING_FOR_CARD_INSET = Dimensions.get('window').width * 0.1 - 10;
const postsLimit = 10;

export const PostsScreen = () => {
  const dispatch = useAppDispatch();
  const postsReducer = useAppSelector((s) => s.posts);

  useEffect(() => {
    if (postsReducer.status === 'idle') {
      dispatch(fetchPostListRefreshRdx({params: {limit: postsLimit}}));
    }
    return () => {};
  }, [dispatch, postsReducer.status]);

  const onRefresh = useCallback(() => {
    dispatch(fetchPostListRefreshRdx({params: {limit: postsLimit}}));
  }, [dispatch]);

  const fetchMore = () => {
    // console.log(
    //   `fetchMore: hasNext=>${postsReducer.pagination.hasNext} status=>${postsReducer.status}`,
    // );
    if (postsReducer.pagination.hasNext && postsReducer.status !== 'loading') {
      dispatch(
        fetchPostListRdx({
          params: {
            page: postsReducer.page + 1,
            limit: postsLimit,
          },
        }),
      );
    }
  };

  return (
    <FlatList
      onRefresh={onRefresh}
      refreshing={postsReducer.status === 'loading'}
      data={postsReducer.posts}
      keyExtractor={(post) => `${post.id}`}
      renderItem={({item: post}) => {
        return (
          <Box mb={1} bgColor={'white'} shadow={'5'}>
            <VStack>
              <HStack py={2} px={4} alignItems={'center'}>
                <Avatar bg="gray.500" mr="2">
                  {post.author.username[0]}
                </Avatar>
                <Text fontSize={'md'}>{post.author.username}</Text>
              </HStack>
              <Box>
                <ScrollView
                  horizontal // Change the direction to horizontal
                  pagingEnabled // Enable paging
                  decelerationRate={0} // Disable deceleration
                  snapToInterval={CARD_WIDTH} // Calculate the size for a card including marginLeft and marginRight
                  snapToAlignment="center" // Snap to the center
                  // contentInset={{
                  //   // iOS ONLY
                  //   top: 0,
                  //   left: SPACING_FOR_CARD_INSET, // Left spacing for the very first card
                  //   bottom: 0,
                  //   right: SPACING_FOR_CARD_INSET, // Right spacing for the very last card
                  // }}
                  // contentContainerStyle={{
                  //   // contentInset alternative for Android
                  //   paddingHorizontal:
                  //     Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0, // Horizontal spacing before and after the ScrollView
                  // }}
                >
                  {post.photos.length ? (
                    post.photos.map((img: any, idx2: any) => (
                      <Image
                        key={`${img.id}-${idx2}`}
                        source={{
                          uri: getImageBySize(img.photo.keypath, 500),
                        }}
                        alt="Alternate Text"
                        width={CARD_WIDTH}
                        height={CARD_WIDTH}
                      />
                    ))
                  ) : (
                    <Box width={CARD_WIDTH} pb={CARD_WIDTH} bgColor={'gray.300'}>
                      {''}
                    </Box>
                  )}
                </ScrollView>
              </Box>
              <Box px={4} py={2}>
                <Text fontSize={'xl'}>{post.caption}</Text>
              </Box>
            </VStack>
          </Box>
        );
      }}
      onEndReachedThreshold={0.2}
      onEndReached={fetchMore}
    />
  );
};
