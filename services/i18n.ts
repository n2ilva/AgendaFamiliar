import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from '../constants/translations/pt.json';
import en from '../constants/translations/en.json';

const resources = {
    'pt-BR': {
        translation: pt,
    },
    'en': {
        translation: en,
    },
};

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources,
        lng: 'pt-BR',
        fallbackLng: 'pt-BR',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
