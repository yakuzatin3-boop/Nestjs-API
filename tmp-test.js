process.env.VERCEL = '1';
process.env.PORT = '0';
delete process.env.MONGODB_URI;
const appModule = require('./dist/main');
console.log('dist exports:', Object.keys(appModule));
if (!appModule.createApp) {
  console.error('createApp export missing');
  process.exit(1);
}
appModule.createApp()
  .then(() => console.log('createApp succeeded'))
  .catch(err => {
    console.error('createApp error:');
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  });
