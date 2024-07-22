# Photopost React-Native

## Pages

### Main Page

![Main Page](./readme/main_page.png)

### Auth Page

![Auth Page](./readme/auth_page.png)

---

## Installation

- node_module

  `yarn install`

- ios

  `bundle install && cd ios && bundle exec pod install --verbose`

- running

  `yarn start --verbose`

  in new terminal

  `yarn android --verbose` & `yarn ios --verbose`

## Generate Apk

- Create keystore

  `keytool -genkey -v -keystore photopost.keystore -alias photopost -keyalg RSA -keysize 2048 -validity 10000`

  ```
  name: your_name
  org unit: 1
  org name: your_org_name
  city: your_city
  province: your_province
  id_code: ID
  ```

- Move the keystore

  `mv photopost.keystore android/app`

- Edit Build Gradle

  ```
  ...
  signingConfigs {
      ...
      release {
          storeFile file('photopost.keystore')
          storePassword System.console().readLine("\nKeystore password:")
          keyAlias System.console().readLine("\nAlias: ")
          keyPassword System.console().readLine("\nAlias password: ")
      }
  }
  ...
  buildTypes {
      release {
          ...
          signingConfig signingConfigs.release
          ...
      }
  }
  ```

- Generate
  ```sh
  npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/build/intermediates/res/merged/release/ && \
  # rm -rf android/app/src/main/res/drawable-* && \
  rm -rf android/app/src/main/res/raw && \
  echo "Building..." && \
  cd android && \
  ./gradlew assembleRelease && \
  cd ..
  ```

---

## Warning `In React 18, SSRProvider is not necessary and is a noop`

- Navigate to `node_modules/native-base/src/core/NativeBaseProvider.tsx`.
- Delete the `<SSRProvider></SSRProvider>` that wraps `{children}`. Take care not to delete `{children}`.
- Remove the `SSRProvider` import. That is, delete this line: `import { SSRProvider } from '@react-native-aria/utils'`;.
- Run `npx patch-package native-base`. Select `'yes'` in the prompt.

  `yarn start --reset-cache`
