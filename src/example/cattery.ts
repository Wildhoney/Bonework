export type Cat = {
  id: string;
  name: string;
  breed: string;
  avatar: string;
  bio: string | null;
  age: number;
};

type Profile = Omit<Cat, "id" | "avatar">;

const profiles: Profile[] = [
  {
    name: "Bartholomew",
    breed: "British Shorthair",
    bio: "Distinguished, suspicious of strangers, ferocious in his pursuit of dinner.",
    age: 4,
  },
  {
    name: "Saoirse",
    breed: "Russian Blue",
    bio: "Plush coat, plush opinions. Will lecture you on the correct way to open a tin.",
    age: 2,
  },
  {
    name: "Marigold",
    breed: "Maine Coon",
    bio: "Larger than every dog she's met. Has not noticed.",
    age: 6,
  },
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
    bio: null,
    age: 7,
  },
  {
    name: "Calliope",
    breed: "Abyssinian",
    bio: "Ginger acrobat. Has knocked something fragile off something tall today, almost certainly.",
    age: 2,
  },
];

let nextId = 1;
let nextProfile = 0;

async function fetchImageUrl(): Promise<string> {
  const response = await fetch(
    "https://api.thecatapi.com/v1/images/search?size=med",
  );
  if (!response.ok) throw new Error("Failed to fetch a cat photo.");
  const data = (await response.json()) as Array<{ url: string }>;
  const url = data[0]?.url;
  if (!url) throw new Error("Cat API returned an empty payload.");
  return url;
}

function pickProfile(): Profile {
  const profile = profiles[nextProfile % profiles.length];
  if (!profile) throw new Error("Cattery has no profiles to offer.");
  nextProfile++;
  return profile;
}

export const cattery = {
  async initial(): Promise<Cat[]> {
    const [first, second] = await Promise.all([
      fetchImageUrl(),
      fetchImageUrl(),
    ]);
    return [
      { ...pickProfile(), id: String(nextId++), avatar: first },
      { ...pickProfile(), id: String(nextId++), avatar: second },
    ];
  },
  async adopt(): Promise<Cat> {
    const [image] = await Promise.all([
      fetchImageUrl(),
      new Promise((resolve) => window.setTimeout(resolve, 5000)),
    ]);
    return { ...pickProfile(), id: String(nextId++), avatar: image };
  },
};
