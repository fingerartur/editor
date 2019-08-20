# Internationalization (i18n)
Currently the protoype is available in Czech and English with the ability to change language in runtime.

- react-i18next library is used, which is a React wrapper of i18next.
- translation/dictionary files are located in [```src/i18n.js```](src/i18n.js)
- configuration of the i18n library is located in [```src/i18n.js```](src/i18n.js)
- switching between languages occurs in [```App.tsx > render > i18n.changeLanguage('en' | 'cs');```](src/App.tsx)
- examples of internationalized UI components are found in ```/src/gui``` (e.g. [modal window](src/gui/utils/Modal.tsx) or [rule list](src/gui/RulesList.tsx))

## API
- offers a function translation ```t()``` or a React element to be used in templates ```<Trans>text_to_translate</Trans>```
- support for language switch during runtime
- support for [interpolation](https://www.i18next.com/translation-function/interpolation) and [formatting](https://www.i18next.com/translation-function/formatting) of variables
- support for [plurals](https://www.i18next.com/translation-function/plurals)
- potentially working dictionary file extractors (translation scanners) [1](https://www.npmjs.com/package/i18next-extract-gettext) [2](https://github.com/i18next/i18next-scanner)