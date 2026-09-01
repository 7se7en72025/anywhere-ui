"use client";

import React from "react";

export interface QrCodeProps {
  value: string;
  size?: number;
  ariaLabel?: string;
}

function generateMatrix(value: string): boolean[][] {
  const len = value.length;
  const size = Math.max(21, Math.ceil(len / 4) * 4 + 21);
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  const placeFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = row + r;
        const cc = col + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        const inBorder =
          r === -1 || r === 7 || c === -1 || c === 7;
        const inInner =
          (r >= 2 && r <= 4) && (c >= 2 && c <= 4);
        matrix[rr][cc] = inBorder || inInner;
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  let charIndex = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (matrix[i][j]) continue;
      if (
        (i < 9 && j < 9) ||
        (i < 9 && j >= size - 8) ||
        (i >= size - 8 && j < 9) ||
        i === 6 ||
        j === 6
      )
        continue;
      const charCode = value.charCodeAt(charIndex % len);
      matrix[i][j] = ((charCode >> (charIndex % 8)) & 1) === 1;
      charIndex++;
    }
  }

  return matrix;
}

export function QrCode({
  value,
  size = 128,
  ariaLabel,
}: QrCodeProps) {
  const matrix = generateMatrix(value);
  const cellSize = size / matrix.length;

  const pathData = matrix
    .flatMap((row, y) =>
      row
        .map((cell, x) =>
          cell
            ? `M${x * cellSize},${y * cellSize}h${cellSize}v${cellSize}h-${cellSize}z`
            : ""
        )
        .filter(Boolean)
    )
    .join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel || `QR code for: ${value}`}
      style={{ display: "block" }}
    >
      <rect width={size} height={size} fill="#fff" />
      <path d={pathData} fill="#000" />
    </svg>
  );
}
