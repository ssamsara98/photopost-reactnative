import React, {useEffect} from 'react';
import {Avatar, Box, HStack, Image, ScrollView, Text} from 'native-base';
import {Dimensions} from 'react-native';
import {getImageBySize} from '../utils/s3.helper';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {fetchProfileRdx} from '../redux/auth/auth.slice';
import {fetchMyPostListRdx} from '../redux/post/post.slice';

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

const {width} = Dimensions.get('window');
const cardSize = (width - 4) / 3;

export function UserScreen() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const {myPosts} = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchMyPostListRdx(auth.signature));
    return () => {};
  }, [auth.signature, dispatch]);

  useEffect(() => {
    dispatch(fetchProfileRdx(auth.signature));
    return () => {};
  }, [auth.signature, dispatch]);

  return (
    <>
      <ScrollView bgColor={'white'}>
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
        <Box>
          <HStack flexWrap={'wrap'}>
            {myPosts.map((post, idx) => {
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
        </Box>
      </ScrollView>
    </>
  );
}
