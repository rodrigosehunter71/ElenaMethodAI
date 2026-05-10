export interface UnitContent {
  id: string;
  title: string;
  level: string;
  order: number;
  topics: string[];
  learningObjectives: string[];
  sections: { title: string; content: string }[];
  exercises: {
    id: string;
    type: 'multiple-choice' | 'fill-in-blank';
    question: string;
    options?: string[];
    correctAnswer: string;
    feedback: string;
  }[];
}

export const units: UnitContent[] = [
  {
    id: 'unit1',
    title: 'The Verb To Be',
    level: 'A1',
    order: 1,
    topics: ['Identity', 'States', 'Locations'],
    learningObjectives: ['Understand am, is, are', 'Form affirmative/negative sentences', 'Ask basic questions'],
    sections: [
      { title: 'Grammar Reference', content: 'The verb to be is used to describe identity, states, and locations. It has three forms in the present: **am**, **is**, and **are**.\n\n| Subject | Affirmative | Negative |\n|---------|-------------|----------|\n| I | I am | I am not |\n| You | You are | You are not |\n| He/She/It | He is | He is not |\n| We/They | We are | We are not |' },
      { title: 'Questions', content: 'To form questions, we move the verb to the beginning: "Are you ready?" "Is she happy?"' }
    ],
    exercises: [
      { id: 'u1ex1', type: 'fill-in-blank', question: 'I ___ a student.', correctAnswer: 'am', feedback: 'I always takes am.' },
      { id: 'u1ex2', type: 'multiple-choice', question: 'They ___ ready.', options: ['am', 'is', 'are'], correctAnswer: 'are', feedback: 'They is plural.' },
      { id: 'u1ex3', type: 'fill-in-blank', question: 'She ___ my sister.', correctAnswer: 'is', feedback: 'She is singular third person.' },
      { id: 'u1ex4', type: 'multiple-choice', question: '___ you from Spain?', options: ['Am', 'Is', 'Are'], correctAnswer: 'Are', feedback: 'Questions with You use Are.' },
      { id: 'u1ex5', type: 'fill-in-blank', question: 'It ___ very cold today.', correctAnswer: 'is', feedback: 'It takes is.' },
      { id: 'u1ex6', type: 'multiple-choice', question: 'We ___ happy.', options: ['am', 'is', 'are'], correctAnswer: 'are', feedback: 'We is plural.' },
      { id: 'u1ex7', type: 'fill-in-blank', question: 'You ___ (be) a good friend.', correctAnswer: 'are', feedback: 'You always takes are.' },
      { id: 'u1ex8', type: 'multiple-choice', question: '___ he your brother?', options: ['Am', 'Is', 'Are'], correctAnswer: 'Is', feedback: 'He takes is.' },
      { id: 'u1ex9', type: 'fill-in-blank', question: 'The cat ___ black.', correctAnswer: 'is', feedback: 'The cat is "it".' },
      { id: 'u1ex10', type: 'multiple-choice', question: 'I ___ not hungry.', options: ['am', 'is', 'are'], correctAnswer: 'am', feedback: 'Negative of I am.' }
    ]
  },
  {
    id: 'unit2',
    title: 'Present Simple',
    level: 'A1',
    order: 2,
    topics: ['Habits', 'Routines', 'Facts'],
    learningObjectives: ['Routine actions', 'Third person -s', 'Do/Does questions'],
    sections: [
      { title: 'Usage', content: 'We use Present Simple for habits, routines, and permanent truths.\n\n- I drink coffee every morning.\n- The sun rises in the east.' },
      { title: 'Third Person Singular', content: 'For **he, she, it**, we add **-s** or **-es** to the verb.\n\n- I play -> He plays\n- I watch -> She watches' }
    ],
    exercises: [
      { id: 'u2ex1', type: 'fill-in-blank', question: 'He ___ (play) football.', correctAnswer: 'plays', feedback: 'Add -s for he/she/it.' },
      { id: 'u2ex2', type: 'multiple-choice', question: 'I ___ coffee.', options: ['drink', 'drinks'], correctAnswer: 'drink', feedback: 'Only he/she/it takes -s.' },
      { id: 'u2ex3', type: 'fill-in-blank', question: 'She ___ (go) to school.', correctAnswer: 'goes', feedback: 'Go becomes goes for she.' },
      { id: 'u2ex4', type: 'multiple-choice', question: '___ you like pizza?', options: ['Do', 'Does'], correctAnswer: 'Do', feedback: 'Use Do for I/You/We/They.' },
      { id: 'u2ex5', type: 'fill-in-blank', question: 'The cat ___ (sleep) a lot.', correctAnswer: 'sleeps', feedback: 'The cat is "it", so add -s.' },
      { id: 'u2ex6', type: 'multiple-choice', question: 'They ___ English.', options: ['study', 'studies'], correctAnswer: 'study', feedback: 'They does not take -s.' },
      { id: 'u2ex7', type: 'fill-in-blank', question: 'My father ___ (work) in a bank.', correctAnswer: 'works', feedback: 'Father is "he".' },
      { id: 'u2ex8', type: 'multiple-choice', question: '___ she speak French?', options: ['Do', 'Does'], correctAnswer: 'Does', feedback: 'Use Does for she.' },
      { id: 'u2ex9', type: 'fill-in-blank', question: 'We ___ (not/like) cold weather.', correctAnswer: 'do not like', feedback: 'Use do not for we.' },
      { id: 'u2ex10', type: 'multiple-choice', question: 'Birds ___ south in winter.', options: ['fly', 'flies'], correctAnswer: 'fly', feedback: 'Birds is plural.' }
    ]
  },
  {
    id: 'unit3',
    title: 'Present Continuous',
    level: 'A1',
    order: 3,
    topics: ['Current Actions', 'Temporary States'],
    learningObjectives: ['Actions happening now', 'Am/Is/Are + -ing'],
    sections: [
      { title: 'Structure', content: 'Subject + am/is/are + verb-ing.\n\n- I am reading.\n- They are playing.' },
      { title: 'Now vs Always', content: 'Use Present Continuous for things happening **right now**.' }
    ],
    exercises: [
      { id: 'u3ex1', type: 'fill-in-blank', question: 'They are ___ (eat) lunch.', correctAnswer: 'eating', feedback: 'Use verb+ing.' },
      { id: 'u3ex2', type: 'multiple-choice', question: 'I ___ working right now.', options: ['am', 'is', 'are'], correctAnswer: 'am', feedback: 'I takes am.' },
      { id: 'u3ex3', type: 'fill-in-blank', question: 'She is ___ (listen) to music.', correctAnswer: 'listening', feedback: 'Add -ing to the verb.' },
      { id: 'u3ex4', type: 'multiple-choice', question: 'What ___ you doing?', options: ['am', 'is', 'are'], correctAnswer: 'are', feedback: 'You takes are.' },
      { id: 'u3ex5', type: 'fill-in-blank', question: 'We are ___ (study) English.', correctAnswer: 'studying', feedback: 'Continuous form of study.' },
      { id: 'u3ex6', type: 'multiple-choice', question: 'Look! It ___ raining.', options: ['am', 'is', 'are'], correctAnswer: 'is', feedback: 'It takes is.' },
      { id: 'u3ex7', type: 'fill-in-blank', question: 'You are ___ (run) very fast.', correctAnswer: 'running', feedback: 'Double the n in running.' },
      { id: 'u3ex8', type: 'multiple-choice', question: '___ they coming to the party?', options: ['Am', 'Is', 'Are'], correctAnswer: 'Are', feedback: 'They takes are.' },
      { id: 'u3ex9', type: 'fill-in-blank', question: 'I am ___ (write) an email.', correctAnswer: 'writing', feedback: 'Remove the e before adding -ing.' },
      { id: 'u3ex10', type: 'multiple-choice', question: 'The children ___ playing.', options: ['am', 'is', 'are'], correctAnswer: 'are', feedback: 'Children is plural.' }
    ]
  },
  {
    id: 'unit4',
    title: 'Articles: A, An, The',
    level: 'A1',
    order: 4,
    topics: ['Nouns', 'Specificity', 'Vowels'],
    learningObjectives: ['Indefinite vs Definite', 'Vowel sounds'],
    sections: [
      { title: 'A vs An', content: 'Use **a** before consonant sounds and **an** before vowel sounds (a, e, i, o, u).\n\n- A car\n- An apple' },
      { title: 'The', content: 'Use **the** for specific things or things we already mentioned.' }
    ],
    exercises: [
      { id: 'u4ex1', type: 'fill-in-blank', question: 'I have ___ apple.', correctAnswer: 'an', feedback: 'Apple starts with a vowel.' },
      { id: 'u4ex2', type: 'multiple-choice', question: 'He is ___ teacher.', options: ['a', 'an'], correctAnswer: 'a', feedback: 'Teacher starts with a consonant.' },
      { id: 'u4ex3', type: 'fill-in-blank', question: 'Look at ___ moon!', correctAnswer: 'the', feedback: 'There is only one moon (specific).' },
      { id: 'u4ex4', type: 'multiple-choice', question: 'I saw ___ elephant.', options: ['a', 'an'], correctAnswer: 'an', feedback: 'Elephant starts with a vowel sound.' },
      { id: 'u4ex5', type: 'fill-in-blank', question: 'She lives in ___ big house.', correctAnswer: 'a', feedback: 'Big starts with a consonant.' },
      { id: 'u4ex6', type: 'multiple-choice', question: 'Can I have ___ orange?', options: ['a', 'an'], correctAnswer: 'an', feedback: 'Orange starts with a vowel.' },
      { id: 'u4ex7', type: 'fill-in-blank', question: '___ sun is hot.', correctAnswer: 'The', feedback: 'Unique objects take the.' },
      { id: 'u4ex8', type: 'multiple-choice', question: 'He wants to be ___ astronaut.', options: ['a', 'an'], correctAnswer: 'an', feedback: 'Astronaut starts with a vowel.' },
      { id: 'u4ex9', type: 'fill-in-blank', question: 'I need ___ umbrella.', correctAnswer: 'an', feedback: 'Umbrella starts with a vowel sound.' },
      { id: 'u4ex10', type: 'multiple-choice', question: 'Paris is ___ capital of France.', options: ['a', 'the'], correctAnswer: 'the', feedback: 'Specific capital.' }
    ]
  },
  {
    id: 'unit5',
    title: 'Possessive Adjectives',
    level: 'A1',
    order: 5,
    topics: ['Ownership', 'Relationships'],
    learningObjectives: ['My, Your, His, Her', 'Possession'],
    sections: [
      { title: 'Table', content: '| Subject | Possessive |\n|---------|------------|\n| I | My |\n| You | Your |\n| He | His |\n| She | Her |\n| It | Its |\n| We | Our |\n| They | Their |' }
    ],
    exercises: [
      { id: 'u5ex1', type: 'fill-in-blank', question: 'This is ___ (I) book.', correctAnswer: 'my', feedback: 'Possessive of I is my.' },
      { id: 'u5ex2', type: 'multiple-choice', question: 'She loves ___ dog.', options: ['his', 'her'], correctAnswer: 'her', feedback: 'She takes her.' },
      { id: 'u5ex3', type: 'fill-in-blank', question: 'They are in ___ (they) house.', correctAnswer: 'their', feedback: 'Possessive of they is their.' },
      { id: 'u5ex4', type: 'multiple-choice', question: 'Is this ___ car?', options: ['you', 'your'], correctAnswer: 'your', feedback: 'Use the adjective form.' },
      { id: 'u5ex5', type: 'fill-in-blank', question: 'We like ___ (we) teacher.', correctAnswer: 'our', feedback: 'Possessive of we is our.' },
      { id: 'u5ex6', type: 'multiple-choice', question: 'He is washing ___ hands.', options: ['his', 'her'], correctAnswer: 'his', feedback: 'He takes his.' },
      { id: 'u5ex7', type: 'fill-in-blank', question: 'The cat is playing with ___ (it) toy.', correctAnswer: 'its', feedback: 'Possessive of it is its.' },
      { id: 'u5ex8', type: 'multiple-choice', question: 'Is that ___ mother?', options: ['you', 'your'], correctAnswer: 'your', feedback: 'Possessive of you.' },
      { id: 'u5ex9', type: 'fill-in-blank', question: 'This is ___ (she) bag.', correctAnswer: 'her', feedback: 'Possessive of she.' },
      { id: 'u5ex10', type: 'multiple-choice', question: 'They forgot ___ umbrellas.', options: ['their', 'there'], correctAnswer: 'their', feedback: 'Possessive form.' }
    ]
  },
  {
    id: 'unit6',
    title: 'Past Simple: Regular',
    level: 'A2',
    order: 6,
    topics: ['History', 'Completed Actions'],
    learningObjectives: ['Past actions', '-ed ending'],
    sections: [
      { title: 'Rules', content: 'To form the past of regular verbs, add **-ed**.\n\n- Work -> Worked\n- Play -> Played\n- Dance -> Danced (only add -d)' }
    ],
    exercises: [
      { id: 'u6ex1', type: 'fill-in-blank', question: 'Yesterday I ___ (watch) a movie.', correctAnswer: 'watched', feedback: 'Regular past uses -ed.' },
      { id: 'u6ex2', type: 'multiple-choice', question: 'They ___ to the music.', options: ['listen', 'listened'], correctAnswer: 'listened', feedback: 'Use past form for yesterday.' },
      { id: 'u6ex3', type: 'fill-in-blank', question: 'She ___ (cook) dinner.', correctAnswer: 'cooked', feedback: 'Add -ed to cook.' },
      { id: 'u6ex4', type: 'multiple-choice', question: 'We ___ in the park.', options: ['walked', 'walks'], correctAnswer: 'walked', feedback: 'Past tense of walk.' },
      { id: 'u6ex5', type: 'fill-in-blank', question: 'He ___ (finish) his work.', correctAnswer: 'finished', feedback: 'Add -ed to finish.' },
      { id: 'u6ex6', type: 'multiple-choice', question: 'I ___ my room last week.', options: ['clean', 'cleaned'], correctAnswer: 'cleaned', feedback: 'Past of clean is cleaned.' },
      { id: 'u6ex7', type: 'fill-in-blank', question: 'They ___ (play) tennis.', correctAnswer: 'played', feedback: 'Regular verb past.' },
      { id: 'u6ex8', type: 'multiple-choice', question: 'She ___ at the party.', options: ['dance', 'danced'], correctAnswer: 'danced', feedback: 'Add -d to dance.' },
      { id: 'u6ex9', type: 'fill-in-blank', question: 'It ___ (rain) all night.', correctAnswer: 'rained', feedback: 'Regular past of rain.' },
      { id: 'u6ex10', type: 'multiple-choice', question: 'We ___ the bus.', options: ['miss', 'missed'], correctAnswer: 'missed', feedback: 'Past of miss.' }
    ]
  },
  {
    id: 'unit7',
    title: 'Past Simple: Irregular',
    level: 'A2',
    order: 7,
    topics: ['Common Verbs', 'Memory'],
    learningObjectives: ['Common irregular verbs', 'Go -> Went'],
    sections: [
      { title: 'Common Irregulars', content: '| Base | Past |\n|------|------|\n| Go | Went |\n| Eat | Ate |\n| See | Saw |\n| Have | Had |\n| Do | Did |' }
    ],
    exercises: [
      { id: 'u7ex1', type: 'fill-in-blank', question: 'I ___ (go) to the park.', correctAnswer: 'went', feedback: 'Go is irregular.' },
      { id: 'u7ex2', type: 'multiple-choice', question: 'She ___ an apple.', options: ['eat', 'ate'], correctAnswer: 'ate', feedback: 'Past of eat is ate.' },
      { id: 'u7ex3', type: 'fill-in-blank', question: 'We ___ (see) a ghost.', correctAnswer: 'saw', feedback: 'Past of see is saw.' },
      { id: 'u7ex4', type: 'multiple-choice', question: 'They ___ their homework.', options: ['do', 'did'], correctAnswer: 'did', feedback: 'Past of do is did.' },
      { id: 'u7ex5', type: 'fill-in-blank', question: 'He ___ (have) a car.', correctAnswer: 'had', feedback: 'Past of have is had.' },
      { id: 'u7ex6', type: 'multiple-choice', question: 'I ___ a letter.', options: ['write', 'wrote'], correctAnswer: 'wrote', feedback: 'Past of write is wrote.' },
      { id: 'u7ex7', type: 'fill-in-blank', question: 'She ___ (buy) a new dress.', correctAnswer: 'bought', feedback: 'Past of buy is bought.' },
      { id: 'u7ex8', type: 'multiple-choice', question: 'They ___ to the radio.', options: ['speak', 'spoke'], correctAnswer: 'spoke', feedback: 'Past of speak is spoke.' },
      { id: 'u7ex9', type: 'fill-in-blank', question: 'We ___ (make) a cake.', correctAnswer: 'made', feedback: 'Past of make is made.' },
      { id: 'u7ex10', type: 'multiple-choice', question: 'He ___ his keys.', options: ['lose', 'lost'], correctAnswer: 'lost', feedback: 'Past of lose is lost.' }
    ]
  },
  {
    id: 'unit8',
    title: 'Future with Will',
    level: 'A2',
    order: 8,
    topics: ['Predictions', 'Decisions'],
    learningObjectives: ['Predictions', 'Spontaneous decisions'],
    sections: [
      { title: 'Usage', content: 'Use **will** for predictions about the future or decisions made at the moment of speaking.' }
    ],
    exercises: [
      { id: 'u8ex1', type: 'fill-in-blank', question: 'I think it ___ rain.', correctAnswer: 'will', feedback: 'Use will for predictions.' },
      { id: 'u8ex2', type: 'multiple-choice', question: 'I ___ help you with that.', options: ['will', 'am'], correctAnswer: 'will', feedback: 'Spontaneous offer.' },
      { id: 'u8ex3', type: 'fill-in-blank', question: 'They ___ (be) late.', correctAnswer: 'will be', feedback: 'Will + base form.' },
      { id: 'u8ex4', type: 'multiple-choice', question: '___ you marry me?', options: ['Will', 'Do'], correctAnswer: 'Will', feedback: 'Future request.' },
      { id: 'u8ex5', type: 'fill-in-blank', question: 'I ___ not forget.', correctAnswer: 'will', feedback: 'Negative is will not or won\'t.' },
      { id: 'u8ex6', type: 'multiple-choice', question: 'Wait! I ___ open the door.', options: ['will', 'am'], correctAnswer: 'will', feedback: 'Decision at the moment.' },
      { id: 'u8ex7', type: 'fill-in-blank', question: 'She ___ (probably/arrive) at 6.', correctAnswer: 'will probably arrive', feedback: 'Will for probability.' },
      { id: 'u8ex8', type: 'multiple-choice', question: 'The world ___ change.', options: ['will', 'does'], correctAnswer: 'will', feedback: 'General prediction.' },
      { id: 'u8ex9', type: 'fill-in-blank', question: 'I ___ (call) you later.', correctAnswer: 'will call', feedback: 'Future promise.' },
      { id: 'u8ex10', type: 'multiple-choice', question: '___ it be sunny?', options: ['Will', 'Is'], correctAnswer: 'Will', feedback: 'Future question.' }
    ]
  },
  {
    id: 'unit9',
    title: 'Future with Going To',
    level: 'A2',
    order: 9,
    topics: ['Plans', 'Intentions'],
    learningObjectives: ['Plans and intentions', 'Evidence'],
    sections: [
      { title: 'Structure', content: 'Subject + am/is/are + going to + verb.\n\n- I am going to study tonight.' }
    ],
    exercises: [
      { id: 'u9ex1', type: 'fill-in-blank', question: 'We are ___ to visit him.', correctAnswer: 'going', feedback: 'Be + going to + verb.' },
      { id: 'u9ex2', type: 'multiple-choice', question: 'She ___ going to travel.', options: ['am', 'is', 'are'], correctAnswer: 'is', feedback: 'She takes is.' },
      { id: 'u9ex3', type: 'fill-in-blank', question: 'I am ___ to buy a car.', correctAnswer: 'going', feedback: 'Intention structure.' },
      { id: 'u9ex4', type: 'multiple-choice', question: 'Are you ___ to stay?', options: ['go', 'going'], correctAnswer: 'going', feedback: 'Be going to.' },
      { id: 'u9ex5', type: 'fill-in-blank', question: 'It is ___ to rain.', correctAnswer: 'going', feedback: 'Evidence for future.' },
      { id: 'u9ex6', type: 'multiple-choice', question: 'They ___ going to start.', options: ['am', 'is', 'are'], correctAnswer: 'are', feedback: 'They takes are.' },
      { id: 'u9ex7', type: 'fill-in-blank', question: 'I am ___ (go) to study.', correctAnswer: 'going', feedback: 'Be going to.' },
      { id: 'u9ex8', type: 'multiple-choice', question: 'Is he ___ to help?', options: ['go', 'going'], correctAnswer: 'going', feedback: 'Question form.' },
      { id: 'u9ex9', type: 'fill-in-blank', question: 'We are ___ (not/go) to win.', correctAnswer: 'not going', feedback: 'Negative form.' },
      { id: 'u9ex10', type: 'multiple-choice', question: 'Look at the clouds! It ___ rain.', options: ['is going to', 'will'], correctAnswer: 'is going to', feedback: 'Evidence in the present.' }
    ]
  },
  {
    id: 'unit10',
    title: 'Comparatives',
    level: 'A2',
    order: 10,
    topics: ['Differences', 'Adjectives'],
    learningObjectives: ['Comparing two things', '-er and more'],
    sections: [
      { title: 'Rules', content: '- Short adjectives: add **-er** (taller, faster)\n- Long adjectives: use **more** (more beautiful, more expensive)' }
    ],
    exercises: [
      { id: 'u10ex1', type: 'fill-in-blank', question: 'He is ___ (tall) than me.', correctAnswer: 'taller', feedback: 'Short adjectives take -er.' },
      { id: 'u10ex2', type: 'multiple-choice', question: 'This is ___ expensive than that.', options: ['er', 'more'], correctAnswer: 'more', feedback: 'Long adjectives use more.' },
      { id: 'u10ex3', type: 'fill-in-blank', question: 'A car is ___ (fast) than a bike.', correctAnswer: 'faster', feedback: 'Short adjective comparison.' },
      { id: 'u10ex4', type: 'multiple-choice', question: 'She is ___ than her sister.', options: ['happier', 'more happy'], correctAnswer: 'happier', feedback: 'Adjectives ending in -y change to -ier.' },
      { id: 'u10ex5', type: 'fill-in-blank', question: 'Gold is ___ (heavy) than silver.', correctAnswer: 'heavier', feedback: 'Heavy becomes heavier.' },
      { id: 'u10ex6', type: 'multiple-choice', question: 'English is ___ than Chinese.', options: ['easier', 'more easy'], correctAnswer: 'easier', feedback: 'Easy ends in -y.' },
      { id: 'u10ex7', type: 'fill-in-blank', question: 'This book is ___ (good) than that one.', correctAnswer: 'better', feedback: 'Good is irregular.' },
      { id: 'u10ex8', type: 'multiple-choice', question: 'Health is ___ than wealth.', options: ['more important', 'importanter'], correctAnswer: 'more important', feedback: 'Long adjective.' },
      { id: 'u10ex9', type: 'fill-in-blank', question: 'The weather is ___ (bad) today.', correctAnswer: 'worse', feedback: 'Bad is irregular.' },
      { id: 'u10ex10', type: 'multiple-choice', question: 'A plane is ___ than a train.', options: ['more comfortable', 'comfortabler'], correctAnswer: 'more comfortable', feedback: 'Long adjective.' }
    ]
  },
  {
    id: 'unit11',
    title: 'Superlatives',
    level: 'A2',
    order: 11,
    topics: ['Extremes', 'Best/Worst'],
    learningObjectives: ['Comparing three or more', 'The -est and the most'],
    sections: [
      { title: 'Rules', content: '- Short: the + -est (the tallest)\n- Long: the + most (the most beautiful)' }
    ],
    exercises: [
      { id: 'u11ex1', type: 'fill-in-blank', question: 'She is the ___ (smart) in class.', correctAnswer: 'smartest', feedback: 'Use the + -est.' },
      { id: 'u11ex2', type: 'multiple-choice', question: 'It is the ___ movie ever.', options: ['best', 'goodest'], correctAnswer: 'best', feedback: 'Good is irregular: good -> better -> best.' },
      { id: 'u11ex3', type: 'fill-in-blank', question: 'This is the ___ (big) city.', correctAnswer: 'biggest', feedback: 'Double the consonant for big.' },
      { id: 'u11ex4', type: 'multiple-choice', question: 'He is the ___ interesting person.', options: ['most', 'est'], correctAnswer: 'most', feedback: 'Long adjectives use most.' },
      { id: 'u11ex5', type: 'fill-in-blank', question: 'Mount Everest is the ___ (high) mountain.', correctAnswer: 'highest', feedback: 'Superlative of high.' },
      { id: 'u11ex6', type: 'multiple-choice', question: 'Which is the ___ ocean?', options: ['deepest', 'most deep'], correctAnswer: 'deepest', feedback: 'Short adjective.' },
      { id: 'u11ex7', type: 'fill-in-blank', question: 'He is the ___ (happy) man alive.', correctAnswer: 'happiest', feedback: 'Happy ends in -y.' },
      { id: 'u11ex8', type: 'multiple-choice', question: 'This is the ___ book I have.', options: ['most useful', 'usefulest'], correctAnswer: 'most useful', feedback: 'Long adjective.' },
      { id: 'u11ex9', type: 'fill-in-blank', question: 'It was the ___ (bad) experience.', correctAnswer: 'worst', feedback: 'Bad is irregular.' },
      { id: 'u11ex10', type: 'multiple-choice', question: 'Who is the ___ person you know?', options: ['richest', 'most rich'], correctAnswer: 'richest', feedback: 'Short adjective.' }
    ]
  },
  {
    id: 'unit12',
    title: 'Present Perfect',
    level: 'B1',
    order: 12,
    topics: ['Experience', 'Unspecified Time'],
    learningObjectives: ['Life experiences', 'Have/Has + Past Participle'],
    sections: [
      { title: 'Usage', content: 'Use for actions that happened at an unspecified time in the past or that continue to the present.' }
    ],
    exercises: [
      { id: 'u12ex1', type: 'fill-in-blank', question: 'I ___ seen that movie.', correctAnswer: 'have', feedback: 'I takes have.' },
      { id: 'u12ex2', type: 'multiple-choice', question: 'She ___ visited London.', options: ['have', 'has'], correctAnswer: 'has', feedback: 'She takes has.' },
      { id: 'u12ex3', type: 'fill-in-blank', question: 'We have ___ (be) there.', correctAnswer: 'been', feedback: 'Past participle of be.' },
      { id: 'u12ex4', type: 'multiple-choice', question: 'Have you ___ sushi?', options: ['eat', 'eaten'], correctAnswer: 'eaten', feedback: 'Use past participle.' },
      { id: 'u12ex5', type: 'fill-in-blank', question: 'They ___ not finished yet.', correctAnswer: 'have', feedback: 'Present perfect negative.' },
      { id: 'u12ex6', type: 'multiple-choice', question: 'He ___ lost his wallet.', options: ['has', 'have'], correctAnswer: 'has', feedback: 'He takes has.' },
      { id: 'u12ex7', type: 'fill-in-blank', question: 'I have ___ (write) a book.', correctAnswer: 'written', feedback: 'Past participle of write.' },
      { id: 'u12ex8', type: 'multiple-choice', question: '___ you ever met a celebrity?', options: ['Has', 'Have'], correctAnswer: 'Have', feedback: 'You takes have.' },
      { id: 'u12ex9', type: 'fill-in-blank', question: 'She has ___ (forget) her keys.', correctAnswer: 'forgotten', feedback: 'Past participle of forget.' },
      { id: 'u12ex10', type: 'multiple-choice', question: 'We ___ already seen this.', options: ['has', 'have'], correctAnswer: 'have', feedback: 'We takes have.' }
    ]
  },
  {
    id: 'unit13',
    title: 'Modals: Can, Could, May',
    level: 'B1',
    order: 13,
    topics: ['Ability', 'Permission'],
    learningObjectives: ['Ability and permission', 'Polite requests'],
    sections: [
      { title: 'Modals', content: 'Can (ability/informal permission), Could (past ability/polite request), May (formal permission).' }
    ],
    exercises: [
      { id: 'u13ex1', type: 'fill-in-blank', question: '___ you swim?', correctAnswer: 'Can', feedback: 'Can for ability.' },
      { id: 'u13ex2', type: 'multiple-choice', question: '___ I use your pen?', options: ['May', 'Must'], correctAnswer: 'May', feedback: 'May for permission.' },
      { id: 'u13ex3', type: 'fill-in-blank', question: 'When I was young, I ___ (can) run fast.', correctAnswer: 'could', feedback: 'Past ability is could.' },
      { id: 'u13ex4', type: 'multiple-choice', question: '___ you help me, please?', options: ['Could', 'Should'], correctAnswer: 'Could', feedback: 'Polite request.' },
      { id: 'u13ex5', type: 'fill-in-blank', question: 'You ___ (can) go now.', correctAnswer: 'can', feedback: 'Permission.' },
      { id: 'u13ex6', type: 'multiple-choice', question: 'You ___ smoke here.', options: ['must not', 'should'], correctAnswer: 'must not', feedback: 'Prohibition.' },
      { id: 'u13ex7', type: 'fill-in-blank', question: 'I ___ (should) study more.', correctAnswer: 'should', feedback: 'Advice.' },
      { id: 'u13ex8', type: 'multiple-choice', question: '___ it rain today?', options: ['Might', 'Must'], correctAnswer: 'Might', feedback: 'Possibility.' },
      { id: 'u13ex9', type: 'fill-in-blank', question: 'He ___ (must) be at home.', correctAnswer: 'must', feedback: 'Deduction.' },
      { id: 'u13ex10', type: 'multiple-choice', question: '___ you like some tea?', options: ['Would', 'Could'], correctAnswer: 'Would', feedback: 'Offer.' }
    ]
  },
  {
    id: 'unit14',
    title: 'Passive Voice',
    level: 'B1',
    order: 14,
    topics: ['Object Focus', 'Formal English'],
    learningObjectives: ['Focus on the action', 'Be + Past Participle'],
    sections: [
      { title: 'Usage', content: 'The object of the active sentence becomes the subject of the passive sentence.' }
    ],
    exercises: [
      { id: 'u14ex1', type: 'fill-in-blank', question: 'The letter was ___ (write) by him.', correctAnswer: 'written', feedback: 'Use past participle.' },
      { id: 'u14ex2', type: 'multiple-choice', question: 'The car ___ repaired yesterday.', options: ['was', 'is'], correctAnswer: 'was', feedback: 'Past passive.' },
      { id: 'u14ex3', type: 'fill-in-blank', question: 'English is ___ (speak) here.', correctAnswer: 'spoken', feedback: 'Past participle of speak.' },
      { id: 'u14ex4', type: 'multiple-choice', question: 'The house was ___ in 1990.', options: ['build', 'built'], correctAnswer: 'built', feedback: 'Past participle of build.' },
      { id: 'u14ex5', type: 'fill-in-blank', question: 'The window was ___ (break).', correctAnswer: 'broken', feedback: 'Past participle of break.' },
      { id: 'u14ex6', type: 'multiple-choice', question: 'Rice ___ grown in China.', options: ['is', 'are'], correctAnswer: 'is', feedback: 'Uncountable noun.' },
      { id: 'u14ex7', type: 'fill-in-blank', question: 'The cake was ___ (eat) by the kids.', correctAnswer: 'eaten', feedback: 'Past participle of eat.' },
      { id: 'u14ex8', type: 'multiple-choice', question: 'The bridge ___ built last year.', options: ['was', 'were'], correctAnswer: 'was', feedback: 'Singular subject.' },
      { id: 'u14ex9', type: 'fill-in-blank', question: 'The room is ___ (clean) every day.', correctAnswer: 'cleaned', feedback: 'Present passive.' },
      { id: 'u14ex10', type: 'multiple-choice', question: 'These books ___ written by Shakespeare.', options: ['were', 'was'], correctAnswer: 'were', feedback: 'Plural subject.' }
    ]
  },
  {
    id: 'unit15',
    title: 'First Conditional',
    level: 'B1',
    order: 15,
    topics: ['Possibilities', 'Consequences'],
    learningObjectives: ['Real possibilities', 'If + Present, Will + Verb'],
    sections: [
      { title: 'Structure', content: 'If + Present Simple, Will + Verb.' }
    ],
    exercises: [
      { id: 'u15ex1', type: 'fill-in-blank', question: 'If you study, you ___ pass.', correctAnswer: 'will', feedback: 'First conditional structure.' },
      { id: 'u15ex2', type: 'multiple-choice', question: 'If it ___ , I will stay home.', options: ['rains', 'rain'], correctAnswer: 'rains', feedback: 'Use present simple in the if-clause.' },
      { id: 'u15ex3', type: 'fill-in-blank', question: 'We will go if he ___ (come).', correctAnswer: 'comes', feedback: 'Present simple for he.' },
      { id: 'u15ex4', type: 'multiple-choice', question: 'If I am late, ___ you wait?', options: ['will', 'do'], correctAnswer: 'will', feedback: 'Future consequence.' },
      { id: 'u15ex5', type: 'fill-in-blank', question: 'If she ___ (not hurry), she will miss the bus.', correctAnswer: 'does not hurry', feedback: 'Negative present simple.' },
      { id: 'u15ex6', type: 'multiple-choice', question: 'If you ___ ice, it melts.', options: ['heat', 'will heat'], correctAnswer: 'heat', feedback: 'Zero conditional.' },
      { id: 'u15ex7', type: 'fill-in-blank', question: 'If I ___ (have) time, I will call you.', correctAnswer: 'have', feedback: 'Present simple in if-clause.' },
      { id: 'u15ex8', type: 'multiple-choice', question: 'If you eat too much, you ___ feel sick.', options: ['will', 'do'], correctAnswer: 'will', feedback: 'Future result.' },
      { id: 'u15ex9', type: 'fill-in-blank', question: 'I will be happy if you ___ (come).', correctAnswer: 'come', feedback: 'Present simple.' },
      { id: 'u15ex10', type: 'multiple-choice', question: 'If the sun ___ , we will go out.', options: ['shines', 'shine'], correctAnswer: 'shines', feedback: 'Present simple.' }
    ]
  },
  {
    id: 'unit16',
    title: 'Second Conditional',
    level: 'B2',
    order: 16,
    topics: ['Dreams', 'Hypotheticals'],
    learningObjectives: ['Imaginary situations', 'If + Past, Would + Verb'],
    sections: [
      { title: 'Structure', content: 'If + Past Simple, Would + Verb.' }
    ],
    exercises: [
      { id: 'u16ex1', type: 'fill-in-blank', question: 'If I ___ (be) you, I would go.', correctAnswer: 'were', feedback: 'Use were for all subjects in 2nd conditional.' },
      { id: 'u16ex2', type: 'multiple-choice', question: 'If I won the lottery, I ___ travel.', options: ['would', 'will'], correctAnswer: 'would', feedback: 'Hypothetical consequence.' },
      { id: 'u16ex3', type: 'fill-in-blank', question: 'If he ___ (have) time, he would help.', correctAnswer: 'had', feedback: 'Past simple in if-clause.' },
      { id: 'u16ex4', type: 'multiple-choice', question: 'What ___ you do if you were me?', options: ['would', 'did'], correctAnswer: 'would', feedback: 'Conditional question.' },
      { id: 'u16ex5', type: 'fill-in-blank', question: 'If they ___ (know), they would tell us.', correctAnswer: 'knew', feedback: 'Past of know.' },
      { id: 'u16ex6', type: 'multiple-choice', question: 'If I ___ a bird, I would fly.', options: ['were', 'was'], correctAnswer: 'were', feedback: 'Standard conditional form.' },
      { id: 'u16ex7', type: 'fill-in-blank', question: 'If she ___ (speak) English, she would get the job.', correctAnswer: 'spoke', feedback: 'Past simple.' },
      { id: 'u16ex8', type: 'multiple-choice', question: 'I ___ buy that car if I were rich.', options: ['would', 'will'], correctAnswer: 'would', feedback: 'Hypothetical.' },
      { id: 'u16ex9', type: 'fill-in-blank', question: 'If it ___ (snow) in summer, I would be surprised.', correctAnswer: 'snowed', feedback: 'Past simple.' },
      { id: 'u16ex10', type: 'multiple-choice', question: 'If you ___ more, you would be healthier.', options: ['exercised', 'exercise'], correctAnswer: 'exercised', feedback: 'Past simple.' }
    ]
  },
  {
    id: 'unit17',
    title: 'Reported Speech',
    level: 'B2',
    order: 17,
    topics: ['Indirect Quotes', 'Tense Shift'],
    learningObjectives: ['Reporting what someone said', 'Backshifting tenses'],
    sections: [
      { title: 'Rules', content: 'Present -> Past, Past -> Past Perfect, Will -> Would.' }
    ],
    exercises: [
      { id: 'u17ex1', type: 'fill-in-blank', question: 'She said she ___ (be) happy.', correctAnswer: 'was', feedback: 'Present becomes past.' },
      { id: 'u17ex2', type: 'multiple-choice', question: 'He said he ___ seen it.', options: ['had', 'has'], correctAnswer: 'had', feedback: 'Present perfect becomes past perfect.' },
      { id: 'u17ex3', type: 'fill-in-blank', question: 'They said they ___ (will) come.', correctAnswer: 'would', feedback: 'Will becomes would.' },
      { id: 'u17ex4', type: 'multiple-choice', question: 'She told me she ___ busy.', options: ['was', 'is'], correctAnswer: 'was', feedback: 'Tense shift.' },
      { id: 'u17ex5', type: 'fill-in-blank', question: 'He said he ___ (work) hard.', correctAnswer: 'worked', feedback: 'Present simple to past simple.' },
      { id: 'u17ex6', type: 'multiple-choice', question: 'She said she ___ swim.', options: ['could', 'can'], correctAnswer: 'could', feedback: 'Can becomes could.' },
      { id: 'u17ex7', type: 'fill-in-blank', question: 'They told us they ___ (be) late.', correctAnswer: 'were', feedback: 'Are becomes were.' },
      { id: 'u17ex8', type: 'multiple-choice', question: 'He said he ___ go.', options: ['must', 'had to'], correctAnswer: 'had to', feedback: 'Must often becomes had to.' },
      { id: 'u17ex9', type: 'fill-in-blank', question: 'She said she ___ (live) in Paris.', correctAnswer: 'lived', feedback: 'Present to past.' },
      { id: 'u17ex10', type: 'multiple-choice', question: 'They said they ___ finished.', options: ['had', 'have'], correctAnswer: 'had', feedback: 'Backshift.' }
    ]
  },
  {
    id: 'unit18',
    title: 'Relative Clauses',
    level: 'B2',
    order: 18,
    topics: ['Defining', 'Non-defining'],
    learningObjectives: ['Who, Which, That', 'Adding information'],
    sections: [
      { title: 'Usage', content: 'Who (people), Which (things), That (both), Whose (possession), Where (places).' }
    ],
    exercises: [
      { id: 'u18ex1', type: 'fill-in-blank', question: 'The car ___ is red is mine.', correctAnswer: 'which', feedback: 'Use which for things.' },
      { id: 'u18ex2', type: 'multiple-choice', question: 'The man ___ lives there is nice.', options: ['who', 'which'], correctAnswer: 'who', feedback: 'Use who for people.' },
      { id: 'u18ex3', type: 'fill-in-blank', question: 'The house ___ I was born is old.', correctAnswer: 'where', feedback: 'Use where for places.' },
      { id: 'u18ex4', type: 'multiple-choice', question: 'The girl ___ brother is famous.', options: ['whose', 'who'], correctAnswer: 'whose', feedback: 'Use whose for possession.' },
      { id: 'u18ex5', type: 'fill-in-blank', question: 'The book ___ you gave me is great.', correctAnswer: 'that', feedback: 'That can be used for things.' },
      { id: 'u18ex6', type: 'multiple-choice', question: 'The person ___ called you is my boss.', options: ['who', 'which'], correctAnswer: 'who', feedback: 'People take who.' },
      { id: 'u18ex7', type: 'fill-in-blank', question: 'The city ___ I live is beautiful.', correctAnswer: 'where', feedback: 'Place relative.' },
      { id: 'u18ex8', type: 'multiple-choice', question: 'The dog ___ is barking is mine.', options: ['which', 'who'], correctAnswer: 'which', feedback: 'Animals/things take which.' },
      { id: 'u18ex9', type: 'fill-in-blank', question: 'The boy ___ (who) bike was stolen is crying.', correctAnswer: 'whose', feedback: 'Possession.' },
      { id: 'u18ex10', type: 'multiple-choice', question: 'This is the reason ___ I came.', options: ['why', 'where'], correctAnswer: 'why', feedback: 'Reason relative.' }
    ]
  }
];
