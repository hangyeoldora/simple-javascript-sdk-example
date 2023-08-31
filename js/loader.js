import { loadScript } from './sdkLoader.js';
const SCRIPT_URL = './js/test.js';

export function loadSDK(service, clientKey) {

  if (typeof window === 'undefined') {
    return Promise.resolve({});
  }
  console.log('initialize loader')
  return loadScript(SCRIPT_URL, service, clientKey).then((TestSdkVal) => {
    console.log('done');
    return TestSdkVal;
  }).catch(err => console.log('it doesn\'t work', err));
};