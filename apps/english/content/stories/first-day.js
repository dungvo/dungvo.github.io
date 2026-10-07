window.ChunkContent.registerStories({
  schemaVersion: 1,
  stories: [{
    id: "first-day",
    title: "A Smooth Start Doesn’t Mean a Perfect Start",
    category: "Daily life & work",
    level: "Intermediate",
    minutes: 9,
    summary: "An prepares for a new job, helps a stranger on the way, and learns that a good beginning can include small mistakes.",
    chunks: [
      { text: "I received an email from", meaning: "A formal way to say an email arrived from someone." },
      { text: "ensure a smooth", meaning: "Make sure something happens with few problems." },
      { text: "within two working days", meaning: "No later than two business days." },
      { text: "subject to", meaning: "Dependent on a condition." },
      { text: "if applicable", meaning: "Only if it applies to your situation." },
      { text: "I have already submitted", meaning: "Say that you sent something earlier." },
      { text: "Please find attached", meaning: "A formal phrase directing attention to an email attachment." },
      { text: "the remaining documents", meaning: "The documents that have not been sent yet." },
      { text: "Could you check this email for me", meaning: "Politely ask someone to review your email." },
      { text: "I’ve replied to the email", meaning: "The reply has recently been completed." },
      { text: "look forward to joining", meaning: "Feel positive and excited about becoming part of a group." },
      { text: "The next step is to", meaning: "Introduce the next action." }
    ],
    paragraphs: [
      "Three days before starting a new job, An told his sister, “I received an email from HR.” The message explained the onboarding process and asked him to send several required documents within two working days.",
      "The email said the process was designed to ensure a smooth start. It also said that his employment remained subject to a successful background check. An understood that this was a normal condition, not a sign that something was wrong.",
      "Some documents were required from everyone. Dependent-registration documents were needed only if applicable. An had no dependents, so that part did not apply to him.",
      "An reviewed his checklist. “I have already submitted my identification and degree,” he said. “I only need to send the remaining documents.” He attached a portrait photo and wrote, “Please find attached the remaining documents.”",
      "Before sending the message, he asked his sister, “Could you check this email for me?” She corrected one small mistake: An had written “I look forward to join the team.” She changed it to “I look forward to joining the team.”",
      "An sent the message and smiled. “I’ve replied to the email,” he said. He believed everything was ready for a perfect first day.",
      "On Monday morning, however, An took the wrong bus. When he realized it, he felt embarrassed and anxious. At the next stop, an older woman asked him for help reading a route map. Although he was in a hurry, he helped her find the correct bus.",
      "The woman thanked him and said, “A smooth journey doesn’t mean nothing goes wrong. It means you know what to do when something changes.” Her words stayed with An.",
      "An called HR and explained that he might arrive ten minutes late. Then he checked the route. “The next step is to take the number twelve bus and get off near the office,” he told himself.",
      "He arrived eight minutes late, apologized, and calmly explained what had happened. His manager smiled and welcomed him. An’s first day was not perfect, but it was honest, responsible, and kind. He understood that a seamless start is not a life without mistakes; it is the ability to recover without losing yourself."
    ],
    questions: [
      { type: "Story", prompt: "What did HR ask An to do?", options: ["Attend an interview", "Submit required documents within two working days", "Bring his family to work", "Create a new email account"], answer: 1, explanation: "The onboarding email requested the required documents before the deadline." },
      { type: "Chunk meaning", prompt: "What does “subject to a successful background check” mean?", options: ["The check has been cancelled", "The job depends on that condition being satisfied", "An failed the check", "The check is optional"], answer: 1, explanation: "“Subject to” means that something depends on a condition." },
      { type: "Chunk meaning", prompt: "What does “if applicable” mean?", options: ["In every situation", "As quickly as possible", "Only if it applies to your situation", "After your first day"], answer: 2, explanation: "Dependent documents were required only for people whose situation included dependents." },
      { type: "Apply the chunk", prompt: "You sent three forms yesterday and are sending the last one now. What should you write?", options: ["I have already submitted the first three forms. Please find attached the remaining document.", "I already submit all tomorrow.", "Please find attach everything yesterday.", "I have remaining submitted."], answer: 0, explanation: "Use present perfect for earlier submitted items and “Please find attached” for the current attachment." },
      { type: "Apply the chunk", prompt: "Which sentence is grammatically correct?", options: ["I look forward to join the team.", "I look forward joining the team.", "I look forward to joining the team.", "I look forward to joined the team."], answer: 2, explanation: "In this expression, “to” is a preposition, so it is followed by a noun or verb-ing." },
      { type: "Story", prompt: "Why was An late?", options: ["He forgot the documents", "He took the wrong bus", "HR changed the time", "He stopped for breakfast"], answer: 1, explanation: "An noticed that he was on the wrong bus and changed his route." },
      { type: "Story", prompt: "What did An do before finding the correct route?", options: ["He went home", "He blamed HR", "He helped an older woman understand the bus map", "He cancelled his first day"], answer: 2, explanation: "Even while anxious, An stopped to help someone else." },
      { type: "Apply the chunk", prompt: "You have finished responding to HR. What sounds natural?", options: ["I replied the email.", "I’ve replied to the email.", "I’ve reply to email.", "I reply at the email."], answer: 1, explanation: "Reply uses “to,” and present perfect is natural for a recently completed action." },
      { type: "Chunk meaning", prompt: "In this story, what does a “smooth start” really mean?", options: ["Nothing unexpected happens", "You hide every mistake", "You adapt responsibly when something changes", "You arrive earlier than everyone"], answer: 2, explanation: "The story reframes smoothness as recovery and adaptation, not perfection." },
      { type: "Story", prompt: "What is the main message of An’s first day?", options: ["A mistake always ruins a beginning", "Kindness makes people unsuccessful", "A meaningful start can include mistakes and recovery", "Formal emails solve every problem"], answer: 2, explanation: "An’s day was imperfect but still successful because he communicated, adapted, and remained kind." }
    ]
  }]
});
