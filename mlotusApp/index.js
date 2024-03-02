/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './mlotusApp';
import {name as appName} from './app.json';

// Cái này cho Android
AppRegistry.registerComponent(appName, () => App);

// Cần cái nào thì bật cái đó
// Cái này cho IOS
// AppRegistry.registerComponent('main', () => App);
