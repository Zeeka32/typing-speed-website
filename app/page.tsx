"use client";
import { Header } from "@/components/header/header";
import { Results } from "@/components/results/results";
import { useTestProvider } from "@/context/TestContext";

export default function Home() {
  const { state } = useTestProvider();

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      {state.status == "completed" && <Results />}
    </main>
  );
}
