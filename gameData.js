// Cricket Teams and Player Data
const cricketTeams = {
    'India': {
        name: 'India',
        flag: '🇮🇳',
        players: [
            { name: 'Rohit Sharma', role: 'Batsman', batting: 88, bowling: 20, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RohitSharma' },
            { name: 'Virat Kohli', role: 'Batsman', batting: 92, bowling: 25, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ViratKohli' },
            { name: 'KL Rahul', role: 'Batsman', batting: 85, bowling: 15, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KLRahul' },
            { name: 'Suryakumar Yadav', role: 'Batsman', batting: 90, bowling: 20, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suryakumar' },
            { name: 'Rishabh Pant', role: 'Wicketkeeper', batting: 82, bowling: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RishabhPant' },
            { name: 'Hardik Pandya', role: 'All-rounder', batting: 78, bowling: 80, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HardikPandya' },
            { name: 'Ravindra Jadeja', role: 'All-rounder', batting: 72, bowling: 85, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jadeja' },
            { name: 'Jasprit Bumrah', role: 'Bowler', batting: 25, bowling: 94, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bumrah' },
            { name: 'Mohammed Shami', role: 'Bowler', batting: 30, bowling: 90, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shami' },
            { name: 'Yuzvendra Chahal', role: 'Bowler', batting: 20, bowling: 87, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chahal' },
            { name: 'Kuldeep Yadav', role: 'Bowler', batting: 22, bowling: 85, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kuldeep' }
        ]
    },
    'Australia': {
        name: 'Australia',
        flag: '🇦🇺',
        players: [
            { name: 'David Warner', role: 'Batsman', batting: 90, bowling: 20, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidWarner' },
            { name: 'Steve Smith', role: 'Batsman', batting: 91, bowling: 25, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SteveSmith' },
            { name: 'Marnus Labuschagne', role: 'Batsman', batting: 87, bowling: 30, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marnus' },
            { name: 'Glenn Maxwell', role: 'All-rounder', batting: 84, bowling: 78, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maxwell' },
            { name: 'Alex Carey', role: 'Wicketkeeper', batting: 77, bowling: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexCarey' },
            { name: 'Marcus Stoinis', role: 'All-rounder', batting: 80, bowling: 75, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stoinis' },
            { name: 'Pat Cummins', role: 'Bowler', batting: 40, bowling: 92, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cummins' },
            { name: 'Mitchell Starc', role: 'Bowler', batting: 35, bowling: 93, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Starc' },
            { name: 'Josh Hazlewood', role: 'Bowler', batting: 28, bowling: 91, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hazlewood' },
            { name: 'Adam Zampa', role: 'Bowler', batting: 22, bowling: 86, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zampa' },
            { name: 'Nathan Lyon', role: 'Bowler', batting: 25, bowling: 88, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NathanLyon' }
        ]
    },
    'England': {
        name: 'England',
        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        players: [
            { name: 'Jos Buttler', role: 'Wicketkeeper', batting: 92, bowling: 15, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JosButtler' },
            { name: 'Jonny Bairstow', role: 'Batsman', batting: 89, bowling: 20, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bairstow' },
            { name: 'Joe Root', role: 'Batsman', batting: 90, bowling: 45, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JoeRoot' },
            { name: 'Ben Stokes', role: 'All-rounder', batting: 87, bowling: 82, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BenStokes' },
            { name: 'Liam Livingstone', role: 'All-rounder', batting: 82, bowling: 72, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Livingstone' },
            { name: 'Moeen Ali', role: 'All-rounder', batting: 77, bowling: 80, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MoeenAli' },
            { name: 'Sam Curran', role: 'All-rounder', batting: 72, bowling: 84, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SamCurran' },
            { name: 'Jofra Archer', role: 'Bowler', batting: 30, bowling: 93, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JofraArcher' },
            { name: 'Mark Wood', role: 'Bowler', batting: 25, bowling: 90, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarkWood' },
            { name: 'Adil Rashid', role: 'Bowler', batting: 20, bowling: 87, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdilRashid' },
            { name: 'Chris Woakes', role: 'Bowler', batting: 35, bowling: 86, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChrisWoakes' }
        ]
    },
    'Pakistan': {
        name: 'Pakistan',
        flag: '🇵🇰',
        players: [
            { name: 'Babar Azam', role: 'Batsman', batting: 94, bowling: 20, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BabarAzam' },
            { name: 'Mohammad Rizwan', role: 'Wicketkeeper', batting: 87, bowling: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rizwan' },
            { name: 'Fakhar Zaman', role: 'Batsman', batting: 85, bowling: 25, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FakharZaman' },
            { name: 'Iftikhar Ahmed', role: 'All-rounder', batting: 80, bowling: 72, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Iftikhar' },
            { name: 'Shadab Khan', role: 'All-rounder', batting: 74, bowling: 84, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ShadabKhan' },
            { name: 'Imad Wasim', role: 'All-rounder', batting: 72, bowling: 82, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ImadWasim' },
            { name: 'Shaheen Afridi', role: 'Bowler', batting: 28, bowling: 92, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shaheen' },
            { name: 'Haris Rauf', role: 'Bowler', batting: 25, bowling: 90, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HarisRauf' },
            { name: 'Naseem Shah', role: 'Bowler', batting: 22, bowling: 89, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NaseemShah' },
            { name: 'Mohammad Nawaz', role: 'Bowler', batting: 30, bowling: 83, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nawaz' },
            { name: 'Hasan Ali', role: 'Bowler', batting: 32, bowling: 87, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HasanAli' }
        ]
    },
    'New Zealand': {
        name: 'New Zealand',
        flag: '🇳🇿',
        players: [
            { name: 'Kane Williamson', role: 'Batsman', batting: 91, bowling: 35, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KaneWilliamson' },
            { name: 'Devon Conway', role: 'Batsman', batting: 86, bowling: 20, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevonConway' },
            { name: 'Daryl Mitchell', role: 'All-rounder', batting: 82, bowling: 67, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DarylMitchell' },
            { name: 'Glenn Phillips', role: 'Batsman', batting: 84, bowling: 40, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GlennPhillips' },
            { name: 'Tom Latham', role: 'Wicketkeeper', batting: 80, bowling: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TomLatham' },
            { name: 'Mitchell Santner', role: 'All-rounder', batting: 72, bowling: 85, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Santner' },
            { name: 'James Neesham', role: 'All-rounder', batting: 77, bowling: 74, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neesham' },
            { name: 'Trent Boult', role: 'Bowler', batting: 30, bowling: 92, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TrentBoult' },
            { name: 'Tim Southee', role: 'Bowler', batting: 35, bowling: 90, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TimSouthee' },
            { name: 'Lockie Ferguson', role: 'Bowler', batting: 25, bowling: 89, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LockieFerguson' },
            { name: 'Ish Sodhi', role: 'Bowler', batting: 20, bowling: 86, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=IshSodhi' }
        ]
    },
    'South Africa': {
        name: 'South Africa',
        flag: '🇿🇦',
        players: [
            { name: 'Quinton de Kock', role: 'Wicketkeeper', batting: 89, bowling: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuintondeKock' },
            { name: 'Temba Bavuma', role: 'Batsman', batting: 84, bowling: 20, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TembaBavuma' },
            { name: 'Aiden Markram', role: 'Batsman', batting: 87, bowling: 45, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AidenMarkram' },
            { name: 'Rassie van der Dussen', role: 'Batsman', batting: 85, bowling: 25, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rassie' },
            { name: 'David Miller', role: 'Batsman', batting: 86, bowling: 30, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidMiller' },
            { name: 'Marco Jansen', role: 'All-rounder', batting: 67, bowling: 84, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcoJansen' },
            { name: 'Kagiso Rabada', role: 'Bowler', batting: 32, bowling: 93, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KagisoRabada' },
            { name: 'Anrich Nortje', role: 'Bowler', batting: 25, bowling: 91, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnrichNortje' },
            { name: 'Lungi Ngidi', role: 'Bowler', batting: 28, bowling: 88, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LungiNgidi' },
            { name: 'Tabraiz Shamsi', role: 'Bowler', batting: 20, bowling: 87, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TabraizShamsi' },
            { name: 'Keshav Maharaj', role: 'Bowler', batting: 25, bowling: 85, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KeshavMaharaj' }
        ]
    }
};

// Shot types and their characteristics
const shotTypes = {
    defense: {
        name: 'Defense',
        safe: true,
        boundaryChance: 0.05,
        wicketChance: 0.08,
        runChance: 0.3,
        dotChance: 0.57
    },
    drive: {
        name: 'Drive',
        safe: false,
        boundaryChance: 0.35,
        wicketChance: 0.15,
        runChance: 0.35,
        dotChance: 0.15
    },
    cut: {
        name: 'Cut',
        safe: false,
        boundaryChance: 0.4,
        wicketChance: 0.18,
        runChance: 0.3,
        dotChance: 0.12
    },
    pull: {
        name: 'Pull',
        safe: false,
        boundaryChance: 0.45,
        wicketChance: 0.2,
        runChance: 0.25,
        dotChance: 0.1
    },
    sweep: {
        name: 'Sweep',
        safe: false,
        boundaryChance: 0.3,
        wicketChance: 0.25,
        runChance: 0.35,
        dotChance: 0.1
    },
    loft: {
        name: 'Loft',
        safe: false,
        boundaryChance: 0.55,
        wicketChance: 0.3,
        runChance: 0.1,
        dotChance: 0.05
    },
    leave: {
        name: 'Leave',
        safe: true,
        boundaryChance: 0,
        wicketChance: 0.02,
        runChance: 0,
        dotChance: 0.98
    }
};

// Bowling types
const bowlingTypes = {
    fast: { name: 'Fast', speed: 140, swing: 0.3, accuracy: 0.7 },
    medium: { name: 'Medium', speed: 120, swing: 0.4, accuracy: 0.75 },
    spin: { name: 'Spin', speed: 80, swing: 0.6, accuracy: 0.8 },
    yorker: { name: 'Yorker', speed: 135, swing: 0.2, accuracy: 0.65 },
    bouncer: { name: 'Bouncer', speed: 145, swing: 0.1, accuracy: 0.6 },
    slower: { name: 'Slower Ball', speed: 100, swing: 0.5, accuracy: 0.7 }
};

// Commentary phrases
const commentaryPhrases = {
    dot: [
        'Defended back to the bowler.',
        'Good fielding, no run.',
        'Dot ball, pressure building.',
        'Well bowled, no score.'
    ],
    single: [
        'Takes a single.',
        'Quick single, good running.',
        'One run added to the total.',
        'Rotates the strike.'
    ],
    boundary: [
        'FOUR! Beautiful shot!',
        'Finds the boundary!',
        'Cracking shot for four!',
        'Races away to the boundary!'
    ],
    six: [
        'SIX! Into the stands!',
        'Maximum! What a shot!',
        'Clears the boundary with ease!',
        'HUGE SIX!'
    ],
    wicket: [
        'OUT! Bowled!',
        'Caught! What a catch!',
        'LBW! The finger goes up!',
        'Stumped! Quick work!',
        'Run out! Direct hit!'
    ]
};

// Field positions
const fieldPositions = [
    { name: 'Slip', x: 0.15, y: 0.1 },
    { name: 'Gully', x: 0.2, y: 0.12 },
    { name: 'Point', x: 0.25, y: 0.2 },
    { name: 'Cover', x: 0.3, y: 0.25 },
    { name: 'Mid-off', x: 0.2, y: 0.3 },
    { name: 'Mid-on', x: 0.2, y: 0.5 },
    { name: 'Mid-wicket', x: 0.3, y: 0.55 },
    { name: 'Square Leg', x: 0.25, y: 0.6 },
    { name: 'Fine Leg', x: 0.15, y: 0.65 },
    { name: 'Third Man', x: 0.1, y: 0.2 },
    { name: 'Long Off', x: 0.15, y: 0.25 },
    { name: 'Long On', x: 0.15, y: 0.55 }
];

