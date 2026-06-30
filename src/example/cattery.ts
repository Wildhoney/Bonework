export type Cat = {
  id: string;
  name: string;
  breed: string;
  avatar: string;
  bio: string;
  age: number;
};

const colours = [
  "edeafd/3c1b72",
  "f5e1d8/8b4513",
  "fde2d4/c75b39",
  "e8f5e9/2e7d32",
  "fff3cd/8d6e00",
  "e0f7fa/006978",
] as const;

const initial: Cat[] = [
  {
    id: "1",
    name: "Bartholomew",
    breed: "British Shorthair",
    avatar: `https://placehold.co/200x200/${colours[0]}?text=B`,
    bio: "Distinguished, suspicious of strangers, ferocious in his pursuit of dinner.",
    age: 4,
  },
  {
    id: "2",
    name: "Saoirse",
    breed: "Russian Blue",
    avatar: `https://placehold.co/200x200/${colours[1]}?text=S`,
    bio: "Plush coat, plush opinions. Will lecture you on the correct way to open a tin.",
    age: 2,
  },
];

const candidates: Omit<Cat, "id" | "avatar">[] = [
  {
    name: "Persephone",
    breed: "Egyptian Mau",
    bio: "Spotted, ancient, mildly unsettling. Stares at things you cannot see.",
    age: 3,
  },
  {
    name: "Tarquin",
    breed: "Norwegian Forest",
    bio: "Wears a permanent ruff. Believes himself a small bear.",
    age: 5,
  },
  {
    name: "Esmeralda",
    breed: "Turkish Van",
    bio: "Will absolutely swim in your bath if you don't watch her.",
    age: 1,
  },
  {
    name: "Octavius",
    breed: "Devon Rex",
    bio: "Permanently surprised, in a charming way. Squeaks instead of meows.",
    age: 7,
  },
  {
    name: "Calliope",
    breed: "Abyssinian",
    bio: "Ginger acrobat. Has knocked something fragile off something tall today, almost certainly.",
    age: 2,
  },
];

let nextId = initial.length + 1;
let nextColour = 3;

export const cattery = {
  initial,
  adopt(): Promise<Cat> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        const pick = candidates[Math.floor(Math.random() * candidates.length)]!;
        const id = String(nextId++);
        const colour = colours[nextColour % colours.length]!;
        nextColour++;
        resolve({
          id,
          name: pick.name,
          breed: pick.breed,
          bio: pick.bio,
          age: pick.age,
          avatar: `https://placehold.co/200x200/${colour}?text=${pick.name.charAt(0)}`,
        });
      }, 5000);
    });
  },
};
