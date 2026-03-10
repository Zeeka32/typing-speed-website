"use client";
import { Header } from "@/components/header/header";
import { Results } from "@/components/results/results";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Results
        mainText="Test Completed!"
        buttonText="Go Again"
        icon="/assets/images/icon-completed.svg"
        subText="Solid Run Keep Pushing to beat your high score."
      />
    </main>
  );
}
