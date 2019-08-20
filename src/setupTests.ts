// this code runs before each Jest test automatically
// (no need to import this file in the test files, it is imported automatically)

/**
 * Initialize Enzyme
 */
import { configure } from 'enzyme';
const Adapter = require('enzyme-adapter-react-16');
configure({ adapter: new Adapter() });
