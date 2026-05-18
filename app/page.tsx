"use client";
import { Header } from "@/components/header/header";
import { Results } from "@/components/results/results";
import { TypingTest } from "@/components/typingTest/typingTest";
import { useTestProvider } from "@/shared/context/TestContext";

export default function Home() {
  const { state } = useTestProvider();
  const { status } = state;

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      {status == "completed" && <Results />}
      {(status == "idle" || status == "running" || status == "ready") && (
        <TypingTest />
      )}
    </main>
  );
}
