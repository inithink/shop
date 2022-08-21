import {CoupangAdsApi} from "./CoupangAdsApi";

require('dotenv').config();

jest.setTimeout(3 * 60 * 1000);
test('CoupangAdsApi', async () => {
  let id = process.env['COUPANG_USERNAME']!;
  let password = process.env['COUPANG_PASSWORD']!;
  let api = new CoupangAdsApi();
  await api.login(id, password);

  let json = await api.getPAReport();
  console.log(json);
});
