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

import { AuthStackScreenProps } from '@/navigations/AuthNavigator';
import { loginRdx } from '@/redux/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

// import {SERVER} from '@env';

export const LoginScreen = (props: AuthStackScreenProps<'Login'>) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const [loginForm, setLoginForm] = useState<{ userSession: string; password: string }>({
    userSession: '',
    password: '',
  });

  function onLoginFormChange(e: string, key: 'userSession' | 'password') {
    setLoginForm((prev) => ({
      ...prev,
      [key]: e,
    }));
  }

  function handleLogin() {
    if (!!loginForm.userSession && !!loginForm.password) {
      // console.log('login', loginForm);
      // console.log(SERVER);
      dispatch(loginRdx(loginForm));
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
          Login to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email/Usename</FormControl.Label>
            <Input
              isRequired
              autoCapitalize="none"
              value={loginForm.userSession}
              onChangeText={(e) => {
                onLoginFormChange(e, 'userSession');
              }}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              type="password"
              isRequired
              value={loginForm.password}
              onChangeText={(e) => {
                onLoginFormChange(e, 'password');
              }}
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
          {auth.status === 'rejected' && (
            <FormControl isInvalid>
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {auth.error.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
          <Button
            mt="2"
            colorScheme="indigo"
            onPress={handleLogin}
            disabled={auth.status === 'loading'}
          >
            Login
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}
            >
              I'm a new user.{' '}
            </Text>
            <Link
              _text={{
                color: 'indigo.500',
                fontWeight: 'medium',
                fontSize: 'sm',
              }}
              onPress={() => {
                props.navigation.navigate('Register');
              }}
            >
              Register
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};
