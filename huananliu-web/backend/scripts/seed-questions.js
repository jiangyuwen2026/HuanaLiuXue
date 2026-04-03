/**
 * 题库种子数据脚本
 * 导入示例雅思/托福题目
 * 运行: node scripts/seed-questions.js
 */

const { sequelize, Question, QuestionCategory, QuestionTag, QuestionTagRelation } = require('../models');

// 雅思听力题目
const ieltsListeningQuestions = [
  {
    exam_type: 'ielts',
    subject: 'listening',
    type: 'single_choice',
    title: 'What is the main purpose of the student\'s visit to the library?',
    content: '',
    options: [
      { key: 'A', text: 'To borrow books for his research project' },
      { key: 'B', text: 'To ask about the library\'s opening hours' },
      { key: 'C', text: 'To find out how to use the online database' },
      { key: 'D', text: 'To reserve a study room for group work' }
    ],
    correct_answer: 'C',
    answer_analysis: 'The student mentions that he needs help accessing the online database for his research, which indicates his main purpose is to learn how to use it.',
    difficulty: 2,
    score: 1,
    time_limit: 30,
    knowledge_points: ['主旨大意', '细节理解'],
    audio_url: '',
    passage: 'Librarian: Hello, how can I help you today?\nStudent: Hi, I\'m working on a research project about climate change, and I heard the library has a special online database with scientific journals. I\'m not sure how to access it though.\nLibrarian: Of course! I can show you how to log in and search for articles. Do you have your student ID?'
  },
  {
    exam_type: 'ielts',
    subject: 'listening',
    type: 'fill_blank',
    title: 'Complete the following sentence with NO MORE THAN TWO WORDS.\n\nThe student needs to submit his assignment by ________.',
    content: '',
    options: [],
    correct_answer: 'Friday',
    answer_analysis: 'The professor clearly states "Please make sure to submit your work by Friday at 5 PM."',
    difficulty: 1,
    score: 1,
    time_limit: 20,
    knowledge_points: ['细节理解'],
    audio_url: '',
    passage: 'Professor: Don\'t forget about the assignment due this week. Please make sure to submit your work by Friday at 5 PM. No late submissions will be accepted without a valid medical certificate.'
  },
  {
    exam_type: 'ielts',
    subject: 'listening',
    type: 'map_labeling',
    title: 'Label the map below. Write the correct letter (A-G) next to questions 3-5.\n\n3. Library __________\n4. Cafeteria __________\n5. Student Center __________',
    content: '',
    options: [],
    correct_answer: 'A,C,E',
    answer_analysis: 'The speaker describes the library at the north entrance (A), cafeteria in the central area (C), and Student Center on the east side (E).',
    difficulty: 3,
    score: 3,
    time_limit: 60,
    knowledge_points: ['听力场景', '方位识别'],
    audio_url: '',
    passage: 'Welcome to the campus tour. As you enter through the north gate, you\'ll see the main library directly in front of you. Walking straight ahead, in the center of the campus, you\'ll find our cafeteria which serves meals from 7 AM to 8 PM. On the east side, we have the newly built Student Center where you can find various clubs and activities.'
  }
];

// 雅思阅读题目
const ieltsReadingQuestions = [
  {
    exam_type: 'ielts',
    subject: 'reading',
    type: 'single_choice',
    title: 'According to the passage, what is the main reason for the decline of bee populations?',
    content: '',
    options: [
      { key: 'A', text: 'Climate change affecting flowering patterns' },
      { key: 'B', text: 'Pesticide use in modern agriculture' },
      { key: 'C', text: 'Loss of natural habitat and biodiversity' },
      { key: 'D', text: 'Air pollution in urban areas' }
    ],
    correct_answer: 'C',
    answer_analysis: 'The passage states: "The primary driver of bee population decline is the loss of natural habitat due to urbanization and monoculture farming, which reduces biodiversity and limits bees\' access to diverse food sources."',
    difficulty: 2,
    score: 1,
    time_limit: 90,
    knowledge_points: ['主旨大意', '同义替换'],
    passage: 'Bees play a crucial role in pollinating crops and wild plants, yet their populations have been declining worldwide. While climate change, pesticides, and pollution all contribute to this problem, the primary driver of bee population decline is the loss of natural habitat due to urbanization and monoculture farming, which reduces biodiversity and limits bees\' access to diverse food sources. Conservation efforts must focus on preserving and restoring natural habitats to ensure bee survival.'
  },
  {
    exam_type: 'ielts',
    subject: 'reading',
    type: 'true_false_not_given',
    title: 'The passage states that organic farming completely eliminates the need for bees in crop production.',
    content: '',
    options: [],
    correct_answer: 'FALSE',
    answer_analysis: 'The passage actually states that organic farming "relies even more heavily on natural pollinators like bees" - the opposite of what the question claims.',
    difficulty: 2,
    score: 1,
    time_limit: 60,
    knowledge_points: ['推理判断'],
    passage: 'Organic farming methods avoid synthetic pesticides and fertilizers, creating safer environments for bees. In fact, organic agriculture relies even more heavily on natural pollinators like bees since it cannot use artificial pollination techniques. This makes bee conservation particularly important for organic farmers.'
  },
  {
    exam_type: 'ielts',
    subject: 'reading',
    type: 'matching',
    title: 'Match the following research findings with the correct researcher.\n\nResearcher A - Dr. Smith\nResearcher B - Prof. Johnson\nResearcher C - Dr. Williams\n\n6. Discovered a new species of wild bee in the Amazon rainforest\n7. Developed a bee-friendly pesticide alternative\n8. Published findings on the economic value of pollination',
    content: '',
    options: [],
    correct_answer: 'A,B,C',
    answer_analysis: 'Dr. Smith discovered the new species, Prof. Johnson developed the pesticide alternative, and Dr. Williams calculated the economic value.',
    difficulty: 3,
    score: 3,
    time_limit: 120,
    knowledge_points: ['匹配题', '细节理解'],
    passage: 'Dr. Smith\'s groundbreaking work in the Amazon led to the discovery of a previously unknown bee species that may have unique pollination capabilities. Meanwhile, Prof. Johnson at MIT has been developing a new type of pesticide that targets only harmful insects while leaving bees unharmed. In economic research, Dr. Williams calculated that bees contribute over $200 billion annually to global agriculture through pollination services.'
  }
];

// 雅思写作题目
const ieltsWritingQuestions = [
  {
    exam_type: 'ielts',
    subject: 'writing',
    type: 'essay',
    title: 'Some people think that the best way to reduce crime is to give longer prison sentences. Others believe there are more effective alternatives. Discuss both views and give your opinion.',
    content: 'Write at least 250 words.',
    options: [],
    correct_answer: '',
    answer_analysis: `<strong>Task Response:</strong> The essay should address both views (longer sentences vs alternatives) and clearly state the writer's opinion.
<br/><br/>
<strong>Key Points to Consider:</strong>
<ul>
<li>Arguments for longer sentences: deterrence, public safety, justice for victims</li>
<li>Arguments for alternatives: rehabilitation, cost-effectiveness, addressing root causes</li>
<li>Examples of alternatives: education programs, community service, mental health support</li>
</ul>
<br/>
<strong>Band 9 Sample Structure:</strong>
<ul>
<li>Introduction: Paraphrase the topic, state both views, give thesis statement</li>
<li>Body 1: Arguments for longer prison sentences with examples</li>
<li>Body 2: Arguments for alternatives with examples</li>
<li>Conclusion: Restate opinion with summary of main points</li>
</ul>`,
    sample_answer: 'It is often argued that extending prison terms is the most effective method to decrease criminal activity, while others advocate for alternative approaches. In my opinion, although longer sentences may deter some criminals, rehabilitation programs and addressing social issues are more sustainable solutions in the long term.\n\nOn one hand, those who support longer prison sentences argue that harsh punishments serve as a deterrent to potential offenders. When criminals face extended periods of incarceration, they may think twice before committing crimes. Additionally, keeping dangerous offenders in prison for longer periods ensures public safety and provides justice for victims who have suffered from criminal acts. For instance, countries with strict sentencing policies often report lower rates of violent crime.\n\nOn the other hand, critics of lengthy imprisonment point out that this approach fails to address the underlying causes of criminal behavior. Many offenders come from disadvantaged backgrounds with limited education and employment opportunities. Rather than simply punishing them, society would benefit more from investing in rehabilitation programs that teach job skills and provide psychological support. Norway\'s prison system, which focuses on rehabilitation rather than punishment, has achieved remarkably low recidivism rates.\n\nFurthermore, addressing social issues such as poverty, inequality, and lack of education can prevent crime before it occurs. Community programs that provide support to at-risk youth have shown promising results in reducing criminal behavior. These preventive measures are not only more humane but also more cost-effective than maintaining large prison populations.\n\nIn conclusion, while longer prison sentences may have some deterrent effect, I believe that a combination of rehabilitation programs and social interventions is more effective in reducing crime. By addressing the root causes of criminal behavior and helping offenders reintegrate into society, we can create safer communities for everyone.',
    difficulty: 2,
    score: 9,
    time_limit: 2400,
    knowledge_points: ['大作文', '议论文']
  },
  {
    exam_type: 'ielts',
    subject: 'writing',
    type: 'short_answer',
    title: 'The chart below shows the percentage of households in different income groups that owned a car in three different years. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    content: 'Write at least 150 words.',
    options: [],
    correct_answer: '',
    answer_analysis: `<strong>Task Achievement:</strong> The response should summarize the key trends and make comparisons between income groups and across time periods.
<br/><br/>
<strong>Key Features to Include:</strong>
<ul>
<li>Overall trend: Car ownership increased across all income groups from 1995 to 2020</li>
<li>High-income households consistently had the highest ownership rates (80%+)</li>
<li>Middle-income households showed significant growth</li>
<li>Low-income households had lowest ownership but still improved</li>
<li>The gap between high and low income narrowed slightly over time</li>
</ul>`,
    sample_answer: 'The bar chart illustrates car ownership rates among households in three different income brackets (low, middle, and high) for the years 1995, 2005, and 2020.\n\nOverall, car ownership increased across all income groups during this 25-year period, with high-income households consistently maintaining the highest rates of vehicle ownership.\n\nIn 1995, there was a significant disparity between income groups. While 82% of high-income households owned a car, this figure dropped to 45% for middle-income families and just 22% for those in the low-income category. By 2005, these figures had risen to 88%, 58%, and 31% respectively.\n\nThe trend continued through to 2020, with high-income households reaching 95% ownership. More notably, middle-income households experienced substantial growth, reaching 72% ownership, representing a 60% increase over the period. Low-income households also saw improvement, with ownership climbing to 42%, though this group still lagged considerably behind the other categories.\n\nInterestingly, while the gap between high and middle-income households narrowed slightly from 37 to 23 percentage points, the disparity between high and low-income groups decreased more dramatically from 60 to 53 percentage points.',
    difficulty: 2,
    score: 9,
    time_limit: 1200,
    knowledge_points: ['小作文', '图表描述']
  }
];

// 雅思口语题目
const ieltsSpeakingQuestions = [
  {
    exam_type: 'ielts',
    subject: 'speaking',
    type: 'speaking_part1',
    title: 'Let\'s talk about your hometown.\n\n- Where is your hometown?\n- What do you like most about it?\n- Has your hometown changed much since you were a child?\n- Is your hometown famous for anything?',
    content: 'Part 1: Introduction and Interview (4-5 minutes)',
    options: [],
    correct_answer: '',
    answer_analysis: `<strong>Part 1 Assessment Criteria:</strong>
<ul>
<li>Fluency and coherence: Can you speak smoothly without long pauses?</li>
<li>Lexical resource: Do you use appropriate vocabulary?</li>
<li>Grammatical range and accuracy: Do you use varied sentence structures correctly?</li>
<li>Pronunciation: Is your speech clear and easy to understand?</li>
</ul>
<br/>
<strong>Sample High-Scoring Responses:</strong>
<br/><br/>
<b>Where is your hometown?</b><br/>
"I come from Hangzhou, which is a picturesque city in eastern China, renowned for its stunning West Lake. It's approximately a two-hour train ride from Shanghai."<br/><br/>
<b>What do you like most about it?</b><br/>
"What I love most is the perfect blend of natural beauty and modern development. Despite being a thriving tech hub with companies like Alibaba, the city has preserved its cultural heritage and scenic landscapes."`,
    sample_answer: 'I come from Hangzhou, which is a picturesque city in eastern China, renowned for its stunning West Lake. It\'s approximately a two-hour train ride from Shanghai.\n\nWhat I love most is the perfect blend of natural beauty and modern development. Despite being a thriving tech hub with companies like Alibaba, the city has preserved its cultural heritage and scenic landscapes.\n\nActually, it has transformed dramatically over the past two decades. When I was young, it was much quieter and less developed. Now we have a modern metro system and numerous high-rise buildings, though fortunately the historic areas around the lake remain intact.\n\nYes, absolutely! It\'s world-famous for West Lake, which is a UNESCO World Heritage site. The lake has inspired poets and artists for centuries. Additionally, Hangzhou is known for Longjing tea, one of China\'s most prestigious green teas.',
    difficulty: 2,
    score: 8,
    time_limit: 300,
    knowledge_points: ['口语Part1', '个人话题']
  },
  {
    exam_type: 'ielts',
    subject: 'speaking',
    type: 'speaking_part2',
    title: 'Describe a book that had a significant impact on you.\n\nYou should say:\n- What the book is and who wrote it\n- How you first heard about it\n- What the main story is about\n- And explain why it had such a significant impact on you',
    content: 'Part 2: Individual Long Turn (3-4 minutes)\n\nYou will have 1 minute to prepare and should speak for 1-2 minutes.',
    options: [],
    correct_answer: '',
    answer_analysis: `<strong>Part 2 Tips:</strong>
<ul>
<li>Use your 1-minute preparation time to jot down key points</li>
<li>Structure your answer: Introduction → Main points → Conclusion</li>
<li>Use discourse markers: "Firstly", "Moreover", "In addition", "Consequently"</li>
<li>Include specific details and personal feelings</li>
<li>Maintain fluency - don't worry about occasional self-correction</li>
</ul>`,
    sample_answer: 'I\'d like to talk about "Sapiens: A Brief History of Humankind" by Yuval Noah Harari, which fundamentally changed my perspective on human society and history.\n\nI first came across this book when a professor recommended it during a sociology lecture in my second year of university. The way she described it as "mind-expanding" really piqued my curiosity.\n\nThe book essentially traces the history of our species from the Stone Age to the present day. What makes it fascinating is that Harari doesn\'t just focus on kings and battles; instead, he examines how cognitive abilities, agriculture, and shared myths shaped human civilization. He argues that our capacity to believe in fictional concepts like money, nations, and human rights is what enabled large-scale cooperation.\n\nThis book profoundly impacted me because it made me question many assumptions I had taken for granted. For instance, I\'d never really considered that concepts like "corporations" or "nations" are essentially shared fictions that exist only in our collective imagination. It also made me reflect on the agricultural revolution - Harari describes it as "history\'s biggest fraud" because while it enabled population growth, it actually reduced the quality of life for individual humans.\n\nSince reading it, I\'ve become much more critical of historical narratives and more interested in understanding the underlying systems that shape our world. It really opened my eyes to how much of our reality is socially constructed.',
    difficulty: 3,
    score: 8.5,
    time_limit: 120,
    knowledge_points: ['口语Part2', '描述类']
  }
];

// 托福题目示例
const toeflQuestions = [
  {
    exam_type: 'toefl',
    subject: 'reading',
    type: 'multiple_choice',
    title: 'According to paragraph 2, which of the following statements about ancient Egyptian writing is true? Select ALL that apply.',
    content: '',
    options: [
      { key: 'A', text: 'It was primarily used for religious texts' },
      { key: 'B', text: 'It evolved from earlier pictographic systems' },
      { key: 'C', text: 'It was used to record commercial transactions' },
      { key: 'D', text: 'It remained unchanged for thousands of years' }
    ],
    correct_answer: 'B,C',
    answer_analysis: 'Paragraph 2 states that Egyptian writing "developed from earlier pictographic traditions" (B) and was used for "recording trade and administrative matters" (C). It does not state that it was primarily religious (A) or that it remained unchanged (D is contradicted by the text).',
    difficulty: 2,
    score: 2,
    time_limit: 120,
    knowledge_points: ['多选题', '细节理解'],
    passage: 'The writing system of ancient Egypt, known as hieroglyphics, developed from earlier pictographic traditions. Initially, scribes used simple drawings to represent objects and ideas. Over time, this system became increasingly sophisticated, incorporating phonetic elements that could represent sounds. By 3000 BCE, hieroglyphics were being used for a variety of purposes, including religious inscriptions, royal decrees, and recording trade and administrative matters.'
  }
];

// 合并所有题目
const allQuestions = [
  ...ieltsListeningQuestions,
  ...ieltsReadingQuestions,
  ...ieltsWritingQuestions,
  ...ieltsSpeakingQuestions,
  ...toeflQuestions
];

async function seedQuestions() {
  try {
    console.log('🌱 开始导入题库数据...\n');

    // 检查现有数据
    const existingCount = await Question.count();
    if (existingCount > 0) {
      console.log(`⚠️  数据库已有 ${existingCount} 道题目`);
      console.log('是否继续导入？(将跳过重复题目)\n');
    }

    let successCount = 0;
    let errorCount = 0;

    for (const questionData of allQuestions) {
      try {
        // 检查是否已存在相似题目
        const existing = await Question.findOne({
          where: {
            title: questionData.title,
            exam_type: questionData.exam_type
          }
        });

        if (existing) {
          console.log(`⏭️  跳过重复题目: ${questionData.title.slice(0, 50)}...`);
          continue;
        }

        await Question.create(questionData);
        successCount++;
        console.log(`✅ 导入成功: [${questionData.exam_type.toUpperCase()}][${questionData.subject}] ${questionData.title.slice(0, 40)}...`);
      } catch (error) {
        errorCount++;
        console.error(`❌ 导入失败: ${questionData.title.slice(0, 40)}...`);
        console.error(error.message);
      }
    }

    console.log('\n📊 导入结果:');
    console.log(`   成功: ${successCount} 题`);
    console.log(`   失败: ${errorCount} 题`);
    console.log(`   总计: ${allQuestions.length} 题`);

    // 更新统计
    const total = await Question.count();
    console.log(`\n📚 题库现有题目: ${total} 题`);

    process.exit(0);
  } catch (error) {
    console.error('❌ 导入过程出错:', error);
    process.exit(1);
  }
}

// 运行
seedQuestions();
