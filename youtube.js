const YT_VIDEOS = [
  // ── BBC Learning English ──
  { id:'QxQUapA-2w4', title:'Complete Guide to English Pronunciation (ALL 44 sounds)', channel:'BBC Learning English', ch:'bbc', category:'pronunciation', dur:'30:00' },
  { id:'_LlyKiROzhU', title:'6 Minute English - Human Emotions Mega-Class', channel:'BBC Learning English', ch:'bbc', category:'english', dur:'30:22' },
  { id:'b5DOQ7iOzO4', title:'6 Minute English - Lifestyle Mega-Class', channel:'BBC Learning English', ch:'bbc', category:'english', dur:'29:35' },
  { id:'JXxnEhD-25Q', title:'6 Minute English - Environmental English', channel:'BBC Learning English', ch:'bbc', category:'english', dur:'30:00' },
  { id:'Xbv4IIqwW-4', title:'Which Country Has the Best Schools?', channel:'BBC Learning English', ch:'bbc', category:'english', dur:'6:18' },
  { id:'I_tRSrPru94', title:'How to Introduce Yourself: Easy English Conversations', channel:'BBC Learning English', ch:'bbc', category:'english', dur:'6:16' },
  { id:'4Wt7sRxqwyA', title:'Both vs Either vs Neither - English In A Minute', channel:'BBC Learning English', ch:'bbc', category:'grammar', dur:'1:00' },
  { id:'9ifQ3xRz4hM', title:'Learning Multiple Languages - 6 Minute English', channel:'BBC Learning English', ch:'bbc', category:'english', dur:'6:17' },
  { id:'H5BVbrZ64bQ', title:'Are We Getting More Allergic?', channel:'BBC Learning English', ch:'bbc', category:'english', dur:'6:17' },
  { id:'pvoqkQHb3lo', title:'Present Perfect Simple or Continuous?', channel:'BBC Learning English', ch:'bbc', category:'grammar', dur:'3:06' },
  // ── English with Lucy ──
  { id:'ZI5btv2VFvk', title:'British vs American vs Canadian English Differences', channel:'English with Lucy', ch:'lucy', category:'english', dur:'14:15' },
  { id:'8nXX1WOuvrk', title:'What is YOUR English Level? Take This Test!', channel:'English with Lucy', ch:'lucy', category:'english', dur:'23:44' },
  { id:'B8TultRu3Jc', title:'5 Things Native English Speakers NEVER Say!', channel:'English with Lucy', ch:'lucy', category:'english', dur:'13:37' },
  { id:'IhfuTmbhpR0', title:'60 Confusing English Words Explained', channel:'English with Lucy', ch:'lucy', category:'vocabulary', dur:'1:05:16' },
  { id:'VYeBYn970a8', title:'How to Read ALL Numbers in English', channel:'English with Lucy', ch:'lucy', category:'vocabulary', dur:'20:27' },
  { id:'NSycEAiPU3U', title:'If You Know These Words, You\'re C2 Level', channel:'English with Lucy', ch:'lucy', category:'vocabulary', dur:'14:47' },
  { id:'5YA3K1bsE5U', title:'Are YOU Saying it WRONG? 5 Common Mistakes', channel:'English with Lucy', ch:'lucy', category:'english', dur:'14:49' },
  { id:'36wG9pSYu7Q', title:'MODAL VERBS: Can, Could, May, Might, Must, Should, Will, Would', channel:'English with Lucy', ch:'lucy', category:'grammar', dur:'18:51' },
  { id:'IaslvsYxFVU', title:'Learn ALL 16 TENSES in English: Complete Course', channel:'English with Lucy', ch:'lucy', category:'grammar', dur:'2:54:12' },
  { id:'OqOrfiv2Sfg', title:'Understand FAST Conversations in English', channel:'English with Lucy', ch:'lucy', category:'english', dur:'18:22' },
  // ── mmmEnglish ──
  { id:'tw25CM1MXlU', title:'10 English Words You\'re (probably) Mispronouncing!', channel:'mmmEnglish', ch:'mmm', category:'pronunciation', dur:'15:22' },
  { id:'T91p6pTPpSY', title:'Speak English Clearly! The Imitation Technique', channel:'mmmEnglish', ch:'mmm', category:'pronunciation', dur:'8:58' },
  { id:'FfhZFRvmaVY', title:'Advanced Speaking Practice: English Imitation Lesson', channel:'mmmEnglish', ch:'mmm', category:'pronunciation', dur:'18:25' },
  { id:'soN1qPcSDVo', title:'10 MOST COMMON Grammar Mistakes English Learners Make', channel:'mmmEnglish', ch:'mmm', category:'grammar', dur:'18:22' },
  { id:'ZtbGbH64mJs', title:'Common Mistakes with English ADJECTIVES -ed and -ing endings', channel:'mmmEnglish', ch:'mmm', category:'grammar', dur:'15:10' },
  { id:'skqj4jOSQU4', title:'How to Use English Modal Verbs - Possibility & Probability', channel:'mmmEnglish', ch:'mmm', category:'grammar', dur:'17:41' },
  { id:'Ft17a7tyjMM', title:'Learn All English Sounds & Pronounce Words Perfectly with IPA!', channel:'mmmEnglish', ch:'mmm', category:'pronunciation', dur:'24:31' },
  { id:'8-ktHXX0BkI', title:'MY TOP TIPS! Learn & Use More Phrasal Verbs', channel:'mmmEnglish', ch:'mmm', category:'vocabulary', dur:'18:35' },
  { id:'apBUEsF7mrw', title:'Stop Making Mistakes with Relative Clauses!', channel:'mmmEnglish', ch:'mmm', category:'grammar', dur:'13:59' },
  { id:'ybUZJco3pnY', title:'Advanced English Conversation: Practise Speaking With Me!', channel:'mmmEnglish', ch:'mmm', category:'english', dur:'25:39' },
  // ── Rachel's English ──
  { id:'SJOnhWiJArM', title:'How to THINK in English - No More Translating!', channel:'Rachel\'s English', ch:'rachel', category:'english', dur:'15:12' },
  { id:'LIZ78RwhSPc', title:'American vs British English Pronunciation Differences', channel:'Rachel\'s English', ch:'rachel', category:'pronunciation', dur:'15:18' },
  { id:'-JNjsOX0N0c', title:'English Job Interview Dos & Don\'ts!', channel:'Rachel\'s English', ch:'rachel', category:'english', dur:'15:56' },
  { id:'opKPVqxE_QY', title:'English Words You\'re Probably Mispronouncing', channel:'Rachel\'s English', ch:'rachel', category:'pronunciation', dur:'14:30' },
  { id:'wuLIUtrSE-g', title:'Learning English - How to Learn Speaking with Movies', channel:'Rachel\'s English', ch:'rachel', category:'english', dur:'9:27' },
  { id:'WxmEQsI_epM', title:'FAST ENGLISH: Native Speakers CAN\'T Understand!', channel:'Rachel\'s English', ch:'rachel', category:'pronunciation', dur:'12:01' },
  { id:'Z8zVS8S7s28', title:'WANT vs WON\'T Pronunciation - American English', channel:'Rachel\'s English', ch:'rachel', category:'pronunciation', dur:'5:44' },
  { id:'uKipWMfmIr8', title:'How to Pronounce Should, Would, Could', channel:'Rachel\'s English', ch:'rachel', category:'pronunciation', dur:'8:05' },
  { id:'dS3D58W7Ckg', title:'ED ENDINGS - American English Accent Training', channel:'Rachel\'s English', ch:'rachel', category:'pronunciation', dur:'31:19' },
  // ── TED-Ed ──
  { id:'7SWvDHvWXok', title:'Questions No One Knows the Answers to', channel:'TED-Ed', ch:'ted', category:'academic', dur:'12:10' },
  { id:'D89ngRr4uZg', title:'Newton\'s Three-Body Problem Explained', channel:'TED-Ed', ch:'ted', category:'academic', dur:'5:07' },
  { id:'Hhk4N9A0oCA', title:'What Makes a Hero?', channel:'TED-Ed', ch:'ted', category:'academic', dur:'4:18' },
  { id:'yqUFy-t4MlQ', title:'How We Conquered the Deadly Smallpox Virus', channel:'TED-Ed', ch:'ted', category:'academic', dur:'5:34' },
  { id:'5NubJ2ThK_U', title:'What Percentage of Your Brain Do You Use?', channel:'TED-Ed', ch:'ted', category:'academic', dur:'5:18' },
  { id:'uRhkDN2WjzI', title:'How Aspirin Was Discovered', channel:'TED-Ed', ch:'ted', category:'academic', dur:'5:12' },
  { id:'e7S8jWh6AEs', title:'The Paradox of Value', channel:'TED-Ed', ch:'ted', category:'academic', dur:'4:35' },
  { id:'U0EySK4T2aY', title:'The Secret Behind How Chinese Characters Work', channel:'TED-Ed', ch:'ted', category:'academic', dur:'4:58' },
  { id:'7c-OXc6H7us', title:'Can Saunas Make You Live Longer?', channel:'TED-Ed', ch:'ted', category:'academic', dur:'5:00' },
  { id:'2njn71TqkjA', title:'What Earth in 2050 Could Look Like', channel:'TED-Ed', ch:'ted', category:'academic', dur:'5:00' },
  { id:'ZQTQSbjecLg', title:'How to Build a Fictional World', channel:'TED-Ed', ch:'ted', category:'literature', dur:'5:25' },
  { id:'I5lsuyUNu_4', title:'Why Shakespeare Loved Iambic Pentameter', channel:'TED-Ed', ch:'ted', category:'literature', dur:'5:21' },
  { id:'vdCjKH5IKJ8', title:'Insults by Shakespeare', channel:'TED-Ed', ch:'ted', category:'literature', dur:'6:24' },
  // ── Interactive English ──
  { id:'zfJAxhbz6PE', title:'1-HOUR VOCABULARY LESSON - Descriptive Words & Phrases', channel:'Interactive English', ch:'interactive', category:'vocabulary', dur:'1:00:00' },
  { id:'EzCYag46_XY', title:'Advanced English Grammar That Will BLOW YOUR MIND', channel:'Interactive English', ch:'interactive', category:'grammar', dur:'30:11' },
  { id:'Kfni3VsYGvI', title:'Common Grammar Problems: Tricky Prepositions', channel:'Interactive English', ch:'interactive', category:'vocabulary', dur:'34:54' },
  { id:'bSH7Uk1a2NU', title:'10 Binomial Expressions You Need to Know', channel:'Interactive English', ch:'interactive', category:'vocabulary', dur:'17:40' },
  { id:'NbxxchddqwE', title:'Useful English Idioms for Daily Conversation', channel:'Interactive English', ch:'interactive', category:'vocabulary', dur:'17:25' },
  { id:'bIVgytdhHHo', title:'Awesome Phrasal Verbs You Should Know', channel:'Interactive English', ch:'interactive', category:'vocabulary', dur:'18:09' },
  { id:'jopAHmvPT-g', title:'Advanced English Grammar - Participle Clauses', channel:'Interactive English', ch:'interactive', category:'grammar', dur:'19:47' },
  { id:'FV2KxREE2KE', title:'Improve Your Speaking Skills', channel:'Interactive English', ch:'interactive', category:'english', dur:'20:09' },
  // ── Arnel's Everyday English ──
  { id:'4H3-2smRJJY', title:'ALL CONDITIONALS: 0,1,2,3 and MIXED CONDITIONALS', channel:'Arnel\'s Everyday English', ch:'arnel', category:'grammar', dur:'21:24' },
  { id:'cvwhip4dw3Y', title:'ARTICLES - A? An? The? Complete Grammar Guide', channel:'Arnel\'s Everyday English', ch:'arnel', category:'grammar', dur:'17:14' },
  { id:'Cazik1WGsco', title:'SOME and ANY - Complete Grammar Guide + TEST!', channel:'Arnel\'s Everyday English', ch:'arnel', category:'grammar', dur:'13:50' },
  { id:'K_XikoZwM3M', title:'If...MIXED CONDITIONALS - Advanced English Grammar', channel:'Arnel\'s Everyday English', ch:'arnel', category:'grammar', dur:'11:51' },
  { id:'bbkcipUYDhs', title:'I Use These PHRASAL VERBS Every Day!', channel:'Arnel\'s Everyday English', ch:'arnel', category:'vocabulary', dur:'18:51' },
  { id:'KY-xoyu0f2Q', title:'TAKE Expressions to Sound Natural in English', channel:'Arnel\'s Everyday English', ch:'arnel', category:'vocabulary', dur:'16:32' },
  { id:'jtxgF1rrEpY', title:'Power Up Your Conversations: Real-Life English Phrases', channel:'Arnel\'s Everyday English', ch:'arnel', category:'english', dur:'19:00' },
  { id:'gUOi5Y_n_14', title:'CONFUSING TIME EXPRESSIONS Explained', channel:'Arnel\'s Everyday English', ch:'arnel', category:'grammar', dur:'12:47' },
  // ── English with Emma (EngVid) ──
  { id:'o9aVjBHEEbU', title:'How to Write a Good Essay: Paraphrasing the Question', channel:'English with Emma (EngVid)', ch:'emma', category:'academic', dur:'14:39' },
  { id:'GgkRoYPLhts', title:'5 Tips to Improve Your Writing', channel:'English with Emma (EngVid)', ch:'emma', category:'english', dur:'14:08' },
  { id:'Ff5FUoo2YZA', title:'Learning English for Beginners: My Top Tips', channel:'English with Emma (EngVid)', ch:'emma', category:'english', dur:'18:00' },
  { id:'PgwmAUJx248', title:'Writing Letters: Formal & Informal English', channel:'English with Emma (EngVid)', ch:'emma', category:'english', dur:'11:40' },
  { id:'0-6ZBRkZKWI', title:'Learn English Tenses: 4 Ways to Talk About the FUTURE', channel:'English with Emma (EngVid)', ch:'emma', category:'grammar', dur:'16:08' },
  { id:'FNYNcCZpa9M', title:'The Secret to Remembering Vocabulary', channel:'English with Emma (EngVid)', ch:'emma', category:'vocabulary', dur:'13:46' },
  { id:'k98VNRLEisE', title:'Sound More Natural: Learn 5 FRONT VOWELS', channel:'English with Emma (EngVid)', ch:'emma', category:'pronunciation', dur:'7:24' },
  { id:'Kxi4v9w299I', title:'How to Give Your Opinion in English', channel:'English with Emma (EngVid)', ch:'emma', category:'academic', dur:'18:09' },
  { id:'nqSD7LB8HVY', title:'Using PASSIVE in English to Avoid Responsibility', channel:'English with Emma (EngVid)', ch:'emma', category:'grammar', dur:'9:27' },
  // ── EnglishClass101 ──
  { id:'juKd26qkNAw', title:'Learn English in 30 Minutes - ALL the Basics You Need', channel:'EnglishClass101.com', ch:'class101', category:'english', dur:'28:34' },
  { id:'NNamZZsggM4', title:'2 Hours of English Conversation Practice', channel:'EnglishClass101.com', ch:'class101', category:'english', dur:'2:10:00' },
  { id:'d0wV9EC3t14', title:'ALL English Tenses in 20 Minutes - Basic Grammar', channel:'EnglishClass101.com', ch:'class101', category:'grammar', dur:'19:50' },
  { id:'WTAWi4lj6Z0', title:'Job Interview English: Phrases & Tips!', channel:'EnglishClass101.com', ch:'class101', category:'english', dur:'20:06' },
  { id:'lrbCu0fngqQ', title:'How to Make Requests and Offers in English', channel:'EnglishClass101.com', ch:'class101', category:'english', dur:'19:06' },
  { id:'Hu8q-0_l4Ao', title:'How to Talk About Your Weekend Plans in English', channel:'EnglishClass101.com', ch:'class101', category:'english', dur:'21:50' },
  // ── English with Alex (EngVid) ──
  { id:'wP7valcP4FI', title:'Learn English with Alex - 10 Ways to Improve Your English', channel:'English with Alex (EngVid)', ch:'alex', category:'english', dur:'15:00' },
  { id:'75CP1xyoNFo', title:'5 Native English Speaker Mistakes', channel:'English with Alex (EngVid)', ch:'alex', category:'english', dur:'15:06' },
  { id:'C4sNHZM6op0', title:'Let\'s Get Going! 10 Casual English Expressions', channel:'English with Alex (EngVid)', ch:'alex', category:'vocabulary', dur:'13:13' },
  { id:'pAbf9uNoaV0', title:'30 Minutes of ENGLISH VOCABULARY TRAINING', channel:'English with Alex (EngVid)', ch:'alex', category:'vocabulary', dur:'33:54' },
  { id:'SkMVAesuSwc', title:'English Grammar: The 5 Most Frequent Article Mistakes', channel:'English with Alex (EngVid)', ch:'alex', category:'grammar', dur:'13:21' },
  { id:'2TxMvdyXtUY', title:'Speak English with Confidence! How to Make Appointments', channel:'English with Alex (EngVid)', ch:'alex', category:'english', dur:'12:58' },
  { id:'skT8E3CLiUk', title:'Go from Standard to Casual English (15 Common Sentences)', channel:'English with Alex (EngVid)', ch:'alex', category:'english', dur:'12:50' },
  { id:'jN4hEXwB69w', title:'35 Words We Shorten in Conversation', channel:'English with Alex (EngVid)', ch:'alex', category:'vocabulary', dur:'27:45' },
  // ── English Addict with Mr Duncan ──
  { id:'bv8QMl4KYpA', title:'Jump In With Both Feet - Learn English Expressions', channel:'English Addict with Mr Duncan', ch:'duncan', category:'english', dur:'3:37' },
  { id:'ohJCdihPWqc', title:'English Addict - Live English Lesson', channel:'English Addict with Mr Duncan', ch:'duncan', category:'english', dur:'1:30:00' },
  { id:'fzLvbUwxq1g', title:'Learn English with Mr Duncan - Full Lesson', channel:'English Addict with Mr Duncan', ch:'duncan', category:'english', dur:'58:40' },
  { id:'d3EuPDyhxKM', title:'English Addict Ep 379 - LIVE Stream', channel:'English Addict with Mr Duncan', ch:'duncan', category:'english', dur:'1:30:00' },
  { id:'a8hSmlylt5c', title:'Learn English - Mr Duncan Pronunciation Lesson', channel:'English Addict with Mr Duncan', ch:'duncan', category:'pronunciation', dur:'14:22' },
  { id:'FWI9GEwJNzc', title:'Learn English Lesson 1 - How Do I Learn English?', channel:'English Addict with Mr Duncan', ch:'duncan', category:'english', dur:'14:00' },
  { id:'r6mQrdIrLKA', title:'English Addict - LIVE Stream - Join the Chat', channel:'English Addict with Mr Duncan', ch:'duncan', category:'english', dur:'1:30:00' },
  { id:'ObOJcicYMLU', title:'18 Years on YouTube - Celebration LIVE Stream', channel:'English Addict with Mr Duncan', ch:'duncan', category:'english', dur:'1:30:00' },
  { id:'TX_jIm3PVwI', title:'English Addict Episode 384 - LIVE STREAM', channel:'English Addict with Mr Duncan', ch:'duncan', category:'english', dur:'1:30:00' },
  { id:'2FBOi0R8Bks', title:"SOMETHING & NOTHING - How to Express in English", channel:'English Addict with Mr Duncan', ch:'duncan', category:'vocabulary', dur:'14:00' },
  // ── IELTS Liz ──
  { id:'NLLKSHJfrvU', title:'IELTS Writing Task 2 - Do Ideas Need to Be Interesting?', channel:'IELTS Liz', ch:'liz', category:'academic', dur:'5:21' },
  { id:'q8qmJeBxk4Q', title:'IELTS Listening Tips and Essential Information', channel:'IELTS Liz', ch:'liz', category:'academic', dur:'31:02' },
  { id:'gCo9L1nLlQ0', title:'IELTS Discussion Essay - Useful Academic Expressions', channel:'IELTS Liz', ch:'liz', category:'academic', dur:'5:21' },
  { id:'y9Gn6aVRqaI', title:'IELTS Writing Task 2 - Paragraph Length', channel:'IELTS Liz', ch:'liz', category:'academic', dur:'10:00' },
  { id:'2TAhwbB8GKM', title:'IELTS Speaking - How to Improve at Home', channel:'IELTS Liz', ch:'liz', category:'academic', dur:'15:00' },
  { id:'E3U1Y1jgGls', title:'IELTS Writing Task 1: How to Describe a Bar Chart', channel:'IELTS Liz', ch:'liz', category:'academic', dur:'16:00' },
  { id:'AkW0IeF46cA', title:'IELTS Listening Tips: Multiple Choice', channel:'IELTS Liz', ch:'liz', category:'academic', dur:'12:00' },
  { id:'f5t8EQrg5dI', title:'IELTS Speaking Part 2: How to Start Your Talk', channel:'IELTS Liz', ch:'liz', category:'academic', dur:'10:00' },
  { id:'0gRJXeK0UIc', title:'Grammar for IELTS Writing Task 2: Adding a Clause', channel:'IELTS Liz', ch:'liz', category:'academic', dur:'8:00' },
  { id:'dzTSh7zwRIM', title:'IELTS Speaking: Greeting the Examiner', channel:'IELTS Liz', ch:'liz', category:'academic', dur:'6:00' },
  // ── IELTS Advantage ──
  { id:'7lqSx_ucv4A', title:'Get BAND 9 Using This IELTS Speaking Strategy', channel:'IELTS Advantage', ch:'advantage', category:'academic', dur:'11:02' },
  { id:'lpF5_EZIKVE', title:'Get BAND 9 After Using These Listening Tips', channel:'IELTS Advantage', ch:'advantage', category:'academic', dur:'2:08:00' },
  { id:'s2M1t-pHJcc', title:'How to Score 9.0 on IELTS EXAM', channel:'IELTS Advantage', ch:'advantage', category:'academic', dur:'12:00' },
  { id:'HSzJRe1SoWU', title:'Fastest Way to Get Band 9 in IELTS Writing Task 2', channel:'IELTS Advantage', ch:'advantage', category:'academic', dur:'10:43' },
  { id:'apOCnYpR-9g', title:'This BAND 9 IELTS Reading Strategy Changes Everything', channel:'IELTS Advantage', ch:'advantage', category:'academic', dur:'14:00' },
  { id:'fUGVFbFXRMo', title:'Get Band 9 After Learning These Speaking Tips', channel:'IELTS Advantage', ch:'advantage', category:'academic', dur:'15:00' },
  { id:'wx4elwrGK1I', title:'Simple Technique for Band 9 in IELTS Reading', channel:'IELTS Advantage', ch:'advantage', category:'academic', dur:'12:00' },
  { id:'OtmUQwPVLko', title:'The ONLY IELTS Reading Course You Need 2026', channel:'IELTS Advantage', ch:'advantage', category:'academic', dur:'3:12:52' },
  { id:'xGtKdsVxV8A', title:'IELTS 2026 Complete 11 Hour Course', channel:'IELTS Advantage', ch:'advantage', category:'academic', dur:'11:24:27' },
  { id:'1IVFRWCpNxE', title:'IELTS Writing Task 1 Introductions - Band 9 Lesson', channel:'IELTS Advantage', ch:'advantage', category:'academic', dur:'14:57' },
  // ── E2 IELTS ──
  { id:'Zx-JcXsbUqQ', title:'IELTS Writing Task 2 - Full Band 9 Essay', channel:'E2 IELTS', ch:'e2', category:'academic', dur:'28:15' },
  { id:'64hAFl_2PIs', title:'IELTS Speaking - Band 9 Sample', channel:'E2 IELTS', ch:'e2', category:'academic', dur:'25:30' },
  { id:'VUtUOTrJ2Kk', title:'Full IELTS Listening Test with Answers', channel:'E2 IELTS', ch:'e2', category:'academic', dur:'30:27' },
  { id:'eDg8Cu0--pM', title:'IELTS Reading - How to Find Answers Fast', channel:'E2 IELTS', ch:'e2', category:'academic', dur:'19:55' },
  { id:'82YKeI784YU', title:'IELTS Listening Tips and Tricks for Band 9', channel:'E2 IELTS', ch:'e2', category:'academic', dur:'55:00' },
  { id:'hOAsUNNyPIs', title:'IELTS Reading Tips and Strategies', channel:'E2 IELTS', ch:'e2', category:'academic', dur:'20:00' },
  { id:'Pfc81cLseAU', title:'Live IELTS Band 9 Speaking Simulation', channel:'E2 IELTS', ch:'e2', category:'academic', dur:'30:00' },
  { id:'rEfBbJ-xLKE', title:'Get an E2 Online IELTS Course Now', channel:'E2 IELTS', ch:'e2', category:'academic', dur:'8:44' },
  { id:'EzMyNhFdRYM', title:'IELTS Listening Practice Test with Answers 2025', channel:'E2 IELTS', ch:'e2', category:'academic', dur:'30:00' },
  { id:'uadjiMxu3gI', title:'IELTS Reading Practice Test with Answers - 2025 New Test', channel:'E2 IELTS', ch:'e2', category:'academic', dur:'30:00' },
];

const YT_CHANNELS = [
  { id:'bbc',      label:'BBC Learning English',     icon:'ti-flag' },
  { id:'lucy',     label:'English with Lucy',        icon:'ti-flag' },
  { id:'mmm',      label:'mmmEnglish',               icon:'ti-flag' },
  { id:'rachel',   label:"Rachel's English",          icon:'ti-flag' },
  { id:'ted',      label:'TED-Ed',                   icon:'ti-brain' },
  { id:'interactive', label:'Interactive English',   icon:'ti-message' },
  { id:'arnel',    label:"Arnel's Everyday English", icon:'ti-edit' },
  { id:'emma',     label:'Emma (EngVid)',            icon:'ti-pencil' },
  { id:'class101', label:'EnglishClass101.com',      icon:'ti-headphones' },
  { id:'alex',     label:'Alex (EngVid)',             icon:'ti-microphone' },
  { id:'duncan',   label:'English Addict (Mr Duncan)', icon:'ti-mood-smile' },
  { id:'liz',      label:'IELTS Liz',                  icon:'ti-target' },
  { id:'advantage',label:'IELTS Advantage',             icon:'ti-trophy' },
  { id:'e2',       label:'E2 IELTS',                   icon:'ti-star' },
];

const YT_CATEGORIES = [
  { id:'all',          label:'All',           icon:'ti-device-tv' },
  { id:'english',      label:'English',       icon:'ti-language' },
  { id:'grammar',      label:'Grammar',       icon:'ti-edit' },
  { id:'vocabulary',   label:'Vocabulary',    icon:'ti-book' },
  { id:'pronunciation',label:'Pronunciation', icon:'ti-microphone' },
  { id:'academic',     label:'Academic',      icon:'ti-school' },
  { id:'literature',   label:'Literature',    icon:'ti-books' },
];

let ytFilterCat = 'all';
let ytFilterCh = 'all';
let ytLoaded = false;
let ytCurrentVideoId = null;
let ytSearchTimeout = null;

function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

YT_VIDEOS.forEach(v => { v.slug = makeSlug(v.title); });

const VIDEOS_BY_SLUG = {};
YT_VIDEOS.forEach(v => { VIDEOS_BY_SLUG[v.slug] = v; });

function shuffle(a) { for (let i=a.length-1; i>0; i--) { let j=Math.random()*(i+1)|0; [a[i],a[j]]=[a[j],a[i]]; } return a; }

function getVideos() {
  let v = YT_VIDEOS;
  if (ytFilterCh !== 'all') v = v.filter(x => x.ch === ytFilterCh);
  if (ytFilterCat !== 'all') v = v.filter(x => x.category === ytFilterCat);
  const chOrder = {};
  YT_CHANNELS.forEach((c, i) => { chOrder[c.id] = i; });
  return [...v].sort((a, b) => {
    const ca = (chOrder[a.ch] ?? 999) - (chOrder[b.ch] ?? 999);
    if (ca !== 0) return ca;
    return a.title.localeCompare(b.title);
  });
}

const YT_HTML = `<div class="yt-hero">
  <div class="yt-hero-icon"><i class="ti ti-device-tv"></i></div>
  <div class="yt-hero-text">
    <h2 class="yt-hero-title">StudyTube</h2>
    <p class="yt-hero-subtitle">Curated educational English videos</p>
  </div>
  <div class="yt-hero-stats" id="yt-hero-stats"></div>
</div>
<div class="youtube-container">
  <div class="yt-toolbar">
    <div class="yt-search-wrap">
      <input type="text" id="yt-search-input" class="yt-search-input" placeholder="Search videos..." />
      <button class="yt-search-btn" onclick="ytDoSearch()" title="Search"><i class="ti ti-search"></i></button>
    </div>
    <button class="yt-ytb-btn" onclick="ytSearchYouTube()" title="Search on YouTube"><i class="ti ti-brand-youtube"></i> YouTube</button>
  </div>
  <div class="yt-section-label">Category</div>
  <div class="yt-pills" id="yt-cat-pills"></div>
  <div class="yt-section-label">Channel</div>
  <div class="yt-pills" id="yt-ch-pills"></div>
  <div class="yt-video-grid" id="yt-video-grid"></div>
  <div class="yt-player-overlay" id="yt-player-overlay" onclick="if(event.target===this)ytClosePlayer()">
    <div class="yt-player-modal" onclick="event.stopPropagation()">
      <div class="yt-player-header">
        <button class="yt-back-btn" onclick="ytClosePlayer()"><i class="ti ti-arrow-left"></i> Back to StudyTube</button>
        <span style="flex:1"></span>
        <button class="yt-close-btn" onclick="ytClosePlayer()"><i class="ti ti-x"></i></button>
      </div>
      <div class="yt-player-wrap" id="yt-player-wrap"></div>
      <div class="yt-player-footer">
        <a id="yt-watch-link" href="#" target="_blank" rel="noopener" class="yt-watch-btn"><i class="ti ti-brand-youtube"></i> Watch on YouTube</a>
      </div>
    </div>
  </div>
</div>`;

function ytNav(cat, ch) {
  if (cat) {
    ytFilterCat = cat;
    if (typeof Router !== 'undefined') {
      const basePath = '/learn/youtube';
      const path = cat === 'all' ? basePath : basePath + '/' + cat;
      Router.replaceHash(path);
    } else {
      const hash = cat === 'all' ? '#/learn/youtube' : '#/learn/youtube/' + cat;
      history.replaceState({ page: 'youtube', sub: cat }, '', hash);
    }
  }
  if (ch) {
    ytFilterCh = ch;
    if (typeof Router !== 'undefined') {
      const basePath = '/learn/youtube';
      const path = ch === 'all' ? basePath : basePath + '/ch:' + ch;
      Router.replaceHash(path);
    } else {
      const hash = ch === 'all' ? '#/learn/youtube' : '#/learn/youtube/ch:' + ch;
      history.replaceState({ page: 'youtube', sub: 'ch:' + ch }, '', hash);
    }
  }
  ytRebuild();
}

function buildPills() {
  const catEl = document.getElementById('yt-cat-pills');
  catEl.innerHTML = YT_CATEGORIES.map(c =>
    `<button class="yt-pill${c.id===ytFilterCat?' active':''}" onclick="ytNav('${c.id}')"><i class="ti ${c.icon}"></i> ${c.label}</button>`
  ).join('');

  const chEl = document.getElementById('yt-ch-pills');
  chEl.innerHTML = `<button class="yt-pill${ytFilterCh==='all'?' active':''}" onclick="ytNav(null,'all')"><i class="ti ti-globe"></i> All Channels</button>` +
    YT_CHANNELS.map(c =>
      `<button class="yt-pill${c.id===ytFilterCh?' active':''}" onclick="ytNav(null,'${c.id}')"><i class="ti ${c.icon}"></i> ${c.label}</button>`
    ).join('');
}

function updateHeroStats() {
  const el = document.getElementById('yt-hero-stats');
  if (!el) return;
  const chCount = YT_CHANNELS.length;
  const vidCount = YT_VIDEOS.length;
  const catCount = YT_CATEGORIES.length - 1;
  el.innerHTML =
    `<span class="yt-hero-stat"><span class="yt-hero-stat-num">${vidCount}</span> videos</span>` +
    `<span class="yt-hero-stat"><span class="yt-hero-stat-num">${chCount}</span> channels</span>` +
    `<span class="yt-hero-stat"><span class="yt-hero-stat-num">${catCount}</span> categories</span>`;
}

function ytRebuild() {
  ytFilterCat = ytFilterCat || 'all';
  ytFilterCh = ytFilterCh || 'all';
  updateHeroStats();
  buildPills();
  renderGrid();
}

function buildCard(v) {
  const ch = YT_CHANNELS.find(c => c.id === v.ch);
  const cat = YT_CATEGORIES.find(c => c.id === v.category);
  const chIcon = ch ? ch.icon : 'ti-device-tv';
  const chIconHtml = ch ? '<i class="ti ' + ch.icon + '"></i> ' : '';
  const catIconHtml = cat ? '<i class="ti ' + cat.icon + '"></i> ' : '';
  const div = document.createElement('div');
  div.className = 'yt-card';
  div.innerHTML = `<div class="yt-card-thumb">
    <img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="" loading="lazy" onerror="this.style.display='none';this.parentNode.dataset.fallback='${chIcon}'" />
    <span class="yt-dur">${v.dur}</span>
    <div class="yt-play-badge"><i class="ti ti-player-play-filled"></i></div>
  </div>
  <div class="yt-card-body">
    <div class="yt-card-title">${escHtml(v.title)}</div>
    <div class="yt-card-meta">
      <span class="yt-card-ch">${chIconHtml}${escHtml(v.channel)}</span>
      <span class="yt-card-cat">${catIconHtml}${cat?cat.label:''}</span>
    </div>
  </div>`;
  div.addEventListener('click', () => {
    if (typeof Router !== 'undefined') {
      Router.navigate('/learn/youtube/video/' + v.slug);
    } else {
      ytPlay(v.id);
    }
  });
  return div;
}

function renderGrid(searchResults) {
  const grid = document.getElementById('yt-video-grid');
  if (!grid) return;
  const videos = searchResults || getVideos();
  if (!videos.length) {
    grid.innerHTML = `<div class="yt-empty">No videos found. <a href="#" onclick="ytSearchYouTube();return false">Search on YouTube →</a></div>`;
    return;
  }
  grid.innerHTML = '';
  if (searchResults || ytFilterCh !== 'all' || ytFilterCat !== 'all') {
    videos.forEach((v, i) => {
      const card = buildCard(v);
      card.style.animationDelay = (i * 0.025) + 's';
      grid.appendChild(card);
    });
  } else {
    const byChannel = {};
    videos.forEach(v => {
      if (!byChannel[v.ch]) byChannel[v.ch] = [];
      byChannel[v.ch].push(v);
    });
    const order = YT_CHANNELS.map(c => c.id).filter(id => byChannel[id]);
    let globalIdx = 0;
    order.forEach(ch => {
      const info = YT_CHANNELS.find(c => c.id === ch);
      const sec = document.createElement('div');
      sec.className = 'yt-section';
      sec.innerHTML = `<div class="yt-section-header"><span class="yt-section-name"><i class="ti ${info.icon}"></i> ${escHtml(info.label)}</span><span class="yt-section-count">${byChannel[ch].length} video${byChannel[ch].length !== 1 ? 's' : ''}</span></div><div class="yt-video-grid"></div>`;
      const inner = sec.lastElementChild;
      byChannel[ch].forEach((v, i) => {
        const card = buildCard(v);
        card.style.animationDelay = (globalIdx++ * 0.025) + 's';
        inner.appendChild(card);
      });
      grid.appendChild(sec);
    });
  }
}

function ytDoSearch() {
  const q = document.getElementById('yt-search-input').value.trim().toLowerCase();
  if (!q) { renderGrid(); return; }
  const results = YT_VIDEOS.filter(v =>
    v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q)
  );
  if (results.length) { renderGrid(results); return; }
  const grid = document.getElementById('yt-video-grid');
  grid.innerHTML = `<div class="yt-empty">No results for "<strong>${escHtml(q)}</strong>".
    <a href="#" onclick="ytSearchYouTube('${escHtml(q)}');return false">Search on YouTube →</a></div>`;
}

function ytSearchYouTube(query) {
  const q = query || document.getElementById('yt-search-input').value.trim();
  if (!q) { document.getElementById('yt-search-input').focus(); return; }
  window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(q + ' english lesson'), '_blank');
}

function ytPlay(videoId) {
  ytCurrentVideoId = videoId;
  const overlay = document.getElementById('yt-player-overlay');
  const wrap = document.getElementById('yt-player-wrap');
  const link = document.getElementById('yt-watch-link');
  if (!overlay || !wrap) return;
  if (link) link.href = 'https://www.youtube.com/watch?v=' + videoId;
  wrap.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.setAttribute('src', 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('referrerpolicy', 'origin');
  iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%';
  wrap.appendChild(iframe);
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Update URL hash for deep linking (e.g., #/learn/youtube/watch/QxQUapA-2w4)
  if (typeof Router !== 'undefined') {
    Router.replaceHash('/learn/youtube/watch/' + videoId);
  } else {
    history.replaceState({ page: 'youtube', sub: 'watch/' + videoId, videoId }, '', '#/learn/youtube/watch/' + videoId);
  }
}

function ytClosePlayer(silent) {
  const overlay = document.getElementById('yt-player-overlay');
  const wrap = document.getElementById('yt-player-wrap');
  if (overlay) overlay.classList.remove('active');
  if (wrap) wrap.innerHTML = '';
  document.body.style.overflow = '';
  ytCurrentVideoId = null;
  if (!silent) {
    if (typeof Router !== 'undefined') {
      Router.replaceHash('/learn/youtube');
    } else {
      history.replaceState({ page: 'youtube', sub: null }, '', '#/learn/youtube');
    }
  }
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function loadYoutubeContent() {
  return new Promise(resolve => {
    if (ytLoaded) { resolve(); return; }
    const page = document.getElementById('page-youtube');
    if (!page) { resolve(); return; }
    page.innerHTML = YT_HTML;
    ytLoaded = true;
    attachYt();
    resolve();
  });
}

function attachYt() {
  ytRebuild();
  const input = document.getElementById('yt-search-input');
  if (input) {
    input.addEventListener('input', () => {
      clearTimeout(ytSearchTimeout);
      ytSearchTimeout = setTimeout(ytDoSearch, 300);
    });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') ytDoSearch(); });
  }
  document.addEventListener('keydown', function ytEsc(e) {
    if (e.key === 'Escape') {
      const o = document.getElementById('yt-player-overlay');
      if (o && o.classList.contains('active')) ytClosePlayer();
    }
  });
}

const VR_HTML = `<div class="yt-video-page">
  <div class="yt-vp-back-row">
    <button class="yt-vp-back-btn" onclick="ytVideoPageBack()"><i class="ti ti-arrow-left"></i> Back to StudyTube</button>
  </div>
  <div class="yt-vp-player-wrap">
    <iframe id="yt-vp-iframe" src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="origin"></iframe>
  </div>
  <div class="yt-vp-info">
    <h1 class="yt-vp-title" id="yt-vp-title"></h1>
    <div class="yt-vp-meta-row" id="yt-vp-meta"></div>
    <div class="yt-vp-actions">
      <a id="yt-vp-watch-link" href="#" target="_blank" rel="noopener" class="yt-vp-watch-btn"><i class="ti ti-brand-youtube"></i> Watch on YouTube</a>
    </div>
  </div>
  <div class="yt-vp-related">
    <div class="yt-vp-related-title">Related Videos</div>
    <div class="yt-video-grid" id="yt-vp-related-grid"></div>
  </div>
</div>`;

function renderYoutubeVideo(slug) {
  ytClosePlayer(true);
  const video = VIDEOS_BY_SLUG[slug];
  if (!video) {
    const page = document.getElementById('page-video');
    if (page) page.innerHTML = '<div class="yt-empty" style="padding:80px 20px">Video not found. <a href="#/learn/youtube" onclick="Router.navigate(\'/learn/youtube\');return false"><i class="ti ti-arrow-left"></i> Back to StudyTube</a></div>';
    return;
  }
  const page = document.getElementById('page-video');
  if (!page) return;
  page.innerHTML = VR_HTML;

  const iframe = document.getElementById('yt-vp-iframe');
  if (iframe) iframe.src = 'https://www.youtube-nocookie.com/embed/' + video.id + '?autoplay=1&rel=0';

  const titleEl = document.getElementById('yt-vp-title');
  if (titleEl) titleEl.textContent = video.title;

  const ch = YT_CHANNELS.find(c => c.id === video.ch);
  const cat = YT_CATEGORIES.find(c => c.id === video.category);

  const metaEl = document.getElementById('yt-vp-meta');
  if (metaEl) {
    metaEl.innerHTML =
      '<span class="yt-vp-meta-item yt-vp-channel">' + (ch ? '<i class="ti ' + ch.icon + '"></i> ' : '') + escHtml(video.channel) + '</span>' +
      '<span class="yt-vp-meta-item yt-vp-dur"><i class="ti ti-clock"></i> ' + video.dur + '</span>' +
      (cat ? '<span class="yt-vp-meta-item yt-vp-cat"><i class="ti ' + cat.icon + '"></i> ' + cat.label + '</span>' : '');
  }

  const link = document.getElementById('yt-vp-watch-link');
  if (link) link.href = 'https://www.youtube.com/watch?v=' + video.id;

  const related = YT_VIDEOS.filter(r => r.id !== video.id && (r.ch === video.ch || r.category === video.category));
  const shuffled = shuffle(related).slice(0, 8);
  const grid = document.getElementById('yt-vp-related-grid');
  if (grid) {
    grid.innerHTML = '';
    shuffled.forEach(r => grid.appendChild(buildCard(r)));
  }

  document.title = video.title + ' - StudyTube';
}

function ytVideoPageBack() {
  if (typeof Router !== 'undefined') {
    Router.navigate('/learn/youtube');
  } else {
    showPage('youtube');
  }
}

function renderYoutube(category, channel) {
  loadYoutubeContent().then(() => {
    // Check if category is a direct video ID (from #/learn/youtube/watch/videoId legacy)
    if (category && YT_VIDEOS.some(v => v.id === category)) {
      const video = YT_VIDEOS.find(v => v.id === category);
      if (video && typeof Router !== 'undefined') {
        Router.navigate('/learn/youtube/video/' + video.slug);
      } else {
        ytPlay(category);
      }
      return;
    }
    // Close any open player when navigating to listing
    ytClosePlayer(true);
    document.title = 'StudyTube - VocabMaster AI';
    if (category) {
      if (category.startsWith('ch:')) {
        ytFilterCh = category.slice(3);
        ytFilterCat = 'all';
      } else {
        ytFilterCat = category;
        ytFilterCh = ytFilterCh || 'all';
      }
    }
    if (channel) ytFilterCh = channel;
    ytRebuild();
  });
}
