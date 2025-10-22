"use client"

import { useState, useEffect } from "react"
import { DAILY_THEMES } from "@/lib/themes"
import { generateGrid, findWords, type WordLocation } from "@/lib/word-search"
import WordGrid from "@/components/word-grid"
import GameStats from "@/components/game-stats"
import CompletionModal from "@/components/completion-modal"
import TimeoutModal from "@/components/timeout-modal"
import { useWeb3ScoreSubmission } from '@/hooks/useWeb3ScoreSubmission'; 

interface GameBoardProps {
  username: string
  walletAddress: string
  onGameComplete?: () => void
}

export default function GameBoard({ username, walletAddress, onGameComplete }: GameBoardProps) {
  const { submitScore, isSubmitting, isSuccess, error } = useWeb3ScoreSubmission();

  const [gameState, setGameState] = useState<{
    grid: string[][]
    foundWords: Set<string>
    score: number
    timeLeft: number
    isGameActive: boolean
    selectedCells: [number, number][]
    wordLocations: Map<string, WordLocation>
  } | null>(null)

  const [theme, setTheme] = useState<(typeof DAILY_THEMES)[0] | null>(null)
  const [showCompletion, setShowCompletion] = useState(false)
  const [showTimeout, setShowTimeout] = useState(false)
  const [hasPlayedToday, setHasPlayedToday] = useState(false)

  useEffect(() => {
    // Get today's theme based on WIB timezone
    const now = new Date()
    const wibTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))
    const dayOfYear = Math.floor((wibTime.getTime() - new Date(wibTime.getFullYear(), 0, 0).getTime()) / 86400000)
    const themeIndex = dayOfYear % DAILY_THEMES.length
    const todayTheme = DAILY_THEMES[themeIndex]
    setTheme(todayTheme)

    const lastPlayDate = localStorage.getItem(`chaingrid_last_play_${username}`)
    const today = new Date().toISOString().split("T")[0]

    if (lastPlayDate === today) {
      setHasPlayedToday(true)
      return
    }

    // Initialize game
    const grid = generateGrid(9, 9, todayTheme.words)
    const wordLocations = findWords(grid, todayTheme.words)

    setGameState({
      grid,
      foundWords: new Set(),
      score: 0,
      timeLeft: 120,
      isGameActive: true,
      selectedCells: [],
      wordLocations,
    })
  }, [username])

  useEffect(() => {
    if (!gameState?.isGameActive) return

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (!prev) return null
        const newTimeLeft = prev.timeLeft - 1
        if (newTimeLeft <= 0) {
          setShowTimeout(true)
          const today = new Date().toISOString().split("T")[0]
          localStorage.setItem(`chaingrid_last_play_${username}`, today)
          onGameComplete?.()
          return { ...prev, timeLeft: 0, isGameActive: false }
        }
        return { ...prev, timeLeft: newTimeLeft }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState?.isGameActive, username, onGameComplete])

  const handleWordFound = (word: string) => {
    if (!gameState || gameState.foundWords.has(word)) return

    const newFoundWords = new Set(gameState.foundWords)
    newFoundWords.add(word)

    let newScore = gameState.score + 10
    const isComplete = newFoundWords.size === theme?.words.length
    if (isComplete) {
      newScore += 50
    }

    setGameState((prev) => {
      if (!prev) return null
      return {
        ...prev,
        foundWords: newFoundWords,
        score: newScore,
        isGameActive: !isComplete,
        timeLeft: isComplete ? prev.timeLeft : prev.timeLeft,
      }
    })

    if (isComplete) {
      setShowCompletion(true)
      const today = new Date().toISOString().split("T")[0]
      localStorage.setItem(`chaingrid_last_play_${username}`, today)
      onGameComplete?.()
      
      // Submit score on-chain (Full Completion)
      submitScore(newScore);
    }
  }

  const handleGameEnd = () => {
    if (!gameState) return

    // Submit score on-chain (Manual End/Timeout Score)
    submitScore(gameState.score);
    
    setGameState((prev) => (prev ? { ...prev, isGameActive: false } : null))
  }

  if (hasPlayedToday) {
    return (
      <div className="bg-gray-900 border-2 border-yellow-400 p-6 sm:p-8 rounded-lg text-center slide-up">
        <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4">Already Played Today!</h2>
        <p className="text-yellow-300 mb-4">You can only play once every 24 hours.</p>
        <p className="text-yellow-600 text-sm">Come back tomorrow at 00:00 WIB for a new challenge!</p>
      </div>
    )
  }

  if (!gameState || !theme) {
    return <div className="text-center text-yellow-400 slide-up">Loading game...</div>
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-gray-900 border-2 border-yellow-400 p-3 sm:p-4 rounded-lg card-transition slide-down">
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Today's Theme: {theme.name}</h2>
          <div className="flex flex-wrap gap-2">
            {theme.clues.map((clue, i) => (
              <span
                key={i}
                className="bg-yellow-400 text-black px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold btn-transition hover:bg-yellow-300"
              >
                {clue}
              </span>
            ))}
          </div>
        </div>

        <GameStats
          score={gameState.score}
          timeLeft={gameState.timeLeft}
          foundWords={gameState.foundWords.size}
          totalWords={theme.words.length}
          isGameActive={gameState.isGameActive}
          onGameEnd={handleGameEnd}
        />

        {/* Web3 Submission Status */}
        <div className="text-center text-sm">
            {isSubmitting && <p className="text-blue-400">Submitting score on-chain...</p>}
            {isSuccess && <p className="text-green-500">✅ Score saved successfully!</p>}
            {error && <p className="text-red-500">❌ Submission Error: {error.message || "Check wallet/network"}</p>}
        </div>

        <WordGrid
          grid={gameState.grid}
          words={theme.words}
          foundWords={gameState.foundWords}
          wordLocations={gameState.wordLocations}
          onWordFound={handleWordFound}
          isGameActive={gameState.isGameActive}
        />

        <div className="bg-gray-900 border-2 border-yellow-400 p-3 sm:p-4 rounded-lg card-transition">
          <h3 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base">
            Found Words ({gameState.foundWords.size}/{theme.words.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {theme.words.map((word) => (
              <span
                key={word}
                className={`px-2 sm:px-3 py-1 rounded font-semibold text-xs sm:text-sm btn-transition ${
                  gameState.foundWords.has(word)
                    ? "bg-yellow-400 text-black shadow-md"
                    : "bg-gray-800 text-yellow-600 hover:bg-gray-700"
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {showCompletion && (
        <CompletionModal
          foundWords={gameState.foundWords.size}
          totalWords={theme.words.length}
          score={gameState.score}
          timeLeft={gameState.timeLeft}
          onClose={() => setShowCompletion(false)}
        />
      )}

      {showTimeout && (
        <TimeoutModal
          foundWords={gameState.foundWords.size}
          totalWords={theme.words.length}
          score={gameState.score}
          onClose={() => setShowTimeout(false)}
        />
      )}
    </>
  )
}
