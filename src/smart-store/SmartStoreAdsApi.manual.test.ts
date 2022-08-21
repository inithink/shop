import {SmartStoreAdsApi} from "./SmartStoreAdsApi";

require('dotenv').config();

jest.setTimeout(3 * 60 * 1000);
test('SmartStoreAdsApi', async () => {
  let id = process.env['SMART_STORE_USERNAME']!;
  let password = process.env['SMART_STORE_PASSWORD']!;

  let api = new SmartStoreAdsApi();
  await api.login(id, password);
  let bizMoney = await api.getBizMoney(
    2022, 8, 3,
    2022, 8, 9
  );
  console.log(bizMoney);
});
