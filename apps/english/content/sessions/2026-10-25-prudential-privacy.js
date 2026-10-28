(() => {
  const content = {
    schemaVersion: 1,
    session: {
      id: "2026-10-25-prudential-privacy",
      title: "Privacy, data protection & leave",
      dates: ["2026-10-25"],
      alwaysAvailable: true,
      topics: ["Prudential training", "privacy", "data protection", "HR", "leave", "pre-assessment"]
    },
    chunks: [
      {
        id: "privacy-q03-personal-data", questionNumber: 3, sourceQuestion: "What counts as personal data?",
        chunk: "Personal data can identify someone directly or indirectly.", ipa: "/ˈpɝːsənəl ˈdeɪtə kən aɪˈdentɪfaɪ ˈsʌmwʌn dəˈrektli ɔːr ˌɪndəˈrektli/", viPronunciation: "PƠ-sờ-nồ ĐÂY-tờ cờn ai-ĐEN-tờ-fai SÂM-oăn đờ-REKT-li or in-đờ-REKT-li",
        meaning: "Information is personal data when it can identify a person on its own or when combined with other information.", situation: "A team asks whether an employee ID or device identifier should be treated as personal data.", example: "An employee number may identify someone indirectly when it is linked to an HR record.", gap: "Personal data can identify someone directly ___ indirectly.", answer: "or", alternatives: ["and to", "but", "from"], note: "Pattern: identify + person + directly or indirectly. Personal data is broader than a name or email address."
      },
      {
        id: "privacy-q04-processing", questionNumber: 4, sourceQuestion: "What does processing personal data include?",
        chunk: "Processing includes collecting, using, storing, sharing, and deleting data.", ipa: "/ˈprɑːsesɪŋ ɪnˈkluːdz kəˈlektɪŋ ˈjuːzɪŋ ˈstɔːrɪŋ ˈʃerɪŋ ænd dɪˈliːtɪŋ ˈdeɪtə/", viPronunciation: "PRO-se-sing in-CLUĐZ cờ-LEC-ting, YU-zing, STO-ring, SHE-ring en đờ-LI-ting ĐÂY-tờ",
        meaning: "Processing is almost any action performed on personal data, not only analysis or computation.", situation: "You explain why copying customer data into a spreadsheet is still a data-processing activity.", example: "Exporting records, emailing a file, and deleting old records are all forms of processing.", gap: "Processing ___ collecting, using, storing, sharing, and deleting data.", answer: "includes", alternatives: ["include", "including is", "has include"], note: "Includes + noun or -ing form. Use a parallel list: collecting, using, storing, sharing, and deleting."
      },
      {
        id: "privacy-q05-sensitive-data", questionNumber: 5, sourceQuestion: "Which information needs extra protection?",
        chunk: "Sensitive personal data requires additional protection.", ipa: "/ˈsensətɪv ˈpɝːsənəl ˈdeɪtə rɪˈkwaɪərz əˈdɪʃənəl prəˈtekʃən/", viPronunciation: "SEN-sờ-tiv PƠ-sờ-nồ ĐÂY-tờ rờ-KWAI-ờz ờ-ĐI-shờ-nồ prờ-TEK-shần",
        meaning: "Certain categories, such as health or biometric information, can create greater harm and need stronger safeguards.", situation: "A report contains employee health information and the team is deciding how to restrict access.", example: "We should limit access because the file contains sensitive personal data.", gap: "Sensitive personal data ___ additional protection.", answer: "requires", alternatives: ["require", "is require", "requiring"], note: "Data is normally treated as an uncountable singular noun in general business English: data requires protection."
      },
      {
        id: "privacy-q06-lawful-purpose", questionNumber: 6, sourceQuestion: "When may personal data be processed?",
        chunk: "We need a lawful and clearly defined purpose.", ipa: "/wiː niːd ə ˈlɔːfəl ænd ˈklɪrli dɪˈfaɪnd ˈpɝːpəs/", viPronunciation: "wi NIĐ ờ LO-fồ en CLI-ờ-li đờ-FAINĐ PƠ-pợs",
        meaning: "Before processing personal data, the organization needs a valid legal basis and a specific reason.", situation: "A stakeholder wants to reuse customer records for a new analytics project.", example: "Before we reuse the records, we need a lawful and clearly defined purpose.", gap: "We need a lawful and clearly ___ purpose.", answer: "defined", alternatives: ["define", "defining", "definition"], note: "Clearly defined is an adjective phrase before a noun. Avoid vague purposes such as 'for future use.'"
      },
      {
        id: "privacy-q07-purpose-limitation", questionNumber: 7, sourceQuestion: "Can data collected for one purpose be used for another?",
        chunk: "Use the data only for the stated purpose.", ipa: "/juːz ðə ˈdeɪtə ˈoʊnli fɔːr ðə ˈsteɪtɪd ˈpɝːpəs/", viPronunciation: "YUZ đờ ĐÂY-tờ ÔN-li for đờ STÂY-tịt PƠ-pợs",
        meaning: "Purpose limitation means data should not be reused incompatibly with the reason originally explained.", situation: "Marketing wants to reuse claims data that was collected to administer a policy.", example: "We cannot assume a new use is acceptable; use the data only for the stated purpose.", gap: "Use the data only ___ the stated purpose.", answer: "for", alternatives: ["to", "with", "by"], note: "Use something for a purpose. If the purpose changes, pause and check the legal and privacy requirements."
      },
      {
        id: "privacy-q08-data-minimisation", questionNumber: 8, sourceQuestion: "How much personal data should be collected?",
        chunk: "Collect only the data we actually need.", ipa: "/kəˈlekt ˈoʊnli ðə ˈdeɪtə wiː ˈæktʃuəli niːd/", viPronunciation: "cờ-LEKT ÔN-li đờ ĐÂY-tờ wi AC-chu-ờ-li NIĐ",
        meaning: "Data minimisation means limiting collection and access to what is necessary for the task.", situation: "A registration form asks for a date of birth even though age is irrelevant to the service.", example: "Let's remove that field and collect only the data we actually need.", gap: "Collect only the data we actually ___.", answer: "need", alternatives: ["needed to", "are need", "needing"], note: "Only focuses the limit. Actually need emphasizes real necessity rather than possible future usefulness."
      },
      {
        id: "privacy-q09-accuracy", questionNumber: 9, sourceQuestion: "What should we do when personal data is inaccurate?",
        chunk: "Keep personal data accurate and up to date.", ipa: "/kiːp ˈpɝːsənəl ˈdeɪtə ˈækjərət ænd ʌp tə deɪt/", viPronunciation: "KIP PƠ-sờ-nồ ĐÂY-tờ AC-kiờ-rợt en ÂP-tờ-ĐÂYT",
        meaning: "Organizations should correct inaccurate information and maintain it when decisions depend on it.", situation: "An employee notices that the HR system shows an old address and an incorrect leave balance.", example: "Please update the record so we keep your personal data accurate and up to date.", gap: "Keep personal data accurate and up ___ date.", answer: "to", alternatives: ["for", "with", "at"], note: "Up to date has no hyphens after a verb; use an up-to-date record before a noun."
      },
      {
        id: "privacy-q10-retention", questionNumber: 10, sourceQuestion: "How long should personal data be retained?",
        chunk: "Do not keep personal data longer than necessary.", ipa: "/duː nɑːt kiːp ˈpɝːsənəl ˈdeɪtə ˈlɔːŋɡər ðæn ˈnesəseri/", viPronunciation: "đu NOT KIP PƠ-sờ-nồ ĐÂY-tờ LONG-gờ đen NE-sờ-se-ri",
        meaning: "Storage limitation requires deletion or anonymisation when data is no longer needed under the retention rule.", situation: "A shared drive contains old applicant CVs with no documented business need.", example: "We should follow the retention schedule and not keep personal data longer than necessary.", gap: "Do not keep personal data longer ___ necessary.", answer: "than", alternatives: ["then", "that", "as"], note: "Comparative pattern: longer than + noun/adjective/clause. Check the retention schedule before deleting records."
      },
      {
        id: "privacy-q11-leave-report", questionNumber: 11, sourceQuestion: "How should leave and HR information be handled?",
        chunk: "A leave report may contain confidential HR information.", ipa: "/ə liːv rɪˈpɔːrt meɪ kənˈteɪn ˌkɑːnfəˈdenʃəl ˌeɪtʃ ˈɑːr ˌɪnfərˈmeɪʃən/", viPronunciation: "ờ LIV rờ-PORT mây cờn-TÂYN con-fờ-ĐEN-shồ ÂYCH-AR in-fờ-MÂY-shần",
        meaning: "Leave records can reveal attendance, family circumstances, or health-related information and should be shared carefully.", situation: "You are preparing a team leave report and need to decide who should receive it.", example: "Share the leave report only with colleagues who have a legitimate HR or management need.", gap: "A leave report may ___ confidential HR information.", answer: "contain", alternatives: ["contains", "containing", "contained"], note: "After a modal such as may, use the base verb: may contain. HR terms: leave balance, annual leave, sick leave, carry over, and leave entitlement."
      },
      {
        id: "privacy-q12-by-design", questionNumber: 12, sourceQuestion: "What does privacy by design mean?",
        chunk: "Consider data protection and privacy issues upfront in everything you do.", ipa: "/kənˈsɪdər ˈdeɪtə prəˈtekʃən ænd ˈpraɪvəsi ˈɪʃuːz ˌʌpˈfrʌnt ɪn ˈevriθɪŋ juː duː/", viPronunciation: "cờn-SI-đờ ĐÂY-tờ prờ-TEK-shần en PRAI-vờ-si I-shuz ÂP-FRÂNT in EV-ri-thing yu ĐU",
        meaning: "Privacy by design means building privacy into a project from the beginning, not adding it after decisions are made.", situation: "A new customer-data feature is still at the design stage.", example: "Let's consider access, retention, and transparency upfront in the design.", gap: "Consider data protection and privacy issues ___ in everything you do.", answer: "upfront", alternatives: ["afterward", "behind", "lastly"], note: "Upfront means at the beginning. Consider + noun or consider + -ing; do not use 'consider to do.'"
      },
      {
        id: "privacy-q13-pia-inventory", questionNumber: 13, sourceQuestion: "If the privacy team is engaged, will the data inventory automatically be updated as part of the PIA process?",
        chunk: "Do not assume the data inventory will be updated automatically.", ipa: "/duː nɑːt əˈsuːm ðə ˈdeɪtə ˈɪnvənˌtɔːri wɪl biː ʌpˈdeɪtɪd ˌɔːtəˈmætɪkli/", viPronunciation: "đu NOT ờ-SUM đờ ĐÂY-tờ IN-vờn-to-ri wil bi âp-ĐÂY-tịt o-tờ-MA-tịc-li",
        meaning: "Engaging the privacy team or completing a PIA does not remove the project team's responsibility to confirm required records and updates.", situation: "Your project has started a privacy impact assessment and someone assumes all governance records will update themselves.", example: "Let's confirm who owns the inventory update instead of assuming it happens automatically.", gap: "Do not assume the data inventory will be updated ___.", answer: "automatically", alternatives: ["automatic", "automate", "automation"], note: "Will be updated is passive voice. Automatically is an adverb modifying updated. For this training statement, the safe answer is False."
      },
      {
        id: "privacy-q14-breach-threshold", questionNumber: 14, sourceQuestion: "When is mandatory data-breach notification required?",
        chunk: "Notification is required when the legal definition and local threshold are both met.", ipa: "/ˌnoʊtəfəˈkeɪʃən ɪz rɪˈkwaɪərd wen ðə ˈliːɡəl ˌdefəˈnɪʃən ænd ˈloʊkəl ˈθreʃhoʊld ɑːr boʊθ met/", viPronunciation: "nâu-tờ-fờ-CÂY-shần iz rờ-KWAI-ờđ wen đờ LI-gồ đe-fờ-NI-shần en LÂU-cồ THRESH-hôld ar bôth MET",
        meaning: "A notification duty depends on whether the event is a data breach under local law and whether its notification threshold is reached.", situation: "An incident affects information and the response team is deciding whether regulators must be notified.", example: "We need legal and privacy advice to confirm whether the definition and local notification threshold are both met.", gap: "Notification is required when both conditions are ___.", answer: "met", alternatives: ["meet", "meeting", "meets"], note: "Both conditions are met is passive voice. Do not base notification solely on media attention or on any incident involving company data."
      },
      {
        id: "privacy-q15-breach-timeline", questionNumber: 15, sourceQuestion: "What is the timeline for notifying regulators of a personal data breach?",
        chunk: "The notification timeline depends on the period prescribed under local law.", ipa: "/ðə ˌnoʊtəfəˈkeɪʃən ˈtaɪmlaɪn dɪˈpendz ɑːn ðə ˈpɪriəd prɪˈskraɪbd ˈʌndər ˈloʊkəl lɔː/", viPronunciation: "đờ nâu-tờ-fờ-CÂY-shần TAIM-lain đờ-PENĐZ on đờ PI-ri-ờđ prờ-SCRAIBĐ ÂN-đờ LÂU-cồ LO",
        meaning: "There is no single universal deadline; the response team must follow the applicable jurisdiction's legal timeframe.", situation: "A possible personal data breach has been discovered in more than one country.", example: "Escalate immediately so the team can identify and meet each timeline prescribed under local law.", gap: "The notification timeline depends ___ the period prescribed under local law.", answer: "on", alternatives: ["of", "for", "with"], note: "Depend on + noun. Prescribed under local law means officially required by the applicable law; do not wait for the investigation to finish before escalating."
      }
    ]
  };
  content.chunks.forEach((chunk) => { chunk.practiceModes = ["meaning", "situation", "build", "speak", "listen", "recall", "retype"]; });
  window.ChunkContent.register(content);
})();
