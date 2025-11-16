// Random events that occur after decisions
// Good events happen when stress is low and happiness is high
// Bad events happen when stress is high and happiness is low

export const goodEvents = [
  {
    id: 'good_1',
    title: 'Unexpected Windfall',
    text: "You find an old gift card in your wallet worth $200. It's still valid! You decide to treat yourself to something nice.",
    effects: { health: 2, stress: -3, happiness: 5 }
  },
  {
    id: 'good_2',
    title: 'A Good Day',
    text: "Everything seems to go right today. Your commute is smooth, work is productive, and you feel energized. Sometimes the little things make all the difference.",
    effects: { health: 1, stress: -2, happiness: 3 }
  },
  {
    id: 'good_3',
    title: 'Friend Reaches Out',
    text: "An old friend calls out of the blue. You catch up and they invite you to a small gathering this weekend. It feels good to reconnect.",
    effects: { health: 1, stress: -2, happiness: 4 }
  },
  {
    id: 'good_4',
    title: 'Small Win at Work',
    text: "Your manager recognizes your recent work in a team meeting. It's a small gesture, but it makes you feel valued and appreciated.",
    effects: { health: 0, stress: -3, happiness: 4 }
  },
  {
    id: 'good_5',
    title: 'Perfect Weather',
    text: "The weather is beautiful today. You take a long walk during lunch and feel refreshed. Sometimes nature is the best medicine.",
    effects: { health: 2, stress: -2, happiness: 3 }
  },
  {
    id: 'good_6',
    title: 'Unexpected Discount',
    text: "You discover a sale at your favorite store. You find something you've been wanting for 50% off. A small victory!",
    effects: { health: 0, stress: -1, happiness: 3 }
  },
  {
    id: 'good_7',
    title: 'Neighborly Kindness',
    text: "Your neighbor offers you some fresh vegetables from their garden. It's a small act of kindness that brightens your day.",
    effects: { health: 1, stress: -1, happiness: 2 }
  },
  {
    id: 'good_8',
    title: 'Productive Morning',
    text: "You wake up early feeling refreshed and get a lot done before work. Starting the day right sets a positive tone.",
    effects: { health: 1, stress: -2, happiness: 3 }
  },
  {
    id: 'good_9',
    title: 'Compliment from Stranger',
    text: "Someone compliments your work or appearance. It's unexpected and makes you smile. Small moments of connection matter.",
    effects: { health: 0, stress: -1, happiness: 2 }
  },
  {
    id: 'good_10',
    title: 'Found Money',
    text: "You find $50 in an old jacket pocket. It's not much, but finding unexpected money always feels like a small win.",
    effects: { health: 0, stress: -1, happiness: 2 }
  }
];

export const badEvents = [
  {
    id: 'bad_1',
    title: 'Unexpected Expense',
    text: "Your car needs an unexpected repair. The mechanic says it'll cost $400. These surprise expenses always come at the worst time.",
    effects: { health: -1, stress: 5, happiness: -3 }
  },
  {
    id: 'bad_2',
    title: 'Rough Day',
    text: "Nothing seems to go right today. You spill coffee on your shirt, miss your bus, and feel like you're running behind all day.",
    effects: { health: -1, stress: 4, happiness: -2 }
  },
  {
    id: 'bad_3',
    title: 'Sick Day',
    text: "You wake up feeling under the weather. Nothing serious, but you're not at 100%. You push through, but it takes a toll.",
    effects: { health: -3, stress: 2, happiness: -2 }
  },
  {
    id: 'bad_4',
    title: 'Work Stress',
    text: "A project deadline gets moved up unexpectedly. You'll need to work extra hours this week. The pressure is mounting.",
    effects: { health: -1, stress: 6, happiness: -3 }
  },
  {
    id: 'bad_5',
    title: 'Bad News',
    text: "You receive some disappointing news. It's not catastrophic, but it weighs on your mind and affects your mood.",
    effects: { health: -1, stress: 4, happiness: -4 }
  },
  {
    id: 'bad_6',
    title: 'Traffic Nightmare',
    text: "You get stuck in terrible traffic. What should be a 20-minute commute turns into an hour. You arrive late and frustrated.",
    effects: { health: 0, stress: 4, happiness: -2 }
  },
  {
    id: 'bad_7',
    title: 'Minor Accident',
    text: "You accidentally break something valuable. It's replaceable, but the cost and hassle add stress to your day.",
    effects: { health: 0, stress: 3, happiness: -2 }
  },
  {
    id: 'bad_8',
    title: 'Sleep Deprived',
    text: "You had trouble sleeping last night. You're tired and irritable today, making everything feel harder than it should.",
    effects: { health: -2, stress: 3, happiness: -2 }
  },
  {
    id: 'bad_9',
    title: 'Miscommunication',
    text: "There's a misunderstanding at work that causes extra work. You have to fix someone else's mistake, adding to your workload.",
    effects: { health: 0, stress: 5, happiness: -2 }
  },
  {
    id: 'bad_10',
    title: 'Financial Worry',
    text: "You notice your expenses are higher than expected this month. Money is tight, and it's causing you anxiety.",
    effects: { health: -1, stress: 5, happiness: -3 }
  }
];

// Determine if event should be good or bad based on stats
export const getRandomEvent = (stress, happiness) => {
  // Good event: stress < 40 and happiness > 60
  // Bad event: stress > 60 and happiness < 40
  // Neutral/random if in between
  
  const isGoodCondition = stress < 40 && happiness > 60;
  const isBadCondition = stress > 60 && happiness < 40;
  
  if (isGoodCondition) {
    // Good event
    const events = goodEvents;
    return events[Math.floor(Math.random() * events.length)];
  } else if (isBadCondition) {
    // Bad event
    const events = badEvents;
    return events[Math.floor(Math.random() * events.length)];
  } else {
    // Random - slightly weighted toward bad if stress is higher, good if happiness is higher
    if (happiness > stress) {
      const events = goodEvents;
      return events[Math.floor(Math.random() * events.length)];
    } else {
      const events = badEvents;
      return events[Math.floor(Math.random() * events.length)];
    }
  }
};

