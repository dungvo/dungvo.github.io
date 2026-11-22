import { createFoodServer } from '../server/api.mjs';

const token = 'food-assistant-demo-local-only';
const server = createFoodServer({ file: ':memory:', token });
server.listen(8787, '127.0.0.1', () => {
  console.log('Food Assistant demo: http://127.0.0.1:8787/#ket-noi');
  console.log('Mã quán demo: ' + token);
  console.log('Dữ liệu demo chỉ giữ trong phiên chạy này.');
});
