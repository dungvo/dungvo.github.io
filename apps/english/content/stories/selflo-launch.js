window.ChunkContent.registerStories({
  schemaVersion: 1,
  stories: [{
    id: "selflo-launch",
    title: "The Day Selflo Almost Didn’t Launch",
    category: "Work & life",
    level: "Upper intermediate",
    minutes: 12,
    summary: "A product failure pushes Minh to investigate both a technical problem and the story he is telling himself about it.",
    chunks: [
      { text: "I’m not sure whether", meaning: "Use this when you do not know which possibility is true." },
      { text: "Give me a second", meaning: "Ask for a short amount of time before responding." },
      { text: "I’ll look into it", meaning: "I will investigate it." },
      { text: "get back to you", meaning: "Contact you later after checking." },
      { text: "I noticed that", meaning: "Introduce something you observed." },
      { text: "shortly after", meaning: "A short time after; this shows timing, not necessarily causation." },
      { text: "seems to have caused", meaning: "The evidence suggests a past cause, but it is not confirmed." },
      { text: "help me understand", meaning: "Help + person + base verb." },
      { text: "If I understand correctly", meaning: "Politely confirm your understanding." },
      { text: "The next step is to", meaning: "Introduce the next action in a process." },
      { text: "We can’t roll it back for now", meaning: "A current constraint prevents the rollback." },
      { text: "check whether", meaning: "Verify whether something is true." },
      { text: "I found out that", meaning: "Introduce newly discovered information." },
      { text: "update you once I know more", meaning: "Promise more information after learning it." },
      { text: "might be fixed", meaning: "An uncertain passive result." }
    ],
    paragraphs: [
      "For almost a year, Minh had been building Selflo, an app designed to help people notice what happens, how they interpret it, what they feel, and what they choose to do next. On the morning before its first public test, he received an email from a tester saying that the app had crashed while saving a check-in.",
      "His wife asked whether the problem was serious. Minh answered, “I’m not sure whether it’s serious yet. Give me a second. I’ll check it.” A teammate then asked for an update, so Minh replied, “I’ll look into it and get back to you.”",
      "When Minh reproduced the problem, he noticed a pattern. “I noticed that the crash happens only when a user selects more than one emotion,” he told his teammate. Then he found that a configuration had changed shortly before the failures began.",
      "The timing was suspicious, but Minh did not want to confuse timing with proof. He said, “The configuration change seems to have caused the app to fail.” The word “seems” mattered because the investigation was not complete.",
      "Minh called Nam, who had made the change. “Can you help me understand the data flow?” he asked. After Nam explained it, Minh checked his understanding: “If I understand correctly, the old configuration was sending traffic to the wrong service. Is that right?”",
      "Nam confirmed it. The new routing had fixed one problem but made the check-in service fail. Rolling it back could repair Selflo, but it might break the recommendation service. Minh said, “The next step is to check which systems depend on the other service before changing anything.”",
      "A teammate wanted to roll back immediately. Minh replied, “We can’t roll it back for now.” This was not merely advice and not a permanent decision. A real dependency currently prevented the team from doing it safely.",
      "While Nam updated the dependent service, Minh opened Selflo and recorded his own reaction. He wrote, “If Selflo fails today, maybe I’m not good enough to build it.” Then he paused. The bug was a fact, but the meaning he had attached to it was an interpretation.",
      "He realized that the bug had made him anxious, but it had not caused him to give up. One technical problem was related to his work; it was not proof of his worth. Sometimes he needed to look into a software issue. Sometimes he needed to look into his own reaction.",
      "Nam finally sent an update. Minh asked him to check whether the recommendation service worked correctly. It did. After that, they rolled back the configuration and tested Selflo again.",
      "At first Minh said, “The issue might be fixed, but I want to test it again.” He avoided claiming certainty too early. When every test passed, he told the team, “I found out that the problem was related to the routing configuration. The issue has now been fixed.”",
      "That evening, Minh wrote one final reflection: “Life is rarely about having the final answer immediately. I can observe the current situation, choose the next step, and update my understanding once I know more.”"
    ],
    questions: [
      { type: "Story", prompt: "When did the app crash?", options: ["When saving a check-in", "When opening an email", "When changing a password", "When starting the laptop"], answer: 0, explanation: "The tester reported that Selflo crashed while saving a check-in." },
      { type: "Story", prompt: "Why didn’t Minh say the configuration definitely caused the failure?", options: ["He did not understand English", "Timing suggested a connection, but the investigation was incomplete", "Nam had already fixed it", "The configuration had never changed"], answer: 1, explanation: "“Shortly after” showed correlation. Minh still needed evidence before confirming causation." },
      { type: "Chunk meaning", prompt: "What does “I’ll look into it” mean?", options: ["I will ignore it", "I will investigate it", "I already solved it", "I will explain it immediately"], answer: 1, explanation: "Use “look into” when you plan to investigate a situation or problem." },
      { type: "Chunk meaning", prompt: "What does “We can’t roll it back for now” communicate?", options: ["A recommendation only", "A permanent refusal", "A current constraint", "A completed rollback"], answer: 2, explanation: "“Can’t ... for now” means a present condition makes the action unavailable." },
      { type: "Apply the chunk", prompt: "A friend explains a complicated plan. You want to confirm it. What should you say?", options: ["If I understand correctly, we meet at six. Is that right?", "I understand like you does.", "Explain me the plan.", "The plan seems understand."], answer: 0, explanation: "Use “If I understand correctly, ... Is that right?” to verify your understanding." },
      { type: "Apply the chunk", prompt: "Evidence suggests an earlier update created a bug, but you are not certain. Choose the best sentence.", options: ["The update caused it, definitely.", "The update seems to have caused the bug.", "The update seems cause the bug.", "The update made the bug caused."], answer: 1, explanation: "“Seems to have + past participle” carefully describes a likely past event." },
      { type: "Chunk meaning", prompt: "In “The bug made him anxious,” which pattern is used?", options: ["make + object + adjective", "cause + object + to + verb", "help + person + verb", "explain + thing + to + person"], answer: 0, explanation: "“Made + him + anxious” uses make + object + adjective to describe a changed emotional state." },
      { type: "Apply the chunk", prompt: "You have a possible solution, but need one more test. What is the careful update?", options: ["It fixed absolutely.", "It might be fixed, but I need to test it again.", "It might fixed yesterday.", "It can fixing now."], answer: 1, explanation: "“Might be + past participle” expresses uncertainty in the passive voice." },
      { type: "Story", prompt: "What did Minh learn about the bug and his self-worth?", options: ["Every bug proves he is a bad engineer", "Feelings are never real", "A work problem can be real without defining his worth", "He should stop building products"], answer: 2, explanation: "Minh separated the factual problem from the harsh interpretation he had created about himself." },
      { type: "Story", prompt: "What is the story’s central life lesson?", options: ["Always find the final answer immediately", "Avoid uncertain language", "Understand the current situation and choose the next useful step", "Technical problems are more important than feelings"], answer: 2, explanation: "The story connects good investigation with self-awareness: observe clearly, then choose the next step." }
    ]
  }]
});
