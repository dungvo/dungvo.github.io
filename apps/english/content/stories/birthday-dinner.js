window.ChunkContent.registerStories({
  schemaVersion: 1,
  stories: [{
    id: "birthday-dinner",
    title: "The Birthday Dinner That Almost Went Wrong",
    category: "Daily life",
    level: "Intermediate",
    minutes: 9,
    summary: "Mia plans a birthday dinner, but a broken car, bad weather, and a leaking restaurant room force the family to make a new plan.",
    chunks: [
      { text: "Shortly after", meaning: "A short time after something happened." },
      { text: "I noticed that", meaning: "Use this to introduce an observation." },
      { text: "I’ll look into it", meaning: "I will investigate or check it." },
      { text: "get back to you", meaning: "Contact you again after checking." },
      { text: "seems to have caused", meaning: "The evidence suggests a past cause, but it is not confirmed." },
      { text: "Please update me once you know more", meaning: "Tell me when you have more information." },
      { text: "If I understand correctly", meaning: "Use this to confirm your understanding." },
      { text: "The next step is to", meaning: "Use this to introduce the next action." },
      { text: "explain the situation to me", meaning: "Explain + thing + to + person." },
      { text: "help me understand", meaning: "Help + person + base verb." },
      { text: "check whether", meaning: "Verify whether something is true." },
      { text: "We shouldn’t", meaning: "A recommendation against an action." },
      { text: "We can’t", meaning: "A current constraint or impossibility." },
      { text: "We won’t", meaning: "A decision not to do something." }
    ],
    paragraphs: [
      "On Saturday morning, Mia was preparing a birthday dinner for her mother. She had invited twelve family members and reserved a private room at a small Italian restaurant. She wanted everything to be perfect because her mother rarely allowed the family to organize anything special for her.",
      "Shortly after Mia finished decorating the birthday cake, her brother Daniel called. “I noticed that the weather is getting worse,” he said. “It might rain heavily this evening.” Mia replied, “I’ll look into it and get back to you. The restaurant has an indoor room, so I don’t think the rain will be a serious problem.”",
      "Daniel then explained that their father’s car would not start. It had stopped working shortly after he filled the tank, so the new fuel seems to have caused the problem. Mia pointed out that the timing did not prove the cause and asked Daniel to call a mechanic. The mechanic was busy, but he could start looking into it in about thirty minutes. “Please update me once you know more,” Mia said.",
      "Mia’s cousin Lily arrived and offered to help. Mia asked her to move the decorations and check whether they had enough candles. Lily found six candles, but the other box was empty. “If I understand correctly, we have enough decorations but not enough candles. Is that right?” Mia asked. Lily agreed, so Mia said, “The next step is to buy another pack.”",
      "Later, Daniel called with an update. The mechanic found out that the battery was almost dead. The fuel had not caused the problem; the cold weather had made the battery lose power more quickly. Replacing it would take about two hours because the mechanic had to finish another repair and get the correct battery from a store across town.",
      "Mia decided they shouldn’t depend entirely on her father’s car. She asked Aunt Sarah to pick up Grandma instead. Sarah agreed, but she wouldn’t be able to leave before four thirty. Mia sent her the address so that she could find Grandma’s house easily, then explained the new plan to Grandma.",
      "At two o’clock, the restaurant manager called with another problem. A pipe in the private room had started leaking, and the leak seems to have damaged part of the ceiling. “Can you explain the situation to me?” Mia asked. The manager said, “We’re still investigating, but we can’t use that room for now.”",
      "The restaurant could add another table near the door or move the dinner to seven thirty. Mia said, “We shouldn’t put a table near the door if it creates a safety problem. And we can’t change the time without speaking to everyone first. I’ll check with my family and get back to you by three.”",
      "During a family call, Daniel suggested having dinner at Mia’s house and ordering food from the restaurant. Mia liked the idea, but first she needed to check whether they had enough chairs and plates. They needed four more chairs, so Daniel offered to bring two and Sarah offered to bring the other two.",
      "Mia confirmed the plan: “If I understand correctly, everyone prefers to have dinner here. Daniel and Sarah will bring the extra chairs, and I’ll ask the restaurant to deliver the food. Is that right?” Everyone agreed. She called the manager and said, “We won’t use the private room. We’ve decided to have the dinner at home.”",
      "By five thirty, the mechanic had replaced the battery, Sarah had picked up Grandma, and all the chairs had arrived. When Mia’s mother entered the house, Mia explained that several things had gone wrong. “The problems made us change the plan, but they didn’t cause us to cancel the celebration,” she said.",
      "The dinner was warm and personal. Mia realized that a good plan matters, but being able to explain problems, confirm your understanding, and communicate the next step matters even more."
    ],
    questions: [
      { type: "Story", prompt: "What was Mia’s original plan?", options: ["To cook a quiet meal for two", "To hold a family dinner in a restaurant’s private room", "To take her mother on a weekend trip", "To surprise Daniel at home"], answer: 1, explanation: "Mia invited twelve relatives and reserved a private room at an Italian restaurant." },
      { type: "Story", prompt: "Why did Daniel first suspect the fuel?", options: ["The mechanic blamed it immediately", "The tank was empty", "The car stopped working shortly after Dad filled the tank", "Dad used the wrong car"], answer: 2, explanation: "The events happened close together, but Mia correctly noted that timing alone did not prove causation." },
      { type: "Story", prompt: "What actually caused the car problem?", options: ["A nearly dead battery", "Bad fuel", "Heavy rain", "A damaged tire"], answer: 0, explanation: "The mechanic found that the battery was almost dead, and cold weather had reduced its power." },
      { type: "Story", prompt: "Why did Mia contact Aunt Sarah?", options: ["To buy candles", "To repair the car", "To reserve another restaurant", "To pick up Grandma"], answer: 3, explanation: "Mia did not want to depend entirely on Dad’s car, so Sarah became the backup driver." },
      { type: "Story", prompt: "Why couldn’t the family use the private room?", options: ["It was too expensive", "A leak may have damaged the ceiling", "Another family had reserved it", "The restaurant closed early"], answer: 1, explanation: "A pipe was leaking, and the room was unavailable while the restaurant investigated the ceiling damage." },
      { type: "Chunk meaning", prompt: "What does “We shouldn’t put a table near the door” express?", options: ["A recommendation", "A final decision", "A physical impossibility", "A past event"], answer: 0, explanation: "Shouldn’t expresses advice or a recommendation against an action." },
      { type: "Apply the chunk", prompt: "You need to investigate a strange noise before answering. What sounds most natural?", options: ["I’ll look into it and get back to you.", "I won’t look it.", "I get back yesterday.", "I explain me the noise."], answer: 0, explanation: "Use “I’ll look into it” for investigation and “get back to you” for a later response." },
      { type: "Apply the chunk", prompt: "You want to verify that you understood a changed plan. What should you say?", options: ["I understand correctly?", "If I understand correctly, we’re eating at Mia’s house. Is that right?", "Explain me again.", "The plan made understand."], answer: 1, explanation: "“If I understand correctly, ... Is that right?” politely checks your understanding." },
      { type: "Chunk meaning", prompt: "Why is “seems to have caused” careful language?", options: ["It confirms the cause completely", "It describes only a future plan", "It presents a likely past cause without claiming certainty", "It means the cause is impossible"], answer: 2, explanation: "“Seems to have + past participle” expresses evidence-based uncertainty about a past event." },
      { type: "Story", prompt: "What is the main lesson of the story?", options: ["Never make plans in bad weather", "Restaurants are unreliable", "A perfect plan is more important than communication", "Clear communication and flexible next steps help people solve problems"], answer: 3, explanation: "Mia succeeds because she investigates, confirms understanding, communicates constraints, and coordinates the next steps." }
    ]
  }]
});
