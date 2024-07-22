import { Box, Button, Flex, Icon, Image, Input, ScrollView, VStack } from 'native-base';
import React, { useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { createPostServer, uploadImageServer } from '@/api/server';
import { catchServerApiErr } from '@/lib/serverApi';
import { useAppSelector } from '@/redux/hooks';

const CARD_WIDTH = Dimensions.get('window').width;

const createFormData = (image: Asset) => {
  const data = new FormData();
  // console.log(image.uri);
  data.append('image', {
    name: image.fileName,
    type: image.type,
    // uri: image.uri,
    uri: Platform.OS === 'ios' ? image.uri?.replace('file://', '') : image.uri,
  });

  // Object.keys(body).forEach((key) => {
  //   data.append(key, body[key]);
  // });

  return data;
};

export function UploadScreen() {
  const auth = useAppSelector((state) => state.auth);
  const [photos, setPhotos] = useState<Array<Asset>>([]);
  const [caption, setCaption] = useState<string>('');
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);

  const handleChoosePhoto = async () => {
    try {
      const resp = await launchImageLibrary({ mediaType: 'photo' });
      // console.log(resp);
      if (!resp.didCancel && resp.assets && resp.assets.length) {
        setPhotos(() => [...photos, resp.assets![0]]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemovePhoto = async (index: number) => {
    setPhotos(() => photos.filter((_, idx) => idx !== index));
  };

  const handleResetForm = async () => {
    setPhotos(() => []);
    setCaption(() => '');
  };

  const handleCreatePost = async () => {
    setIsLoadingUpload(() => true);
    try {
      const imgResponses = await Promise.all(
        photos.map((photo) => {
          // console.log(jsonStringify(photo));
          const body = createFormData(photo);
          const imgResp = uploadImageServer(body, auth.signature);
          return imgResp;
        }),
      );
      // console.log('imgResponses', jsonStringify(imgResponses));

      const postBody = {
        caption,
        photoIds: imgResponses.map((imgResp) => imgResp.result.photo.id),
        // photoIds: [''],
      };
      // console.log(postBody);
      await createPostServer(postBody, auth.signature);

      handleResetForm();
    } catch (err) {
      console.error(err);
      const newErr = catchServerApiErr(err);
      console.error(newErr);
    } finally {
      setIsLoadingUpload(() => false);
    }
  };

  return (
    <KeyboardAwareScrollView enableOnAndroid>
      <VStack>
        <Flex mb={8} bgColor={'white'} shadow={'5'}>
          <Box>
            <ScrollView
              horizontal // Change the direction to horizontal
              pagingEnabled // Enable paging
              decelerationRate={0} // Disable deceleration
              snapToInterval={CARD_WIDTH} // Calculate the size for a card including marginLeft and marginRight
              snapToAlignment="center" // Snap to the center
            >
              {photos.length ? (
                photos.map((img, idx) => (
                  <Flex key={idx} width={CARD_WIDTH} pb={CARD_WIDTH} position={'relative'}>
                    <Image
                      source={{
                        uri: img.uri,
                      }}
                      alt={img.fileName}
                      width={CARD_WIDTH}
                      height={CARD_WIDTH}
                      position={'absolute'}
                      top={0}
                      left={0}
                    />
                    <Button
                      leftIcon={<Icon as={AntDesign} name="delete" />}
                      bg={'red.500'}
                      position={'absolute'}
                      right={4}
                      bottom={4}
                      onPress={() => {
                        handleRemovePhoto(idx);
                      }}
                      isDisabled={isLoadingUpload}
                    />
                  </Flex>
                ))
              ) : (
                <>
                  <Box width={CARD_WIDTH} pb={CARD_WIDTH} m={0} bgColor={'gray.50'} />
                </>
              )}
            </ScrollView>
          </Box>
        </Flex>

        <Flex alignItems={'center'}>
          <Input
            placeholder="Insert Caption Here!"
            maxW={Math.floor((CARD_WIDTH * 3) / 4)}
            mb={4}
            value={caption}
            onChangeText={(text) => setCaption(() => text)}
            isDisabled={isLoadingUpload}
          />

          <Button
            mb={6}
            leftIcon={<Icon as={AntDesign} name="plus" size="lg" />}
            onPress={handleChoosePhoto}
            isDisabled={photos.length >= 5 || isLoadingUpload}
          >
            Add image
          </Button>

          <Button
            variant={'subtle'}
            leftIcon={<Icon as={AntDesign} name="cloudupload" size="lg" />}
            onPress={handleCreatePost}
            isDisabled={photos.length <= 0 || caption === '' || isLoadingUpload}
            isLoading={isLoadingUpload}
            isLoadingText="Uploading"
          >
            Upload
          </Button>
        </Flex>
      </VStack>
    </KeyboardAwareScrollView>
  );
}
