"use client"

import { useEffect, useState } from "react"

interface GameStatsProps {
  score: number
  timeLeft: number
  foundWords: number
  totalWords: number
  isGameActive: boolean
  onGameEnd: () => void
}

export default function GameStats({
  score,
  timeLeft,
  foundWords,
  totalWords,
  isGameActive,
  onGameEnd,
}: GameStatsProps) {
  const [prevScore, setPrevScore] = useState(score)
  const [scoreAnimating, setScoreAnimating] = useState(false)

  useEffect(() => {
    if (timeLeft === 0 && isGameActive) {
      onGameEnd()
    }
  }, [timeLeft, isGameActive, onGameEnd])

  useEffect(() => {
    if (score !== prevScore) {
      setScoreAnimating(true)
      setPrevScore(score)
      const timer = setTimeout(() => setScoreAnimating(false), 400)
      return () => clearTimeout(timer)
    }
  }, [score, prevScore])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
      <div className="bg-gray-900 border-2 border-yellow-400 p-3 sm:p-4 rounded-lg text-center card-transition hover:border-yellow-300">
        <div className="text-yellow-600 text-xs sm:text-sm">Score</div>
        <div className={`text-xl sm:text-2xl font-bold text-yellow-400 ${scoreAnimating ? "score-pop" : ""}`}>
          {score}
        </div>
      </div>

      <div
        className={`bg-gray-900 border-2 p-3 sm:p-4 rounded-lg text-center card-transition ${
          timeLeft <= 30 ? "border-red-400 hover:border-red-300" : "border-yellow-400 hover:border-yellow-300"
        }`}
      >
        <div className="text-yellow-600 text-xs sm:text-sm">Time</div>
        <div className={`text-xl sm:text-2xl font-bold ${timeLeft <= 30 ? "text-red-400" : "text-yellow-400"}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="bg-gray-900 border-2 border-yellow-400 p-3 sm:p-4 rounded-lg text-center card-transition hover:border-yellow-300">
        <div className="text-yellow-600 text-xs sm:text-sm">Found</div>
        <div className="text-xl sm:text-2xl font-bold text-yellow-400">
          {foundWords}/{totalWords}
        </div>
      </div>

      <div className="bg-gray-900 border-2 border-yellow-400 p-3 sm:p-4 rounded-lg text-center card-transition hover:border-yellow-300">
        <div className="text-yellow-600 text-xs sm:text-sm">Status</div>
        <div className={`text-base sm:text-lg font-bold ${isGameActive ? "text-green-400" : "text-red-400"}`}>
          {isGameActive ? "Playing" : "Ended"}
        </div>
      </div>
    </div>
  )
}
