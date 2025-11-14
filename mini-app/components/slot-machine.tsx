"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"] as const;
type Fruit = typeof fruits[number];

function randomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(
    Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => randomFruit())
    )
  );
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(false);
    const interval = setInterval(() => {
      setGrid((prev) =>
        prev.map((col) => {
          const newCol = [...col];
          newCol.pop(); // remove bottom
          newCol.unshift(randomFruit()); // add new at top
          return newCol;
        })
      );
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      // check center row
      const centerRow = grid.map((col) => col[1]);
      if (centerRow.every((f) => f === centerRow[0])) {
        setWin(true);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((fruit, rowIdx) => (
            <img
              key={`${colIdx}-${rowIdx}`}
              src={`/${fruit}.png`}
              alt={fruit}
              width={80}
              height={80}
              className="rounded-md"
            />
          ))
        )}
      </div>
      <Button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {win && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">You won!</p>
          <Share text={`I just won a fruit slot machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
