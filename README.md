*This project is public only for presentation purposes. You have no permission to use, modify, or share the software.*

# Technologies
React, antd, SVG (Jest, Enzyme, Cypress)

# Intro
This is a front-end for an automatic decision making system. This is a proof of concept intended to find and use technologies that are most suitable for the task.

Along with implementing business rule management functionality, it also demonstrates the solution for the following problems:
- testing (it uses Jest for unit and component testing and Cypress for e2e. The tests can interact with business rules because they are SVG-based)
- development of customized versions of the software (Webpack-code splitting and dynamic component instantiation of React are leveraged to load customized parts)
- optimization of rendering speed of large interactive business rules in the UI (a low level SVG library is used, a custom layout algorithm is used, only the visible part of a business rule is rendered - similar to rendering in games, speed benchmarks are provided)
- iternationalization (the software is available in Czech and English)
- component-based design of UI (React is used)

# Index
- [about testing](readme-testing.md)
- [documentation](readme-doc.md)
- [programming advice and ease of development](readme-tech-advice.md)
- [about writing customized versions of this software](readme-customize.md)
- [benchmarks](src/_benchmark/readme.md)
- [about library bugs](readme-debt.md)
- [i18n](readme-i18n.md)
- [about serialization](readme-serialization.md)
- [acceptance testing](readme-acceptance.md)

# Get started (on localhost)
1. install node.js (including npm)
2. run ```npm install```
4. run ```npm run start```
5. run ```npm run test``` to run unit and UI component tests
6. run ```npm run start; npm run e2e``` to run end-to-end tests

# Deploy to a remote server
1. install node.js (including npm)
2. run ```npm install```
3. run ```npm run build```
4. upload the contents of /build to a web server
