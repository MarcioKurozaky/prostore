"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const TARGET_DATE = new Date("2025-05-14T00:00:00");

const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

export default function DealCountdown() {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

  useEffect(() => {
    setTime(calculateTimeRemaining(TARGET_DATE));
    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(TARGET_DATE);
      setTime(newTime);

      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timerInterval);
      }

      return () => clearInterval(timerInterval);
    }, 1000);
  }, []);

  if (!time) {
    return (
      <section className="my-20 text-center">
        <h3 className="text-4xl font-bold">Loading Countdown...</h3>
      </section>
    );
  }

  const isOver =
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center my-20 px-4 md:px-12">
      <div className="space-y-6">
        <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
          {isOver ? "Deal Has Ended" : "🔥 Deal of the Month"}
        </h3>
        <p className="text-muted-foreground text-lg">
          {isOver
            ? "This deal is no longer available. Check out our latest promotions!"
            : "Get ready for a shopping experience like never before with exclusive perks and amazing offers. Don’t miss out!"}
        </p>

        {!isOver && (
          <ul className="grid grid-cols-4 gap-4">
            <StatBox label="Days" value={time.days} />
            <StatBox label="Hours" value={time.hours} />
            <StatBox label="Minutes" value={time.minutes} />
            <StatBox label="Seconds" value={time.seconds} />
          </ul>
        )}

        <Button asChild className="mt-4 w-fit">
          <Link href="/search">{isOver ? "View New Deals" : "Shop Now"}</Link>
        </Button>
      </div>

      <div className="flex justify-center">
        <Image
          src={
            isOver
              ? "/images/sample-products/p6-1.jpg"
              : "/images/sample-products/p5-1.jpg"
          }
          alt="promotion"
          width={450}
          height={350}
          className="rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className="bg-muted text-primary rounded-xl shadow-sm p-4 text-center">
    <p className="text-3xl font-extrabold">{value}</p>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
  </li>
);
