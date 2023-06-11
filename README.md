# Photopost React-Native

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
  cd android && \
  ./gradlew assembleRelease && \
  cd ..
  ```
