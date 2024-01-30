import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * resources is an object that contains all the translations for the different languages.
 */
const resources = {
	en: {
		translation: {
			'Welcome to React': 'Welcome to React and react-i18next'
		}
	}
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		lng: 'fa',
		keySeparator: false, // we do not use keys in form messages.welcome
		interpolation: {
			escapeValue: false // react already safes from xss
		}
	});

export default i18n;