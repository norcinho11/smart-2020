import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import {locales} from './locales';

const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
RNLocalize.addEventListener("change",function() {
const language = RNLocalize.getLocales()[0].languageCode;
//console.log(' >> language has been changed to ${language}');
i18n.changeLanguage(language);
});

// the translations
/*
const resources = {
  sk: {
    translation: {
      "Home": "Domov",
      "Notifications": "Upozornenia",
      "Calendar":"Kalendár",
      "Notes":"Poznámky",
      "Setting":"Nastavenia",
      "Navigation":"Navigácia",
      "Sign Out":"Odhlásiť sa",
      "Password":"Heslo",
      "Mail":"E-mail",

    }
  }
};
*/

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources:locales,
    lng: deviceLanguage,
    fallbackLng:"en",
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;