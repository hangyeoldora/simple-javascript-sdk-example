import { loadScript } from './sdkLoader.js'; // sdk import
const SCRIPT_URL = './js/test.js'; // 주 기능 초기화 함수 파일 URL

export function loadSDK(service, clientKey) {
  // window 전역 객체 undefined 경우
  if (typeof window === 'undefined') {
    return Promise.resolve({});
  }
  console.log('initialize loader');
  // window 전역 객체 내 초기화 함수 생성하고 return 받은 메서드를 다시 return
  return loadScript(SCRIPT_URL, service, clientKey).then((TestSdkVal) => {
    console.log('done');
    return TestSdkVal;
  }).catch(err => console.log('it doesn\'t work', err));
};