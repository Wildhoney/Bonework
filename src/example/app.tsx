import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";

import { Bonework } from "bonework";

import { cattery, type Cat } from "./cattery";
import * as styles from "./styles";

const client = new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity, refetchOnWindowFocus: false },
  },
});

const placeholderCat: Cat = {
  id: "__placeholder__",
  name: "A new arrival",
  breed: "Settling in",
  avatar: "https://placehold.co/200x200/edeafd/3c1b72?text=%3F",
  bio: "Just stepped through the cattery door. Give the staff a moment to write up the paperwork.",
  age: 0,
};

function Cattery() {
  const queryClient = useQueryClient();
  const [cats, setCats] = useState<Cat[]>(cattery.initial);

  const adoption = useMutation({
    mutationFn: () => cattery.adopt(),
    onMutate() {
      setCats((current) => [
        ...current,
        { ...placeholderCat, id: `__loading_${Date.now()}__` },
      ]);
    },
    onSuccess(cat) {
      setCats((current) =>
        current.map((entry) =>
          entry.id.startsWith("__loading_") ? cat : entry,
        ),
      );
      void queryClient.invalidateQueries({ queryKey: ["cats"] });
    },
  });

  const isAdopting = adoption.isPending;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>B</span>
          <strong>Bonework Cattery</strong>
        </div>
        <button
          type="button"
          className={styles.button}
          onClick={() => adoption.mutate()}
          disabled={isAdopting}
        >
          {isAdopting ? "Adoption in progress…" : "Adopt a new cat"}
        </button>
      </header>

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>The bones of every loading state.</h1>
        <p className={styles.heroLead}>
          Click <em>Adopt a new cat</em>. The paperwork takes five seconds —
          long enough to see Bonework paint a shimmer over the new card while
          the existing ones stay perfectly still.
        </p>
      </section>

      <h2 className={styles.sectionTitle}>Currently in our care</h2>

      <div className={styles.grid}>
        {cats.map((cat) => {
          const isLoading = cat.id.startsWith("__loading_");
          return (
            <Bonework
              key={cat.id}
              resolving={!isLoading}
              palette={styles.palette}
              levels={3}
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
                <p className={styles.bio}>{cat.bio}</p>
              </article>
            </Bonework>
          );
        })}
      </div>
    </main>
  );
}

export function App() {
  return (
    <QueryClientProvider client={client}>
      <Cattery />
    </QueryClientProvider>
  );
}
