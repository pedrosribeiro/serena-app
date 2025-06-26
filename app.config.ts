import 'dotenv/config';

export default {
  expo: {
    name: 'serena-app',
    slug: 'serena-app',
    version: '1.0.0',
    android: {
      package: 'com.pribeiroo.serenaapp',
    },
    extra: {
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      eas: {
        projectId: '5cea8237-f55b-43c1-89bb-4a812737063c',
      },
    },
  },
};
