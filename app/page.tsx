"use client";
import { Header } from "@/components/header/header";
import { Results } from "@/components/results/results";
import { TypingTest } from "@/components/typingTest/typingTest";
import { useTestProvider } from "@/context/TestContext";

export default function Home() {
  const { state } = useTestProvider();

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      {state.status == "completed" && <Results />}
      <TypingTest />
    </main>
  );
}
