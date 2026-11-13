export const world = [
{title:'Tia sáng đầu tiên',kind:'Gương',desc:'Chạm vào gương để xoay tia sáng đến tinh thể.',rows:['.....','..T..','S./..','.....','.....']},
{title:'Góc khuất',kind:'Gương',desc:'Đổi hướng tia sáng để chạm tinh thể ở hàng trên.',rows:['.....','...T.','S../.','.....','.....']},
{title:'Bức tường cổ',kind:'Gương',desc:'Ánh sáng không xuyên qua đá. Hãy tìm một đường vòng.',rows:['././.','.....','S/#..','...T.','.....']},
{title:'Bình minh đỏ',kind:'Sắc màu',desc:'Chạm bộ lọc để chuyển màu tia sáng. Đích đỏ chỉ nhận ánh sáng đỏ.',rows:['.....','.....','S.F.R','.....','.....']},
{title:'Ngọc lam',kind:'Sắc màu',desc:'Một bộ lọc mới. Chạm để đổi giữa đỏ, lam và vàng.',rows:['.....','.....','S.F.B','.....','.....']},
{title:'Ngọn đèn vàng',kind:'Sắc màu',desc:'Điều chỉnh màu trước khi đưa ánh sáng đến tinh thể.',rows:['.....','.....','S.F.Y','.....','.....']},
{title:'Cây cầu ngủ',kind:'Thế giới',desc:'Đánh thức công tắc để cây cầu xuất hiện. Sau đó đưa tia sáng đến đích.',rows:['.....','.....','S.K=T','.....','.....']},
{title:'Đường vòng',kind:'Thế giới',desc:'Bật cầu rồi xoay gương để tia sáng đổi hướng.',rows:['.....','....T','S.K=/','.....','.....']},
{title:'Bóng đêm',kind:'Bóng tối',desc:'Bóng tối hấp thụ ánh sáng. Chạm bóng để đẩy nó sang một ô trống.',rows:['.....','.....','S.M.T','.....','.....']},
{title:'Đêm chuyển động',kind:'Bóng tối',desc:'Dời bóng tối khỏi đường sáng, rồi xoay gương.',rows:['.....','...T.','S.M/.','.....','.....']},
{title:'Ngã rẽ bí mật',kind:'Kết hợp',desc:'Ánh sáng cần đúng màu và đúng hướng để chạm đích.',rows:['.....','...R.','S.F/.','.....','.....']},
{title:'Cánh cửa cuối',kind:'Kết hợp',desc:'Kết hợp công tắc, cầu ánh sáng và gương để khôi phục cổng.',rows:['.....','....T','S.K=/','.....','.....']},
{title:'Tia sáng trở lại',kind:'Kết hợp',desc:'Dẫn tia sáng trở lại tinh thể phía trên.',rows:['.....','..T..','S./..','.....','.....']},
{title:'Lăng kính trong sương',kind:'Kết hợp',desc:'Đổi màu bộ lọc rồi xoay gương đưa ánh sáng đỏ đến tinh thể.',rows:['.....','...R.','S.F/.','.....','.....']},
{title:'Cầu qua vực',kind:'Thế giới',desc:'Đánh thức công tắc, nối cầu rồi xoay gương để chạm đích.',rows:['.....','....T','S.K=/','.....','.....']},
{title:'Bóng đêm và ngọc lam',kind:'Kết hợp',desc:'Dời bóng tối khỏi đường đi và điều chỉnh bộ lọc để chạm ngọc lam.',rows:['.....','.....','S.MFB','.....','.....']},
{title:'Đường sáng bị khóa',kind:'Kết hợp',desc:'Bật công tắc để nối cầu, sau đó đổi bộ lọc thành vàng để kích hoạt tinh thể.',rows:['.....','.....','SK=FY','.....','.....']},
{title:'Chòm sao thức giấc',kind:'Kết hợp',desc:'Giải câu đố cuối: bóng tối, gương và màu sắc cùng chặn ánh sáng.',rows:['.....','....R','S.MF/','.....','.....']}
];

export const garden = [
  {
    title: 'Đánh thức cây cổ thụ',
    desc: 'Xoay gương để tia sáng chạm tinh thể dưới tán cây.',
    rows: ['.....','..T..','S./..','.....','.....']
  },
  {
    title: 'Những bông hoa đầu tiên',
    desc: 'Đổi màu lăng kính để tinh thể đỏ đánh thức các bông hoa.',
    rows: ['.....','.....','S.F.R','.....','.....'],
    filters: [1]
  },
  {
    title: 'Cánh cổng dưới trăng',
    desc: 'Ấn công tắc, rồi dẫn tia sáng qua cầu đến tinh thể.',
    rows: ['.....','....T','S.K=/','.....','.....']
  },
  {
    title: 'Hội tụ dưới ánh trăng',
    desc: 'Nối cầu và dẫn một tia sáng qua cả hai tinh thể. Mỗi tinh thể cần một màu riêng.',
    rows: ['.../FB','...R..','...F..','SK=/..','......'],
    filters: [0, 1]
  },
  {
    title: 'Chòm sao đôi', area: 'stars',
    desc: 'Xoay lăng kính đôi. Một tia đi thẳng, tia còn lại rẽ sang tinh thể phía trên.',
    rows: ['..T..','.....','S.P.T','.....','..#..']
  },
  {
    title: 'Bản đồ trời đêm', area: 'stars',
    desc: 'Tách tia rồi chỉnh màu riêng cho từng nhánh để thắp hai đầu bản đồ sao.',
    rows: ['..R...','..F...','S.PF.B','..#...','......'],
    filters: [1, 2]
  },
  {
    title: 'Hạt mầm thức giấc', area: 'forest',
    desc: 'Tia lam đánh thức hạt mầm và mở cửa rễ cây. Sau cánh cửa, tinh thể cần tia vàng.',
    rows: ['......','......','SFAGFY','......','......'],
    filters: [0, 1]
  },
  {
    title: 'Dòng suối sau rễ', area: 'forest',
    desc: 'Dời bóng tối, đánh thức hạt mầm, rồi xoay gương và đổi màu tia cho tinh thể bên kia suối.',
    rows: ['.....Y','.....F','SFMAG/','......','......'],
    filters: [0, 0]
  },
  {
    title: 'Bình minh của khu vườn', area: 'dawn',
    desc: 'Thắp sáng hai tinh thể trước khi mặt trời lên. Dấu sáng trên từng cổ vật cho biết nó đang nhận được gì.',
    rows: ['..B..Y','..A...','..F..=','SKPGF/','..#...'],
    filters: [0, 0]
  }
];

world.forEach((stage, index) => {
  const id = index + 1;
  stage.filters = [[4, 11, 14].includes(id) ? 1 : [5, 16].includes(id) ? 2 : 0];
});
