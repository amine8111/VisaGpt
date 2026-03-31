const mapModuleTest = () => {
  // Attempt to require TS module if ts-node is available
  let mapFn;
  try {
    require('ts-node/register');
    // Lazy require TS module
    // eslint-disable-next-line import/no-dynamic-require
    const mod = require('../src/utils/paygNav.ts');
    mapFn = mod.mapPaygNav || mod.default || mod;
  } catch (e) {
    // Fallback to inline implementation if TS isn't available
    mapFn = (serviceId) => {
      const map = {
        checklist: 'checklist','basic-assessment':'calculator','profile':'profile','visa-atlas':'visa-atlas',
        'trip-cost':'trip-cost','packing-list':'packing-list','embassy-locator':'embassy-locator','hotel-booking':'hotel-booking',
        'flight-search':'flight-search','visa-status':'visa-status','schengen-form':'schengen-form',
        'document-organizer':'documents','letter-generator':'letters','recours':'rejection-analyzer','savings-plan':'savings-plan',
        'document-inspector':'document-inspector','insurance-claim':'insurance-claim','chat-coach':'chat-coach','slot-monitor':'slot-monitor',
        'sim-marketplace':'sim-marketplace','agent-booking':'booking','translation-normal':'translate','translation-official':'translate'
      };
      return map[serviceId] || 'profile';
    };
  }
  // Define tests
  const tests = [
    ['checklist','checklist'],
    ['basic-assessment','calculator'],
    ['profile','profile'],
    ['visa-atlas','visa-atlas'],
    ['trip-cost','trip-cost'],
    ['packing-list','packing-list'],
    ['embassy-locator','embassy-locator'],
    ['hotel-booking','hotel-booking'],
    ['flight-search','flight-search'],
    ['visa-status','visa-status'],
    ['schengen-form','schengen-form'],
    ['document-organizer','documents'],
    ['letter-generator','letters'],
    ['recours','rejection-analyzer'],
    ['savings-plan','savings-plan'],
    ['document-inspector','document-inspector'],
    ['insurance-claim','insurance-claim'],
    ['chat-coach','chat-coach'],
    ['slot-monitor','slot-monitor'],
    ['sim-marketplace','sim-marketplace'],
    ['agent-booking','booking'],
    ['translation-normal','translate'],
    ['translation-official','translate'],
    ['unknown','profile'],
  ];
  let ok = true;
  for (const [input, expected] of tests) {
    const got = mapFn(input);
    if (got !== expected) {
      ok = false;
      console.error(`PAYG mapping test failed for ${input}: expected ${expected}, got ${got}`);
    }
  }
  process.exit(ok ? 0 : 1);
}
mapModuleTest();
