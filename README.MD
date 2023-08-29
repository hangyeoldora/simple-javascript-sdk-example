# [웹브라우저] SDK 설계

## javascript SDK

### SDK 개요

### 디자인 철학

### 라이브러리 로드 보안

#### 하위 리소스 무결성 (SRI, Subresource Integrity)

- 브라우저는 타사 서버에 호스팅된 리소스가 변조되지 않았는지 확인해야 함 (소스 조작 시, 로드 X)
- 라이브러리가 타사 소스에서 로드될 때마다 SRI를 사용하는 것이 가장 좋음

#### 1. 무결성 (integrity)

#### 2. 교차 출처 (cross origin)

### 서버에서 script tag 내 attr 값 가져오기

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



위 예시와 같이 ```<script src='https://webcash.co.kr/test.min.js' data... attr></script>``` 로 선언하는 경우, 서버의 'test.min.js' 파일에서 각 속성값을 가져와야 함

##### 1. currentScript 속성

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
      // for...of
      for(let ele of attrList) console.log(`${ele.nodeName}: ${ele.nodeValue}`);
      for(let ele of attrList) {
          ele.nodeName === 'data-client-id' && console.log('ok') // 특정 attr 분기
      };
      // 펼침연산자 사용 (동일한 기능의 Array.from()도 가능)
      [...attrList].forEach(ele => console.log(`${ele.nodeName}: ${ele.nodeValue}`));
      Array.from(attrList).forEach(ele => console.log(`${ele.nodeName}: ${ele.nodeValue}`));
  })();
  ```  

- 결과값

  ```powershell
  이미지 넣기
  ```

- ㄱ

- ㄱ

##### 2.  querySelector 속성

- jQuery의 selector와 유사한 querySelector 속성을 사용하여 직접적으로 script에 접근

### 개발

### 설치