#!/usr/bin/env python3
"""Record explicit item-level decisions from Q9 continuation; never approve release."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPORTS = ROOT / 'content-workspace/programs/quote-library-p0/reports'
# id | theme (empty when context is insufficient) | role | rationale
DECISIONS = '''research.day55.001||internal_editorial_note|Hướng dẫn chọn scene cho thư viện, không phải lời trích từ tác phẩm.
research.day55.003||internal_editorial_note|Quyết định định dạng Story/Reflection trong workflow.
research.day55.004||internal_editorial_note|Báo cáo khoảng trống coverage nội bộ.
research.day55.005||internal_editorial_note|Quy tắc tuyển candidate theo ngày nghiên cứu.
research.reaudit.day21.canhchongcon_hiddenburden|relationships|perspective_candidate|Gánh nặng trong quan hệ và trở ngại khi nói ra; cần đối chiếu ngữ cảnh nguồn.
research.day40.001||internal_editorial_note|So sánh chức năng biên tập giữa truyền thống.
research.day40.002||internal_editorial_note|Quy tắc xác minh xuất xứ, không phải quote tác phẩm.
research.day40.003||internal_editorial_note|Chiến lược mở rộng coverage thư viện.
research.day40.004||internal_editorial_note|Yêu cầu giữ bối cảnh văn hóa trong metadata và biên tập.
research.dhammapada.day11.v006|relationships|religious_or_ethical_context|Liên hệ tính hữu hạn với việc hòa giải tranh chấp; cần kiểm tra bản dịch.
research.dhammapada.day11.v083|emotion|perspective_candidate|Ý chính là ổn định trước cảm giác dễ chịu và khó chịu.
research.dhammapada.day11.v165|meaning_values|religious_or_ethical_context|Trách nhiệm đạo đức cá nhân và sự thanh tịnh, không suy thành tự chữa lành.
research.dhammapada.day11.v320|adversity_resilience|perspective_candidate|Ẩn dụ chịu mũi tên để nói khả năng chịu lời công kích; cần giới hạn tránh cổ vũ chịu bạo hành.
research.dhammapada.day11.v348|attention|religious_or_ethical_context|Buông bám chấp vào quá khứ, tương lai và hiện tại; chưa xác minh phần diễn giải thêm.
research.epictetus.day7.discourses.1_18.037|attention|perspective_candidate|Phán đoán chủ quan dẫn đến hành động và có thể sai.
research.epictetus.day7.enchiridion.33.025|relationships|perspective_candidate|Tiết chế lời nói trong giao tiếp; câu quá ngắn nên cần đoạn nguồn.
research.huainanzi.day6.ch07.004|self_understanding|religious_or_ethical_context|Quan niệm cổ về thân, tâm và tinh thần; không dùng như kết luận khoa học.
research.huainanzi.day6.ch14.020|self_understanding|perspective_candidate|Khen chê và cách nhìn của người khác về mình.
research.laozi.ch09.024|meaning_values|perspective_candidate|Tính không bền của tài sản và giới hạn tích lũy.
research.laozi.day2.ch24.015||context_required|Cụm những thứ dư thừa ấy thiếu tiền đề, chưa đủ nghĩa độc lập.
research.laozi.day2.ch27.022|change_growth|religious_or_ethical_context|Ẩn dụ về sự thành thạo; cần giữ ngữ cảnh triết học của chương.
research.laozi.day2.ch29.036|meaning_values|religious_or_ethical_context|Tiết độ, tránh thái quá và phô trương.
research.laozi.day2.ch31.041||context_required|Động từ dùng thiếu đối tượng; ngữ cảnh binh khí cần được phục hồi trước phân loại.
research.laozi.day2.ch34.052|meaning_values|religious_or_ethical_context|Mô tả Đạo trong hệ tư tưởng, chưa có góc nhìn đời sống độc lập.
research.laozi.day2.ch42.084|meaning_values|religious_or_ethical_context|Vũ trụ luận Đạo gia; không phải mệnh đề khoa học.
research.laozi.day2.ch42.086||narrative_or_historical_context|Chi tiết danh xưng vua chúa cần giải thích để hiểu ý khiêm hạ.
research.laozi.day2.ch42.088|relationships|religious_or_ethical_context|Cảnh báo cường bạo trong cách đối xử; không diễn thành quy luật nhân quả chắc chắn.
research.laozi.day2.ch43.090||context_required|Ẩn dụ cái không hình thiếu bối cảnh, không đủ cơ sở gán theme trải nghiệm.
research.laozi.day2.ch50.118||context_required|Câu trả lời và đại từ ấy bị tách khỏi đoạn trước.
research.laozi.day3.ch55.018|meaning_values|religious_or_ethical_context|Ẩn dụ đức và trẻ sơ sinh, cần giải nghĩa theo chương nguồn.
research.laozi.day3.ch63.055|relationships|religious_or_ethical_context|Đáp oán bằng đức là ý quan hệ nổi bật; phần lớn nhỏ cần đối chiếu khi biên tập.
research.laozi.day3.ch72.095|relationships|perspective_candidate|Không áp chế người khác; cần kiểm tra việc chuyển bối cảnh trị dân sang cá nhân.
research.laozi.day3.ch73.100|meaning_values|religious_or_ethical_context|Nghịch lý vô vi; tránh hiểu là không cần hành động vẫn đạt mục tiêu.
research.laozi.day3.ch80.130||narrative_or_historical_context|Mô tả xã hội lý tưởng trong chương, không đủ nghĩa quote độc lập.
research.liezi.day5.ch01.003|meaning_values|religious_or_ethical_context|Mệnh đề nguồn gốc trong triết học cổ, không phải bằng chứng khoa học.
research.liezi.day5.ch01.007|change_growth|perspective_candidate|Đổi cách nhìn tuổi già qua những gánh nặng được buông.
research.liezi.day5.ch02.017|change_growth|religious_or_ethical_context|Thành thạo và hành động không cưỡng ép trong ngữ cảnh Đạo gia.
research.liezi.day5.ch02.019||context_required|Mệnh đề chung thiếu đối tượng và câu chuyện dẫn tới ý này.
research.liezi.day5.ch02.021|self_understanding|religious_or_ethical_context|Ranh giới bản ngã trong triết học; không đưa thành khẳng định tâm lý phổ quát.
research.liezi.day5.ch03.025||narrative_or_historical_context|Lời tóm tắt cách mở truyện, không phải lời trích nhân vật hay tác phẩm.
research.liezi.day5.ch03.028||narrative_or_historical_context|Tóm tắt trải nghiệm Mục Vương, cần cả truyện để hiểu.
research.liezi.day5.ch04.033|meaning_values|perspective_candidate|Tiết chế sức mạnh khi đang có ưu thế.
research.liezi.day5.ch05.039|emotion|narrative_or_historical_context|Tóm tắt truyện giảm nỗi lo bằng mô hình cổ; không dùng mô hình đó làm khoa học hiện đại.
research.liezi.day5.ch05.043|adversity_resilience|narrative_or_historical_context|Lập luận kiên trì trong truyện dời núi, cần giữ điều kiện và bối cảnh.
research.liezi.day5.ch07.055|relationships|narrative_or_historical_context|Ưu tiên chăm sóc người còn sống hơn phô trương tang lễ; hiện là lời tóm tắt nguồn.'''

DECISIONS_20261022 = '''research.liezi.day5.ch07.056|meaning_values|religious_or_ethical_context|Đặt ranh giới hy sinh và tư lợi trong thiên Dương Chu; phải giữ cả hai vế.
research.liezi.day5.ch08.072|change_growth|context_required|Ý về phân nhánh có thể phù hợp thay đổi nhưng nền và nhánh chưa rõ đối tượng.
research.marcus.day8.book02.2_1.006|relationships|narrative_or_historical_context|Tóm tắt quan niệm sống chung của Marcus; đại từ ông cần thay bằng xuất xứ rõ.
research.marcus.day8.book05.5_1.017|work_achievement|narrative_or_historical_context|Lời tự nhắc về bổn phận khi thức dậy; không suy thành phán xét người cần nghỉ.
research.marcus.day8.book09.9_4.033|meaning_values|religious_or_ethical_context|Khẳng định đạo đức Khắc kỷ về tác động của việc làm sai lên phẩm chất.
research.marcus.day8.book11.11_18.042|relationships|perspective_candidate|Sự liên đới là góc nhìn khi giận người khác, chưa phải cách xử lý mọi xung đột.
research.marcus.day8.book12.12_3.045||context_required|Chưa nêu các phần được tách nên chưa có ý đủ rõ cho người đọc.
research.mn.day12.mn62_03||context_required|Ẩn dụ lửa gắn với bản sắc cần đối chiếu nguyên đoạn trước khi gán chủ đề.
research.seneca.day9.brev7|rest_wellbeing|religious_or_ethical_context|Quan niệm về nhàn rỗi có suy tưởng; cần chuyển leisure sang tiếng Việt sau khi xác minh.
research.seneca.day9.ep007|relationships|context_required|Cảnh báo đám đông thiếu tình huống cụ thể, dễ bị hiểu thành tránh giao tiếp.
research.seneca.day9.ep007_2|relationships|context_required|Nghịch lý một người và đám đông cần đoạn giải thích để tránh đánh giá giá trị con người.
research.seneca.day9.ep083|meaning_values|religious_or_ethical_context|Nhất quán đạo đức giữa riêng tư và công khai; cần kiểm tra xuất xứ lời dẫn.
research.seneca.day9.ep118|attention|perspective_candidate|Quan sát đời sống tạo chất liệu viết; ý chính là chú ý điều đang xảy ra.
research.seneca.day9.ep123|meaning_values|perspective_candidate|Biết đủ và giảm lệ thuộc vào điều kiện vật chất.
research.zhuangzi.day4.ch06.053||context_required|Câu tọa vong không tự giải nghĩa; cần hội thoại đầy đủ trước biên tập.
research.day23.nbk_gioitham_03|meaning_values|religious_or_ethical_context|Răn về lòng tham; cần giải nghĩa từ cổ và tránh biến thành luật chắc chắn.
research.day23.nbk_nttt_03|relationships|perspective_candidate|Chân thực và đãi bôi trong đối xử; cần giữ giọng cổ hoặc ghi rõ phỏng theo.
research.day23.rt_bkc1_02|self_understanding|context_required|Nhận diện lòng người và được mất; cần chú giải sá, tua và đối chiếu nguyên văn.
research.day24.kieu_001|adversity_resilience|multiple_passages_in_one_capture|Dấu ba chấm nối những câu không liền nhau; phục hồi dòng và ngữ cảnh trước xuất bản.
research.day25.an15_23|relationships|religious_or_ethical_context|Nguyên tắc không áp điều mình không muốn lên người khác.
research.day27.an_bu_jiu_ban|work_achievement|perspective_candidate|Chia việc phức tạp theo trình tự; kiểm tra phần diễn giải hiện đại so với thành ngữ.
research.day30.tabi_yande|self_understanding|narrative_or_historical_context|Lời diễn giải haiku về thân bệnh và giấc mơ; cần tách câu thơ khỏi bình luận.
research.laozi.day2.ch36.063|meaning_values|context_required|Diễn giải công cụ sắc bén của hệ thống còn trừu tượng; cần phục hồi bối cảnh quyền lực.
research.marcus.day8.book05.5_1.018|work_achievement|narrative_or_historical_context|Lời tự vấn cùng đoạn với 5.1.017; gộp review đoạn nguồn thay vì coi hai quote độc lập.
research.reaudit.day17.pd35_hidden_wrongdoing|meaning_values|religious_or_ethical_context|Lo bị phát hiện gắn với hành vi sai; đây là luận điểm triết học chưa phải quy luật tâm lý.
research.day26.gong_sun_chou_haoran|meaning_values|religious_or_ethical_context|Tóm tắt khái niệm hạo nhiên chi khí cần giải thích trong truyền thống Nho gia.
research.dhammapada.day11.v278|meaning_values|religious_or_ethical_context|Diễn giải khổ và sự bám giữ; cần đối chiếu thuật ngữ thay vì suy thành bất mãn thông thường.
research.laozi.day2.ch37.066||context_required|Hình ảnh mộc chưa đặt tên chưa giải nghĩa, chưa có ý độc lập cho reader.
research.laozi.day2.ch39.074|meaning_values|religious_or_ethical_context|Vũ trụ luận về nhất thể; giữ là quan niệm văn bản, không khẳng định cơ chế vật lý.
research.laozi.day2.ch45.098|rest_wellbeing|religious_or_ethical_context|Động tĩnh và cân bằng là lăng kính triết học, không phải hướng dẫn điều trị.
research.laozi.day2.ch46.100|meaning_values|religious_or_ethical_context|Biết đủ và giới hạn ham muốn; hiện là tóm tắt nội dung chương.
research.laozi.day2.ch50.116|meaning_values|context_required|Câu vì sao thiếu tiền đề; không biến cảnh báo bám chấp thành khuyên coi nhẹ mạng sống.
research.laozi.day3.ch53.012|meaning_values|narrative_or_historical_context|Tương phản xa hoa và thiếu hụt xã hội; phần nền cần gọi cụ thể từ đoạn gốc.
research.laozi.day3.ch55.020||context_required|Hình ảnh trẻ khóc cần giữ ngữ cảnh ẩn dụ, không dùng như nhận định sinh lý.
research.laozi.day3.ch55.022|rest_wellbeing|religious_or_ethical_context|Phê phán cưỡng ép sức sống trong tư tưởng cổ; tránh suy ra hướng dẫn sức khỏe.
research.laozi.day3.ch57.028|work_achievement|religious_or_ethical_context|Phân biệt quản trị và chiến thuật trong văn bản trị quốc, không tự áp cho mọi tổ chức.
research.laozi.day3.ch57.030|work_achievement|religious_or_ethical_context|Quan hệ quy định và hệ quả trong tư tưởng trị quốc; cần nêu điều kiện khi diễn giải.
research.laozi.day3.ch60.044|relationships|context_required|Các phía chưa xác định; cần chương đầy đủ để phân biệt trị quốc và quan hệ cá nhân.
research.laozi.day3.ch61.046|relationships|religious_or_ethical_context|Ở thấp, mềm và tĩnh trong quan hệ quyền lực; không chuyển thành công thức luôn thắng.
research.laozi.day3.ch65.069|work_achievement|religious_or_ethical_context|Quan điểm cổ về điều phối và mưu trí; cần tránh hợp thức hóa hạn chế hiểu biết của dân.
research.laozi.day3.ch75.106|meaning_values|context_required|Mục tiêu và hệ quả chưa rõ; cần xem lại đoạn trị dân trước khi khái quát.
research.laozi.day3.ch79.125|meaning_values|religious_or_ethical_context|Đạo trời và điều thiện là quan điểm đạo đức của văn bản, không phải bảo đảm thưởng phạt.
research.laozi.day3.ch80.126|meaning_values|narrative_or_historical_context|Mô tả cộng đồng lý tưởng; không phải bằng chứng xã hội thực tế.
research.liezi.day5.ch04.030|self_understanding|religious_or_ethical_context|Phân biệt trải nghiệm sâu với chạy theo cảm giác và phô tri thức.
research.liezi.day5.ch06.053|change_growth|religious_or_ethical_context|Thịnh suy và giới hạn ý chí; giữ khả năng hành động thay vì suy ra định mệnh.
research.liezi.day5.ch07.057|relationships|religious_or_ethical_context|Giả thuyết đạo đức không xâm phạm để mưu lợi; hiện là lời bình về văn bản.
research.buddhist.day14.mn105_wound_02|change_growth|narrative_or_historical_context|Ẩn dụ nguyên nhân và dấu vết còn lại; không dùng như khẳng định y khoa nếu thiếu bằng chứng.
research.buddhist.day14.mn21_vede_01|emotion|narrative_or_historical_context|Truyện kiểm tra sự điềm tĩnh khi điều kiện thay đổi; cần đọc cả truyện và quan hệ chủ-tớ.
research.buddhist.day14.mn66_quail_01|adversity_resilience|narrative_or_historical_context|Cùng vật cản có mức ảnh hưởng khác tùy năng lực; phù hợp Story sau xác minh.
research.buddhist.day14.sn1267_reeds_01|relationships|religious_or_ethical_context|Ẩn dụ nương tựa lẫn nhau; cần đối chiếu đối tượng gốc trước diễn giải thành quan hệ xã hội.'''

DECISIONS_20261022 += '''
research.buddhist.day14.sn207_drum_01|change_growth|narrative_or_historical_context|Truyện chiếc trống thay dần bộ phận; cần giữ ý của kinh trước liên hệ bản sắc.
research.buddhist.day14.sn325_mountains_02|meaning_values|context_required|Giới hạn và điều đáng làm cần được gắn lại với ẩn dụ núi và tính hữu hạn.
research.buddhist.day14.sn4719_acrobat_01|relationships|narrative_or_historical_context|Truyện biểu diễn thăng bằng về chăm mình và người khác; cần giữ cả hai chiều.
research.buddhist.day14.sn4719_acrobat_02|relationships|perspective_candidate|Sự hỗ trợ qua lại giữa chăm bản thân và chăm người khác; đối chiếu cùng đoạn với acrobat_01.
research.buddhist.day14.snp28_boat_01|relationships|narrative_or_historical_context|Ẩn dụ khả năng giúp người khác; tránh quy kết người đang khó khăn không có giá trị đóng góp.
research.buddhist.day14.ud64_elephant_02|attention|perspective_candidate|Nhầm quan sát một phần với toàn bộ sự thật; cần liên kết nguồn truyện con voi.
research.day16.external_conditions|meaning_values|religious_or_ethical_context|Đời sống tốt gồm phẩm chất và điều kiện bên ngoài trong quan điểm Aristotle.
research.day16.feelings_not_character|emotion|religious_or_ethical_context|Phân biệt cảm xúc với tính cách và lựa chọn; giữ là lập luận triết học.
research.day16.few_deep_friends|relationships|perspective_candidate|Giới hạn thời gian và sự gần gũi của tình bạn sâu; không gán con số phổ quát.
research.day16.friendship_types|relationships|religious_or_ethical_context|Các nền tảng khác nhau của tình bạn trong phân loại Aristotle.
research.day16.goodwill_not_friendship|relationships|religious_or_ethical_context|Phân biệt thiện ý và tình bạn; cần Việt hóa thuật ngữ và xác minh lời diễn giải.
research.day16.happy_needs_friends|relationships|religious_or_ethical_context|Tự đủ vẫn có chỗ cho bạn bè; thuật ngữ flourishing cần dịch theo ngữ cảnh.
research.day16.mean_relative|meaning_values|religious_or_ethical_context|Trung dung phụ thuộc hoàn cảnh chứ không phải trung bình số học.
research.day16.one_swallow|meaning_values|religious_or_ethical_context|Đánh giá đời sống trên thời gian dài thay vì một ngày; kiểm tra bản dịch mùa hè.
research.day17.consistency_end|meaning_values|perspective_candidate|Nhất quán giữa lựa chọn gần và mục tiêu sống.
research.day17.desire_no_pain|meaning_values|religious_or_ethical_context|Phân biệt ham muốn cần thiết theo Epicurus; không suy thành tiêu chuẩn sức khỏe.
research.day17.enough_stops_search|self_understanding|perspective_candidate|Nhận diện nhu cầu ban đầu và động cơ tìm thêm; cần tránh tự gán nguyên nhân cho mọi người.
research.day17.fame_security_test|self_understanding|perspective_candidate|Kiểm tra động cơ tìm an toàn qua danh tiếng.
research.day17.friendship_not_extra|relationships|religious_or_ethical_context|Tình bạn là một phần của đời sống an ổn trong Epicurus.
research.day17.friendship_security|relationships|religious_or_ethical_context|Cùng luận điểm tình bạn và an ổn; xem xét gộp với friendship_not_extra sau đối chiếu.
research.day17.justice_mutual_harm|meaning_values|religious_or_ethical_context|Công bằng dựa trên thỏa thuận không gây hại; không coi là định nghĩa duy nhất.
research.day17.pleasure_not_luxury|rest_wellbeing|religious_or_ethical_context|Giải thích lạc thú theo Epicurus; chưa phải quote nguyên văn.
research.day17.prudence_choice|self_understanding|religious_or_ethical_context|Suy xét lý do lựa chọn và tránh né; cần Việt hóa sober reasoning.
research.day17.security_quiet_life|meaning_values|religious_or_ethical_context|Đời sống ít cạnh tranh như một lựa chọn giá trị, không khuyên mọi người rút khỏi xã hội.
research.day17.simple_not_deprivation|meaning_values|religious_or_ethical_context|Giản dị để giảm lệ thuộc; cần dịch enoughness và giữ khác biệt với thiếu thốn bắt buộc.
research.day18.2_50|work_achievement|religious_or_ethical_context|Bình thản với kết quả đi cùng làm việc có trách nhiệm; giữ bối cảnh Gita.
research.day18.2_70|emotion|religious_or_ethical_context|Ẩn dụ đại dương về sự vững trước ham muốn; cần Việt hóa steadiness và desire.
research.day18.5_10|meaning_values|religious_or_ethical_context|Ẩn dụ lá sen về hành động không chấp trước; tách lời nhắc biên tập khỏi nội dung reader.
research.day19.isha_knowledge_pair|meaning_values|religious_or_ethical_context|Cặp vidyā và avidyā có nghĩa đặc thù; cần giải nghĩa trước khi dùng như góc nhìn học tập.
research.day19.katha_choice_examines|self_understanding|context_required|Hai lựa chọn chưa nêu cụ thể; phục hồi đối lập trong đoạn nguồn trước biên tập.
research.day19.kena_known_unknown|meaning_values|religious_or_ethical_context|Nghịch lý nhận biết đối tượng siêu hình; không tự suy thành lý thuyết mọi tri thức.
research.day19.kena_questioning_mode|attention|perspective_candidate|Câu hỏi đổi điểm nhìn; cần xác minh đây là phỏng theo hay bình luận biên tập.
research.day20.lion_makers|change_growth|narrative_or_historical_context|Truyện phân biệt kỹ thuật với phán đoán nên làm; cần dịch các thuật ngữ Anh.
research.day20.mice_elephant|relationships|narrative_or_historical_context|Năng lực hữu ích phụ thuộc tình huống; có thể phát triển truyện chuột và voi.
research.day20.winning_friends|relationships|narrative_or_historical_context|Nhóm khác năng lực hỗ trợ lẫn nhau; cần nguồn truyện cụ thể.
research.nikaya.day13.an10_60_01|meaning_values|religious_or_ethical_context|Tóm tắt nhiều phép quán; không trình bày như bộ công cụ trị liệu đã được chứng minh.
research.nikaya.day13.an5_57_02|self_understanding|religious_or_ethical_context|Phần trách nhiệm hành động giữa các điều không kiểm soát; cần giữ nghĩa gốc về nghiệp.
research.nikaya.day13.an6_63_01|self_understanding|religious_or_ethical_context|Phân biệt biểu hiện hành động và ý định; không suy đoán động cơ cá nhân.
research.nikaya.day13.an6_63_02|self_understanding|religious_or_ethical_context|Xem điều kiện của ham muốn thay vì quy kết thiếu ý chí; kiểm tra phần diễn giải hiện đại.
research.nikaya.day13.an8_6_02|emotion|religious_or_ethical_context|Trải nghiệm đổi thay không quyết định toàn bộ giá trị bản thân; xác minh phần thêm về self-worth.
research.nikaya.day13.sn22_95_05|attention|religious_or_ethical_context|Ẩn dụ ý thức như ảo thuật trong kinh; không dùng như bằng chứng thần kinh học.
research.nikaya.day13.sn35_246_01|meaning_values|narrative_or_historical_context|Cây đàn minh họa sự phụ thuộc nhiều điều kiện; cần giữ ý của toàn truyện.
research.nikaya.day13.sn36_6_01|emotion|religious_or_ethical_context|Ẩn dụ mũi tên thứ hai; không quy trách nhiệm cho người đang đau hay hứa kiểm soát được phản ứng.
research.nikaya.day13.sn36_6_02|emotion|religious_or_ethical_context|Cùng nguồn mũi tên với sn36_6_01; cần gộp review và tránh so sánh chịu đau giỏi/dở.
research.nikaya.day13.sn47_6_01|adversity_resilience|narrative_or_historical_context|Truyện lợi thế địa hình; cần đối chiếu nghĩa tu tập trước diễn giải thành vùng an toàn.
research.plato.day15.crito46b_01|self_understanding|perspective_candidate|Xem xét hướng đi của nhiệt thành; chưa xác minh độ sát lời thoại.
research.plato.day15.euth15c_01|change_growth|narrative_or_historical_context|Bắt đầu lại câu hỏi khi định nghĩa vòng tròn; phù hợp truyện về tìm hiểu.
research.plato.day15.meno80e_01|change_growth|narrative_or_historical_context|Nghịch lý tìm kiếm điều chưa biết; giữ cấu trúc đối thoại thay vì giải quyết quá đơn giản.
research.plato.day15.meno81d_01|change_growth|perspective_candidate|Không dùng việc chưa biết để dừng tìm hiểu; đối chiếu với meno80e_01 để tránh lặp ý.
research.plato.day15.phaedr274c_01|change_growth|perspective_candidate|Phân biệt tiếp xúc tri thức với hiểu biết; ghi rõ liên hệ hiện đại nếu nói về công cụ số.
research.plato.day15.phaedr275a_01|change_growth|narrative_or_historical_context|Đối thoại về chữ viết, trí nhớ và nhắc nhớ; đi cùng phaedr274c_01 như một cụm nguồn.
research.plato.day15.rep331c_02|meaning_values|narrative_or_historical_context|Hoàn cảnh có thể thay đổi ý nghĩa đạo đức của việc trả đồ đã mượn.
research.plato.day15.rep514a_01|attention|narrative_or_historical_context|Ẩn dụ hang động và giới hạn điểm nhìn; cần phân biệt truyện với mô tả tâm lý thực nghiệm.
research.plato.day15.rep518c_01|change_growth|religious_or_ethical_context|Quan điểm giáo dục như chuyển hướng nhìn trong Republic, không phải kết luận khoa học học tập.
research.plato.day15.sym204a_01|change_growth|perspective_candidate|Tự cho đã biết đủ có thể làm giảm tìm hiểu; tránh khái quát tuyệt đối.
research.plato.day15.sym204b_01|change_growth|narrative_or_historical_context|Diotima nói về khoảng giữa thiếu và tìm trí tuệ; gộp review với sym204a_01.
research.reaudit.day21.hamdanhlợi|self_understanding|perspective_candidate|Cùng địa vị gợi các nhu cầu khác nhau; giữ khác biệt giữa người với người.
research.day30.ryokan_maple_disputed|self_understanding|context_required|Văn bản tự ghi attribution tranh luận; không gán chắc cho Ryōkan hoặc phát hành khi chưa xác minh.
research.day31.saadi.009|adversity_resilience|perspective_candidate|Giới hạn của kiên nhẫn, không khuyến khích chịu mọi hoàn cảnh; cần chứng minh liên hệ Saadi.
research.day31.saadi.011|meaning_values|perspective_candidate|Biết đủ qua nhu cầu và sở hữu; cần xác minh tác phẩm và đoạn cụ thể.'''

def main():
    matrix_path = ROOT/'studio/review-matrix/data.json'
    if hashlib.sha256(matrix_path.read_bytes()).hexdigest() != 'b273d4172fc3e33e40b24e9da041c60b732be3a1edc41f114960dd8ad5c01cc2':
        raise ValueError('Matrix changed; re-read the content before recording these decisions.')
    matrix = json.loads(matrix_path.read_text())
    rows = {r['id']: r for r in matrix['rows']}
    path = REPORTS/'q9-semantic-theme-review.json'
    review = json.loads(path.read_text())
    items = {x['id']: x for x in review['items']}
    batches = [('2026-10-21', DECISIONS), ('2026-10-22', DECISIONS_20261022)]
    for date, decisions in batches:
        for line in decisions.splitlines():
            ident, theme, role, note = line.split('|')
            text = rows[ident]['text_vi']
            items[ident] = dict(id=ident, text_sha256=hashlib.sha256(text.encode()).hexdigest(),
                                theme=theme or None, content_role=role, reviewer='ai:codex',
                                review_date=date, note_vi=note, release_approved=False)
    review['items'] = list(items.values())
    path.write_text(json.dumps(review, ensure_ascii=False, indent=2)+'\n')
    print(f'Total {len(items)} reviewed rows.')

if __name__ == '__main__':
    main()
