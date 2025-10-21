"use client"

import { useState, useEffect } from "react"

interface LeaderboardEntry {
  username: string
  score: number
  date: string
  address: string
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [animatingIndices, setAnimatingIndices] = useState<Set<number>>(new Set())
  const [viewMode, setViewMode] = useState<"today" | "alltime">("today")

  useEffect(() => {
    const loadLeaderboard = () => {
      const allEntries = JSON.parse(localStorage.getItem("chaingrid_leaderboard") || "[]")

      let displayEntries: LeaderboardEntry[] = []

      if (viewMode === "today") {
        const today = new Date().toISOString().split("T")[0]
        displayEntries = allEntries
          .filter((e: LeaderboardEntry) => e.date === today)
          .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score)
          .slice(0, 10)
      } else {
        const allTimeMap = new Map<string, { username: string; score: number; address: string }>()

        allEntries.forEach((entry: LeaderboardEntry) => {
          const existing = allTimeMap.get(entry.username)
          if (existing) {
            existing.score += entry.score
          } else {
            allTimeMap.set(entry.username, {
              username: entry.username,
              score: entry.score,
              address: entry.address,
            })
          }
        })

        displayEntries = Array.from(allTimeMap.values())
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
      }

      // Animate new entries
      setAnimatingIndices(new Set(displayEntries.map((_, i) => i)))
      setTimeout(() => setAnimatingIndices(new Set()), 500)

      setEntries(displayEntries)
    }

    loadLeaderboard()
    const interval = setInterval(loadLeaderboard, 5000)
    return () => clearInterval(interval)
  }, [viewMode])

  return (
    <div className="bg-gray-900 border-2 border-yellow-400 p-3 sm:p-4 rounded-lg card-transition">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode("today")}
          className={`px-3 sm:px-4 py-2 rounded font-semibold text-sm sm:text-base btn-transition ${
            viewMode === "today"
              ? "bg-yellow-400 text-black"
              : "bg-gray-800 text-yellow-400 border border-yellow-400 hover:bg-gray-700"
          }`}
        >
          Today's Leaderboard
        </button>
        <button
          onClick={() => setViewMode("alltime")}
          className={`px-3 sm:px-4 py-2 rounded font-semibold text-sm sm:text-base btn-transition ${
            viewMode === "alltime"
              ? "bg-yellow-400 text-black"
              : "bg-gray-800 text-yellow-400 border border-yellow-400 hover:bg-gray-700"
          }`}
        >
          All Time Leaderboard
        </button>
      </div>

      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
        {viewMode === "today" ? "Today's Leaderboard" : "All Time Leaderboard"}
      </h2>

      {entries.length === 0 ? (
        <p className="text-yellow-600 text-xs sm:text-sm">No scores yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <div
              key={idx}
              className={`flex justify-between items-center bg-gray-800 p-2 sm:p-3 rounded card-transition hover:bg-gray-700 ${
                animatingIndices.has(idx) ? "slide-up" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-yellow-400 text-sm sm:text-base truncate">
                  #{idx + 1} {entry.username}
                </div>
                <div className="text-yellow-600 text-xs">
                  {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                </div>
              </div>
              <div className="text-base sm:text-lg font-bold text-yellow-400 ml-2">{entry.score}</div>
            </div>
          ))}
        </div>
      )}

      <p className="text-yellow-600 text-xs mt-3 sm:mt-4 text-center">
        {viewMode === "today" ? "Resets daily at 00:00 WIB" : "Cumulative all-time scores"}
      </p>
    </div>
  )
}
