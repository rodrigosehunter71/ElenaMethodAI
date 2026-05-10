export const unit1Content = {
  id: 'unit1',
  title: 'The Verb To Be',
  level: 'A1',
  learningObjectives: [
    'Understand the three forms of the verb to be: am, is, are',
    'Use the verb to be in affirmative, negative, and question sentences',
    'Apply subject pronouns correctly with to be',
    'Describe people, places, and things using to be + adjective / noun',
    'Form yes/no questions and short answers'
  ],
  sections: [
    {
      title: '1. Grammar Reference',
      content: `The verb to be is the most important and most used verb in English. It expresses identity, characteristics, states, and relationships. Unlike most verbs, it has three different forms in the present tense.

### 1.1 Forms of 'to be' — Present Simple

| Subject | Verb | Contraction | Example |
|---------|------|-------------|---------|
| I | am | I'm | I am a student. |
| You | are | You're | You are tired. |
| He | is | He's | He is a doctor. |
| She | is | She's | She is happy. |
| It | is | It's | It is cold today. |
| We | are | We're | We are from Spain. |
| You (pl.) | are | You're | You are teachers. |
| They | are | They're | They are students. |

### 1.2 Affirmative sentences
**Structure: Subject + to be + complement**
- I am a doctor. → I + am + noun
- She is beautiful. → She + is + adjective
- We are from Italy. → We + are + preposition phrase
- The book is on the table. → Noun + is + place

### 1.3 Negative sentences
**Structure: Subject + to be + not + complement**
- I am not (I'm not) a teacher.
- He is not (He isn't / He's not) at home.
- They are not (They aren't / They're not) ready.

*Note: 'amn't' does NOT exist in standard English. Use 'I'm not'.*

### 1.4 Yes/No Questions and Short Answers
| Question | Positive answer | Negative answer |
|----------|-----------------|-----------------|
| Am I late? | Yes, you are. | No, you aren't. |
| Are you a student? | Yes, I am. | No, I'm not. |
| Is she tired? | Yes, she is. | No, she isn't. |
| Is it raining? | Yes, it is. | No, it isn't. |
| Are we right? | Yes, we are. | No, we aren't. |
| Are they here? | Yes, they are. | No, they aren't. |

### 1.5 Wh- Questions
**Structure: Wh- word + to be + subject + complement?**
- Where are you from? → I'm from Mexico.
- What is your name? → My name is Carlos.
- How old is she? → She is 25.
- Who is that man? → He is my father.
- Why are they late? → They are stuck in traffic.`
    },
    {
      title: '2. Examples in Context',
      content: `Read the following examples. Notice how the verb to be is used in real situations.

| English | Spanish |
|---------|---------|
| Hello! I'm Maria. | ¡Hola! Soy María. |
| She is a nurse at the hospital. | Ella es enfermera en el hospital. |
| We are not from here. | No somos de aquí. |
| Is the coffee hot? — Yes, it is. | ¿Está caliente el café? — Sí. |
| They are very excited about the trip. | Están muy emocionados con el viaje. |
| I am not sure about that. | No estoy seguro de eso. |
| Are you ready? — No, I'm not. | ¿Estás listo? — No, todavía no. |
| What is your favourite colour? | ¿Cuál es tu color favorito? |`
    }
  ],
  exercises: [
    {
      id: 'ex1',
      type: 'fill-in-blank',
      question: '1. I ______ a student at the university.',
      correctAnswer: 'am',
      feedback: "'I' always takes 'am'."
    },
    {
      id: 'ex2',
      type: 'fill-in-blank',
      question: '2. She ______ very intelligent.',
      correctAnswer: 'is',
      feedback: "'She' takes 'is'."
    },
    {
      id: 'ex3',
      type: 'fill-in-blank',
      question: '3. We ______ from Argentina.',
      correctAnswer: 'are',
      feedback: "'We' takes 'are'."
    },
    {
      id: 'ex4',
      type: 'multiple-choice',
      question: 'Which is the correct question?',
      options: ['Is they happy?', 'Are they happy?', 'Am they happy?'],
      correctAnswer: 'Are they happy?',
      feedback: "'They' is plural and takes 'are'."
    }
  ]
};
