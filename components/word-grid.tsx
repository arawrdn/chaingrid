"use client"

import { useState } from "react"
import type { WordLocation } from "@/lib/word-search"

interface WordGridProps {
  grid: string[][]
  words: string[]
  foundWords: Set<string>
  wordLocations: Map<string, WordLocation>
  onWordFound: (word: string) => void
  isGameActive: boolean
}

export default function WordGrid({ grid, words, foundWords, wordLocations, onWordFound, isGameActive }: WordGridProps) {
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([])
  const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set())
  const [errorAlert, setErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleCellClick = (row: number, col: number) => {
    if (!isGameActive) return

    const cellKey = `${row},${col}`
    const newSelected = [...selectedCells]
    const existingIndex = newSelected.findIndex(([r, c]) => r === row && c === col)

    if (existingIndex >= 0) {
      newSelected.splice(existingIndex, 1)
    } else {
      newSelected.push([row, col])
    }

    setSelectedCells(newSelected)
    checkForWord(newSelected)
  }

  const checkForWord = (cells: [number, number][]) => {
    if (cells.length < 3) return

    const selectedWord = cells.map(([r, c]) => grid[r][c]).join("")

    for (const word of words) {
      if (foundWords.has(word)) continue

      const location = wordLocations.get(word)
      if (!location) continue

      // Check if selected cells match the word
      const wordCells = location.cells
      if (
        cells.length === wordCells.length &&
        cells.every(([r, c], i) => r === wordCells[i][0] && c === wordCells[i][1])
      ) {
        onWordFound(word)

        const cellKeys = cells.map(([r, c]) => `${r},${c}`)
        setAnimatingCells(new Set(cellKeys))
        setTimeout(() => setAnimatingCells(new Set()), 600)

        setSelectedCells([])
        setErrorAlert(false)
        return
      }
    }

    if (cells.length >= 3) {
      setErrorMessage(`"${selectedWord}" is not a valid word!`)
      setErrorAlert(true)
      setTimeout(() => setErrorAlert(false), 2000)
    }
  }

  const handleClear = () => {
    setSelectedCells([])
    setErrorAlert(false)
  }

  return (
    <div className="space-y-4 flex flex-col items-center">
      {errorAlert && (
        <div className="bg-red-900 border-2 border-red-500 text-red-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base animate-pulse w-full max-w-md">
          ❌ {errorMessage}
        </div>
      )}

      <div className="flex justify-center w-full">
        <div className="bg-gray-900 border-2 border-yellow-400 p-2 sm:p-4 rounded-lg">
          <div className="grid gap-0.5 sm:gap-1" style={{ gridTemplateColumns: "repeat(9, minmax(0, 1fr))" }}>
            {grid.map((row, rowIdx) =>
              row.map((letter, colIdx) => {
                const cellKey = `${rowIdx},${colIdx}`
                const isSelected = selectedCells.some(([r, c]) => r === rowIdx && c === colIdx)
                const isAnimating = animatingCells.has(cellKey)
                const isFoundCell = Array.from(foundWords).some((word) => {
                  const location = wordLocations.get(word)
                  return location?.cells.some(([r, c]) => r === rowIdx && c === colIdx)
                })

                return (
                  <button
                    key={cellKey}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 font-bold text-xs sm:text-sm rounded
                      btn-transition
                      ${isAnimating ? "cell-found" : ""}
                      ${isFoundCell ? "bg-green-500 text-black shadow-lg font-bold" : ""}
                      ${isSelected && !isFoundCell ? "bg-yellow-400 text-black scale-105 font-bold" : ""}
                      ${!isSelected && !isFoundCell ? "bg-gray-800 text-yellow-400 hover:bg-gray-700 hover:scale-105" : ""}
                    `}
                    disabled={!isGameActive}
                  >
                    {letter}
                  </button>
                )
              }),
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap justify-center w-full">
        <button
          onClick={handleClear}
          className="px-3 sm:px-4 py-2 bg-gray-800 text-yellow-400 border border-yellow-400 rounded hover:bg-gray-700 btn-transition text-sm sm:text-base"
        >
          Clear Selection
        </button>
      </div>
    </div>
  )
}
