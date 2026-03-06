export const MOOD_MEMES = [
  { id: 'm1',  emoji: '😭',  text: "When Monday hits different", mood: 'sadness',    bg: 'from-blue-900 to-blue-700' },
  { id: 'm2',  emoji: '🤡',  text: "Me pretending I'm fine",    mood: 'sadness',    bg: 'from-indigo-900 to-indigo-700' },
  { id: 'm3',  emoji: '😤',  text: "Don't talk to me rn",       mood: 'anger',      bg: 'from-red-900 to-red-700' },
  { id: 'm4',  emoji: '🔥',  text: "When you're on fire today", mood: 'excitement', bg: 'from-orange-900 to-orange-600' },
  { id: 'm5',  emoji: '💀',  text: "I'm literally dead",        mood: 'tired',      bg: 'from-gray-900 to-gray-700' },
  { id: 'm6',  emoji: '🥳',  text: "YAAAAS",                    mood: 'happiness',  bg: 'from-yellow-800 to-amber-600' },
  { id: 'm7',  emoji: '😴',  text: "5 more minutes...",          mood: 'tired',      bg: 'from-slate-900 to-slate-700' },
  { id: 'm8',  emoji: '🫠',  text: "This is fine",              mood: 'anxiety',    bg: 'from-purple-900 to-purple-700' },
  { id: 'm9',  emoji: '✨',  text: "Main character energy",     mood: 'excitement', bg: 'from-pink-900 to-pink-600' },
  { id: 'm10', emoji: '🧘',  text: "Inner peace achieved",      mood: 'calm',       bg: 'from-green-900 to-green-700' },
  { id: 'm11', emoji: '😅',  text: "Nervous but make it cute",  mood: 'anxiety',    bg: 'from-violet-900 to-violet-700' },
  { id: 'm12', emoji: '🌈',  text: "Good vibes only",           mood: 'hopeful',    bg: 'from-cyan-900 to-teal-600' },
  { id: 'm13', emoji: '💅',  text: "Unbothered. Moisturized.",  mood: 'calm',       bg: 'from-emerald-900 to-emerald-700' },
  { id: 'm14', emoji: '😩',  text: "Why is everything so hard", mood: 'sadness',    bg: 'from-blue-950 to-blue-800' },
  { id: 'm15', emoji: '⚡',  text: "LET'S GOOOOO",              mood: 'excitement', bg: 'from-amber-900 to-yellow-600' },
  { id: 'm16', emoji: '🥺',  text: "Need a hug rn",             mood: 'sadness',    bg: 'from-rose-900 to-rose-700' },
  { id: 'm17', emoji: '😈',  text: "Chaotic energy activated",  mood: 'anger',      bg: 'from-red-950 to-red-800' },
  { id: 'm18', emoji: '🌸',  text: "Everything will be okay",   mood: 'hopeful',    bg: 'from-pink-900 to-pink-700' },
  { id: 'm19', emoji: '☕',  text: "But first, coffee",          mood: 'tired',      bg: 'from-stone-900 to-stone-700' },
  { id: 'm20', emoji: '🎉',  text: "Serotonin boost unlocked",  mood: 'happiness',  bg: 'from-fuchsia-900 to-fuchsia-600' },
];

export const parseMeme = (content) => {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
};
