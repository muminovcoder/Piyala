// =============================================
// GRAMMAR SYSTEM — TENSE DATA
// =============================================
// Premium SVG icon system — inline, zero HTTP requests
const ICON = {
  dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><path d="M6 16l4-8 4 4 4-6"/></svg>',
  medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>',
  brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4a4 4 0 0 0-3.5 2.1A4.5 4.5 0 0 0 4.5 10.5a4.5 4.5 0 0 0 0 9h12a4.5 4.5 0 0 0 0-9A4 4 0 0 0 12 4z"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4"/><path d="M12 9v5"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  fire: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
  volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
  reload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3v6h-6"/><path d="M3 21v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L21 6M3 18l2.64 2.36A9 9 0 0 0 20.49 15"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 9 6 9 9"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 15 6 15 9"/><path d="M6 9h12v2a6 6 0 0 1-12 0V9z"/><path d="M12 15v4"/><path d="M8 21h8"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
};
function ic(name, size) { const s = size || 18; return '<span class="g-ic-svg" style="width:'+s+'px;height:'+s+'px">'+ICON[name]+'</span>'; }

const GRAMMAR_TENSES = [
  { id:'present-simple', name:'Present Simple', group:'Present Tenses', icon:'☀️',
    formula:'Subject + base verb (add -s/-es for he/she/it)',
    beginner:'Used for facts, habits, and routines. Example: "The sun rises in the east."',
    advanced:'Used for timeless statements, scheduled events, and narrative present in storytelling.',
    ielts:'Essential for describing trends in Task 1 (e.g., "The graph shows...") and giving opinions in Task 2.',
    sat:'Tests subject-verb agreement and correct verb form in present contexts.',
    academic:'Used in research papers to state established facts: "The theory suggests..."',
    positive:['I walk to work every day.','She reads the news every morning.','They live in London.','The Earth orbits the Sun.','The store opens at 9 AM.','Water boils at 100°C.','He plays the guitar beautifully.','Cats chase mice.','The bus arrives at noon.','I always drink coffee in the morning.'],
    negative:['I do not (don\'t) like coffee.','He does not (doesn\'t) speak Spanish.','We do not (don\'t) own a car.','She does not (doesn\'t) eat meat.','They do not (don\'t) watch TV very often.','It does not (doesn\'t) rain much here.','I don\'t understand this question.','She doesn\'t go to the gym.'],
    question:['Do you enjoy cooking?','Does she work here?','What time does the train arrive?','How often do you visit your parents?','Does he play any sports?','Do they live nearby?','Where do you usually buy groceries?'],
    mistakes:[{wrong:'He go to school every day.',correct:'He goes to school every day.'},{wrong:'She don\'t like pizza.',correct:'She doesn\'t like pizza.'},{wrong:'Does he works here?',correct:'Does he work here?'},{wrong:'The train leave at 6 PM.',correct:'The train leaves at 6 PM.'},{wrong:'He doesn\'t knows the answer.',correct:'He doesn\'t know the answer.'},{wrong:'She go to bed late.',correct:'She goes to bed late.'}],
    timeExpressions:['always','usually','often','sometimes','rarely','never','every day','on Mondays','once a week','from time to time','as a rule','generally','frequently','every morning','twice a month','seldom','occasionally','daily'],
    usage:['Habits & routines','General facts & truths','Scheduled events (timetables)','Narrative present','Instructions & directions','State verbs (know, believe, own)'],
    tips:'Remember: "s/es" qo\'shiladi faqat He/She/It bilan. "Does" bilan fe\'l o\'zgarmaydi.',
    compare:{with:'present-continuous',note:'Present Simple doimiy harakatlar va faktlar uchun, Present Continuous esa ayni paytda bo\'layotgan ish-harakatlar uchun.'}
  },
  { id:'present-continuous', name:'Present Continuous', group:'Present Tenses', icon:'🔄',
    formula:'Subject + am/is/are + verb(-ing)',
    beginner:'Used for actions happening NOW or around now. Example: "I am reading a book."',
    advanced:'Describes temporary situations, ongoing projects, and future arrangements.',
    ielts:'Use for describing current trends: "The number of students is increasing rapidly."',
    sat:'Tests understanding of ongoing vs. habitual actions.',
    academic:'Common in introductions: "This paper is examining the effects of..."',
    positive:['I am studying for my exam.','She is working on a project.','They are building a new school.','The population is growing steadily.','He is currently writing a novel.','We are looking for a new apartment.','The kids are playing in the garden.','I am reading a great book these days.'],
    negative:['He is not (isn\'t) sleeping right now.','We are not (aren\'t) going to the party.','She is not (isn\'t) working these days.','I am not (aren\'t) feeling well today.','They are not (aren\'t) coming to dinner.','The machine is not working properly.'],
    question:['Are you listening to me?','What is she doing at the moment?','Why are you crying?','Is he coming to the meeting tomorrow?','Are they staying at a hotel?','What are you doing this weekend?'],
    mistakes:[{wrong:'I am go to school now.',correct:'I am going to school now.'},{wrong:'She is work here forever.',correct:'She works here forever. (stative)'},{wrong:'He is knowing the answer.',correct:'He knows the answer.'},{wrong:'Look! It rains outside.',correct:'Look! It is raining outside.'},{wrong:'I am understanding the lesson.',correct:'I understand the lesson.'}],
    timeExpressions:['now','right now','at the moment','today','this week','currently','these days','this month','still','look!','listen!','as we speak','tonight','this semester','this year','for now'],
    usage:['Actions happening now','Temporary situations','Future arrangements','Changing situations','Annoying habits (with "always")','Trends & developments'],
    tips:'"Now" so\'zini qo\'shib tekshir: gapga "now" mos kelsa → Present Continuous. Stative fe\'llar (know, like, believe) Continuous bo\'lmaydi!',
    compare:{with:'present-simple',note:'Present Simple odat va faktlar, Present Continuous esa hozirgi paytda davom etayotgan harakatlar uchun.'}
  },
  { id:'present-perfect', name:'Present Perfect', group:'Present Tenses', icon:'⭐',
    formula:'Subject + have/has + past participle',
    beginner:'Connects the past to the present. Example: "I have visited Paris." (experience, no time specified)',
    advanced:'Used for past actions with present relevance, life experiences, unfinished time periods.',
    ielts:'Vital for discussing changes: "There has been a significant increase..."',
    sat:'Frequently tested with "since" and "for" time expressions.',
    academic:'Essential in literature reviews: "Researchers have studied this phenomenon for decades."',
    positive:['I have finished my homework.','She has travelled to 20 countries.','They have lived here for five years.','We have already seen that movie.','He has just arrived.','Scientists have discovered a new species.','I have known her since childhood.','The rain has stopped.'],
    negative:['He has not (hasn\'t) seen that movie.','We have not (haven\'t) received the email yet.','She has never been abroad.','I have not (haven\'t) finished my report yet.','They haven\'t confirmed the date.','He has never eaten sushi.'],
    question:['Have you ever been to Japan?','Has she called you yet?','How long have you known him?','Have they arrived yet?','Have you ever tried bungee jumping?','What have you done today?'],
    mistakes:[{wrong:'I have went to the store.',correct:'I have gone to the store.'},{wrong:'She has saw that film.',correct:'She has seen that film.'},{wrong:'I have visited Paris last year.',correct:'I visited Paris last year.'},{wrong:'He has came back home.',correct:'He has come back home.'},{wrong:'I have been to New York yesterday.',correct:'I went to New York yesterday.'}],
    timeExpressions:['ever','never','already','yet','just','since','for','so far','recently','up to now','lately','in the last few days','once','twice','several times','this week','today'],
    usage:['Life experiences','Unfinished past actions','Past with present relevance','Change over time','Achievements','News & announcements'],
    tips:'Aniq vaqt (yesterday, last year, in 2020) bo\'lsa → Present Perfect EMAS, Past Simple ishlatiladi!',
    compare:{with:'past-simple',note:'Present Perfect — aniq vaqtsiz, natija hozirga bog\'liq. Past Simple — aniq vaqt bilan, tugallangan o\'tmish.'}
  },
  { id:'present-perfect-continuous', name:'Present Perfect Continuous', group:'Present Tenses', icon:'⏱️',
    formula:'Subject + have/has + been + verb(-ing)',
    beginner:'Shows an action that started in the past and continues to now. Example: "I have been studying for three hours."',
    advanced:'Emphasizes the duration of an ongoing action that may or may not be complete.',
    ielts:'Use to emphasise duration: "People have been waiting for better infrastructure."',
    sat:'Tests understanding of duration-focused present perfect vs. result-focused.',
    academic:'Used to describe ongoing research: "Scientists have been investigating this for years."',
    positive:['I have been working all day.','She has been learning Japanese for two years.','They have been waiting since 9 AM.','He has been exercising regularly lately.','We have been living here since 2020.','It has been raining all morning.','You have been watching TV for hours!'],
    negative:['He has not (hasn\'t) been feeling well lately.','We have not (haven\'t) been sleeping enough.','She has not (hasn\'t) been studying consistently.','I haven\'t been sleeping well recently.','They haven\'t been getting along.'],
    question:['Have you been waiting long?','How long has she been studying here?','What have you been doing since I last saw you?','Has it been raining all day?','Have you been working out lately?'],
    mistakes:[{wrong:'I have been work here for 3 years.',correct:'I have been working here for 3 years.'},{wrong:'She has been knowing him for years.',correct:'She has known him for years.'},{wrong:'He has been gone to the gym.',correct:'He has been going to the gym.'},{wrong:'I have been studied all morning.',correct:'I have been studying all morning.'}],
    timeExpressions:['for','since','all day','recently','lately','how long','this week','the whole morning','all morning','over the past few days','the entire day','all night','for hours'],
    usage:['Actions continuing to present','Emphasising duration','Recent actions with visible results','Temporary situations leading to present','Expressing frustration about ongoing situations'],
    tips:'"How long?" so\'roq\'iga javob bersa → Present Perfect Continuous. Natija emas, davomiylik muhim!',
    compare:{with:'present-perfect',note:'Present Perfect — natija (I have finished). Present Perfect Continuous — davomiylik (I have been working for 2 hours).'}
  },
  { id:'past-simple', name:'Past Simple', group:'Past Tenses', icon:'📖',
    formula:'Subject + past tense verb (regular: -ed / irregular)',
    beginner:'Used for completed actions in the past. Example: "I visited London last year."',
    advanced:'For finished past actions with no connection to present. Sequence of past events.',
    ielts:'Essential for describing past data in Task 1 and past experiences in Speaking Part 2.',
    sat:'Frequently tested with time markers like "yesterday", "ago", "last week".',
    academic:'Standard for describing methodology: "The participants completed the survey."',
    positive:['I walked to school yesterday.','She bought a new car last week.','They visited the museum.','He graduated from university in 2020.','We had dinner at a nice restaurant last night.','The company launched its product in 2023.','She wrote a beautiful poem.','I saw him at the park.'],
    negative:['I did not (didn\'t) see him at the party.','She did not (didn\'t) finish her homework.','We did not (didn\'t) go on vacation last summer.','He did not (didn\'t) attend the meeting.','They didn\'t like the movie.','I didn\'t know that.'],
    question:['Did you enjoy the movie?','Where did they go on vacation?','When did she arrive?','Why did you leave early?','Did he call you back?','What time did the meeting start?'],
    mistakes:[{wrong:'I go to the park yesterday.',correct:'I went to the park yesterday.'},{wrong:'She didn\'t went to school.',correct:'She didn\'t go to school.'},{wrong:'Did you saw him?',correct:'Did you see him?'},{wrong:'He was borned in 1995.',correct:'He was born in 1995.'},{wrong:'I didn\'t knew her.',correct:'I didn\'t know her.'},{wrong:'She writed a letter.',correct:'She wrote a letter.'}],
    timeExpressions:['yesterday','last night','last week','ago','in 2020','when','then','after that','in 1998','the day before yesterday','once upon a time','earlier','previously','back then','in the past','long ago','just now'],
    usage:['Completed past actions','Past habits','Sequence of past events','Past states','Historical events','Past routines'],
    tips:'Irregular fe\'llar ro\'yxatini yod oling! "Did" bilan ishlatilganda fe\'l base formada bo\'ladi (didn\'t go, did you see).',
    compare:{with:'present-perfect',note:'Past Simple — aniq vaqt (yesterday, in 2020). Present Perfect — vaqtsiz, hozirga bog\'liq.'}
  },
  { id:'past-continuous', name:'Past Continuous', group:'Past Tenses', icon:'🎞️',
    formula:'Subject + was/were + verb(-ing)',
    beginner:'Shows an action in progress at a specific time in the past. Example: "I was watching TV at 8 PM."',
    advanced:'Used for interrupted past actions and background scenes in storytelling.',
    ielts:'Great for setting scenes in Speaking Part 2: "I was walking down the street when..."',
    sat:'Tests understanding of ongoing past actions vs. completed ones.',
    academic:'Used in narratives and case studies: "The patient was experiencing symptoms."',
    positive:['I was reading when you called.','They were playing football at 5 PM.','She was cooking dinner while he was working.','We were travelling across Europe last summer.','The sun was shining brightly.','He was driving home when he saw the accident.'],
    negative:['She was not (wasn\'t) sleeping when I arrived.','We were not (weren\'t) listening to the teacher.','I was not (wasn\'t) paying attention during the lecture.','They weren\'t talking to each other.','He wasn\'t wearing a seatbelt.'],
    question:['What were you doing at midnight?','Was she working when you visited?','Were they laughing at something?','What was he saying when the phone rang?','Were you sleeping when I called?'],
    mistakes:[{wrong:'I was work when she called.',correct:'I was working when she called.'},{wrong:'They were play football yesterday at 3.',correct:'They were playing football yesterday at 3.'},{wrong:'When she arrived, he sleeped.',correct:'When she arrived, he was sleeping.'},{wrong:'She was cook dinner.',correct:'She was cooking dinner.'}],
    timeExpressions:['at 5 PM','when','while','as','all evening','at that time','during','throughout','at midnight','at this time yesterday','constantly','all afternoon','the whole evening'],
    usage:['Interrupted past actions','Background in stories','Parallel past actions','Polite requests','Atmospheric description in narratives'],
    tips:'"When" (qisqa harakat) + Past Simple, "while" (uzoq harakat) + Past Continuous. Storytellingda fon uchun ishlatiladi!',
    compare:{with:'past-simple',note:'Past Simple — tugallangan harakat (I watched). Past Continuous — davom etgan harakat (I was watching).'}
  },
  { id:'past-perfect', name:'Past Perfect', group:'Past Tenses', icon:'◀️',
    formula:'Subject + had + past participle',
    beginner:'Shows which of two past actions happened first. Example: "When I arrived, she had already left."',
    advanced:'Clarifies the sequence of past events, often used in reported speech and narratives.',
    ielts:'Use to show chronological clarity in Task 1: "By 2010, the number had doubled."',
    sat:'Common in "had done...when/before..." constructions.',
    academic:'Vital for literature reviews: "Earlier studies had found contradictory results."',
    positive:['I had finished eating before she arrived.','They had already left when we got there.','She had studied English before she moved to London.','The movie had already started when we entered the cinema.','By 2010, the company had expanded globally.','He had never flown before that trip.'],
    negative:['She had not (hadn\'t) completed the work by the deadline.','I had not (hadn\'t) seen him before that day.','They had never travelled abroad until last year.','He hadn\'t eaten anything all day.','We hadn\'t met before the conference.'],
    question:['Had you ever visited London before that trip?','What had she done before the meeting?','Had they finished the project before the deadline?','Had he already left when you called?'],
    mistakes:[{wrong:'When she arrived, I already left.',correct:'When she arrived, I had already left.'},{wrong:'I had went before you called.',correct:'I had gone before you called.'},{wrong:'She told me she has finished.',correct:'She told me she had finished.'},{wrong:'They already ate when we came.',correct:'They had already eaten when we came.'}],
    timeExpressions:['already','by the time','before','after','until then','never...before','when','once','as soon as','by 2010','prior to','just','by the end of'],
    usage:['Earlier past action','Sequence clarification','Reported speech','Third conditional','Regret about past','Explaining past cause & effect'],
    tips:'Ikkita o\'tmish harakatidan oldingisini aytish uchun ishlatiladi. Agar vaqt tartibi aniq bo\'lsa, Past Perfect shart emas (after, before bilan).',
    compare:{with:'past-simple',note:'Past Perfect — o\'tmishdagi boshqa harakatdan oldin bo\'lgan. Past Simple — keyin yoki mustaqil.'}
  },
  { id:'past-perfect-continuous', name:'Past Perfect Continuous', group:'Past Tenses', icon:'↩️',
    formula:'Subject + had + been + verb(-ing)',
    beginner:'Shows a long action that happened before another past action. Example: "I had been waiting for hours when she finally arrived."',
    advanced:'Emphasizes the duration of an action that occurred before another past event.',
    ielts:'Used to emphasise prolonged past situations: "The company had been struggling for years before the takeover."',
    sat:'Tests cause-effect relationships in past time frames.',
    academic:'Used to describe processes: "The system had been operating for decades before the upgrade."',
    positive:['I had been working for three hours when she called.','They had been travelling all day before they arrived.','She had been studying for months before the exam.','The ground was wet because it had been raining all night.','He had been teaching for 20 years before he retired.'],
    negative:['She had not (hadn\'t) been feeling well before the exam.','They had not (hadn\'t) been living there long before they moved.','I hadn\'t been sleeping well before the trip.','He hadn\'t been working there long when he got promoted.'],
    question:['How long had you been studying before the test?','Had she been waiting long?','What had they been doing before the accident happened?','How long had he been working there before he quit?'],
    mistakes:[{wrong:'I had been work for 2 hours when she arrived.',correct:'I had been working for 2 hours when she arrived.'},{wrong:'He had been knowing her for years before they married.',correct:'He had known her for years before they married.'},{wrong:'She was tired because she was working all day.',correct:'She was tired because she had been working all day.'}],
    timeExpressions:['for','since','before','until','how long','all day','by the time','the whole week','for hours','all night long','for months','for years'],
    usage:['Duration before past event','Cause of past situation','Background past actions','Past visible results','Emphasising prolonged effort'],
    tips:'O\'tmishdagi bir harakatning boshqasidan oldin qancha davom etganini ko\'rsatadi. Natija emas, davomiylik muhim!',
    compare:{with:'past-perfect',note:'Past Perfect — natija (had finished). Past Perfect Continuous — davomiylik (had been working for hours).'}
  },
  { id:'future-simple', name:'Future Simple (Will)', group:'Future Tenses', icon:'🔭',
    formula:'Subject + will + base verb',
    beginner:'Used for predictions, promises, and spontaneous decisions. Example: "I will help you."',
    advanced:'Expresses future facts, promises, offers, and predictions based on opinion.',
    ielts:'Essential for predictions in Task 1 and expressing future plans in Speaking.',
    sat:'Tests "will" vs. "going to" distinctions.',
    academic:'Used for implications and future research: "This finding will inform future studies."',
    positive:['I will call you tomorrow.','She will arrive at 6 PM.','They will win the competition.','The conference will take place in March.','I will always love you.','The weather will be sunny tomorrow.','I will get you a coffee.'],
    negative:['I will not (won\'t) forget your kindness.','He will not (won\'t) attend the meeting.','We will not (won\'t) accept late submissions.','She will not (won\'t) change her mind.','They won\'t agree to the terms.','I won\'t be late.'],
    question:['Will you come to the party?','What time will she arrive?','Will they be able to finish on time?','Who will take care of the arrangements?','Will you help me with this?'],
    mistakes:[{wrong:'I will to call you later.',correct:'I will call you later.'},{wrong:'She will not goes to school tomorrow.',correct:'She will not go to school tomorrow.'},{wrong:'I will see her and then I will tell you.',correct:'I will see her and then I\'ll tell you.'},{wrong:'He will can do it.',correct:'He will be able to do it.'}],
    timeExpressions:['tomorrow','next week','soon','later','in the future','tonight','next year','next month','one day','someday','probably','definitely','I think','I promise','I guess','maybe'],
    usage:['Predictions','Spontaneous decisions','Promises & offers','Future facts','Willingness','Requests & invitations'],
    tips:'"Will" da fe\'l hech qachon -s, -ed, -ing olmaydi! "Be going to" bilan adashtirmang: "going to" — reja, "will" — on the spot qaror.',
    compare:{with:'future-continuous',note:'Future Simple — bir martalik kelajak harakati (I will call). Future Continuous — kelajakda davom etadigan harakat (I will be waiting).'}
  },
  { id:'future-continuous', name:'Future Continuous', group:'Future Tenses', icon:'⏩',
    formula:'Subject + will + be + verb(-ing)',
    beginner:'Shows an action that will be in progress at a future time. Example: "I will be sleeping at midnight."',
    advanced:'For future arrangements and actions that will be ongoing at a specific future moment.',
    ielts:'Use to describe future trends: "More people will be working remotely."',
    sat:'Tests ability to express ongoing future actions.',
    academic:'Used for predictions about ongoing processes: "Future studies will be examining..."',
    positive:['I will be waiting for you at the station.','She will be working on the project all week.','This time next year, we will be living in a new house.','They will be flying to Paris at 10 AM.','He will be giving a presentation at 3 PM.','We will be celebrating our anniversary.'],
    negative:['I will not (won\'t) be attending the meeting.','They won\'t be travelling next week.','She will not (won\'t) be staying long.','He won\'t be joining us for dinner.','We won\'t be needing that anymore.'],
    question:['Will you be using the car tonight?','What will she be doing at 8 PM?','How long will you be staying?','Will they be attending the conference?'],
    mistakes:[{wrong:'I will be wait for you.',correct:'I will be waiting for you.'},{wrong:'She will be works tomorrow.',correct:'She will be working tomorrow.'},{wrong:'Will you join the meeting? (casual)',correct:'Will you be joining the meeting? (polite)'},{wrong:'They will be go there.',correct:'They will be going there.'}],
    timeExpressions:['at 8 PM','this time tomorrow','next week','soon','in the future','all day tomorrow','by then','this time next year','this time next month','meanwhile'],
    usage:['Actions in progress at future time','Future arrangements','Polite inquiries','Predicting the present','Parallel future actions'],
    tips:'"This time tomorrow..." deya boshlasangiz → Future Continuous. "Will you be -ing?" — politer so\'roq shakli.',
    compare:{with:'future-simple',note:'Future Simple — qaror yoki va\'da. Future Continuous — kelajakda davom etadigan jarayon.'}
  },
  { id:'future-perfect', name:'Future Perfect', group:'Future Tenses', icon:'🎯',
    formula:'Subject + will + have + past participle',
    beginner:'Shows an action that will be completed before a future time. Example: "I will have finished by 6 PM."',
    advanced:'Emphasizes completion of an action before a specific future deadline.',
    ielts:'High band structure: "By 2030, the population will have reached 9 billion."',
    sat:'Tests complex future time relationships.',
    academic:'Used for projections: "The project will have been completed by Q3."',
    positive:['I will have finished the report by Friday.','She will have graduated by next year.','By the time you arrive, we will have eaten dinner.','Scientists will have found a cure by 2030.','They will have built the bridge by 2028.'],
    negative:['I will not (won\'t) have completed the work by then.','She will not (won\'t) have saved enough money by December.','They won\'t have arrived before midnight.','He won\'t have finished the course by June.'],
    question:['Will you have finished by the deadline?','How many chapters will she have written by then?','By 2030, how much will the population have grown?','Will they have completed the project on time?'],
    mistakes:[{wrong:'I will have finish by tomorrow.',correct:'I will have finished by tomorrow.'},{wrong:'She will have went by then.',correct:'She will have gone by then.'},{wrong:'By next month I will worked here for 5 years.',correct:'By next month I will have worked here for 5 years.'}],
    timeExpressions:['by','by the time','before','by then','by next week','by 2030','in two years','by the end of','within','by Friday','by next month'],
    usage:['Completion before future time','Projections & deadlines','Future achievements','Guarantees about the future','Cause before future moment'],
    tips:'"By + vaqt" (by Friday, by 2030) — Future Perfect signali. Kelajakda biror vaqtgacha tugallangan ishni ko\'rsatadi.',
    compare:{with:'future-perfect-continuous',note:'Future Perfect — tugallanganlik (will have finished). Future Perfect Continuous — davomiylik (will have been working).'}
  },
  { id:'future-perfect-continuous', name:'Future Perfect Continuous', group:'Future Tenses', icon:'⏳',
    formula:'Subject + will + have + been + verb(-ing)',
    beginner:'Shows how long an action will have been happening by a future time. Example: "By June, I will have been working here for 5 years."',
    advanced:'Emphasises the duration of a future action up to a specific point.',
    ielts:'Band 8+ structure: "By 2030, people will have been using renewable energy for decades."',
    sat:'Rare but tests complex tense understanding.',
    academic:'Used for long-term projections: "Researchers will have been studying this for a decade by 2026."',
    positive:['By next month, I will have been living here for a year.','She will have been teaching for 20 years by 2025.','By December, I will have been working on this project for three years.','They will have been travelling for 24 hours by the time they arrive.','By 2030, I will have been studying English for 15 years.'],
    negative:['By then, I will not (won\'t) have been working long enough to qualify.','She will not (won\'t) have been studying English for very long by the time she takes the test.','They won\'t have been living there long by then.'],
    question:['How long will you have been studying by the time you graduate?','By 2030, how long will scientists have been researching this?','How long will she have been working there by next year?'],
    mistakes:[{wrong:'By next year I will have been work here for 5 years.',correct:'By next year I will have been working here for 5 years.'},{wrong:'She will have been taught for 20 years.',correct:'She will have been teaching for 20 years.'}],
    timeExpressions:['by','for','since','how long','by the time','next year','in 2026','by December','for decades','for years','by then'],
    usage:['Duration before future time','Cause of future situation','Long-term projections','Emphasising continuous effort','Milestone celebrations'],
    tips:'Kelajakdagi bir vaqtgacha qancha davom etganini ko\'rsatadi. IELTS Writingda band 8+ uchun juda muhim!',
    compare:{with:'future-perfect',note:'Future Perfect — "by X time" tugallangan. Future Perfect Continuous — "by X time" davom etayotgan.'}
  }
];

const GRAMMAR_CATEGORIES = [
  { id:'articles', icon:'📌', name:'Articles', desc:'a, an, the — mastery', count:12 },
  { id:'prepositions', icon:'📍', name:'Prepositions', desc:'in, on, at, by, for', count:20 },
  { id:'modals', icon:'🎭', name:'Modal Verbs', desc:'can, could, must, should', count:15 },
  { id:'passive', icon:'🔄', name:'Passive Voice', desc:'be + past participle', count:14 },
  { id:'active', icon:'⚡', name:'Active Voice', desc:'Subject performs action', count:10 },
  { id:'conditionals', icon:'🔀', name:'Conditionals', desc:'if, unless, provided', count:16 },
  { id:'reported', icon:'💬', name:'Reported Speech', desc:'he said that...', count:12 },
  { id:'relative', icon:'🔗', name:'Relative Clauses', desc:'who, which, that, whom', count:14 },
  { id:'gerunds', icon:'🏃', name:'Gerunds & Infinitives', desc:'-ing vs to + verb', count:16 },
  { id:'phrasal', icon:'🔧', name:'Phrasal Verbs', desc:'give up, look after', count:20 },
  { id:'idioms', icon:'🎨', name:'Idioms', desc:'piece of cake, etc.', count:18 },
  { id:'conjunctions', icon:'🔀', name:'Conjunctions', desc:'and, but, or, so, yet', count:12 },
  { id:'pronouns', icon:'👤', name:'Pronouns', desc:'I, you, he, she, it, we, they', count:12 },
  { id:'adjectives', icon:'🌈', name:'Adjectives', desc:'describing words', count:14 },
  { id:'adverbs', icon:'💨', name:'Adverbs', desc:'quickly, very, always', count:12 },
  { id:'quantifiers', icon:'📊', name:'Quantifiers', desc:'some, any, much, many', count:10 },
  { id:'questions', icon:'❓', name:'Question Tags', desc:'isn\'t it?, aren\'t you?', count:8 },
  { id:'agreement', icon:'🤝', name:'Subject-Verb Agreement', desc:'singular/plural match', count:14 },
  { id:'complex', icon:'🏗️', name:'Complex Sentences', desc:'subordinate clauses', count:16 },
  { id:'compound', icon:'🧩', name:'Compound Sentences', desc:'coordinating conjunctions', count:10 },
  { id:'academic', icon:'🎓', name:'Academic Grammar', desc:'formal writing structures', count:18 },
  { id:'business', icon:'💼', name:'Business Grammar', desc:'professional English', count:14 },
  { id:'ielts', icon:'🏛️', name:'IELTS Grammar', desc:'exam-focused structures', count:20 },
  { id:'sat', icon:'📝', name:'SAT Grammar', desc:'standardized test grammar', count:18 }
];

const GRAMMAR_RANK_THRESHOLDS = [
  { level:1, name:'Beginner', icon:'⭐', xp:0 },
  { level:2, name:'Intermediate', icon:'🌟', xp:300 },
  { level:3, name:'Advanced', icon:'💎', xp:800 },
  { level:4, name:'Expert', icon:'👑', xp:1600 },
  { level:5, name:'Grammar Master', icon:'🏆', xp:3000 },
  { level:6, name:'IELTS Champion', icon:'🔥', xp:5000 }
];

const GRAMMAR_CATEGORY_DATA = {
  articles: { formula:'a/an + singular countable noun / the + any noun',
    beginner:'Use "a" before consonant sounds, "an" before vowel sounds, "the" for specific things.',
    advanced:'Zero article for general plurals and uncountable nouns. "The" with unique entities and superlatives.',
    ielts:'Master article usage for Academic Task 1 descriptions and Task 2 general statements.',
    positive:['I saw a dog in the park.','She is an engineer.','The sun rises in the east.','Cats are independent animals.'],
    negative:['I do not have a car.','She is not the manager here.','There is no milk in the fridge.'],
    question:['Do you have a pen?','Is this the book you were looking for?','What an amazing view!'],
    mistakes:[{wrong:'She is a engineer.',correct:'She is an engineer.'},{wrong:'I went to the bed early.',correct:'I went to bed early.'},{wrong:'The water is important for life.',correct:'Water is important for life.'}],
    timeExpressions:[], usage:['First mention vs. subsequent mention','General vs. specific','Unique entities','Superlatives','Institutions & places']
  },
  prepositions: { formula:'preposition + noun phrase',
    beginner:'Prepositions show time (at, on, in), place (at, on, in), and direction (to, from, into).',
    advanced:'Complex prepositional phrases: "in spite of", "by means of", "in accordance with".',
    ielts:'Accurate preposition use is crucial for describing data changes: "increased by 20%", "rose from X to Y".',
    positive:['The book is on the table.','She arrived at 5 PM.','He is interested in music.','They walked through the park.'],
    negative:['She is not afraid of spiders.','I am not good at math.'],
    question:['What are you looking for?','Who are you going with?'],
    mistakes:[{wrong:'I am married with a doctor.',correct:'I am married to a doctor.'},{wrong:'She depends of her parents.',correct:'She depends on her parents.'},{wrong:'We discussed about the problem.',correct:'We discussed the problem.'}],
    timeExpressions:['at night','on Monday','in the morning','by Friday','since 2020','for 3 years','during the meeting'],
    usage:['Time prepositions','Place prepositions','Movement prepositions','Prepositional verbs','Dependent prepositions']
  },
  modals: { formula:'modal + base verb (without "to")',
    beginner:'Modals express ability (can), permission (may), obligation (must), and possibility (might).',
    advanced:'Perfect modals: "must have been", "could have done", "should have gone" for past speculation.',
    ielts:'Using modals appropriately shows nuanced understanding: "This could lead to..." vs. "This will lead to...".',
    positive:['I can speak three languages.','You must wear a seatbelt.','She might come to the party.','We should leave now.'],
    negative:['You must not (mustn\'t) smoke here.','I cannot (can\'t) swim.','She may not agree with us.'],
    question:['Can I help you?','Should we tell her?','Could you please open the door?'],
    mistakes:[{wrong:'I must to go now.',correct:'I must go now.'},{wrong:'She can speaks French.',correct:'She can speak French.'},{wrong:'He should to study more.',correct:'He should study more.'}],
    timeExpressions:[], usage:['Ability & possibility','Permission & obligation','Advice & suggestions','Past speculation','Polite requests']
  },
  passive: { formula:'Subject + be (conjugated) + past participle (+ by agent)',
    beginner:'The passive focuses on the action, not who performs it: "The cake was eaten."',
    advanced:'Passive with modals: "The report must be completed." Impersonal passive: "It is believed that..."',
    ielts:'Passive is essential for formal academic writing: "The experiment was conducted.", "It can be argued that...".',
    positive:['The letter was sent yesterday.','English is spoken worldwide.','The project will be completed by Friday.','The window was broken by a ball.'],
    negative:['The work has not been finished yet.','He was not invited to the party.'],
    question:['Was the package delivered?','When was the building constructed?'],
    mistakes:[{wrong:'The book was wrote by Mark Twain.',correct:'The book was written by Mark Twain.'},{wrong:'She was took to the hospital.',correct:'She was taken to the hospital.'}],
    timeExpressions:[], usage:['Unknown or unimportant agent','Formal & academic writing','Process descriptions','Impersonal structures','News & announcements']
  },
  conditionals: { formula:'if-clause + main clause (various tenses depending on type)',
    beginner:'Zero (general truth), First (real future), Second (unreal present), Third (unreal past).',
    advanced:'Mixed conditionals, inverted conditionals ("Were I you...", "Had I known..."), and unless/provided that.',
    ielts:'Conditionals add sophistication: "If the trend continues, the rate will double." Band 8+ uses mixed conditionals.',
    positive:['If you heat ice, it melts. (Zero)','If it rains, I will stay home. (First)','If I were rich, I would travel. (Second)','If I had studied, I would have passed. (Third)'],
    negative:['If you don\'t hurry, you will miss the bus.','I wouldn\'t do that if I were you.'],
    question:['What would you do if you won the lottery?','If you had known, would you have come?'],
    mistakes:[{wrong:'If I will see her, I will tell her.',correct:'If I see her, I will tell her.'},{wrong:'If I was you, I would go.',correct:'If I were you, I would go.'}],
    timeExpressions:['if','unless','provided that','as long as','in case','otherwise','even if'],
    usage:['Zero: general truths','First: real future situations','Second: unreal present','Third: unreal past','Mixed: complex time relationships']
  },
  reported: { formula:'Reporting verb + (that) + clause (with backshift)',
    beginner:'Report what someone said: Direct "I am tired" → Reported "She said she was tired."',
    advanced:'Backshift of tenses, time/place changes (now→then, here→there), reporting questions and commands.',
    ielts:'Reported speech appears in Listening and is useful for Writing Task 2: "The author argues that..."',
    positive:['He said that he was hungry.','She told me she had finished.','They asked if we were coming.'],
    negative:['She said she did not (didn\'t) know the answer.','He told me not to worry.'],
    question:['He asked where I lived.','She wondered if I could help.'],
    mistakes:[{wrong:'She said me that she was tired.',correct:'She told me that she was tired.'},{wrong:'He said that he is going.',correct:'He said that he was going.'}],
    timeExpressions:[], usage:['Reporting statements','Reporting questions','Reporting commands','Say vs. tell','Time & place changes']
  },
  relative: { formula:'relative pronoun (who/whom/which/that/whose) + clause',
    beginner:'Defining relative clauses add essential information: "The man who lives next door is a doctor."',
    advanced:'Non-defining relative clauses add extra info with commas: "My mother, who is 60, runs marathons."',
    ielts:'Relative clauses show grammatical range: "The government, which has implemented new policies, hopes to...".',
    positive:['The book that I read was fascinating.','She is the woman who won the prize.','My car, which is 10 years old, still runs well.'],
    negative:['There is no one who can help us.','The movie wasn\'t what I expected.'],
    question:['Who was the person that called you?','Do you know the reason why she left?'],
    mistakes:[{wrong:'The man which lives here is friendly.',correct:'The man who lives here is friendly.'},{wrong:'The book who I read was good.',correct:'The book that I read was good.'}],
    timeExpressions:[], usage:['Defining relative clauses','Non-defining relative clauses','Relative pronouns choice','Omission of relative pronoun','Prepositions in relative clauses']
  },
  gerunds: { formula:'Gerund: verb(-ing) as noun / Infinitive: to + base verb',
    beginner:'Gerunds (running, swimming) act as nouns. Infinitives (to run, to swim) express purpose.',
    advanced:'Some verbs take only gerunds (enjoy, avoid), some only infinitives (want, promise), some change meaning (stop, remember).',
    ielts:'Gerund/infinitive mastery shows precision: "I remember locking the door" vs. "I remembered to lock the door."',
    positive:['Swimming is good exercise.','I enjoy reading books.','She wants to learn Spanish.','He stopped smoking last year.'],
    negative:['I avoid eating late at night.','She decided not to go.'],
    question:['Do you like cooking?','What do you want to do?'],
    mistakes:[{wrong:'I enjoy to swim.',correct:'I enjoy swimming.'},{wrong:'She suggested to go home.',correct:'She suggested going home.'},{wrong:'He is used to wake up early.',correct:'He is used to waking up early.'}],
    timeExpressions:[], usage:['Gerund as subject/object','Verbs followed by gerund','Verbs followed by infinitive','Verbs with both (meaning change)','Go + gerund for activities']
  },
  phrasal: { formula:'verb + particle (preposition/adverb) — meaning often differs from base verb',
    beginner:'Common phrasal verbs: get up, turn off, look for, give up. Separable vs. inseparable.',
    advanced:'Three-word phrasal verbs: put up with, look forward to, cut down on. Phrasal verbs in academic context.',
    ielts:'Phrasal verbs add natural fluency in Speaking: "I grew up in...", "I came across an interesting study..."',
    positive:['Please turn off the lights.','I gave up smoking last year.','She looks after her younger brother.','We are looking forward to the trip.'],
    negative:['Don\'t give up on your dreams.','I can\'t put up with this noise anymore.'],
    question:['What time do you usually get up?','Can you look after my cat this weekend?'],
    mistakes:[{wrong:'She gave up smoking.',correct:'She gave up smoking. (no object pronoun between)'},{wrong:'I look forward to see you.',correct:'I look forward to seeing you.'}],
    timeExpressions:[], usage:['Separable phrasal verbs','Inseparable phrasal verbs','Three-word phrasal verbs','Formal vs. phrasal verbs','Common everyday phrasal verbs']
  },
  idioms: { formula:'fixed expressions with figurative meaning (cannot be translated literally)',
    beginner:'Simple idioms: "piece of cake" (easy), "break a leg" (good luck), "under the weather" (sick).',
    advanced:'Advanced idioms: "bite the bullet" (face difficulty), "hit the nail on the head" (be exactly right).',
    ielts:'Idioms boost Speaking scores when used naturally: "It was a blessing in disguise...", "I was over the moon..."',
    positive:['The test was a piece of cake.','She was feeling under the weather.','He finally bit the bullet and quit.','You hit the nail on the head!'],
    negative:['Don\'t beat around the bush.','Let\'s not cry over spilled milk.'],
    question:['How do you usually break the ice with new people?'],
    mistakes:[{wrong:'It\'s a cake piece.',correct:'It\'s a piece of cake.'},{wrong:'I am feeling under the rain.',correct:'I am feeling under the weather.'}],
    timeExpressions:[], usage:['Conversation idioms','Workplace idioms','Academic idioms','Idioms for emotions','Idioms for situations']
  },
  conjunctions: { formula:'coordinating: FANBOYS (for/and/nor/but/or/yet/so) / subordinating: because, although, while, etc.',
    beginner:'Coordinating conjunctions join equal parts: "I like tea and coffee." Subordinating shows relationship: "I stayed because it was raining."',
    advanced:'Correlative conjunctions: either...or, neither...nor, not only...but also, both...and.',
    ielts:'Conjunctions create complex sentences: "Although the data shows an increase, the rate of growth has slowed."',
    positive:['I wanted to go, but I was too tired.','She studied hard, so she passed.','Both John and Mary were invited.','He is not only smart but also kind.'],
    negative:['I neither know nor care.','She didn\'t come because she was sick.'],
    question:['Do you prefer tea or coffee?','Should we go now or wait for her?'],
    mistakes:[{wrong:'Although she was tired, but she continued.',correct:'Although she was tired, she continued.'},{wrong:'I like both tea and also coffee.',correct:'I like both tea and coffee.'}],
    timeExpressions:[],     usage:['Coordinating conjunctions','Subordinating conjunctions','Correlative conjunctions','Conjunctive adverbs','Sentence connectors']
  },
  active: { formula:'Subject + verb (active: subject performs the action)',
    beginner:'Active voice means the subject does the action: "The cat ate the fish." Clear, direct, and preferred in most writing.',
    advanced:'Active voice creates stronger, more concise sentences. Used in persuasive writing, journalism, and most fiction.',
    ielts:'Active voice is preferred in Task 2 essays: "The government should implement stricter laws." More direct and powerful.',
    positive:['The chef cooked a delicious meal.','The company launched a new product.','The students completed the project on time.','The artist painted a beautiful mural.'],
    negative:['The manager did not approve the request.','The team did not finish the report on time.'],
    question:['Who wrote this book?','Did the committee accept the proposal?'],
    mistakes:[{wrong:'The book was written by the author (passive overuse).',correct:'The author wrote the book (active).'}],
    timeExpressions:[], usage:['Clear subject-action-object structure','Persuasive & direct writing','Journalism & reporting','Academic arguments','Everyday communication']
  },
  adjectives: { formula:'adjective + noun / linking verb + adjective',
    beginner:'Adjectives describe nouns: "a beautiful day", "the tall building". They go before nouns or after linking verbs (be, seem, feel).',
    advanced:'Order of adjectives: opinion-size-age-shape-color-origin-material-purpose + noun. Comparative and superlative forms.',
    ielts:'Adjectives enrich descriptions: "a significant increase", "a remarkable improvement", "a challenging task".',
    positive:['She wore a beautiful red dress.','He is an intelligent student.','The weather is cold today.','This is the most delicious cake I have ever eaten.'],
    negative:['The movie was not very interesting.','I am not feeling well today.'],
    question:['Is this book interesting?','Which color do you prefer?'],
    mistakes:[{wrong:'She is a woman beautiful.',correct:'She is a beautiful woman.'},{wrong:'This is more better than that.',correct:'This is better than that.'},{wrong:'He is more tall than me.',correct:'He is taller than me.'}],
    timeExpressions:[], usage:['Describing nouns','After linking verbs','Comparative & superlative','Adjective order','Participle adjectives (-ed vs -ing)']
  },
  adverbs: { formula:'adverb + verb/adjective/other adverb / at beginning or end of clause',
    beginner:'Adverbs modify verbs (run quickly), adjectives (very good), or other adverbs (too slowly). They often end in -ly.',
    advanced:'Adverbs of frequency (always, never), degree (extremely, quite), manner (carefully), time (yesterday), place (everywhere).',
    ielts:'Adverbs add precision: "The rate increased dramatically.", "The results were significantly better."',
    positive:['She sings beautifully.','He drives very carefully.','They arrived early.','I completely agree with you.'],
    negative:['She does not always tell the truth.','He hardly ever exercises.'],
    question:['How often do you exercise?','Where did you put the keys?'],
    mistakes:[{wrong:'She speaks English good.',correct:'She speaks English well.'},{wrong:'He is extreme talented.',correct:'He is extremely talented.'}],
    timeExpressions:['always','never','often','rarely','sometimes','usually','hardly ever','frequently','occasionally'],
    usage:['Adverbs of manner','Adverbs of frequency','Adverbs of degree','Adverbs of time','Adverbs of place','Sentence adverbs']
  },
  quantifiers: { formula:'quantifier + (of + determiner) + noun',
    beginner:'Quantifiers show amount: some, any, much, many, a lot of, a few, a little, enough, no.',
    advanced:'Countable vs uncountable: many/few with countable, much/little with uncountable. "A lot of" works with both.',
    ielts:'Precise quantifiers improve Task 1: "a significant minority", "the vast majority", "a small fraction".',
    positive:['There are many books on the shelf.','She has a lot of friends.','I need a little help.','He ate some cookies.'],
    negative:['There is not much milk left.','I do not have any money.'],
    question:['How much does it cost?','Are there any seats available?'],
    mistakes:[{wrong:'There is many people here.',correct:'There are many people here.'},{wrong:'I have a few money.',correct:'I have a little money.'},{wrong:'She doesn\'t have some time.',correct:'She doesn\'t have any time.'}],
    timeExpressions:[], usage:['Countable quantifiers','Uncountable quantifiers','Both countable & uncountable','Negative quantifiers','Questions with quantifiers']
  },
  questions: { formula:'auxiliary + subject + main verb? / question word + auxiliary + subject + verb?',
    beginner:'Question tags turn statements into questions: "You are tired, aren\'t you?" Positive statement → negative tag, and vice versa.',
    advanced:'Intonation matters: rising for real questions, falling when you expect agreement. Tags with imperatives: "Open the door, will you?"',
    ielts:'Question tags show natural fluency in Speaking: "It\'s a common problem, isn\'t it?"',
    positive:['You are coming to the party, aren\'t you?','She has finished, hasn\'t she?','They live nearby, don\'t they?'],
    negative:['He isn\'t late, is he?','You don\'t mind, do you?','She hasn\'t left yet, has she?'],
    question:['It\'s a beautiful day, isn\'t it?','You like coffee, don\'t you?'],
    mistakes:[{wrong:'You are coming, isn\'t it?',correct:'You are coming, aren\'t you?'},{wrong:'She doesn\'t like tea, doesn\'t she?',correct:'She doesn\'t like tea, does she?'}],
    timeExpressions:[], usage:['Positive statement + negative tag','Negative statement + positive tag','Tags with auxiliaries','Tags with imperatives','Intonation patterns']
  },
  agreement: { formula:'singular subject → singular verb / plural subject → plural verb',
    beginner:'Subject-verb agreement: "He runs" (singular), "They run" (plural). The verb must match the subject in number.',
    advanced:'Tricky cases: collective nouns (team is/are), indefinite pronouns (everyone is), subjects with "and" vs "as well as".',
    ielts:'Agreement errors lower your score. Master: "The number of people is...", "A variety of methods are..."',
    positive:['The dog runs in the park.','The children play outside.','Everyone is invited to the party.','The committee has reached a decision.'],
    negative:['The news is not good today.','Mathematics is not my favorite subject.'],
    question:['Does anyone know the answer?','Are the scissors in the drawer?'],
    mistakes:[{wrong:'The list of items are on the table.',correct:'The list of items is on the table.'},{wrong:'Everyone are happy.',correct:'Everyone is happy.'},{wrong:'She don\'t like spinach.',correct:'She doesn\'t like spinach.'}],
    timeExpressions:[], usage:['Singular subjects','Plural subjects','Collective nouns','Indefinite pronouns','Subjects with intervening phrases']
  },
  complex: { formula:'independent clause + subordinating conjunction + dependent clause (or reverse with comma)',
    beginner:'Complex sentences have one main clause and one or more subordinate clauses: "I stayed home because it was raining."',
    advanced:'Subordinate clauses can be noun, adjective, or adverb clauses. Used for sophisticated academic and professional writing.',
    ielts:'Band 7+ requires complex sentences: "Although the data shows an increase, the rate of growth has slowed significantly."',
    positive:['Because she studied hard, she passed the exam.','Although it was raining, we went for a walk.','The book that I borrowed was fascinating.'],
    negative:['I did not go to the party because I was tired.','Unless you hurry, we will miss the bus.'],
    question:['Do you know where she lives?','Can you tell me what time it is?'],
    mistakes:[{wrong:'Because I was tired so I went to bed.',correct:'Because I was tired, I went to bed.'},{wrong:'Although it rained but we went out.',correct:'Although it rained, we went out.'}],
    timeExpressions:['because','although','while','when','since','unless','if','as','whereas','despite'],
    usage:['Cause & effect','Contrast & concession','Time relationships','Conditional meaning','Relative clauses as subordination']
  },
  compound: { formula:'independent clause + coordinating conjunction + independent clause',
    beginner:'Compound sentences join two equal clauses with FANBOYS: for, and, nor, but, or, yet, so.',
    advanced:'Semicolons can replace conjunctions: "I wanted to go; however, I was too tired." Conjunctive adverbs: moreover, furthermore, nevertheless.',
    ielts:'Compound sentences add variety: "The number increased sharply in 2020, but it declined slightly in 2021."',
    positive:['I wanted to go, but I was too tired.','She studied hard, so she passed.','He likes tea, and she likes coffee.'],
    negative:['I did not enjoy the movie, nor did my friend.','She is not angry, but she is disappointed.'],
    question:['Should we go now, or should we wait?','Do you want tea, or would you prefer coffee?'],
    mistakes:[{wrong:'I like coffee but I don\'t like tea but I drink it sometimes.',correct:'I like coffee, but I don\'t like tea. However, I drink it sometimes.'},{wrong:'She was tired so she went to bed.',correct:'She was tired, so she went to bed.'}],
    timeExpressions:[], usage:['Adding information (and)','Contrasting ideas (but, yet)','Showing results (so)','Offering choices (or)','Explaining reasons (for)']
  },
  academic: { formula:'formal structures: It + be + adj + that/to / passive voice / nominalisation / hedging',
    beginner:'Academic grammar uses formal structures, cautious language (hedging), and precise vocabulary.',
    advanced:'Nominalisation (verb→noun: "investigate"→"investigation"), hedging (may, could, tend to), impersonal passive (it can be argued).',
    ielts:'Academic grammar is essential for Writing Task 2: "It can be argued that...", "This essay will discuss...", "There is no doubt that..."',
    positive:['It is widely believed that climate change is accelerating.','The experiment was conducted under controlled conditions.','This paper examines the effects of social media on mental health.'],
    negative:['There is no evidence to support this claim.','It cannot be denied that challenges remain.'],
    question:['To what extent does this theory apply?','What implications does this have for future research?'],
    mistakes:[{wrong:'In this essay I will talk about...',correct:'This essay will examine/discuss/analyse...'},{wrong:'I think it is true.',correct:'It is widely accepted that this is true.'}],
    timeExpressions:[], usage:['Nominalisation','Hedging language','Impersonal structures','Formal vocabulary','Cautious claims','Citation structures']
  },
  business: { formula:'formal but clear: subject + verb + object / professional tone / diplomatic language',
    beginner:'Business English uses clear, polite, professional language. Common structures: "I would like to...", "Could you please..."',
    advanced:'Diplomatic language: "I was wondering if...", "It might be worth considering...". Reported speech in meetings.',
    ielts:'Business grammar useful for General Training: emails, reports, proposals, and professional correspondence.',
    positive:['I am writing to inquire about your services.','We would like to propose a partnership.','Please find attached the requested documents.'],
    negative:['Unfortunately, we are unable to accept your offer at this time.','I regret to inform you that your application was not successful.'],
    question:['Would you be available for a meeting next week?','Could you please provide an update on the project?'],
    mistakes:[{wrong:'I want you to do this now.',correct:'I would like you to prioritise this, please.'},{wrong:'Send me the file.',correct:'Could you please send me the file?'}],
    timeExpressions:[], usage:['Professional emails','Meeting language','Negotiation phrases','Reports & proposals','Diplomatic requests','Formal apologies']
  },
  ielts: { formula:'complex structures + accuracy + range = band score',
    beginner:'IELTS grammar focuses on accuracy in basic tenses, articles, and prepositions.',
    advanced:'Band 8+ requires: complex sentences, conditionals, passive voice, and a wide range of grammatical structures with minimal errors.',
    ielts:'Task 1: describing trends (past/future), comparisons, data language. Task 2: opinion, discussion, problem-solution structures.',
    positive:['The graph illustrates a steady increase in sales over the period.','It is often argued that technology has both positive and negative effects.'],
    negative:['There is no doubt that this trend is not sustainable in the long term.'],
    question:['To what extent do you agree or disagree?','What measures can be taken to address this issue?'],
    mistakes:[{wrong:'The number of tourists are increasing.',correct:'The number of tourists is increasing.'},{wrong:'In my opinion, I think that... (redundant)',correct:'In my opinion, ... or I think that... (choose one)'}],
    timeExpressions:[], usage:['Task 1 trend language','Task 2 opinion structures','Comparing data','Expressing cause & effect','Hedging & qualifying']
  },
  sat: { formula:'concise + correct = effective communication (test context)',
    beginner:'SAT grammar tests: subject-verb agreement, pronoun agreement, verb tense consistency, modifier placement.',
    advanced:'Advanced SAT: parallelism, dangling modifiers, apostrophes, colons/semicolons, transitional phrases.',
    ielts:'N/A — SAT-specific grammar for US college admissions.',
    positive:['The student who studies consistently performs better.','Having completed her homework, she went to bed.'],
    negative:['Neither the teacher nor the students were aware of the change.'],
    question:['Which choice best maintains the tone of the passage?','Is the underlined portion grammatically correct?'],
    mistakes:[{wrong:'Walking to the store, the rain started.',correct:'Walking to the store, she felt the rain start.'},{wrong:'The team were celebrated for their victory.',correct:'The team was celebrated for its victory.'}],
    timeExpressions:[], usage:['Subject-verb agreement','Pronoun-antecedent agreement','Verb tense consistency','Modifier placement','Parallel structure','Punctuation rules']
  }
};

const GRAMMAR_RARITY = { common:'#94a3b8', uncommon:'#10b981', rare:'#3b82f6', epic:'#8b5cf6', legendary:'#f59e0b' };
const GRAMMAR_ACHIEVEMENTS = [
  // TIER 1: BEGINNER (common)
  { id:'g-first', icon:'<i class="ti ti-seedling"></i>', name:'First Lesson', desc:'Complete your first grammar lesson', category:'lesson', rarity:'common', check:g=>g.totalLessons>=1, progress:g=>Math.min(g.totalLessons/1*100,100) },
  { id:'g-5-lessons', icon:'<i class="ti ti-edit"></i>', name:'Eager Learner', desc:'Complete 5 grammar lessons', category:'lesson', rarity:'common', check:g=>g.totalLessons>=5, progress:g=>Math.min(g.totalLessons/5*100,100) },
  { id:'g-first-quiz', icon:'<i class="ti ti-target"></i>', name:'First Quiz', desc:'Complete your first grammar quiz', category:'quiz', rarity:'common', check:g=>g.totalQuizzes>=1, progress:g=>Math.min(g.totalQuizzes/1*100,100) },
  { id:'g-streak-1', icon:'<i class="ti ti-flame"></i>', name:'First Spark', desc:'Start a 1-day grammar streak', category:'streak', rarity:'common', check:g=>g.streak>=1, progress:g=>Math.min(g.streak/1*100,100) },
  { id:'g-streak-3', icon:'<i class="ti ti-flame"></i>', name:'Grammar Streak', desc:'3-day grammar streak', category:'streak', rarity:'common', check:g=>g.streak>=3, progress:g=>Math.min(g.streak/3*100,100) },
  { id:'g-present-simple', icon:'<i class="ti ti-circle"></i>', name:'Present Simple', desc:'Complete Present Simple lesson', defaultCat:'present-simple', category:'tense', rarity:'common', check:g=>g.completedLessons.includes('present-simple'), progress:g=>g.completedLessons.includes('present-simple')?100:0 },

  // TIER 2: INTERMEDIATE (uncommon)
  { id:'g-10-lessons', icon:'<i class="ti ti-books"></i>', name:'Dedicated Student', desc:'Complete 10 grammar lessons', category:'lesson', rarity:'uncommon', check:g=>g.totalLessons>=10, progress:g=>Math.min(g.totalLessons/10*100,100) },
  { id:'g-streak-7', icon:'<i class="ti ti-bolt"></i>', name:'Week Warrior', desc:'7-day grammar streak', category:'streak', rarity:'uncommon', check:g=>g.streak>=7, progress:g=>Math.min(g.streak/7*100,100) },
  { id:'g-quiz-5', icon:'<i class="ti ti-flask"></i>', name:'Quiz Enthusiast', desc:'Complete 5 grammar quizzes', category:'quiz', rarity:'uncommon', check:g=>g.totalQuizzes>=5, progress:g=>Math.min(g.totalQuizzes/5*100,100) },
  { id:'g-accuracy-80', icon:'<i class="ti ti-chart-bar"></i>', name:'Solid Accuracy', desc:'Achieve 80%+ average quiz accuracy', category:'quiz', rarity:'uncommon', check:g=>g.totalQuizzes>=3&&g.totalCorrect/g.totalQuestions>=0.8, progress:g=>g.totalQuizzes>=3?Math.min((g.totalCorrect/g.totalQuestions)*100,100):Math.min(g.totalQuizzes/3*100,100) },
  { id:'g-tense', icon:'<i class="ti ti-clock"></i>', name:'Tense Master', desc:'Complete all present tenses', category:'tense', rarity:'uncommon', check:g=>['present-simple','present-continuous','present-perfect','present-perfect-continuous'].every(t=>g.completedLessons.includes(t)), progress:g=>{const arr=['present-simple','present-continuous','present-perfect','present-perfect-continuous'];const done=arr.filter(t=>g.completedLessons.includes(t)).length;return done/arr.length*100;} },
  { id:'g-articles', icon:'<i class="ti ti-abc"></i>', name:'Article Ace', desc:'Complete all article lessons', category:'category', rarity:'uncommon', check:g=>g.completedLessons.includes('cat:articles'), progress:g=>g.completedLessons.includes('cat:articles')?100:0 },
  { id:'g-xp-500', icon:'<i class="ti ti-star"></i>', name:'500 XP', desc:'Earn 500 grammar XP', category:'xp', rarity:'uncommon', check:g=>g.xp>=500, progress:g=>Math.min(g.xp/500*100,100) },
  { id:'g-ielts', icon:'<i class="ti ti-building-columns"></i>', name:'IELTS Ready', desc:'Complete 15 grammar lessons', category:'lesson', rarity:'uncommon', check:g=>g.totalLessons>=15, progress:g=>Math.min(g.totalLessons/15*100,100) },

  // TIER 3: ADVANCED (rare)
  { id:'g-25', icon:'<i class="ti ti-book"></i>', name:'Structure King', desc:'Complete 25 lessons', category:'lesson', rarity:'rare', check:g=>g.totalLessons>=25, progress:g=>Math.min(g.totalLessons/25*100,100) },
  { id:'g-quiz-10', icon:'<i class="ti ti-flask"></i>', name:'Quiz Champion', desc:'Complete 10 grammar quizzes', category:'quiz', rarity:'rare', check:g=>g.totalQuizzes>=10, progress:g=>Math.min(g.totalQuizzes/10*100,100) },
  { id:'g-accuracy-90', icon:'<i class="ti ti-target"></i>', name:'Near Perfect', desc:'Achieve 90%+ average quiz accuracy', category:'quiz', rarity:'rare', check:g=>g.totalQuizzes>=5&&g.totalCorrect/g.totalQuestions>=0.9, progress:g=>g.totalQuizzes>=5?Math.min((g.totalCorrect/g.totalQuestions)*100,100):Math.min(g.totalQuizzes/5*100,100) },
  { id:'g-passive', icon:'<i class="ti ti-repeat"></i>', name:'Passive Voice Pro', desc:'Complete all passive voice lessons', category:'category', rarity:'rare', check:g=>g.completedLessons.includes('cat:passive'), progress:g=>g.completedLessons.includes('cat:passive')?100:0 },
  { id:'g-conditionals', icon:'<i class="ti ti-question-mark"></i>', name:'Conditional Master', desc:'Complete all conditional lessons', category:'category', rarity:'rare', check:g=>g.completedLessons.includes('cat:conditionals'), progress:g=>g.completedLessons.includes('cat:conditionals')?100:0 },
  { id:'g-all-tenses', icon:'<i class="ti ti-books"></i>', name:'Tense Legend', desc:'Complete all 12 tenses', category:'tense', rarity:'rare', check:g=>GRAMMAR_TENSES.every(t=>g.completedLessons.includes(t.id)), progress:g=>{const done=GRAMMAR_TENSES.filter(t=>g.completedLessons.includes(t.id)).length;return done/GRAMMAR_TENSES.length*100;} },
  { id:'g-rank-3', icon:'<i class="ti ti-medal"></i>', name:'Advanced Learner', desc:'Reach Advanced rank or higher', category:'rank', rarity:'rare', check:g=>['Advanced','Expert','Grammar Master','IELTS Champion'].includes(g.rank), progress:g=>{const ranks=['Beginner','Elementary','Intermediate','Advanced','Expert','Grammar Master','IELTS Champion'];const idx=ranks.indexOf(g.rank);return idx<0?0:Math.min((idx-2)/2*100,100);} },
  { id:'g-xp-2000', icon:'<i class="ti ti-sparkles"></i>', name:'2,000 XP', desc:'Earn 2,000 grammar XP', category:'xp', rarity:'rare', check:g=>g.xp>=2000, progress:g=>Math.min(g.xp/2000*100,100) },
  { id:'g-streak-14', icon:'<i class="ti ti-bolt"></i>', name:'Fortnight Flame', desc:'14-day grammar streak', category:'streak', rarity:'rare', check:g=>g.streak>=14, progress:g=>Math.min(g.streak/14*100,100) },
  { id:'g-prepositions', icon:'<i class="ti ti-map-pin"></i>', name:'Preposition Pro', desc:'Complete all preposition lessons', category:'category', rarity:'rare', check:g=>g.completedLessons.includes('cat:prepositions'), progress:g=>g.completedLessons.includes('cat:prepositions')?100:0 },

  // TIER 4: EXPERT (epic)
  { id:'g-50', icon:'<i class="ti ti-crown"></i>', name:'Grammar Genius', desc:'Complete 50 lessons', category:'lesson', rarity:'epic', check:g=>g.totalLessons>=50, progress:g=>Math.min(g.totalLessons/50*100,100) },
  { id:'g-quiz-25', icon:'<i class="ti ti-flask"></i>', name:'Quiz Legend', desc:'Complete 25 grammar quizzes', category:'quiz', rarity:'epic', check:g=>g.totalQuizzes>=25, progress:g=>Math.min(g.totalQuizzes/25*100,100) },
  { id:'g-perfect', icon:'<i class="ti ti-percentage"></i>', name:'Perfect Accuracy', desc:'Get a perfect 100% on a grammar quiz', category:'quiz', rarity:'epic', check:g=>g.totalQuizzes>0&&g.totalCorrect===g.totalQuestions, progress:g=>g.totalQuizzes>0?(g.totalCorrect===g.totalQuestions?100:0):0 },
  { id:'g-rank-5', icon:'<i class="ti ti-crown"></i>', name:'Grammar Master', desc:'Reach Grammar Master rank', category:'rank', rarity:'epic', check:g=>['Grammar Master','IELTS Champion'].includes(g.rank), progress:g=>{const ranks=['Beginner','Elementary','Intermediate','Advanced','Expert','Grammar Master','IELTS Champion'];const idx=ranks.indexOf(g.rank);return idx<0?0:Math.min((idx-4)/2*100,100);} },
  { id:'g-xp-5000', icon:'<i class="ti ti-diamond"></i>', name:'5,000 XP', desc:'Earn 5,000 grammar XP', category:'xp', rarity:'epic', check:g=>g.xp>=5000, progress:g=>Math.min(g.xp/5000*100,100) },
  { id:'g-streak-30', icon:'<i class="ti ti-flame"></i>', name:'Monthly Master', desc:'30-day grammar streak', category:'streak', rarity:'epic', check:g=>g.streak>=30, progress:g=>Math.min(g.streak/30*100,100) },

  // TIER 5: LEGENDARY (legendary)
  { id:'g-100', icon:'<i class="ti ti-diamond"></i>', name:'Century of Knowledge', desc:'Complete 100 lessons', category:'lesson', rarity:'legendary', check:g=>g.totalLessons>=100, progress:g=>Math.min(g.totalLessons/100*100,100) },
  { id:'g-quiz-50', icon:'<i class="ti ti-trophy"></i>', name:'Quiz Grandmaster', desc:'Complete 50 grammar quizzes', category:'quiz', rarity:'legendary', check:g=>g.totalQuizzes>=50, progress:g=>Math.min(g.totalQuizzes/50*100,100) },
  { id:'g-rank-7', icon:'<i class="ti ti-crown"></i>', name:'IELTS Champion', desc:'Reach IELTS Champion rank', category:'rank', rarity:'legendary', check:g=>g.rank==='IELTS Champion', progress:g=>g.rank==='IELTS Champion'?100:0 },
  { id:'g-xp-10000', icon:'<i class="ti ti-galaxy"></i>', name:'10,000 XP', desc:'Earn 10,000 grammar XP', category:'xp', rarity:'legendary', check:g=>g.xp>=10000, progress:g=>Math.min(g.xp/10000*100,100) },
  { id:'g-all-categories', icon:'<i class="ti ti-medal"></i>', name:'Grammar Completionist', desc:'Complete lessons from every category', category:'category', rarity:'legendary', check:g=>GRAMMAR_CATEGORIES.every(c=>g.completedLessons.includes('cat:'+c.id)), progress:g=>{const done=GRAMMAR_CATEGORIES.filter(c=>g.completedLessons.includes('cat:'+c.id)).length;return done/GRAMMAR_CATEGORIES.length*100;} },

  // NEW: Enhanced achievements
  { id:'g-perfect-3', icon:'<i class="ti ti-diamond"></i>', name:'Hat Trick', desc:'Get 3 perfect quiz scores', category:'quiz', rarity:'uncommon', check:g=>g.totalCorrect===g.totalQuestions&&g.totalQuizzes>=3, progress:g=>0 },
  { id:'g-category-5', icon:'<i class="ti ti-package"></i>', name:'Category Explorer', desc:'Complete 5 different grammar categories', category:'category', rarity:'uncommon', check:g=>GRAMMAR_CATEGORIES.filter(c=>g.completedLessons.includes('cat:'+c.id)).length>=5, progress:g=>Math.min(GRAMMAR_CATEGORIES.filter(c=>g.completedLessons.includes('cat:'+c.id)).length/5*100,100) },
  { id:'g-category-10', icon:'<i class="ti ti-books"></i>', name:'Category Master', desc:'Complete 10 different grammar categories', category:'category', rarity:'rare', check:g=>GRAMMAR_CATEGORIES.filter(c=>g.completedLessons.includes('cat:'+c.id)).length>=10, progress:g=>Math.min(GRAMMAR_CATEGORIES.filter(c=>g.completedLessons.includes('cat:'+c.id)).length/10*100,100) },
  { id:'g-xp-7500', icon:'<i class="ti ti-sparkles"></i>', name:'7,500 XP', desc:'Earn 7,500 grammar XP', category:'xp', rarity:'epic', check:g=>g.xp>=7500, progress:g=>Math.min(g.xp/7500*100,100) },
  { id:'g-xp-15000', icon:'<i class="ti ti-star"></i>', name:'15,000 XP', desc:'Earn 15,000 grammar XP', category:'xp', rarity:'legendary', check:g=>g.xp>=15000, progress:g=>Math.min(g.xp/15000*100,100) },
  { id:'g-streak-50', icon:'<i class="ti ti-flame"></i>', name:'Unbreakable', desc:'50-day grammar streak', category:'streak', rarity:'legendary', check:g=>g.streak>=50, progress:g=>Math.min(g.streak/50*100,100) },
  { id:'g-streak-100', icon:'<i class="ti ti-skull"></i>', name:'Century Streak', desc:'100-day grammar streak', category:'streak', rarity:'legendary', check:g=>g.streak>=100, progress:g=>Math.min(g.streak/100*100,100) },

  { id:'g-early-bird', icon:'<i class="ti ti-sunrise"></i>', name:'Early Bird', desc:'Complete a grammar lesson before 8 AM', category:'lesson', rarity:'uncommon', check:g=>{const h=new Date().getHours();return h<8&&g.totalLessons>0;}, progress:g=>0 },
  { id:'g-night-owl', icon:'<i class="ti ti-owl"></i>', name:'Night Owl', desc:'Complete a grammar lesson after 10 PM', category:'lesson', rarity:'uncommon', check:g=>{const h=new Date().getHours();return h>=22&&g.totalLessons>0;}, progress:g=>0 },
  { id:'g-speed-quiz', icon:'<i class="ti ti-bolt"></i>', name:'Speed Demon', desc:'Complete a quiz in under 30 seconds', category:'quiz', rarity:'epic', check:g=>false, progress:g=>0 },
  { id:'g-daily-7', icon:'<i class="ti ti-calendar"></i>', name:'Weekly Challenge', desc:'Complete 7 daily challenges', category:'streak', rarity:'rare', check:g=>(g.dailyChallengeCount||0)>=7, progress:g=>Math.min((g.dailyChallengeCount||0)/7*100,100) },
  { id:'g-all-past', icon:'<i class="ti ti-scroll"></i>', name:'Past Master', desc:'Complete all past tenses', category:'tense', rarity:'rare', check:g=>['past-simple','past-continuous','past-perfect','past-perfect-continuous'].every(t=>g.completedLessons.includes(t)), progress:g=>{const arr=['past-simple','past-continuous','past-perfect','past-perfect-continuous'];const done=arr.filter(t=>g.completedLessons.includes(t)).length;return done/arr.length*100;} },
  { id:'g-all-future', icon:'<i class="ti ti-eye"></i>', name:'Future Visionary', desc:'Complete all future tenses', category:'tense', rarity:'rare', check:g=>['future-simple','future-continuous','future-perfect','future-perfect-continuous'].every(t=>g.completedLessons.includes(t)), progress:g=>{const arr=['future-simple','future-continuous','future-perfect','future-perfect-continuous'];const done=arr.filter(t=>g.completedLessons.includes(t)).length;return done/arr.length*100;} },
  { id:'g-modals-master', icon:'<i class="ti ti-theater"></i>', name:'Modal Master', desc:'Complete all modal verb lessons', category:'category', rarity:'rare', check:g=>g.completedLessons.includes('cat:modals'), progress:g=>g.completedLessons.includes('cat:modals')?100:0 },
  { id:'g-phrasal-master', icon:'<i class="ti ti-wrench"></i>', name:'Phrasal Pro', desc:'Complete all phrasal verb lessons', category:'category', rarity:'rare', check:g=>g.completedLessons.includes('cat:phrasal'), progress:g=>g.completedLessons.includes('cat:phrasal')?100:0 }
];

// =============================================
// GRAMMAR — UTILITY FUNCTIONS
// =============================================
// SECURE: Backend Integration — sync grammar to server


function saveGrammar() {
  localStorage.setItem('vm_grammar', JSON.stringify(state.grammar));
  if (typeof SECURE_API !== 'undefined') {
    SECURE_API.syncData(state.stats, state.favorites, state.recentWords, state.grammar);
  }
}

function getGrammarRank(xp) {
  for(let i=GRAMMAR_RANK_THRESHOLDS.length-1;i>=0;i--) if(xp>=GRAMMAR_RANK_THRESHOLDS[i].xp) return GRAMMAR_RANK_THRESHOLDS[i];
  return GRAMMAR_RANK_THRESHOLDS[0];
}

function getNextGrammarRank(xp) {
  for(let i=0;i<GRAMMAR_RANK_THRESHOLDS.length;i++) if(xp<GRAMMAR_RANK_THRESHOLDS[i].xp) return GRAMMAR_RANK_THRESHOLDS[i];
  return null;
}

function addGrammarXP(amount, reason='') {
  state.grammar.xp += amount;
  const rank = getGrammarRank(state.grammar.xp);
  const prevRank = state.grammar.rank;
  state.grammar.rank = rank.name;
  if(rank.name!==prevRank) {
    toast(`🏆 Grammar Rank Up! You're now ${rank.icon} ${rank.name}!`, 'achievement', 5000);
    confetti();
  } else if(reason) toast(`+${amount} Grammar XP — ${reason}`, 'success', 2000);
  saveGrammar();
}

function checkGrammarStreak() {
  const today = new Date().toDateString();
  if(state.grammar.lastDate!==today) {
    const y = new Date(); y.setDate(y.getDate()-1);
    if(state.grammar.lastDate===y.toDateString()) state.grammar.streak++;
    else if(state.grammar.lastDate==='') state.grammar.streak=1;
    else state.grammar.streak=1;
    state.grammar.lastDate=today;
    saveGrammar();
  }
}

function checkGrammarAchievements() {
  GRAMMAR_ACHIEVEMENTS.forEach(a=>{
    if(!state.grammar.achievements.includes(a.id) && a.check(state.grammar)) {
      state.grammar.achievements.push(a.id);
      if(!state.grammar.achUnlocked) state.grammar.achUnlocked = {};
      state.grammar.achUnlocked[a.id] = new Date().toISOString();
      saveGrammar();
      toast(`🏆 ${a.name} [${String(a.rarity || '').toUpperCase()}] — ${a.desc}`, 'achievement', 6000);
      confetti();
    }
  });
}

// =============================================
// GRAMMAR — MAIN RENDER
// =============================================
let grammarTab = 'dashboard';

function renderGrammar() {
  const el = document.getElementById('grammar-content');
  if (!el) return;
  checkGrammarStreak();
  renderGrammarTabs();
  if(grammarTab==='dashboard') renderGrammarDashboard();
  else if(grammarTab==='tenses') renderGrammarTensesList();
  else if(grammarTab==='quiz') renderGrammarQuizMenu();
  else if(grammarTab==='exercises') renderGrammarExercises();
  else if(grammarTab==='analytics') renderGrammarAnalytics();
  else if(grammarTab==='achievements') renderGrammarAchievements();
  else if(grammarTab==='ai') renderGrammarAI();
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>{
    if(n.getAttribute('onclick')&&n.getAttribute('onclick').includes("'grammar'")) n.classList.add('active');
  });
}

function renderGrammarTabs() {
  const tabs = [
    {id:'dashboard',icon:'dash',label:'Overview'},{id:'tenses',icon:'clock',label:'Tenses'},
    {id:'quiz',icon:'target',label:'Quiz'},{id:'exercises',icon:'edit',label:'Exercises'},
    {id:'analytics',icon:'chart',label:'Analytics',premium:true},{id:'achievements',icon:'medal',label:'Achievements'},{id:'ai',icon:'brain',label:'AI Tutor',premium:true}
  ];
  const el = document.getElementById('grammar-content');
  if (!el) return;
  el.innerHTML = `<div class="g-tabs">${tabs.map(t=>
    `<button class="g-tab ${grammarTab===t.id?'active':''}" onclick="switchGrammarTab('${t.id}')"><span>${ic(t.icon)}</span> ${t.label}${t.premium?' <span class="g-tab-premium">PREMIUM</span>':''}</button>`
  ).join('')}</div><div id="grammar-tab-content" class="g-page-in"></div>`;
  }

function switchGrammarTab(id) {
  if (id === 'ai' && typeof requirePremium === 'function' && !requirePremium('AI Tutor')) return;
  if (id === 'analytics' && typeof requirePremium === 'function' && !requirePremium('Grammar Analytics')) return;
  grammarTab=id;
  renderGrammar();
  window.scrollTo({top:0,behavior:'smooth'});
}

function openGrammarTenses() { grammarTab='tenses'; renderGrammar(); }
function openGrammarQuiz() { grammarTab='quiz'; renderGrammar(); }


// =============================================
// GRAMMAR — DASHBOARD
// =============================================
function renderGrammarDashboard() {
  const g = state.grammar;
  const rank = getGrammarRank(g.xp);
  const totalTenses = GRAMMAR_TENSES.length;
  const completedTenses = GRAMMAR_TENSES.filter(t=>g.completedLessons.includes(t.id)).length;
  const pct = totalTenses ? Math.round(completedTenses/totalTenses*100) : 0;
  const nextRankName = getNextGrammarRank(g.xp);
  const nextRankXp = nextRankName ? nextRankName.xp - g.xp : 0;
  const rankProgress = nextRankName ? Math.min(100, Math.round(((g.xp - (getGrammarRank(g.xp).xp)) / (nextRankName.xp - getGrammarRank(g.xp).xp)) * 100)) : 100;
  const isDaily = g.dailyChallenge && g.dailyChallenge.date === new Date().toDateString();

  const groups = ['Present Tenses','Past Tenses','Future Tenses'];
  const groupStats = groups.map(gr => {
    const tenses = GRAMMAR_TENSES.filter(t=>t.group===gr);
    const done = tenses.filter(t=>g.completedLessons.includes(t.id)).length;
    return { group:gr, done, total:tenses.length, pct:Math.round(done/tenses.length*100) };
  });
  const totalCats = GRAMMAR_CATEGORIES.length;
  const completedCats = GRAMMAR_CATEGORIES.filter(c=>g.completedLessons.includes('cat:'+c.id)).length;
  const accuracy = g.totalQuestions ? Math.round(g.totalCorrect/g.totalQuestions*100) : 0;

  document.getElementById('grammar-tab-content').innerHTML = `
    <div class="g-dash-stats">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
        <div class="g-hero-stats">
          <div class="g-hero-stat" data-accent="#5856D6">
            <div class="g-hero-val" style="color:#5856D6">${g.xp}</div>
            <div class="g-hero-lbl">Grammar XP</div>
          </div>
          <div class="g-hero-stat" data-accent="#34C759">
            <div class="g-hero-val" style="color:#34C759">${completedTenses}/${totalTenses}</div>
            <div class="g-hero-lbl">Tenses Mastered</div>
          </div>
          <div class="g-hero-stat" data-accent="#FF9F0A">
            <div class="g-hero-val" style="color:#FF9F0A">${g.streak}</div>
            <div class="g-hero-lbl">Day Streak</div>
          </div>
          <div class="g-hero-stat" data-accent="#30B0C7">
            <div class="g-hero-val" style="color:#30B0C7">${g.totalLessons}</div>
            <div class="g-hero-lbl">Lessons Done</div>
          </div>
        </div>
        <div class="g-rank-badge ${String(rank.name).toLowerCase()}">${rank.icon} ${rank.name}</div>
      </div>
      ${nextRankName ? `<div class="g-rank-progress"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--ios-secondary-label);margin-bottom:4px"><span>${rank.icon} ${rank.name}</span><span>${nextRankName.icon} ${nextRankName.name} (${nextRankXp} XP away)</span></div><div class="g-rank-track"><div class="g-rank-fill" style="width:${rankProgress}%"></div></div></div>` : ''}
    </div>

    <div class="g-grid-2" style="margin-bottom:28px">
      <div class="g-card">
        <div class="g-section-title"><span style="margin-right:6px">${ic('rocket')}</span>Quick Actions</div>
        ${g.completedLessons.length===0 ? `<div style="color:var(--ios-secondary-label);font-size:14px;margin-bottom:16px">Start with the tenses below! Click any tense to begin.</div>` :
          `<div style="color:var(--ios-secondary-label);font-size:14px;margin-bottom:16px">Continue your grammar journey.</div>`}
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="switchGrammarTab('tenses')"><span style="margin-right:6px">${ic('book')}</span> Study Tenses</button>
          <button class="btn btn-ghost" onclick="switchGrammarTab('exercises')"><span style="margin-right:6px">${ic('edit')}</span> Practice</button>
          <button class="btn btn-ghost" onclick="switchGrammarTab('quiz')"><span style="margin-right:6px">${ic('target')}</span> Quiz</button>
        </div>
      </div>
      ${isDaily ? `<div class="g-daily-card" onclick="showGrammarChallengeResult()">
        <div style="font-size:38px">${ic('check',28)}</div>
        <div>
          <div class="g-daily-title">Daily Challenge Complete!</div>
          <div class="g-daily-sub">Come back tomorrow for a new challenge</div>
        </div>
      </div>` : (typeof getCurrentPlan !== 'function' || getCurrentPlan() !== 'Free') ? `<div class="g-daily-card" onclick="startGrammarDailyChallenge()">
        <div style="font-size:38px">${ic('target',28)}</div>
        <div>
          <div class="g-daily-title">Daily Grammar Challenge</div>
          <div class="g-daily-sub">Complete today's challenge for bonus XP</div>
        </div>
      </div>` : `<div class="g-daily-card" onclick="requirePremium('Daily challenges & bonus XP')" style="opacity:0.5">
        <div style="font-size:38px">${ic('lock',28)}</div>
        <div>
          <div class="g-daily-title">Daily Grammar Challenge</div>
          <div class="g-daily-sub" style="color:var(--ios-orange)">Premium feature — upgrade to unlock</div>
        </div>
      </div>`}
    </div>

    <div class="g-card" style="margin-bottom:24px">
      <div class="g-section-title" style="margin-bottom:14px"><span style="margin-right:6px">${ic('chart')}</span> Your Progress</div>
      <div class="g-progress-grid">
        <div class="g-progress-item">
          <div class="g-progress-val" style="color:#5856D6">${completedTenses}/${totalTenses}</div>
          <div class="g-progress-lbl">Tenses</div>
        </div>
        <div class="g-progress-item">
          <div class="g-progress-val" style="color:#34C759">${completedCats}/${totalCats}</div>
          <div class="g-progress-lbl">Categories</div>
        </div>
        <div class="g-progress-item" data-accent="#FF9F0A">
          <div class="g-progress-val" style="color:#FF9F0A">${accuracy}%</div>
          <div class="g-progress-lbl">Accuracy</div>
        </div>
        <div class="g-progress-item">
          <div class="g-progress-val" style="color:#30B0C7">${g.totalQuizzes}</div>
          <div class="g-progress-lbl">Quizzes</div>
        </div>
      </div>
      <div class="g-group-grid">
        ${groupStats.map(gr => `
          <div class="g-group-item">
            <div style="font-size:10px;color:var(--ios-tertiary-label);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px">${gr.group.replace(' Tenses','')}</div>
            <div style="font-size:18px;font-weight:700;font-family:var(--font-display);color:${gr.pct===100?'#34C759':'#5856D6'}">${gr.done}/${gr.total}</div>
            <div class="g-bar-track" style="margin-top:6px"><div class="g-bar-fill" style="width:${gr.pct}%"></div></div>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div class="g-section-title" style="margin:0"><span style="margin-right:4px">${ic('folder')}</span> Grammar Categories</div>
      <div style="flex:1;max-width:220px"><input type="text" class="search-filter-input" placeholder="Search categories..." oninput="filterGrammarCards(this.value,'cat')"></div>
    </div>
    <div class="grammar-category-grid" id="grammar-cat-grid">
      ${GRAMMAR_CATEGORIES.slice(0,12).map(c=>{
        const done = g.completedLessons.includes('cat:'+c.id);
        return `<div class="grammar-cat-card ${done?'completed':''}" onclick="openCategoryLesson('${c.id}')" data-name="${c.name.toLowerCase()}">
          <div class="grammar-cat-icon"><span>${c.icon}</span></div>
          <div class="grammar-cat-name">${c.name}</div>
          <div class="grammar-cat-count">${done?ic('check',12)+' Completed':ic('book',12)+' Click to study'}</div>
          <div class="grammar-cat-progress"><div class="grammar-cat-fill" style="width:${done?100:0}%"></div></div>
        </div>`;
      }).join('')}
    </div>

    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;margin-top:8px">
      <div class="g-section-title" style="margin:0"><span style="margin-right:4px">${ic('clock')}</span> Quick Tense Overview</div>
      <div style="flex:1;max-width:220px"><input type="text" class="search-filter-input" placeholder="Search tenses..." oninput="filterGrammarCards(this.value,'tense')"></div>
    </div>
    <div class="grammar-tense-grid" id="grammar-tense-grid">
      ${GRAMMAR_TENSES.map(t=>{
        const done = g.completedLessons.includes(t.id);
        return `<div class="grammar-tense-card ${done?'completed':''}" onclick="openTenseLesson('${t.id}')" data-name="${t.name.toLowerCase()}">
          <div class="tense-group">${t.group}</div>
          <div class="tense-name"><span>${t.icon}</span> ${t.name}</div>
          <div class="tense-formula">${t.formula}</div>
          <div class="tense-status ${done?'completed':'locked'}">
            ${done ? ic('check',12)+' Completed' : ic('book',12)+' Click to study'}
          </div>
        </div>`;
      }).join('')}
    </div>
  `;
}

function filterGrammarCards(query, type) {
  query = query.toLowerCase().trim();
  const sel = type === 'cat' ? '#grammar-cat-grid .grammar-cat-card' : '#grammar-tense-grid .grammar-tense-card';
  document.querySelectorAll(sel).forEach(el => {
    el.style.display = !query || (el.getAttribute('data-name')||'').includes(query) ? '' : 'none';
  });
}

// =============================================
// GRAMMAR — TENSES LIST
// =============================================
function renderGrammarTensesList() {
  const g = state.grammar;
  const groups = ['Present Tenses','Past Tenses','Future Tenses'];
  document.getElementById('grammar-tab-content').innerHTML =
    `<div class="g-tenses-hero">
      <div class="g-tenses-hero-inner">
        <div class="g-tenses-hero-icon">${ic('clock',38)}</div>
        <div class="g-tenses-hero-title">Complete English Tenses</div>
        <div class="g-tenses-hero-sub">Master all 12 English tenses with detailed explanations, examples, and interactive lessons.</div>
      </div>
    </div>
    ${groups.map(group=>`
      <div class="g-tenses-group-title"><span>${group==='Present Tenses'?ic('sun'):group==='Past Tenses'?ic('refresh'):ic('zap')}</span> ${group}</div>
      <div class="grammar-tense-grid">
        ${GRAMMAR_TENSES.filter(t=>t.group===group).map(t=>{
          const done = g.completedLessons.includes(t.id);
          return `<div class="grammar-tense-card ${done?'completed':''}" onclick="openTenseLesson('${t.id}')">
            <div class="tense-group">${t.group}</div>
            <div class="tense-name"><span>${t.icon}</span> ${t.name}</div>
            <div class="tense-formula">${t.formula}</div>
            <div class="tense-status ${done?'completed':'locked'}">
            ${done ? ic('check',12)+' Completed' : ic('book',12)+' Start Lesson'}
          </div>
          </div>`;
        }).join('')}
      </div>
    `).join('')}`;
}

// =============================================
// GRAMMAR — TENSE LESSON
// =============================================
let currentTenseId = null;

function openTenseLesson(id) {
  currentTenseId = id;
  const t = GRAMMAR_TENSES.find(t=>t.id===id);
  if(!t) return;
  const el = document.getElementById('grammar-tab-content');
  if (!el) return;
  const g = state.grammar;
  const done = g.completedLessons.includes(id);

  el.innerHTML = `
    <div class="grammar-lesson-view">
      <div class="grammar-lesson-header">
        <div class="grammar-lesson-back" onclick="switchGrammarTab('tenses')">${ic('back')} Back to Tenses</div>
        <div class="grammar-lesson-group">${t.group}</div>
        <div class="grammar-lesson-title">${t.icon} ${t.name}</div>
        ${done ? '<span class="badge badge-emerald" style="margin-top:8px">'+ic('check',12)+' Completed</span>' : '<span class="badge badge-accent" style="margin-top:8px">'+ic('book',12)+' In Progress</span>'}
      </div>

      <div class="grammar-section-card">
        <div class="sec-title">${ic('zap')} Structure</div>
        <div class="grammar-formula-box">${t.formula}</div>
      </div>

      <div class="grammar-section-card">
        <div class="sec-title">${ic('book')} Explanation</div>
        <div style="margin-bottom:12px">
          <div style="font-weight:600;color:var(--emerald2);font-size:13px;margin-bottom:4px">${ic('sun',15)} Beginner</div>
          <div style="font-size:14px;color:var(--text1);line-height:1.6">${t.beginner}</div>
        </div>
        <div style="margin-bottom:12px">
          <div style="font-weight:600;color:var(--accent2);font-size:13px;margin-bottom:4px">${ic('zap',15)} Advanced</div>

(Showing lines 848-858)
          <div style="font-size:14px;color:var(--text1);line-height:1.6">${t.advanced}</div>
        </div>
        <div style="margin-bottom:12px">
          <div style="font-weight:600;color:var(--amber2);font-size:13px;margin-bottom:4px">${ic('medal',15)} IELTS</div>
          <div style="font-size:14px;color:var(--text1);line-height:1.6">${t.ielts}</div>
        </div>
        <div>
          <div style="font-weight:600;color:var(--cyan2);font-size:13px;margin-bottom:4px">${ic('edit',15)} SAT / Academic</div>
          <div style="font-size:14px;color:var(--text1);line-height:1.6">${t.academic}</div>
        </div>
      </div>

      <div class="grammar-section-card">
        <div class="sec-title"><span>${ic('check')}</span> Examples</div>
        <div class="grammar-example-grid">
          ${t.positive.map(ex=>`<div class="grammar-example positive"><span class="ex-icon">✅</span><span class="ex-text">${ex}</span></div>`).join('')}
          ${t.negative.map(ex=>`<div class="grammar-example negative"><span class="ex-icon">❌</span><span class="ex-text">${ex}</span></div>`).join('')}
          ${t.question.map(ex=>`<div class="grammar-example question"><span class="ex-icon">❓</span><span class="ex-text">${ex}</span></div>`).join('')}
        </div>
      </div>

      ${t.mistakes ? `<div class="grammar-section-card">
        <div class="sec-title"><span>${ic('zap')}</span> Common Mistakes</div>
        ${t.mistakes.map(m=>`
          <div class="grammar-mistake wrong"><span class="mistake-label">❌</span> ${m.wrong}</div>
          <div class="grammar-mistake correct"><span class="mistake-label">✅</span> ${m.correct}</div>
        `).join('')}
      </div>` : ''}

      <div class="grammar-section-card">
        <div class="sec-title"><span>${ic('clock')}</span> Time Expressions & Usage</div>
        <div style="margin-bottom:12px">
          <div style="font-weight:600;color:var(--cyan2);font-size:12px;margin-bottom:6px">Signal Words</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${t.timeExpressions.map(e=>`<span class="tag rel" style="cursor:default">${e}</span>`).join('')}
          </div>
        </div>
        <div>
          <div style="font-weight:600;color:var(--accent2);font-size:12px;margin-bottom:6px">Usage Types</div>
          <ul style="font-size:14px;color:var(--text1);line-height:1.8;padding-left:20px">
            ${t.usage.map(u=>`<li>${u}</li>`).join('')}
          </ul>
        </div>
      </div>

      ${t.tips ? `<div class="grammar-section-card" style="background:rgba(251,191,36,0.06);border-color:rgba(251,191,36,0.15)">
        <div class="sec-title"><span>${ic('star')}</span> Pro Tip</div>
        <div style="font-size:14px;color:var(--text1);line-height:1.6;padding:4px 0">${t.tips}</div>
      </div>` : ''}

      ${t.compare ? `<div class="grammar-section-card" style="background:rgba(59,130,246,0.06);border-color:rgba(59,130,246,0.15)">
        <div class="sec-title"><span>${ic('refresh')}</span> Don't Confuse With</div>
        <div style="font-size:14px;color:var(--text1);line-height:1.6;padding:4px 0">
          <strong style="color:var(--accent2)">${GRAMMAR_TENSES.find(ot=>ot.id===t.compare.with)?.name || t.compare.with}</strong>: ${t.compare.note}
        </div>
      </div>` : ''}

      <div style="display:flex;gap:12px;justify-content:center;margin-top:28px;margin-bottom:40px">
        ${done ? `<button class="btn btn-outline" onclick="markTenseIncomplete('${t.id}')">${ic('refresh')} Mark Incomplete</button>` :
          `<button class="btn btn-primary btn-lg" onclick="completeTenseLesson('${t.id}')">${ic('check')} Complete Lesson (+20 XP)</button>`}
        <button class="btn btn-ghost" onclick="startGrammarTenseQuiz('${t.id}')">${ic('target')} Take Quiz</button>
      </div>
    </div>
  `;
  window.scrollTo({top:0,behavior:'smooth'});
}

function completeTenseLesson(id) {
  const g = state.grammar;
  if(!g.completedLessons.includes(id)) {
    g.completedLessons.push(id);
    g.totalLessons++;
    addGrammarXP(20, 'Completed lesson');
    checkGrammarAchievements();
    toast('"'+GRAMMAR_TENSES.find(t=>t.id===id)?.name+'" completed!', 'success', 3000);
    openTenseLesson(id);
  }
}

function markTenseIncomplete(id) {
  const g = state.grammar;
  const idx = g.completedLessons.indexOf(id);
  if(idx>-1) { g.completedLessons.splice(idx,1); g.totalLessons = Math.max(0,g.totalLessons-1); saveGrammar(); }
  openTenseLesson(id);
}

// =============================================
// GRAMMAR — CATEGORY LESSON
// =============================================
function openCategoryLesson(catId) {
  const data = GRAMMAR_CATEGORY_DATA[catId];
  const cat = GRAMMAR_CATEGORIES.find(c=>c.id===catId);
  if(!data || !cat) { toast('Category not found','error'); return; }
  const el = document.getElementById('grammar-tab-content');
  if (!el) return;
  const g = state.grammar;
  const done = g.completedLessons.includes('cat:'+catId);

  el.innerHTML = `
    <div class="grammar-lesson-view">
      <div class="grammar-lesson-header">
        <div class="grammar-lesson-back" onclick="switchGrammarTab('dashboard')">${ic('back')} Back to Dashboard</div>
        <div class="grammar-lesson-group">Grammar Category</div>
        <div class="grammar-lesson-title">${cat.icon} ${cat.name}</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:4px">${cat.desc}</div>
        ${done ? '<span class="badge badge-emerald">'+ic('check',12)+' Completed</span>' : '<span class="badge badge-accent">'+ic('book',12)+' Not Started</span>'}
      </div>

      <div class="grammar-section-card">
        <div class="sec-title"><span>${ic('zap')}</span> Structure</div>
        <div class="grammar-formula-box">${data.formula || 'Formula: see description below'}</div>
      </div>

      <div class="grammar-section-card">
        <div class="sec-title"><span>${ic('book')}</span> Explanation</div>
        <div style="margin-bottom:12px">
          <div style="font-weight:600;color:var(--emerald2);font-size:13px;margin-bottom:4px">${ic('sun',15)} Beginner</div>
          <div style="font-size:14px;color:var(--text1);line-height:1.6">${data.beginner || 'N/A'}</div>
        </div>
        <div style="margin-bottom:12px">
          <div style="font-weight:600;color:var(--accent2);font-size:13px;margin-bottom:4px">${ic('zap',15)} Advanced</div>
          <div style="font-size:14px;color:var(--text1);line-height:1.6">${data.advanced || 'N/A'}</div>
        </div>
        <div style="margin-bottom:12px">
          <div style="font-weight:600;color:var(--amber2);font-size:13px;margin-bottom:4px">${ic('medal',15)} IELTS</div>
          <div style="font-size:14px;color:var(--text1);line-height:1.6">${data.ielts || 'N/A'}</div>
        </div>
      </div>

      <div class="grammar-section-card">
        <div class="sec-title"><span>${ic('check')}</span> Examples</div>
        <div class="grammar-example-grid">
          ${(data.positive||[]).map(ex=>'<div class="grammar-example positive"><span class="ex-icon">✅</span><span class="ex-text">'+ex+'</span></div>').join('')}
          ${(data.negative||[]).map(ex=>'<div class="grammar-example negative"><span class="ex-icon">❌</span><span class="ex-text">'+ex+'</span></div>').join('')}
          ${(data.question||[]).map(ex=>'<div class="grammar-example question"><span class="ex-icon">❓</span><span class="ex-text">'+ex+'</span></div>').join('')}
        </div>
      </div>

      ${data.mistakes ? `<div class="grammar-section-card"><div class="sec-title"><span>${ic('zap')}</span> Common Mistakes</div>`+
        data.mistakes.map(m=>'<div class="grammar-mistake wrong"><span class="mistake-label">❌</span> '+m.wrong+'</div><div class="grammar-mistake correct"><span class="mistake-label">✅</span> '+m.correct+'</div>').join('')+'</div>' : ''}

      <div class="grammar-section-card">
        <div class="sec-title"><span>${ic('folder')}</span> Usage</div>
        <ul style="font-size:14px;color:var(--text1);line-height:1.8;padding-left:20px">
          ${(data.usage||[]).map(u=>'<li>'+u+'</li>').join('')}
        </ul>
      </div>

      <div style="display:flex;gap:12px;justify-content:center;margin-top:28px;margin-bottom:40px">
        ${done
          ? '<button class="btn btn-outline" onclick="markCategoryIncomplete(\''+catId+'\')">'+ic('refresh')+' Mark Incomplete</button>'
          : '<button class="btn btn-primary btn-lg" onclick="completeCategoryLesson(\''+catId+'\')">'+ic('check')+' Complete Lesson (+15 XP)</button>'}
        <button class="btn btn-ghost" onclick="switchGrammarTab('quiz')">${ic('target')} Take Quiz</button>
        <button class="btn btn-outline" onclick="startGrammarCategoryQuiz('${catId}')">${ic('edit')} Category Quiz</button>
      </div>
    </div>
  `;
  window.scrollTo({top:0,behavior:'smooth'});
}

function completeCategoryLesson(catId) {
  const g = state.grammar;
  const key = 'cat:'+catId;
  if(!g.completedLessons.includes(key)) {
    g.completedLessons.push(key);
    g.totalLessons++;
    addGrammarXP(15, 'Completed category: '+catId);
    checkGrammarAchievements();
    toast('Category completed!', 'success', 3000);
    openCategoryLesson(catId);
  }
}

function markCategoryIncomplete(catId) {
  const g = state.grammar;
  const key = 'cat:'+catId;
  const idx = g.completedLessons.indexOf(key);
  if(idx>-1) { g.completedLessons.splice(idx,1); g.totalLessons = Math.max(0,g.totalLessons-1); saveGrammar(); }
  openCategoryLesson(catId);
}

// =============================================
// GRAMMAR — QUIZ
// =============================================
let grammarQuizState = null;

function renderGrammarQuizMenu() {
  document.getElementById('grammar-tab-content').innerHTML = `
    <div class="g-quiz-hero">
      <div class="g-quiz-hero-inner">
        <div class="g-quiz-hero-icon">${ic('target',40)}</div>
        <div class="g-quiz-hero-title">Grammar Quiz</div>
        <div class="g-quiz-hero-sub">Test your knowledge with tense-based or category-based quizzes.</div>
      </div>
    </div>

    <div class="g-quiz-section-title"><span>${ic('clock')}</span>Tense Quizzes</div>
    <div class="g-quiz-grid">
      <div class="g-quiz-card" onclick="startGrammarQuiz('mixed')">
        <div class="g-quiz-card-icon">${ic('target')}</div>
        <div class="g-quiz-card-title">Mixed Tenses</div>
        <div class="g-quiz-card-desc">10 questions • All tenses</div>
        <button class="btn btn-primary btn-sm">Start Quiz</button>
      </div>
      <div class="g-quiz-card" onclick="startGrammarQuiz('present')">
        <div class="g-quiz-card-icon">${ic('sun')}</div>
        <div class="g-quiz-card-title">Present Tenses</div>
        <div class="g-quiz-card-desc">Simple • Continuous • Perfect</div>
        <button class="btn btn-ghost btn-sm">Start Quiz</button>
      </div>
      <div class="g-quiz-card" onclick="startGrammarQuiz('past')">
        <div class="g-quiz-card-icon">${ic('refresh')}</div>
        <div class="g-quiz-card-title">Past Tenses</div>
        <div class="g-quiz-card-desc">Simple • Continuous • Perfect</div>
        <button class="btn btn-ghost btn-sm">Start Quiz</button>
      </div>
      <div class="g-quiz-card" onclick="startGrammarQuiz('future')">
        <div class="g-quiz-card-icon">${ic('zap')}</div>
        <div class="g-quiz-card-title">Future Tenses</div>
        <div class="g-quiz-card-desc">Simple • Continuous • Perfect</div>
        <button class="btn btn-ghost btn-sm">Start Quiz</button>
      </div>
    </div>

    <div class="g-quiz-section-title"><span>${ic('folder')}</span>Category Quizzes</div>
    <div class="g-quiz-grid">
      ${GRAMMAR_CATEGORIES.slice(0,8).map(c=>`
        <div class="g-quiz-card" onclick="startGrammarCategoryQuiz('${c.id}')">
          <div class="g-quiz-card-icon">${c.icon}</div>
          <div class="g-quiz-card-title">${c.name}</div>
          <div class="g-quiz-card-desc">${c.desc}</div>
          <button class="btn btn-ghost btn-sm">Start Quiz</button>
        </div>
      `).join('')}
    </div>

    <div style="text-align:center;margin-bottom:16px">
      <button class="btn btn-ghost btn-sm" onclick="switchGrammarTab('exercises')">${ic('edit')} Try Grammar Exercises Instead</button>
    </div>

    ${state.grammar.totalQuizzes>0 ? `<div class="g-card" style="text-align:center;padding:20px">
      <div style="font-size:14px;color:var(--ios-secondary-label)">${ic('chart',14)} Quizzes: <strong style="color:#5856D6">${state.grammar.totalQuizzes}</strong> | Accuracy: <strong style="color:#34C759">${state.grammar.totalQuestions ? Math.round(state.grammar.totalCorrect/state.grammar.totalQuestions*100) : 0}%</strong></div>
    </div>` : ''}`;
}

function startGrammarTenseQuiz(tenseId) {
  const t = GRAMMAR_TENSES.find(t=>t.id===tenseId);
  if(!t) return;
  const questions = [];
  [...t.positive,...t.negative,...t.question].forEach(ex=>{
    const blanked = ex.replace(/\b\w+\b/g, m=>Math.random()>0.4?m:'________');
    if(blanked!==ex) questions.push({q:blanked,a:ex,d:t.name});
  });
  // Add fill-in-the-blank from formula
  const formulaWords = t.formula.split(' ');
  const qWords = [...formulaWords];
  const blankIdx = Math.floor(Math.random()*qWords.length);
  const answer = qWords[blankIdx];
  qWords[blankIdx] = '________';
  questions.push({q:`${t.name}: ${qWords.join(' ')}`,a:answer,d:t.name});

  grammarQuizState = { questions:questions.sort(()=>Math.random()-0.5).slice(0,10), current:0, score:0, total:Math.min(10,questions.length), mode:'tense' };
  renderGrammarQuizQuestion();
}

function startGrammarQuiz(mode) {
  let questions = [];
  const tenses = mode==='present' ? GRAMMAR_TENSES.filter(t=>t.group==='Present Tenses') :
                  mode==='past' ? GRAMMAR_TENSES.filter(t=>t.group==='Past Tenses') :
                  mode==='future' ? GRAMMAR_TENSES.filter(t=>t.group==='Future Tenses') : GRAMMAR_TENSES;

    tenses.forEach(t=>{
      const allEx = [...t.positive,...t.negative,...t.question];
      const ex = allEx[Math.floor(Math.random()*allEx.length)];
      if(!ex) return;
      const words = ex.split(' ');
      const idx = Math.floor(Math.random()*words.length);
      const a = words[idx].replace(/[^a-zA-Z'-]/g,'');
      if(!a||a.length<2) return;
      words[idx]='________';
      questions.push({q:ex.replace(a,'________'),a:a,d:t.name});
    });

  if(questions.length<5) {
    // Add formula questions
    tenses.forEach(t=>{
      const f = t.formula;
      const words = f.split(' ');
      const idx = Math.floor(Math.random()*words.length);
      const a = words[idx].replace(/[^a-zA-Z'-]/g,'');
      if(a&&a.length>1) questions.push({q:`${t.name}: Fill the formula — ${f.replace(a,'________')}`,a:a,d:t.name});
    });
  }

  grammarQuizState = { questions:questions.sort(()=>Math.random()-0.5).slice(0,10), current:0, score:0, total:Math.min(10,questions.length), mode };
  renderGrammarQuizQuestion();
}

function renderGrammarQuizQuestion() {
  const gqs = grammarQuizState;
  if(!gqs || gqs.current>=gqs.questions.length) { showGrammarQuizResult(); return; }
  const q = gqs.questions[gqs.current];
  const pct = (gqs.current/gqs.total)*100;
  const tab = document.getElementById('grammar-tab-content');
  if (!tab) return;
  tab.innerHTML = `
    <div class="grammar-quiz-container">
      <div class="g-quiz-progress"><div class="g-quiz-fill" style="width:${pct}%"></div></div>
      <div class="g-quiz-info">
        <span>Question ${gqs.current+1} of ${gqs.total}</span>
        <span>Score: ${gqs.score}</span>
      </div>
      ${q.d ? `<div class="g-quiz-badge-row"><span class="badge badge-accent">${q.d}</span></div>` : ''}
      <div class="g-quiz-word">${q.q}</div>
      <div class="g-quiz-options" id="grammar-q-options">
        ${generateGrammarQuizOptions(q)}
      </div>
      <div class="g-quiz-feedback" id="grammar-q-feedback"></div>
    </div>
  `;
}

function generateGrammarQuizOptions(q) {
  // Generate plausible wrong answers based on context
  const allWords = [];
  GRAMMAR_TENSES.forEach(t=>{
    [...t.positive,...t.negative,...t.question].forEach(ex=>{
      ex.split(' ').forEach(w=>{const c=w.replace(/[^a-zA-Z'-]/g,''); if(c.length>1) allWords.push(c);});
    });
  });
  const wrongs = allWords.filter(w=>String(w).toLowerCase()!==String(q.a).toLowerCase()).sort(()=>Math.random()-0.5).slice(0,3);
  const opts = [q.a,...wrongs].sort(()=>Math.random()-0.5);
  return opts.map(o=>`<div class="g-quiz-opt" onclick="answerGrammarQuiz(this,'${o.replace(/'/g,"\\'")}','${q.a.replace(/'/g,"\\'")}')">${o}</div>`).join('');
}

function answerGrammarQuiz(el, answer, correct) {
  document.querySelectorAll('.g-quiz-opt').forEach(e=>e.classList.add('locked'));
  const isCorrect = answer===correct;
  if(isCorrect) { el.classList.add('correct'); grammarQuizState.score++; }
  else { el.classList.add('wrong'); document.querySelectorAll('.g-quiz-opt').forEach(e=>{if(e.textContent===correct)e.classList.add('correct');}); }
  const fb = document.getElementById('grammar-q-feedback');
  if(fb) {
    fb.className = `g-quiz-feedback show ${isCorrect?'correct':'wrong'}`;
    fb.textContent = isCorrect ? '✅ Correct!' : `❌ Wrong. The correct answer was: "${correct}"`;
  }
  setTimeout(()=>{grammarQuizState.current++;renderGrammarQuizQuestion();},1000);
}

function showGrammarQuizResult() {
  const gqs = grammarQuizState;
  const pct = gqs.total ? Math.round(gqs.score/gqs.total*100) : 0;
  const g = state.grammar;
  g.totalQuizzes++;
  g.totalCorrect += gqs.score;
  g.totalQuestions += gqs.total;
  addGrammarXP(gqs.score*3, `Quiz: ${gqs.score}/${gqs.total} correct`);
  checkGrammarAchievements();
  if(pct===100) confetti();
  const tab = document.getElementById('grammar-tab-content');
  if (!tab) return;
  tab.innerHTML = `
    <div class="g-quiz-result">
      <div class="g-quiz-result-icon">${pct>=90?ic('trophy',56):pct>=70?ic('medal',56):pct>=50?ic('target',56):ic('zap',56)}</div>
      <div class="g-quiz-result-title">Quiz Complete!</div>
      <div class="g-quiz-result-score">${gqs.score} / ${gqs.total} correct (${pct}%)</div>
      <div class="g-quiz-result-xp">+${gqs.score*3} Grammar XP earned</div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="startGrammarQuiz('${gqs.mode}')">Try Again</button>
        <button class="btn btn-ghost" onclick="switchGrammarTab('quiz')">${ic('back')} Back to Quiz Menu</button>
      </div>
    </div>`;
  grammarQuizState = null;
}

// =============================================
// GRAMMAR — DAILY CHALLENGE
// =============================================
function startGrammarDailyChallenge() {
  if (typeof requirePremium === 'function' && !requirePremium('Daily challenges & bonus XP')) return;
  const today = new Date().toDateString();
  const t = GRAMMAR_TENSES[Math.floor(Math.random()*GRAMMAR_TENSES.length)];
  const questions = [...t.positive,...t.negative,...t.question].slice(0,5);
  state.grammar.dailyChallenge = { date:today, tense:t.id, questions, current:0, score:0 };
  saveGrammar();
  renderGrammarDailyChallenge();
}

function renderGrammarDailyChallenge() {
  const dc = state.grammar.dailyChallenge;
  if(!dc || dc.current>=dc.questions.length) { showGrammarChallengeResult(); return; }
  const q = dc.questions[dc.current];
  const words = q.split(' ');
  const idx = Math.floor(Math.random()*words.length);
  const a = words[idx].replace(/[^a-zA-Z'-]/g,'');
  if(!a) { dc.current++; renderGrammarDailyChallenge(); return; }
  words[idx] = '________';
  const display = words.join(' ');
  const wrongs = GRAMMAR_TENSES.flatMap(t=>[...t.positive,...t.negative,...t.question]).flatMap(ex=>ex.split(' ')).map(w=>w.replace(/[^a-zA-Z'-]/g,'')).filter(w=>w.length>1&&w!==a).sort(()=>Math.random()-0.5).slice(0,3);
  const opts = [a,...wrongs].sort(()=>Math.random()-0.5);
  const dcEl = document.getElementById('grammar-tab-content');
  if (!dcEl) return;
  dcEl.innerHTML = `
    <div class="section-title">${ic('target')} Daily Challenge</div>
    <div style="max-width:600px;margin:0 auto">
      <div class="grammar-q-progress"><div class="grammar-q-fill" style="width:${(dc.current/dc.questions.length)*100}%"></div></div>
      <div class="grammar-q-info"><div class="grammar-q-num">Challenge ${dc.current+1} of ${dc.questions.length}</div><div class="grammar-q-score">Score: ${dc.score}</div></div>
      <div style="font-family:var(--font-display);font-size:20px;font-weight:600;margin-bottom:20px;line-height:1.6;text-align:center">${display}</div>
      <div class="grammar-q-options">${opts.map(o=>`<div class="grammar-q-opt" onclick="answerDailyChallenge(this,'${o}','${a}')">${o}</div>`).join('')}</div>
    </div>`;
}

function answerDailyChallenge(el, answer, correct) {
  document.querySelectorAll('.grammar-q-opt').forEach(e=>e.classList.add('locked'));
  const dc = state.grammar.dailyChallenge;
  if(answer===correct) { el.classList.add('correct'); dc.score++; addGrammarXP(5,'Daily challenge'); }
  else { el.classList.add('wrong'); document.querySelectorAll('.grammar-q-opt').forEach(e=>{if(e.textContent===correct)e.classList.add('correct');}); }
  dc.current++;
  setTimeout(()=>renderGrammarDailyChallenge(),800);
}

function showGrammarChallengeResult() {
  const dc = state.grammar.dailyChallenge;
  const pct = dc.questions.length ? Math.round(dc.score/dc.questions.length*100) : 0;
  addGrammarXP(10,'Daily challenge bonus');
  state.grammar.dailyChallengeCount = (state.grammar.dailyChallengeCount || 0) + 1;
  saveGrammar();
  checkGrammarAchievements();
  if(pct===100) confetti();
  const scrEl = document.getElementById('grammar-tab-content');
  if (!scrEl) return;
  scrEl.innerHTML = `
    <div style="text-align:center;padding:40px">
      <div style="margin-bottom:16px">${ic(pct>=80?'trophy':'medal',72)}</div>
      <div style="font-family:var(--font-display);font-size:28px;font-weight:800;margin-bottom:8px">Daily Challenge Complete!</div>
      <div style="font-size:18px;color:var(--accent2);margin-bottom:24px">${dc.score}/${dc.questions.length} correct</div>
      <button class="btn btn-primary" onclick="switchGrammarTab('dashboard')">${ic('back')} Back to General</button>
    </div>`;
  checkGrammarAchievements();
}

// =============================================
// GRAMMAR — CATEGORY QUIZ
// =============================================
function startGrammarCategoryQuiz(catId) {
  const cat = GRAMMAR_CATEGORY_DATA[catId];
  if(!cat) return;
  const questions = [];
  const allExamples = [...(cat.positive||[]), ...(cat.negative||[]), ...(cat.question||[])];
  allExamples.forEach(ex => {
    const words = ex.split(' ');
    const idx = Math.floor(Math.random()*words.length);
    const a = words[idx].replace(/[^a-zA-Z'-]/g,'');
    if(!a||a.length<2) return;
    words[idx]='________';
    questions.push({q:words.join(' '),a:a,d:cat.name||catId});
  });
  if(questions.length<5) {
    Object.values(GRAMMAR_CATEGORY_DATA).forEach(c => {
      const all = [...(c.positive||[]), ...(c.negative||[]), ...(c.question||[])];
      all.forEach(ex => {
        const words = ex.split(' ');
        const idx = Math.floor(Math.random()*words.length);
        const a = words[idx].replace(/[^a-zA-Z'-]/g,'');
        if(a&&a.length>1) questions.push({q:ex.replace(a,'________'),a:a,d:c.name||catId});
      });
    });
  }
  grammarQuizState = { questions:questions.sort(()=>Math.random()-0.5).slice(0,10), current:0, score:0, total:Math.min(10,questions.length), mode:catId };
  renderGrammarQuizQuestion();
}

function openGrammarExercises() { grammarTab='exercises'; renderGrammar(); }

// =============================================
// GRAMMAR — EXERCISES
// =============================================
const GRAMMAR_EXERCISES = [
  {
    id:'error-correction', icon:'✅', name:'Error Correction', desc:'Find and fix grammar mistakes in sentences',
    instructions:'Each sentence contains ONE grammar error. Choose the correct version (3 вариантадан 1 тўғрисини топинг).',
    questions:[
      {prompt:'She go to school every day.', options:[{t:'She goes to school every day.',c:true},{t:'She go to school every day.',c:false},{t:'She going to school every day.',c:false}], explanation:'Present Simple III shaxs birlikda -s qo\'shimchasi керак: "She goes".'},
      {prompt:'He don\'t like coffee.', options:[{t:'He doesn\'t like coffee.',c:true},{t:'He don\'t like coffee.',c:false},{t:'He not like coffee.',c:false}], explanation:'III shaxs birlik "doesn\'t" ишлатилади, "don\'t" эмас.'},
      {prompt:'I have went to the store yesterday.', options:[{t:'I went to the store yesterday.',c:true},{t:'I have gone to the store yesterday.',c:false},{t:'I had went to the store yesterday.',c:false}], explanation:'Аниқ ўтмиш замон (yesterday) → Past Simple ишлатилади.'},
      {prompt:'She is knowing the answer.', options:[{t:'She knows the answer.',c:true},{t:'She is knowing the answer.',c:false},{t:'She know the answer.',c:false}], explanation:'"Know" stative fe\'l — Continuous формада ишлатилмайди.'},
      {prompt:'If I will see her, I will tell her.', options:[{t:'If I see her, I will tell her.',c:true},{t:'If I will see her, I will tell her.',c:false},{t:'If I would see her, I will tell her.',c:false}], explanation:'First conditional: "if" дан кейин Present Simple ишлатилади, "will" эмас.'},
      {prompt:'The book who I read was great.', options:[{t:'The book that I read was great.',c:true},{t:'The book who I read was great.',c:false},{t:'The book whom I read was great.',c:false}], explanation:'Предметлар учун "that" ёки "which", одамлар учун "who" ишлатилади.'},
      {prompt:'I am married with a doctor.', options:[{t:'I am married to a doctor.',c:true},{t:'I am married with a doctor.',c:false},{t:'I am married by a doctor.',c:false}], explanation:'"Married" дан кейин "to" предлоги ишлатилади, "with" эмас.'},
      {prompt:'She said me that she was tired.', options:[{t:'She told me that she was tired.',c:true},{t:'She said me that she was tired.',c:false},{t:'She told to me that she was tired.',c:false}], explanation:'"Say" + to + object, "tell" тўғридан-тўғри object билан ишлатилади.'},
      {prompt:'I enjoy to swim in the ocean.', options:[{t:'I enjoy swimming in the ocean.',c:true},{t:'I enjoy to swim in the ocean.',c:false},{t:'I enjoy swim in the ocean.',c:false}], explanation:'"Enjoy" дан кейин gerund (-ing) ишлатилади, infinitive эмас.'},
      {prompt:'There is many people at the park.', options:[{t:'There are many people at the park.',c:true},{t:'There is many people at the park.',c:false},{t:'There have many people at the park.',c:false}], explanation:'"People" кўплик → "there are" ишлатилади, "there is" эмас.'},
      {prompt:'He was took to the hospital.', options:[{t:'He was taken to the hospital.',c:true},{t:'He was took to the hospital.',c:false},{t:'He was taked to the hospital.',c:false}], explanation:'"Take" нинг Past Participle шакли "taken", "took" эмас.'},
      {prompt:'I look forward to hear from you.', options:[{t:'I look forward to hearing from you.',c:true},{t:'I look forward to hear from you.',c:false},{t:'I look forward to heard from you.',c:false}], explanation:'"Look forward to" да "to" предлог → кейин gerund ишлатилади.'},
      {prompt:'The number of tourists are increasing.', options:[{t:'The number of tourists is increasing.',c:true},{t:'The number of tourists are increasing.',c:false},{t:'The number of tourists have increasing.',c:false}], explanation:'Эга "the number" (бирлик) → "is" ишлатилади, "are" эмас.'},
      {prompt:'Despite he was tired, he continued.', options:[{t:'Despite being tired, he continued.',c:true},{t:'Despite he was tired, he continued.',c:false},{t:'Despite of his tired, he continued.',c:false}], explanation:'"Despite" предлог, conjunction эмас. Кейин noun ёки gerund келади.'},
      {prompt:'She doesn\'t has any money.', options:[{t:'She doesn\'t have any money.',c:true},{t:'She doesn\'t has any money.',c:false},{t:'She don\'t have any money.',c:false}], explanation:'"Doesn\'t" дан кейин асосий fe\'l базавий шаклда ишлатилади.'},
      {prompt:'I must to go now.', options:[{t:'I must go now.',c:true},{t:'I must to go now.',c:false},{t:'I must going now.',c:false}], explanation:'Modal fe\'llardan кейин "to"siz infinitive ишлатилади.'},
      {prompt:'Can I have a glass of water?, she asked.', options:[{t:'She asked if she could have a glass of water.',c:true},{t:'She asked can she have a glass of water.',c:false},{t:'She asked that she can have a glass of water.',c:false}], explanation:'Reported speech да "if" ишлатилади ва backshift бўлади (can → could).'},
      {prompt:'He works here since 2019.', options:[{t:'He has worked here since 2019.',c:true},{t:'He works here since 2019.',c:false},{t:'He is working here since 2019.',c:false}], explanation:'"Since" Present Perfect билан ишлатилади, Present Simple эмас.'},
      {prompt:'I didn\'t saw her at the party.', options:[{t:'I didn\'t see her at the party.',c:true},{t:'I didn\'t saw her at the party.',c:false},{t:'I not saw her at the party.',c:false}], explanation:'"Didn\'t" дан кейин асосий fe\'l базавий шаклда ишлатилади.'},
      {prompt:'We discussed about the problem.', options:[{t:'We discussed the problem.',c:true},{t:'We discussed about the problem.',c:false},{t:'We discussed on the problem.',c:false}], explanation:'"Discuss" дан кейин предлог керак эмас. "Discuss about" нотўғри.'},
      {prompt:'She can to speak three languages.', options:[{t:'She can speak three languages.',c:true},{t:'She can to speak three languages.',c:false},{t:'She can speaks three languages.',c:false}], explanation:'Modal fe\'llardan кейин "to"siz infinitive ишлатилади.'},
      {prompt:'Neither John or Mary came to the party.', options:[{t:'Neither John nor Mary came to the party.',c:true},{t:'Neither John or Mary came to the party.',c:false},{t:'Neither John and Mary came to the party.',c:false}], explanation:'"Neither" билан "nor" ишлатилади, "or" эмас.'},
      {prompt:'She is more taller than her sister.', options:[{t:'She is taller than her sister.',c:true},{t:'She is more taller than her sister.',c:false},{t:'She is most tall than her sister.',c:false}], explanation:'"Taller" ўзи comparative, "more" керак эмас.'},
      {prompt:'I have a few money left.', options:[{t:'I have a little money left.',c:true},{t:'I have a few money left.',c:false},{t:'I have many money left.',c:false}], explanation:'"Money" uncountable → "a little" ишлатилади, "a few" эмас.'},
      {prompt:'She suggested me to go home.', options:[{t:'She suggested that I go home.',c:true},{t:'She suggested me to go home.',c:false},{t:'She suggested to me to go home.',c:false}], explanation:'"Suggest" дан кейин "that + clause" ишлатилади, infinitive эмас.'},
      {prompt:'Its a beautiful day outside.', options:[{t:'It\'s a beautiful day outside.',c:true},{t:'Its a beautiful day outside.',c:false},{t:'Its\' a beautiful day outside.',c:false}], explanation:'"It\'s" = "it is", "its" эгалик шакли. Бу ерда "It\'s" керак.'},
      {prompt:'Every students must bring their book.', options:[{t:'Every student must bring their book.',c:true},{t:'Every students must bring their book.',c:false},{t:'Every student must bring his book.',c:false}], explanation:'"Every" дан кейин бірлік от ишлатилади: "student", "students" эмас.'},
      {prompt:'She is looking forward to meet you.', options:[{t:'She is looking forward to meeting you.',c:true},{t:'She is looking forward to meet you.',c:false},{t:'She is looking forward meet you.',c:false}], explanation:'"Look forward to" да "to" предлог → gerund ишлатилади.'},
      {prompt:'He asked me where do I live.', options:[{t:'He asked me where I lived.',c:true},{t:'He asked me where do I live.',c:false},{t:'He asked me where I live.',c:false}], explanation:'Reported wh-questions да тўғри сўз тартиби + backshift.'},
      {prompt:'I wish I was taller.', options:[{t:'I wish I were taller.',c:true},{t:'I wish I was taller.',c:false},{t:'I wish I am taller.',c:false}], explanation:'"Wish" дан кейин "were" ишлатилади (II shart mayli).'},
      {prompt:'She is enough old to drive.', options:[{t:'She is old enough to drive.',c:true},{t:'She is enough old to drive.',c:false},{t:'She is enough old for drive.',c:false}], explanation:'"Enough" сифатдан кейин келади: "old enough", "enough old" эмас.'},
      {prompt:'He is interested for learning Spanish.', options:[{t:'He is interested in learning Spanish.',c:true},{t:'He is interested for learning Spanish.',c:false},{t:'He is interested to learn Spanish.',c:false}], explanation:'"Interested" дан кейин "in" предлоги ишлатилади.'},
      {prompt:'I have been to Paris last year.', options:[{t:'I went to Paris last year.',c:true},{t:'I have been to Paris last year.',c:false},{t:'I have gone to Paris last year.',c:false}], explanation:'"Last year" аниқ ўтмиш замон → Past Simple ишлатилади.'},
      {prompt:'The man which lives next door is friendly.', options:[{t:'The man who lives next door is friendly.',c:true},{t:'The man which lives next door is friendly.',c:false},{t:'The man whom lives next door is friendly.',c:false}], explanation:'Одамлар учун "who" ишлатилади, "which" эмас.'},
      {prompt:'She didn\'t do nothing wrong.', options:[{t:'She didn\'t do anything wrong.',c:true},{t:'She didn\'t do nothing wrong.',c:false},{t:'She did nothing wrong.',c:false}], explanation:'Инглиз тилида қўш double negative ишлатилмайди.'},
      {prompt:'Let\'s go to home now.', options:[{t:'Let\'s go home now.',c:true},{t:'Let\'s go to home now.',c:false},{t:'Let\'s go to the home now.',c:false}], explanation:'"Go home" да "to" предлоги керак эмас.'},
      {prompt:'She was boring in the meeting.', options:[{t:'She was bored in the meeting.',c:true},{t:'She was boring in the meeting.',c:false},{t:'She was bore in the meeting.',c:false}], explanation:'-ed (his qilgan) vs -ing (сабабчи): "bored" тўғри.'},
      {prompt:'If I would be rich, I would travel.', options:[{t:'If I were rich, I would travel.',c:true},{t:'If I would be rich, I would travel.',c:false},{t:'If I am rich, I would travel.',c:false}], explanation:'Second conditional: "If I were...", "If I would be" эмас.'},
      {prompt:'She has been to New York last month.', options:[{t:'She went to New York last month.',c:true},{t:'She has been to New York last month.',c:false},{t:'She had been to New York last month.',c:false}], explanation:'"Last month" аниқ ўтмиш → Present Perfect ишлатилмайди.'},
      {prompt:'I am used to wake up early.', options:[{t:'I am used to waking up early.',c:true},{t:'I am used to wake up early.',c:false},{t:'I use to wake up early.',c:false}], explanation:'"Be used to" да "to" предлог → gerund ишлатилади.'},
      {prompt:'The news are very good today.', options:[{t:'The news is very good today.',c:true},{t:'The news are very good today.',c:false},{t:'The news have been very good today.',c:false}], explanation:'"News" uncountable ва бірлік → "is" ишлатилади.'},
      {prompt:'She has three childrens.', options:[{t:'She has three children.',c:true},{t:'She has three childrens.',c:false},{t:'She has three childs.',c:false}], explanation:'"Children" кўплик шакли, "childrens" нотўғри.'},
      {prompt:'He told that he was happy.', options:[{t:'He said that he was happy.',c:true},{t:'He told that he was happy.',c:false},{t:'He told me that he was happy.',c:false}], explanation:'"Tell" object керак: "tell me / tell him". "Say" object сиз ишлатилади.'},
      {prompt:'I am looking for my keys since morning.', options:[{t:'I have been looking for my keys since morning.',c:true},{t:'I am looking for my keys since morning.',c:false},{t:'I look for my keys since morning.',c:false}], explanation:'"Since" Present Perfect ёки Present Perfect Continuous билан ишлатилади.'},
      {prompt:'She asked could I help her.', options:[{t:'She asked if I could help her.',c:true},{t:'She asked could I help her.',c:false},{t:'She asked that I could help her.',c:false}], explanation:'Reported yes/no questions да "if" ишлатилади.'},
      {prompt:'The book is more better than the movie.', options:[{t:'The book is better than the movie.',c:true},{t:'The book is more better than the movie.',c:false},{t:'The book is best than the movie.',c:false}], explanation:'"Better" ўзи comparative, "more" керак эмас.'},
      {prompt:'Everybody are welcome to join.', options:[{t:'Everybody is welcome to join.',c:true},{t:'Everybody are welcome to join.',c:false},{t:'Everybody be welcome to join.',c:false}], explanation:'"Everybody" бірлік → "is" ишлатилади.'},
      {prompt:'She didn\'t knew the answer.', options:[{t:'She didn\'t know the answer.',c:true},{t:'She didn\'t knew the answer.',c:false},{t:'She not knew the answer.',c:false}], explanation:'"Didn\'t" дан кейин fe\'l базавий шаклда ишлатилади.'},
      {prompt:'I prefer tea than coffee.', options:[{t:'I prefer tea to coffee.',c:true},{t:'I prefer tea than coffee.',c:false},{t:'I prefer tea over coffee.',c:false}], explanation:'"Prefer" дан кейин "to" ишлатилади, "than" эмас.'},
      {prompt:'She has much friends in school.', options:[{t:'She has many friends in school.',c:true},{t:'She has much friends in school.',c:false},{t:'She has a lot friends in school.',c:false}], explanation:'"Friends" countable → "many" ишлатилади, "much" эмас.'},
      {prompt:'He is capable to do the job.', options:[{t:'He is capable of doing the job.',c:true},{t:'He is capable to do the job.',c:false},{t:'He is capable for doing the job.',c:false}], explanation:'"Capable" дан кейин "of + gerund" ишлатилади.'},
      {prompt:'The movie was real interesting.', options:[{t:'The movie was really interesting.',c:true},{t:'The movie was real interesting.',c:false},{t:'The movie was realy interesting.',c:false}], explanation:'Сифатни modifier қилиш учун adverb керак: "really" (real эмас).'},
      {prompt:'She doesn\'t likes pizza.', options:[{t:'She doesn\'t like pizza.',c:true},{t:'She doesn\'t likes pizza.',c:false},{t:'She don\'t likes pizza.',c:false}], explanation:'"Doesn\'t" дан кейин fe\'l базавий шаклда: "like", "likes" эмас.'},
      {prompt:'He has left home before I arrived.', options:[{t:'He had left home before I arrived.',c:true},{t:'He has left home before I arrived.',c:false},{t:'He left home before I arrived.',c:false}], explanation:'Кетди → келдим: у кетгандан кейин мен келдим. Past Perfect керак.'},
      {prompt:'Did you ate breakfast?', options:[{t:'Did you eat breakfast?',c:true},{t:'Did you ate breakfast?',c:false},{t:'Did you eaten breakfast?',c:false}], explanation:'"Did" дан кейин fe\'l базавий шаклда: "eat", "ate" эмас.'},
      {prompt:'She is good in mathematics.', options:[{t:'She is good at mathematics.',c:true},{t:'She is good in mathematics.',c:false},{t:'She is good on mathematics.',c:false}], explanation:'"Good at" — "Good in" нотўғри.'},
      {prompt:'The house who is on the hill is old.', options:[{t:'The house that is on the hill is old.',c:true},{t:'The house who is on the hill is old.',c:false},{t:'The house whom is on the hill is old.',c:false}], explanation:'"House" предмет → "which" ёки "that" ишлатилади, "who" эмас.'},
      {prompt:'I have gone to the gym every day.', options:[{t:'I go to the gym every day.',c:true},{t:'I have gone to the gym every day.',c:false},{t:'I am going to the gym every day.',c:false}], explanation:'"Every day" одатни билдиради → Present Simple керак.'},
      {prompt:'She advised me to not go there.', options:[{t:'She advised me not to go there.',c:true},{t:'She advised me to not go there.',c:false},{t:'She advised me don\'t go there.',c:false}], explanation:'"Not" infinitive дан олдин келади: "not to go", "to not go" эмас.'},
      {prompt:'There is less people here today.', options:[{t:'There are fewer people here today.',c:true},{t:'There is less people here today.',c:false},{t:'There are less people here today.',c:false}], explanation:'"People" countable → "fewer" ишлатилади, "less" эмас.'},
      {prompt:'She is the most prettiest girl.', options:[{t:'She is the prettiest girl.',c:true},{t:'She is the most prettiest girl.',c:false},{t:'She is the most pretty girl.',c:false}], explanation:'"Prettiest" ўзи superlative, "most" керак эмас.'},
      {prompt:'He has been working here since three years.', options:[{t:'He has been working here for three years.',c:true},{t:'He has been working here since three years.',c:false},{t:'He works here for three years.',c:false}], explanation:'"Three years" вақт давомийлиги → "for" ишлатилади, "since" эмас.'},
      {prompt:'I can\'t hardly hear you.', options:[{t:'I can hardly hear you.',c:true},{t:'I can\'t hardly hear you.',c:false},{t:'I cannot hardly hear you.',c:false}], explanation:'"Hardly" ўзи negative маънода → "can\'t" билан қўшмайди.'},
      {prompt:'She sings beautiful.', options:[{t:'She sings beautifully.',c:true},{t:'She sings beautiful.',c:false},{t:'She sings beautiful ly.',c:false}], explanation:'Ҳаракатни tavsiflash учун adverb керак: "beautifully".'},
      {prompt:'This is the man who I gave the book.', options:[{t:'This is the man to whom I gave the book.',c:true},{t:'This is the man who I gave the book.',c:false},{t:'This is the man whom I gave the book.',c:false}], explanation:'"Give to someone" — предлог керак: "to whom".'},
      {prompt:'We are thinking to move to Canada.', options:[{t:'We are thinking of moving to Canada.',c:true},{t:'We are thinking to move to Canada.',c:false},{t:'We are thinking about move to Canada.',c:false}], explanation:'"Think of/about + gerund" ишлатилади.'},
      {prompt:'He was afraid from the dark.', options:[{t:'He was afraid of the dark.',c:true},{t:'He was afraid from the dark.',c:false},{t:'He was afraid about the dark.',c:false}], explanation:'"Afraid" дан кейин "of" предлоги ишлатилади.'},
      {prompt:'The flowers smell sweetly.', options:[{t:'The flowers smell sweet.',c:true},{t:'The flowers smell sweetly.',c:false},{t:'The flowers are smell sweet.',c:false}], explanation:'"Smell" linking verb → кейин adjective келади: "sweet", "sweetly" эмас.'},
      {prompt:'I need to buy some new cloths for work.', options:[{t:'I need to buy some new clothes for work.',c:true},{t:'I need to buy some new cloths for work.',c:false},{t:'I need to buy some new cloth for work.',c:false}], explanation:'"Clothes" (кийимлар) vs "cloths" (мато бўлаклари). Бу ерда "clothes" керак.'}
    ]
  },
  {
    id:'sentence-transformation', icon:'🔄', name:'Sentence Transformation', desc:'Rewrite sentences without changing the meaning',
    instructions:'Маънони ўзгартирмасдан гапни қайта ёзинг. 3 вариантадан тўғрисини топинг.',
    questions:[
      {prompt:'I started learning English 3 years ago.', options:[{t:'I have been learning English for 3 years.',c:true},{t:'I am learning English for 3 years.',c:false},{t:'I had learned English for 3 years.',c:false}], explanation:'Past Simple + "ago" → Present Perfect Continuous + "for" билан алмаштирилади.'},
      {prompt:'"I am tired," she said.', options:[{t:'She said that she was tired.',c:true},{t:'She said that she is tired.',c:false},{t:'She said me that she was tired.',c:false}], explanation:'Direct speech → reported speech да backshift бўлади (am → was).'},
      {prompt:'Someone stole my wallet.', options:[{t:'My wallet was stolen.',c:true},{t:'My wallet is stolen.',c:false},{t:'My wallet had stolen.',c:false}], explanation:'Active → Passive: "was stolen" (Past Simple passive).'},
      {prompt:'I can\'t swim.', options:[{t:'I wish I could swim.',c:true},{t:'I wish I can swim.',c:false},{t:'I wish I would swim.',c:false}], explanation:'"I wish" + Past Simple — ҳозирги имкониятсизликни ифодалайди.'},
      {prompt:'It\'s possible that she is late.', options:[{t:'She might be late.',c:true},{t:'She must be late.',c:false},{t:'She can be late.',c:false}], explanation:'"Might" эҳтимолликни ифодалайди (possibility).'},
      {prompt:'He didn\'t study, so he failed.', options:[{t:'If he had studied, he would have passed.',c:true},{t:'If he studied, he would pass.',c:false},{t:'If he would study, he would pass.',c:false}], explanation:'Third conditional — ўтмишдаги реал бўлмаган вазият.'},
      {prompt:'Although she was tired, she kept working.', options:[{t:'Despite being tired, she kept working.',c:true},{t:'Despite she was tired, she kept working.',c:false},{t:'Despite of tired, she kept working.',c:false}], explanation:'"Although + clause" → "Despite + gerund" билан алмаштирилади.'},
      {prompt:'The last time I saw her was in 2020.', options:[{t:'I haven\'t seen her since 2020.',c:true},{t:'I didn\'t see her since 2020.',c:false},{t:'I don\'t see her since 2020.',c:false}], explanation:'"Last time...was" → Present Perfect negative + "since".'},
      {prompt:'We haven\'t got any coffee left.', options:[{t:'We have run out of coffee.',c:true},{t:'We have run off coffee.',c:false},{t:'We have run over coffee.',c:false}], explanation:'"Run out of" фразовый fe\'ли "тугаб бўлди" маъносини ифодалайди.'},
      {prompt:'People believe that he is a genius.', options:[{t:'He is believed to be a genius.',c:true},{t:'He is believing to be a genius.',c:false},{t:'People are believed he is a genius.',c:false}], explanation:'Impersonal passive: "It is believed that..." → "He is believed to be..."'},
      {prompt:'She started working here in 2020 and still works here.', options:[{t:'She has been working here since 2020.',c:true},{t:'She is working here since 2020.',c:false},{t:'She had worked here since 2020.',c:false}], explanation:'Ҳаракат ўтмишда бошланиб, ҳозиргача davom etsa → Present Perfect Continuous.'},
      {prompt:'It is necessary that you attend the meeting.', options:[{t:'You must attend the meeting.',c:true},{t:'You might attend the meeting.',c:false},{t:'You could attend the meeting.',c:false}], explanation:'"It is necessary that" → "must" (мажбурият) билан ифодаланади.'},
      {prompt:'The manager said, "You should improve your work."', options:[{t:'The manager said that I should improve my work.',c:true},{t:'The manager said that you should improve your work.',c:false},{t:'The manager said I should improve his work.',c:false}], explanation:'Reported speech да шахс almashadi: "you" → "I / my".'},
      {prompt:'He prefers staying at home rather than going out.', options:[{t:'He would rather stay at home than go out.',c:true},{t:'He would rather staying at home than going out.',c:false},{t:'He would rather to stay at home than go out.',c:false}], explanation:'"Would rather" + base verb (without to) ишлатилади.'},
      {prompt:'The problem was so difficult that nobody could solve it.', options:[{t:'It was such a difficult problem that nobody could solve it.',c:true},{t:'It was so difficult problem that nobody could solve it.',c:false},{t:'The problem was such difficult that nobody could solve it.',c:false}], explanation:'"So + adj + that" → "Such + (a/an) + noun + that" га айланади.'},
      {prompt:'She didn\'t call me because she forgot.', options:[{t:'She would have called me if she hadn\'t forgotten.',c:true},{t:'She would call me if she didn\'t forget.',c:false},{t:'She will call me if she doesn\'t forget.',c:false}], explanation:'Утмишдаги реал бўлмаган вазият → Third conditional.'},
      {prompt:'They will build a new hospital next year.', options:[{t:'A new hospital will be built next year.',c:true},{t:'A new hospital will build next year.',c:false},{t:'A new hospital is built next year.',c:false}], explanation:'Active → Future Simple Passive.'},
      {prompt:'My father made me clean my room.', options:[{t:'I was made to clean my room by my father.',c:true},{t:'I was made clean my room by my father.',c:false},{t:'I made to clean my room by my father.',c:false}], explanation:'"Make someone do" → Passive: "was made to do" (to qaytadi).'},
      {prompt:'It\'s a pity I didn\'t study harder.', options:[{t:'I wish I had studied harder.',c:true},{t:'I wish I studied harder.',c:false},{t:'I wish I would study harder.',c:false}], explanation:'Утмишдаги афсус → "wish + past perfect".'},
      {prompt:'They say that exercise is good for health.', options:[{t:'It is said that exercise is good for health.',c:true},{t:'They are said that exercise is good for health.',c:false},{t:'It says that exercise is good for health.',c:false}], explanation:'"They say that..." → "It is said that..." impersonal passive.'},
      {prompt:'You should take an umbrella because it might rain.', options:[{t:'In case it rains, take an umbrella.',c:true},{t:'In case it will rain, take an umbrella.',c:false},{t:'In case it rained, take an umbrella.',c:false}], explanation:'"In case" + Present Simple (future маъносида).'},
      {prompt:'I find it difficult to understand him.', options:[{t:'I have difficulty understanding him.',c:true},{t:'I have difficulty to understand him.',c:false},{t:'I am difficulty understanding him.',c:false}], explanation:'"Have difficulty + gerund".'},
      {prompt:'She not only sings but also dances.', options:[{t:'Not only does she sing, but she also dances.',c:true},{t:'Not only she sings, but she also dances.',c:false},{t:'Not only she sings, but also she dances.',c:false}], explanation:'"Not only" бошда келса, inversion керак: "does she sing".'},
      {prompt:'He worked hard. He wanted to succeed.', options:[{t:'He worked hard in order to succeed.',c:true},{t:'He worked hard in order succeed.',c:false},{t:'He worked hard for succeed.',c:false}], explanation:'Максадни ифодалаш: "in order to + infinitive".'},
      {prompt:'She started working here 5 years ago.', options:[{t:'She has been working here for 5 years.',c:true},{t:'She works here for 5 years.',c:false},{t:'She is working here for 5 years.',c:false}], explanation:'"Started...5 years ago" → "has been working...for 5 years".'},
      {prompt:'I paid $100 for this jacket.', options:[{t:'This jacket cost me $100.',c:true},{t:'This jacket costed me $100.',c:false},{t:'This jacket was cost $100.',c:false}], explanation:'"Pay $100 for" → "cost someone $100" (cost ўзгармас fe\'l).'},
      {prompt:'It is possible that he forgot about the meeting.', options:[{t:'He might have forgotten about the meeting.',c:true},{t:'He might forget about the meeting.',c:false},{t:'He may forgot about the meeting.',c:false}], explanation:'Утмишдаги эҳтимоллик → "might have + past participle".'},
      {prompt:'I\'m sorry I couldn\'t come to your party.', options:[{t:'I apologize for not coming to your party.',c:true},{t:'I apologize for not come to your party.',c:false},{t:'I apologize to not come to your party.',c:false}], explanation:'"Apologize for + gerund".'},
      {prompt:'Unless you hurry, you will miss the bus.', options:[{t:'If you don\'t hurry, you will miss the bus.',c:true},{t:'If you hurry, you will miss the bus.',c:false},{t:'If you won\'t hurry, you will miss the bus.',c:false}], explanation:'"Unless" = "if not".'},
      {prompt:'The teacher explained the lesson to the students.', options:[{t:'The lesson was explained to the students by the teacher.',c:true},{t:'The students were explained the lesson.',c:false},{t:'The lesson was explained the students.',c:false}], explanation:'"Explain something to someone" → Passive: "was explained to".'},
      {prompt:'I haven\'t seen her for a long time.', options:[{t:'It\'s a long time since I last saw her.',c:true},{t:'It\'s a long time since I last see her.',c:false},{t:'It\'s a long time since I haven\'t seen her.',c:false}], explanation:'"Haven\'t seen for..." → "It\'s...since I last saw..."'},
      {prompt:'He was so weak that he couldn\'t walk.', options:[{t:'He was too weak to walk.',c:true},{t:'He was too weak that he couldn\'t walk.',c:false},{t:'He was so weak to walk.',c:false}], explanation:'"So...that" → "too...to" конструкцияси.'},
      {prompt:'She prefers reading books to watching TV.', options:[{t:'She would rather read books than watch TV.',c:true},{t:'She would rather reading books than watching TV.',c:false},{t:'She would rather to read books than watch TV.',c:false}], explanation:'"Prefer + gerund + to + gerund" → "would rather + base verb + than + base verb".'},
      {prompt:'No one in the class is taller than John.', options:[{t:'John is the tallest student in the class.',c:true},{t:'John is taller than anyone in the class.',c:false},{t:'John is the most tallest in the class.',c:false}], explanation:'"No one is taller" → "John is the tallest".'},
      {prompt:'I will remember to lock the door.', options:[{t:'I won\'t forget to lock the door.',c:true},{t:'I won\'t remember to lock the door.',c:false},{t:'I will forget to lock the door.',c:false}], explanation:'"Remember to" маъноси "not forget to" билан бир хил.'},
      {prompt:'She might be late because of the traffic.', options:[{t:'She may be late due to the traffic.',c:true},{t:'She can be late due to the traffic.',c:false},{t:'She must be late due to the traffic.',c:false}], explanation:'"Might" = "may" (эҳтимоллик). "Due to" = "because of".'},
      {prompt:'We must finish this project by Friday.', options:[{t:'This project must be finished by Friday.',c:true},{t:'This project must finish by Friday.',c:false},{t:'This project is must finished by Friday.',c:false}], explanation:'Active → Passive modal: "must be finished".'},
      {prompt:'I saw him when he was crossing the street.', options:[{t:'I saw him crossing the street.',c:true},{t:'I saw him cross the street.',c:false},{t:'I saw him while crossing the street.',c:false}], explanation:'"See + object + gerund" (jarayonni кўриш).'},
      {prompt:'He is very intelligent. He can solve any problem.', options:[{t:'He is so intelligent that he can solve any problem.',c:true},{t:'He is such intelligent that he can solve any problem.',c:false},{t:'He is too intelligent that he can solve any problem.',c:false}], explanation:'"So + adj + that" — натижани кўрсатади.'},
      {prompt:'We couldn\'t go out because of the rain.', options:[{t:'The rain prevented us from going out.',c:true},{t:'The rain prevented us to go out.',c:false},{t:'The rain prevented us from go out.',c:false}], explanation:'"Prevent someone from + gerund".'},
      {prompt:'He lost his job. He was often late.', options:[{t:'If he hadn\'t been often late, he wouldn\'t have lost his job.',c:true},{t:'If he wasn\'t often late, he wouldn\'t lose his job.',c:false},{t:'If he isn\'t often late, he won\'t lose his job.',c:false}], explanation:'Утмишдаги сабаб-натижа → Third conditional.'},
      {prompt:'I am going to visit my grandparents next weekend.', options:[{t:'I am visiting my grandparents next weekend.',c:true},{t:'I will visit my grandparents next weekend.',c:false},{t:'I visit my grandparents next weekend.',c:false}], explanation:'Present Continuous future arrangement учун ишлатилади.'},
      {prompt:'She locked the door so that nobody could enter.', options:[{t:'She locked the door to prevent anyone from entering.',c:true},{t:'She locked the door for prevent anyone entering.',c:false},{t:'She locked the door so that to prevent entry.',c:false}], explanation:'"So that" → "to + infinitive" ёки "prevent from + gerund".'},
      {prompt:'I regret not studying harder when I was young.', options:[{t:'I should have studied harder when I was young.',c:true},{t:'I should study harder when I was young.',c:false},{t:'I must have studied harder when I was young.',c:false}], explanation:'Утмишдаги афсус → "should have + past participle".'},
      {prompt:'They were playing tennis when it started to rain.', options:[{t:'They were playing tennis when the rain began.',c:true},{t:'They played tennis when it started to rain.',c:false},{t:'They had played tennis when it started to rain.',c:false}], explanation:'"Started to rain" → "the rain began" (синоним).'},
      {prompt:'He drove so fast that he got a ticket.', options:[{t:'If he hadn\'t driven so fast, he wouldn\'t have gotten a ticket.',c:true},{t:'If he didn\'t drive so fast, he wouldn\'t get a ticket.',c:false},{t:'If he doesn\'t drive so fast, he won\'t get a ticket.',c:false}], explanation:'Утмишдаги реал бўлмаган вазият → Third conditional.'},
      {prompt:'My mother made a cake for my birthday.', options:[{t:'A cake was made for my birthday by my mother.',c:true},{t:'A cake was made by my mother for my birthday.',c:false},{t:'My birthday was made a cake by my mother.',c:false}], explanation:'Active → Past Simple Passive.'}
    ]
  },
  {
    id:'tense-choice', icon:'🎯', name:'Tense Selection', desc:'Choose the correct tense for each sentence',
    instructions:'Гапни тўлдириш учун тўғри замонни танланг (3 вариантадан 1 тўғриси).',
    questions:[
      {prompt:'Look! It ___ outside.', options:[{t:'is raining',c:true},{t:'rains',c:false},{t:'has rained',c:false}], explanation:'"Look!" ҳозир бўлаётган ҳаракат → Present Continuous.'},
      {prompt:'She ___ to work every day.', options:[{t:'walks',c:true},{t:'is walking',c:false},{t:'has walked',c:false}], explanation:'"Every day" одат → Present Simple.'},
      {prompt:'I ___ never ___ to Japan.', options:[{t:'have; been',c:true},{t:'was; been',c:false},{t:'had; been',c:false}], explanation:'Ҳаёт тажрибаси, аниқ вақт йўқ → Present Perfect.'},
      {prompt:'When I arrived, she ___ already ___.', options:[{t:'had; left',c:true},{t:'has; left',c:false},{t:'was; leaving',c:false}], explanation:'Аввалроқ бўлган ҳаракат → Past Perfect.'},
      {prompt:'By 2030, the population ___ 9 billion.', options:[{t:'will have reached',c:true},{t:'will reach',c:false},{t:'is reaching',c:false}], explanation:'Келажак vaqtda tugallangan ҳаракат → Future Perfect.'},
      {prompt:'At 8 PM yesterday, I ___ TV.', options:[{t:'was watching',c:true},{t:'watched',c:false},{t:'had watched',c:false}], explanation:'Аниқ ўтмиш vaqtda davom etgan ҳаракат → Past Continuous.'},
      {prompt:'She ___ English for 5 years before she moved.', options:[{t:'had been studying',c:true},{t:'studied',c:false},{t:'was studying',c:false}], explanation:'Утмишдаги бошқа ҳаракатдан олдинги davomiylik → Past Perfect Continuous.'},
      {prompt:'This time next week, I ___ on a beach.', options:[{t:'will be lying',c:true},{t:'will lie',c:false},{t:'am lying',c:false}], explanation:'Келажакдаги аниқ vaqtda davom etadigan ҳаракат → Future Continuous.'},
      {prompt:'Water ___ at 100°C.', options:[{t:'boils',c:true},{t:'is boiling',c:false},{t:'has boiled',c:false}], explanation:'Илмий ҳақиқат → Present Simple.'},
      {prompt:'I ___ dinner when the phone rang.', options:[{t:'was cooking',c:true},{t:'cooked',c:false},{t:'had cooked',c:false}], explanation:'Тўхтатилган ўтмиш ҳаракати → Past Continuous.'},
      {prompt:'By the time you arrive, I ___ dinner.', options:[{t:'will have finished',c:true},{t:'will finish',c:false},{t:'am finishing',c:false}], explanation:'Келажакдаги бир ҳаракат бошқасидан олдин тугайди → Future Perfect.'},
      {prompt:'She ___ to music when I called her.', options:[{t:'was listening',c:true},{t:'listened',c:false},{t:'had listened',c:false}], explanation:'Қўнғироқ vaqtida davom etayotgan ҳаракат → Past Continuous.'},
      {prompt:'I ___ English for 3 years now.', options:[{t:'have been studying',c:true},{t:'study',c:false},{t:'am studying',c:false}], explanation:'"For 3 years now" — ўтмишда бошланиб, ҳозиргача davom etmoqda → Present Perfect Continuous.'},
      {prompt:'The train ___ at 6 PM every evening.', options:[{t:'leaves',c:true},{t:'is leaving',c:false},{t:'has left',c:false}], explanation:'Жадвал бўйича muntazam ҳаракат → Present Simple.'},
      {prompt:'She looks tired because she ___ all night.', options:[{t:'has been working',c:true},{t:'works',c:false},{t:'is working',c:false}], explanation:'Кўринадиган натижа билан боғлиқ ҳаракат → Present Perfect Continuous.'},
      {prompt:'By next June, they ___ married for 10 years.', options:[{t:'will have been',c:true},{t:'will be',c:false},{t:'are',c:false}], explanation:'Келажак vaqtгача бўлган davomiylik → Future Perfect.'},
      {prompt:'I ___ him since we were children.', options:[{t:'have known',c:true},{t:'am knowing',c:false},{t:'have been knowing',c:false}], explanation:'"Since" билан Present Perfect, "know" stative fe\'л.'},
      {prompt:'When we were kids, we ___ in the river every summer.', options:[{t:'swam',c:true},{t:'were swimming',c:false},{t:'had swum',c:false}], explanation:'Утмишдаги одат → Past Simple.'},
      {prompt:'He ___ in London for 10 years before he moved to Paris.', options:[{t:'had lived',c:true},{t:'lived',c:false},{t:'was living',c:false}], explanation:'Кўчишдан олдинги ҳаракат → Past Perfect.'},
      {prompt:'Don\'t call me at 7 — I ___ dinner then.', options:[{t:'will be having',c:true},{t:'will have',c:false},{t:'have',c:false}], explanation:'Келажакдаги аниқ vaqtда davom этадиган ҳаракат → Future Continuous.'},
      {prompt:'She ___ English for 10 years now.', options:[{t:'has been teaching',c:true},{t:'teaches',c:false},{t:'is teaching',c:false}], explanation:'"For 10 years now" — Present Perfect Continuous.'},
      {prompt:'I ___ him yesterday at the mall.', options:[{t:'saw',c:true},{t:'have seen',c:false},{t:'had seen',c:false}], explanation:'"Yesterday" аниқ ўтмиш → Past Simple.'},
      {prompt:'They ___ each other since childhood.', options:[{t:'have known',c:true},{t:'know',c:false},{t:'are knowing',c:false}], explanation:'"Since childhood" → Present Perfect.'},
      {prompt:'We ___ the report by the time the boss arrives.', options:[{t:'will have finished',c:true},{t:'will finish',c:false},{t:'finish',c:false}], explanation:'Келажакда бир ҳаракат бошқасидан олдин tugaydi → Future Perfect.'},
      {prompt:'She ___ a shower when the phone rang.', options:[{t:'was taking',c:true},{t:'took',c:false},{t:'had taken',c:false}], explanation:'Тўхтатилган ҳаракат → Past Continuous.'},
      {prompt:'The sun ___ in the east.', options:[{t:'rises',c:true},{t:'is rising',c:false},{t:'has risen',c:false}], explanation:'Умумий ҳақиқат → Present Simple.'},
      {prompt:'I ___ for you since 2 PM! Where were you?', options:[{t:'have been waiting',c:true},{t:'am waiting',c:false},{t:'wait',c:false}], explanation:'"Since 2 PM" — Present Perfect Continuous.'},
      {prompt:'By 2025, she ___ here for 20 years.', options:[{t:'will have worked',c:true},{t:'will work',c:false},{t:'works',c:false}], explanation:'"By 2025" — Future Perfect.'},
      {prompt:'He ___ to music when I entered.', options:[{t:'was listening',c:true},{t:'listened',c:false},{t:'had listened',c:false}], explanation:'Кирган vaqtда davom etgan ҳаракат → Past Continuous.'},
      {prompt:'I ___ this movie three times already.', options:[{t:'have seen',c:true},{t:'saw',c:false},{t:'had seen',c:false}], explanation:'"Already" + "three times" → Present Perfect.'},
      {prompt:'She ___ to work when she had the accident.', options:[{t:'was driving',c:true},{t:'drove',c:false},{t:'had driven',c:false}], explanation:'Бошқа ҳаракат vaqtida davom etган ҳаракат → Past Continuous.'},
      {prompt:'They ___ married next June.', options:[{t:'are getting',c:true},{t:'get',c:false},{t:'have got',c:false}], explanation:'Келажакдаги rejalashtirilgan ҳаракат → Present Continuous.'},
      {prompt:'I ___ never ___ such a beautiful sunset.', options:[{t:'have; seen',c:true},{t:'had; seen',c:false},{t:'was; seeing',c:false}], explanation:'Ҳаёт тажрибаси → Present Perfect.'},
      {prompt:'When we arrived, the movie ___ already ___.', options:[{t:'had; started',c:true},{t:'has; started',c:false},{t:'was; starting',c:false}], explanation:'Биз келгунгача бошланган → Past Perfect.'},
      {prompt:'This time tomorrow, I ___ on a plane to London.', options:[{t:'will be sitting',c:true},{t:'will sit',c:false},{t:'sit',c:false}], explanation:'Келажакдаги аниқ vaqtда davom etadigan ҳаракат → Future Continuous.'},
      {prompt:'She ___ three cups of coffee yesterday.', options:[{t:'drank',c:true},{t:'has drunk',c:false},{t:'had drunk',c:false}], explanation:'"Yesterday" аниқ ўтмиш → Past Simple.'},
      {prompt:'I ___ for my exam all week.', options:[{t:'have been studying',c:true},{t:'study',c:false},{t:'am studying',c:false}], explanation:'"All week" davomiylik → Present Perfect Continuous.'},
      {prompt:'He ___ in this company since 2015.', options:[{t:'has worked',c:true},{t:'works',c:false},{t:'is working',c:false}], explanation:'"Since 2015" → Present Perfect.'},
      {prompt:'By the time we get there, they ___ everything.', options:[{t:'will have eaten',c:true},{t:'will eat',c:false},{t:'eat',c:false}], explanation:'Биз етгунча улар еб бўлишади → Future Perfect.'},
      {prompt:'I ___ a bath when the lights went out.', options:[{t:'was having',c:true},{t:'had',c:false},{t:'have had',c:false}], explanation:'Тўхтатилган ҳаракат → Past Continuous.'},
      {prompt:'The shop ___ at 9 AM every morning.', options:[{t:'opens',c:true},{t:'is opening',c:false},{t:'has opened',c:false}], explanation:'Мунтазам жадвал → Present Simple.'},
      {prompt:'She ___ all my chocolates! There are none left!', options:[{t:'has eaten',c:true},{t:'ate',c:false},{t:'was eating',c:false}], explanation:'Натижа кўринади → Present Perfect.'},
      {prompt:'I ___ for hours before I found the answer.', options:[{t:'had been searching',c:true},{t:'searched',c:false},{t:'was searching',c:false}], explanation:'Топгунгача бўлган davomiylik → Past Perfect Continuous.'},
      {prompt:'At 9 PM tonight, I ___ my favorite show.', options:[{t:'will be watching',c:true},{t:'will watch',c:false},{t:'watch',c:false}], explanation:'Келажакдаги аниқ vaqtда davom этадиган ҳаракат → Future Continuous.'},
      {prompt:'I ___ him since we were in primary school.', options:[{t:'have known',c:true},{t:'am knowing',c:false},{t:'have been knowing',c:false}], explanation:'"Since" билан Present Perfect. "Know" stative fe\'l.'},
      {prompt:'They ___ football when it began to snow.', options:[{t:'were playing',c:true},{t:'played',c:false},{t:'had played',c:false}], explanation:'Қор бошланганда davom etgan ҳаракат → Past Continuous.'},
      {prompt:'The train ___ at 6 PM tonight.', options:[{t:'leaves',c:true},{t:'is leaving',c:false},{t:'will leave',c:false}], explanation:'Жадвал бўйича → Present Simple (kelajak маъносида).'},
      {prompt:'I ___ all day tomorrow, so I\'ll be tired.', options:[{t:'will be working',c:true},{t:'will work',c:false},{t:'work',c:false}], explanation:'Келажакда davom etadigan ҳаракат → Future Continuous.'},
      {prompt:'She ___ dinner when the guests arrived.', options:[{t:'was preparing',c:true},{t:'prepared',c:false},{t:'had prepared',c:false}], explanation:'Мехмонлар келганда davom etayotgan ҳаракат → Past Continuous.'},
      {prompt:'I ___ never ___ such a strange thing before.', options:[{t:'had; seen',c:true},{t:'have; seen',c:false},{t:'did; see',c:false}], explanation:'"Before" (ўтмишдаги ўтмиш) → Past Perfect.'},
      {prompt:'How long ___ you ___ here?', options:[{t:'have; been living',c:true},{t:'do; live',c:false},{t:'are; living',c:false}], explanation:'"How long" davomiylik → Present Perfect Continuous.'},
      {prompt:'By next summer, I ___ my degree.', options:[{t:'will have completed',c:true},{t:'will complete',c:false},{t:'am completing',c:false}], explanation:'Келажакда tugallangan иш → Future Perfect.'},
      {prompt:'They ___ in this house for 10 years before they sold it.', options:[{t:'had lived',c:true},{t:'lived',c:false},{t:'were living',c:false}], explanation:'Сотишдан олдин 10 йил яшаган → Past Perfect.'},
      {prompt:'She ___ usually ___ tea in the morning.', options:[{t:'drinks; —',c:true},{t:'is; drinking',c:false},{t:'has; drunk',c:false}], explanation:'"Usually" одат → Present Simple.'},
      {prompt:'We ___ for two hours when the storm hit.', options:[{t:'had been sailing',c:true},{t:'sailed',c:false},{t:'were sailing',c:false}], explanation:'Бўрондан олдин 2 соат davom etgan → Past Perfect Continuous.'},
      {prompt:'Listen! Someone ___ at the door.', options:[{t:'is knocking',c:true},{t:'knocks',c:false},{t:'has knocked',c:false}], explanation:'"Listen!" ҳозирги пайт → Present Continuous.'},
      {prompt:'I ___ this report by tomorrow evening.', options:[{t:'will have finished',c:true},{t:'will finish',c:false},{t:'am finishing',c:false}], explanation:'"By tomorrow" → Future Perfect.'},
      {prompt:'He ___ a book when I entered the room.', options:[{t:'was reading',c:true},{t:'read',c:false},{t:'has read',c:false}], explanation:'Кирган пайтда davom etган → Past Continuous.'},
      {prompt:'She ___ in London for five years now.', options:[{t:'has been living',c:true},{t:'lives',c:false},{t:'is living',c:false}], explanation:'"For five years now" → Present Perfect Continuous.'},
      {prompt:'I ___ to the cinema last night.', options:[{t:'went',c:true},{t:'have gone',c:false},{t:'had gone',c:false}], explanation:'"Last night" аниқ ўтмиш → Past Simple.'},
      {prompt:'She ___ French before she moved to Paris.', options:[{t:'had studied',c:true},{t:'studied',c:false},{t:'was studying',c:false}], explanation:'Кўчишдан олдин ўқиган → Past Perfect.'},
      {prompt:'They ___ the house all morning.', options:[{t:'have been painting',c:true},{t:'paint',c:false},{t:'are painting',c:false}], explanation:'"All morning" davomiylik → Present Perfect Continuous.'},
      {prompt:'Don\'t worry! I ___ you as soon as I arrive.', options:[{t:'will call',c:true},{t:'call',c:false},{t:'am calling',c:false}], explanation:'"As soon as" — ваъда → Future Simple (will).'},
      {prompt:'I wish I ___ harder for the test.', options:[{t:'had studied',c:true},{t:'studied',c:false},{t:'would study',c:false}], explanation:'Утмишдаги афсус → "wish + past perfect".'},
      {prompt:'Our team ___ the match if we score now.', options:[{t:'will win',c:true},{t:'wins',c:false},{t:'is winning',c:false}], explanation:'First conditional: "if + present, will + base verb".'},
      {prompt:'When I got home, my family ___ dinner.', options:[{t:'was having',c:true},{t:'had',c:false},{t:'has had',c:false}], explanation:'Уйга келганда davom etган ҳаракат → Past Continuous.'},
      {prompt:'This is the third time you ___ the same question.', options:[{t:'have asked',c:true},{t:'ask',c:false},{t:'are asking',c:false}], explanation:'"This is the third time" → Present Perfect.'},
      {prompt:'I ___ my keys. Have you seen them?', options:[{t:'have lost',c:true},{t:'lost',c:false},{t:'was losing',c:false}], explanation:'Ҳозирги натижа → Present Perfect.'}
    ]
  }
];

let grammarExerciseState = null;

function renderGrammarExercises() {
  document.getElementById('grammar-tab-content').innerHTML = `
    <div class="g-ex-hero">
      <div class="g-ex-hero-inner">
        <div class="g-ex-hero-icon">${ic('edit')}</div>
        <div class="g-ex-hero-title">Grammar Exercises</div>
        <div class="g-ex-hero-sub">Practice grammar with interactive exercises: error correction, sentence transformation, and tense selection.</div>
      </div>
    </div>
    <div class="g-ex-grid">
      ${GRAMMAR_EXERCISES.map(ex => `
        <div class="g-ex-card" onclick="startGrammarExercise('${ex.id}')">
          <div class="g-ex-card-icon">${ex.icon}</div>
          <div class="g-ex-card-name">${ex.name}</div>
          <div class="g-ex-card-desc">${ex.desc}</div>
          <div class="g-ex-card-count">${ex.questions.length} questions</div>
          <button class="btn btn-primary btn-sm">Start Exercise</button>
        </div>
      `).join('')}
    </div>
    <div style="text-align:center">
      <button class="btn btn-ghost" onclick="switchGrammarTab('quiz')">${ic('target')} Try Grammar Quiz Instead</button>
    </div>`;
}

function startGrammarExercise(exId) {
  const ex = GRAMMAR_EXERCISES.find(e => e.id === exId);
  if(!ex) return;
  const shuffled = ex.questions.map(q => {
    const opts = q.options.map((o,i) => ({...o, origIdx:i}));
    for(let i=opts.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [opts[i],opts[j]]=[opts[j],opts[i]]; }
    return { ...q, options:opts };
  });
  grammarExerciseState = { ex, questions:shuffled, current:0, score:0, total:shuffled.length };
  renderGrammarExerciseQuestion();
}

function renderGrammarExerciseQuestion() {
  const gex = grammarExerciseState;
  if(!gex || gex.current >= gex.total) { showGrammarExerciseResult(); return; }
  const q = gex.questions[gex.current];
  const pct = (gex.current/gex.total)*100;
  const exEl = document.getElementById('grammar-tab-content');
  if (!exEl) return;
  exEl.innerHTML = `
    <div class="g-ex-container">
      <div class="g-ex-back-row">
        <button class="g-ex-back-btn" onclick="switchGrammarTab('exercises')">${ic('back')} Back</button>
        <span class="g-ex-ex-name">${gex.ex.icon} ${gex.ex.name}</span>
      </div>
      <div class="g-quiz-progress"><div class="g-quiz-fill" style="width:${pct}%"></div></div>
      <div class="g-quiz-info">
        <span>Question ${gex.current+1} of ${gex.total}</span>
        <span>Score: ${gex.score}</span>
      </div>
      <div class="g-ex-instructions">${gex.ex.instructions}</div>
      <div class="g-ex-prompt">${q.prompt}</div>
      <div class="g-ex-options">
        ${q.options.map((o,i) => `<div class="g-ex-opt" data-optidx="${i}" onclick="answerGrammarExercise(this,${i})">${o.t}</div>`).join('')}
      </div>
      <div class="g-ex-feedback" id="grammar-ex-feedback"></div>
    </div>`;
}

function answerGrammarExercise(el, idx) {
  document.querySelectorAll('.g-ex-opt').forEach(e => e.classList.add('locked'));
  const gex = grammarExerciseState;
  const q = gex.questions[gex.current];
  const opt = q.options[idx];
  const isCorrect = opt && opt.c === true;
  const correctText = q.options.find(o => o.c === true).t;
  if(isCorrect) { el.classList.add('correct'); gex.score++; }
  else { el.classList.add('wrong'); q.options.forEach((o,i) => { if(o.c===true) document.querySelectorAll('.g-ex-opt')[i].classList.add('correct'); }); }
  const fb = document.getElementById('grammar-ex-feedback');
  if(fb) {
    fb.className = `g-ex-feedback show ${isCorrect?'correct':'wrong'}`;
    fb.innerHTML = isCorrect
      ? `<div style="font-weight:600;margin-bottom:4px">✅ To'g'ri!</div><div style="font-size:13px">${q.explanation}</div>`
      : `<div style="font-weight:600;margin-bottom:4px">❌ Noto'g'ri. To'g'ri javob: "${correctText}"</div><div style="font-size:13px">${q.explanation}</div>`;
  }
  gex.current++;
  setTimeout(() => renderGrammarExerciseQuestion(), isCorrect ? 1200 : 2500);
}

function showGrammarExerciseResult() {
  const gex = grammarExerciseState;
  const pct = Math.round(gex.score/gex.total*100);
  const g = state.grammar;
  addGrammarXP(gex.score*2, `${gex.ex.name}: ${gex.score}/${gex.total}`);
  checkGrammarAchievements();
  if(pct===100) confetti();
  const exResEl = document.getElementById('grammar-tab-content');
  if (!exResEl) return;
  exResEl.innerHTML = `
    <div class="g-ex-result">
      <div class="g-ex-result-icon">${pct>=80?ic('trophy',56):ic('medal',56)}</div>
      <div class="g-ex-result-title">Exercise Complete!</div>
      <div class="g-ex-result-score">${gex.score} / ${gex.total} correct (${pct}%)</div>
      <div class="g-ex-result-xp">+${gex.score*2} Grammar XP earned</div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="startGrammarExercise('${gex.ex.id}')">Try Again</button>
        <button class="btn btn-ghost" onclick="switchGrammarTab('exercises')">${ic('back')} Back to Exercises</button>
      </div>
    </div>`;
  grammarExerciseState = null;
}

// =============================================
// AI GRAMMAR TUTOR — Chat-based Multi-turn
// =============================================
let grammarAILoading = false;
var grammarAIChat = [];
var grammarAICorrectionMode = false;
const GRAMMAR_AI_STORAGE_KEY = 'vocabmaster_grammar_ai_chat';

function grammarAILoadChat() {
  try {
    const saved = localStorage.getItem(GRAMMAR_AI_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        grammarAIChat = parsed;
        return true;
      }
    }
  } catch (_) {}
  return false;
}

function grammarAISaveChat() {
  try {
    const toSave = grammarAIChat.map(function(m) {
      return { role: m.role, content: m.content, time: m.time };
    });
    localStorage.setItem(GRAMMAR_AI_STORAGE_KEY, JSON.stringify(toSave));
  } catch (_) {}
}

function grammarAINow() { return new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }); }

async function grammarAIAnalyze(text) {
  if (typeof requirePremium === 'function' && !requirePremium('AI Tutor')) return;
  if (grammarAILoading) return;
  const chatEl = document.getElementById('grammar-ai-chat');
  if (!chatEl) return;
  if (!text) { text = document.getElementById('grammar-ai-input')?.value?.trim(); }
  if (!text) return;
  grammarAILoading = true;

  document.getElementById('grammar-ai-input').value = '';
  document.getElementById('grammar-ai-input').style.height = 'auto';
  document.getElementById('grammar-ai-send').disabled = true;
  document.getElementById('grammar-ai-send').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;animation:spin 0.8s linear infinite"><circle cx="12" cy="12" r="10" stroke-dasharray="40" stroke-dashoffset="10"/></svg>';
  document.getElementById('grammar-ai-send').style.opacity = '0.6';

  grammarAIChat.push({ role:'user', content:text, time: grammarAINow() });
  grammarAIChat.push({ role:'assistant', content:'', loading:true });
  grammarAIRenderChat();
  grammarAIChatScroll();

  let reply = '';

  try {
    const context = grammarAIChat.filter(function(m) { return m.role === 'user'; }).slice(-5).map(function(m) { return m.content; });
    var isCorrection = grammarAICorrectionMode || /correct|fix|mistake|error|wrong|grammar check/i.test(text);
    var modeInstruction = isCorrection
      ? 'The user wants you to CORRECT or REVIEW text. First identify any errors, then provide the corrected version with brief explanations. Format: list each issue and the fix.'
      : 'Help the user with their question about English. You may use **bold** for emphasis, `code` for examples, and simple markdown-like formatting.';
    var prompt = 'You are an expert English language tutor. ' + modeInstruction + '\n\nUser message: "' + text + '"' +
      (context.length > 1 ? '\n\nPrevious context: ' + context.slice(0,-1).join(' | ') : '') +
      '\n\nRespond clearly and helpfully. Keep it concise (under 200 words). Use **bold** for key terms. Use `backticks` for example sentences or words. Use short paragraphs with line breaks.';

    const content = await groqChat(prompt, 0.5, 700);
    if (content) reply = content;
  } catch (_) {}

  if (!reply) {
    reply = "I'm sorry, I couldn't process your request right now. Please try again.";
  }

  var lastIdx = grammarAIChat.length - 1;
  grammarAIChat[lastIdx] = { role:'assistant', content:reply, loading:false, time: grammarAINow() };
  grammarAIRenderChat();
  grammarAIChatScroll();
  grammarAISaveChat();

  grammarAILoading = false;
  document.getElementById('grammar-ai-send').disabled = false;
  document.getElementById('grammar-ai-send').innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>';
  document.getElementById('grammar-ai-send').style.opacity = '1';
  document.getElementById('grammar-ai-input').focus();
}

function grammarAIChatScroll() {
  var el = document.getElementById('grammar-ai-chat');
  if (el) setTimeout(function() { el.scrollTop = el.scrollHeight; }, 50);
}

function grammarAIRenderChat() {
  var container = document.getElementById('grammar-ai-chat');
  if (!container) return;
  if (grammarAIChat.length === 0) {
    container.innerHTML =
      '<div class="ai-empty-state">' +
        '<div class="ai-empty-icon">' +
          '<svg viewBox="0 0 36 36" fill="none"><rect x="10" y="6" width="16" height="20" rx="4" stroke="url(#aig)" stroke-width="2"/><circle cx="18" cy="26" r="1.5" fill="url(#aig)"/><path d="M14 14h8M14 18h6" stroke="url(#aig)" stroke-width="1.5" stroke-linecap="round"/><defs><linearGradient id="aig" x1="0" y1="0" x2="36" y2="36"><stop stop-color="#A78BFA"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs></svg>' +
        '</div>' +
        '<div class="ai-empty-title">AI Grammar Tutor</div>' +
        '<div class="ai-empty-desc">Your personal English assistant. Ask me about grammar, vocabulary, writing tips, sentence correction, or anything about learning English.</div>' +
        '<div class="ai-suggest-grid">' +
          '<div class="ai-suggest-chip" onclick="grammarAIAnalyze(\'What is the difference between Present Perfect and Past Simple?\')"><span class="chip-icon">\ud83d\udd52</span> Present vs Past Simple</div>' +
          '<div class="ai-suggest-chip" onclick="grammarAIAnalyze(\'Correct this sentence: He go to school every day.\')"><span class="chip-icon">\u270f\ufe0f</span> Check a sentence</div>' +
          '<div class="ai-suggest-chip" onclick="grammarAIAnalyze(\'Explain the first conditional with examples\')"><span class="chip-icon">\u2764\ufe0f</span> Conditionals</div>' +
          '<div class="ai-suggest-chip" onclick="grammarAIAnalyze(\'Give me 5 tips to improve my English writing\')"><span class="chip-icon">\ud83d\udcdd</span> Writing tips</div>' +
          '<div class="ai-suggest-chip" onclick="grammarAIAnalyze(\'What are stative verbs and how to use them?\')"><span class="chip-icon">\ud83d\udcac</span> Stative verbs</div>' +
          '<div class="ai-suggest-chip" onclick="grammarAIAnalyze(\'Help me practice for IELTS writing task 2\')"><span class="chip-icon">\ud83c\udfdb\ufe0f</span> IELTS practice</div>' +
          '<div class="ai-suggest-chip" onclick="grammarAIAnalyze(\'Explain when to use "a", "an", and "the" with examples\')"><span class="chip-icon">\ud83d\udd20</span> Articles guide</div>' +
          '<div class="ai-suggest-chip" onclick="grammarAIAnalyze(\'Correct my paragraph: I goes to school yesterday. She dont like coffee. They is happy.\')"><span class="chip-icon">\ud83d\udcdd</span> Fix paragraph</div>' +
        '</div>' +
      '</div>';
    grammarAIChatScroll();
    return;
  }
  var prevRole = '';
  container.innerHTML = grammarAIChat.map(function(m, idx) {
    var isSame = m.role === prevRole;
    prevRole = m.role;
    var contClass = isSame ? ' continued' : '';
    if (m.role === 'user') {
      var timeHtml = m.time ? '<div class="ai-msg-time">' + m.time + '</div>' : '';
      return '<div class="ai-msg-row user-row' + contClass + '">' +
        '<div class="ai-msg-bubble user-bubble">' + escHtml(m.content) + timeHtml + '</div>' +
        (isSame ? '' : '<div class="ai-msg-avatar user">U</div>') +
      '</div>';
    }
    if (m.loading) {
      return '<div class="ai-msg-row assistant-row">' +
        '<div class="ai-msg-avatar assistant">' +
          '<svg viewBox="0 0 20 20" fill="none" style="width:16px;height:16px"><rect x="5" y="3" width="10" height="13" rx="3" stroke="#fff" stroke-width="1.5"/><circle cx="10" cy="15" r="1" fill="#fff"/><path d="M7 7h6M7 10h4" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/></svg>' +
        '</div>' +
        '<div class="ai-thinking">' +
          '<div class="ai-thinking-dots"><div class="ai-thinking-dot"></div><div class="ai-thinking-dot"></div><div class="ai-thinking-dot"></div></div>' +
        '</div>' +
      '</div>';
    }
    var showAvatar = !isSame;
    var timeHtml2 = m.time ? '<div class="ai-msg-time">' + m.time + '</div>' : '';
    return '<div class="ai-msg-row assistant-row' + contClass + '" style="position:relative">' +
      (showAvatar ? '<div class="ai-msg-avatar assistant">' +
        '<svg viewBox="0 0 20 20" fill="none" style="width:16px;height:16px"><rect x="5" y="3" width="10" height="13" rx="3" stroke="#fff" stroke-width="1.5"/><circle cx="10" cy="15" r="1" fill="#fff"/><path d="M7 7h6M7 10h4" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/></svg>' +
      '</div>' : '<div style="width:32px;flex-shrink:0"></div>') +
      '<div class="ai-msg-bubble assistant-bubble">' + grammarAIFormatResponse(escHtml(m.content)) + timeHtml2 +
        '<button class="ai-copy-btn" onclick="grammarAICopyMsg(this,' + idx + ')" title="Copy">' + ic('check',14) + '</button>' +
      '</div>' +
    '</div>';
  }).join('');
  grammarAIChatScroll();
}

function grammarAICopyMsg(btn, idx) {
  var msg = grammarAIChat[idx];
  if (!msg || msg.loading) return;
  navigator.clipboard.writeText(msg.content).then(function() {
    btn.innerHTML = ic('check',14);
    btn.classList.add('copied');
    setTimeout(function() {
      btn.innerHTML = ic('check',14);
      btn.classList.remove('copied');
    }, 2000);
  }).catch(function() {});
}

function renderGrammarAI() {
  var msgCount = grammarAIChat.filter(function(m) { return m.role === 'assistant' && !m.loading; }).length;
  var correctionActive = grammarAICorrectionMode;
  document.getElementById('grammar-tab-content').innerHTML = '' +
    '<div class="ai-chat-wrap">' +
      '<div class="ai-chat-header">' +
        '<div class="ai-chat-header-left">' +
          '<div class="ai-chat-avatar">' + ic('brain',20) + '</div>' +
          '<div>' +
            '<div class="ai-chat-title">AI Grammar Tutor</div>' +
            '<div class="ai-chat-subtitle">' + msgCount + ' messages \u2022 Groq AI</div>' +
          '</div>' +
        '</div>' +
        '<div class="ai-chat-actions">' +
          '<div class="ai-correction-toggle' + (correctionActive ? ' active' : '') + '" onclick="grammarAIToggleCorrection()" title="Correction mode"><span>' + (correctionActive ? ic('check') : ic('edit')) + '</span> Correction</div>' +
          '<button class="ai-chat-action-btn" onclick="grammarAIClearChat()" title="New chat">' + ic('reload',16) + '</button>' +
        '</div>' +
      '</div>' +
      '<div id="grammar-ai-chat" class="ai-chat-messages"></div>' +
      '<div class="ai-chat-input-wrap">' +
        '<div class="ai-chat-input-box">' +
          '<textarea id="grammar-ai-input" class="ai-chat-input" rows="1" placeholder="Ask anything about English grammar..." onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();grammarAIAnalyze()}" oninput="autoResizeAIInput(this)"></textarea>' +
          '<button id="grammar-ai-send" class="ai-chat-send-btn" onclick="grammarAIAnalyze()" disabled>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="ai-chat-bottom-row">' +
          '<span class="ai-chat-bottom-hint">AI can make mistakes. Verify important information.</span>' +
          '<button class="ai-chat-clear-btn" onclick="grammarAIClearChat()">Clear chat</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  if (grammarAIChat.length > 0) grammarAIRenderChat();
  var inputEl = document.getElementById('grammar-ai-input');
  if (inputEl) {
    inputEl.addEventListener('input', function() { toggleAISendBtn(); });
    inputEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); grammarAIAnalyze(); }
    });
    inputEl.focus();
  }
  grammarAIChatScroll();
}

function grammarAIToggleCorrection() {
  grammarAICorrectionMode = !grammarAICorrectionMode;
  var toggle = document.querySelector('.ai-correction-toggle');
  if (toggle) {
    toggle.classList.toggle('active');
    toggle.innerHTML = '<span>' + (grammarAICorrectionMode ? ic('check') : ic('edit')) + '</span> Correction';
  }
  var input = document.getElementById('grammar-ai-input');
  if (input) {
    input.placeholder = grammarAICorrectionMode
      ? 'Paste text to check for grammar errors...'
      : 'Ask anything about English grammar...';
    input.focus();
  }
}

function autoResizeAIInput(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function toggleAISendBtn() {
  var btn = document.getElementById('grammar-ai-send');
  var input = document.getElementById('grammar-ai-input');
  if (btn && input) {
    btn.disabled = !input.value.trim();
  }
}

function grammarAIFormatResponse(text) {
  // Tables: | col1 | col2 | ... -> <table>
  text = text.replace(/\|(.+?)\|\s*(\n\|[-| :]+\|\s*)?\n((?:\|.+\|\s*\n?)*)/g, function(match) {
    var lines = match.trim().split('\n');
    if (lines.length < 2) return match;
    var isTable = lines.every(function(l) { return l.trim().startsWith('|') && l.trim().endsWith('|'); });
    if (!isTable) return match;
    var hasSeparator = lines[1] && /^\|[-| :]+\|$/.test(lines[1].trim());
    var headerRow = lines[0];
    var dataStart = hasSeparator ? 2 : 1;
    var headers = headerRow.split('|').filter(Boolean).map(function(h) { return h.trim(); });
    var tableHtml = '<table><thead><tr>';
    headers.forEach(function(h) { tableHtml += '<th>' + h + '</th>'; });
    tableHtml += '</tr></thead><tbody>';
    for (var i = dataStart; i < lines.length; i++) {
      var cells = lines[i].split('|').filter(Boolean).map(function(c) { return c.trim(); });
      if (cells.length > 0) {
        tableHtml += '<tr>';
        cells.forEach(function(c) { tableHtml += '<td>' + c + '</td>'; });
        tableHtml += '</tr>';
      }
    }
    tableHtml += '</tbody></table>';
    return tableHtml;
  });
  // Headers: ### text or #### text
  text = text.replace(/^#{3,4}\s+(.+)$/gm, '<h4>$1</h4>');
  // Bold: **text**
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Inline code: `text`
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Code blocks: ```code```
  text = text.replace(/```(\w*)\s*([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  // Unordered lists: * item or - item
  text = text.replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  // Ordered lists: 1. item
  text = text.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*<\/li>\n?)+/g, function(m) {
    return m.indexOf('<ol>') === -1 ? '<ol>' + m + '</ol>' : m;
  }, 1);
  // Blockquotes: > text
  text = text.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  // Horizontal rules
  text = text.replace(/^---$/gm, '<hr>');
  // Line breaks (preserve double breaks for paragraphs)
  text = text.replace(/\n\n/g, '</p><p>');
  text = text.replace(/\n/g, '<br>');
  return '<p>' + text + '</p>';
}

function grammarAIClearChat() {
  if (grammarAIChat.length > 0 && !confirm('Clear conversation history?')) return;
  grammarAIChat = [];
  grammarAIRenderChat();
  grammarAISaveChat();
  var input = document.getElementById('grammar-ai-input');
  if (input) { input.value = ''; input.focus(); }
}

// Load saved chat on init
grammarAILoadChat();

// =============================================
// GRAMMAR — ANALYTICS
// =============================================
function renderGrammarAnalytics() {
  const g = state.grammar;
  const completedTenses = GRAMMAR_TENSES.filter(t=>g.completedLessons.includes(t.id)).length;
  const totalTenses = GRAMMAR_TENSES.length;
  const tensesPct = totalTenses ? Math.round(completedTenses/totalTenses*100) : 0;
  const accuracy = g.totalQuestions ? Math.round(g.totalCorrect/g.totalQuestions*100) : 0;
  const rank = getGrammarRank(g.xp);

  // Category stats
  const completedCats = GRAMMAR_CATEGORIES.filter(c => g.completedLessons.includes('cat:'+c.id)).length;
  const totalCats = GRAMMAR_CATEGORIES.length;

  // Tense group breakdown
  const groups = ['Present Tenses','Past Tenses','Future Tenses'];
  const groupStats = groups.map(gr => {
    const tenses = GRAMMAR_TENSES.filter(t=>t.group===gr);
    const done = tenses.filter(t=>g.completedLessons.includes(t.id)).length;
    return { group:gr, done, total:tenses.length, pct:Math.round(done/tenses.length*100) };
  });

  // Strongest & weakest topics (using category completion)
  const catStats = GRAMMAR_CATEGORIES.map(c=>({...c, done:g.completedLessons.includes('cat:'+c.id)}));
  const completed = catStats.filter(c=>c.done);
  const notCompleted = catStats.filter(c=>!c.done);

  // Weekly activity
  const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const today = new Date().getDay();
  const weeklyVals = weekDays.map((_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-((today+6-i)%7));
    return g.heatmap[d.toISOString().split('T')[0]] || 0;
  });
  const maxVal = Math.max(...weeklyVals,1);

  // Monthly heatmap (last 28 days)
  const days28 = [];
  for(let i=27;i>=0;i--) {
    const d=new Date(); d.setDate(d.getDate()-i);
    const key = d.toISOString().split('T')[0];
    days28.push({ date:key, val:g.heatmap[key]||0, day:d.getDate() });
  }
  const maxDay = Math.max(...days28.map(d=>d.val),1);

  // Quiz trend (last 10 quizzes from heatmap approximation)
  const quizAccuracy = g.totalQuizzes > 0 ? accuracy : 0;

  document.getElementById('grammar-tab-content').innerHTML = `
    <div class="g-an-hero">
      <div class="g-an-hero-inner">
        <div class="g-an-hero-icon">${ic('chart',38)}</div>
        <div class="g-an-hero-title">Grammar Analytics</div>
        <div class="g-an-hero-sub">Your learning progress, weekly activity, and achievements at a glance.</div>
      </div>
    </div>

    <div class="g-an-grid">
      <div class="g-an-card">
        <div class="g-an-ring-wrap">
          <div class="g-an-ring-label">OVERALL MASTERY</div>
          <div style="position:relative;display:inline-block">
            <svg class="g-an-ring-svg" viewBox="0 0 80 80">
              <circle class="g-an-ring-bg" cx="40" cy="40" r="34"/>
              <circle class="g-an-ring-fill" cx="40" cy="40" r="34" stroke-dasharray="213.6" stroke-dashoffset="${213.6-(213.6*tensesPct/100)}"/>
            </svg>
            <div class="g-an-ring-text">${tensesPct}%</div>
          </div>
          <div class="g-an-ring-sub">${completedTenses}/${totalTenses} tenses mastered</div>
        </div>
      </div>
      <div class="g-an-card">
        <div class="g-an-section-title"><span>${ic('chart')}</span>Key Metrics</div>
        <div class="g-an-metrics">
          <div class="g-an-metric"><span class="g-an-metric-label">Total XP</span><span class="g-an-metric-value purple">${g.xp}</span></div>
          <div class="g-an-metric"><span class="g-an-metric-label">Rank</span><span class="g-an-metric-value orange">${rank.icon} ${rank.name}</span></div>
          <div class="g-an-metric"><span class="g-an-metric-label">Quiz Accuracy</span><span class="g-an-metric-value green">${quizAccuracy}%</span></div>
          <div class="g-an-metric"><span class="g-an-metric-label">Quizzes Taken</span><span class="g-an-metric-value cyan">${g.totalQuizzes}</span></div>
          <div class="g-an-metric"><span class="g-an-metric-label">Streak</span><span class="g-an-metric-value orange">${g.streak} days</span></div>
          <div class="g-an-metric"><span class="g-an-metric-label">Lessons</span><span class="g-an-metric-value green">${g.totalLessons}</span></div>
          <div class="g-an-metric"><span class="g-an-metric-label">Categories</span><span class="g-an-metric-value purple">${completedCats}/${totalCats}</span></div>
        </div>
      </div>
    </div>

    <div class="g-an-section-title"><span>${ic('clock')}</span>Tense Groups</div>
    <div class="g-an-group-grid">
      ${groupStats.map(gr => `
        <div class="g-an-group-card">
          <div class="g-an-group-label">${gr.group.replace(' Tenses','')}</div>
          <div class="g-an-group-pct ${gr.pct===100?'full':'partial'}">${gr.pct}%</div>
          <div class="g-an-group-count">${gr.done}/${gr.total} tenses</div>
          <div class="g-an-group-bar">
            <div class="g-an-group-fill ${gr.pct===100?'full':'partial'}" style="width:${gr.pct}%"></div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="g-an-cat-grid">
      <div class="g-an-cat-card">
        <div class="g-an-cat-title"><span>${ic('check')}</span>Completed Categories (${completed.length})</div>
        ${completed.length===0 ? '<div class="g-an-cat-empty">No categories completed yet. Start learning!</div>' :
          '<div class="g-an-cat-tags">'+completed.map(c=>'<span class="g-an-cat-tag done">'+c.icon+' '+c.name+'</span>').join('')+'</div>'}
      </div>
      <div class="g-an-cat-card">
        <div class="g-an-cat-title"><span>${ic('back')}</span>Remaining Categories (${notCompleted.length})</div>
        ${notCompleted.length===0 ? '<div class="g-an-cat-empty" style="color:#34C759">'+ic('check')+' All categories completed!</div>' :
          '<div class="g-an-cat-tags">'+notCompleted.slice(0,12).map(c=>'<span class="g-an-cat-tag pending" onclick="openCategoryLesson(\''+c.id+'\')">'+c.icon+' '+c.name+'</span>').join('')+'</div>'}
        ${notCompleted.length>12 ? '<div style="font-size:11px;color:var(--ios-tertiary-label);margin-top:6px">+'+(notCompleted.length-12)+' more</div>' : ''}
      </div>
    </div>

    <div class="g-an-week-card">
      <div class="g-an-section-title"><span>${ic('calendar')}</span>Weekly Activity</div>
      <div class="g-an-chart">
        ${weekDays.map((d,i)=>`
          <div class="g-an-chart-row">
            <div class="g-an-chart-label">${d}</div>
            <div class="g-an-chart-track"><div class="g-an-chart-fill" style="width:${(weeklyVals[i]/maxVal*100).toFixed(0)}%"></div></div>
            <div class="g-an-chart-val">${weeklyVals[i]}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="g-an-heat-card">
      <div class="g-an-section-title"><span>${ic('calendar')}</span>Last 28 Days Activity</div>
      <div class="g-an-heat-grid">
        ${days28.map(d => {
          const intensity = d.val === 0 ? 'rgba(128,128,128,0.08)' : d.val >= maxDay*0.75 ? '#34C759' : d.val >= maxDay*0.5 ? '#10b981' : d.val >= maxDay*0.25 ? '#6ee7b7' : '#a7f3d0';
          return '<div class="g-an-heat-cell" title="'+d.date+': '+d.val+' activities" style="background:'+intensity+';opacity:'+(d.val===0?'1':'1')+'"></div>';
        }).join('')}
      </div>
      <div class="g-an-heat-legend">
        <span>${days28[0].date}</span>
        <span class="g-an-heat-legend-dots">
          <span class="g-an-heat-dot" style="background:rgba(128,128,128,0.08)"></span> Less
          <span class="g-an-heat-dot" style="background:#a7f3d0"></span>
          <span class="g-an-heat-dot" style="background:#6ee7b7"></span>
          <span class="g-an-heat-dot" style="background:#10b981"></span>
          <span class="g-an-heat-dot" style="background:#34C759"></span> More
        </span>
        <span>${days28[27].date}</span>
      </div>
    </div>

    <div class="g-an-ach-card">
      <div class="g-an-ach-title"><span>${ic('medal')}</span>Achievements <span style="font-size:12px;font-weight:400;color:var(--ios-tertiary-label)">${g.achievements.length}/${GRAMMAR_ACHIEVEMENTS.length}</span></div>
      <div class="g-an-ach-grid">
        ${GRAMMAR_ACHIEVEMENTS.slice(0,6).map(a=>{
          const unlocked = g.achievements.includes(a.id);
          const p = a.progress(g);
          const rarityColor = GRAMMAR_RARITY[a.rarity] || '#888';
          return `<div class="g-an-ach-item" ${unlocked?'style="border-color:rgba(52,199,89,0.3)"':''}>
            ${unlocked ? '' : `<div class="g-an-ach-item-badge" style="background:${rarityColor};color:#fff">${a.rarity}</div>`}
            <div class="g-an-ach-item-icon" style="${unlocked?'':'opacity:0.5'}">${a.icon}</div>
            <div class="g-an-ach-item-name" style="${unlocked?'color:#34C759':''}">${a.name}</div>
            <div class="g-an-ach-item-desc">${a.desc}</div>
            ${unlocked
              ? '<div class="g-an-ach-unlocked">'+ic('check',12)+' Unlocked</div>'
              : `<div class="g-an-ach-progress"><div class="g-an-ach-progress-fill" style="width:${Math.min(p,100)}%"></div></div>
                 <div class="g-an-ach-pct">${Math.round(Math.min(p,100))}%</div>`
            }
          </div>`;
        }).join('')}
      </div>
      <div class="g-an-ach-actions">
        <button class="btn btn-ghost btn-sm" onclick="switchGrammarTab('achievements')">${ic('medal')} All Achievements</button>
        <button class="btn btn-outline btn-sm" onclick="switchGrammarTab('tenses')">${ic('book')} Study Tenses</button>
        <button class="btn btn-primary btn-sm" onclick="switchGrammarTab('exercises')">${ic('edit')} Practice</button>
      </div>
    </div>
  `;
}

// =============================================
// GRAMMAR — ACHIEVEMENTS
// =============================================
let grammarAchFilter = 'all';
let grammarAchSearch = '';

function renderGrammarAchievements() {
  const g = state.grammar;
  const unlocked = new Set(g.achievements);
  const categories = [
    { id:'all', label:'All', icon:'📋' },
    { id:'lesson', label:'Lessons', icon:'📖' },
    { id:'quiz', label:'Quiz', icon:'❓' },
    { id:'tense', label:'Tenses', icon:'🕐' },
    { id:'category', label:'Topics', icon:'📦' },
    { id:'streak', label:'Streak', icon:'🔥' },
    { id:'rank', label:'Rank', icon:'👑' },
    { id:'xp', label:'XP', icon:'⭐' }
  ];
  const filtered = GRAMMAR_ACHIEVEMENTS.filter(a =>
    (grammarAchFilter === 'all' || a.category === grammarAchFilter) &&
    (grammarAchSearch === '' || String(a.name || '').toLowerCase().includes(grammarAchSearch) || String(a.desc || '').toLowerCase().includes(grammarAchSearch))
  );
  const totalUnlocked = unlocked.size;
  const totalAll = GRAMMAR_ACHIEVEMENTS.length;
  const pct = Math.round(totalUnlocked/totalAll*100);
  const rarities = ['common','uncommon','rare','epic','legendary'];
  const byRarity = rarities.map(r => {
    const total = GRAMMAR_ACHIEVEMENTS.filter(a => a.rarity === r).length;
    const done = GRAMMAR_ACHIEVEMENTS.filter(a => a.rarity === r && unlocked.has(a.id)).length;
    return { rarity: r, total, done, label: r.charAt(0).toUpperCase() + r.slice(1) };
  });

  function dotBar(n, total) {
    const dots = Math.round(n/total*5);
    return '<span class="g-ach-rarity-dots">'+
      Array.from({length:5},(_,i)=>`<span class="g-ach-rarity-dot ${i<dots?'filled':''}"></span>`).join('')+
    '</span>';
  }

  document.getElementById('grammar-tab-content').innerHTML = `
    <div class="g-ach-hero">
      <div class="g-ach-hero-inner">
        <div class="g-ach-hero-icon">${ic('medal',40)}</div>
        <div class="g-ach-hero-title">Grammar Achievements</div>
        <div class="g-ach-hero-sub">Collect achievements by completing lessons, quizzes, and reaching milestones.</div>
      </div>
    </div>

    <div class="g-ach-stat-row">
      <div class="g-ach-stat">
        <div class="g-ach-stat-value">${totalUnlocked}<span> / ${totalAll}</span></div>
        <div class="g-ach-stat-label">Achievements Unlocked</div>
      </div>
      <div class="g-ach-rarity-bar-wrap">
        <div class="g-ach-rarity-bar">
          <div class="g-ach-rarity-fill" style="width:${pct}%;background:linear-gradient(90deg,${rarities.map(r=>GRAMMAR_RARITY[r]).join(',')});background-size:200% 100%"></div>
        </div>
        <div class="g-ach-rarity-breakdown">
          ${byRarity.map(r => `<span class="g-ach-rarity-item" style="color:${GRAMMAR_RARITY[r.rarity]}">● ${r.label}: ${r.done}/${r.total}${dotBar(r.done,r.total)}</span>`).join('')}
        </div>
      </div>
    </div>

    <div class="g-ach-filter-row">
      <div class="g-ach-filter-tabs">
        ${categories.map(c => `
          <button class="g-ach-filter-tab ${grammarAchFilter===c.id?'active':''}" onclick="grammarAchFilter='${c.id}';renderGrammarAchievements()">${c.icon} ${c.label}</button>
        `).join('')}
      </div>
      <input type="text" class="g-ach-search" placeholder="Search achievements..." value="${grammarAchSearch}" oninput="grammarAchSearch=String(this.value).toLowerCase();renderGrammarAchievements()">
    </div>

    ${filtered.length === 0 ? `<div class="g-ach-empty">
      <div class="g-ach-empty-icon">${ic('search',40)}</div>
      <div class="g-ach-empty-title">No achievements match your filter</div>
      <div class="g-ach-empty-sub">Try a different category or search term</div>
    </div>` : `
    <div class="g-ach-grid">
      ${filtered.map((a, i) => {
        const done = unlocked.has(a.id);
        const p = a.progress(g);
        return `<div class="g-ach-item ${done?'unlocked':'locked'}" data-rarity="${a.rarity}" title="${a.desc}" style="animation-delay:${i*0.04}s" onclick="showGrammarAchievementDetail('${a.id}')">
          <div class="g-ach-item-rarity">${a.rarity}</div>
          <div class="g-ach-item-inner">
            <div class="g-ach-item-icon">${a.icon}</div>
            <div class="g-ach-item-name">${a.name}</div>
            <div class="g-ach-item-desc">${a.desc}</div>
            ${done
              ? `<div class="g-ach-item-status unlocked">${ic('check')}</div>`
              : `<div class="g-ach-item-progress"><div class="g-ach-item-progress-fill" style="width:${Math.min(p,100)}%"></div></div>
                 <div class="g-ach-item-pct">${Math.round(Math.min(p,100))}%</div>`
            }
          </div>
        </div>`;
      }).join('')}
    </div>`}

    <div class="g-ach-footer">
      <div class="g-ach-footer-label">Overall Progress: ${pct}% complete</div>
      <div class="g-ach-footer-bar">
        <div class="g-ach-footer-fill" style="width:${pct}%;background:linear-gradient(90deg,${rarities.map(r=>GRAMMAR_RARITY[r]).join(',')});background-size:200% 100%"></div>
      </div>
    </div>`;
}

function showGrammarAchievementDetail(id) {
  const ach = GRAMMAR_ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;
  const g = state.grammar;
  const unlocked = new Set(g.achievements);
  const done = unlocked.has(ach.id);
  const p = ach.progress(g);
  const rarityColor = GRAMMAR_RARITY[ach.rarity] || '#94a3b8';
  const categoryNames = { all:'All', lesson:'Lessons', quiz:'Quiz', tense:'Tenses', category:'Topics', streak:'Streak', rank:'Rank', xp:'XP' };
  const catLabel = categoryNames[ach.category] || ach.category;

  document.getElementById('ach-modal-icon').innerHTML = '<span style="font-size:48px;line-height:1">' + ach.icon + '</span>';
  document.getElementById('ach-modal-body').innerHTML = `
    <div class="ach-rarity-badge-modal" style="background:${rarityColor}">${ach.rarity}</div>
    <div class="ach-modal-name">${ach.name}</div>
    <div class="ach-modal-cat" style="background:${rarityColor}15;color:${rarityColor};border:1px solid ${rarityColor}30">${catLabel}</div>
    <div class="ach-modal-desc">${ach.desc}</div>
    ${done ? `
      <div class="ach-modal-unlocked">
        <div class="ach-modal-unlocked-text">${ic('check',16)} You unlocked this achievement!</div>
      </div>
    ` : `
      <div class="ach-modal-section">
        <div class="ach-modal-section-title"><i class="ti ti-target"></i> Progress</div>
        <div class="ach-modal-progress">
          <div class="ach-modal-progress-row">
            <span class="ach-modal-progress-label">Completion</span>
            <span class="ach-modal-progress-val">${Math.round(Math.min(p,100))}%</span>
          </div>
          <div class="ach-modal-progress-track">
            <div class="ach-modal-progress-fill" style="width:${Math.min(p,100)}%;background:${rarityColor}"></div>
          </div>
        </div>
      </div>
    `}
    <div class="ach-modal-section">
      <div class="ach-modal-section-title"><i class="ti ti-info-circle"></i> Details</div>
      <div class="ach-modal-benefit" style="background:${rarityColor}08;border-color:${rarityColor}20">
        <div class="ach-modal-benefit-title" style="color:${rarityColor}">Rarity</div>
        <div class="ach-modal-benefit-desc">${ach.rarity.charAt(0).toUpperCase() + ach.rarity.slice(1)} achievement — ${catLabel} category</div>
      </div>
      <div class="ach-modal-benefit" style="background:rgba(88,86,214,0.08);border-color:rgba(88,86,214,0.2)">
        <div class="ach-modal-benefit-title" style="color:#5856D6"><i class="ti ti-book"></i> Category</div>
        <div class="ach-modal-benefit-desc">${catLabel}</div>
      </div>
    </div>
  `;
  document.getElementById('ach-modal').classList.add('open');
}
