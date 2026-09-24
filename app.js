'use strict';

const STORAGE_KEY = 'inner-compass-data-v1';
const APP_VERSION = 6;

const emotionSupport = {
  Frustration: {
    default: [
      'Pause before solving. Name the specific obstacle instead of treating the whole situation as the problem.',
      'Ask: “What part can I influence, and what part do I need to accept or discuss?”',
      'Choose one small next move, then give yourself permission to stop pushing for a complete fix right now.'
    ],
    relationship: [
      'Let the first wave settle before responding so the frustration does not choose your tone for you.',
      'Separate the practical concern from the person: describe what is worrying you, rather than framing them as irresponsible or wrong.',
      'Try a clear request: “I want us to enjoy things, and I am stressed about money. Can we look at what we can comfortably spend before deciding?”'
    ]
  },
  Anger: {
    default: ['Create a little physical distance before acting.', 'Identify the crossed boundary or value underneath the anger.', 'State what needs to change using observable facts and a direct request.'],
    relationship: ['Do not use the intensity of the feeling as proof of the other person’s intent.', 'Lead with the specific behavior and its impact, not a character judgment.', 'Decide whether you need repair, a boundary, information, or simply time to cool down.']
  },
  Anxiety: {
    default: ['Slow the problem down: write what is known, what is assumed, and what is still unknown.', 'Regulate first with slower breathing, grounding, or a brief walk.', 'Pick one information-gathering or preparation step rather than trying to eliminate all uncertainty.'],
    relationship: ['Check whether you are reacting to what happened or to what you fear it could mean.', 'Ask for clarification instead of mind-reading.', 'Request reassurance plainly, while remembering that reassurance cannot create total certainty.']
  },
  Hurt: {
    default: ['Acknowledge that something mattered before trying to talk yourself out of feeling it.', 'Decide whether you need comfort, space, clarification, or repair.', 'Share the impact in simple language when you feel steady enough.'],
    relationship: ['Describe what landed painfully without assuming it was intended to hurt you.', 'Ask what the other person meant, then explain what you needed instead.', 'Protect yourself with a boundary if the behavior is repeated or dismissive.']
  },
  Sadness: { default: ['Lower the demand to “fix” the feeling immediately.', 'Choose comfort, quiet company, or gentle movement.', 'Name what feels lost or disappointing; sadness often becomes easier to carry when it is specific.'] },
  Overwhelm: { default: ['Reduce input before making more decisions.', 'Choose the next smallest visible task—or intentionally rest if capacity is gone.', 'Move non-urgent demands out of your head and onto a short list for later.'] },
  Guilt: { default: ['Check whether you violated a value or merely disappointed an expectation.', 'Repair what is actually yours to repair.', 'After making amends or choosing differently, stop using self-punishment as proof that you care.'] },
  Resentment: { default: ['Notice what you have been agreeing to while internally saying no.', 'Identify the unspoken expectation or imbalance.', 'Make a boundary or request before resentment has to keep doing the communication for you.'] },
  Disappointment: { default: ['Let yourself name what you hoped would happen.', 'Separate the painful outcome from a global conclusion about yourself or the future.', 'Adjust the expectation or choose a new route without pretending it did not matter.'] },
  Loneliness: { default: ['Choose specific connection rather than passive scrolling.', 'Send one low-pressure message or spend time near safe people.', 'Ask what kind of connection is missing: company, affection, understanding, or belonging.'] },
  Shame: { default: ['Use behavior language instead of identity language: “I did…” rather than “I am…”.', 'Tell the story to someone safe or write it from a more compassionate perspective.', 'Look for the next responsible action, not a punishment.'] },
  Jealousy: { default: ['Name what feels threatened without treating the fear as evidence.', 'Ask for clarity or reassurance directly.', 'Reconnect with your own boundaries, worth, and choices rather than competing with an imagined rival.'] },
  Numbness: { default: ['Do not force a breakthrough.', 'Try simple sensory grounding, food, water, rest, or a shower.', 'Give the feeling time and check in again later with less pressure.'] },
  Relief: { default: ['Let your body finish coming down from the stress.', 'Avoid immediately filling the newly open space with another demand.', 'Notice what helped so you can reuse it.'] },
  Excitement: { default: ['Give the energy somewhere safe to go: share it, plan one step, or celebrate.', 'Avoid committing to everything while activated.', 'Capture the idea now and evaluate logistics after the initial rush settles.'] },
  Contentment: { default: ['Let the moment be enough without improving it.', 'Notice the conditions that helped create this steadiness.', 'Savor it through attention rather than documenting or optimizing it.'] }
};

function getEmotionSupport(emotion, context = '') {
  const profile = emotionSupport[emotion];
  const isRelationship = /relationship|family/i.test(context);
  if (profile) return (isRelationship && profile.relationship ? profile.relationship : profile.default).slice(0, 3);
  return [
    'Pause and let the first wave of the feeling settle before choosing a response.',
    'Ask what the feeling may be protecting or asking for: information, comfort, space, repair, or action.',
    'Choose the smallest response that supports the need without creating a second problem.'
  ];
}

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
  home: ['Today', 'Track what is changing'],
  calendar: ['Calendar', 'See the pattern over time'],
  tools: ['Useful tools', 'Use what helps'],
  reality: ['Reality Check', 'What is actually reasonable?'],
  insights: ['Patterns', 'What your days are teaching you'],
  history: ['Reflection history', 'Past guided check-ins and discoveries'],
  settings: ['Inner Compass', 'Privacy and data']
};

const app = {
  data: loadData(),
  screen: 'home',
  historyFilter: 'all',
  session: null,
  realityDraft: null,
  trackerDate: localDateKey(new Date()),
  calendarCursor: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: APP_VERSION, entries: [], trackerDays: {} };
    const parsed = JSON.parse(raw);
    const trackerDays = parsed.trackerDays && typeof parsed.trackerDays === 'object' ? parsed.trackerDays : {};
    // v5 imported Bearable's ambiguous “emotionally sensitive” factor as affection.
    // Only migrate untouched imported days; anything the user edited stays exactly as they set it.
    if (Number(parsed.version || 0) < 6) {
      Object.values(trackerDays).forEach(day => {
        if (!day || !day.importedBearable || day.customTouched || !Array.isArray(day.changes)) return;
        if (day.changes.includes('affection')) day.changes = [...new Set(day.changes.map(x => x === 'affection' ? 'legacySensitive' : x))];
      });
    }
    return {
      version: APP_VERSION,
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      trackerDays
    };
  } catch (error) {
    console.error('Unable to load saved data:', error);
    return { version: APP_VERSION, entries: [], trackerDays: {} };
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

  const supportMarkup = emotionName => {
    const suggestions = getEmotionSupport(emotionName, context);
    return `<div class="support-box" id="emotionSupportBox">
      <p class="eyebrow">Respond with more choice</p>
      <h3>Ways to soothe or work with ${escapeHtml(emotionName.toLowerCase())}</h3>
      <ul>${suggestions.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      <p>Pick one idea that fits. The goal is not to suppress the feeling—it is to keep the feeling from driving the whole response.</p>
    </div>`;
  };

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
    ${isEmotion ? supportMarkup(candidates[0].name) : ''}
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

  const updateSupport = emotionName => {
    if (!isEmotion) return;
    const existing = document.getElementById('emotionSupportBox');
    if (existing) existing.outerHTML = supportMarkup(emotionName);
  };

  body.querySelectorAll('.result-card').forEach(card => card.addEventListener('click', () => {
    body.querySelectorAll('.result-card').forEach(el => el.classList.remove('primary-result'));
    card.classList.add('primary-result');
    const selected = card.querySelector('input[name="candidate"]')?.value;
    if (selected) updateSupport(selected);
  }));
  document.getElementById('customCandidate').addEventListener('change', event => {
    if (isEmotion && event.target.value.trim()) updateSupport(event.target.value.trim());
  });
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
      support: isEmotion ? getEmotionSupport(chosen, context) : [],
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
  return { emotion: '◌', want: '⌁', reaction: '↻', decision: '⇄', freetime: '☕', reality: '⚖', discovery: '✧' }[type] || '◇';
}

function typeLabel(type) {
  return { emotion: 'Feeling', want: 'Want', reaction: 'Reaction', decision: 'Decision', freetime: 'Free-time choice', reality: 'Reality check', discovery: 'Discovery' }[type] || type;
}


function realityNumber(id) {
  const value = parseFloat(document.getElementById(id)?.value);
  return Number.isFinite(value) ? value : 0;
}

function setRealityResult(title, body, tone = 'neutral', draft = null) {
  const target = document.getElementById('realityResult');
  if (!target) return;
  app.realityDraft = draft;
  target.innerHTML = `<div class="reality-result ${tone}"><p class="eyebrow">Reality check</p><h3>${escapeHtml(title)}</h3><div class="reality-result-copy">${body}</div>${draft ? '<button class="secondary-button small" id="saveRealityCheck">Save to History</button>' : ''}</div>`;
  document.getElementById('saveRealityCheck')?.addEventListener('click', saveRealityCheck);
}

function saveRealityCheck() {
  if (!app.realityDraft) return;
  const draft = app.realityDraft;
  app.data.entries.unshift({
    id: uid(),
    createdAt: new Date().toISOString(),
    type: 'reality',
    title: draft.title,
    summary: draft.summary,
    action: draft.action || '',
    context: draft.context || '',
    realityKind: draft.realityKind || '',
    outcome: draft.outcome || ''
  });
  saveData();
  app.realityDraft = null;
  renderAll();
  const button = document.getElementById('saveRealityCheck');
  if (button) {
    button.textContent = 'Saved ✓';
    button.disabled = true;
  }
  showToast('Reality check saved to History.');
}

function renderRealityMode(mode) {
  const workspace = document.getElementById('realityWorkspace');
  if (!workspace) return;
  app.realityDraft = null;
  document.querySelectorAll('[data-reality-mode]').forEach(button => button.classList.toggle('active', button.dataset.realityMode === mode));

  if (mode === 'capacity') {
    workspace.innerHTML = `<div class="reality-form-header"><p class="eyebrow">Time reality</p><h2>Does this actually fit today?</h2><p>Count fixed commitments first. Leftover time is not automatically a blank block you owe to productivity.</p></div>
      <div class="reality-form-grid two-col">
        <label>Sleep target <span><input class="text-field compact-number" type="number" id="rcSleep" min="0" max="24" step=".25" value="8"> hours</span></label>
        <label>Work <span><input class="text-field compact-number" type="number" id="rcWork" min="0" max="24" step=".25" value="8"> hours</span></label>
        <label>Commute / getting ready <span><input class="text-field compact-number" type="number" id="rcCommute" min="0" max="24" step=".25" value="1.5"> hours</span></label>
        <label>Gym / exercise <span><input class="text-field compact-number" type="number" id="rcGym" min="0" max="24" step=".25" value="1.5"> hours</span></label>
        <label>School / focused work <span><input class="text-field compact-number" type="number" id="rcSchool" min="0" max="24" step=".25" value="1.5"> hours</span></label>
        <label>Meals / shower / basics <span><input class="text-field compact-number" type="number" id="rcBasics" min="0" max="24" step=".25" value="2"> hours</span></label>
      </div>
      <div class="reality-divider"></div>
      <div class="reality-form-grid">
        <label>Thing I want to get done<input class="text-field" id="rcTask" placeholder="e.g. fully clean the house"></label>
        <label>How long would it realistically take?<span><input class="text-field compact-number" type="number" id="rcTaskHours" min="0" step=".25" value="2"> hours</span></label>
      </div>
      <button class="primary-button" id="runCapacityCheck">Check reality</button><div id="realityResult"></div>`;
    document.getElementById('runCapacityCheck').addEventListener('click', () => {
      const committed = ['rcSleep','rcWork','rcCommute','rcGym','rcSchool','rcBasics'].reduce((sum,id) => sum + realityNumber(id), 0);
      const available = Math.max(0, 24 - committed);
      const task = document.getElementById('rcTask').value.trim() || 'The task';
      const taskHours = realityNumber('rcTaskHours');
      let title, summary, action, outcome, tone, body;
      if (committed > 24) {
        title = 'Your current plan already exceeds 24 hours.';
        summary = `Before ${task}, you allocated ${committed.toFixed(1)} hours. The day does not contain the plan as written.`;
        action = 'Shrink, move, or remove something instead of treating this as a motivation failure.';
        outcome = 'overbooked'; tone = 'warn';
        body = `You have allocated <strong>${committed.toFixed(1)} hours</strong> before this task. This is a scheduling problem, not evidence that you should try harder.`;
      } else if (taskHours > available) {
        title = `${task} does not fit as currently defined.`;
        summary = `${available.toFixed(1)} hours remain on paper; ${task} needs about ${taskHours.toFixed(1)}.`;
        action = 'Reduce the scope or move part of the task to another day.';
        outcome = 'does not fit'; tone = 'warn';
        body = `You have about <strong>${available.toFixed(1)} hours</strong> left before any unplanned life. The task needs about <strong>${taskHours.toFixed(1)}</strong>. “I did not finish it” would not mean “I was not productive.”`;
      } else if (available < 2) {
        title = 'It technically fits, but your margin is tiny.';
        summary = `${available.toFixed(1)} hours remain after fixed commitments; ${task} is possible only with little buffer.`;
        action = 'Aim for a minimum or maintenance version unless the task is genuinely urgent.';
        outcome = 'tight fit'; tone = 'neutral';
        body = `You have about <strong>${available.toFixed(1)} hours</strong> left. Treat that as limited capacity, not a blank productivity block.`;
      } else {
        title = 'It fits on paper.';
        summary = `${available.toFixed(1)} hours remain after fixed commitments; ${task} needs about ${taskHours.toFixed(1)}.`;
        action = 'Decide whether this task actually outranks rest, relationships, and buffer time today.';
        outcome = 'fits'; tone = 'good';
        body = `You have about <strong>${available.toFixed(1)} hours</strong> left. Possible does not automatically mean required.`;
      }
      setRealityResult(title, body, tone, { title: `Time reality: ${task}`, summary, action, context: 'Time reality', realityKind: 'capacity', outcome });
    });
    return;
  }

  if (mode === 'state') {
    workspace.innerHTML = `<div class="reality-form-header"><p class="eyebrow">State check</p><h2>Rest, avoidance, or both?</h2><p>This deliberately does not ask “Are you tired?” and rubber-stamp the answer. It looks for competing evidence.</p></div>
      <div class="reality-form-grid">
        <label>How much true downtime have you already had today?<select class="select-field" id="rcDowntime"><option value="0">Almost none</option><option value="1">30–60 minutes</option><option value="2">1–3 hours</option><option value="3">3+ hours</option></select></label>
        <label>Does almost everything feel hard, or mainly this task?<select class="select-field" id="rcGlobalHard"><option value="2">Almost everything feels hard</option><option value="1">A mix</option><option value="0">Mostly this task</option></select></label>
        <label>If you started for 10 minutes, what do you predict?<select class="select-field" id="rcTenMin"><option value="2">I would probably still feel wiped out</option><option value="1">I am genuinely not sure</option><option value="0">I would probably get into it</option></select></label>
        <label>Have you postponed this same thing multiple times?<select class="select-field" id="rcPostponed"><option value="0">No</option><option value="1">Once or twice</option><option value="2">Repeatedly</option></select></label>
        <label>How depleted do you feel overall?<div class="reality-range-row"><input type="range" id="rcDepletion" min="0" max="10" value="5"><strong id="rcDepletionReadout">5 / 10</strong></div></label>
      </div>
      <button class="primary-button" id="runStateCheck">Assess the evidence</button><div id="realityResult"></div>`;
    const range = document.getElementById('rcDepletion');
    range.addEventListener('input', () => document.getElementById('rcDepletionReadout').textContent = `${range.value} / 10`);
    document.getElementById('runStateCheck').addEventListener('click', () => {
      const downtime = +document.getElementById('rcDowntime').value;
      const globalHard = +document.getElementById('rcGlobalHard').value;
      const ten = +document.getElementById('rcTenMin').value;
      const postponed = +document.getElementById('rcPostponed').value;
      const depletion = +document.getElementById('rcDepletion').value;
      const restScore = globalHard*2 + ten*2 + depletion/2 - downtime;
      const avoidScore = downtime*1.5 + postponed*2 + (2-globalHard)*1.5 + (2-ten);
      let title, body, outcome, action, tone;
      if (Math.abs(restScore - avoidScore) < 2) {
        outcome = 'mixed'; tone = 'neutral'; title = 'This looks mixed: some depletion, some avoidance.';
        action = 'Try 20–30 minutes of real rest, then a 10-minute minimum version. Reassess from what actually happens.';
        body = `You do not need to win a court case about whether you are “really tired.” <strong>Both can be true.</strong> Use a short recovery block and then a small activation test.`;
      } else if (restScore > avoidScore) {
        outcome = 'depletion'; tone = 'good'; title = 'Evidence leans toward depletion.';
        action = 'Choose real recovery and lower today’s standard. Reassess later only if capacity actually returns.';
        body = `Your resistance looks broader than one task. That makes depletion more plausible than simple task avoidance. Choose recovery that tends to restore you—not endless low-quality scrolling.`;
      } else {
        outcome = 'avoidance'; tone = 'warn'; title = 'Evidence leans toward avoidance / activation trouble.';
        action = 'Do 10 minutes only. If starting makes it easier, continue if you choose; if you feel worse, stop and update the evidence.';
        body = `You may be using “I’m tired” to describe resistance to this task. That does not make you a lazy person, but it does mean <strong>action is the better test than reassurance</strong>.`;
      }
      setRealityResult(title, body, tone, { title: 'Rest or avoidance?', summary: `Current evidence leaned ${outcome}.`, action, context: 'State check', realityKind: 'state', outcome });
    });
    return;
  }

  if (mode === 'enough') {
    workspace.innerHTML = `<div class="reality-form-header"><p class="eyebrow">Good enough</p><h2>Define “done” before your standard expands.</h2><p>The point is not to lower every standard. It is to stop treating every version below “full reset” as zero.</p></div>
      <div class="reality-form-grid">
        <label>What are you trying to get done?<input class="text-field" id="rcEnoughTask" placeholder="e.g. clean the kitchen"></label>
        <label><span class="reality-level"><b>1</b> Minimum — keeps life functional</span><textarea class="text-area" id="rcMinimum" placeholder="e.g. load dishwasher + wipe counters"></textarea></label>
        <label><span class="reality-level"><b>2</b> Good enough — noticeably improved</span><textarea class="text-area" id="rcGood" placeholder="e.g. minimum + sweep + put obvious clutter away"></textarea></label>
        <label><span class="reality-level"><b>3</b> Full reset — polished / complete</span><textarea class="text-area" id="rcFull" placeholder="e.g. good enough + mop + detail-clean + organize"></textarea></label>
        <label>What level does today realistically support?<select class="select-field" id="rcTodayLevel"><option value="Minimum">Minimum</option><option value="Good enough" selected>Good enough</option><option value="Full reset">Full reset</option></select></label>
      </div>
      <button class="primary-button" id="runEnoughCheck">Set today’s stopping point</button><div id="realityResult"></div>`;
    document.getElementById('runEnoughCheck').addEventListener('click', () => {
      const task = document.getElementById('rcEnoughTask').value.trim() || 'This task';
      const level = document.getElementById('rcTodayLevel').value;
      const values = { 'Minimum': document.getElementById('rcMinimum').value.trim(), 'Good enough': document.getElementById('rcGood').value.trim(), 'Full reset': document.getElementById('rcFull').value.trim() };
      const stoppingPoint = values[level] || `Stop when the ${level.toLowerCase()} version is complete.`;
      const body = `<strong>${escapeHtml(level)}</strong> is the finish line today.<br><br>${escapeHtml(stoppingPoint)}<br><br>Anything beyond that is optional. It does not have to happen for the effort to count.`;
      setRealityResult(`${level} counts as done today.`, body, 'good', { title: `Good enough: ${task}`, summary: `${level} was chosen as today’s stopping point.`, action: stoppingPoint, context: 'Good enough', realityKind: 'enough', outcome: level.toLowerCase() });
    });
    return;
  }

  if (mode === 'rule') {
    workspace.innerHTML = `<div class="reality-form-header"><p class="eyebrow">Rule check</p><h2>What invisible rule are you obeying?</h2><p>A preference can matter without becoming a law about when you are allowed to relax, enjoy yourself, or move on.</p></div>
      <div class="reality-form-grid">
        <label>I can’t / shouldn’t…<input class="text-field" id="rcWantThing" placeholder="play a video game"></label>
        <label>…until…<input class="text-field" id="rcMustThing" placeholder="the house is clean"></label>
        <label>That condition is probably…<select class="select-field" id="rcRuleType"><option value="need">A real need with a real consequence</option><option value="preference">A preference that would feel nicer</option><option value="rule" selected>An internal rule I made</option><option value="unsure">I am not sure</option></select></label>
        <label>A less rigid version could be…<input class="text-field" id="rcAltRule" placeholder="e.g. 20-minute reset, then I can game"></label>
      </div>
      <button class="primary-button" id="runRuleCheck">Reality-check the rule</button><div id="realityResult"></div>`;
    document.getElementById('runRuleCheck').addEventListener('click', () => {
      const want = document.getElementById('rcWantThing').value.trim() || 'do the thing I want';
      const must = document.getElementById('rcMustThing').value.trim() || 'finish everything first';
      const type = document.getElementById('rcRuleType').value;
      const alt = document.getElementById('rcAltRule').value.trim();
      let title, body, action, outcome, tone='neutral';
      if (type === 'need') {
        title = 'There may be a real requirement here.'; outcome = 'real need';
        action = alt || 'Keep the rule only as strict as the real consequence requires.';
        body = `Ask: <strong>what is the minimum condition that genuinely needs to be met?</strong> A real need can justify a boundary without requiring the most perfect version.`;
      } else if (type === 'preference') {
        title = 'This sounds more like a preference than a requirement.'; outcome = 'preference';
        action = alt || `Let “${must}” be desirable without making it the price of “${want}.”`;
        body = `You can prefer <strong>${escapeHtml(must)}</strong> and still choose to ${escapeHtml(want)} before it is perfect.`;
      } else {
        title = 'This looks like a permission rule.'; outcome = type === 'unsure' ? 'uncertain rule' : 'internal rule'; tone='warn';
        action = alt || 'Replace the all-or-nothing condition with a concrete threshold.';
        body = `Current rule: <strong>I shouldn’t ${escapeHtml(want)} until ${escapeHtml(must)}.</strong><br><br>${alt ? `More flexible version: <strong>${escapeHtml(alt)}</strong>` : 'Try: “I’ll do a reasonable amount, then I am allowed to stop.”'}`;
      }
      setRealityResult(title, body, tone, { title: 'Permission rule', summary: `“${want}” was being gated by “${must}.”`, action, context: 'Rule check', realityKind: 'rule', outcome });
    });
    return;
  }

  if (mode === 'review') {
    workspace.innerHTML = `<div class="reality-form-header"><p class="eyebrow">Productivity accounting</p><h2>Where did your day actually go?</h2><p>Unfinished is not the same as unproductive. But “I had no time” is not always true either.</p></div>
      <div class="reality-check-grid" id="rcDayActivities">
        ${['Worked / job responsibilities','Gym / exercise','School / studying','Household chores','Errands / appointments','Cooking / meals / hygiene','Relationship / family time','Intentional rest'].map(item => `<label><input type="checkbox" value="${item}"> ${item}</label>`).join('')}
      </div>
      <div class="reality-form-grid">
        <label>Roughly how much discretionary time did you have?<select class="select-field" id="rcFreeTime"><option value="0">Almost none</option><option value="1">Under 1 hour</option><option value="2">1–3 hours</option><option value="3">3+ hours</option></select></label>
        <label>What is making the day feel “unproductive”?<input class="text-field" id="rcUnfinished" placeholder="e.g. the house is still messy"></label>
      </div>
      <button class="primary-button" id="runDayReview">Review the evidence</button><div id="realityResult"></div>`;
    document.getElementById('runDayReview').addEventListener('click', () => {
      const checked = [...document.querySelectorAll('#rcDayActivities input:checked')].map(input => input.value);
      const free = +document.getElementById('rcFreeTime').value;
      const unfinished = document.getElementById('rcUnfinished').value.trim() || 'something remained unfinished';
      let title, body, action, outcome, tone;
      if (checked.length >= 3 && free <= 1) {
        outcome='full day'; tone='good'; title='This was a full day, even though something stayed unfinished.';
        action='Treat the unfinished item as a scheduling choice for another time, not a verdict on the whole day.';
        body = `You used meaningful capacity on <strong>${checked.map(escapeHtml).join(', ')}</strong> and had little discretionary time. “${escapeHtml(unfinished)}” is evidence of limited capacity—not proof that the day did not count.`;
      } else if (free >= 3 && checked.length <= 2) {
        outcome='possible avoidance'; tone='warn'; title='There may have been usable time you chose not to spend on it.';
        action='Own the tradeoff without turning it into an identity judgment. If it matters, make the next version smaller and concrete.';
        body = `“I had no time” probably is not the strongest explanation today. That does <strong>not</strong> mean “I am lazy”; it means the task lost the competition for your discretionary time.`;
      } else {
        outcome='mixed day'; tone='neutral'; title='The evidence is mixed.';
        action='Ask whether the unfinished task truly deserved to outrank how you actually used the remaining time.';
        body = `You did use capacity today, and you also had some discretionary time. Grade the tradeoff—not your entire character or the entire day.`;
      }
      setRealityResult(title, body, tone, { title: 'Productivity reality check', summary: `${checked.length} meaningful areas counted; ${unfinished} was still unfinished.`, action, context: 'Day review', realityKind: 'review', outcome });
    });
  }
}

function renderRecentEntries() {
  const el = document.getElementById('recentEntries');
  if (!el) return;
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
  const additions = Array.isArray(entry.additions) ? entry.additions : [];
  const latestAddition = additions[additions.length - 1];
  return `<article class="history-card">
    <div class="history-type">${historyIcon(entry.type)}</div>
    <div class="history-content"><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.summary || detail || 'Saved reflection')}</p>
      ${latestAddition ? `<div class="entry-addition"><strong>Added later</strong><span>${escapeHtml(latestAddition.text)}</span>${additions.length > 1 ? `<small>+ ${additions.length - 1} earlier addition${additions.length - 1 === 1 ? '' : 's'}</small>` : ''}</div>` : ''}
      <div class="history-meta"><span class="meta-chip">${typeLabel(entry.type)}</span>${entry.context ? `<span class="meta-chip">${escapeHtml(entry.context)}</span>` : ''}<span class="meta-chip">${escapeHtml(formatDate(entry.createdAt))}</span>${entry.updatedAt ? '<span class="meta-chip">Edited</span>' : ''}</div>
    </div>
    ${allowDelete ? `<div class="entry-actions"><button class="entry-action" data-add-note-id="${entry.id}" aria-label="Add to entry" title="Add to entry">＋</button><button class="entry-action" data-edit-id="${entry.id}" aria-label="Edit entry" title="Edit entry">✎</button><button class="delete-entry" data-delete-id="${entry.id}" aria-label="Delete entry" title="Delete entry">×</button></div>` : ''}
  </article>`;
}

function renderHistory() {
  const list = document.getElementById('historyList');
  const entries = app.historyFilter === 'all' ? app.data.entries : app.data.entries.filter(entry => entry.type === app.historyFilter);
  if (!entries.length) {
    list.innerHTML = '<div class="intro-card centered"><div class="large-symbol">☷</div><h2>No entries here yet</h2><p>Complete a guided tool and save the reflection. You can edit, add to, or delete entries later.</p></div>';
    return;
  }
  list.innerHTML = entries.map(entry => historyCardMarkup(entry)).join('');
  list.querySelectorAll('[data-delete-id]').forEach(button => button.addEventListener('click', () => deleteEntry(button.dataset.deleteId)));
  list.querySelectorAll('[data-edit-id]').forEach(button => button.addEventListener('click', () => openEntryEditor(button.dataset.editId, 'edit')));
  list.querySelectorAll('[data-add-note-id]').forEach(button => button.addEventListener('click', () => openEntryEditor(button.dataset.addNoteId, 'add')));
}

function openEntryEditor(id, mode = 'edit') {
  const entry = app.data.entries.find(item => item.id === id);
  if (!entry) return;
  app.session = { type: 'entry-editor', entryId: id, mode };
  document.getElementById('modalEyebrow').textContent = mode === 'add' ? 'Continue the reflection' : 'Update saved entry';
  document.getElementById('modalTitle').textContent = mode === 'add' ? 'Add to this entry' : 'Edit entry';
  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('modalBack').style.visibility = 'hidden';
  document.getElementById('toolModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  const body = document.getElementById('modalBody');
  const additions = Array.isArray(entry.additions) ? entry.additions : [];

  if (mode === 'add') {
    body.innerHTML = `<div class="question-count">${escapeHtml(typeLabel(entry.type))}</div>
      <h3 class="question-title">${escapeHtml(entry.title)}</h3>
      <p class="result-intro">Add a later thought, update, outcome, or something you understand differently now. The original entry stays intact.</p>
      ${additions.length ? `<div class="past-additions"><p class="field-label">Previous additions</p>${additions.map(item => `<div><span>${escapeHtml(item.text)}</span><small>${escapeHtml(formatDate(item.createdAt))}</small></div>`).join('')}</div>` : ''}
      <div class="field-group"><label class="field-label" for="entryAddition">What would you like to add?</label><textarea class="text-area" id="entryAddition" placeholder="A later realization, what happened next, or anything you want to remember…"></textarea></div>
      <div class="modal-actions"><button class="secondary-button" id="cancelEntryEdit">Cancel</button><button class="primary-button" id="saveEntryAddition">Add note</button></div>`;
    document.getElementById('cancelEntryEdit').addEventListener('click', closeModal);
    document.getElementById('saveEntryAddition').addEventListener('click', () => {
      const text = document.getElementById('entryAddition').value.trim();
      if (!text) { showToast('Write something to add first.'); return; }
      entry.additions = [...additions, { id: uid(), text, createdAt: new Date().toISOString() }];
      entry.updatedAt = new Date().toISOString();
      saveData(); closeModal(); renderAll(); showToast('Added to the entry.');
    });
    return;
  }

  body.innerHTML = `<div class="question-count">Correct a typo or revise the reflection</div>
    <div class="field-group"><label class="field-label" for="editEntryTitle">Title</label><input class="text-field" id="editEntryTitle" value="${escapeHtml(entry.title)}" /></div>
    <div class="field-group"><label class="field-label" for="editEntrySummary">What happened / main note</label><textarea class="text-area" id="editEntrySummary">${escapeHtml(entry.summary || '')}</textarea></div>
    <div class="field-group"><label class="field-label" for="editEntryAction">Small action or response</label><textarea class="text-area" id="editEntryAction">${escapeHtml(entry.action || '')}</textarea></div>
    ${entry.type === 'emotion' && Array.isArray(entry.support) && entry.support.length ? `<div class="support-box compact-support"><p class="eyebrow">Saved response ideas</p><ul>${entry.support.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>` : ''}
    <p class="gentle-note">Editing changes the original entry. Use “add to entry” when you want to preserve it and attach a later update.</p>
    <div class="modal-actions"><button class="secondary-button" id="cancelEntryEdit">Cancel</button><button class="primary-button" id="saveEntryEdit">Save changes</button></div>`;
  document.getElementById('cancelEntryEdit').addEventListener('click', closeModal);
  document.getElementById('saveEntryEdit').addEventListener('click', () => {
    const title = document.getElementById('editEntryTitle').value.trim();
    if (!title) { showToast('The entry needs a title.'); return; }
    entry.title = title;
    entry.summary = document.getElementById('editEntrySummary').value.trim();
    entry.action = document.getElementById('editEntryAction').value.trim();
    entry.updatedAt = new Date().toISOString();
    saveData(); closeModal(); renderAll(); showToast('Entry updated.');
  });
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

function renderInsights() { renderTrackerInsights(); }


const TRACKER_CHANGE_LABELS = {
  anxious: 'More anxious / worried', irritable: 'More irritable', overwhelmed: 'Easily overwhelmed', brainFog: 'Brain fog',
  reactive: 'More emotionally reactive', confident: 'More confident', patient: 'More patient', social: 'More social',
  affection: 'Wanted more affection / attention', interested: 'More interested in hobbies / projects',
  legacySensitive: 'Emotionally sensitive (Bearable)'
};
const TRACKER_FUNCTION_LABELS = { homework: 'Did homework', chores: 'Did chores', exercise: 'Exercised', homeworkHard: 'Homework hard to initiate', choresHard: 'Chores hard to initiate' };
const TRACKER_CONTEXT_LABELS = { poorSleep: 'Poor sleep', highStress: 'High stress', busy: 'Unusually busy', sick: 'Sick / unwell' };
const TRACKER_SYMPTOM_LABELS = { cramping: 'Cramping', bloating: 'Bloating', headache: 'Headache', breastTenderness: 'Breast tenderness', indigestion: 'GI / indigestion', bodyAches: 'Body aches' };

function localDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function dateFromKey(key) {
  const [y,m,d] = String(key).split('-').map(Number);
  return new Date(y || 2000, (m || 1) - 1, d || 1);
}
function trackerDayDefaults() {
  return { moodAnchor: null, moodCustomTouched: false, dayFlags: {}, scoreAdjustment: 0, motivation: 'typical', capacity: 'typical', changes: [], symptoms: {}, functioning: [], context: [], notes: '', customTouched: false, updatedAt: null };
}
function getTrackerDay(key, create = false) {
  app.data.trackerDays = app.data.trackerDays || {};
  const existing = app.data.trackerDays[key];
  if (existing) return existing;
  if (!create) return null;
  const day = trackerDayDefaults();
  app.data.trackerDays[key] = day;
  return day;
}
function normalizedTrackerDay(day) {
  return Object.assign(trackerDayDefaults(), day || {}, {
    dayFlags: Object.assign({}, day?.dayFlags || {}),
    changes: Array.isArray(day?.changes) ? day.changes : [],
    symptoms: Object.assign({}, day?.symptoms || {}),
    functioning: Array.isArray(day?.functioning) ? day.functioning : [],
    context: Array.isArray(day?.context) ? day.context : []
  });
}
function trackerHasMeaningfulData(day) {
  if (!day) return false;
  return Boolean(day.customTouched || day.importedBearable || (day.legacyMoodValues && day.legacyMoodValues.length));
}
function saveTrackerDay(day) {
  day.customTouched = true;
  day.updatedAt = new Date().toISOString();
  app.data.trackerDays[app.trackerDate] = day;
  saveData();
  const status = document.getElementById('trackerSaveStatus');
  if (status) { status.textContent = 'Saved just now'; clearTimeout(saveTrackerDay.timer); saveTrackerDay.timer = setTimeout(() => { if (status) status.textContent = 'Saved'; }, 1500); }
  renderTrackerHome(false);
  renderCalendar();
  renderTrackerInsights();
}
function calculateImportedMood(day) {
  const d = normalizedTrackerDay(day);
  // Bearable's old 1–10 mood number is deliberately ignored. We rebuild a conservative
  // emotional estimate from the change-from-baseline factors the user actually logged.
  // Motivation, functioning, context, sleep and physical symptoms stay separate dimensions.
  const weights = { anxious:-1, irritable:-1, overwhelmed:-1, reactive:-0.75, confident:1, patient:0.5, social:0.5, affection:0.5, interested:0.75 };
  const logged = d.changes.filter(key => Object.prototype.hasOwnProperty.call(weights, key));
  let delta = logged.reduce((sum,key) => sum + weights[key], 0);
  delta = Math.max(-2, Math.min(2, delta));
  const score = Math.max(1, Math.min(10, Math.round(5 + delta)));
  const parts = ['Rebuilt from Bearable factors; the old Bearable mood number is ignored'];
  if (logged.length) parts.push(`emotional changes logged: ${logged.map(k => TRACKER_CHANGE_LABELS[k] || k).join(', ')}`);
  else parts.push('no stronger emotional change was logged, so the day is treated as typical');
  if (d.changes.includes('legacySensitive')) parts.push('Bearable “emotionally sensitive” is preserved as ambiguous and does not raise or lower the score');
  return { score, parts, legacy: false, importedEstimate: true };
}
function calculateTrackerMood(day) {
  const d = normalizedTrackerDay(day);
  if (!d.moodCustomTouched && d.importedBearable) return calculateImportedMood(d);
  if (!d.moodAnchor) return { score: null, parts: ['Choose the closest emotional baseline when you are ready to summarize the day.'], legacy: false, importedEstimate: false };
  let score = d.moodAnchor === 'harder' ? 4 : d.moodAnchor === 'better' ? 7 : 5;
  const parts = [d.moodAnchor === 'harder' ? 'Harder-than-usual baseline' : d.moodAnchor === 'better' ? 'Better-than-usual baseline' : 'Typical / mixed baseline'];
  if (d.dayFlags.negativeDominated) { score -= 1; parts.push('negative feelings took up a lot of the day'); }
  if (d.dayFlags.positiveStoodOut) { score += 1; parts.push('positive feelings stood out'); }
  if (d.dayFlags.emotionsInterfered) { score -= 1; parts.push('emotions interfered with normal responsibilities'); }
  const negativeWeights = { anxious: -.75, irritable: -.75, overwhelmed: -.75, reactive: -.6 };
  const positiveWeights = { confident: .6, patient: .4, social: .4, affection: .3, interested: .5 };
  let neg = 0, pos = 0;
  d.changes.forEach(key => { if (negativeWeights[key]) neg += negativeWeights[key]; if (positiveWeights[key]) pos += positiveWeights[key]; });
  neg = Math.max(-1.25, neg); pos = Math.min(1, pos);
  score += neg + pos;
  if (neg < 0) parts.push('negative emotional signals were logged');
  if (pos > 0) parts.push('positive emotional signals were logged');
  const adj = Math.max(-1, Math.min(1, Number(d.scoreAdjustment) || 0));
  if (adj) { score += adj; parts.push(`you nudged the estimate ${adj > 0 ? 'up' : 'down'} one point`); }
  return { score: Math.max(1, Math.min(10, Math.round(score))), parts, legacy: false, importedEstimate: false };
}
function moodLabel(score) {
  if (score == null) return 'Not scored yet';
  if (score <= 2) return 'Very hard day';
  if (score <= 4) return 'Harder-than-usual day';
  if (score <= 6) return 'Typical / mixed day';
  if (score <= 8) return 'Good day';
  return 'Exceptionally good day';
}
function setButtonSelected(button, selected) { if (button) button.classList.toggle('selected', Boolean(selected)); }

function renderTrackerHome(preserveNotesFocus = true) {
  const dateInput = document.getElementById('trackerDate');
  if (!dateInput) return;
  dateInput.value = app.trackerDate;
  const dateObj = dateFromKey(app.trackerDate);
  const today = localDateKey(new Date());
  const heading = document.getElementById('trackerDateHeading');
  if (heading) heading.textContent = app.trackerDate === today ? 'Today' : new Intl.DateTimeFormat(undefined, { weekday:'long', month:'long', day:'numeric' }).format(dateObj);
  const actual = getTrackerDay(app.trackerDate, false);
  const day = normalizedTrackerDay(actual);
  const mood = calculateTrackerMood(actual || day);
  document.getElementById('trackerMoodScore').textContent = mood.score == null ? '—' : mood.score;
  document.getElementById('trackerDayLabel').textContent = moodLabel(mood.score);
  document.querySelectorAll('[data-mood-anchor]').forEach(btn => setButtonSelected(btn, !mood.importedEstimate && btn.dataset.moodAnchor === day.moodAnchor));
  document.querySelectorAll('[data-day-flag]').forEach(btn => setButtonSelected(btn, Boolean(day.dayFlags[btn.dataset.dayFlag])));
  document.querySelectorAll('[data-score-adjust]').forEach(btn => setButtonSelected(btn, Number(btn.dataset.scoreAdjust) === Number(day.scoreAdjustment || 0)));
  document.querySelectorAll('[data-choice-group]').forEach(group => {
    const key = group.dataset.choiceGroup;
    group.querySelectorAll('[data-choice-value]').forEach(btn => setButtonSelected(btn, day[key] === btn.dataset.choiceValue));
  });
  document.querySelectorAll('[data-track-toggle]').forEach(btn => {
    const bucket = btn.dataset.trackToggle;
    setButtonSelected(btn, Array.isArray(day[bucket]) && day[bucket].includes(btn.dataset.value));
  });
  document.querySelectorAll('[data-symptom]').forEach(btn => {
    const level = Number(day.symptoms[btn.dataset.symptom] || 0);
    btn.classList.toggle('present', level === 1);
    btn.classList.toggle('strong', level >= 2);
    const small = btn.querySelector('small');
    if (small) small.textContent = level >= 2 ? 'Unusually strong' : level === 1 ? 'Present' : 'Not logged';
    btn.setAttribute('aria-pressed', level ? 'true' : 'false');
  });
  const notes = document.getElementById('trackerNotes');
  if (notes && (!preserveNotesFocus || document.activeElement !== notes)) notes.value = day.notes || '';
  const expl = document.getElementById('trackerScoreExplanation');
  if (expl) expl.innerHTML = `<strong>${mood.importedEstimate ? 'Rebuilt from Bearable logs' : mood.score == null ? 'Score not set yet' : 'Why this estimate'}</strong><span>${escapeHtml(mood.parts.join(' · '))}</span>${mood.importedEstimate ? '<small>The original Bearable mood ratings are preserved in the import data but excluded from this score. Set an emotional baseline on this day if you want to replace the rebuilt estimate with a direct Inner Compass score.</small>' : ''}`;
  const summary = [];
  if (day.motivation !== 'typical') summary.push(`<span class="state-chip">Motivation ${day.motivation === 'high' ? '↑ high' : '↓ low'}</span>`);
  if (day.capacity !== 'typical') summary.push(`<span class="state-chip">Capacity ${day.capacity === 'high' ? '↑ high' : '↓ low'}</span>`);
  day.changes.slice(0,5).forEach(x => summary.push(`<span class="state-chip">${escapeHtml(TRACKER_CHANGE_LABELS[x] || x)}</span>`));
  const symptomCount = Object.values(day.symptoms).filter(Boolean).length;
  if (symptomCount) summary.push(`<span class="state-chip">${symptomCount} physical symptom${symptomCount===1?'':'s'}</span>`);
  if (day.importedBearable) summary.push('<span class="state-chip imported-chip">Bearable history</span>');
  document.getElementById('trackerStateSummary').innerHTML = summary.join('') || '<span class="gentle-note">Nothing unusual logged yet. Typical days are useful data too.</span>';
  const preview = document.getElementById('trackerPatternPreview');
  if (preview) preview.textContent = patternPreviewText();
}

function updateTrackerArray(bucket, value) {
  const day = normalizedTrackerDay(getTrackerDay(app.trackerDate, true));
  const set = new Set(day[bucket] || []);
  set.has(value) ? set.delete(value) : set.add(value);
  day[bucket] = [...set];
  saveTrackerDay(day);
}
function installTrackerHandlers() {
  const dateInput = document.getElementById('trackerDate');
  if (dateInput) dateInput.addEventListener('change', () => { if (!/^\d{4}-\d{2}-\d{2}$/.test(dateInput.value)) return; app.trackerDate = dateInput.value; renderTrackerHome(false); });
  document.querySelectorAll('[data-mood-anchor]').forEach(btn => btn.addEventListener('click', () => { const day=normalizedTrackerDay(getTrackerDay(app.trackerDate,true)); day.moodAnchor=btn.dataset.moodAnchor; day.moodCustomTouched=true; saveTrackerDay(day); }));
  document.querySelectorAll('[data-day-flag]').forEach(btn => btn.addEventListener('click', () => { const day=normalizedTrackerDay(getTrackerDay(app.trackerDate,true)); const k=btn.dataset.dayFlag; day.dayFlags[k]=!day.dayFlags[k]; day.moodCustomTouched=true; saveTrackerDay(day); }));
  document.querySelectorAll('[data-score-adjust]').forEach(btn => btn.addEventListener('click', () => { const day=normalizedTrackerDay(getTrackerDay(app.trackerDate,true)); day.scoreAdjustment=Number(btn.dataset.scoreAdjust); day.moodCustomTouched=true; saveTrackerDay(day); }));
  document.querySelectorAll('[data-choice-group] [data-choice-value]').forEach(btn => btn.addEventListener('click', () => { const group=btn.closest('[data-choice-group]').dataset.choiceGroup; const day=normalizedTrackerDay(getTrackerDay(app.trackerDate,true)); day[group]=btn.dataset.choiceValue; saveTrackerDay(day); }));
  document.querySelectorAll('[data-track-toggle]').forEach(btn => btn.addEventListener('click', () => updateTrackerArray(btn.dataset.trackToggle, btn.dataset.value)));
  document.querySelectorAll('[data-symptom]').forEach(btn => btn.addEventListener('click', () => { const day=normalizedTrackerDay(getTrackerDay(app.trackerDate,true)); const key=btn.dataset.symptom; const current=Number(day.symptoms[key]||0); day.symptoms[key]=current>=2?0:current+1; if (!day.symptoms[key]) delete day.symptoms[key]; saveTrackerDay(day); }));
  const notes=document.getElementById('trackerNotes');
  if (notes) notes.addEventListener('input', () => { clearTimeout(notes._saveTimer); notes._saveTimer=setTimeout(() => { const day=normalizedTrackerDay(getTrackerDay(app.trackerDate,true)); day.notes=notes.value.trim(); saveTrackerDay(day); }, 350); });
  const prev=document.getElementById('calendarPrev'), next=document.getElementById('calendarNext'), today=document.getElementById('calendarToday');
  if (prev) prev.addEventListener('click',()=>{app.calendarCursor=new Date(app.calendarCursor.getFullYear(),app.calendarCursor.getMonth()-1,1);renderCalendar();});
  if (next) next.addEventListener('click',()=>{app.calendarCursor=new Date(app.calendarCursor.getFullYear(),app.calendarCursor.getMonth()+1,1);renderCalendar();});
  if (today) today.addEventListener('click',()=>{const n=new Date();app.calendarCursor=new Date(n.getFullYear(),n.getMonth(),1);renderCalendar();});
  const cal=document.getElementById('trackerCalendar');
  if (cal) cal.addEventListener('click',e=>{const cell=e.target.closest('[data-calendar-date]'); if(!cell)return; app.trackerDate=cell.dataset.calendarDate; goToScreen('home'); renderTrackerHome(false);});
}

function renderCalendar() {
  const grid=document.getElementById('trackerCalendar'); if(!grid)return;
  const y=app.calendarCursor.getFullYear(), m=app.calendarCursor.getMonth();
  const title=document.getElementById('calendarTitle'); if(title)title.textContent=new Intl.DateTimeFormat(undefined,{month:'long',year:'numeric'}).format(app.calendarCursor);
  const first=new Date(y,m,1), daysInMonth=new Date(y,m+1,0).getDate();
  const cells=[]; for(let i=0;i<first.getDay();i++)cells.push('<div class="calendar-blank"></div>');
  const monthDays=[];
  for(let d=1;d<=daysInMonth;d++){
    const key=localDateKey(new Date(y,m,d)); const day=getTrackerDay(key,false); const has=trackerHasMeaningfulData(day); if(has)monthDays.push(day);
    const mood=has?calculateTrackerMood(day):null;
    const cls=mood&&mood.score!=null?(mood.score<=4?' mood-low':mood.score>=7?' mood-good':' mood-neutral'):'';
    const n=normalizedTrackerDay(day);
    const symptom=Object.values(n.symptoms||{}).some(Boolean);
    const markers=[];
    if(n.motivation==='high')markers.push('M↑'); else if(n.motivation==='low')markers.push('M↓');
    if(n.capacity==='high')markers.push('C↑'); else if(n.capacity==='low')markers.push('C↓');
    if(symptom)markers.push('●');
    const todayClass=key===localDateKey(new Date())?' today':'';
    cells.push(`<button type="button" class="calendar-day${cls}${todayClass}" data-calendar-date="${key}" aria-label="${key}${mood&&mood.score!=null?`, emotional score ${mood.score}`:''}"><span class="calendar-date-num">${d}</span>${mood&&mood.score!=null?`<strong>${mood.score}</strong>`:'<span class="no-score">—</span>'}<small>${markers.join(' ')}</small></button>`);
  }
  grid.innerHTML=cells.join('');
  const summary=document.getElementById('calendarSummary');
  if(summary){
    const scored=monthDays.filter(Boolean).map(calculateTrackerMood).filter(x=>x.score!=null);
    const avg=scored.length?(scored.reduce((a,b)=>a+Number(b.score),0)/scored.length).toFixed(1):'—';
    const highMot=monthDays.filter(x=>normalizedTrackerDay(x).motivation==='high').length;
    const lowCap=monthDays.filter(x=>normalizedTrackerDay(x).capacity==='low').length;
    const symptomDays=monthDays.filter(x=>Object.values(normalizedTrackerDay(x).symptoms).some(Boolean)).length;
    summary.innerHTML=[[monthDays.length,'days logged'],[avg,'average emotional score'],[highMot,'high-motivation days'],[lowCap,'low-capacity days'],[symptomDays,'days with physical symptoms']].map(([v,l])=>`<div class="stat-card"><span class="stat-value">${v}</span><span class="stat-label">${l}</span></div>`).join('');
  }
}

function daySignals(day) {
  const d=normalizedTrackerDay(day); const out=[];
  if(d.motivation==='high')out.push(['motivation-high','High motivation']); if(d.motivation==='low')out.push(['motivation-low','Low motivation']);
  if(d.capacity==='high')out.push(['capacity-high','Higher capacity']); if(d.capacity==='low')out.push(['capacity-low','Lower capacity']);
  d.changes.forEach(k=>out.push([`change-${k}`,TRACKER_CHANGE_LABELS[k]||k]));
  Object.entries(d.symptoms).filter(([,v])=>Number(v)>0).forEach(([k])=>out.push([`symptom-${k}`,TRACKER_SYMPTOM_LABELS[k]||k]));
  return out;
}
function findClusters(dateKeys, qualifies) {
  const dates=dateKeys.filter(k=>qualifies(getTrackerDay(k,false))).map(dateFromKey).sort((a,b)=>a-b); if(!dates.length)return[];
  const clusters=[[dates[0]]];
  for(let i=1;i<dates.length;i++){const gap=Math.round((dates[i]-dates[i-1])/86400000); if(gap<=2)clusters[clusters.length-1].push(dates[i]); else clusters.push([dates[i]]);}
  return clusters;
}
function median(values){if(!values.length)return null; const a=[...values].sort((x,y)=>x-y); const mid=Math.floor(a.length/2); return a.length%2?a[mid]:(a[mid-1]+a[mid])/2;}
function formatShortDate(date){return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(date);}
function analyzeClusterRhythm(clusters,label){
  const starts=clusters.map(c=>c[0]);
  const intervals=starts.slice(1).map((d,i)=>Math.round((d-starts[i])/86400000));
  if(starts.length<2) return {level:'none', label, text:`${label}: not enough separate clusters yet.`};
  const plausible=intervals.every(x=>x>=18&&x<=40);
  const spread=intervals.length ? Math.max(...intervals)-Math.min(...intervals) : Infinity;
  if(starts.length>=4 && plausible && spread<=7){
    const med=Math.round(median(intervals));
    const next=new Date(starts.at(-1)); next.setDate(next.getDate()+med);
    const window=Math.min(4,Math.max(2,Math.ceil(spread/2)+1));
    const from=new Date(next); from.setDate(from.getDate()-window);
    const to=new Date(next); to.setDate(to.getDate()+window);
    return {level:'possible', label, text:`${label} clusters have started about every ${med} days so far (${intervals.join(', ')}-day intervals). If that repeats, another similar window may begin around ${formatShortDate(from)}–${formatShortDate(to)}. This is a planning heads-up, not a cycle-phase diagnosis.`};
  }
  if(starts.length>=3 && plausible && spread<=10){
    return {level:'early', label, text:`${label}: ${starts.length} separate clusters have intervals of ${intervals.join(', ')} days. That is an early rhythm hint, but Inner Compass will not forecast from it yet.`};
  }
  return {level:'none', label, text:`${label}: ${starts.length} cluster${starts.length===1?'':'s'} logged, but the spacing is not consistent enough to forecast.`};
}
function rhythmAnalysis(days) {
  const keys=days.map(([k])=>k);
  const downClusters=findClusters(keys,day=>{const d=normalizedTrackerDay(day); let n=0; if(d.motivation==='low')n++; if(d.capacity==='low')n++; ['anxious','irritable','overwhelmed','reactive'].forEach(k=>{if(d.changes.includes(k))n++;}); return n>=2;});
  const upClusters=findClusters(keys,day=>{const d=normalizedTrackerDay(day); let n=0; if(d.motivation==='high')n++; if(d.capacity==='high')n++; ['confident','patient','social','affection','interested'].forEach(k=>{if(d.changes.includes(k))n++;}); return n>=2;});
  const physicalClusters=findClusters(keys,day=>Object.values(normalizedTrackerDay(day).symptoms).some(Boolean));
  const down=analyzeClusterRhythm(downClusters,'Down-state');
  const up=analyzeClusterRhythm(upClusters,'Up-state');
  const physical=analyzeClusterRhythm(physicalClusters,'Physical-symptom');
  const transitionGaps=[];
  downClusters.forEach(cluster=>{
    const end=cluster.at(-1);
    const next=upClusters.map(c=>c[0]).find(start=>start>end && Math.round((start-end)/86400000)<=10);
    if(next)transitionGaps.push(Math.round((next-end)/86400000));
  });
  let transition;
  if(transitionGaps.length>=2){
    const lo=Math.min(...transitionGaps), hi=Math.max(...transitionGaps);
    transition={level:'observed',label:'Down → up transition',text:`In ${transitionGaps.length} observed transitions, an up-state cluster began ${lo===hi?`${lo} day${lo===1?'':'s'}`:`${lo}–${hi} days`} after a down-state cluster ended. Keep watching whether that sequence repeats.`};
  }else if(transitionGaps.length===1){
    transition={level:'early',label:'Down → up transition',text:`One down-to-up transition has been observed so far (${transitionGaps[0]} day${transitionGaps[0]===1?'':'s'} apart). One example is not enough to call it a pattern.`};
  }else transition={level:'none',label:'Down → up transition',text:'No repeated down-to-up transition has been established yet.'};
  return {down,up,physical,transition,summaries:[down,up,physical,transition]};
}
function patternPreviewText(){
  const days=Object.entries(app.data.trackerDays||{}).filter(([,d])=>trackerHasMeaningfulData(d)).sort((a,b)=>a[0].localeCompare(b[0]));
  if(days.length<10)return `${days.length} day${days.length===1?'':'s'} logged so far. Keep collecting without trying to force a cycle phase.`;
  const rhythm=rhythmAnalysis(days);
  const forecast=rhythm.summaries.find(x=>x.level==='possible');
  if(forecast)return forecast.text;
  const early=rhythm.summaries.find(x=>x.level==='early'||x.level==='observed');
  return early ? early.text : 'No reliable repeating rhythm yet. That is useful information too; keep logging what actually stands out.';
}
function signalAssociations(days){
  const records=days.map(([,d])=>new Map(daySignals(d).map(([k,l])=>[k,l])));
  const labels=new Map(); records.forEach(m=>m.forEach((v,k)=>labels.set(k,v)));
  const keys=[...labels.keys()]; const n=records.length; const results=[];
  function metric(a,b){
    let aCount=0,bCount=0,both=0;
    records.forEach(m=>{const hasA=m.has(a),hasB=m.has(b); if(hasA)aCount++; if(hasB)bCount++; if(hasA&&hasB)both++;});
    const without=n-aCount, bWithout=bCount-both;
    if(aCount<4||without<4||both<2)return null;
    const withRate=both/aCount, withoutRate=bWithout/without;
    return {anchor:a,target:b,aCount,both,without,bWithout,withRate,withoutRate,diff:withRate-withoutRate};
  }
  for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++){
    const ab=metric(keys[i],keys[j]), ba=metric(keys[j],keys[i]);
    const best=[ab,ba].filter(Boolean).sort((x,y)=>Math.abs(y.diff)-Math.abs(x.diff))[0];
    if(best&&Math.abs(best.diff)>=0.15)results.push(best);
  }
  const seen=new Set();
  return results.sort((a,b)=>Math.abs(b.diff)-Math.abs(a.diff)||b.both-a.both).filter(r=>{const key=[r.anchor,r.target].sort().join('||');if(seen.has(key))return false;seen.add(key);return true;}).slice(0,6).map(r=>({...r,anchorLabel:labels.get(r.anchor),targetLabel:labels.get(r.target)}));
}
function renderTrackerInsights(){
  const empty=document.getElementById('insightsEmpty'), content=document.getElementById('insightsContent'); if(!empty||!content)return;
  const days=Object.entries(app.data.trackerDays||{}).filter(([,d])=>trackerHasMeaningfulData(d)).sort((a,b)=>a[0].localeCompare(b[0]));
  if(days.length<3){empty.classList.remove('hidden');content.classList.add('hidden');return;}
  empty.classList.add('hidden');content.classList.remove('hidden');
  const scored=days.map(([,d])=>calculateTrackerMood(d)).filter(x=>x.score!=null);
  const avg=scored.length?(scored.reduce((a,b)=>a+Number(b.score),0)/scored.length).toFixed(1):'—';
  const highMot=days.filter(([,d])=>normalizedTrackerDay(d).motivation==='high').length;
  const lowCap=days.filter(([,d])=>normalizedTrackerDay(d).capacity==='low').length;
  document.getElementById('statsRow').innerHTML=[[days.length,'days tracked'],[avg,'average emotional score'],[highMot,'high-motivation days'],[lowCap,'low-capacity days']].map(([v,l])=>`<div class="stat-card"><span class="stat-value">${v}</span><span class="stat-label">${l}</span></div>`).join('');
  const changeCounts={}; days.forEach(([,day])=>normalizedTrackerDay(day).changes.forEach(k=>changeCounts[k]=(changeCounts[k]||0)+1));
  const changes=Object.entries(changeCounts).sort((a,b)=>b[1]-a[1]).slice(0,7), max=changes[0]?.[1]||1;
  document.getElementById('emotionBars').innerHTML=changes.length?changes.map(([k,c])=>`<div class="bar-row"><span>${escapeHtml(TRACKER_CHANGE_LABELS[k]||k)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(10,c/max*100)}%"></div></div><strong>${c}</strong></div>`).join(''):'<p class="gentle-note">No repeated changes logged yet.</p>';
  const associations=signalAssociations(days);
  document.getElementById('needChips').innerHTML=associations.length?associations.map(a=>`<div class="association-card"><strong>On days with ${escapeHtml(a.anchorLabel)}…</strong><span>${escapeHtml(a.targetLabel)} also appeared ${a.both} of ${a.aCount} days (${Math.round(a.withRate*100)}%), versus ${a.bWithout} of ${a.without} days (${Math.round(a.withoutRate*100)}%) without it.</span></div>`).join('')+'<p class="gentle-note">These are descriptive associations, not causes. Small samples can change quickly as you log more days.</p>':'<p class="gentle-note">Not enough repeated observations yet for a useful comparison. Inner Compass waits until both the “with” and “without” groups have enough days.</p>';
  const rhythm=rhythmAnalysis(days); const patterns=[];
  rhythm.summaries.forEach(x=>patterns.push(`<strong>${escapeHtml(x.label)}</strong><br>${escapeHtml(x.text.replace(`${x.label}: `,''))}`));
  const highMotDays=days.filter(([,d])=>normalizedTrackerDay(d).motivation==='high' && calculateTrackerMood(d).score!=null);
  if(highMotDays.length>=4){const a=(highMotDays.reduce((sum,[,d])=>sum+Number(calculateTrackerMood(d).score),0)/highMotDays.length).toFixed(1);patterns.push(`<strong>Motivation stays separate from mood.</strong><br>Across ${highMotDays.length} high-motivation days, the average emotional score is ${a}/10. This describes co-occurrence only; high motivation is not scored as emotionally good or bad.`);}
  document.getElementById('patternCards').innerHTML=patterns.map(t=>`<div class="pattern-card">${t}</div>`).join('');
  const entries=app.data.entries||[]; const discoveries=entries.filter(e=>e.type==='discovery');
  document.getElementById('discoverySummary').innerHTML=entries.length?`<div class="discovery-mini"><strong>${entries.length} guided reflection${entries.length===1?'':'s'}</strong><span>${discoveries.length ? `${discoveries.length} are explicit self-discoveries. ` : ''}These stay separate from the daily tracker but can add context when you review a pattern with your counselor.</span></div>`:'<p class="gentle-note">No guided reflections saved yet. Use them only when they are useful; daily tracking is now the main part of Inner Compass.</p>';
}
function parseCsv(text){
  const rows=[]; let row=[], field='', quoted=false;
  for(let i=0;i<text.length;i++){const ch=text[i]; if(quoted){if(ch==='"'&&text[i+1]==='"'){field+='"';i++;}else if(ch==='"'){quoted=false;}else field+=ch;}else{if(ch==='"')quoted=true;else if(ch===','){row.push(field);field='';}else if(ch==='\n'){row.push(field.replace(/\r$/,''));rows.push(row);row=[];field='';}else field+=ch;}}
  if(field.length||row.length){row.push(field.replace(/\r$/,''));rows.push(row);} if(!rows.length)return[];
  const headers=rows.shift().map(x=>x.trim()); return rows.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]??'').trim()])));
}
function splitBearableDetails(text){return String(text||'').split('|').map(x=>x.trim()).filter(Boolean);}
function mapBearableChange(label){const s=label.toLowerCase(); if(s.includes('anxious'))return'anxious'; if(s.includes('irritable'))return'irritable'; if(s.includes('overwhelm'))return'overwhelmed'; if(s.includes('brain fog'))return'brainFog'; if(s.includes('confident'))return'confident'; if(s.includes('patient'))return'patient'; if(s.includes('social'))return'social'; if(s.includes('emotionally sensitive'))return'legacySensitive'; if(s.includes('affection')||s.includes('attention'))return'affection'; if(s.includes('hobbies')||s.includes('projects'))return'interested'; return null;}
function mapBearableFunction(label){const s=label.toLowerCase(); if(s.includes('did homework'))return'homework'; if(s.includes('did chores'))return'chores'; if(s.includes('exerc'))return'exercise'; if(s.includes('homework')&&s.includes('hard'))return'homeworkHard'; if(s.includes('chore')&&s.includes('hard'))return'choresHard'; return null;}
function mapBearableContext(label){const s=label.toLowerCase(); if(s.includes('poor sleep'))return'poorSleep'; if(s.includes('stress'))return'highStress'; if(s.includes('busy'))return'busy'; if(s.includes('sick')||s.includes('unwell'))return'sick'; return null;}
function mapBearableSymptom(label){const s=label.toLowerCase(); if(s.includes('cramp'))return'cramping'; if(s.includes('bloat'))return'bloating'; if(s.includes('headache'))return'headache'; if(s.includes('tender breast')||s.includes('breast tender'))return'breastTenderness'; if(s.includes('indigestion')||s.includes('gi '))return'indigestion'; if(s.includes('body ache'))return'bodyAches'; return null;}
function importBearableCsv(file){
  if(!file)return; const reader=new FileReader(); reader.onload=e=>{try{const rows=parseCsv(e.target.result); if(!rows.length||!('category' in rows[0])||!('date formatted' in rows[0]))throw new Error('Unexpected CSV');
    const grouped={}; rows.forEach(r=>{if(!r['date formatted']||r.category==='Health measurements')return;(grouped[r['date formatted']] ||= []).push(r);});
    let imported=0; const keys=[];
    Object.entries(grouped).forEach(([date,rs])=>{if(!rs.length)return; const existing=getTrackerDay(date,false); const day=normalizedTrackerDay(existing); const notes=[]; const moods=[]; const changes=new Set(day.changes), functioning=new Set(day.functioning), context=new Set(day.context); const symptoms={...day.symptoms}; let motivation=existing?.motivation||null;
      rs.forEach(r=>{const cat=(r.category||'').toLowerCase(), detail=r.detail||'', amount=r['rating/amount']||'';
        if(cat==='mood'){const n=Number(amount);if(Number.isFinite(n))moods.push(n);if(r.notes)notes.push(r.notes);}
        else if(cat==='symptom'){const key=mapBearableSymptom(detail);if(key){const severe=/severe/i.test(detail)||Number(amount)>=3; symptoms[key]=Math.max(Number(symptoms[key]||0),severe?2:1);}}
        else if(cat==='capacity'){splitBearableDetails(detail).forEach(x=>{const l=x.toLowerCase();if(l.includes('high motivation'))motivation='high';else if(l.includes('low motivation'))motivation='low';else {const c=mapBearableChange(x);if(c)changes.add(c);}});}
        else if(cat==='changes'){splitBearableDetails(detail).forEach(x=>{const c=mapBearableChange(x);if(c)changes.add(c);});}
        else if(cat==='functioning'){splitBearableDetails(detail).forEach(x=>{const c=mapBearableFunction(x);if(c)functioning.add(c);});}
        else if(cat==='context'){splitBearableDetails(detail).forEach(x=>{const c=mapBearableContext(x);if(c)context.add(c);});}
        else if(cat==='extra notes'&&r.notes)notes.push(r.notes);
        else if(cat==='sleep'){const match=amount.match(/^(\d+):(\d{2})$/);if(match)day.sleepHours=Number(match[1])+Number(match[2])/60;}
      });
      if(!rs.some(r=>r.category!=='Health measurements'))return;
      if(moods.length)day.legacyMoodValues=moods; day.importedBearable=true; day.changes=[...changes];day.functioning=[...functioning];day.context=[...context];day.symptoms=symptoms;if(motivation)day.motivation=motivation;
      const cleanNotes=[...new Set(notes.map(x=>x.trim()).filter(Boolean))]; if(cleanNotes.length){const existingNote=day.notes||''; const add=cleanNotes.filter(n=>!existingNote.includes(n)); day.notes=[existingNote,...add].filter(Boolean).join(existingNote&&add.length?'\n':'');}
      day.importedAt=new Date().toISOString(); app.data.trackerDays[date]=day; imported++; keys.push(date);
    });
    saveData(); if(keys.length){const latest=keys.sort().at(-1); const dt=dateFromKey(latest); app.calendarCursor=new Date(dt.getFullYear(),dt.getMonth(),1);}
    renderAll(); const status=document.getElementById('bearableImportStatus'); if(status)status.textContent=`Imported or merged ${imported} Bearable day${imported===1?'':'s'}. Health-metric-only dates were skipped.`; showToast(`Bearable history imported: ${imported} days.`);
  }catch(err){console.error(err);showToast('That does not look like a Bearable CSV export.');}}; reader.readAsText(file);
}

function renderAll() {
  renderTrackerHome();
  renderCalendar();
  renderRecentEntries();
  renderHistory();
  renderInsights();
}

function exportData() {
  const payload = { app: 'Inner Compass', exportedAt: new Date().toISOString(), version: APP_VERSION, entries: app.data.entries, trackerDays: app.data.trackerDays || {} };
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
      app.data = { version: APP_VERSION, entries: parsed.entries, trackerDays: parsed.trackerDays && typeof parsed.trackerDays === 'object' ? parsed.trackerDays : {} };
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
  if (!window.confirm('Delete every Inner Compass tracker day and reflection from this browser? This cannot be undone.')) return;
  app.data = { version: APP_VERSION, entries: [], trackerDays: {} };
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
  document.querySelectorAll('[data-reality-mode]').forEach(button => button.addEventListener('click', () => renderRealityMode(button.dataset.realityMode)));
  document.getElementById('quickCheckin').addEventListener('click', () => { app.trackerDate = localDateKey(new Date()); goToScreen('home'); renderTrackerHome(); });
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
  const bearableInput = document.getElementById('importBearable');
  if (bearableInput) bearableInput.addEventListener('change', event => importBearableCsv(event.target.files[0]));
  installTrackerHandlers();
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
