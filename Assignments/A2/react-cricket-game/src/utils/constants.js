// game rules per assignment doc
export const totalballs   = 12  // 2 overs default
export const totalwickets = 2

// aggressive - high risk high reward
export const aggressiveprobs = [
  { label: 'W', display: 'WICKET', prob: 0.30, color: '#ef4444', runs: null },
  { label: '0', display: 'DOT',    prob: 0.10, color: '#78350f', runs: 0    },
  { label: '1', display: '1 RUN',  prob: 0.10, color: '#b45309', runs: 1    },
  { label: '2', display: '2 RUNS', prob: 0.10, color: '#d97706', runs: 2    },
  { label: '3', display: '3 RUNS', prob: 0.05, color: '#f59e0b', runs: 3    },
  { label: '4', display: 'FOUR!',  prob: 0.15, color: '#5aad30', runs: 4    },
  { label: '6', display: 'SIX!',   prob: 0.20, color: '#2a6e00', runs: 6    },
]

// defensive - lower risk steady scoring
export const defensiveprobs = [
  { label: 'W', display: 'WICKET', prob: 0.15, color: '#ef4444', runs: null },
  { label: '0', display: 'DOT',    prob: 0.30, color: '#78350f', runs: 0    },
  { label: '1', display: '1 RUN',  prob: 0.25, color: '#b45309', runs: 1    },
  { label: '2', display: '2 RUNS', prob: 0.15, color: '#d97706', runs: 2    },
  { label: '3', display: '3 RUNS', prob: 0.08, color: '#f59e0b', runs: 3    },
  { label: '4', display: 'FOUR!',  prob: 0.05, color: '#5aad30', runs: 4    },
  { label: '6', display: 'SIX!',   prob: 0.02, color: '#2a6e00', runs: 6    },
]

// commentary picked randomly after each ball
export const commentary = {
  W: [
     "OH NO! Straight to the fielder! Kya kar raha hai bhai?",
     "OUT! Clean bowled! That was a lightning delivery!",
     "STUMPS GONE! Better luck next time, champ!",
     "CAUGHT! Brilliant catch, ab pavilion mein rest karo!",
     "WICKET! The bowler is on fire today! Kya ball hai!",
     "OUT! That's a huge blow for the team!"
  ],
  0: [
    "Boring dot ball! Hit it hard next time!",
    "DOT BALL. Fielder is standing like a wall!",
    "No run! Fielding is too tight today.",
    "Blocked carefully! Just like a tough exam question.",
    "Dot ball. Come on, we need some boundaries!"
  ],
  1: [
    "Quick single! Great running between the wickets!",
    "Ek run! Nicely nudged into the gap.",
    "Single taken! Keeping the scoreboard moving.",
    "One run! School speed is impressive!"
  ],
  2: [
    "Two runs! Excellent running, full energy!",
    "DO RUN! Fielder was too slow to stop that!",
    "Pushed for two! These kids are fast!"
  ],
  3: [
    "Three runs! Brilliant effort on the field!",
    "TEEN RUN! Sprinting like it's Sports Day!",
    "Amazing running! That's hard work right there."
  ],
  4: [
    "FOUR! Beautiful boundary! What a classic shot!",
    "CHAAR RUN! The fielder was just a spectator!",
    "BOUNDARY! Pure timing and class!",
    "FOUR! Straight through the gap, no chance for the fielder!"
  ],
  6: [
    "SIX! That is massive! Ball ground se bahar!",
    "MAXIMUM! What a shot! Teacher ki khidki bach gayi!",
    "CHHAKKA! Out of the park! Send someone to fetch the ball!",
    "SIX! Powerful hit! Stadium is cheering for you!",
    "SMASHED! That's the shot of the day!"
  ],
}

export const sliderSpeed = 2.5

export const speedmap = { slow: 1.5, normal: 2.5, fast: 4.0 }

