import { loadSDK } from "./loader.js";

(async () => {
    const webcashSDK = await loadSDK('TestSdkVal', 'c6gBE6HrFVCNdmyl93bT3JTKhjzREs2J');
    await webcashSDK.increase();
    console.log(webcashSDK.getValue());
})();
