export interface MotivationalQuote {
  text: string;
  author: string;
  anime: string;
  category: 'perseverance' | 'strength' | 'dreams' | 'courage' | 'friendship' | 'growth';
}

export const motivationalQuotes: MotivationalQuote[] = [
  // Solo Leveling
  {
    text: "Since I have a weapon, I'm not afraid anymore! There's nothing to fear.",
    author: "Sung Jin-Woo",
    anime: "Solo Leveling",
    category: "courage"
  },
  {
    text: "I've stood on the precipice of death plenty of times before.",
    author: "Sung Jin-Woo", 
    anime: "Solo Leveling",
    category: "strength"
  },
  {
    text: "No matter how low-ranked the dungeon was, I was always fighting for my life.",
    author: "Sung Jin-Woo",
    anime: "Solo Leveling", 
    category: "perseverance"
  },
  {
    text: "The weak have no rights or choices. Their only fate is to be relentlessly crushed by the strong.",
    author: "Sung Jin-Woo",
    anime: "Solo Leveling",
    category: "strength"
  },
  {
    text: "I will become stronger. I will keep growing until no one can ignore me.",
    author: "Sung Jin-Woo",
    anime: "Solo Leveling",
    category: "growth"
  },

  // Naruto
  {
    text: "I'll never give up! That is my nindo, my ninja way!",
    author: "Naruto Uzumaki",
    anime: "Naruto",
    category: "perseverance"
  },
  {
    text: "Believe in yourself and there will come a day when others will have no choice but to believe with you.",
    author: "Naruto Uzumaki",
    anime: "Naruto",
    category: "dreams"
  },
  {
    text: "Those who break the rules are scum, but those who abandon their friends are worse than scum.",
    author: "Kakashi Hatake",
    anime: "Naruto",
    category: "friendship"
  },
  {
    text: "If you don't believe in yourself, your work will never be enough.",
    author: "Naruto Uzumaki",
    anime: "Naruto",
    category: "dreams"
  },
  {
    text: "A smile is the easiest way out of a difficult situation.",
    author: "Naruto Uzumaki",
    anime: "Naruto",
    category: "courage"
  },

  // Attack on Titan
  {
    text: "If you win, you live. If you lose, you die. If you don't fight, you can't win!",
    author: "Eren Yeager",
    anime: "Attack on Titan",
    category: "courage"
  },
  {
    text: "The world is merciless, and it's also very beautiful.",
    author: "Mikasa Ackerman",
    anime: "Attack on Titan",
    category: "strength"
  },
  {
    text: "It doesn't matter how hard the past was, you can always start over.",
    author: "Hange Zoe",
    anime: "Attack on Titan",
    category: "growth"
  },
  {
    text: "People who can't throw something important away can never hope to change anything.",
    author: "Armin Arlert",
    anime: "Attack on Titan",
    category: "growth"
  },

  // One Piece
  {
    text: "No matter how hard or impossible it is, never lose sight of your goal.",
    author: "Monkey D. Luffy",
    anime: "One Piece",
    category: "dreams"
  },
  {
    text: "If you don't take risks, you can't create a future!",
    author: "Monkey D. Luffy",
    anime: "One Piece",
    category: "courage"
  },
  {
    text: "It's just pathetic to give up on something before you even give it a shot.",
    author: "Roronoa Zoro",
    anime: "One Piece",
    category: "perseverance"
  },
  {
    text: "Being lonely is more painful than getting hurt.",
    author: "Monkey D. Luffy",
    anime: "One Piece",
    category: "friendship"
  },

  // Dragon Ball Z
  {
    text: "I am the hope of the universe. I am the answer to all living things that cry out for peace.",
    author: "Goku",
    anime: "Dragon Ball Z",
    category: "strength"
  },
  {
    text: "Power comes in response to a need, not a desire. You have to create that need.",
    author: "Goku",
    anime: "Dragon Ball Z",
    category: "growth"
  },
  {
    text: "I do not fear this new challenge, rather like a true warrior I will rise to meet it.",
    author: "Vegeta",
    anime: "Dragon Ball Z",
    category: "courage"
  },
  {
    text: "You can take control of my mind and my body, but there is one thing a Saiyan always keeps... his PRIDE!",
    author: "Vegeta",
    anime: "Dragon Ball Z",
    category: "strength"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Gohan",
    anime: "Dragon Ball Z",
    category: "perseverance"
  },

  // My Hero Academia
  {
    text: "If you feel yourself hitting up against your limit, remember for what cause you clench your fists!",
    author: "All Might",
    anime: "My Hero Academia",
    category: "perseverance"
  },
  {
    text: "A real hero always finds a way for justice to be served.",
    author: "All Might",
    anime: "My Hero Academia",
    category: "courage"
  },
  {
    text: "Whether you win or lose, you can always come out ahead by learning from the experience.",
    author: "All Might",
    anime: "My Hero Academia",
    category: "growth"
  },

  // Demon Slayer
  {
    text: "No matter how many people you may lose, you have no choice but to go on living.",
    author: "Tanjiro Kamado",
    anime: "Demon Slayer",
    category: "strength"
  },
  {
    text: "Feel the rage. The powerful, pure rage of not being able to forgive will become your unswerving drive to take action.",
    author: "Kyojuro Rengoku",
    anime: "Demon Slayer",
    category: "strength"
  },
  {
    text: "Life is like a beautiful flower. You admire it and are enthralled by it, but eventually it wilts and dies.",
    author: "Kyojuro Rengoku",
    anime: "Demon Slayer",
    category: "growth"
  },

  // Fullmetal Alchemist
  {
    text: "There's no such thing as a painless lesson, they just don't exist.",
    author: "Edward Elric",
    anime: "Fullmetal Alchemist",
    category: "growth"
  },
  {
    text: "A lesson without pain is meaningless. For you cannot gain anything without sacrificing something else in return.",
    author: "Edward Elric",
    anime: "Fullmetal Alchemist",
    category: "perseverance"
  },
  {
    text: "Mankind's greatest scientific discovery may be its ability to choose.",
    author: "Roy Mustang",
    anime: "Fullmetal Alchemist",
    category: "growth"
  },

  // Hunter x Hunter
  {
    text: "Being able to cry for his companion. I was correct that you are a true friend.",
    author: "Killua Zoldyck",
    anime: "Hunter x Hunter",
    category: "friendship"
  },
  {
    text: "You should enjoy the little detours to the fullest. Because that's where you'll find the things more important than what you want.",
    author: "Ging Freecss",
    anime: "Hunter x Hunter",
    category: "dreams"
  },

  // Jujutsu Kaisen
  {
    text: "Even if you are consumed by doubt, think of yourself as the protagonist.",
    author: "Satoru Gojo",
    anime: "Jujutsu Kaisen",
    category: "courage"
  },
  {
    text: "When you die, you're alone. But that's not the end. When the people around you die, that's when you truly become alone.",
    author: "Yuji Itadori",
    anime: "Jujutsu Kaisen",
    category: "friendship"
  },

  // Universal Motivational Themes
  {
    text: "Life is not a game of luck. If you wanna win, work hard.",
    author: "Sora",
    anime: "No Game No Life",
    category: "perseverance"
  },
  {
    text: "There's no shame in falling down! True shame is to not stand up again!",
    author: "Shintaro Midorima",
    anime: "Kuroko's Basketball",
    category: "courage"
  },
  {
    text: "Don't beg for things. Do it yourself, or else you won't get anything.",
    author: "Riza Hawkeye",
    anime: "Fullmetal Alchemist",
    category: "strength"
  },
  {
    text: "If you really want to be strong... Stop caring about what your surrounding thinks of you!",
    author: "Saitama",
    anime: "One Punch Man",
    category: "strength"
  },
  {
    text: "Knowing you're different is only the beginning. If you accept these differences you'll be able to get past them.",
    author: "Edward Elric",
    anime: "Fullmetal Alchemist",
    category: "growth"
  },
  {
    text: "When you hit the point of no return, that's the moment it truly becomes a journey.",
    author: "Hinata Shouyou",
    anime: "Haikyuu!!",
    category: "dreams"
  },
  {
    text: "If you don't share someone's pain, you can never understand them.",
    author: "Nagato",
    anime: "Naruto",
    category: "friendship"
  },
  {
    text: "We are all like fireworks: we climb, we shine and always go our separate ways.",
    author: "Tamaki Suoh",
    anime: "Ouran High School Host Club",
    category: "dreams"
  },
  {
    text: "The moment you think of giving up, think of the reason why you held on so long.",
    author: "Natsu Dragneel",
    anime: "Fairy Tail",
    category: "perseverance"
  },
  {
    text: "Fear is not evil. It tells you what weakness is. And once you know your weakness, you can become stronger as well as kinder.",
    author: "Gildarts Clive",
    anime: "Fairy Tail",
    category: "strength"
  },
  {
    text: "It's not the face that makes someone a monster, it's the choices they make with their lives.",
    author: "Naruto Uzumaki",
    anime: "Naruto",
    category: "growth"
  },
  {
    text: "Hard work is what makes your dreams come true.",
    author: "Rock Lee",
    anime: "Naruto",
    category: "perseverance"
  },
  {
    text: "The true measure of a shinobi is not how he lives but how he dies.",
    author: "Jiraiya",
    anime: "Naruto",
    category: "strength"
  },
  {
    text: "People's lives don't end when they die, it ends when they lose faith.",
    author: "Itachi Uchiha",
    anime: "Naruto",
    category: "dreams"
  },
  {
    text: "When people are protecting something truly special to them, they truly can become as strong as they can be.",
    author: "Haku",
    anime: "Naruto",
    category: "strength"
  },
  {
    text: "Even the mightiest of warriors experiences fear. But the true warrior fights despite his fear.",
    author: "Hokage",
    anime: "Naruto",
    category: "courage"
  },
  {
    text: "You and I have memories longer and deeper than the road that stretches out ahead.",
    author: "Kakashi Hatake",
    anime: "Naruto",
    category: "friendship"
  },
  {
    text: "It's not always possible to do what we want to do, but it's important to believe in something before you actually do it.",
    author: "Might Guy",
    anime: "Naruto",
    category: "dreams"
  },
  {
    text: "A person grows up when he's able to overcome hardships. Protection is important, but there are some things that a person must learn on his own.",
    author: "Jiraiya",
    anime: "Naruto",
    category: "growth"
  },
  {
    text: "In order to escape a road of solitude, one has to work hard, and forge a new path with their own power!",
    author: "Rock Lee",
    anime: "Naruto",
    category: "perseverance"
  }
];

export function getRandomQuote(): MotivationalQuote {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

export function getQuoteByCategory(category: MotivationalQuote['category']): MotivationalQuote {
  const categoryQuotes = motivationalQuotes.filter(quote => quote.category === category);
  return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
}

export function getDailyQuote(): MotivationalQuote {
  // Use date as seed for consistent daily quote that changes each day
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let hash = 0;
  
  // Create hash from date string
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Ensure positive index
  const index = Math.abs(hash) % motivationalQuotes.length;
  return motivationalQuotes[index];
}