import {Shop11stAdsApi} from "./Shop11stAdsApi";

require('dotenv').config();

jest.setTimeout(3 * 60 * 1000);
test('Shop11stAdsApi', async () => {
  let username = process.env['SHOP_11ST_USERNAME'];
  let password = process.env['SHOP_11ST_PASSWORD'];
  let tfpSop = process.env['SHOP_11ST_TFA_SOP'];
  if (!username || !password || !tfpSop) {
    throw new Error('environment variables not set');
  }
  let api = new Shop11stAdsApi(tfpSop);
  await api.login(username, password);
  let history = await api.getSellerPointHistory(
    2022, 7, 6,
    2022, 8, 6,
    1, 100,
  );
  console.log(history);
});
