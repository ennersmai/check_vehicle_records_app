import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cvr.app',
  appName: 'CVR',
  webDir: '.vercel/output/static',
  android: {
    webContentsDebuggingEnabled: true
  },
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    }
  }
};

export default config;
