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
  W: ['Arrey yaar! Clean bowled!', 'OUT! Bhai kya hua tujhe!', 'Stumps ud gaye!', 'Caught in the outfield!'],
  0: ['Dot ball. Kuch nahi mila.', 'Blocked nicely, no run.', 'Defended well.'],
  1: ['Ek run. Chalo theek hai.', 'Nudged for a single!', 'Quick single!'],
  2: ['Do run! Nice placement!', 'Two runs, good gap!', 'Pushed for two!'],
  3: ['Teen run! Great running!', 'Three runs on the board!'],
  4: ['CHAR! Racing to the wall!', 'FOUR! Straight drive!', 'BOUNDARY! Superb shot!'],
  6: ['CHHAKKA! Ghar ke upar se!', 'SIX! Out of the ground!', 'MAXIMUM! What a hit!', 'Gone over the wall!'],
}

export const sliderSpeed = 0.52

export const speedmap = { slow: 0.30, normal: 0.52, fast: 0.82 }
