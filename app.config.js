// Dynamic Expo configuration that embeds environment variables into builds
const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
    expo: {
        name: 'agenda-familiar',
        slug: 'agenda-familiar',
        version: '1.0.0',
        orientation: 'portrait',
        icon: 'assets/adaptive-icon.png',
        scheme: 'agendafamiliar',
        userInterfaceStyle: 'automatic',
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.natanael.agendafamiliar',
        },
        android: {
            package: 'com.natanael.agendafamiliar',
            adaptiveIcon: {
                backgroundColor: '#E6F4FE',
                foregroundImage: 'assets/adaptive-icon.png',
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            permissions: [
                'android.permission.SCHEDULE_EXACT_ALARM',
                'android.permission.USE_EXACT_ALARM',
                'android.permission.RECEIVE_BOOT_COMPLETED',
                'android.permission.VIBRATE',
                'android.permission.POST_NOTIFICATIONS',
            ],
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
        },
        web: {
            output: 'static',
            favicon: 'assets/favicon.png',
        },
        plugins: [
            [
                'expo-splash-screen',
                {
                    image: 'assets/adaptive-icon.png',
                    imageWidth: 200,
                    resizeMode: 'contain',
                    backgroundColor: '#ffffff',
                    dark: {
                        backgroundColor: '#000000',
                    },
                },
            ],
            [
                'expo-notifications',
                {
                    icon: './assets/adaptive-icon.png',
                    color: '#5271FF',
                    defaultChannel: 'default',
                    sounds: [],
                },
            ],
            '@react-native-google-signin/google-signin',
        ],
        experiments: {
            typedRoutes: false,
            reactCompiler: false,
        },
        extra: {
            eas: {
                projectId: 'd014eed9-1574-40c4-89ce-46ebf54f97c5',
            },
            // Firebase configuration - embedded at build time
            firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
            firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
            firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
            firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
            firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        },
    },
};
