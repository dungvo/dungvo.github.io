window.ChunkContent.registerConversations({
  schemaVersion: 1,
  collection: {id:"fluency-speaking-v1",title:"Guided fluency practice"},
  topics: [
    {
      id:"fluency-sixty-second",category:"Fluency drills",title:"Build a 60-second answer",level:"B1",minutes:7,
      goal:"Turn a short answer into one clear minute using signposts and an example.",
      userRole:"You are answering a familiar question without reading a script.",aiRole:"A patient fluency coach who helps expand ideas one layer at a time.",
      opening:"What is one part of your work that you enjoy, and why?",
      questions:["What is your main point?","What is the main reason?","Can you give one example?","What result or feeling does that create?"],
      chunkIds:["fluency-think-second","fluency-main-reason","fluency-example-mind","fluency-two-things"],
      prompt:"Help me build a natural 60-second English answer. Ask one question at a time: main point, reason, example, and result. Give me two or three seconds to think and do not interrupt a useful pause. If I freeze, offer one fluency chunk, not a complete answer. At the end, show a natural version based only on my ideas and mark the reusable chunks."
    },
    {
      id:"fluency-short-story",category:"Fluency drills",title:"Tell a short story clearly",level:"B1",minutes:8,
      goal:"Tell an event in order without translating every sentence first.",
      userRole:"You are telling a colleague about a small surprise or problem.",aiRole:"A curious listener asking what happened next.",
      opening:"Tell me about a small problem you solved recently.",
      questions:["What was the situation at first?","What happened next?","When did you realize the real problem?","How did it end?"],
      chunkIds:["fluency-what-happened","fluency-at-first-then","turned-out-that","fluency-good-news"],
      prompt:"Help me tell a short real story using Situation → What happened → Discovery → Result. Ask one follow-up at a time and react naturally. Encourage me to keep speaking even if grammar is imperfect. Correct only errors that block the story, then give three concise corrections at the end."
    },
    {
      id:"fluency-work-update",category:"Workplace fluency",title:"Give an update without freezing",level:"B1-B2",minutes:8,
      goal:"Deliver a connected update with progress, issue, action, and timing.",
      userRole:"You are giving a stand-up update about a current data task.",aiRole:"A team lead who asks brief follow-up questions.",
      opening:"Could you give me a quick update on what you’re working on?",
      questions:["What is complete?","What is the main issue?","What are you doing next?","When will you update the team?"],
      chunkIds:["meeting-update","fluency-main-reason","next-step","request-let-know","fluency-correct-myself"],
      prompt:"Run a realistic stand-up update with me. Let me finish each thought before asking the next question. If I make a factual or language self-correction, encourage me to use 'Let me correct myself' and continue instead of restarting. At the end, provide a fluent 30-second version using my facts."
    },
    {
      id:"fluency-rephrase",category:"Fluency drills",title:"Rephrase when the listener is confused",level:"B1-B2",minutes:8,
      goal:"Recover naturally instead of stopping when an explanation is unclear.",
      userRole:"You are explaining a process to a colleague.",aiRole:"A colleague who misunderstands twice in different ways.",
      opening:"Can you explain how this data check works?",
      questions:["What do you mean by that?","Could you put it another way?","Can you give a simple example?","What is the main point?"],
      chunkIds:["fluency-mean-is","fluency-another-way","fluency-trying-say","fluency-example-mind","clarify-main-point"],
      prompt:"Ask me to explain a familiar technical process. Misunderstand one detail naturally so I must rephrase it, then ask for an example. Do not supply the explanation for me. Afterward, show which repair chunks I used and one place where a simpler sentence would be clearer."
    },
    {
      id:"fluency-discussion",category:"Discussion fluency",title:"Build on a different opinion",level:"B1-B2",minutes:9,
      goal:"Acknowledge, disagree, and keep the exchange moving.",
      userRole:"You are discussing whether a team should adopt a new tool.",aiRole:"A colleague with a reasonable but different view.",
      opening:"I think we should switch to the new tool immediately. What do you think?",
      questions:["What part of my view do you understand?","What is your concern?","What alternative would you suggest?","What compromise could work?"],
      chunkIds:["fluency-get-saying","fluency-might-right","fluency-only-concern","fluency-see-it","problem-tradeoff"],
      prompt:"Have a balanced discussion with me. Present one reasonable opposing view, let me acknowledge it, then ask me to explain my concern and propose a compromise. Do not turn it into a debate lecture. At the end, rate flow, clarity, and collaboration separately from 1 to 5."
    },
    {
      id:"fluency-simple-technical",category:"Data engineering",title:"Explain technical ideas simply",level:"B1-B2",minutes:9,
      goal:"Explain a data concept to a nontechnical listener using context and one example.",
      userRole:"You are explaining a pipeline, lakehouse, or data-quality check.",aiRole:"A business manager who stops unexplained jargon.",
      opening:"I’m not technical. What does this pipeline actually do for the business?",
      questions:["Can you give me some context?","What is the simple version?","Can you give one example?","Why should I care?"],
      chunkIds:["fluency-give-context","fluency-another-way","fluency-example-mind","fluency-main-reason","clarify-basically"],
      prompt:"Act as a nontechnical business manager. Ask me to explain one technical concept in plain English. Stop me once when I use jargon and ask me to put it another way. Require one concrete example and one business impact. At the end, rewrite only the sentences that were unnecessarily technical."
    },
    {
      id:"fluency-natural-small-talk",category:"Daily life",title:"Keep small talk moving",level:"A2-B1",minutes:7,
      goal:"React, follow up, and connect related ideas without an interview-like rhythm.",
      userRole:"You are chatting with a colleague during a break.",aiRole:"A friendly colleague sharing short personal details.",
      opening:"This week has gone by so quickly. How has yours been?",
      questions:["What made it busy or relaxing?","Did anything unexpected happen?","Does that remind you of another experience?","What are you looking forward to?"],
      chunkIds:["social-really","social-interesting","fluency-reminds-me","fluency-speaking-of","fluency-before-forget"],
      prompt:"Have a relaxed seven-minute small-talk conversation with me. Share brief details too, so it feels reciprocal rather than like an interview. Encourage me to react and ask one follow-up before changing topics. Save corrections until the end and suggest three natural reaction chunks."
    },
    {
      id:"fluency-interview-thinking",category:"Interview",title:"Think aloud in an interview",level:"B1-B2",minutes:10,
      goal:"Use pauses and answer structure confidently under pressure.",
      userRole:"You are answering a behavioral or technical interview question.",aiRole:"An interviewer who allows thinking time and probes vague claims.",
      opening:"Tell me about a decision you made with incomplete information.",
      questions:["What context did you have?","What two factors did you consider?","Can you give a concrete example?","What did you learn?"],
      chunkIds:["fluency-good-question","fluency-moment-think","fluency-give-context","fluency-two-things","fluency-example-mind"],
      prompt:"Run one interview question at a time. Allow me a short silent pause without answering for me. Encourage a structure of Context → Factors → Decision → Result. Probe vague language once. At the end, show where I paused effectively, where I lost structure, and a polished answer using only facts I provided."
    }
  ]
});
