# [웹브라우저] SDK 설계&middot;개발

## javascript SDK

### 전체 개요

- SDK 제작에 필요한 모듈화, 보안 등에 대한 자료 정리와 함께 테스트 코드 개발을 진행했으며, 큰 목차는 다음과 같음
  - SDK 정의
  - 디자인 철학
  - 자바스크립트 모듈화와 도구
  - 외부 라이브러리 보안
  - js 파일에서 script tag의 속성(Attribute) 값 가져오기
    - script의 타입이 기본과 module(html-head에 위치)인 경우
  - 개발
    - 코드 규칙
    - 토스페이먼츠 javascript SDK를 참고한 테스트 예제

<br/>

### SDK

- <u>Software Development Kit</u>의 약자로 소프트웨어 개발 시, 사용하는 것으로 개발자가 활용할 수 있는 API, GUI, 라이브러리 등을 모은 개발 도구 모음
- SDK를 통해 개발자가 직접적으로 기능을 구현하지 않아도 다양한 기능을 완성할 수 있음

<br/>

### 디자인 철학

- 네이버
  - 개발 생산성과 유지보수를 위한 모듈화
  - ES5, npm, webpack 등 사용
- 라인
  - 언어별 API 메서드명 통일
  - 품질 보장을 위한 리뷰와 언어 lint 설정
  - 의존 모듈의 최소화
  - 최적화
  - 보안성 체크
- 핑크퐁
  - 모듈화
  - 코드 획일화
  - 버그 파악, 수정이 원활한 프로세스 구축
- 기타
  - 사용자 가이드, API 참조, 샘플 코드 등 철저한 문서화
  - 일관된 명명 규칙, 모듈화를 통한 API 디자인
  - CI/CD 자동화 및 성능 최적화
  - 철저한 보안 테스트 및 검사

<br/>

### 자바스크립트 모듈화와 도구

#### 1. 모듈

##### 정의

- 프로그램의 규모가 커지고 기능이 복잡해지면서 유지보수 등의 문제로 기능 분리에 대한 필요성이 증가
- 이에 전체 프로그램을 각각 독립된 기능 단위로 나눠서 필요할 때마다 사용할 수 있도록 만든 것을 모듈이라 함
- 클래스나 복수의 함수로 구성된 단일 라이브러리로 구성

##### 장점

- 프로그램의 효율적인 관리와 코드의 재사용성을 높임
- 각 모듈의 독립성을 통해 의존성을 낮춰 특정 모듈의 기능 추가나 수정할 때도 편리 (유지보수성 향상)
- 모듈은 각각의 독립적인 스코프로 인식되기 때문에 자바스크립트의 네임스페이스 오염에 대한 문제를 줄일 수 있음
- 자유롭게 필요한 곳에서 import, export 할 수 있음
- 인터페이스가 단순해지고 소프트웨어의 이해 용이성이 증가

##### 모듈 시스템

- 현재 node.js에서 사용되는 방식의 '<u>CJS</u>'(CommonJS, 동기적 실행)

- 가장 오래된 모듈 시스템 중 하나인 '<u>AMD</u>'(Asynchronous Module Definition)

- ES6 이후 등장한 자바스크립트의 공식 모듈화 시스템 '<u>ESM</u>'(ES Modules, 비동기적 실행)

  => ES6를 지원하지 않는 브라우저나 프로그램이 있을 수 있는데, 이는 'babel'이라는 도구를 사용하여 ES6를 ES5로 트랜스파일링하여 문제를 해결할 수 있음

  

#### 2. 모듈 번들러

<img src="https://github.com/hangyeoldora/simple-javascript-sdk-example/assets/50001184/4775c9f6-e42b-4896-8cf2-21d6e1a724da" alt="webpack image"/>



- 여러 개의 파일을 하나로 묶어주는 도구

- 각 모듈은 모듈 번들러를 통해 하나의 파일로 묶어 네트워크 비용을 최소화하면서 빠른 서비스 제공이 가능

- 대표적인 번들러로는 webpack, rollup, esbuild, vite 등이 있음

  - 토스페이먼츠의 경우, <u>rollup</u> 번들러 사용

    ```typescript
    // payment-sdk의 rollup.config.js의 부분
    import typescript from '@rollup/plugin-typescript';
    import commonjs from '@rollup/plugin-commonjs';
    ```

  - 다양한 플러그인과 webpack보다 빠른 성능 등의 이유로 rollup을 채택한 것으로 보임



#### 3. 트랜스파일러

- 특정 언어로 작성된 소스 코드를 비슷한 수준의 다른 언어로 변환해주는 도구

  - ES6 이상의 코드를 ES5로 변환하여 이전 버전의 브라우저에서도 호환되게 해줌

    <img src="https://github.com/hangyeoldora/simple-javascript-sdk-example/assets/50001184/2fbb5ae7-f7ea-4e4d-8616-016e2cb65dbd" alt="babel image"/>

    

  - JSX를 JS 코드로 변환

  

- 대표적으로 <u>Babel</u>이 있음

  - 토스페이먼츠의 경우, <u>rollup의 babel</u>플러그인 사용

    ```typescript
    // payment-sdk의 rollup.config.js의 부분
    import babel from '@rollup/plugin-babel';
    ```

<br/>

### 외부 라이브러리 보안

#### 하위 리소스 무결성 (SRI, Subresource Integrity)

<img src="https://github.com/hangyeoldora/simple-javascript-sdk-example/assets/50001184/2eb206f3-481d-415e-8cf9-4fb7dc463a1b" alt="sri image" />



- 브라우저는 타사 서버에 호스팅된 리소스가 변조되지 않았는지 확인해야 함 (소스 조작 시, 로드 X)

- 라이브러리가 타사 소스에서 로드될 때마다 SRI를 사용하는 것이 가장 좋음

  ```html
  <!-- 예시: jQuery CDN -->
  <script
    src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
    crossorigin="anonymous">
  </script>
  ```



- 위와 같이 ```<script>``` 태그에 무결성 관련 속성(integrity와 crossorigin)을 추가해서 사용

- 컨텐츠 보안 정책(CSP, Content Security Policy)에 sri의 타입 설정 가능

  ```javascript
  Content-Security-Policy: require-sri-for script;
  Content-Security-Policy: require-sri-for style;
  Content-Security-Policy: require-sri-for script style;
  ```

- Subresource Integrity <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity">공식 문서</a>

<br/>

##### 1. 무결성 (integrity)

- 해시값 비교를 통해 파일에 변경되지 않았는지 확인하여 무결성 보장
  - 조금이라도 파일이 변경되면 해시값이 달라짐
- base64 인코딩 암호화 해시를 ```<script>``` 또는 ```<link>``` 요소의 속성 값에 지정
- 하나 이상의 문자열로 시작되며, 특정 해시 알고리즘을 나타내는 접두사가 포함
  - 허용되는 접두사는 <u>sha256, sha384, sha512</u>
  - 알고리즘 접두사 뒤에 대시가 오고 실제 base64로 인코딩된 해시가 위치

##### 2. 교차 출처 (cross origin)

- CORS(Cross-Origin Resource Sharing)를 사용하여 리소스를 제공하는 원본이 해당 리소스와 공유되도록 허용하는지 확인
- 리소스가 다른 출처의 서버에서 로드될 때 사용되는 옵션을 정의

##### 3. JS 난독화

- 변수와 함수 이름을 변경해 소스 코드의 해석을 어렵게 하는 것

- 기본적으로 webpack 모듈 번들러로 번들링할 때 난독화 진행

- 난독화된 토스페이먼츠 js 파일 예시

  - 토스페이먼츠 javascript SDK 파일 중, 주 기능이 담긴 script 파일은 url 형태로 제공되며 난독화가 되어 있음

  ```javascript
  // url: https://js.tosspayments.com/v1
  function r(t) {
      return (
        (r =
          "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (t) {
                return typeof t;
              }
            : function (t) {
                return t &&
                  "function" == typeof Symbol &&
                  t.constructor === Symbol &&
                  t !== Symbol.prototype
                  ? "symbol"
                  : typeof t;
              }),
        r(t)
      );
    }
    function n(t, e, r, n, o, i, a) {
      try {
        var u = t[i](a),
          c = u.value;
      } catch (t) {
        return void r(t);
      }
      u.done ? e(c) : Promise.resolve(c).then(n, o);
    }
  ```

<br/>

### js파일에서 script tag의 속성 값 가져오기

```html
<!-- 예시: 네이버페이 javascript sdk -->
<!DOCTYPE html>  
<html>  
<head></head>  
<body>  
<!--// mode : development or production-->  
<script src=https://nsp.pay.naver.com/sdk/js/naverpay.min.js  
      data-client-id="u86j4ripEt8LRfPGzQ8"
      data-mode="production"
      data-merchant-user-key="가맹점 사용자 식별키"
      data-merchant-pay-key="가맹점 주문 번호"
      data-product-name="상품명을 입력하세요"
      data-total-pay-amount="1000"
      data-tax-scope-amount="1000"
      data-tax-ex-scope-amount="0"
      data-return-url="사용자 결제 완료 후 결제 결과를 받을 URL">
</script>  
</body>  
</html>  
```

- 위 예시처럼 ```<script src='https://webcash.co.kr/test.min.js' data... attr></script>``` 로 선언하는 경우, 서버의 'test.min.js' 파일에서 각 속성값을 가져와야 함

<br/>

#### 1. currentScript 속성

- currentSciprt 속성으로 script tag 내 attribute 가져오기  (<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript">공식문서</a>)

  ```javascript
  // 위 예제의 script tag 값 가져오기 (script-attt.html 참조)
  // 서버의 naverpay.min.js 파일 내부 스크립트
  
  (() => {
      // 여러 data 속성이 있으므로 attributes를 통해 NamedNodeMap 가져오기
      // 단일의 경우에는 getAttribute로 가능
      const attrList = document.currentScript.attributes;
      
      /** 
      	for...of 또는 펼침연산자를 사용하여 NamedNodeMap 요소 반복
      */
      // 1. for...of
      for(let ele of attrList) console.log(`${ele.nodeName}: ${ele.nodeValue}`);
      for(let ele of attrList) {
          ele.nodeName === 'data-client-id' && console.log('ok') // 특정 attr 분기
      };
      
      // 2. 펼침연산자 사용 (동일한 기능의 Array.from()도 가능)
      [...attrList].forEach(ele => console.log(`${ele.nodeName}: ${ele.nodeValue}`));
      Array.from(attrList).forEach(ele => console.log(`${ele.nodeName}: ${ele.nodeValue}`));
      
  })();
  ```

  

- 결과값

  ```powershell
  src: ./js/index.js
  index.js:3 data-client-id: u86j4ripEt8LRfPGzQ8
  index.js:3 data-mode: production
  index.js:3 data-merchant-user-key: 가맹점 사용자 식별키
  index.js:3 data-merchant-pay-key: 가맹점 주문 번호
  index.js:3 data-product-name: 상품명을 입력하세요
  index.js:3 data-total-pay-amount: 1000
  index.js:3 data-tax-scope-amount: 1000
  index.js:3 data-tax-ex-scope-amount: 0
  index.js:3 data-return-url: 사용자 결제 완료 후 결제 결과를 받을 URL
  index.js:5 ok
  ```

<br/>

#### 2.  querySelector 메서드

- jQuery의 selector와 유사한 querySelector 속성을 사용하여 직접적으로 script에 접근

  1. 토스페이먼츠의 javascript sdk에서 사용 (script tag의 type이 기본인 경우)

     - 토스페이먼츠 javascript sdk <a href="https://github.com/tosspayments/browser-sdk" >(github 링크)</a>

     - 토스페이먼츠 javascript sdk 개발자센터 <a href="https://docs.tosspayments.com/reference/js-sdk">(공식 문서)</a>

       ```javascript
       // 일반적인 방식	
       const scriptSel = document.querySelector('script[data-client-id]');
       const scriptSelVal = scriptSel.getAttribute('data-client-id');
       console.log(scriptSelVal); // u86j4ripEt8LRfPGzQ8
       
       // 토스페이먼츠 javascript sdk
       const SCRIPT_URL = 'https://js.tosspayments.com/v1';
       const TEST_URL = './js/index.js';
       const script = document.querySelector(`script[src="${SCRIPT_URL}"]`);
       const script2 = document.querySelector(`script[src="${TEST_URL}"]`);
       ```

     - 다중 속성 값을 가져오기 위해서는 마찬가지로 ```attributes``` 속성을 사용

  2. script tag type이 'module'인 경우 (테스트 예제 개발에서 사용)

     - ```<script src="path" type="module"></script>``` 가 head 태그 내에 위치

       ```javascript
       const clientKeyAttr = document.head.querySelector('script');
       
       // NamedNodeMap에서 'data-client-key'라는 속성의 value 값
       const clientKey = clientKeyAttr.attributes[1].nodeValue;
       ```

<br/>

### 개발

#### 공통 개발 규칙

- ##### 코드 규칙

  - 여러 팀원과 개발을 진행하면 일정한 작성 규칙을 토대로 코드의 획일화가 필요
  - 규칙은 기업, 팀별로 정한 규칙을 사용할 수도 있지만 이미 수많은 기업에서도 사용 중인 몇 가지 규칙을 바탕으로 개발하면 편리
  - lint 설정을 통해 좋은 품질을 유지하며 지속적인 개발에 도움

  1. ###### 바닐라 JS의 <u>엄격모드(Strict Mode)</u>

     - 순수 js의 경우, 엄격모드 사용으로 네임스페이스 변수 충돌 등 방지
     - 스코프에 따라서 설정할 수도 있음

     - ES6 모듈의 경우, 모두 엄격모드

     - 토스페이먼츠의 공통 메인 함수에서도 **<u>엄격모드</u>**를 사용함

       ```javascript
       var TossPayments = (function () {
         "use strict"; // 엄격모드 적용
         function t(t, e) {
             ...
         };
       })();
       ```

     - 엄격모드 <a href="https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Strict_mode">공식문서</a>

     <br/>

  2. ###### 바닐라 JS에 prettier, eslint 추가 & 설정

     - 초기 설정에 prettier와 eslint 규칙을 추가하여 보다 엄격한 코드 규칙을 가질 수 있음

     <br/>

  3. ###### airbnb의 javascript 한글 가이드 참조

     - airbnb가 규정한 javascript 가이드는 많이 사용되고 있으며, react 등 프로젝트 설치 시 함께 추가하여 airbnb 규칙이 설정된 프로젝트로 시작할 수 있음

     - javascript의 전반적인 내용과 함께 jQuery에 대한 규칙도 포함

     - airbnb javascirpt 한글 가이드 <a href="https://github.com/tipjs/javascript-style-guide">링크</a>

     <br/>


#### 테스트 예제 개발

- 토스페이먼츠 JavaScript SDK를 참고하여 개발을 진행
- 주 기능이 담긴 JS 파일은 URL로 제공되고 있으며, URL 접속하여 코드 확인 시에 JS 코드가 난독화되어 있기 때문에 임의로 주 기능 JS 파일을 생성

- 초기 sdk 로딩 시, 빠른 호출을 위한 캐싱 작업
- window 전역 객체에 주 기능 초기화 함수 호출&middot;생성

##### 프로젝트 구조

- index.html

  : 메인 페이지로서 script tag에 붙은 속성 값 및 webcashSDK로 호출한 메서드의 값을 콘솔에서 확인 가능

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>script-attr</title>
  </head>
  <body>
    <!-- script 속성 값 가져오기 테스트 -->
    <script src="./js/index.js" data-client-id="u86j4ripEt8LRfPGzQ8" data-mode="production"
      data-merchant-user-key="가맹점 사용자 식별키" data-merchant-pay-key="가맹점 주문 번호" data-product-name="상품명을 입력하세요"
      data-total-pay-amount="1000" data-tax-scope-amount="1000" data-tax-ex-scope-amount="0"
      data-return-url="사용자 결제 완료 후 결제 결과를 받을 URL" crossorigin="anonymous">
    </script>
    <!-- sdk 테스트 -->
    <script src="./js/callSdk.js" type="module" crossorigin="anonymous"></script>
  </body>
  </html>
  ```

  

- js/callSdk.js

  : sdk 호출 함수이며, loader.js 파일을 import함

  ```javascript
  import { loadSDK } from "./loader.js"; // loader 추가
  
  (async () => {
      // 서비스와 클라이언트키를 전달하여 window 객체 내 TestSdkVal 생성
      const webcashSDK = await loadSDK('TestSdkVal', 'c6gBE6HrFVCNdmyl93bT3JTKhjzREs2J');
      await webcashSDK.increase(); // 증가 메서드 호출
      console.group('webcashSDK test')
      console.log('num:', webcashSDK.getValue());
      await webcashSDK.decrease(); // 감소 메서드 호출
      console.log('num:', webcashSDK.getValue()); 
      console.log('client key:', webcashSDK.getClientKey()); // 파라미터로 보낸 클라이언트 키 값
      console.groupEnd();
  })();
  ```

  

- js/loader.js

  : 특정 서비스와 클라이언트 키를 파라미터로 받는 함수가 있으며, 이 함수는 sdk loader를 실행하고 정상적인 경우 서비스를 실행

  ```javascript
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
  ```

  

- js/sdkLoader.js

  : sdk 로더

  ```javascript
  let cachedPromise = null; // 캐싱 변수
  
  // 기능 src path, 기능명, 클라이언트 키
  export function loadScript(src, namespace, clientKey) {
    const existingElement = document.querySelector(`[src="${src}"]`);
    // 이미 script module이 dom에 있으면서 캐싱 변수에 값이 있는 경우
    if (existingElement !== null && cachedPromise !== undefined) {
      return cachedPromise;
    }
    // 이미 script module이 dom에 있으면서, window 전역 객체에도 생성 함수가 있는 경우
    if (existingElement !== null && getName(namespace) !== undefined) {
      return Promise.resolve(!getName(namespace));
    }
  
    // script 생성
    const script = document.createElement("script");
    script.src = src;
    // 파라미터로 받은 클라이언트 키 값을 속성으로 추가
    script.setAttribute('data-client-key', clientKey);
  
    // promise 변수
    cachedPromise = new Promise((resolve, reject) => {
      document.head.appendChild(script); // head 태그 내 삽입
  
      // 초기화 함수에서 생성한 이벤트에 대한 리스너 추가
      window.addEventListener("TestSdkVal:initialize", async () => {
        await getName(namespace);
        if(getName(namespace) !== undefined){
          // window 전역 객체에 초기화 함수가 있는 경우, resolve
          resolve(getName(namespace));
        } else {
          // 없는 경우 error로 reject
          reject(new Error("Test SDK 로드 실패"));
        }
      });
    });
    // promise 값 반환
    return cachedPromise;
  };
  
  // window 전역 객체 내 name 요소 여부 return
  function getName(name) {
    return window[name];
  };
  ```

  

- js/test.js

  : 주 기능 초기화 함수

  ```javascript
  // 전역 스페이스
  var TestSdkVal = (function () {
    "use strict"; // 엄격 모드
    console.log("run test sdk val");
  
    // 초기화 함수 등록 여부 확인을 위한 이벤트 생성
    const testEvent = new Event("TestSdkVal:initialize", {
      bubbles: true,
      cancelable: false,
    });
    // dom에 이벤트 추가
    document.dispatchEvent(testEvent);
    console.log("TestSdkVal 호출됨");
    let num = 0;
    const key = "c6gBE6HrFVCNdmyl93bT3JTKhjzREs2J";
    const clientKeyAttr = document.head.querySelector("script"); // head에 있는 script module
    const clientKey = clientKeyAttr.attributes[1].nodeValue; // script 속성 값 가져오기
    // 기본 키 값과 파라미터로 받은 키가 같은 경우
    if (key === clientKey) {
      return Promise.resolve({
        getClientKey: () => clientKey,
        getEventType: () => testEvent.type,
        increase: () => {
          num += 1;
        },
        decrease: () => {
          num -= 1;
        },
        getValue: () => num,
      });
    } 
    // 기본 키 값과 파라미터로 받은 키가 틀린 경우
    else {
      return Promise.reject({
        에러: new Error("잘못된 클라이언트 키 값"),
      });
    }
  })();
  ```

  

<br/>

### 참고 자료

- 토스페이먼츠 JavaScript SDK

  1. toss payments JavaScript SDK 깃허브

     https://github.com/tosspayments/browser-sdk/tree/master

  2. toss payments JavaScript SDK 개발자센터 가이드

     https://docs.tosspayments.com/reference/js-sdk

- 라인

  1. JavaScript SDK 성능개선 방법 - 압축과 최적화로 실행시간 단축하기

     https://engineering.linecorp.com/ko/blog/improve-javascript-sdk-performance

  2. LINE Trial Bot SDK의 개발에서 릴리스까지

     https://engineering.linecorp.com/ko/blog/the-road-to-releasing-line-trial-bot-sdk

- 네이버

  1. 네이버페이 JavaScript SDK 개발기

     https://d2.naver.com/helloworld/2351859

- NC

  1. 사용자와 개발자 모두를 위한 도구 모음, 멀티플랫폼 SDK

     https://about.ncsoft.com/news/article/platform-center-04-20210701

- 핑크퐁

  1. Pinkfong Membership SDK 개발 프로세스 적용하기

     https://medium.com/pinkfong/pinkfong-membership-sdk-%EA%B0%9C%EB%B0%9C-%ED%94%84%EB%A1%9C%EC%84%B8%EC%8A%A4-%EB%A7%8C%EB%93%A4%EA%B8%B0-9401e84b36b3

- 넥슨 코리아

  1. node.js를 내장형으로 만들어서 게임 플랫폼 SDK 만들기

     https://lms0806.tistory.com/139



- javascript  module

https://baeharam.netlify.app/posts/javascript/module

- node.js integrity check

https://dev.to/orkhanhuseyn/verifying-integrity-of-files-using-nodejs-1gnd
