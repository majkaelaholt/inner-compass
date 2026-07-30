'use strict';

const STORAGE_KEY = 'inner-compass-data-v1';
const APP_VERSION = 2;

const emotionProfiles = [
  { name: 'Anxiety', tags: ['unpleasant','high','uncertain','threat','fix','fluttery','tension'], need: 'clarity, reassurance, or a manageable next step', description: 'Something feels uncertain, risky, or difficult to control, and your mind is trying to prepare for it.' },
  { name: 'Fear', tags: ['unpleasant','high','threat','avoid','tension','safety'], need: 'safety, protection, or distance', description: 'You sense danger or possible harm and feel pulled to protect yourself or get away.' },
  { name: 'Overwhelm', tags: ['unpleasant','high','too-much','shutdown','fix','tension','numb'], need: 'less demand, more structure, or rest', description: 'There is more input, responsibility, or emotion than you can comfortably process right now.' },
  { name: 'Anger', tags: ['unpleasant','high','unfair','approach','hot','respect'], need: 'respect, change, protection, or a boundary', description: 'Something feels wrong, unfair, intrusive, or blocked, and part of you wants action.' },
  { name: 'Frustration', tags: ['unpleasant','high','blocked','fix','hot','tension'], need: 'progress, effectiveness, or a different approach', description: 'You are trying to reach an outcome, but something keeps getting in the way.' },
  { name: 'Resentment', tags: ['unpleasant','mid','unfair','withdraw','heavy','respect'], need: 'fairness, acknowledgment, or a boundary', description: 'You may have given, tolerated, or carried more than felt fair—possibly without saying so.' },
  { name: 'Hurt', tags: ['unpleasant','mid','connection','withdraw','heavy','judged'], need: 'care, acknowledgment, repair, or protection', description: 'Something affected your sense of connection, worth, trust, or belonging.' },
  { name: 'Sadness', tags: ['unpleasant','low','loss','withdraw','heavy','comfort'], need: 'comfort, space, support, or grieving', description: 'Something meaningful feels lost, absent, disappointing, or painfully different from what you wanted.' },
  { name: 'Disappointment', tags: ['unpleasant','low','loss','blocked','heavy','acknowledgment'], need: 'acknowledgment, adjustment, or a new expectation', description: 'Reality did not match a hope, expectation, or effort you cared about.' },
  { name: 'Loneliness', tags: ['unpleasant','low','connection','withdraw','heavy','connect'], need: 'connection, being known, or meaningful company', description: 'You feel emotionally separate, unseen, or without the kind of connection you want.' },
  { name: 'Shame', tags: ['unpleasant','low','self','hide','heavy','judged'], need: 'self-compassion, perspective, or safe acceptance', description: 'The painful story may be not just “I did something wrong,” but “something is wrong with me.”' },
  { name: 'Embarrassment', tags: ['unpleasant','high','judged','hide','hot','self'], need: 'perspective, recovery, or social safety', description: 'You feel exposed, awkward, or worried about how you appeared to other people.' },
  { name: 'Guilt', tags: ['unpleasant','mid','repair','self','fix','heavy'], need: 'repair, responsibility, or self-forgiveness', description: 'You believe your action—or inaction—conflicted with your values or affected someone.' },
  { name: 'Jealousy', tags: ['unpleasant','high','connection','threat','approach','fluttery'], need: 'security, reassurance, clarity, or self-trust', description: 'A valued connection or position feels threatened by another person or possibility.' },
  { name: 'Envy', tags: ['unpleasant','mid','comparison','want','heavy','approach'], need: 'permission to want, inspiration, or a realistic path forward', description: 'Someone else has something that points toward a desire, value, or possibility in you.' },
  { name: 'Disgust', tags: ['unpleasant','high','wrong','avoid','nausea','boundary'], need: 'distance, protection, or alignment with your values', description: 'Something feels deeply unpleasant, violating, contaminated, or against your values.' },
  { name: 'Numbness', tags: ['mixed','low','numb','shutdown','too-much','withdraw'], need: 'gentleness, rest, grounding, or time', description: 'Your system may be reducing emotional intensity because fully feeling it seems too much right now.' },
  { name: 'Relief', tags: ['pleasant','low','safe','release','open','rest'], need: 'rest, integration, or permission to let go', description: 'Pressure, uncertainty, or danger has eased, and your system is beginning to release tension.' },
  { name: 'Excitement', tags: ['pleasant','high','success','approach','fluttery','stimulation'], need: 'expression, action, anticipation, or celebration', description: 'Something desirable feels possible or close, creating energy and forward movement.' },
  { name: 'Contentment', tags: ['pleasant','low','safe','open','stay','rest'], need: 'presence, appreciation, or continued steadiness', description: 'Things feel sufficiently good, safe, or settled in this moment.' },
  { name: 'Pride', tags: ['pleasant','high','success','approach','open','recognition'], need: 'recognition, celebration, or ownership', description: 'You recognize effort, growth, courage, or achievement in yourself.' },
  { name: 'Affection', tags: ['pleasant','mid','connection','approach','warm','connect'], need: 'connection, expression, or closeness', description: 'You feel warmth, care, tenderness, or fondness toward someone or something.' }
];

const emotionQuestions = [
  {
    key: 'context', title: 'Where is this feeling showing up?', help: 'Pick the closest context. This helps reveal patterns later.',
    options: [
      { label: 'Relationship or family', tags: ['relationship'] },
      { label: 'Work or responsibilities', tags: ['work'] },
      { label: 'Social situation', tags: ['social'] },
      { label: 'Myself or my self-image', tags: ['self-context'] },
      { label: 'Health, body, or energy', tags: ['health'] },
      { label: 'I am not sure / it is general', tags: ['general'] }
    ]
  },
  {
    key: 'valence', title: 'What is the overall tone?', help: 'Do not overthink the exact emotion yet.',
    options: [
      { label: 'Unpleasant', description: 'Something feels wrong, painful, tense, or off.', tags: ['unpleasant'] },
      { label: 'Pleasant', description: 'Something feels good, warm, energizing, or settled.', tags: ['pleasant'] },
      { label: 'Mixed or hard to tell', description: 'Several feelings may be happening together.', tags: ['mixed'] }
    ]
  },
  {
    key: 'energy', title: 'What is your energy doing?', help: 'Think activation, not whether you are physically tired.',
    options: [
      { label: 'High or activated', description: 'Restless, urgent, keyed up, buzzing, or intense.', tags: ['high'] },
      { label: 'Low or heavy', description: 'Flat, slowed down, tired, withdrawn, or weighed down.', tags: ['low'] },
      { label: 'In the middle', description: 'Present and noticeable, but not highly activated.', tags: ['mid'] }
    ]
  },
  {
    key: 'urge', title: 'What do you feel pulled to do?', help: 'The urge can be more informative than the emotion label.',
    options: [
      { label: 'Get away or avoid it', tags: ['avoid','withdraw'] },
      { label: 'Hide or disappear', tags: ['hide','withdraw'] },
      { label: 'Confront it or push back', tags: ['approach','unfair'] },
      { label: 'Fix, solve, or control it', tags: ['fix','blocked'] },
      { label: 'Reach out or get closer', tags: ['connect','connection'] },
      { label: 'Shut down or do nothing', tags: ['shutdown','numb'] },
      { label: 'Stay with or savor it', tags: ['stay','open'] }
    ]
  },
  {
    key: 'thought', title: 'Which thought is closest?', help: 'Choose the story your mind keeps circling.',
    options: [
      { label: '“Something bad might happen.”', tags: ['threat','uncertain'] },
      { label: '“This is unfair or not okay.”', tags: ['unfair','wrong'] },
      { label: '“I expected this to go differently.”', tags: ['loss','blocked'] },
      { label: '“They may think badly of me.”', tags: ['judged','self'] },
      { label: '“I did something wrong.”', tags: ['repair','self'] },
      { label: '“I am alone or not understood.”', tags: ['connection','loss'] },
      { label: '“This is too much.”', tags: ['too-much','shutdown'] },
      { label: '“I really want what they have.”', tags: ['comparison','want'] },
      { label: '“This is going well.”', tags: ['success','safe'] }
    ]
  },
  {
    key: 'body', title: 'What does your body seem to be saying?', help: 'A rough answer is enough.',
    options: [
      { label: 'Tight, clenched, or tense', tags: ['tension','threat'] },
      { label: 'Heavy, sinking, or tired', tags: ['heavy','low'] },
      { label: 'Hot, flushed, or agitated', tags: ['hot','high'] },
      { label: 'Fluttery, shaky, or buzzy', tags: ['fluttery','high'] },
      { label: 'Numb, distant, or blank', tags: ['numb','shutdown'] },
      { label: 'Warm, open, or relaxed', tags: ['warm','open','safe'] },
      { label: 'Nauseated or repelled', tags: ['nausea','avoid'] }
    ]
  },
  {
    key: 'needSignal', title: 'What would feel most helpful?', help: 'This is not necessarily what you must do—just what your system is asking for.',
    options: [
      { label: 'Safety or reassurance', tags: ['safety','threat'] },
      { label: 'Clear information', tags: ['uncertain','clarity'] },
      { label: 'Comfort or support', tags: ['comfort','connection'] },
      { label: 'Respect or a boundary', tags: ['respect','boundary','unfair'] },
      { label: 'Repair or acknowledgment', tags: ['repair','acknowledgment'] },
      { label: 'Rest or fewer demands', tags: ['rest','too-much'] },
      { label: 'Progress or a plan', tags: ['fix','blocked'] },
      { label: 'Connection or closeness', tags: ['connect','connection'] },
      { label: 'Celebration or expression', tags: ['recognition','stimulation','success'] }
    ]
  }
];

const wantProfiles = [
  { name: 'Clarity', tags: ['information','uncertain','understand','pause'], description: 'You may want better information, a direct answer, or time to understand what is happening.' },
  { name: 'Reassurance', tags: ['approval','fear','safe','connection'], description: 'You may want confirmation that you are okay, accepted, or not in danger of losing something important.' },
  { name: 'Rest', tags: ['less','pause','body','overloaded'], description: 'You may want fewer demands, lower stimulation, or permission to stop pushing for a while.' },
  { name: 'Connection', tags: ['closer','share','understood','support'], description: 'You may want presence, attention, affection, companionship, or to feel emotionally known.' },
  { name: 'Autonomy', tags: ['choice','space','pressure','self'], description: 'You may want room to choose freely, move at your own pace, or stop organizing yourself around other people.' },
  { name: 'A boundary', tags: ['less','space','unfair','protect'], description: 'You may want to say no, reduce access, change an expectation, or protect your time and emotional energy.' },
  { name: 'Recognition', tags: ['seen','effort','approval','share'], description: 'You may want your effort, experience, contribution, or pain to be noticed and taken seriously.' },
  { name: 'Repair', tags: ['conflict','responsibility','closer','understood'], description: 'You may want an honest conversation, accountability, apology, forgiveness, or a chance to reconnect.' },
  { name: 'Progress', tags: ['action','stuck','choice','understand'], description: 'You may want movement, a practical next step, competence, or evidence that things can improve.' },
  { name: 'Expression', tags: ['share','self','seen','action'], description: 'You may want to say what you think, create, move, cry, laugh, or let an internal experience come outward.' },
  { name: 'Stimulation', tags: ['more','curious','action','body'], description: 'You may want novelty, challenge, play, excitement, learning, or something that wakes you up.' },
  { name: 'Acceptance', tags: ['self','approval','safe','pause'], description: 'You may want permission for your experience to exist without immediately fixing, proving, or judging it.' }
];

const wantQuestions = [
  { key: 'direction', title: 'What direction are you pulled toward?', help: 'Choose the closest impulse—not the most responsible answer.', options: [
    { label: 'More of something', tags: ['more','stimulation'] },
    { label: 'Less of something', tags: ['less','boundary'] },
    { label: 'Closer to someone', tags: ['closer','connection'] },
    { label: 'More space or independence', tags: ['space','autonomy'] },
    { label: 'An answer or decision', tags: ['information','choice'] },
    { label: 'A pause', tags: ['pause','rest'] }
  ]},
  { key: 'change', title: 'What would make this feel better?', help: 'Imagine the situation shifting by ten percent.', options: [
    { label: 'I would understand what is happening', tags: ['understand','information'] },
    { label: 'I would feel supported or less alone', tags: ['support','connection'] },
    { label: 'There would be less pressure on me', tags: ['less','pressure'] },
    { label: 'I could choose without managing reactions', tags: ['choice','self','autonomy'] },
    { label: 'My effort or feelings would be recognized', tags: ['seen','approval'] },
    { label: 'Something concrete would finally move', tags: ['action','stuck'] }
  ]},
  { key: 'noJudgment', title: 'Without anyone judging you, what sounds best?', help: 'This helps separate preference from performance.', options: [
    { label: 'Say what I really think or feel', tags: ['share','self'] },
    { label: 'Say no or change the expectation', tags: ['boundary','protect'] },
    { label: 'Ask directly for help or reassurance', tags: ['support','approval'] },
    { label: 'Do something fun, new, or energizing', tags: ['curious','stimulation'] },
    { label: 'Rest and stop being productive', tags: ['rest','pause'] },
    { label: 'Take action and get unstuck', tags: ['action','progress'] }
  ]},
  { key: 'fear', title: 'What makes the want hard to admit?', help: 'The obstacle can reveal what matters.', options: [
    { label: 'Someone might be disappointed', tags: ['approval','pressure'] },
    { label: 'I might make the wrong choice', tags: ['uncertain','choice'] },
    { label: 'It feels selfish or unreasonable', tags: ['self','approval'] },
    { label: 'I might cause conflict', tags: ['conflict','protect'] },
    { label: 'I do not know how to make it happen', tags: ['stuck','information'] },
    { label: 'Nothing—I can admit it', tags: ['safe','self'] }
  ]},
  { key: 'next', title: 'What kind of next step feels right?', help: 'Your preferred action is useful evidence.', options: [
    { label: 'Ask a question', tags: ['information','understand'] },
    { label: 'Ask for support', tags: ['support','closer'] },
    { label: 'Set a limit', tags: ['boundary','protect'] },
    { label: 'Make a small plan', tags: ['action','progress'] },
    { label: 'Express what is true', tags: ['share','seen'] },
    { label: 'Wait, rest, and revisit', tags: ['pause','rest'] }
  ]}
];

const freeTimeQuestions = [
  { key: 'time', title: 'How much free time do you have?', help: 'Choose the amount you can realistically use—not the entire empty part of your day.', options: [
    { label: 'About 5–15 minutes', minutes: 15, tags: ['time-short'] },
    { label: 'About 20–45 minutes', minutes: 45, tags: ['time-medium'] },
    { label: 'An hour or more', minutes: 120, tags: ['time-long'] },
    { label: 'Time is not the main issue', minutes: 180, tags: ['time-open'] }
  ]},
  { key: 'energy', title: 'What is your energy actually like?', help: 'Answer for this moment, not for the version of you who planned the day.', options: [
    { label: 'Depleted—I need very little from myself', tags: ['depleted','low','restore'] },
    { label: 'Low, but I could enjoy something easy', tags: ['low','gentle'] },
    { label: 'Steady—I have some usable energy', tags: ['steady','engage'] },
    { label: 'Restless or wired—I need an outlet', tags: ['restless','movement','engage'] }
  ]},
  { key: 'bandwidth', title: 'How much mental effort sounds okay?', help: 'A hobby can be enjoyable and still be too demanding for your current bandwidth.', options: [
    { label: 'Almost none—please do not make me think', tags: ['no-challenge','restore','comfort'] },
    { label: 'Something gently engaging', tags: ['gentle','absorb'] },
    { label: 'I would enjoy focus or a challenge', tags: ['challenge','create','progress'] },
    { label: 'I cannot tell yet', tags: ['unsure','gentle'] }
  ]},
  { key: 'craving', title: 'What are you most drawn toward?', help: 'Pick the pull underneath the activity—not the activity you think sounds best.', options: [
    { label: 'Comfort, escape, or being cared for', tags: ['comfort','soothe','restore'] },
    { label: 'Fun, novelty, or play', tags: ['play','entertain','absorb'] },
    { label: 'Making or expressing something', tags: ['create','expression','challenge'] },
    { label: 'A small sense of accomplishment or order', tags: ['progress','reset','order'] },
    { label: 'Connection or shared time', tags: ['connection','soothe'] },
    { label: 'Movement or a change of scenery', tags: ['movement','reset','restless'] }
  ]},
  { key: 'outcome', title: 'How would you like to feel afterward?', help: 'This helps identify the need your free time can meet.', options: [
    { label: 'More rested', tags: ['rested','restore'] },
    { label: 'Soothed or emotionally settled', tags: ['soothe','comfort'] },
    { label: 'Entertained or lighter', tags: ['entertain','play'] },
    { label: 'Absorbed and interested', tags: ['absorb','gentle'] },
    { label: 'Proud or pleasantly accomplished', tags: ['progress','create','order'] },
    { label: 'Connected or less alone', tags: ['connection'] },
    { label: 'Reset and less stuck', tags: ['reset','movement'] }
  ]},
  { key: 'pressure', title: 'What is making the choice harder?', help: 'Pressure often disguises itself as indecision.', options: [
    { label: 'I am afraid of wasting my free time', tags: ['guilt','permission','overwhelmed'] },
    { label: 'Only productive hobbies feel like they count', tags: ['guilt','permission','progress-pressure'] },
    { label: 'There are too many options', tags: ['overwhelmed','gentle','decision-fatigue'] },
    { label: 'Nothing—I mainly need a suggestion', tags: ['ready'] }
  ]}
];

const freeTimeProfiles = [
  {
    name: 'Deep recovery',
    tags: ['depleted','low','restore','no-challenge','rested','soothe','comfort','permission','guilt','overwhelmed'],
    strongTags: ['depleted','no-challenge','rested','restore'],
    description: 'Your system looks more in need of recovery than stimulation. The best choice is probably something low-demand that lets your mind and body stop performing.',
    permission: 'Rest is not the absence of a worthwhile life. Sometimes it is the activity that makes the rest of your life possible.',
    activities: [
      { title: 'Watch one familiar TV episode', detail: 'Choose comfort over novelty and let the episode be the whole activity.', min: 15 },
      { title: 'Lie down with music or an audiobook', detail: 'No cleaning, planning, or multitasking required.', min: 5 },
      { title: 'Read something easy with no page goal', detail: 'Stopping after a few pages still counts as using your free time well.', min: 10 },
      { title: 'Take a comfort reset', detail: 'Shower, comfy clothes, water or a snack, then nothing demanding.', min: 15 },
      { title: 'Take a deliberate phone break', detail: 'Set a timer and choose one specific thing to view instead of falling into an endless feed.', min: 5 }
    ]
  },
  {
    name: 'Comfort and entertainment',
    tags: ['low','gentle','comfort','soothe','entertain','play','absorb','no-challenge','permission'],
    strongTags: ['comfort','soothe','entertain'],
    description: 'You seem to want pleasant, easy engagement—enough to hold your attention without turning downtime into another assignment.',
    permission: 'Being entertained is a real purpose. A show, book, or game does not become less valuable because it produces nothing afterward.',
    activities: [
      { title: 'Watch a show or movie you are genuinely in the mood for', detail: 'Pick based on desire, not what feels culturally impressive.', min: 20 },
      { title: 'Read a romance or fantasy book', detail: 'Let immersion be the point; there is no reading quota.', min: 10 },
      { title: 'Play a cozy or familiar game', detail: 'Sims, Minecraft, or Skyrim can be downtime without needing a project goal.', min: 15 },
      { title: 'Make a snack and watch something', detail: 'A simple comfort ritual can be the plan—not a fallback.', min: 15 },
      { title: 'Browse one interest intentionally', detail: 'Perfume, books, or thrift finds—with a clear topic and stopping point.', min: 10 }
    ]
  },
  {
    name: 'Gentle interest',
    tags: ['low','steady','gentle','absorb','unsure','decision-fatigue','play','entertain','engage'],
    strongTags: ['gentle','absorb','decision-fatigue'],
    description: 'You may want to be occupied, but not challenged. A lightly absorbing activity can bridge the gap between exhaustion and full creative focus.',
    permission: 'You do not have to choose between “productive” and “doing nothing.” Gentle engagement is its own useful middle ground.',
    activities: [
      { title: 'Read for ten minutes', detail: 'Continue only if your attention naturally settles in.', min: 10 },
      { title: 'Do an easy, repetitive crochet section', detail: 'Choose a familiar stitch rather than learning something new.', min: 15 },
      { title: 'Play a game without an achievement goal', detail: 'Wander, decorate, build, or follow whatever seems fun.', min: 15 },
      { title: 'Watch a video about something you are curious about', detail: 'One intentional topic, not an algorithmic spiral.', min: 10 },
      { title: 'Make a small favorites list', detail: 'Books, perfumes, recipes, outfits, or future ideas—stop before it becomes research homework.', min: 10 }
    ]
  },
  {
    name: 'Play and novelty',
    tags: ['steady','restless','engage','play','entertain','absorb','ready','movement'],
    strongTags: ['play','entertain','restless'],
    description: 'Your energy seems to want somewhere fun to go. The goal is aliveness and enjoyment, not improvement.',
    permission: 'Play is not childish or wasted. It gives your attention somewhere chosen to land instead of letting a feed choose for you.',
    activities: [
      { title: 'Start a purely-for-fun game session', detail: 'Pick the game that sounds most tempting right now, not the one you “should” finish.', min: 15 },
      { title: 'Try a playful Sims or Minecraft idea', detail: 'Build one room, make one character, or follow one silly concept.', min: 20 },
      { title: 'Window-shop one category', detail: 'Use a wishlist or screenshots so the browsing has an endpoint.', min: 15 },
      { title: 'Make a themed playlist or mood board', detail: 'Keep it low-stakes and follow whatever catches your attention.', min: 15 },
      { title: 'Go somewhere small and different', detail: 'A coffee run, thrift store, library, or short walk can create enough novelty.', min: 20 }
    ]
  },
  {
    name: 'Creative expression',
    tags: ['steady','challenge','create','expression','absorb','progress','engage'],
    strongTags: ['create','expression','challenge'],
    description: 'You appear to have enough bandwidth to make, practice, or express something. Choose the form that feels inviting—not the one that best proves you are talented or disciplined.',
    permission: 'Creative hobbies are allowed to be messy, unfinished, and private. Their value does not depend on producing something impressive.',
    activities: [
      { title: 'Play piano with no practice standard', detail: 'Repeat a favorite section, improvise, or learn only a few measures.', min: 10 },
      { title: 'Crochet whatever feels easiest to pick up', detail: 'Progress can be tiny; enjoying the texture and rhythm counts.', min: 15 },
      { title: 'Write, design, or build something small', detail: 'A scene, character, room, list, or tiny digital project is enough.', min: 15 },
      { title: 'Bake or choose a future baking project', detail: 'Use the energy you have: bake now, or simply save one recipe and ingredients.', min: 20 },
      { title: 'Make something for the pleasure of arranging it', detail: 'A mood board, outfit, playlist, shelf, or game build can all be creative expression.', min: 15 }
    ]
  },
  {
    name: 'A satisfying reset',
    tags: ['steady','restless','challenge','progress','reset','order','movement','ready','progress-pressure'],
    strongTags: ['progress','reset','order'],
    description: 'You may genuinely want a small dose of progress or order. Keep it contained so free time does not quietly turn into an obligation marathon.',
    permission: 'Productive activity is fine when it is what you want—not when guilt is forcing you to earn rest.',
    activities: [
      { title: 'Do a ten-minute tidy of one visible area', detail: 'Stop when the timer ends, even if more could be done.', min: 10 },
      { title: 'Organize one tiny category', detail: 'One drawer, shelf, bag, or collection—not the whole room.', min: 15 },
      { title: 'Make one small plan that reduces mental clutter', detail: 'Write the next step, then close the planner.', min: 10 },
      { title: 'Practice one skill for a short block', detail: 'Choose piano, crochet, or another skill only if practice itself sounds satisfying.', min: 10 },
      { title: 'Complete one neglected two-minute task', detail: 'Then intentionally return to leisure instead of generating a new task list.', min: 5 }
    ]
  },
  {
    name: 'Connection',
    tags: ['connection','soothe','low','steady','gentle','entertain','comfort'],
    strongTags: ['connection'],
    description: 'Your free time may be asking for shared attention rather than another solo activity. Connection can be quiet, playful, or low-effort.',
    permission: 'Time spent connecting is not less legitimate because there is no visible result to show for it.',
    activities: [
      { title: 'Ask Ty to watch or play something together', detail: 'Choose an easy shared activity rather than waiting for a perfect plan.', min: 20 },
      { title: 'Send one honest “want to talk?” text', detail: 'Reach toward the person you actually want—not the person you feel obligated to contact.', min: 5 },
      { title: 'Call someone while doing something cozy', detail: 'Pair connection with a snack, walk, or simple chore if that lowers the friction.', min: 15 },
      { title: 'Share a small interest', detail: 'Send a meme, perfume find, book thought, or game idea that made you think of someone.', min: 5 },
      { title: 'Spend quiet parallel time together', detail: 'Being in the same room doing separate things still counts as connection.', min: 15 }
    ]
  },
  {
    name: 'Movement and change of scenery',
    tags: ['restless','movement','reset','engage','steady','play','ready'],
    strongTags: ['restless','movement','reset'],
    description: 'Your body may need a state change more than your brain needs another choice. A little movement or novelty could make the rest of your free time easier to use.',
    permission: 'Movement does not have to be a workout, and a change of scenery does not need to become an errand.',
    activities: [
      { title: 'Take a short walk with music', detail: 'No step goal and no need to turn it into exercise.', min: 10 },
      { title: 'Do a gentle stretch or barre flow', detail: 'Pick movements that feel good rather than trying to complete a program.', min: 10 },
      { title: 'Go get a drink or browse somewhere nearby', detail: 'Let leaving the house be the activity, not a productivity mission.', min: 20 },
      { title: 'Move to one or two favorite songs', detail: 'Dance, pace, stretch, or clean one small thing while the music plays.', min: 5 },
      { title: 'Change rooms and reset the atmosphere', detail: 'Open a window, change lighting, make a drink, and choose again afterward.', min: 5 }
    ]
  }
];

const reactionQuestions = [
  { key: 'reactionType', title: 'What did your reaction look like?', help: 'Choose the most noticeable part.', options: [
    { label: 'I became defensive or argued', tags: ['defend','fight'] },
    { label: 'I withdrew, went quiet, or avoided', tags: ['withdraw','flight'] },
    { label: 'I tried to fix or control everything', tags: ['control','fix'] },
    { label: 'I people-pleased or agreed too quickly', tags: ['please','approval'] },
    { label: 'I shut down or went blank', tags: ['freeze','numb'] },
    { label: 'I spiraled, replayed, or sought reassurance', tags: ['spiral','uncertain'] }
  ]},
  { key: 'meaning', title: 'What did the situation seem to mean?', help: 'This is the interpretation—not necessarily the objective truth.', options: [
    { label: 'I was being rejected or disliked', tags: ['rejection','approval'] },
    { label: 'I was not being respected or heard', tags: ['respect','unfair'] },
    { label: 'I had failed or looked incompetent', tags: ['failure','shame'] },
    { label: 'I might lose control or safety', tags: ['control','threat'] },
    { label: 'I was responsible for someone else’s feelings', tags: ['responsibility','please'] },
    { label: 'I would be trapped, pressured, or overwhelmed', tags: ['pressure','overload'] }
  ]},
  { key: 'familiarity', title: 'How familiar did this reaction feel?', help: 'Patterns are often learned protection strategies.', options: [
    { label: 'Very familiar—I do this often', tags: ['pattern','strong'] },
    { label: 'Somewhat familiar', tags: ['pattern'] },
    { label: 'Unusual for me', tags: ['situational'] },
    { label: 'I am not sure', tags: ['uncertain'] }
  ]},
  { key: 'protected', title: 'What might the reaction have protected you from?', help: 'A reaction can be unhelpful and still have a protective purpose.', options: [
    { label: 'Feeling rejected or exposed', tags: ['rejection','shame'] },
    { label: 'Conflict or someone’s disappointment', tags: ['conflict','approval'] },
    { label: 'Feeling powerless or out of control', tags: ['control','power'] },
    { label: 'Being overwhelmed by emotion', tags: ['overload','freeze'] },
    { label: 'Admitting what I wanted or needed', tags: ['want','vulnerable'] },
    { label: 'Being treated unfairly again', tags: ['unfair','defend'] }
  ]},
  { key: 'needed', title: 'What did you likely need in that moment?', help: 'Need does not mean the reaction was the only way to get it.', options: [
    { label: 'Reassurance or acceptance', tags: ['approval','rejection'] },
    { label: 'Respect or a boundary', tags: ['respect','unfair'] },
    { label: 'Time, space, or lower pressure', tags: ['space','overload'] },
    { label: 'Clarity or a direct answer', tags: ['clarity','uncertain'] },
    { label: 'Permission to be imperfect', tags: ['shame','acceptance'] },
    { label: 'Support expressing what I wanted', tags: ['want','vulnerable'] }
  ]}
];

const decisionQuestions = [
  { key: 'relief', title: 'Which option creates more quiet relief?', help: 'Relief is not proof, but it can reveal a buried preference.', options: ['A','B','Neither / unsure'] },
  { key: 'approval', title: 'Without anyone else’s opinion, which would you lean toward?', help: 'Imagine nobody will praise, judge, or be disappointed.', options: ['A','B','Neither / unsure'] },
  { key: 'future', title: 'Which choice would future-you more likely respect?', help: 'Not which guarantees success—which better reflects the person you want to practice being.', options: ['A','B','Neither / unsure'] },
  { key: 'fear', title: 'Which option are you avoiding mainly because it feels unfamiliar or scary?', help: 'Fear can be a warning, but it can also appear around growth.', options: ['A','B','Neither / unsure'] },
  { key: 'energy', title: 'Which option gives you more genuine energy?', help: 'Look for interest or aliveness, not just urgency.', options: ['A','B','Neither / unsure'] }
];

const discoveryCategories = {
  liked: { label: 'Something I liked', icon: '♡', prompt: 'What did you enjoy, and what part of it worked for you?' },
  disliked: { label: 'Something I disliked', icon: '×', prompt: 'What felt off, draining, boring, or misaligned?' },
  energized: { label: 'Something that energized me', icon: '↟', prompt: 'What made you feel more alive, interested, or capable?' },
  drained: { label: 'Something that drained me', icon: '↡', prompt: 'What took more from you than it gave back?' },
  proud: { label: 'A moment I felt proud', icon: '✦', prompt: 'What did you do that reflected effort, courage, or growth?' },
  confident: { label: 'A moment I felt like myself', icon: '◇', prompt: 'What were you doing, choosing, or expressing?' },
  pattern: { label: 'A pattern I noticed', icon: '⌁', prompt: 'What seems to keep happening, and in what situations?' },
  value: { label: 'A value shown in real life', icon: '◎', prompt: 'What choice or reaction showed what matters to you?' }
};

const screenMeta = {
  home: ['Today', 'Come back to yourself'],
  tools: ['Guided reflection', 'Choose what you need'],
  insights: ['Patterns', 'What your entries are teaching you'],
  history: ['Your record', 'Past check-ins and discoveries'],
  settings: ['Inner Compass', 'Privacy and data']
};

const app = {
  data: loadData(),
  screen: 'home',
  historyFilter: 'all',
  session: null
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: APP_VERSION, entries: [] };
    const parsed = JSON.parse(raw);
    return { version: APP_VERSION, entries: Array.isArray(parsed.entries) ? parsed.entries : [] };
  } catch (error) {
    console.error('Unable to load saved data:', error);
    return { version: APP_VERSION, entries: [] };
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(app.data));
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(timestamp));
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add('hidden'), 2600);
}

function goToScreen(name) {
  app.screen = name;
  document.querySelectorAll('.screen').forEach(el => el.classList.toggle('active', el.id === `screen-${name}`));
  document.querySelectorAll('[data-screen]').forEach(el => el.classList.toggle('active', el.dataset.screen === name));
  const [eyebrow, title] = screenMeta[name];
  document.getElementById('screenEyebrow').textContent = eyebrow;
  document.getElementById('screenTitle').textContent = title;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderAll();
}

function startTool(type) {
  app.session = { type, step: 0, answers: {}, setup: {}, result: null };
  const titles = {
    emotion: ['Guided check-in', 'What am I feeling?'],
    freetime: ['Free-Time Compass', 'What should I do right now?'],
    want: ['Preference finder', 'What do I want?'],
    reaction: ['Reaction explorer', 'Why did I react that way?'],
    decision: ['Decision reflection', 'Help me make a decision'],
    discovery: ['Evidence about you', 'What am I learning?']
  };
  document.getElementById('modalEyebrow').textContent = titles[type][0];
  document.getElementById('modalTitle').textContent = titles[type][1];
  document.getElementById('toolModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderSession();
}

function closeModal() {
  document.getElementById('toolModal').classList.add('hidden');
  document.body.style.overflow = '';
  app.session = null;
}

function getQuestions(type) {
  return type === 'emotion' ? emotionQuestions : type === 'freetime' ? freeTimeQuestions : type === 'want' ? wantQuestions : type === 'reaction' ? reactionQuestions : decisionQuestions;
}

function updateProgress(current, total) {
  const pct = total ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  document.getElementById('progressFill').style.width = `${pct}%`;
}

function renderSession() {
  if (!app.session) return;
  const { type } = app.session;
  document.getElementById('modalBack').style.visibility = app.session.step > 0 || app.session.result ? 'visible' : 'hidden';

  if (type === 'decision' && !app.session.setup.ready) {
    updateProgress(0, decisionQuestions.length + 1);
    renderDecisionSetup();
    return;
  }
  if (type === 'discovery') {
    updateProgress(1, 1);
    renderDiscoveryForm();
    return;
  }
  if (app.session.result) {
    updateProgress(1, 1);
    renderResult();
    return;
  }

  const questions = getQuestions(type);
  updateProgress(app.session.step, questions.length);
  renderQuestion(questions[app.session.step], questions.length);
}

function renderQuestion(question, total) {
  const body = document.getElementById('modalBody');
  const options = app.session.type === 'decision'
    ? question.options.map(value => ({ label: value === 'A' ? app.session.setup.optionA : value === 'B' ? app.session.setup.optionB : value, value }))
    : question.options;

  body.innerHTML = `
    <div class="question-count">Question ${app.session.step + 1} of ${total}</div>
    <h3 class="question-title">${escapeHtml(question.title)}</h3>
    <p class="question-help">${escapeHtml(question.help || '')}</p>
    <div class="option-list">
      ${options.map((option, index) => `
        <button class="option-button" data-answer-index="${index}">
          <span>${escapeHtml(option.label)}${option.description ? `<small>${escapeHtml(option.description)}</small>` : ''}</span>
          <span class="option-arrow">→</span>
        </button>`).join('')}
    </div>`;

  body.querySelectorAll('[data-answer-index]').forEach(button => {
    button.addEventListener('click', () => chooseAnswer(Number(button.dataset.answerIndex)));
  });
}

function chooseAnswer(index) {
  const questions = getQuestions(app.session.type);
  const question = questions[app.session.step];
  const answer = app.session.type === 'decision'
    ? { label: question.options[index], value: question.options[index] }
    : question.options[index];
  app.session.answers[question.key] = answer;
  if (app.session.step < questions.length - 1) {
    app.session.step += 1;
  } else {
    app.session.result = calculateResult(app.session.type, app.session.answers);
  }
  renderSession();
}

function collectTags(answers) {
  return Object.values(answers).flatMap(answer => answer.tags || []);
}

function rankProfiles(profiles, tags) {
  return profiles
    .map(profile => ({ ...profile, score: profile.tags.reduce((sum, tag) => sum + (tags.includes(tag) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

function rankFreeTimeProfiles(tags) {
  const tagCounts = countValues(tags);
  return freeTimeProfiles
    .map(profile => {
      const baseScore = profile.tags.reduce((sum, tag) => sum + (tagCounts[tag] || 0), 0);
      const priorityScore = (profile.strongTags || []).reduce((sum, tag) => sum + (tagCounts[tag] || 0), 0);
      return { ...profile, score: baseScore + priorityScore };
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

function getFreeTimeIdeas(profile, minutes) {
  const fitting = profile.activities.filter(activity => (activity.min || 0) <= minutes);
  return (fitting.length ? fitting : profile.activities).slice(0, 5);
}

function calculateResult(type, answers) {
  if (type === 'emotion') {
    const tags = collectTags(answers);
    return { candidates: rankProfiles(emotionProfiles, tags).slice(0, 3), tags };
  }
  if (type === 'want') {
    const tags = collectTags(answers);
    return { candidates: rankProfiles(wantProfiles, tags).slice(0, 3), tags };
  }
  if (type === 'freetime') {
    const tags = collectTags(answers);
    return { candidates: rankFreeTimeProfiles(tags).slice(0, 3), tags, selectedProfileIndex: 0 };
  }
  if (type === 'reaction') {
    const reaction = answers.reactionType?.label || 'A protective reaction';
    const meaning = answers.meaning?.label || 'The situation carried a painful meaning.';
    const protectedPurpose = answers.protected?.label || 'It may have been trying to protect you.';
    const needed = answers.needed?.label || 'You likely needed support.';
    return { reaction, meaning, protected: protectedPurpose, needed, tags: collectTags(answers) };
  }
  if (type === 'decision') {
    let scoreA = 0;
    let scoreB = 0;
    Object.entries(answers).forEach(([key, answer]) => {
      if (answer.value === 'A') scoreA += key === 'fear' ? -1 : 1;
      if (answer.value === 'B') scoreB += key === 'fear' ? -1 : 1;
    });
    const lean = scoreA === scoreB ? 'unclear' : scoreA > scoreB ? 'A' : 'B';
    return { scoreA, scoreB, lean };
  }
  return {};
}

function renderResult() {
  const type = app.session.type;
  if (type === 'emotion' || type === 'want') renderCandidateResult(type);
  else if (type === 'freetime') renderFreeTimeResult();
  else if (type === 'reaction') renderReactionResult();
  else if (type === 'decision') renderDecisionResult();
}

function renderCandidateResult(type) {
  const body = document.getElementById('modalBody');
  const candidates = app.session.result.candidates;
  const isEmotion = type === 'emotion';
  const context = app.session.answers.context?.label || '';
  body.innerHTML = `
    <div class="question-count">Possibilities, not a verdict</div>
    <h3 class="question-title">${isEmotion ? 'These feelings may fit' : 'These wants may be underneath'}</h3>
    <div class="result-intro">Notice which option creates an internal “yes,” even a small one. You can choose a different word or save this as uncertain.</div>
    <div class="result-stack">
      ${candidates.map((item, index) => `
        <label class="result-card ${index === 0 ? 'primary-result' : ''}">
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
          ${isEmotion ? `<div class="result-need">It may be pointing toward ${escapeHtml(item.need)}.</div>` : ''}
          <div class="result-choice"><input type="radio" name="candidate" value="${escapeHtml(item.name)}" ${index === 0 ? 'checked' : ''}> This feels closest</div>
        </label>`).join('')}
    </div>
    <div class="field-group" style="margin-top:20px">
      <label class="field-label" for="customCandidate">A different word fits better (optional)</label>
      <input class="text-field" id="customCandidate" placeholder="Example: irritated, hesitant, curious" />
    </div>
    ${isEmotion ? `<div class="field-group"><label class="field-label" for="situationNote">What happened?</label><textarea class="text-area" id="situationNote" placeholder="A sentence or two is enough."></textarea></div>` : `<div class="field-group"><label class="field-label" for="situationNote">What situation is this about?</label><textarea class="text-area" id="situationNote" placeholder="A sentence or two is enough."></textarea></div>`}
    <div class="field-group">
      <label class="field-label" for="nextStepNote">What small action would honor this?</label>
      <input class="text-field" id="nextStepNote" placeholder="Ask a question, rest, set a limit, wait, write it down…" />
    </div>
    ${context ? `<p class="gentle-note">Context: ${escapeHtml(context)}</p>` : ''}
    <p class="gentle-note">The goal is not perfect labeling. It is practicing contact with your own experience.</p>
    <div class="modal-actions"><button class="secondary-button" id="finishWithoutSave">Close</button><button class="primary-button" id="saveCandidate">Save check-in</button></div>`;

  body.querySelectorAll('.result-card').forEach(card => card.addEventListener('click', () => {
    body.querySelectorAll('.result-card').forEach(el => el.classList.remove('primary-result'));
    card.classList.add('primary-result');
  }));
  document.getElementById('finishWithoutSave').addEventListener('click', closeModal);
  document.getElementById('saveCandidate').addEventListener('click', () => {
    const chosen = document.getElementById('customCandidate').value.trim() || body.querySelector('input[name="candidate"]:checked')?.value || candidates[0].name;
    const note = document.getElementById('situationNote').value.trim();
    const action = document.getElementById('nextStepNote').value.trim();
    const chosenProfile = candidates.find(item => item.name === chosen);
    addEntry({
      type,
      title: chosen,
      summary: note || (isEmotion ? `Likely feeling: ${chosen}.` : `Likely want: ${chosen}.`),
      context: app.session.answers.context?.label || '',
      need: isEmotion ? (chosenProfile?.need || '') : chosen,
      action,
      answers: simplifyAnswers(app.session.answers),
      candidates: candidates.map(item => item.name)
    });
  });
}

function renderFreeTimeResult() {
  const body = document.getElementById('modalBody');
  const result = app.session.result;
  const profileIndex = Math.min(result.selectedProfileIndex || 0, result.candidates.length - 1);
  const profile = result.candidates[profileIndex];
  const minutes = app.session.answers.time?.minutes || 60;
  const ideas = getFreeTimeIdeas(profile, minutes);
  const energy = app.session.answers.energy?.label || '';
  const bandwidth = app.session.answers.bandwidth?.label || '';
  const craving = app.session.answers.craving?.label || '';

  body.innerHTML = `
    <div class="question-count">A good-enough choice for right now</div>
    <h3 class="question-title">You may need ${escapeHtml(profile.name.toLowerCase())}</h3>
    <div class="result-intro">${escapeHtml(profile.description)}</div>
    <div class="free-time-permission"><strong>Permission, not a loophole</strong><span>${escapeHtml(profile.permission)}</span></div>
    <p class="choice-guidance">Choose the option that creates the least resistance or the clearest small “yes”—not the one that sounds most impressive.</p>
    <div class="activity-choice-list">
      ${ideas.map((activity, index) => `
        <label class="activity-choice ${index === 0 ? 'selected' : ''}">
          <input type="radio" name="freeTimeActivity" value="${escapeHtml(activity.title)}" ${index === 0 ? 'checked' : ''}>
          <span><strong>${escapeHtml(activity.title)}</strong><small>${escapeHtml(activity.detail)}</small></span>
        </label>`).join('')}
    </div>
    <div class="free-time-actions-row">
      <button class="secondary-button small" id="pickActivity">Pick one for me</button>
    </div>
    <div class="field-group" style="margin-top:18px">
      <label class="field-label" for="customActivity">A different activity sounds better (optional)</label>
      <input class="text-field" id="customActivity" placeholder="What are you leaning toward?" />
    </div>
    ${result.candidates.length > 1 ? `<div class="alternate-modes"><span>Not quite right? Try another kind of downtime:</span>${result.candidates.map((candidate, index) => `<button class="text-button ${index === profileIndex ? 'active-alternate' : ''}" data-free-time-profile="${index}">${escapeHtml(candidate.name)}</button>`).join('')}</div>` : ''}
    <div class="free-time-context"><span>${escapeHtml(energy)}</span><span>${escapeHtml(bandwidth)}</span><span>${escapeHtml(craving)}</span></div>
    <p class="gentle-note"><strong>Anti-doomscroll rule:</strong> choose the activity first, then open the device or app you need for it. After ten minutes, you are allowed to stop, continue, or choose again.</p>
    <div class="modal-actions"><button class="secondary-button" id="finishWithoutSave">Close</button><button class="primary-button" id="saveFreeTime">Choose this</button></div>`;

  body.querySelectorAll('.activity-choice').forEach(choice => choice.addEventListener('click', () => {
    body.querySelectorAll('.activity-choice').forEach(item => item.classList.remove('selected'));
    choice.classList.add('selected');
  }));
  body.querySelectorAll('[data-free-time-profile]').forEach(button => button.addEventListener('click', () => {
    result.selectedProfileIndex = Number(button.dataset.freeTimeProfile);
    renderFreeTimeResult();
  }));
  document.getElementById('pickActivity').addEventListener('click', () => {
    const choices = [...body.querySelectorAll('.activity-choice')];
    const picked = choices[Math.floor(Math.random() * choices.length)];
    body.querySelectorAll('.activity-choice').forEach(item => item.classList.toggle('selected', item === picked));
    const radio = picked.querySelector('input');
    radio.checked = true;
    picked.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  document.getElementById('finishWithoutSave').addEventListener('click', closeModal);
  document.getElementById('saveFreeTime').addEventListener('click', () => {
    const chosen = document.getElementById('customActivity').value.trim() || body.querySelector('input[name="freeTimeActivity"]:checked')?.value || ideas[0].title;
    addEntry({
      type: 'freetime',
      title: chosen,
      summary: `${profile.name}: ${profile.description}`,
      need: '',
      mode: profile.name,
      action: chosen,
      context: app.session.answers.energy?.label || '',
      answers: simplifyAnswers(app.session.answers)
    }, 'Choice saved. You do not need to justify it.');
  });
}

function renderReactionResult() {
  const body = document.getElementById('modalBody');
  const r = app.session.result;
  body.innerHTML = `
    <div class="question-count">A possible chain</div>
    <h3 class="question-title">Your reaction may have made sense as protection</h3>
    <div class="summary-box">
      <div class="summary-line"><strong>Reaction</strong><span>${escapeHtml(r.reaction)}</span></div>
      <div class="summary-line"><strong>Meaning attached</strong><span>${escapeHtml(r.meaning)}</span></div>
      <div class="summary-line"><strong>Possible protective purpose</strong><span>${escapeHtml(r.protected)}</span></div>
      <div class="summary-line"><strong>Likely need</strong><span>${escapeHtml(r.needed)}</span></div>
    </div>
    <div class="field-group" style="margin-top:20px"><label class="field-label" for="reactionEvent">What objectively happened?</label><textarea class="text-area" id="reactionEvent" placeholder="Describe observable facts before your interpretation."></textarea></div>
    <div class="field-group"><label class="field-label" for="reactionAlternative">What could you try next time?</label><textarea class="text-area" id="reactionAlternative" placeholder="Example: pause, name the fear, ask what they meant, state a boundary…"></textarea></div>
    <p class="gentle-note">Understanding a reaction is not the same as excusing harmful behavior. It gives you more choice next time.</p>
    <div class="modal-actions"><button class="secondary-button" id="finishWithoutSave">Close</button><button class="primary-button" id="saveReaction">Save reflection</button></div>`;
  document.getElementById('finishWithoutSave').addEventListener('click', closeModal);
  document.getElementById('saveReaction').addEventListener('click', () => {
    const event = document.getElementById('reactionEvent').value.trim();
    const alternative = document.getElementById('reactionAlternative').value.trim();
    addEntry({ type: 'reaction', title: 'Reaction reflection', summary: event || r.reaction, need: r.needed, action: alternative, answers: simplifyAnswers(app.session.answers), chain: r });
  });
}

function renderDecisionSetup() {
  const body = document.getElementById('modalBody');
  body.innerHTML = `
    <div class="question-count">Set up the decision</div>
    <h3 class="question-title">What are you choosing between?</h3>
    <p class="question-help">Keep each option concrete. The guide will help you hear your own preference, not choose for you.</p>
    <div class="field-group"><label class="field-label" for="decisionQuestion">Decision</label><input class="text-field" id="decisionQuestion" placeholder="Example: What should I do Saturday?" /></div>
    <div class="field-group"><label class="field-label" for="optionA">Option A</label><input class="text-field" id="optionA" placeholder="Stay home and rest" /></div>
    <div class="field-group"><label class="field-label" for="optionB">Option B</label><input class="text-field" id="optionB" placeholder="Go to the event" /></div>
    <div class="modal-actions"><button class="primary-button" id="startDecisionQuestions">Continue</button></div>`;
  document.getElementById('startDecisionQuestions').addEventListener('click', () => {
    const question = document.getElementById('decisionQuestion').value.trim();
    const optionA = document.getElementById('optionA').value.trim();
    const optionB = document.getElementById('optionB').value.trim();
    if (!optionA || !optionB) { showToast('Add both options first.'); return; }
    app.session.setup = { ready: true, question: question || 'Decision', optionA, optionB };
    app.session.step = 0;
    renderSession();
  });
}

function renderDecisionResult() {
  const body = document.getElementById('modalBody');
  const { optionA, optionB, question } = app.session.setup;
  const { scoreA, scoreB, lean } = app.session.result;
  const interpretation = lean === 'unclear'
    ? 'Your answers were mixed. That may mean you need more information, both options have real tradeoffs, or neither option fully fits.'
    : `Your answers leaned toward “${lean === 'A' ? optionA : optionB}.” Treat that as evidence of preference—not a command.`;
  body.innerHTML = `
    <div class="question-count">Your answers reflected back</div>
    <h3 class="question-title">${escapeHtml(question)}</h3>
    <div class="result-intro">${escapeHtml(interpretation)}</div>
    <div class="result-stack" style="margin-top:14px">
      <div class="result-card ${lean === 'A' ? 'primary-result' : ''}"><h3>${escapeHtml(optionA)}</h3><p>Preference signals: ${scoreA}</p></div>
      <div class="result-card ${lean === 'B' ? 'primary-result' : ''}"><h3>${escapeHtml(optionB)}</h3><p>Preference signals: ${scoreB}</p></div>
    </div>
    <div class="field-group" style="margin-top:20px"><label class="field-label" for="decisionTruth">What do you notice after seeing this?</label><textarea class="text-area" id="decisionTruth" placeholder="Relief, resistance, a missing concern, a clearer preference…"></textarea></div>
    <div class="field-group"><label class="field-label" for="decisionNext">What is the next useful step?</label><input class="text-field" id="decisionNext" placeholder="Choose, gather information, ask someone, wait until tomorrow…" /></div>
    <div class="modal-actions"><button class="secondary-button" id="finishWithoutSave">Close</button><button class="primary-button" id="saveDecision">Save reflection</button></div>`;
  document.getElementById('finishWithoutSave').addEventListener('click', closeModal);
  document.getElementById('saveDecision').addEventListener('click', () => {
    const truth = document.getElementById('decisionTruth').value.trim();
    const action = document.getElementById('decisionNext').value.trim();
    addEntry({ type: 'decision', title: question, summary: truth || interpretation, action, options: { optionA, optionB }, lean, answers: simplifyAnswers(app.session.answers) });
  });
}

function renderDiscoveryForm() {
  const body = document.getElementById('modalBody');
  const selected = app.session.setup.category || 'liked';
  const category = discoveryCategories[selected];
  body.innerHTML = `
    <div class="question-count">Identity through evidence</div>
    <h3 class="question-title">What did real life teach you?</h3>
    <p class="question-help">Record an observation—not a permanent label you now have to live up to.</p>
    <div class="field-group"><label class="field-label">Type of discovery</label><div class="option-list discovery-options">
      ${Object.entries(discoveryCategories).map(([key, item]) => `<button class="option-button ${key === selected ? 'selected' : ''}" data-discovery-category="${key}"><span>${item.icon} &nbsp;${escapeHtml(item.label)}</span></button>`).join('')}
    </div></div>
    <div class="field-group"><label class="field-label" for="discoveryObservation">${escapeHtml(category.prompt)}</label><textarea class="text-area" id="discoveryObservation" placeholder="Describe the moment or example.">${escapeHtml(app.session.setup.observation || '')}</textarea></div>
    <div class="field-group"><label class="field-label" for="discoveryMeaning">What might this suggest about you?</label><textarea class="text-area" id="discoveryMeaning" placeholder="Example: I like learning when I can immediately use it.">${escapeHtml(app.session.setup.meaning || '')}</textarea><span class="field-hint">Keep it tentative: “I may…” or “This suggests…”</span></div>
    <div class="field-group"><label class="field-label" for="discoveryExperiment">What could you test or repeat?</label><input class="text-field" id="discoveryExperiment" placeholder="Optional small experiment" value="${escapeHtml(app.session.setup.experiment || '')}" /></div>
    <div class="modal-actions"><button class="secondary-button" id="finishWithoutSave">Close</button><button class="primary-button" id="saveDiscovery">Save discovery</button></div>`;

  body.querySelectorAll('[data-discovery-category]').forEach(button => button.addEventListener('click', () => {
    app.session.setup.observation = document.getElementById('discoveryObservation').value;
    app.session.setup.meaning = document.getElementById('discoveryMeaning').value;
    app.session.setup.experiment = document.getElementById('discoveryExperiment').value;
    app.session.setup.category = button.dataset.discoveryCategory;
    renderDiscoveryForm();
  }));
  document.getElementById('finishWithoutSave').addEventListener('click', closeModal);
  document.getElementById('saveDiscovery').addEventListener('click', () => {
    const observation = document.getElementById('discoveryObservation').value.trim();
    const meaning = document.getElementById('discoveryMeaning').value.trim();
    const experiment = document.getElementById('discoveryExperiment').value.trim();
    if (!observation) { showToast('Add the moment or example first.'); return; }
    addEntry({ type: 'discovery', title: category.label, category: selected, summary: observation, meaning, action: experiment });
  });
}

function simplifyAnswers(answers) {
  return Object.fromEntries(Object.entries(answers).map(([key, value]) => [key, value.label || value.value || String(value)]));
}

function addEntry(entry, toastMessage = 'Saved to your Inner Compass.') {
  app.data.entries.unshift({ id: uid(), createdAt: new Date().toISOString(), ...entry });
  saveData();
  closeModal();
  renderAll();
  showToast(toastMessage);
}

function historyIcon(type) {
  return { emotion: '◌', want: '⌁', reaction: '↻', decision: '⇄', freetime: '☕', discovery: '✧' }[type] || '◇';
}

function typeLabel(type) {
  return { emotion: 'Feeling', want: 'Want', reaction: 'Reaction', decision: 'Decision', freetime: 'Free-time choice', discovery: 'Discovery' }[type] || type;
}

function renderRecentEntries() {
  const el = document.getElementById('recentEntries');
  const entries = app.data.entries.slice(0, 3);
  if (!entries.length) {
    el.className = 'empty-state compact';
    el.innerHTML = '<span class="empty-icon">◇</span><p>Your saved check-ins will appear here.</p>';
    return;
  }
  el.className = 'history-list';
  el.innerHTML = entries.map(entry => historyCardMarkup(entry, false)).join('');
}

function historyCardMarkup(entry, allowDelete = true) {
  const detail = entry.meaning || entry.need || entry.action || '';
  return `<article class="history-card">
    <div class="history-type">${historyIcon(entry.type)}</div>
    <div><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.summary || detail || 'Saved reflection')}</p>
      <div class="history-meta"><span class="meta-chip">${typeLabel(entry.type)}</span>${entry.context ? `<span class="meta-chip">${escapeHtml(entry.context)}</span>` : ''}<span class="meta-chip">${escapeHtml(formatDate(entry.createdAt))}</span></div>
    </div>
    ${allowDelete ? `<button class="delete-entry" data-delete-id="${entry.id}" aria-label="Delete entry">×</button>` : ''}
  </article>`;
}

function renderHistory() {
  const list = document.getElementById('historyList');
  const entries = app.historyFilter === 'all' ? app.data.entries : app.data.entries.filter(entry => entry.type === app.historyFilter);
  if (!entries.length) {
    list.innerHTML = '<div class="intro-card centered"><div class="large-symbol">☷</div><h2>No entries here yet</h2><p>Complete a guided tool and save the reflection. You can delete any entry later.</p></div>';
    return;
  }
  list.innerHTML = entries.map(entry => historyCardMarkup(entry)).join('');
  list.querySelectorAll('[data-delete-id]').forEach(button => button.addEventListener('click', () => deleteEntry(button.dataset.deleteId)));
}

function deleteEntry(id) {
  const entry = app.data.entries.find(item => item.id === id);
  if (!entry) return;
  if (!window.confirm(`Delete “${entry.title}”?`)) return;
  app.data.entries = app.data.entries.filter(item => item.id !== id);
  saveData();
  renderAll();
  showToast('Entry deleted.');
}

function countValues(values) {
  return values.reduce((acc, value) => {
    if (!value) return acc;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function sortedCounts(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function renderInsights() {
  const entries = app.data.entries;
  const empty = document.getElementById('insightsEmpty');
  const content = document.getElementById('insightsContent');
  if (entries.length < 3) {
    empty.classList.remove('hidden');
    content.classList.add('hidden');
    return;
  }
  empty.classList.add('hidden');
  content.classList.remove('hidden');

  const emotionEntries = entries.filter(entry => entry.type === 'emotion');
  const discoveryEntries = entries.filter(entry => entry.type === 'discovery');
  const needs = entries.flatMap(entry => {
    if (!entry.need || entry.type === 'freetime') return [];
    return entry.need.split(/,| or /).map(value => value.trim().replace(/^a /, '')).filter(Boolean);
  });
  const freeTimeEntries = entries.filter(entry => entry.type === 'freetime');
  const contexts = emotionEntries.map(entry => entry.context).filter(Boolean);
  const topEmotion = sortedCounts(countValues(emotionEntries.map(entry => entry.title)))[0];
  const topNeed = sortedCounts(countValues(needs))[0];
  const topContext = sortedCounts(countValues(contexts))[0];

  document.getElementById('statsRow').innerHTML = [
    [entries.length, 'Total entries'],
    [emotionEntries.length, 'Feelings named'],
    [discoveryEntries.length, 'Self-discoveries'],
    [new Set(entries.map(entry => new Date(entry.createdAt).toDateString())).size, 'Days checked in']
  ].map(([value,label]) => `<div class="stat-card"><span class="stat-value">${value}</span><span class="stat-label">${label}</span></div>`).join('');

  const emotionCounts = sortedCounts(countValues(emotionEntries.map(entry => entry.title))).slice(0, 6);
  const maxEmotion = emotionCounts[0]?.[1] || 1;
  document.getElementById('emotionBars').innerHTML = emotionCounts.length
    ? emotionCounts.map(([name,count]) => `<div class="bar-row"><span>${escapeHtml(name)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(10,(count/maxEmotion)*100)}%"></div></div><strong>${count}</strong></div>`).join('')
    : '<p class="gentle-note">Save emotion check-ins to see this pattern.</p>';

  document.getElementById('needChips').innerHTML = sortedCounts(countValues(needs)).slice(0, 10).map(([name,count]) => `<span class="insight-chip">${escapeHtml(name)} · ${count}</span>`).join('') || '<p class="gentle-note">Needs will appear after feeling and reaction check-ins.</p>';

  const patterns = [];
  if (topEmotion) patterns.push(`Your most frequently named emotion is <strong>${escapeHtml(topEmotion[0])}</strong> (${topEmotion[1]} check-in${topEmotion[1] === 1 ? '' : 's'}). This is a prompt to investigate, not a permanent trait.`);
  if (topNeed) patterns.push(`<strong>${escapeHtml(topNeed[0])}</strong> appears often underneath your entries. Notice whether you tend to recognize it early or only after distress builds.`);
  if (topContext) patterns.push(`Feelings are showing up most often around <strong>${escapeHtml(topContext[0])}</strong>. That context may deserve more specific reflection or support.`);
  const approvalMentions = entries.filter(entry => JSON.stringify(entry.answers || {}).toLowerCase().includes('approval') || JSON.stringify(entry.answers || {}).toLowerCase().includes('judg')).length;
  if (approvalMentions >= 2) patterns.push(`Several entries involve judgment, approval, or other people’s reactions. A useful question may be: <strong>“What would I choose or feel if nobody needed me to manage their response?”</strong>`);
  const topFreeTimeMode = sortedCounts(countValues(freeTimeEntries.map(entry => entry.mode)))[0];
  if (topFreeTimeMode && freeTimeEntries.length >= 2) patterns.push(`Your free-time check-ins most often point toward <strong>${escapeHtml(topFreeTimeMode[0])}</strong>. That may be a recurring need lately—not a rule for what you should always choose.`);
  if (!patterns.length) patterns.push('You have enough entries to begin noticing patterns, but no single theme dominates yet. That is useful information too.');
  document.getElementById('patternCards').innerHTML = patterns.map(text => `<div class="pattern-card">${text}</div>`).join('');

  const categoryCounts = sortedCounts(countValues(discoveryEntries.map(entry => discoveryCategories[entry.category]?.label || entry.title))).slice(0, 4);
  document.getElementById('discoverySummary').innerHTML = discoveryEntries.length
    ? categoryCounts.map(([category,count]) => {
        const example = discoveryEntries.find(entry => (discoveryCategories[entry.category]?.label || entry.title) === category);
        return `<div class="discovery-mini"><strong>${escapeHtml(category)} · ${count}</strong><span>${escapeHtml(example?.meaning || example?.summary || '')}</span></div>`;
      }).join('')
    : '<p class="gentle-note">Add discoveries to build a grounded picture of what fits you.</p>';
}

function renderAll() {
  renderRecentEntries();
  renderHistory();
  renderInsights();
}

function exportData() {
  const payload = { app: 'Inner Compass', exportedAt: new Date().toISOString(), version: APP_VERSION, entries: app.data.entries };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inner-compass-backup-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Backup exported.');
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = event => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (!Array.isArray(parsed.entries)) throw new Error('No entries array');
      const replace = window.confirm(`Import ${parsed.entries.length} entries? Choose OK to replace current data, or Cancel to keep current data unchanged.`);
      if (!replace) return;
      app.data = { version: APP_VERSION, entries: parsed.entries };
      saveData();
      renderAll();
      showToast('Backup imported.');
    } catch (error) {
      console.error(error);
      showToast('That file is not a valid Inner Compass backup.');
    }
  };
  reader.readAsText(file);
}

function resetData() {
  if (!window.confirm('Delete every Inner Compass entry from this browser? This cannot be undone.')) return;
  app.data = { version: APP_VERSION, entries: [] };
  saveData();
  renderAll();
  showToast('All app data was deleted.');
}

function goBackInModal() {
  if (!app.session) return;
  if (app.session.result) {
    app.session.result = null;
    const questions = getQuestions(app.session.type);
    app.session.step = Math.max(0, questions.length - 1);
    renderSession();
    return;
  }
  if (app.session.type === 'decision' && app.session.step === 0) {
    app.session.setup.ready = false;
    renderSession();
    return;
  }
  if (app.session.step > 0) {
    app.session.step -= 1;
    renderSession();
  }
}

function installEventHandlers() {
  document.querySelectorAll('[data-screen]').forEach(button => button.addEventListener('click', () => goToScreen(button.dataset.screen)));
  document.querySelectorAll('[data-go-screen]').forEach(button => button.addEventListener('click', () => goToScreen(button.dataset.goScreen)));
  document.querySelectorAll('[data-start-tool]').forEach(button => button.addEventListener('click', () => startTool(button.dataset.startTool)));
  document.getElementById('quickCheckin').addEventListener('click', () => startTool('emotion'));
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBack').addEventListener('click', goBackInModal);
  document.getElementById('toolModal').addEventListener('click', event => { if (event.target.id === 'toolModal') closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !document.getElementById('toolModal').classList.contains('hidden')) closeModal(); });
  document.querySelectorAll('#historyFilters button').forEach(button => button.addEventListener('click', () => {
    app.historyFilter = button.dataset.filter;
    document.querySelectorAll('#historyFilters button').forEach(el => el.classList.toggle('active', el === button));
    renderHistory();
  }));
  document.getElementById('exportData').addEventListener('click', exportData);
  document.getElementById('importData').addEventListener('change', event => importData(event.target.files[0]));
  document.getElementById('resetData').addEventListener('click', resetData);
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(error => console.warn('Service worker registration failed:', error)));
  }
}

installEventHandlers();
renderAll();
registerServiceWorker();
