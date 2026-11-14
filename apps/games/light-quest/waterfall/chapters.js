export const routesToChapters = {
  stars: ['T02', 'T03', 'T04', 'T05'],
  roots: ['R02', 'R03', 'R04', 'R05'],
  old: ['S03', 'S04', 'S05']
};
export const finale = 'B04';

export const chapters = {
  T02: { title: 'Hai đèn cùng sáng', desc: 'Lăng kính đôi cho một tia đi thẳng và một tia rẽ. Thắp cả hai tinh thể.', rows: ['...T..','......','S..P.T','...#..','......'] },
  T03: { title: 'Bản đồ trời đêm', desc: 'Mỗi nhánh cần một màu. Chú ý màu của tia sau khi đi qua lăng kính.', rows: ['...R..','...F..','S..PFB','...#..','......'], filters: [1, 2] },
  T04: { title: 'Góc khuất của Đài Sao', desc: 'Tia phía trên phải đổi hướng lần nữa trước khi tới đích.', rows: ['..#...','.../FY','S..P.T','...#..','......'], filters: [0] },
  T05: { title: 'Ba dấu sao', desc: 'Dùng hai lăng kính đôi để chia đường tới ba đích.', rows: ['..R.Y.','..F.F.','S.P.PT','..#.#.','......'], filters: [1, 0] },
  R02: { title: 'Hạt Mầm và cửa rễ', desc: 'Hạt Mầm cần tia lam. Tinh thể bên kia cửa cần tia vàng.', rows: ['.....Y','.....F','SF.AG/','......','......'], filters: [0, 1] },
  R03: { title: 'Bờ suối bị chắn', desc: 'Dời bóng tối để tia tới Hạt Mầm. Sau cửa rễ, tìm cách đưa tia lên bờ đá.', rows: ['.....R','.....F','SFMAG/','...#..','......'], filters: [0, 0] },
  R04: { title: 'Nuôi rễ từ xa', desc: 'Một nhánh đánh thức Hạt Mầm. Nhánh còn lại đi qua cửa tới đích.', rows: ['..B...','..A...','..F...','S.PGFY','..#...'], filters: [0, 0] },
  R05: { title: 'Cầu qua dòng ngầm', desc: 'Sau khi mở cửa rễ, tìm công tắc của cầu và màu cho tinh thể bên kia.', rows: ['..B...','..A...','..F...','SKPGF/','..#..=','.....Y'], filters: [0, 0] },
  S03: { title: 'Cầu phụ sau cổng', desc: 'Ánh sáng cần qua cầu rồi vòng tránh vách đá.', rows: ['..#...','....T.','SK=./.','..#...','......'] },
  S04: { title: 'Đĩa sao trong vách', desc: 'Đá chắn hướng đi thẳng. Tìm lối vòng để đưa đúng màu đến đĩa sao.', rows: ['./.F.R','......','S/#...','......','......'], filters: [1] },
  S05: { title: 'Vườn rễ bỏ quên', desc: 'Dời bóng tối, chia tia cho Hạt Mầm và dẫn lối qua cửa đến đích.', rows: ['...B..','...A..','...F..','SM.PGT','...#..'], filters: [0] },
  B04: { title: 'Hai mạch bình minh', desc: 'Cửa rễ, cầu và hai tinh thể cùng chờ ánh sáng. Hãy xem cả hai nhánh cần gì.', rows: ['..B..R','..A..F','..F..=','SKPG./','..#...'], filters: [0, 0] }
};
