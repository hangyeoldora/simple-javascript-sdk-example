import { loadScript } from './sdkLoader.js';
const SCRIPT_URL = './js/test.js';

export function loadSDK(service) {

  if (typeof window === 'undefined') {
    return Promise.resolve({});
  }
  console.log('loadSDK init')
  return loadScript(SCRIPT_URL, service).then(res => {
    // return sdk();
    console.log('done');
  }).catch(err => console.log('it doesn\'t work', err));
};