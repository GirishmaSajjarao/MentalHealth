import { RiskAssessment, RiskLevel, Message } from '../types/chat';

// Expanded dictionary with categories and tones
const DICTIONARY = {
  high: [
    { word: 'suicide', tone: 'desperate' },
    { word: 'kill myself', tone: 'desperate' },
    { word: 'die', tone: 'hopeless' },
    { word: 'death', tone: 'hopeless' },
    { word: 'end it', tone: 'resigned' },
    { word: 'hurt myself', tone: 'self-destructive' },
    { word: 'overdose', tone: 'dangerous' },
    { word: 'hopeless', tone: 'despairing' },
    { word: 'no way out', tone: 'trapped' },
    { word: 'goodbye', tone: 'final' }
  ],
  medium: [
    { word: 'sad', tone: 'sorrowful' },
    { word: 'anxious', tone: 'worried' },
    { word: 'depressed', tone: 'low' },
    { word: 'lonely', tone: 'isolated' },
    { word: 'stress', tone: 'overwhelmed' },
    { word: 'tired', tone: 'exhausted' },
    { word: 'crying', tone: 'emotional' },
    { word: 'pain', tone: 'hurting' },
    { word: 'struggle', tone: 'challenged' },
    { word: 'worry', tone: 'anxious' },
    { word: 'scared', tone: 'fearful' },
    { word: 'angry', tone: 'frustrated' },
    { word: 'empty', tone: 'numb' },
    { word: 'drained', tone: 'exhausted' }
  ],
  low: [
    { word: 'happy', tone: 'positive' },
    { word: 'good', tone: 'content' },
    { word: 'okay', tone: 'stable' },
    { word: 'fine', tone: 'neutral' },
    { word: 'better', tone: 'improving' },
    { word: 'thanks', tone: 'grateful' },
    { word: 'hello', tone: 'friendly' },
    { word: 'hi', tone: 'friendly' },
    { word: 'help', tone: 'seeking' }
  ]
};

// Helper to pick a random template
const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const analyzeRisk = (text: string, history: Message[] = []): RiskAssessment => {
  const lowerText = text.toLowerCase();
  
  // Find matches
  const highMatches = DICTIONARY.high.filter(item => lowerText.includes(item.word));
  const mediumMatches = DICTIONARY.medium.filter(item => lowerText.includes(item.word));
  const lowMatches = DICTIONARY.low.filter(item => lowerText.includes(item.word));

  // Determine Level
  let level: RiskLevel = 'Low';
  let matches = lowMatches;
  let tone = 'Neutral';

  if (highMatches.length > 0) {
    level = 'High';
    matches = highMatches;
    tone = highMatches[0].tone;
  } else if (mediumMatches.length > 0) {
    level = 'Medium';
    matches = mediumMatches;
    tone = mediumMatches[0].tone;
  } else if (lowMatches.length > 0) {
    level = 'Low';
    matches = lowMatches;
    tone = lowMatches[0].tone;
  }

  // Extract specific words found
  const wordsFound = matches.map(m => m.word);
  const uniqueWords = Array.from(new Set(wordsFound));
  const wordList = uniqueWords.join('", "');

  // Analyze History Context
  const previousBotMsg = history.filter(m => m.role === 'bot').pop();
  const previousUserMsg = history.filter(m => m.role === 'user').pop();
  const isFollowUp = history.length > 2;
  const previousRisk = previousBotMsg?.riskAssessment?.level;

  // Generate Explanation
  let explanation = "";
  
  if (level === 'High') {
    explanation = pick([
      `Your use of the words "${wordList}" is very concerning and indicates you may be in immediate danger.`,
      `I am detecting severe distress signals in your message, specifically when you mentioned "${wordList}".`,
      `The phrases "${wordList}" suggest a critical level of hopelessness or intent to harm.`
    ]);
  } else if (level === 'Medium') {
    if (isFollowUp && previousRisk === 'Medium') {
      explanation = pick([
        `It seems these feelings of being ${tone} are persisting, especially as you mentioned "${wordList}" again.`,
        `I understand that you are still struggling with ${tone} emotions ("${wordList}"). It's heavy to carry this.`,
        `Continuing from what we shared, your mention of "${wordList}" shows this ${tone} feeling is still present.`
      ]);
    } else {
      explanation = pick([
        `I noticed you used words like "${wordList}", which suggests you are feeling ${tone}.`,
        `Your message contains emotional cues such as "${wordList}", indicating a struggle with ${tone} feelings.`,
        `It sounds like you are dealing with ${tone} emotions, as you mentioned "${wordList}".`
      ]);
    }
  } else {
    // Low Risk
    if (uniqueWords.length === 0) {
       explanation = "I didn't detect specific emotional keywords, but I'm listening to your story.";
    } else {
      explanation = pick([
        `Your message uses positive or neutral language like "${wordList}".`,
        `I detected a ${tone} tone in your words "${wordList}".`,
        `You seem to be doing ${tone}, based on your use of "${wordList}".`
      ]);
    }
  }

  // Generate Support Response
  let supportResponse = "";
  if (level === 'High') {
    supportResponse = pick([
      `Please, your life matters. I strongly urge you to contact emergency services or a crisis line immediately.`,
      `I cannot provide the help you need right now, but there are people who can. Please call 988 or go to the nearest hospital.`,
      `You are not alone in this darkness. Please reach out to a professional or trusted friend right now.`
    ]);
  } else if (level === 'Medium') {
    if (isFollowUp && previousRisk === 'Medium') {
      supportResponse = pick([
        `Since this feeling is lingering, have you been able to take a small break or drink some water?`,
        `It's okay that it's not better yet. Healing takes time. I'm here to keep listening.`,
        `Let's take it one step at a time. What is one small thing you could do for yourself right now?`
      ]);
    } else {
      supportResponse = pick([
        `It's completely valid to feel ${tone}. Have you considered talking to a friend or taking a gentle walk?`,
        `Dealing with ${tone} feelings is hard. Be kind to yourself today. Small steps can help.`,
        `I hear your pain. Sometimes just expressing these feelings is a start. You are strong for sharing this.`
      ]);
    }
  } else {
    supportResponse = pick([
      `I'm glad to hear that. Keeping a gratitude journal or just breathing deeply can help maintain this balance.`,
      `That's good to hear. Remember to take time for yourself even when things are going well.`,
      `I'm here if you need to talk more. Enjoy your day!`
    ]);
  }

  return {
    level,
    explanation,
    emotionalTone: tone.charAt(0).toUpperCase() + tone.slice(1),
    supportResponse,
    crisis: level === 'High'
  };
};
