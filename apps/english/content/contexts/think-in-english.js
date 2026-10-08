window.ChunkContent.registerContexts({
  schemaVersion: 1,
  contexts: [
    {
      id: "work-pipeline-delay", category: "Workplace", format: "Team chat", level: "Intermediate", minutes: 7,
      title: "The pipeline is getting slower", summary: "A teammate raises a concern without declaring an emergency.",
      passage: [
        { speaker: "Maya · Analytics", text: "Hi, we’ve noticed that the customer-events pipeline has been running slower than usual since yesterday. The dashboard is still updating, but some reports are about forty minutes behind." },
        { speaker: "Maya · Analytics", text: "Could you take a look when you have a chance and let us know if there’s anything we should be concerned about? We have a client review tomorrow morning, so it would be good to know where things stand before then." },
        { speaker: "You", text: "Thanks for the heads-up. I’ll check the recent runs and compare them with last week’s baseline. I’ll get back to you by 3 p.m. with what I find and whether we need to take any action." }
      ],
      chunks: [
        { text: "slower than usual", meaning: "Compared with the normal level; it signals a change without exaggerating it.", intent: "Describe an unusual pattern calmly." },
        { text: "take a look", meaning: "Investigate or examine something.", intent: "Make a friendly, low-pressure request.", chunkId: "request-look" },
        { text: "anything we should be concerned about", meaning: "Any meaningful risk or problem that needs attention.", intent: "Ask for risk assessment, not merely a technical explanation." },
        { text: "where things stand", meaning: "The current status of a situation.", intent: "Ask for a concise status update." },
        { text: "get back to you", meaning: "Reply later after checking or gathering information.", intent: "Promise a follow-up rather than guessing now.", chunkId: "get-back" }
      ],
      questions: [
        { type: "Overall intent", prompt: "What does Maya mainly want you to do?", options: ["Rebuild the pipeline immediately", "Investigate the slowdown and assess the risk", "Explain how the dashboard was designed", "Cancel tomorrow’s client review"], answer: 1, explanation: "She asks you to examine the slowdown and say whether it creates a real concern." },
        { type: "Implied intent", prompt: "Why does Maya mention tomorrow morning’s client review?", options: ["To blame you for the delay", "To set a practical deadline and explain urgency", "To invite you to the review", "To say that the reports are no longer needed"], answer: 1, explanation: "She is politely signaling that she needs a useful update before the review." },
        { type: "Comprehension", prompt: "What is still working?", options: ["Nothing", "The dashboard, although it is delayed", "Only the client review", "Last week’s baseline"], answer: 1, explanation: "The dashboard continues to update, but some reports are roughly forty minutes late." }
      ],
      responsePrompt: "Write a 2–3 sentence reply. Acknowledge the concern, state what you will check, and promise a clear update time.",
      responseHints: ["Thanks for the heads-up.", "I’ll take a look at…", "I’ll get back to you by…"],
      modelResponse: "Thanks for the heads-up. I’ll take a look at the recent pipeline runs and check where the delay is coming from. I’ll get back to you by 3 p.m. with the impact and any action we need to take."
    },
    {
      id: "work-review-disagreement", category: "Workplace", format: "Meeting excerpt", level: "Intermediate", minutes: 7,
      title: "I’m not sure that’s the best approach", summary: "A colleague disagrees politely and proposes a safer next step.",
      passage: [
        { speaker: "Leo", text: "We could migrate all customers in one batch this Friday. It would be faster, and we wouldn’t need to support two versions for long." },
        { speaker: "Priya", text: "I’m not sure that’s the best approach. If the new mapping behaves differently with older accounts, we may not notice until customers start reporting issues. Would it make sense to roll it out to ten percent first and keep an eye on the error rate?" },
        { speaker: "Leo", text: "That’s a fair point. Let’s start small and decide on the full rollout after we’ve seen a day of production traffic." }
      ],
      chunks: [
        { text: "I’m not sure that’s the best approach", meaning: "A softened way to disagree with a proposal.", intent: "Protect the relationship while challenging the idea.", chunkId: "opinion-not-sure" },
        { text: "Would it make sense to…?", meaning: "Could this alternative be reasonable?", intent: "Offer a suggestion collaboratively." },
        { text: "keep an eye on", meaning: "Monitor something carefully over time.", intent: "Recommend observation before a larger decision.", chunkId: "problem-monitor" },
        { text: "That’s a fair point", meaning: "Your concern is reasonable.", intent: "Acknowledge another person’s reasoning before adapting.", chunkId: "opinion-fair" }
      ],
      questions: [
        { type: "Overall intent", prompt: "What is Priya trying to achieve?", options: ["Stop the migration permanently", "Replace Leo as project owner", "Reduce rollout risk with a smaller test", "Delay the project without explanation"], answer: 2, explanation: "She supports moving forward, but wants evidence from a limited rollout first." },
        { type: "Implied intent", prompt: "Does “I’m not sure” mean Priya lacks an opinion?", options: ["Yes, she has no preference", "No, it softens a clear disagreement", "Yes, she wants Leo to decide alone", "No, it means she did not hear him"], answer: 1, explanation: "Her following reasons and alternative show that she is politely disagreeing." },
        { type: "Chunk in context", prompt: "What would the team monitor during the limited rollout?", options: ["The meeting length", "The error rate", "The number of engineers", "Friday’s weather"], answer: 1, explanation: "Priya explicitly proposes watching the error rate." }
      ],
      responsePrompt: "Reply as Leo in 2–3 sentences. Acknowledge the concern and agree on a concrete next step.",
      responseHints: ["That’s a fair point.", "Let’s start with…", "We can decide after…"],
      modelResponse: "That’s a fair point. Let’s roll it out to ten percent first and keep an eye on the error rate. We can decide on the full migration after we’ve reviewed a day of production traffic."
    },
    {
      id: "daily-dinner-change", category: "Daily life", format: "Text messages", level: "Intermediate", minutes: 6,
      title: "A last-minute change of plan", summary: "A friend changes dinner plans while trying not to inconvenience you.",
      passage: [
        { speaker: "Nina", text: "Hey, I’m really sorry, but would you mind if we moved dinner to 7:30? My appointment is running late, and I don’t think I’ll make it across town by seven." },
        { speaker: "Nina", text: "If that’s too late for you, no worries at all—we can pick another day. I know this is last minute." },
        { speaker: "You", text: "7:30 works for me. Take your time, and just let me know when you’re on your way." }
      ],
      chunks: [
        { text: "Would you mind if we…?", meaning: "A polite way to ask whether a change is acceptable.", intent: "Ask permission while recognizing the other person may be affected." },
        { text: "I don’t think I’ll make it", meaning: "I probably cannot arrive by that time.", intent: "Warn someone early about likely lateness." },
        { text: "No worries at all", meaning: "It is completely okay; do not feel pressured.", intent: "Remove obligation or guilt." },
        { text: "last minute", meaning: "Very close to the planned time.", intent: "Acknowledge that the change gives little notice." },
        { text: "Take your time", meaning: "Do not rush.", intent: "Reassure the other person.", chunkId: "request-no-rush" }
      ],
      questions: [
        { type: "Overall intent", prompt: "What is Nina asking for?", options: ["A different restaurant", "A later dinner time", "A ride across town", "Help with her appointment"], answer: 1, explanation: "She asks to move dinner from seven to 7:30." },
        { type: "Implied intent", prompt: "Why does Nina say “no worries at all”?", options: ["She does not want dinner", "She wants you to accept under pressure", "She gives you a comfortable way to say no", "She forgot the original plan"], answer: 2, explanation: "The phrase reduces social pressure and shows consideration for your schedule." },
        { type: "Comprehension", prompt: "What should Nina do next?", options: ["Cancel immediately", "Let you know when she is travelling to the restaurant", "Call the restaurant at seven", "Finish dinner before 7:30"], answer: 1, explanation: "Your reply asks her to message when she is on her way." }
      ],
      responsePrompt: "Write a warm 1–2 sentence reply that accepts the change and tells Nina what to do next.",
      responseHints: ["That works for me.", "Take your time.", "Just let me know when…"],
      modelResponse: "7:30 works for me—no worries at all. Take your time, and just let me know when you’re on your way."
    },
    {
      id: "daily-noisy-neighbor", category: "Daily life", format: "Hallway conversation", level: "Intermediate", minutes: 7,
      title: "A polite request to a neighbor", summary: "A neighbor raises a recurring problem without starting a conflict.",
      passage: [
        { speaker: "Sam", text: "Hi, do you have a minute? I wanted to mention something about the music last night. I could hear it quite clearly in my bedroom after midnight." },
        { speaker: "Sam", text: "I completely understand that it was Saturday, and I don’t mind some noise earlier in the evening. Would it be possible to keep it down after eleven on weeknights and around midnight on weekends?" },
        { speaker: "Alex", text: "I’m sorry—I didn’t realize it carried that far. Thanks for letting me know. I’ll keep the volume lower from now on." }
      ],
      chunks: [
        { text: "Do you have a minute?", meaning: "Are you available for a short conversation?", intent: "Open a potentially sensitive topic gently.", chunkId: "request-minute" },
        { text: "I wanted to mention something", meaning: "I need to raise a topic.", intent: "Signal a concern without sounding aggressive." },
        { text: "Would it be possible to…?", meaning: "Can you do this?", intent: "Make a polite request." },
        { text: "keep it down", meaning: "Make less noise.", intent: "Request lower volume in natural everyday English.", chunkId: "request-turn-down" },
        { text: "Thanks for letting me know", meaning: "I appreciate that you told me.", intent: "Accept feedback constructively." }
      ],
      questions: [
        { type: "Overall intent", prompt: "What outcome does Sam want?", options: ["No music at any time", "Lower noise late at night", "An invitation to the next party", "Alex to move away"], answer: 1, explanation: "Sam accepts reasonable earlier noise but requests quieter late hours." },
        { type: "Implied intent", prompt: "Why does Sam first say that Saturday noise is understandable?", options: ["To withdraw the complaint", "To show balance and make the request less confrontational", "To ask what day it is", "To suggest a louder party"], answer: 1, explanation: "Acknowledging Alex’s perspective makes the boundary sound fair rather than hostile." },
        { type: "Comprehension", prompt: "What surprised Alex?", options: ["Sam was awake", "The music could be heard so far away", "It was Saturday", "The building allowed music"], answer: 1, explanation: "Alex says, “I didn’t realize it carried that far.”" }
      ],
      responsePrompt: "Reply as Alex in 2 sentences. Apologize, show that you understand the impact, and commit to a change.",
      responseHints: ["I’m sorry—I didn’t realize…", "Thanks for letting me know.", "I’ll… from now on."],
      modelResponse: "I’m sorry—I didn’t realize the music carried that far. Thanks for letting me know; I’ll keep it down after eleven from now on."
    },
    {
      id: "article-four-day-trial", category: "Article", format: "Business brief", level: "Upper-intermediate", minutes: 8,
      title: "A shorter week, measured carefully", summary: "A fictional company trial shows why a positive headline still needs context.",
      passage: [
        { speaker: "Business brief", text: "Northline, a mid-sized software company, has completed a three-month trial of a four-day workweek. Employees kept their salaries but worked thirty-two hours instead of forty. The company said project delivery remained on schedule, while self-reported burnout fell by eighteen percent." },
        { speaker: "Business brief", text: "The early results look promising, but the trial was limited to two departments and took place during a relatively quiet quarter. Customer-support teams were not included because the company had not yet worked out how to maintain seven-day coverage." },
        { speaker: "Business brief", text: "Northline plans to extend the trial for another six months. Leaders said they want to see whether the gains hold up during a busier period before making a company-wide decision." }
      ],
      chunks: [
        { text: "remained on schedule", meaning: "Continued to meet the planned timeline.", intent: "Report that output did not fall behind." },
        { text: "the early results look promising", meaning: "Initial evidence is encouraging but not final.", intent: "Express cautious optimism." },
        { text: "was limited to", meaning: "Only included a restricted group or scope.", intent: "State a limitation that affects how broadly we can apply the result." },
        { text: "worked out how to", meaning: "Found a practical solution for doing something.", intent: "Describe solving an operational problem." },
        { text: "hold up", meaning: "Remain valid or successful under more demanding conditions.", intent: "Question whether an early result will last." }
      ],
      questions: [
        { type: "Overall intent", prompt: "What is the article’s main message?", options: ["Four-day weeks always succeed", "Northline has permanently changed every team", "The trial is encouraging, but more evidence is needed", "Customer support performed badly"], answer: 2, explanation: "The article reports positive results while emphasizing limited scope and timing." },
        { type: "Implied intent", prompt: "Why does the writer mention the quiet quarter?", options: ["To prove the trial failed", "To show that the results may not fully predict a busy period", "To explain employee salaries", "To criticize customer support"], answer: 1, explanation: "A quiet period makes it harder to know whether the model will work under heavier demand." },
        { type: "Comprehension", prompt: "Why was customer support excluded?", options: ["Its employees refused", "It had no burnout", "Coverage planning was unresolved", "It already used a three-day week"], answer: 2, explanation: "The company had not yet found a way to provide seven-day coverage." }
      ],
      responsePrompt: "Write a 2–3 sentence summary for a colleague. Include both the positive result and one important limitation.",
      responseHints: ["The early results look promising…", "However, the trial was limited to…", "The company will… before…"],
      modelResponse: "The early results look promising: delivery remained on schedule and reported burnout fell. However, the trial was limited to two departments during a quiet quarter, so Northline will test it for six more months before making a company-wide decision."
    },
    {
      id: "article-ai-review", category: "Article", format: "Technology brief", level: "Upper-intermediate", minutes: 8,
      title: "AI reviews code, but people still decide", summary: "A fictional engineering study separates faster feedback from better judgment.",
      passage: [
        { speaker: "Technology brief", text: "A six-week internal study at BrightStack found that an AI review assistant helped engineers identify routine issues earlier in the development process. Teams using the tool received first-pass feedback in minutes rather than hours, which reduced the time pull requests spent waiting for review." },
        { speaker: "Technology brief", text: "However, the assistant was less reliable when changes depended on business context or involved trade-offs across several systems. Engineers sometimes accepted suggestions that looked reasonable in isolation but conflicted with decisions made elsewhere in the architecture." },
        { speaker: "Technology brief", text: "The study’s authors concluded that the tool was most useful as a second pair of eyes, not as a replacement for human review. BrightStack will continue the pilot while adding clearer guidance about which suggestions require extra scrutiny." }
      ],
      chunks: [
        { text: "first-pass feedback", meaning: "An initial review before deeper examination.", intent: "Describe quick early input, not a final decision." },
        { text: "depended on business context", meaning: "Required knowledge of goals, constraints, or decisions beyond the code itself.", intent: "Explain why surface-level analysis may be insufficient." },
        { text: "looked reasonable in isolation", meaning: "Seemed correct when considered alone.", intent: "Contrast local plausibility with system-wide correctness." },
        { text: "a second pair of eyes", meaning: "Another source of checking or review.", intent: "Position a tool as assistance rather than authority." },
        { text: "require extra scrutiny", meaning: "Need closer and more careful examination.", intent: "Flag higher-risk cases for human judgment." }
      ],
      questions: [
        { type: "Overall intent", prompt: "What conclusion does the brief support?", options: ["AI should approve all code changes", "The tool is useful for fast initial checks but cannot replace contextual human review", "The pilot should end immediately", "Business context is unnecessary in code review"], answer: 1, explanation: "The tool speeds up routine feedback, but humans remain responsible for contextual judgment." },
        { type: "Implied intent", prompt: "What does “reasonable in isolation” warn us about?", options: ["A suggestion may look good locally but be wrong for the wider system", "Engineers should work alone", "Architecture never changes", "Fast feedback is always inaccurate"], answer: 0, explanation: "The phrase highlights the difference between one code change and its broader architectural context." },
        { type: "Comprehension", prompt: "What became faster during the pilot?", options: ["Company hiring", "First-pass review feedback", "Business decisions", "System migrations"], answer: 1, explanation: "Teams received initial feedback in minutes instead of hours." }
      ],
      responsePrompt: "Write a short comment for your engineering team. Recommend how to use the assistant safely.",
      responseHints: ["It can help us…", "We should still…", "Suggestions involving… require…"],
      modelResponse: "The assistant can help us catch routine issues and shorten the first review pass. We should still treat it as a second pair of eyes, and suggestions involving business context or cross-system trade-offs should require extra scrutiny from a human reviewer."
    }
  ]
});
