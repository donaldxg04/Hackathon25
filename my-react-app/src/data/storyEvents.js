// Sequential story events based on player age
// Each event appears at a specific age and tells part of the story
export const storyEvents = [
  {
    id: 'year1_early',
    age: 25,
    month: 3, // March 2009
    title: 'Early Career Struggles',
    text: "It's been three months at your new job. The workload is intense, and you're still adjusting to the corporate culture. Your manager suggests you take on an extra project to 'prove yourself.' Do you accept the additional responsibility?",
    accept: { health: -3, stress: 8, happiness: -2 },
    decline: { health: 0, stress: -3, happiness: 2 }
  },
  {
    id: 'year1_mid',
    age: 25,
    month: 6, // June 2009
    title: 'The First Bonus',
    text: "You receive your first performance bonus: $2,000. It's not much, but it's something. Your friends suggest a weekend trip to celebrate. Do you spend it on the trip, or save it for your future?",
    accept: { health: 2, stress: -2, happiness: 5 },
    decline: { health: 0, stress: 0, happiness: 2 }
  },
  {
    id: 'year1_late',
    age: 25,
    month: 10, // October 2009
    title: 'The Roommate Situation',
    text: "Your roommate announces they're moving out. You can either find a new roommate to split costs, or live alone and pay full rent. Living alone would be quieter but more expensive. What do you choose?",
    accept: { health: 3, stress: -5, happiness: 4 },
    decline: { health: 0, stress: 3, happiness: -2 }
  },
  {
    id: 'year2_early',
    age: 26,
    month: 2, // February 2010
    title: 'The Promotion Opportunity',
    text: "A promotion opportunity opens up, but it requires relocating to a different city. The pay increase is modest, but the cost of living is lower. Your current life is comfortable but stagnant. Do you take the risk?",
    accept: { health: -2, stress: 10, happiness: -3 },
    decline: { health: 0, stress: -2, happiness: 1 }
  },
  {
    id: 'year2_mid',
    age: 26,
    month: 7, // July 2010
    title: 'The Old Car',
    text: "Your car breaks down again. The mechanic says it needs $3,000 in repairs, but the car is only worth $2,000. You could fix it, buy a used car for $8,000, or take public transportation and save. What's your decision?",
    accept: { health: -1, stress: 5, happiness: -3 },
    decline: { health: 0, stress: -2, happiness: 1 }
  },
  {
    id: 'year2_late',
    age: 26,
    month: 11, // November 2010
    title: 'Family Expectations',
    text: "Your parents call. They're planning a family vacation and want you to contribute $1,500. You've been saving for an emergency fund, but family is important. Do you contribute, or politely decline?",
    accept: { health: 1, stress: 3, happiness: 4 },
    decline: { health: 0, stress: -2, happiness: -3 }
  },
  {
    id: 'year3_early',
    age: 27,
    month: 4, // April 2011
    title: 'The Investment Pitch',
    text: "A college friend reaches out. They've started a small business and need investors. They're asking for $5,000. The business idea seems solid, but you're not sure about the risk. Do you invest?",
    accept: { health: 0, stress: 8, happiness: 2 },
    decline: { health: 0, stress: -2, happiness: 1 }
  },
  {
    id: 'year3_mid',
    age: 27,
    month: 8, // August 2011
    title: 'The Relationship Question',
    text: "You've been dating someone for a while. They want to move in together to save on rent. It would cut your housing costs in half, but it's a big step. Are you ready?",
    accept: { health: 2, stress: 5, happiness: 6 },
    decline: { health: 0, stress: -1, happiness: -2 }
  },
  {
    id: 'year3_late',
    age: 27,
    month: 12, // December 2011
    title: 'The Holiday Bonus',
    text: "Your company gives you a $3,000 holiday bonus. You've been eyeing a new laptop for work, but you also know you should build your emergency fund. How do you allocate it?",
    accept: { health: 1, stress: -2, happiness: 3 },
    decline: { health: 0, stress: -1, happiness: 2 }
  },
  {
    id: 'year4_early',
    age: 28,
    month: 3, // March 2012
    title: 'The Housing Market',
    text: "Housing prices have dropped significantly. A small condo that was $300,000 is now $220,000. You have enough saved for a down payment, but it would deplete most of your savings. Do you buy?",
    accept: { health: -1, stress: 12, happiness: 3 },
    decline: { health: 0, stress: -2, happiness: 0 }
  },
  {
    id: 'year4_mid',
    age: 28,
    month: 7, // July 2012
    title: 'The Career Crossroads',
    text: "A recruiter contacts you about a position at a startup. The base salary is lower, but there's equity potential. Your current job is stable but unexciting. Do you interview?",
    accept: { health: -1, stress: 6, happiness: 2 },
    decline: { health: 0, stress: -1, happiness: 0 }
  },
  {
    id: 'year4_late',
    age: 28,
    month: 11, // November 2012
    title: 'The Medical Emergency',
    text: "You need a minor medical procedure that costs $2,500. Your insurance covers 80%, but you still need to pay $500. You could put it on a credit card or dip into your emergency fund. What do you do?",
    accept: { health: 3, stress: 4, happiness: -1 },
    decline: { health: 1, stress: 6, happiness: -2 }
  },
  {
    id: 'year5_early',
    age: 29,
    month: 2, // February 2013
    title: 'The Wedding Invitation',
    text: "Your best friend is getting married across the country. The trip will cost $1,200 including flights, hotel, and a gift. You want to be there, but money is tight. Do you go?",
    accept: { health: 2, stress: 3, happiness: 8 },
    decline: { health: 0, stress: -1, happiness: -4 }
  },
  {
    id: 'year5_mid',
    age: 29,
    month: 6, // June 2013
    title: 'The Side Hustle',
    text: "A friend offers you a freelance project that would take 10 hours a week for 3 months. It pays $3,000 total, but you're already working 50 hours at your main job. Do you take it?",
    accept: { health: -3, stress: 10, happiness: 2 },
    decline: { health: 1, stress: -2, happiness: 1 }
  },
  {
    id: 'year5_late',
    age: 29,
    month: 10, // October 2013
    title: 'The Car Upgrade',
    text: "Your car is getting old and unreliable. A reliable used car costs $12,000. You could finance it with a $3,000 down payment, or keep fixing the old one. What's your move?",
    accept: { health: 1, stress: 5, happiness: 4 },
    decline: { health: -1, stress: 3, happiness: -2 }
  },
  {
    id: 'year6_early',
    age: 30,
    month: 1, // January 2014
    title: 'The Big Three-Oh',
    text: "You turn 30. You look at your life: stable job, some savings, but not where you thought you'd be. A career coach offers to help you plan your next steps for $1,500. Is it worth it?",
    accept: { health: 1, stress: 2, happiness: 3 },
    decline: { health: 0, stress: 0, happiness: 0 }
  },
  {
    id: 'year6_mid',
    age: 30,
    month: 5, // May 2014
    title: 'The Investment Opportunity',
    text: "Your friend's business is doing well. They offer you a chance to invest another $10,000 for a larger stake. You've seen some returns, but it's still risky. Do you double down?",
    accept: { health: 0, stress: 10, happiness: 3 },
    decline: { health: 0, stress: -2, happiness: 1 }
  },
  {
    id: 'year6_late',
    age: 30,
    month: 9, // September 2014
    title: 'The Family Request',
    text: "Your sibling needs help with a down payment for their first home. They're asking to borrow $15,000. You have it, but it's most of your emergency fund. Do you help?",
    accept: { health: 1, stress: 8, happiness: 5 },
    decline: { health: 0, stress: -2, happiness: -3 }
  },
  {
    id: 'year7_early',
    age: 31,
    month: 3, // March 2015
    title: 'The Market Correction',
    text: "The stock market drops 15%. Your portfolio takes a hit. Some say it's a buying opportunity, others say wait. Your financial advisor suggests staying the course. What do you do?",
    accept: { health: 0, stress: 5, happiness: -2 },
    decline: { health: 0, stress: 8, happiness: -3 }
  },
  {
    id: 'year7_mid',
    age: 31,
    month: 7, // July 2015
    title: 'The Job Offer',
    text: "You get a job offer from a competitor. It's a 20% salary increase, but you'd lose your current benefits and seniority. Your current company offers a 10% raise to stay. Which do you choose?",
    accept: { health: -1, stress: 8, happiness: 4 },
    decline: { health: 1, stress: -2, happiness: 2 }
  },
  {
    id: 'year7_late',
    age: 31,
    month: 11, // November 2015
    title: 'The Home Improvement',
    text: "Your place needs major repairs: new roof, updated electrical. It'll cost $18,000. You could take out a home equity loan, use savings, or delay. What's your decision?",
    accept: { health: 2, stress: 6, happiness: 3 },
    decline: { health: -1, stress: 3, happiness: -1 }
  },
  {
    id: 'year8_early',
    age: 32,
    month: 2, // February 2016
    title: 'The Education Question',
    text: "You're considering an MBA to advance your career. It costs $60,000, but your company will cover 50% if you stay for 3 years. Do you pursue it?",
    accept: { health: -2, stress: 12, happiness: 2 },
    decline: { health: 0, stress: -1, happiness: 0 }
  },
  {
    id: 'year8_mid',
    age: 32,
    month: 6, // June 2016
    title: 'The Vacation Decision',
    text: "You haven't taken a real vacation in years. A two-week trip to Europe costs $4,000. You can afford it, but it feels extravagant. Do you go?",
    accept: { health: 4, stress: -5, happiness: 8 },
    decline: { health: 0, stress: 0, happiness: -1 }
  },
  {
    id: 'year8_late',
    age: 32,
    month: 10, // October 2016
    title: 'The Investment Windfall',
    text: "Your friend's business is acquired. Your $15,000 investment is now worth $45,000. You could cash out, reinvest, or diversify. What's your strategy?",
    accept: { health: 2, stress: -3, happiness: 6 },
    decline: { health: 1, stress: 2, happiness: 4 }
  },
  {
    id: 'year9_early',
    age: 33,
    month: 4, // April 2017
    title: 'The Life Change',
    text: "You're at a crossroads. You could start your own consulting business, but it means leaving a stable $80,000 salary for uncertainty. Your savings could support you for a year. Do you take the leap?",
    accept: { health: -2, stress: 15, happiness: 5 },
    decline: { health: 1, stress: -2, happiness: 1 }
  },
  {
    id: 'year9_mid',
    age: 33,
    month: 8, // August 2017
    title: 'The Real Estate Opportunity',
    text: "A rental property becomes available. It's $180,000 and would generate $1,200/month rent. You'd need a $36,000 down payment. Do you become a landlord?",
    accept: { health: 0, stress: 8, happiness: 3 },
    decline: { health: 0, stress: -1, happiness: 0 }
  },
  {
    id: 'year9_late',
    age: 33,
    month: 12, // December 2017
    title: 'The Year-End Reflection',
    text: "As the year ends, you reflect on your financial journey. You've made progress, but there's still work to do. A financial planner offers a comprehensive review for $2,000. Is it worth the investment?",
    accept: { health: 1, stress: -1, happiness: 2 },
    decline: { health: 0, stress: 0, happiness: 0 }
  },
  {
    id: 'year10_early',
    age: 34,
    month: 3, // March 2018
    title: 'The Inheritance',
    text: "A distant relative passes away, leaving you $25,000. It's unexpected and bittersweet. How do you honor their memory while being financially responsible?",
    accept: { health: 2, stress: -4, happiness: 5 },
    decline: { health: 1, stress: -2, happiness: 3 }
  },
  {
    id: 'year10_mid',
    age: 34,
    month: 7, // July 2018
    title: 'The Market Highs',
    text: "The stock market is at all-time highs. Your portfolio has grown significantly. Some say take profits, others say let it ride. What's your move?",
    accept: { health: 1, stress: -2, happiness: 4 },
    decline: { health: 0, stress: 3, happiness: 2 }
  },
  {
    id: 'year10_late',
    age: 34,
    month: 11, // November 2018
    title: 'The Retirement Question',
    text: "You're 34 and thinking about retirement. Your 401k is growing, but you wonder if you're saving enough. A retirement planning seminar costs $500. Do you attend?",
    accept: { health: 1, stress: -1, happiness: 2 },
    decline: { health: 0, stress: 0, happiness: 0 }
  }
];

// Get the next story event based on current age and month
export const getNextStoryEvent = (currentAge, currentMonth, completedEventIds) => {
  // Find the first event that matches the age and month and hasn't been completed
  return storyEvents.find(event => 
    event.age === currentAge &&
    event.month === currentMonth &&
    !completedEventIds.includes(event.id)
  );
};

// Get all events for a specific age
export const getEventsForAge = (age) => {
  return storyEvents.filter(event => event.age === age);
};

