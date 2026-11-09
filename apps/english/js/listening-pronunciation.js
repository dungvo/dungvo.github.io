/* Shared pronunciation reference for Listening Levels 1–3.
   Curated en-US IPA is authoritative; Vietnamese guides are approximate.
   Never generate phonetic spellings by replacing English letters. */
(() => {
  'use strict';
  const entries = {
    "I'll be there in ten minutes.": ["/aɪl bi ˈðer ɪn ten ˈmɪnɪts/","ai(l) bi ĐE(r) in ten MI-nịts","I'll be THERE | in TEN MINutes","Link there‿in; keep the final /n/ in ten."],
    "I'll call you in five minutes.": ["/aɪl kɔl ju ɪn faɪv ˈmɪnɪts/","ai(l) KO(l) diu in faiv MI-nịts","I'll CALL you | in FIVE MINutes","Link call‿you and you‿in."],
    "Could you speak a little more slowly, please?": ["/kʊdʒə spiːk ə ˈlɪtəl mɔr ˈsloʊli pliːz/","KỤD-giờ SPIIK ờ LI-tồ mo(r) SLÂU-li pliiz","Could you SPEAK | a little more SLOWly | PLEASE?","Could you often sounds like /kʊdʒə/ in connected speech."],
    "Could you explain that again, please?": ["/kʊdʒə ɪkˈspleɪn ðæt əˈɡen pliːz/","KỤD-giờ ik-SPLÂYN đhét ờ-GHEN pliiz","Could you exPLAIN | that aGAIN | PLEASE?","The main stress in explain is on PLAIN."],
    "Where is the CEO's office?": ["/wer ɪz ðə ˌsiː iː ˈoʊz ˈɔfɪs/","QUE(r) iz đờ si-i-ÂUZ O-fịs","WHERE is the CEO's OFfice?","Connect where‿is and the vowel sounds in C-E-O."],
    "Where is the CEO from?": ["/wer ɪz ðə ˌsiː iː ˈoʊ frəm/","QUE(r) iz đờ si-i-ÂU frờm","WHERE is the CEO FROM?","From is often reduced to /frəm/."],
    "It's on this floor.": ["/ɪts ɑn ðɪs flɔr/","its on đhís FLO(r)","It's on THIS FLOOR.","The /ð/ in this is made with the tongue lightly between the teeth."],
    "I'm on my way.": ["/aɪm ɑn maɪ weɪ/","aim on mai UÂY","I'm on my WAY.","Link I'm‿on; keep way as one syllable."],
    "Go straight ahead and turn left.": ["/ɡoʊ streɪt əˈhed ən tɝn left/","gâu STRÂYT ờ-HÉD ần TƠRN LEFt","Go STRAIGHT aHEAD | and TURN LEFT.","Ahead is stressed on HEAD; and often becomes /ən/."],
    "That makes sense.": ["/ðæt meɪks sens/","đhét MÂYKS SENS","That MAKES SENSE.","Keep the /s/ at the end of makes."],
    "Let me check the source first.": ["/ˈlet mi tʃek ðə sɔrs fɝst/","LET mi CHEK đờ SO(r)S FƠRST","Let me CHECK | the SOURCE FIRST.","Source is one syllable in American English."],
    "We could try a different approach.": ["/wi kəd traɪ ə ˈdɪfrənt əˈproʊtʃ/","ui kờd TRAI ờ DIF-rờnt ờ-PRÂUCH","We could TRY | a DIFferent apPROACH.","Approach is stressed on PROACH."],
    "I see your point, but we may need more time to test the solution.": ["/aɪ siː jər pɔɪnt bət wi meɪ niːd mɔr taɪm tə test ðə səˈluːʃən/","ai SII dờ POYNT, bợt ui mây NIID mo(r) TAIM tờ TEST đờ sờ-LUU-shần","I SEE your POINT | but we may NEED MORE TIME | to TEST the soLUtion.","your /jər/, but /bət/, to /tə/ are often reduced."],
    "Could we go over the main points one more time before we finish?": ["/kʊd wi ɡoʊ ˈoʊvər ðə meɪn pɔɪnts wʌn mɔr taɪm bɪˈfɔr wi ˈfɪnɪʃ/","kụd ui GÂU ÂU-vờ đờ MÂYN POYNTS uăn MO(r) TAIM bi-FO(r) ui FI-nish","Could we GO OVER | the MAIN POINTS | ONE MORE TIME | before we FINISH?","Link go‿over; don't stress every word equally."],
    "I'll send you the updated report as soon as I finish checking the numbers.": ["/aɪl send ju ði ʌpˈdeɪtɪd rɪˈpɔrt æz suːn æz aɪ ˈfɪnɪʃ ˈtʃekɪŋ ðə ˈnʌmbərz/","ai(l) SEND diu đi ập-DÂY-tịd ri-PORT az SUUN az ai FI-nish CHE-king đờ NĂM-bờ(r)z","I'll SEND you | the upDATED rePORT | as SOON as I FINISH | CHECKing the NUMbers.","as soon as commonly links into one rhythm group."],
    "Focus on the main idea first.": ["/ˈfoʊkəs ɑn ðə meɪn aɪˈdiːə fɝst/","FÂU-kờs on đờ MÂYN ai-DI-ờ FƠRST","FOcus on the MAIN iDEA FIRST.","Idea is /aɪˈdiːə/, with stress on DEE."]
  };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const lookup = text => entries[String(text || '').trim()] || null;
  function html(text, options={}) {
    const entry = lookup(text);
    if (!entry) return '';
    const [ipa, vietnamese, stress, note] = entry;
    return `<section class="pronunciation-guide" aria-label="Hướng dẫn phát âm"><div class="pronunciation-heading"><b>🔊 Pronunciation coach</b><span>US English · IPA</span></div><p class="pronunciation-label">IPA (giọng Mỹ)</p><p class="pronunciation-ipa" lang="en">${esc(ipa)}</p><p class="pronunciation-label">Nhấn trọng âm & ngắt nhịp</p><p class="pronunciation-stress" lang="en">${esc(stress)}</p><p class="pronunciation-label">Đọc gần đúng theo tiếng Việt</p><p class="pronunciation-vietnamese" lang="vi">${esc(vietnamese)}</p><p class="pronunciation-tip" lang="vi">${esc(note)}</p><small>Chữ IN HOA = âm hoặc từ cần nhấn; | = ngắt nhịp; ‿ = nối âm. Cách đọc tiếng Việt chỉ là gợi ý gần đúng, hãy ưu tiên nghe mẫu và IPA.</small>${options.compact ? '' : '<p class="pronunciation-drill"><b>Shadowing:</b> nghe chậm → nói theo từng nhóm → nghe tốc độ thường → nói lại không nhìn chữ.</p>'}</section>`;
  }
  window.ListeningPronunciation = { html, lookup };
})();
