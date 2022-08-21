import {TmonAdsApi} from "./TmonAdsApi";

require('dotenv').config();

jest.setTimeout(3 * 60 * 1000);
test('TmonAdsApi', async () => {
  let id = process.env['TMON_USERNAME']!;
  let password = process.env['TMON_PASSWORD']!;

  let api = new TmonAdsApi();
  await api.login(id, password);
  let json = await api.getAdsEffectDailyReport(
    2022, 8, 4,
    2022, 8, 8,
  );
  console.log(json);
});
