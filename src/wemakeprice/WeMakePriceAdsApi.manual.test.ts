import {WeMakePriceAdsApi} from "./WeMakePriceAdsApi";

require('dotenv').config();

jest.setTimeout(3 * 60 * 1000);
test('WeMakePriceAdsApi', async () => {
  let id = process.env['WE_MAKE_PRICE_USERNAME']!;
  let password = process.env['WE_MAKE_PRICE_ENCRYPT_PASSWORD']!;

  let api = new WeMakePriceAdsApi();
  await api.login(id, password);
  let json = await api.getPointChangeHistory(
    2022, 8, 2,
    2022, 8, 9,
    1, 50
  );
  console.log(json);
});
