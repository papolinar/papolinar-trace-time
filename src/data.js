// Content and tuning for Trace Time. Edit freely: sentences, punctuation
// prompts, session sizes and scoring strictness all live here.

export const SIZES = {
  quick: { caps: 4, lower: 4, nums: 3, punct: 2, name: 1, sent: 2 },
  std: { caps: 8, lower: 8, nums: 5, punct: 4, name: 2, sent: 4 },
  all: { caps: 26, lower: 26, nums: 10, punct: 11, name: 3, sent: 6 },
};

// Tolerance band around the letter shapes, as a fraction of font size.
export const TOL = { easy: 0.17, normal: 0.12, hard: 0.08 };

export const CAPS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('');
export const NUMS = '0123456789'.split('');

export const PUNCT = [
  ['Wow!', '! exclamation mark'],
  ['Why?', '? question mark'],
  ['The end.', '. period'],
  ['Yes, please', ', comma'],
  ["I'm here", "' apostrophe"],
  ['"Hi!"', '" quotation marks'],
  ['Ready: go!', ': colon'],
  ['Snack; nap', '; semicolon'],
  ['well-done', '- hyphen'],
  ['(shh)', '( ) parentheses'],
  ['Uh-oh...', '... dots'],
];

export const SENT = [
  'My dog ate my homework again.', 'The cat wore a cape to school.', 'I am the boss of my bedroom.',
  'Never trust a sneaky hot dog.', 'Pizza is my favorite vegetable.', 'The robot wants a hug.',
  'My brother smells like socks.', 'I can burp the whole alphabet.', 'Super Pup saves the day!',
  'Bad guys do not like bubbles.', 'The fish ran away from home.', 'My teacher has eyes in her back.',
  'Tacos are better on Tuesdays.', 'The moon is made of cheese.', 'My lunch box is a time machine.',
  'A frog sat on my sandwich.', 'Today I am a secret agent.', 'The chicken crossed the road twice.',
  'My shoes are on the wrong feet.', 'Dad dances like a wobbly noodle.', 'I will be famous one day.',
  'The toilet made a scary noise.', 'Grandma beats me at video games.', 'A goat ate my kite.',
  'The best day ever is Saturday.', 'I hid the broccoli in my sock.', 'My diary is top secret.',
  'The cat is plotting something.', 'The pickle wants to be a cop.', 'I built a fort out of pillows.',
  'My sister snores like a truck.', 'The dog drove the car to the park.', 'Ice cream for breakfast is fine.',
  'I can jump higher than a kangaroo.', 'The wizard lost his hat.', 'My pet rock is a good listener.',
  'Aliens love peanut butter.', 'I am not a baby. I am big!', 'The bus smells like old cheese.',
  'A dragon lives under my bed.', 'My hamster is a ninja.', 'Who let the cat drive?',
  'The pizza guy is a squirrel.', 'I made a cake that exploded.', 'The superhero forgot his pants.',
  'My best friend is a giant.', 'Bananas are funny fruit.', 'I scored a goal for the wrong team.',
  'The monster is scared of the dark.', 'We rode a bike to the moon.', 'The cookie jar is empty again.',
  'I taught my dog to sit.', 'My cat thinks she is a queen.', 'The baby threw noodles at me.',
  'Today is a good day to be silly.', 'My bike can go super fast.', 'The ghost likes to tell jokes.',
  'A shark at the pool? No way!', 'The snowman stole my hat.', 'Can a dog be a police officer?',
  'My robot does my chores.', 'The worm wants to dance.', 'I keep a frog in my pocket.',
  'Our teacher turned into a cat.', 'Do not lick the slide.', 'My uncle tells the worst jokes.',
  'A bee landed on my nose.', 'I will clean my room tomorrow.', 'The tree house is for kids only.',
  'My socks never match.', 'I wish I had a pet dinosaur.', 'The farmer lost his pig.',
  'Be kind to everyone you meet.', 'Reading books makes you smart.', 'I tried my best and that is great.',
  'The owl stayed up all night.', 'My popcorn jumped out of the bowl.', 'The king has a silly crown.',
  'A mouse ate the whole cheese.', "Let's build a rocket ship!", 'The puppy chewed my shoe.',
  'My brain is full of good ideas.', 'The giant sneezed on the town.', 'I can count to one hundred.',
  'Is that a spider on your head?', 'The pirate lost his map.', 'Gym class is the best class.',
  'My grandpa has a funny laugh.', 'I like to draw comics.', 'The bad cat said sorry.',
  'Hot dogs should not be blue.', 'The class pet escaped again!', 'Snow days are the best days.',
  'My dog is a good boy.', 'We had a food fight at lunch.', 'The pig rolled in the mud.',
  'My fort has a secret password.', 'Never wake a sleeping bear.', 'I can read this all by myself!',
  'The cop car had a squeaky horn.',
];

export const CATS = [
  { id: 'caps', name: 'Capital letters', sample: 'ABC' },
  { id: 'lower', name: 'Lowercase letters', sample: 'abc' },
  { id: 'nums', name: 'Numbers', sample: '123' },
  { id: 'punct', name: 'Punctuation', sample: '?!.' },
  { id: 'name', name: 'My name', sample: '' },
  { id: 'sent', name: 'Silly sentences', sample: 'Hi!' },
];

// [minimum score, rank letter, message]
export const RANKS = [
  [90, 'S', 'Super star!'],
  [78, 'A', 'Awesome!'],
  [64, 'B', 'Great job!'],
  [48, 'C', 'Good try!'],
  [0, 'D', 'Keep practicing!'],
];
