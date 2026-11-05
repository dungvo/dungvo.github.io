// Selective explanations for chunks that are easy to misunderstand when
// translated word by word. Loaded after all listening content.
(() => {
  "use strict";

  const notes = {
    "clarify-5": {
      wrong: "on the same page không nói về một trang giấy hay trang tài liệu.",
      rule: "Đây là thành ngữ: mọi người có cùng cách hiểu hoặc đã thống nhất với nhau.",
      contrast: "Are we on the right page? = Chúng ta đang mở đúng trang chứ?"
    },
    "office-9": {
      wrong: "You can't miss it không có nghĩa là bạn không được bỏ lỡ nó.",
      rule: "Khi chỉ đường, cụm này có nghĩa nơi đó rất dễ nhìn thấy hoặc dễ nhận ra.",
      contrast: "Don't miss the meeting. = Đừng bỏ lỡ cuộc họp."
    },
    "daily-2": {
      wrong: "in ten minutes không có nghĩa là hành động kéo dài trong 10 phút.",
      rule: "in + khoảng thời gian trả lời KHI NÀO: sau khoảng thời gian đó tính từ bây giờ. Hãy nhớ in ten minutes = 10 phút nữa.",
      contrast: "I'll be there for ten minutes. = Tôi sẽ ở đó trong 10 phút. for trả lời TRONG BAO LÂU."
    },
    "daily-4": {
      wrong: "yet ở cuối câu phủ định không nên dịch riêng thành một từ cứng nhắc.",
      rule: "haven't … yet = tính đến bây giờ vẫn chưa làm, nhưng việc đó còn có thể xảy ra.",
      contrast: "I didn't have breakfast. = Tôi đã không ăn sáng, nói về một thời điểm đã kết thúc."
    },
    "daily-6": {
      wrong: "Give me a minute thường không yêu cầu đúng chính xác 60 giây.",
      rule: "Đây là cách xin một chút thời gian: Chờ tôi một lát / Cho tôi một chút nhé.",
      contrast: "The call lasted one minute. = Cuộc gọi kéo dài đúng một phút."
    },
    "daily-7": {
      wrong: "sounds good không chỉ nhận xét rằng âm thanh nghe hay.",
      rule: "Khi phản hồi một đề xuất, That sounds good = Nghe hợp lý đấy / Tôi thấy ổn.",
      contrast: "The music sounds good. = Nhạc nghe hay. Ở đây sound mô tả âm thanh thật."
    },
    "daily-9": {
      wrong: "I'm just looking không có nghĩa là tôi đang tìm một món đồ cụ thể.",
      rule: "Trong cửa hàng, câu này lịch sự nói rằng bạn chỉ xem và chưa cần nhân viên giúp.",
      contrast: "I'm looking for a blue shirt. = Tôi đang tìm một chiếc áo màu xanh."
    },
    "daily-10": {
      wrong: "Take your time không có nghĩa là lấy thời gian của bạn.",
      rule: "Đây là cách nói người kia cứ từ từ, không cần vội.",
      contrast: "It takes time. = Việc đó cần thời gian."
    },
    "data-8": {
      wrong: "How often không hỏi một lần chạy mất bao lâu.",
      rule: "How often hỏi TẦN SUẤT: mỗi giờ, mỗi ngày hay mỗi tuần một lần.",
      contrast: "How long does this job run? = Tác vụ này chạy trong bao lâu?"
    },
    "data-10": {
      wrong: "look into không có nghĩa là nhìn vào bên trong một vật.",
      rule: "Trong công việc, look into an issue = điều tra hoặc kiểm tra kỹ vấn đề.",
      contrast: "Look inside the box. = Nhìn vào bên trong chiếc hộp."
    },
    "meetings-2": {
      wrong: "by the end of the day không có nghĩa là sau khi ngày hôm nay kết thúc.",
      rule: "by + mốc thời gian = không muộn hơn mốc đó. Có thể gửi sớm hơn.",
      contrast: "I'll work until the end of the day. = Tôi sẽ làm việc liên tục đến cuối ngày."
    },
    "meetings-5": {
      wrong: "one issue at a time không có nghĩa là chỉ có một vấn đề.",
      rule: "one … at a time = xử lý từng cái một, xong cái này rồi đến cái khác.",
      contrast: "We only have one issue. = Chúng ta chỉ có một vấn đề."
    },
    "meetings-10": {
      wrong: "wrap up trong cuộc họp không phải là gói một vật lại.",
      rule: "wrap up = kết thúc hoặc hoàn tất phần còn lại.",
      contrast: "Wrap up the gift. = Gói món quà lại. Đây mới là nghĩa đen."
    },
    "interview-3": {
      wrong: "worked closely không nói rằng chỗ ngồi của hai nhóm ở gần nhau.",
      rule: "work closely with = phối hợp thường xuyên và chặt chẽ với ai.",
      contrast: "I worked near the business team. = Tôi làm việc ở gần chỗ nhóm nghiệp vụ."
    },
    "requests-1": {
      wrong: "give me a hand không yêu cầu người kia đưa bàn tay cho mình.",
      rule: "Đây là thành ngữ thân mật: giúp tôi một tay.",
      contrast: "Hold out your hand. = Đưa tay bạn ra."
    },
    "requests-3": {
      wrong: "Would you mind …? không hỏi người kia có nhớ việc đó hay không.",
      rule: "Would you mind + V-ing? là cách nhờ lịch sự. Trong câu này: Bạn có phiền gửi tệp cho tôi không?",
      contrast: "Do you remember sending the file? = Bạn có nhớ mình đã gửi tệp không?"
    },
    "requests-5": {
      wrong: "I'm afraid ở đây không nhất thiết có nghĩa là tôi đang sợ.",
      rule: "I'm afraid … thường dùng để báo tin không thuận lợi hoặc từ chối nhẹ nhàng.",
      contrast: "I'm afraid of dogs. = Tôi sợ chó. Đây là cảm giác sợ thật."
    },
    "phone-chat-2": {
      wrong: "Your voice is breaking up không có nghĩa là giọng nói đang tan vỡ.",
      rule: "Trong cuộc gọi, break up = âm thanh bị ngắt quãng do kết nối kém.",
      contrast: "They are breaking up. = Họ đang chia tay. Cùng cụm từ nhưng ngữ cảnh khác."
    },
    "phone-chat-3": {
      wrong: "on mute không có nghĩa là đang ở trên một thiết bị tên mute.",
      rule: "be on mute = mic đang ở chế độ tắt tiếng.",
      contrast: "Please mute your microphone. = Vui lòng tắt mic."
    },
    "phone-chat-4": {
      wrong: "missed your call không có nghĩa là nhớ hoặc nhung nhớ cuộc gọi.",
      rule: "miss a call = không kịp nhận cuộc gọi.",
      contrast: "I miss talking to you. = Tôi nhớ những lúc nói chuyện với bạn."
    },
    "phone-chat-5": {
      wrong: "call you back không có nghĩa là gọi về phía sau; in a few minutes cũng không chỉ thời lượng cuộc gọi.",
      rule: "call back = gọi lại. in a few minutes = vài phút nữa, trả lời KHI NÀO.",
      contrast: "Can we talk for a few minutes? = Chúng ta có thể nói chuyện trong vài phút không?"
    },
    "plans-4": {
      wrong: "That makes sense không có nghĩa là điều đó tạo ra giác quan hay tạo ra ý nghĩa.",
      rule: "Cả cụm có nghĩa: điều đó hợp lý hoặc tôi hiểu được lý do.",
      contrast: "What does this word mean? = Từ này có nghĩa là gì?"
    },
    "plans-8": {
      wrong: "could trong câu này không chủ yếu nói về khả năng trong quá khứ.",
      rule: "We could … thường dùng để đề xuất nhẹ nhàng: Chúng ta có thể thử …",
      contrast: "I could swim when I was five. = Tôi đã biết bơi khi năm tuổi."
    },
    "plans-9": {
      wrong: "see how it goes không yêu cầu nhìn bằng mắt xem thứ gì đang đi đâu.",
      rule: "Cả cụm có nghĩa: thử rồi xem kết quả thực tế diễn ra thế nào.",
      contrast: "Let's see where it goes. = Hãy xem nó đi về đâu."
    },
    "plans-10": {
      wrong: "let you know không có nghĩa là cho phép bạn biết.",
      rule: "let someone know = báo hoặc cho người đó biết thông tin sau.",
      contrast: "I'll let you decide. = Tôi sẽ để bạn quyết định. Ở đây let mới mang nghĩa cho phép/để."
    }
  };

  const items = (window.ListeningPractice || []).flatMap((topic) => topic.items || []);
  items.forEach((entry) => {
    if (notes[entry.id]) entry.translationNote = notes[entry.id];
  });

  window.ListeningTranslationNotes = notes;
})();
