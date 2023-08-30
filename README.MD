# [웹브라우저] SDK 설계&middot;개발

## javascript SDK

### SDK 개요

### 디자인 철학

### 외부 라이브러리 보안

#### 하위 리소스 무결성 (SRI, Subresource Integrity)

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

##### 1. 무결성 (integrity)

- 해시값 비교를 통해 파일에 변경되지 않았는지 확인하여 무결성 보장
  - 조금이라도 파일이 변경되면 해시값이 달라짐
- base64 인코딩 암호화 해시를 ```<script>``` 또는 ```<link>``` 요소의 속성 값에 지정
- 하나 이상의 문자열로 시작되며, 특정 해시 알고리즘을 나타내는 접두사가 포함
  - 허용되는 접두사는 sha256, sha384, sha512
  - 알고리즘 접두사 뒤에 대시가 오고 실제 base64로 인코딩된 해시가 위치

##### 2. 교차 출처 (cross origin)

- CORS(Cross-Origin Resource Sharing)를 사용하여 리소스를 제공하는 원본이 해당 리소스와 공유되도록 허용하는지 확인
- 리소스가 다른 출처의 서버에서 로드될 때 사용되는 옵션을 정의

#### JS 난독화



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

- 위 예시와 같이 ```<script src='https://webcash.co.kr/test.min.js' data... attr></script>``` 로 선언하는 경우, 서버의 'test.min.js' 파일에서 각 속성값을 가져와야 함

<br/>

#### 1. currentScript 속성

- currentSciprt 속성 (<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript">공식문서</a>)으로 script tag 내 attribute 가져오기

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

- 토스페이먼츠의 javascript sdk에서 사용

  - 토스페이먼츠 javascript sdk <a href="https://github.com/tosspayments/browser-sdk" >github</a>
  - 토스페이먼츠 javascript sdk 개발자센터 <a href="https://docs.tosspayments.com/reference/js-sdk">공식 문서</a>

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



### 모듈화 도구

#### babel

#### webpack

#### 빌드 단축 방법

- yarn berry를 사용한 zero-install과 핫 플러그인 기능

### 개발

#### 공통 개발 규칙

- ##### 코드의 공통된 규칙

  팀원과 공통된 코드

1. ###### 바닐라 JS의 <u>엄격모드(Strict Mode)</u>

   - 순수 js의 경우, 엄격모드 사용으로 네임스페이스 변수 충돌 등 방지
   - 스코프에 따라서 설정할 수도 있음

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

- 메인은  ```var``` 전역 변수로 선언하며, 익명 함수를 담고 있음
- 초기 sdk loader에서 빠른 호출을 위한 캐싱
- window 전역 객체에 메인 변수가 있으면 호출

### 설치





https://www.npmjs.com/package/active-resource

https://www.intelligencelabs.tech/2de73df5-d697-471b-bbba-fe493642010a

https://jcsoohwancho.github.io/2019-10-25-%EC%B9%B4%EC%B9%B4%EC%98%A4-%EC%97%90%EB%94%94%ED%84%B0-SDK-%EC%A7%80%EC%9B%90-%ED%9B%84%EA%B8%B0/

https://mashup-android.vercel.app/mashup-11th/d2fault/20211031-how_to_architect_android_sdk/

https://lms0806.tistory.com/139

- 토스페이먼츠 JavaScript SDK

https://github.com/tosspayments/browser-sdk/tree/master

https://docs.tosspayments.com/reference/js-sdk

- 라인

JavaScript SDK 성능개선 방법 - 압축과 최적화로 실행시간 단축하기

https://engineering.linecorp.com/ko/blog/improve-javascript-sdk-performance

https://d2.naver.com/helloworld/2351859



- node.js integrity check

https://dev.to/orkhanhuseyn/verifying-integrity-of-files-using-nodejs-1gnd

- server - how to get attribute data in script tag (e.g - data -value )

https://stackoverflow.com/questions/14904378/get-data-attribute-of-script-tag

