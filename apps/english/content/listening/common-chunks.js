// High-frequency chunks for everyday and workplace listening.
// Loaded after practice.js so existing progress IDs remain stable.
(() => {
  "use strict";

  const topics = window.ListeningPractice || [];
  const item = (topic, [id, en, vi, distractors, clue, transfer]) => ({
    id, en, vi, distractors, clue, transfer, topic
  });
  const add = (topicId, rows) => {
    const topic = topics.find((entry) => entry.id === topicId);
    if (topic) topic.items.push(...rows.map((row) => item(topicId, row)));
  };
  const addTopic = (id, title, note, rows) => topics.push({
    id, title, note, items: rows.map((row) => item(id, row))
  });

  add("clarify", [
    ["clarify-6", "What do you mean by that?", "Ý bạn khi nói điều đó là gì?", ["Tại sao bạn lại nói điều đó?", "Bạn có đồng ý với điều đó không?"], "What do you mean by …? = ý bạn khi nói … là gì?", "Hỏi ý người kia khi họ nói ‘urgent’."],
    ["clarify-7", "Could you say that one more time?", "Bạn có thể nói lại điều đó thêm một lần nữa không?", ["Bạn có thể nói điều khác được không?", "Bạn có thể nói điều đó lần cuối không?"], "one more time = thêm một lần nữa", "Nhờ người kia nói lại tên của họ."],
    ["clarify-8", "Let me see if I understood correctly.", "Để tôi xem mình đã hiểu đúng chưa.", ["Để tôi xem bạn đã làm đúng chưa.", "Để tôi giải thích lại cho rõ."], "if I understood correctly = liệu tôi đã hiểu đúng hay chưa", "Nói câu này trước khi tóm tắt một yêu cầu."],
    ["clarify-9", "Can you be more specific?", "Bạn có thể nói cụ thể hơn không?", ["Bạn có thể nói ngắn hơn không?", "Bạn có thể nói lịch sự hơn không?"], "more specific = cụ thể hơn", "Nhờ đồng nghiệp nói rõ họ cần báo cáo nào."],
    ["clarify-10", "Did you mean this one?", "Ý bạn là cái này phải không?", ["Bạn đã làm cái này phải không?", "Bạn có muốn cái khác không?"], "Did you mean …? dùng để kiểm tra mình đã hiểu đúng đối tượng", "Chỉ vào một tệp và hỏi xem đó có phải tệp họ muốn không."]
  ]);

  add("office", [
    ["office-6", "It's at the end of the hall.", "Nó ở cuối hành lang.", ["Nó ở giữa hành lang.", "Nó ở đầu cầu thang."], "at the end of the hall = ở cuối hành lang", "Chỉ vị trí nhà vệ sinh ở cuối hành lang."],
    ["office-7", "Take the elevator to the third floor.", "Đi thang máy lên tầng ba.", ["Đi cầu thang bộ xuống tầng ba.", "Đợi thang máy ở tầng ba."], "take the elevator = đi bằng thang máy", "Đổi điểm đến thành tầng năm."],
    ["office-8", "It's right across from the pantry.", "Nó ở ngay đối diện khu pantry.", ["Nó ở ngay cạnh khu pantry.", "Nó nằm bên trong khu pantry."], "across from = đối diện", "Mô tả một phòng nằm đối diện thang máy."],
    ["office-9", "You can't miss it.", "Bạn sẽ dễ dàng nhìn thấy nó.", ["Bạn không được bỏ lỡ cuộc hẹn.", "Bạn không thể đến đó được."], "You can't miss it là cách nói vị trí rất dễ nhận ra", "Dùng câu này sau khi chỉ một nơi có biển hiệu lớn."],
    ["office-10", "I'll show you the way.", "Tôi sẽ chỉ đường cho bạn.", ["Tôi sẽ gửi bản đồ cho bạn.", "Tôi sẽ hỏi đường giúp bạn."], "show someone the way = dẫn hoặc chỉ đường", "Đề nghị dẫn một đồng nghiệp mới đến phòng họp."]
  ]);

  add("daily", [
    ["daily-6", "Give me a minute.", "Cho tôi một phút nhé.", ["Gọi lại cho tôi sau một phút.", "Tôi chỉ có một phút thôi."], "Give me a minute = cho tôi một chút thời gian", "Xin một chút thời gian để tìm chìa khóa."],
    ["daily-7", "That sounds good to me.", "Tôi thấy như vậy ổn đấy.", ["Tôi nghe chưa rõ lắm.", "Điều đó có vẻ không ổn."], "sounds good to me = tôi đồng ý / thấy đề xuất ổn", "Đồng ý với đề xuất ăn trưa lúc 12 giờ."],
    ["daily-8", "It depends on the weather.", "Điều đó còn tùy vào thời tiết.", ["Điều đó làm thay đổi thời tiết.", "Thời tiết hôm nay khá dễ chịu."], "It depends on … = điều đó còn tùy vào …", "Nói kế hoạch cuối tuần còn tùy vào thời tiết."],
    ["daily-9", "I'm just looking, thanks.", "Tôi chỉ xem thôi, cảm ơn.", ["Tôi đang tìm món này, cảm ơn.", "Tôi đã xem xong rồi, cảm ơn."], "I'm just looking thường dùng khi nhân viên cửa hàng hỏi có cần giúp không", "Trả lời nhân viên khi bạn chưa cần hỗ trợ."],
    ["daily-10", "No worries. Take your time.", "Không sao đâu. Bạn cứ từ từ.", ["Đừng lo. Chúng ta sắp hết giờ rồi.", "Không sao. Bạn nên làm nhanh lên."], "take your time = cứ từ từ, không cần vội", "Nói với người đang xin lỗi vì cần thêm thời gian."]
  ]);

  add("data", [
    ["data-6", "The numbers don't match.", "Các con số không khớp nhau.", ["Các con số chưa được cập nhật.", "Các con số không đủ lớn."], "don't match = không khớp / không giống nhau như mong đợi", "Báo rằng tổng trên dashboard không khớp báo cáo."],
    ["data-7", "We need to validate the data first.", "Chúng ta cần kiểm tra tính hợp lệ của dữ liệu trước.", ["Chúng ta cần tải dữ liệu trước.", "Chúng ta cần thay đổi dữ liệu gốc trước."], "validate the data = kiểm tra dữ liệu có đúng và hợp lệ không", "Đề nghị kiểm tra dữ liệu trước khi làm báo cáo."],
    ["data-8", "How often does this job run?", "Tác vụ này chạy bao lâu một lần?", ["Tác vụ này chạy trong bao lâu?", "Tại sao tác vụ này không chạy?"], "How often = bao lâu một lần, hỏi tần suất", "Hỏi tần suất chạy của một pipeline."],
    ["data-9", "The pipeline failed last night.", "Pipeline đã bị lỗi tối qua.", ["Pipeline đã chạy chậm tối qua.", "Pipeline sẽ được sửa tối nay."], "failed = chạy thất bại / bị lỗi; last night = tối qua", "Đổi thời điểm thành sáng nay."],
    ["data-10", "I'll look into the issue.", "Tôi sẽ kiểm tra kỹ vấn đề này.", ["Tôi sẽ ghi vấn đề này vào báo cáo.", "Tôi sẽ chuyển vấn đề này cho người khác."], "look into = điều tra hoặc xem xét kỹ", "Nhận một lỗi dữ liệu và nói bạn sẽ kiểm tra."]
  ]);

  add("meetings", [
    ["meetings-6", "Can we come back to this later?", "Chúng ta có thể quay lại vấn đề này sau không?", ["Chúng ta có thể kết thúc vấn đề này ngay không?", "Chúng ta có thể họp lại vào lúc khác không?"], "come back to this = quay lại thảo luận vấn đề này", "Tạm gác một chủ đề để tiếp tục chương trình họp."],
    ["meetings-7", "Let me add one thing.", "Cho tôi bổ sung một ý.", ["Cho tôi thay đổi một việc.", "Cho tôi hỏi thêm một người."], "add one thing = bổ sung một ý", "Xin phép bổ sung một rủi ro trong cuộc họp."],
    ["meetings-8", "Are we all on the same page?", "Mọi người đã hiểu và thống nhất giống nhau chưa?", ["Mọi người đã mở đúng trang chưa?", "Mọi người đã tham gia đầy đủ chưa?"], "on the same page = cùng cách hiểu", "Kiểm tra sự thống nhất trước khi kết thúc họp."],
    ["meetings-9", "Who's going to take care of this?", "Ai sẽ phụ trách việc này?", ["Ai đã hoàn thành việc này?", "Ai sẽ kiểm tra kết quả này?"], "take care of this = xử lý / phụ trách việc này", "Hỏi ai sẽ phụ trách gửi biên bản họp."],
    ["meetings-10", "Let's wrap up for today.", "Hôm nay chúng ta kết thúc tại đây nhé.", ["Hôm nay chúng ta bắt đầu sớm nhé.", "Hôm nay chúng ta xem lại từ đầu nhé."], "wrap up = kết thúc hoặc hoàn tất", "Kết thúc một cuộc họp đã đủ nội dung."]
  ]);

  add("interview", [
    ["interview-6", "Let me tell you a little about myself.", "Để tôi giới thiệu một chút về bản thân.", ["Để tôi hỏi bạn một chút về công việc.", "Để tôi kể một chút về công ty cũ."], "tell you a little about myself = giới thiệu ngắn về bản thân", "Mở đầu phần giới thiệu bản thân trong phỏng vấn."],
    ["interview-7", "One of my strengths is problem-solving.", "Một trong những điểm mạnh của tôi là giải quyết vấn đề.", ["Một trong những mục tiêu của tôi là tránh vấn đề.", "Một trong những công việc của tôi là báo cáo vấn đề."], "One of my strengths is … = một trong những điểm mạnh của tôi là …", "Thay problem-solving bằng điểm mạnh của bạn."],
    ["interview-8", "I learned a lot from that experience.", "Tôi đã học được nhiều điều từ trải nghiệm đó.", ["Tôi đã có rất nhiều kinh nghiệm trước đó.", "Tôi cần học thêm để có trải nghiệm đó."], "learn from an experience = rút ra bài học từ một trải nghiệm", "Nói câu này sau khi kể về một dự án khó."],
    ["interview-9", "I enjoy working with different teams.", "Tôi thích làm việc với nhiều nhóm khác nhau.", ["Tôi thường chuyển sang những nhóm khác nhau.", "Tôi muốn quản lý nhiều nhóm khác nhau."], "enjoy + V-ing = thích làm việc gì", "Nói về một loại công việc bạn thích làm."],
    ["interview-10", "I'm ready to take on more responsibility.", "Tôi sẵn sàng đảm nhận thêm trách nhiệm.", ["Tôi cần thêm thời gian để hiểu trách nhiệm.", "Tôi đã hoàn thành tất cả trách nhiệm."], "take on responsibility = đảm nhận trách nhiệm", "Nói bạn sẵn sàng dẫn dắt một dự án lớn hơn."]
  ]);

  addTopic("small-talk", "Small talk", "Bắt đầu và duy trì một cuộc trò chuyện ngắn, tự nhiên.", [
    ["small-talk-1", "How's your day going?", "Hôm nay của bạn thế nào rồi?", ["Hôm nay bạn đi đâu?", "Ngày mai bạn có đi làm không?"], "How's … going? hỏi tình hình đang diễn ra thế nào", "Hỏi một đồng nghiệp về ngày làm việc của họ."],
    ["small-talk-2", "It's been a busy morning.", "Sáng nay khá bận rộn.", ["Buổi họp sáng kéo dài khá lâu.", "Sáng nay tôi đến muộn."], "It's been … dùng để mô tả khoảng thời gian từ trước đến hiện tại", "Đổi busy thành quiet để nói một buổi sáng yên ắng."],
    ["small-talk-3", "What did you do over the weekend?", "Cuối tuần rồi bạn đã làm gì?", ["Cuối tuần này bạn định làm gì?", "Bạn thường làm gì vào cuối tuần?"], "over the weekend ở đây nói về cuối tuần vừa qua", "Hỏi đồng nghiệp họ đã đi đâu cuối tuần rồi."],
    ["small-talk-4", "I just stayed home and relaxed.", "Tôi chỉ ở nhà và nghỉ ngơi thôi.", ["Tôi vừa về nhà để nghỉ ngơi.", "Tôi sẽ ở nhà và làm việc."], "stay home and relax = ở nhà nghỉ ngơi", "Đổi câu trả lời thành ở nhà xem phim."],
    ["small-talk-5", "Have you been here before?", "Bạn đã từng đến đây trước đây chưa?", ["Bạn đã ở đây bao lâu rồi?", "Bạn có định quay lại đây không?"], "Have you been … before? hỏi về trải nghiệm từng có", "Hỏi người kia đã từng đến Việt Nam chưa."],
    ["small-talk-6", "That's a nice jacket.", "Chiếc áo khoác đó đẹp đấy.", ["Chiếc áo khoác đó trông khá mới.", "Đó có phải áo khoác của bạn không?"], "That's a nice … là một lời khen đơn giản", "Khen đôi giày của đồng nghiệp."],
    ["small-talk-7", "How long have you worked here?", "Bạn đã làm việc ở đây bao lâu rồi?", ["Hôm nay bạn làm việc ở đây đến mấy giờ?", "Bạn mất bao lâu để đến chỗ làm?"], "How long have you worked …? hỏi khoảng thời gian kéo dài đến hiện tại", "Hỏi người kia đã sống ở thành phố này bao lâu."],
    ["small-talk-8", "The traffic was terrible this morning.", "Sáng nay giao thông rất tệ.", ["Sáng nay thời tiết rất xấu.", "Tôi đã gặp sự cố trên đường sáng nay."], "traffic was terrible = đường đông / giao thông rất tệ", "Nói sáng nay giao thông khá ổn."],
    ["small-talk-9", "Do you have any plans for lunch?", "Bạn có kế hoạch gì cho bữa trưa không?", ["Bạn đã ăn trưa chưa?", "Bạn thường ăn trưa ở đâu?"], "have plans for … = có dự định cho …", "Hỏi đồng nghiệp có kế hoạch gì tối nay."],
    ["small-talk-10", "It was nice talking to you.", "Rất vui được nói chuyện với bạn.", ["Tôi có một chuyện hay muốn kể bạn.", "Tôi muốn tiếp tục nói chuyện với bạn."], "It was nice talking to you dùng để kết thúc trò chuyện lịch sự", "Kết thúc một cuộc trò chuyện ngắn với người mới gặp."]
  ]);

  addTopic("requests", "Nhờ giúp đỡ & phản hồi", "Nhờ người khác làm việc gì và trả lời một cách tự nhiên.", [
    ["requests-1", "Can you give me a hand?", "Bạn có thể giúp tôi một tay không?", ["Bạn có thể đưa tay cho tôi không?", "Bạn có thể cho tôi một cơ hội không?"], "give me a hand = giúp tôi một tay", "Nhờ đồng nghiệp giúp di chuyển một chiếc bàn."],
    ["requests-2", "Could you take a look at this?", "Bạn có thể xem qua cái này được không?", ["Bạn có thể mang cái này đi không?", "Bạn có thể tìm cái này giúp tôi không?"], "take a look at = xem qua / kiểm tra", "Nhờ đồng nghiệp xem qua một báo cáo."],
    ["requests-3", "Would you mind sending me the file?", "Bạn có phiền gửi cho tôi tệp đó không?", ["Bạn có nhớ đã gửi cho tôi tệp đó không?", "Bạn có muốn tôi gửi tệp đó không?"], "Would you mind + V-ing? là lời nhờ lịch sự", "Nhờ ai đó đóng cửa bằng mẫu Would you mind…?"],
    ["requests-4", "Sure, I'll do it right away.", "Được, tôi sẽ làm ngay.", ["Được, tôi vừa làm xong.", "Được, tôi sẽ làm khi có thời gian."], "right away = ngay lập tức", "Nhận lời gửi một email ngay."],
    ["requests-5", "I'm afraid I can't do that today.", "E rằng hôm nay tôi không thể làm việc đó.", ["Tôi lo rằng hôm nay việc đó sẽ khó.", "Tôi không muốn làm việc đó hôm nay."], "I'm afraid … là cách mở đầu nhẹ nhàng khi báo điều không thuận lợi", "Từ chối lịch sự và đề xuất làm vào ngày mai."],
    ["requests-6", "Could you remind me later?", "Bạn có thể nhắc tôi sau được không?", ["Bạn có thể gọi lại cho tôi sau không?", "Bạn có thể giải thích lại cho tôi không?"], "remind me = nhắc tôi nhớ", "Nhờ người kia nhắc bạn sau bữa trưa."],
    ["requests-7", "Do you want me to help?", "Bạn có muốn tôi giúp không?", ["Bạn có muốn giúp tôi không?", "Bạn muốn tôi làm phần nào?"], "Do you want me to …? = bạn có muốn tôi làm … không?", "Đề nghị giúp kiểm tra tài liệu."],
    ["requests-8", "That would be really helpful.", "Như vậy sẽ rất hữu ích.", ["Việc đó đã giúp ích rất nhiều.", "Tôi có thể tự làm việc đó."], "That would be … phản hồi tích cực với một lời đề nghị", "Nhận lời khi đồng nghiệp đề nghị kiểm tra báo cáo."],
    ["requests-9", "Let me know if you need anything.", "Hãy cho tôi biết nếu bạn cần gì nhé.", ["Hãy cho tôi biết bạn đang cần gì.", "Tôi sẽ báo bạn khi mọi thứ hoàn tất."], "Let me know if … = hãy báo cho tôi nếu …", "Nói với đồng nghiệp mới rằng họ có thể hỏi khi cần."],
    ["requests-10", "Thanks, I really appreciate it.", "Cảm ơn, tôi thực sự trân trọng điều đó.", ["Cảm ơn, tôi đã hiểu điều đó.", "Cảm ơn, tôi sẽ tự xử lý việc đó."], "I appreciate it = tôi trân trọng / rất cảm kích", "Cảm ơn ai đó vừa giúp bạn xử lý một việc khó."]
  ]);

  addTopic("phone-chat", "Điện thoại & tin nhắn", "Những câu thường gặp khi gọi điện, nhắn tin và họp online.", [
    ["phone-chat-1", "Can you hear me clearly?", "Bạn có nghe rõ tôi không?", ["Bạn có hiểu rõ ý tôi không?", "Bạn có thể nói rõ hơn không?"], "hear me clearly = nghe âm thanh của tôi rõ", "Kiểm tra âm thanh khi bắt đầu cuộc gọi online."],
    ["phone-chat-2", "Your voice is breaking up.", "Giọng của bạn đang bị ngắt quãng.", ["Giọng của bạn hơi nhỏ.", "Bạn đang nói quá nhanh."], "breaking up mô tả âm thanh chập chờn do kết nối", "Báo cho người kia biết mạng của họ không ổn định."],
    ["phone-chat-3", "I think you're on mute.", "Tôi nghĩ bạn đang tắt mic.", ["Tôi nghĩ bạn vừa rời cuộc gọi.", "Tôi nghĩ mic của bạn bị hỏng."], "on mute = đang tắt tiếng mic", "Nhắc một người bật mic trong cuộc họp."],
    ["phone-chat-4", "Sorry, I missed your call.", "Xin lỗi, tôi đã lỡ cuộc gọi của bạn.", ["Xin lỗi, tôi đã kết thúc cuộc gọi.", "Xin lỗi, tôi không nghe rõ bạn nói."], "miss a call = không kịp nhận cuộc gọi", "Nhắn lại cho người vừa gọi bạn."],
    ["phone-chat-5", "Can I call you back in a few minutes?", "Tôi có thể gọi lại cho bạn sau vài phút không?", ["Bạn có thể gọi cho tôi trong vài phút không?", "Tôi có thể nói chuyện với bạn vài phút không?"], "call you back = gọi lại cho bạn", "Xin gọi lại vì hiện tại bạn đang bận."],
    ["phone-chat-6", "I'll send you the link.", "Tôi sẽ gửi đường dẫn cho bạn.", ["Tôi đã mở đường dẫn bạn gửi.", "Tôi sẽ kiểm tra lại đường dẫn."], "send you the link = gửi đường dẫn cho bạn", "Nói bạn sẽ gửi đường dẫn cuộc họp."],
    ["phone-chat-7", "Did you get my message?", "Bạn đã nhận được tin nhắn của tôi chưa?", ["Bạn đã hiểu tin nhắn của tôi chưa?", "Bạn có thể trả lời tin nhắn của tôi không?"], "get a message = nhận được tin nhắn", "Kiểm tra xem đồng nghiệp có nhận tin nhắn sáng nay không."],
    ["phone-chat-8", "I'll reply when I'm free.", "Tôi sẽ trả lời khi rảnh.", ["Tôi sẽ gọi khi bạn rảnh.", "Tôi sẽ trả lời ngay bây giờ."], "when I'm free = khi tôi rảnh", "Nhắn rằng bạn sẽ phản hồi sau cuộc họp."],
    ["phone-chat-9", "Let me share my screen.", "Để tôi chia sẻ màn hình.", ["Để tôi xem màn hình của bạn.", "Để tôi tắt màn hình đi."], "share my screen = chia sẻ màn hình của tôi", "Xin phép chia sẻ một dashboard trong cuộc gọi."],
    ["phone-chat-10", "The connection is better now.", "Kết nối bây giờ tốt hơn rồi.", ["Kết nối vừa bị mất.", "Tôi cần kết nối lại ngay."], "better now = bây giờ đã tốt hơn", "Xác nhận âm thanh đã ổn sau khi kết nối lại."]
  ]);

  addTopic("plans-opinions", "Kế hoạch & ý kiến", "Nói điều mình định làm, suy nghĩ và đề xuất bước tiếp theo.", [
    ["plans-1", "I'm thinking about changing jobs.", "Tôi đang cân nhắc đổi việc.", ["Tôi đã quyết định đổi việc.", "Tôi thường nghĩ về công việc."], "think about + V-ing = cân nhắc làm việc gì", "Nói bạn đang cân nhắc học một kỹ năng mới."],
    ["plans-2", "I haven't decided yet.", "Tôi vẫn chưa quyết định.", ["Tôi không muốn quyết định.", "Tôi đã thay đổi quyết định."], "haven't decided yet = vẫn chưa quyết định tính đến hiện tại", "Nói bạn chưa quyết định sẽ đi đâu cuối tuần."],
    ["plans-3", "I'm planning to start next month.", "Tôi dự định bắt đầu vào tháng tới.", ["Tôi đã bắt đầu từ tháng trước.", "Tôi cần một tháng để bắt đầu."], "plan to + động từ = dự định làm gì", "Nói bạn dự định học tiếng Anh mỗi ngày."],
    ["plans-4", "That makes sense.", "Điều đó nghe hợp lý.", ["Điều đó tạo ra sự khác biệt.", "Tôi đã hiểu nghĩa của điều đó."], "That makes sense = điều đó hợp lý / dễ hiểu", "Phản hồi khi đồng nghiệp giải thích một quyết định hợp lý."],
    ["plans-5", "I'm not sure that's the best option.", "Tôi chưa chắc đó là lựa chọn tốt nhất.", ["Tôi chắc chắn đó không phải một lựa chọn.", "Tôi chưa biết cách chọn phương án đó."], "I'm not sure … làm ý kiến phản đối nhẹ hơn", "Nêu lo ngại nhẹ nhàng về một giải pháp."],
    ["plans-6", "In my opinion, we should wait.", "Theo ý tôi, chúng ta nên chờ.", ["Theo thông tin tôi có, chúng ta phải chờ.", "Tôi đang chờ nghe ý kiến của mọi người."], "In my opinion = theo ý kiến của tôi", "Đề xuất thử nghiệm thêm trước khi phát hành."],
    ["plans-7", "What do you think about this idea?", "Bạn nghĩ gì về ý tưởng này?", ["Bạn đã nghĩ ra ý tưởng này khi nào?", "Bạn có thể giải thích ý tưởng này không?"], "What do you think about …? hỏi ý kiến", "Hỏi ý kiến về một thay đổi trong dự án."],
    ["plans-8", "We could try a different approach.", "Chúng ta có thể thử một cách tiếp cận khác.", ["Chúng ta nên tránh một cách làm khác.", "Chúng ta đã thử nhiều cách khác nhau."], "could dùng để đưa ra gợi ý nhẹ nhàng", "Đề xuất bắt đầu với một nhóm nhỏ."],
    ["plans-9", "Let's see how it goes.", "Hãy thử xem mọi việc diễn ra thế nào.", ["Hãy xem việc đó đã xảy ra thế nào.", "Hãy tìm hiểu ai sẽ làm việc đó."], "see how it goes = xem kết quả thực tế diễn ra thế nào", "Đề xuất thử kế hoạch trong một tuần rồi đánh giá."],
    ["plans-10", "I'll think about it and let you know.", "Tôi sẽ suy nghĩ rồi báo cho bạn biết.", ["Tôi sẽ tìm hiểu và giải thích cho bạn.", "Tôi sẽ quyết định thay bạn."], "think about it and let you know = suy nghĩ rồi phản hồi", "Xin thêm thời gian trước khi trả lời một lời đề nghị."]
  ]);

  window.ListeningPractice = topics;
})();
