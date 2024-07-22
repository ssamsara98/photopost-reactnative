import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Heading,
  Input,
  Link,
  Text,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import React, { useState } from 'react';

import { serverRegister } from '@/api/server';
import { AuthStackScreenProps } from '@/navigations/AuthNavigator';

export const RegisterScreen = (props: AuthStackScreenProps<'Register'>) => {
  const [registerForm, setRegisterForm] = useState({
    email: '',
    username: '',
    password: '',
    name: '',
  });
  const [status, setStatus] = useState<string>('idle');
  // const [error, setError] = useState<any>(null);

  function onRegisterFormChange(e: string, key: keyof typeof registerForm) {
    setRegisterForm((prev) => ({
      ...prev,
      [key]: e,
    }));
  }

  async function handleRegister() {
    setStatus(() => 'loading');
    try {
      if (
        !!registerForm.email &&
        !!registerForm.username &&
        !!registerForm.password &&
        !!registerForm.name
      ) {
        await serverRegister(
          registerForm.email,
          registerForm.username,
          registerForm.password,
          registerForm.name,
        );
        // console.log(registerForm);
        setStatus(() => 'fulfilled');
        props.navigation.goBack();
      }
    } catch (err) {
      setStatus(() => 'rejected');
    }
  }

  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: 'warmGray.50',
          }}
        >
          Welcome
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: 'warmGray.200',
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          Fill form to register!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Name</FormControl.Label>
            <Input
              isRequired
              value={registerForm.name}
              onChangeText={(e) => onRegisterFormChange(e, 'name')}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              isRequired
              autoCapitalize="none"
              value={registerForm.email}
              onChangeText={(e) => onRegisterFormChange(e, 'email')}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Username</FormControl.Label>
            <Input
              isRequired
              autoCapitalize="none"
              value={registerForm.username}
              onChangeText={(e) => onRegisterFormChange(e, 'username')}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              isRequired
              autoCapitalize="none"
              type="password"
              value={registerForm.password}
              onChangeText={(e) => onRegisterFormChange(e, 'password')}
            />
            {/* <Link
              _text={{
                fontSize: 'xs',
                fontWeight: '500',
                color: 'indigo.500',
              }}
              alignSelf="flex-end"
              mt="1">
              Forget Password?
            </Link> */}
          </FormControl>

          {status === 'rejected' && (
            <FormControl isInvalid>
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Error occured, please try again
              </FormControl.ErrorMessage>
            </FormControl>
          )}

          <Button
            mt="2"
            colorScheme="indigo"
            onPress={handleRegister}
            disabled={status === 'loading'}
          >
            Register
          </Button>

          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}
            >
              Already have an account.{' '}
            </Text>
            <Link
              _text={{
                color: 'indigo.500',
                fontWeight: 'medium',
                fontSize: 'sm',
              }}
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              Login
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};
