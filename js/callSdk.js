import { loadSDK } from "./loader.js";

(async () => {
    const webcashSDK = await loadSDK('TestSdkVal', 'c6gBE6HrFVCNdmyl93bT3JTKhjzREs2J');
    await webcashSDK.increase();
    console.group('webcashSDK test')
    console.log('num:', webcashSDK.getValue());
    await webcashSDK.decrease();
    console.log('num:', webcashSDK.getValue());
    console.log('client key:', webcashSDK.getClientKey());
    console.groupEnd();
})();
