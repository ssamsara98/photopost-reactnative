import {Avatar, Box, HStack, Image, Text, VStack} from 'native-base';
import React, {useEffect} from 'react';
import {Dimensions, ScrollView} from 'react-native';
import {fetchPostListRdx} from '../redux/post/post.slice';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {getImageBySize} from '../utils/s3.helper';

// const dummyPost = {
//   id: 5,
//   createdAt: '2023-03-26T21:16:59.344492+07:00',
//   updatedAt: '2023-03-26T21:16:59.344492+07:00',
//   deletedAt: null,
//   authorId: 1,
//   author: {
//     id: 1,
//     createdAt: '2023-03-26T20:40:47.660471+07:00',
//     updatedAt: '2023-03-26T20:40:47.660471+07:00',
//     deletedAt: null,
//     email: 'samara98@mailsac.com',
//     username: 'samara98',
//     password: '$2a$10$919lJVXPmSQWx/5vkSml2.HZwVsKzX8lfXf2Xf.YOGgBelWhEgaW.',
//     name: 'samara98',
//     sexType: 'Unknown',
//     birthdate: null,
//   },
//   caption: 'Hi',
//   isPublished: true,
//   photos: [
//     {
//       id: '7efde42c-e5e8-41f5-9602-301d1185f499',
//       createdAt: '2023-03-26T21:16:59.345207+07:00',
//       updatedAt: '2023-03-26T21:16:59.345207+07:00',
//       deletedAt: null,
//       position: 0,
//       postId: 5,
//       post: null,
//       photoId: '6f3ad702-6fdc-4066-955b-9bb16d635630',
//       photo: {
//         id: '6f3ad702-6fdc-4066-955b-9bb16d635630',
//         createdAt: '2023-03-26T21:16:38.398892+07:00',
//         updatedAt: '2023-03-26T21:16:38.398892+07:00',
//         deletedAt: null,
//         keypath:
//           'photopost/06b35e49-3fc9-4faa-9511-b9d91bb7e7df/zKoWtzoMAlbaAeKNItngYWS15o5VmlHJ',
//       },
//     },
//     {
//       id: '7efde42c-e5e8-41f5-9602-301d1185f499',
//       createdAt: '2023-03-26T21:16:59.345207+07:00',
//       updatedAt: '2023-03-26T21:16:59.345207+07:00',
//       deletedAt: null,
//       position: 0,
//       postId: 5,
//       post: null,
//       photoId: '6f3ad702-6fdc-4066-955b-9bb16d635630',
//       photo: {
//         id: '6f3ad702-6fdc-4066-955b-9bb16d635630',
//         createdAt: '2023-03-26T21:16:38.398892+07:00',
//         updatedAt: '2023-03-26T21:16:38.398892+07:00',
//         deletedAt: null,
//         keypath:
//           'photopost/06b35e49-3fc9-4faa-9511-b9d91bb7e7df/zKoWtzoMAlbaAeKNItngYWS15o5VmlHJ',
//       },
//     },
//     {
//       id: '7efde42c-e5e8-41f5-9602-301d1185f499',
//       createdAt: '2023-03-26T21:16:59.345207+07:00',
//       updatedAt: '2023-03-26T21:16:59.345207+07:00',
//       deletedAt: null,
//       position: 0,
//       postId: 5,
//       post: null,
//       photoId: '6f3ad702-6fdc-4066-955b-9bb16d635630',
//       photo: {
//         id: '6f3ad702-6fdc-4066-955b-9bb16d635630',
//         createdAt: '2023-03-26T21:16:38.398892+07:00',
//         updatedAt: '2023-03-26T21:16:38.398892+07:00',
//         deletedAt: null,
//         keypath:
//           'photopost/06b35e49-3fc9-4faa-9511-b9d91bb7e7df/zKoWtzoMAlbaAeKNItngYWS15o5VmlHJ',
//       },
//     },
//   ],
// };
// const postList = [...new Array(20)].map(() => dummyPost);

const CARD_WIDTH = Dimensions.get('window').width;
// const CARD_HEIGHT = Dimensions.get('window').height * 0.7;
// const SPACING_FOR_CARD_INSET = Dimensions.get('window').width * 0.1 - 10;

export const PostsScreen = () => {
  const dispatch = useAppDispatch();
  const postsReducer = useAppSelector((s) => s.posts);

  const postStatus = useAppSelector((state) => state.posts.status);
  // const error = useAppSelector((state) => state.posts.error);

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPostListRdx());
    }
  }, [postStatus, dispatch]);

  return (
    <>
      <ScrollView>
        {postsReducer.posts.map((post, idx) => {
          return (
            <Box key={`${post.id}-${idx}`} mb={1} bgColor={'white'} shadow={'5'}>
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
        })}
      </ScrollView>
    </>
  );
};
