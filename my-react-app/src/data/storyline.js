// Scripted storyline events for the game (2009-2019)
// Each event occurs on a specific date and applies predetermined state changes
// Even when choices are presented, the outcome is always hardcoded to the specified state changes

export const storylineEvents = [
  // 2009
  {
    date: new Date(2009, 0, 20), // Jan 20, 2009
    title: "Emergency Fund",
    description: "Financial experts recommend having 3-6 months of expenses in an emergency fund. Would you like to start one by moving $500 from your checking account?",
    hasChoice: true,
    choices: {
      accept: "Yes, start emergency fund",
      decline: "No, keep it in checking"
    },
    stateChanges: {
      checking: -500,
      emergencyFund: 500
    }
  },
  {
    date: new Date(2009, 2, 3), // Mar 3, 2009
    title: "Laptop Dies",
    description: "Your laptop suddenly died and you need a new one for work. The replacement costs $900.",
    hasChoice: false,
    stateChanges: {
      checking: -900,
      stress: 10
    }
  },
  {
    date: new Date(2009, 3, 15), // Apr 15, 2009
    title: "Tax Refund Arrives",
    description: "Great news! Your tax refund of $600 just hit your checking account.",
    hasChoice: false,
    stateChanges: {
      checking: 600,
      happiness: 5
    }
  },
  {
    date: new Date(2009, 5, 1), // Jun 1, 2009
    title: "First Raise",
    description: "Your manager is impressed with your work! You've earned a 3% raise.",
    hasChoice: false,
    stateChanges: {
      salaryPercent: 3 // 3% increase
    }
  },
  {
    date: new Date(2009, 6, 22), // Jul 22, 2009
    title: "Gym Membership Offer",
    description: "A gym near your apartment is offering memberships for $45/month. Join to improve your health?",
    hasChoice: true,
    choices: {
      accept: "Yes, join the gym",
      decline: "No, I'll exercise at home"
    },
    stateChanges: {
      checking: -45,
      health: 5
    }
  },
  {
    date: new Date(2009, 8, 10), // Sep 10, 2009
    title: "Car Repair",
    description: "Your check engine light came on. The mechanic says it needs $320 in repairs.",
    hasChoice: false,
    stateChanges: {
      emergencyFund: -320,
      stress: 5
    }
  },
  {
    date: new Date(2009, 10, 18), // Nov 18, 2009
    title: "Holiday Travel",
    description: "Thanksgiving is coming up. Would you like to visit family? Flights and expenses will cost about $250.",
    hasChoice: true,
    choices: {
      accept: "Yes, visit family",
      decline: "No, stay home"
    },
    stateChanges: {
      checking: -250,
      happiness: 10,
      stress: -5
    }
  },

  // 2010
  {
    date: new Date(2010, 0, 4), // Jan 4, 2010
    title: "New Year Checkup",
    description: "You schedule your annual health checkup. Co-pay is $120.",
    hasChoice: false,
    stateChanges: {
      checking: -120,
      health: 10
    }
  },
  {
    date: new Date(2010, 1, 28), // Feb 28, 2010
    title: "Offered Part-Time Contract Work",
    description: "A former colleague offers you weekend contract work that would bring in an extra $200/month. Take it on?",
    hasChoice: true,
    choices: {
      accept: "Yes, take the gig",
      decline: "No, too busy"
    },
    stateChanges: {
      salaryFlat: 200 // Add $200/month
    }
  },
  {
    date: new Date(2010, 3, 7), // Apr 7, 2010
    title: "Fender-bender",
    description: "You got rear-ended at a red light. Thankfully no injuries, but the deductible is $400.",
    hasChoice: false,
    stateChanges: {
      checking: -400,
      stress: 10
    }
  },
  {
    date: new Date(2010, 5, 25), // Jun 25, 2010
    title: "Decide to Move Apartments",
    description: "You found a nicer apartment closer to work, but it's $150/month more in rent. Make the move?",
    hasChoice: true,
    choices: {
      accept: "Yes, upgrade apartment",
      decline: "No, stay put"
    },
    stateChanges: {
      rent: 150,
      happiness: 5
    }
  },
  {
    date: new Date(2010, 7, 30), // Aug 30, 2010
    title: "Start Investing",
    description: "You've been reading about investing. Would you like to make your first $300 investment in the stock market?",
    hasChoice: true,
    choices: {
      accept: "Yes, start investing",
      decline: "No, too risky"
    },
    stateChanges: {
      checking: -300,
      investments: 300
    }
  },
  {
    date: new Date(2010, 10, 12), // Nov 12, 2010
    title: "Overwork Burnout",
    description: "The combination of your full-time job and weekend contract work is taking a toll. You're feeling exhausted.",
    hasChoice: false,
    stateChanges: {
      stress: 15,
      happiness: -5
    }
  },

  // 2011
  {
    date: new Date(2011, 0, 9), // Jan 9, 2011
    title: "Annual Raise",
    description: "Your annual performance review went well. You've earned a 4% raise!",
    hasChoice: false,
    stateChanges: {
      salaryPercent: 4
    }
  },
  {
    date: new Date(2011, 2, 19), // Mar 19, 2011
    title: "Meet New Partner",
    description: "A friend wants to set you up on a blind date. Coffee date would cost around $20. Give it a shot?",
    hasChoice: true,
    choices: {
      accept: "Yes, go on the date",
      decline: "No, not interested"
    },
    stateChanges: {
      happiness: 10,
      stress: -5,
      checking: -200
    }
  },
  {
    date: new Date(2011, 4, 5), // May 5, 2011
    title: "Friend Needs $200 Loan",
    description: "A close friend is in a tight spot and asks to borrow $200. They promise to pay you back soon. Help them out?",
    hasChoice: true,
    choices: {
      accept: "Yes, loan the money",
      decline: "No, can't afford it"
    },
    stateChanges: {
      checking: -200, // Never repaid
      happiness: 3
    }
  },
  {
    date: new Date(2011, 6, 18), // Jul 18, 2011
    title: "Car Registration & Fees",
    description: "Your annual car registration and smog check are due. Total cost: $180.",
    hasChoice: false,
    stateChanges: {
      checking: -180
    }
  },
  {
    date: new Date(2011, 8, 4), // Sep 4, 2011
    title: "Relationship Trip",
    description: "Your new relationship is going great! Plan a weekend getaway together for $500?",
    hasChoice: true,
    choices: {
      accept: "Yes, book the trip",
      decline: "No, stay local"
    },
    stateChanges: {
      checking: -500,
      happiness: 8
    }
  },
  {
    date: new Date(2011, 11, 2), // Dec 2, 2011
    title: "Side Gig Ends",
    description: "Your weekend contract work has dried up. You'll be losing that extra $200/month.",
    hasChoice: false,
    stateChanges: {
      salaryFlat: -200
    }
  },

  // 2012
  {
    date: new Date(2012, 1, 11), // Feb 11, 2012
    title: "Job Promotion Interview",
    description: "Your manager recommends you for a senior position. The role comes with a 6% raise but more responsibilities. Apply?",
    hasChoice: true,
    choices: {
      accept: "Yes, go for it",
      decline: "No, not ready"
    },
    stateChanges: {
      salaryPercent: 6,
      stress: 5
    }
  },
  {
    date: new Date(2012, 3, 29), // Apr 29, 2012
    title: "Dental Work",
    description: "You've been putting off dental work, but now it can't wait. The procedure costs $350.",
    hasChoice: false,
    stateChanges: {
      checking: -350
    }
  },
  {
    date: new Date(2012, 6, 13), // Jul 13, 2012
    title: "Adopt a Dog?",
    description: "You've been thinking about getting a dog. The adoption fee is $120, plus you'll need supplies. Ready for a furry friend?",
    hasChoice: true,
    choices: {
      accept: "Yes, adopt the dog",
      decline: "No, not yet"
    },
    stateChanges: {
      checking: -120,
      happiness: 12,
      stress: -10
    }
  },
  {
    date: new Date(2012, 9, 1), // Oct 1, 2012
    title: "Stock Market Dip",
    description: "The stock market took a small dip. Your investments are down 5%.",
    hasChoice: false,
    stateChanges: {
      investmentsPercent: -5
    }
  },

  // 2013
  {
    date: new Date(2013, 0, 20), // Jan 20, 2013
    title: "Annual Raise",
    description: "Another year, another raise. You've earned a 3% salary increase.",
    hasChoice: false,
    stateChanges: {
      salaryPercent: 3
    }
  },
  {
    date: new Date(2013, 2, 7), // Mar 7, 2013
    title: "Breakup",
    description: "Your relationship has ended. You're going through a tough time emotionally.",
    hasChoice: false,
    stateChanges: {
      happiness: -12,
      stress: 12
    }
  },
  {
    date: new Date(2013, 4, 25), // May 25, 2013
    title: "Homeownership Seminar",
    description: "You're thinking about buying a home eventually. Attend a first-time homebuyer seminar for $50?",
    hasChoice: true,
    choices: {
      accept: "Yes, attend seminar",
      decline: "No, not interested"
    },
    stateChanges: {
      checking: -50,
      happiness: 3
    }
  },
  {
    date: new Date(2013, 7, 9), // Aug 9, 2013
    title: "Work Overtime",
    description: "Your team is behind on a major project. Work extra hours for a $300 bonus?",
    hasChoice: true,
    choices: {
      accept: "Yes, work overtime",
      decline: "No, maintain balance"
    },
    stateChanges: {
      checking: 300,
      stress: 8
    }
  },
  {
    date: new Date(2013, 10, 4), // Nov 4, 2013
    title: "Caught the Flu",
    description: "You came down with the flu and are stuck in bed for a week. Rest up.",
    hasChoice: false,
    stateChanges: {
      health: -15
    }
  },

  // 2014
  {
    date: new Date(2014, 1, 14), // Feb 14, 2014
    title: "New Relationship",
    description: "You met someone special. Ready to start dating again?",
    hasChoice: true,
    choices: {
      accept: "Yes, start dating",
      decline: "No, need more time"
    },
    stateChanges: {
      happiness: 10,
      stress: -5
    }
  },
  {
    date: new Date(2014, 3, 10), // Apr 10, 2014
    title: "Rent Increase",
    description: "Your landlord is raising the rent by $75/month. Time to start thinking about buying?",
    hasChoice: false,
    stateChanges: {
      rent: 75
    }
  },
  {
    date: new Date(2014, 5, 29), // Jun 29, 2014
    title: "Vacation Option",
    description: "Your friends are planning a $700 vacation to Hawaii. Join them?",
    hasChoice: true,
    choices: {
      accept: "Yes, book the trip",
      decline: "No, save the money"
    },
    stateChanges: {
      // Hardcoded to NO - no changes
    }
  },
  {
    date: new Date(2014, 8, 6), // Sep 6, 2014
    title: "Side Project Pays Off",
    description: "Remember that side project you worked on? Someone wants to buy it for $450!",
    hasChoice: false,
    stateChanges: {
      checking: 450,
      happiness: 5
    }
  },
  {
    date: new Date(2014, 11, 21), // Dec 21, 2014
    title: "Emergency Root Canal",
    description: "You need an emergency root canal. The procedure costs $400, and thankfully you have your emergency fund.",
    hasChoice: false,
    stateChanges: {
      emergencyFund: -400,
      stress: 5
    }
  },

  // 2015
  {
    date: new Date(2015, 0, 12), // Jan 12, 2015
    title: "Annual Raise",
    description: "Strong performance this year! You've earned a 4% raise.",
    hasChoice: false,
    stateChanges: {
      salaryPercent: 4
    }
  },
  {
    date: new Date(2015, 2, 30), // Mar 30, 2015
    title: "Buy a Bike?",
    description: "You're thinking about biking to work for exercise. A good bike costs $350. Make the investment?",
    hasChoice: true,
    choices: {
      accept: "Yes, buy the bike",
      decline: "No, keep driving"
    },
    stateChanges: {
      checking: -350,
      health: 8
    }
  },
  {
    date: new Date(2015, 5, 2), // Jun 2, 2015
    title: "Partner Moves In",
    description: "Your partner wants to move in together! You'll split rent differently, saving you $200/month. Sounds good?",
    hasChoice: true,
    choices: {
      accept: "Yes, move in together",
      decline: "No, too soon"
    },
    stateChanges: {
      rent: -200,
      happiness: 8
    }
  },
  {
    date: new Date(2015, 7, 14), // Aug 14, 2015
    title: "Minor Car Damage",
    description: "Someone dinged your car in a parking lot. Small repair costs $180.",
    hasChoice: false,
    stateChanges: {
      checking: -180
    }
  },
  {
    date: new Date(2015, 10, 3), // Nov 3, 2015
    title: "Work Stress Spike",
    description: "Major deadlines are piling up at work. Your stress levels are climbing.",
    hasChoice: false,
    stateChanges: {
      stress: 15
    }
  },

  // 2016
  {
    date: new Date(2016, 1, 9), // Feb 9, 2016
    title: "Engagement Talk",
    description: "You're ready to propose! A nice engagement ring costs $2,000. Make it happen?",
    hasChoice: true,
    choices: {
      accept: "Yes, buy the ring",
      decline: "No, wait longer"
    },
    stateChanges: {
      checking: -2000,
      happiness: 15,
      stress: 10
    }
  },
  {
    date: new Date(2016, 3, 26), // Apr 26, 2016
    title: "Job Promotion",
    description: "Congratulations! You've been promoted with an 8% raise and better work-life balance.",
    hasChoice: false,
    stateChanges: {
      salaryPercent: 8,
      stress: -5
    }
  },
  {
    date: new Date(2016, 6, 30), // Jul 30, 2016
    title: "Wedding Planning Begins",
    description: "Time to start planning the wedding. Initial deposits total $500.",
    hasChoice: false,
    stateChanges: {
      checking: -500,
      stress: 5
    }
  },
  {
    date: new Date(2016, 9, 22), // Oct 22, 2016
    title: "Minor Medical Bill",
    description: "A minor medical procedure costs $220 after insurance.",
    hasChoice: false,
    stateChanges: {
      checking: -220
    }
  },

  // 2017
  {
    date: new Date(2017, 0, 10), // Jan 10, 2017
    title: "Annual Raise",
    description: "Another successful year brings a 3% raise.",
    hasChoice: false,
    stateChanges: {
      salaryPercent: 3
    }
  },
  {
    date: new Date(2017, 2, 17), // Mar 17, 2017
    title: "Wedding Ceremony",
    description: "It's your wedding day! You decided to keep it modest at $3,000 total. Enjoy your special day!",
    hasChoice: true,
    choices: {
      accept: "Keep it modest ($3,000)",
      decline: "Go bigger ($10,000)"
    },
    stateChanges: {
      checking: -3000,
      happiness: 20
    }
  },
  {
    date: new Date(2017, 5, 5), // Jun 5, 2017
    title: "Buy Used Car",
    description: "Your old car is on its last legs. Buy a reliable used car for $4,500?",
    hasChoice: true,
    choices: {
      accept: "Yes, buy the car",
      decline: "No, keep repairing"
    },
    stateChanges: {
      checking: -4500,
      stress: -8
    }
  },
  {
    date: new Date(2017, 8, 15), // Sep 15, 2017
    title: "Home Savings Push",
    description: "You're serious about buying a home. Move $2,000 into a dedicated savings account?",
    hasChoice: true,
    choices: {
      accept: "Yes, save for home",
      decline: "No, not ready"
    },
    stateChanges: {
      checking: -2000,
      savings: 2000
    }
  },
  {
    date: new Date(2017, 10, 28), // Nov 28, 2017
    title: "Workplace Recognition Award",
    description: "Your team won an innovation award! You receive a $300 bonus.",
    hasChoice: false,
    stateChanges: {
      checking: 300,
      happiness: 4
    }
  },

  // 2018
  {
    date: new Date(2018, 1, 23), // Feb 23, 2018
    title: "New Job Offer",
    description: "A recruiter approached you with an offer for 12% more salary and better benefits. Accept?",
    hasChoice: true,
    choices: {
      accept: "Yes, take the job",
      decline: "No, stay put"
    },
    stateChanges: {
      salaryPercent: 12,
      stress: -10
    }
  },
  {
    date: new Date(2018, 4, 12), // May 12, 2018
    title: "House Hunt Begins",
    description: "Time to start seriously house hunting. Hire a realtor for $300?",
    hasChoice: true,
    choices: {
      accept: "Yes, hire realtor",
      decline: "No, search alone"
    },
    stateChanges: {
      checking: -300
    }
  },
  {
    date: new Date(2018, 7, 9), // Aug 9, 2018
    title: "Down Payment Preparation",
    description: "You're moving savings into a position for a down payment on your future home.",
    hasChoice: false,
    stateChanges: {
      savings: -5000,
      realEstate: 5000 // Equity
    }
  },
  {
    date: new Date(2018, 9, 27), // Oct 27, 2018
    title: "Heating System Failure",
    description: "Your apartment's heating broke and the landlord is slow to fix it. You bought space heaters for $600.",
    hasChoice: false,
    stateChanges: {
      checking: -600
    }
  },

  // 2019
  {
    date: new Date(2019, 0, 6), // Jan 6, 2019
    title: "Annual Raise",
    description: "Starting the year strong with a 3% raise!",
    hasChoice: false,
    stateChanges: {
      salaryPercent: 3
    }
  },
  {
    date: new Date(2019, 2, 3), // Mar 3, 2019
    title: "Baby on the Way?",
    description: "You and your partner are thinking about starting a family. Begin a $1,000 baby fund?",
    hasChoice: true,
    choices: {
      accept: "Yes, start baby fund",
      decline: "No, not yet"
    },
    stateChanges: {
      checking: -1000,
      savings: 1000
    }
  },
  {
    date: new Date(2019, 5, 11), // Jun 11, 2019
    title: "Buy a Boat?",
    description: "Your friend is selling their boat for $5,000. Could be fun for weekends!",
    hasChoice: true,
    choices: {
      accept: "Yes, buy the boat",
      decline: "No, not practical"
    },
    stateChanges: {
      // Hardcoded to NO - no changes
    }
  },
  {
    date: new Date(2019, 7, 28), // Aug 28, 2019
    title: "Home Repair Issue",
    description: "Emergency plumbing issue in your apartment costs $450 to fix urgently.",
    hasChoice: false,
    stateChanges: {
      emergencyFund: -450
    }
  },
  {
    date: new Date(2019, 10, 15), // Nov 15, 2019
    title: "Great Performance Review",
    description: "Exceptional performance! You've earned a 5% raise and your boss gave you glowing feedback.",
    hasChoice: false,
    stateChanges: {
      salaryPercent: 5,
      happiness: 6
    }
  }
];

// Helper function to get the next event based on current date
export const getNextEvent = (currentDate) => {
  if (!currentDate) return null;

  const currentTime = currentDate.getTime();

  // Find the first event that matches or comes after the current date
  // We match on year, month, and day
  for (const event of storylineEvents) {
    const eventDate = event.date;

    // Check if this event is today
    if (
      eventDate.getFullYear() === currentDate.getFullYear() &&
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getDate() === currentDate.getDate()
    ) {
      return event;
    }
  }

  return null;
};

// Helper function to check if an event should trigger
export const shouldTriggerEvent = (currentDate, shownEventKeys) => {
  const event = getNextEvent(currentDate);

  if (!event) return { shouldTrigger: false, event: null };

  // Create a unique key for this event
  const eventKey = `${event.date.getFullYear()}-${event.date.getMonth()}-${event.date.getDate()}`;

  // Check if we've already shown this event
  if (shownEventKeys.has(eventKey)) {
    return { shouldTrigger: false, event: null };
  }

  return { shouldTrigger: true, event, eventKey };
};
