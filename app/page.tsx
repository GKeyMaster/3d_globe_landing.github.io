import { CountdownHero } from "@/components/CountdownHero";
import { DayGrid } from "@/components/DayGrid";
import { SwanLogo } from "@/components/SwanLogo";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-4 md:py-6 lg:py-8">
        <header className="text-center mb-6 md:mb-8 lg:mb-10">
          <Link href="/" className="inline-block tap-target">
            <SwanLogo className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto mb-3 md:mb-4" />
          </Link>
          <h1 className="font-heading text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-2 md:mb-3 leading-tight tracking-tight px-4">
            Valentine&apos;s Countdown
          </h1>
          <p className="font-body text-sm md:text-base lg:text-lg text-soft-gold/80 max-w-2xl mx-auto leading-relaxed px-4">
            A journey of 15 days, 444 moments, and countless reasons why you mean
            everything to me.
          </p>
        </header>

        <CountdownHero />

        <DayGrid />
      </div>
    </main>
  );
}

