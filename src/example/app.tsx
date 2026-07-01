import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { useState, type ReactElement } from "react";

import { Bonework, useBonework } from "bonework";

import { cattery, type Cat } from "./cattery";
import mark from "./mark.png";
import * as styles from "./styles";

function CatBio({ actual }: { actual: string | null }): ReactElement | null {
  const bonework = useBonework();
  const bio = bonework.placeholder(
    actual,
    "Just stepped through the cattery door. Give the staff a moment to write up the paperwork.",
  );
  return bio == null ? null : <>{bio}</>;
}

const client = new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity, refetchOnWindowFocus: false },
  },
});

const placeholder: Cat = {
  id: "__placeholder__",
  name: "A new arrival",
  breed: "Settling in",
  avatar:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23edeafd'/></svg>",
  bio: null,
  age: 0,
};

function Cattery(): ReactElement {
  const initial = useQuery({
    queryKey: ["cats", "initial"],
    queryFn: () => cattery.initial(),
  });

  const [adopted, setAdopted] = useState<Cat[]>([]);
  const [pending, setPending] = useState<string[]>([]);

  const adoption = useMutation({
    mutationFn: () => cattery.adopt(),
    onMutate() {
      const pendingId = `__loading_${Date.now()}__`;
      setPending((current) => [...current, pendingId]);
      return { pendingId };
    },
    onSuccess(cat, _variables, context) {
      setPending((current) =>
        current.filter((id) => id !== context?.pendingId),
      );
      setAdopted((current) => [...current, cat]);
    },
  });

  const isLoadingInitial = !initial.data;
  const initialCats: Cat[] = initial.data ?? [
    { ...placeholder, id: "__loading_initial_0__" },
    { ...placeholder, id: "__loading_initial_1__" },
  ];
  const cats: Cat[] = [
    ...initialCats,
    ...adopted,
    ...pending.map((id) => ({ ...placeholder, id })),
  ];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <img src={mark} alt="" className={styles.brandMark} />
          <strong>Bonework Cattery</strong>
        </div>
        <button
          type="button"
          className={styles.button}
          onClick={() => adoption.mutate()}
        >
          Adopt a new cat
        </button>
      </header>

      <h2 className={styles.sectionTitle}>Currently in our care</h2>

      <div className={styles.grid}>
        {cats.map((cat) => {
          const skeleton =
            cat.id.startsWith("__loading_") ||
            (isLoadingInitial && cat.id.startsWith("__loading_initial_"));
          return (
            <Bonework
              key={cat.id}
              skeleton={skeleton}
              palette={styles.palette}
              levels={2}
            >
              <article className={styles.card}>
                <img
                  src={cat.avatar}
                  alt={cat.name}
                  width={120}
                  height={120}
                  className={styles.avatar}
                />
                <h3 className={styles.name}>{cat.name}</h3>
                <p className={styles.meta}>
                  {cat.breed} · {cat.age} yr
                </p>
                <p className={styles.bio}>
                  <CatBio actual={cat.bio} />
                </p>
              </article>
            </Bonework>
          );
        })}
      </div>
    </main>
  );
}

export function App(): ReactElement {
  return (
    <QueryClientProvider client={client}>
      <Cattery />
    </QueryClientProvider>
  );
}
