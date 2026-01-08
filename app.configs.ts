import 'dotenv/config';

export default ({ config }: any) => ({
  ...config,
  extra: {
    firebaseApiKey: process.env.API_KEY,
    firebaseAuthDomain: process.env.AUTH_DOMAIN,
    firebaseProjectId: process.env.PROJECT_ID,
    firebaseStorageBucket: process.env.STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.MESSAGING_SENDER_ID,
    firebaseAppId: process.env.APP_ID,
  },
});
