export const categories = ['Món chính', 'Ăn nhẹ', 'Đồ uống'];

export const photos = ['tai', 'nam', 'bo-kho', 'banh-mi', 'com-ga', 'goi-cuon', 'tra-da', 'ca-phe'];

export const defaultMenu = [
  { id: 'tai', name: 'Phở tái', aliases: ['tái', 'phở bò tái'], category: 'Món chính', price: 55000 },
  { id: 'chin', name: 'Phở bò chín', aliases: ['chín', 'phở chín'], category: 'Món chính', price: 55000 },
  { id: 'nam', name: 'Phở nạm', aliases: ['nạm', 'phở bò nạm'], category: 'Món chính', price: 59000 },
  { id: 'bo-kho', name: 'Bò kho', aliases: ['bò hầm'], category: 'Món chính', price: 65000 },
  { id: 'banh-mi', name: 'Bánh mì bò kho', aliases: ['bánh mì kho'], category: 'Món chính', price: 69000 },
  { id: 'com-ga', name: 'Cơm gà', aliases: ['cơm gà xối mỡ'], category: 'Món chính', price: 49000 },
  { id: 'goi-cuon', name: 'Gỏi cuốn', aliases: ['cuốn'], category: 'Ăn nhẹ', price: 29000 },
  { id: 'tra-da', name: 'Trà đá', aliases: ['nước trà', 'trà'], category: 'Đồ uống', price: 5000 },
  { id: 'ca-phe', name: 'Cà phê sữa đá', aliases: ['cà phê', 'cafe sữa', 'bạc xỉu'], category: 'Đồ uống', price: 29000 },
].map(item => ({ ...item, photo: photos.includes(item.id) ? item.id : '', active: true }));

export const stages = ['waiting', 'cooking', 'ready', 'served'];
export const stageNames = { waiting: 'Chờ nấu', cooking: 'Đang nấu', ready: 'Sẵn sàng', served: 'Đã phục vụ' };
export const money = amount => new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
export const fold = text => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, ' ').trim();
