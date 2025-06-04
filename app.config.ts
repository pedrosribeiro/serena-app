import 'dotenv/config';

export default {
  expo: {
    name: 'serena-app',
    slug: 'serena-app',
    version: '1.0.0',
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};
