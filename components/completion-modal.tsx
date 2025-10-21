"use client"

import { Button } from "@/components/ui/button"

interface CompletionModalProps {
  foundWords: number
  totalWords: number
  score: number
  timeLeft: number
  onClose: () => void
}

export default function CompletionModal({ foundWords, totalWords, score, timeLeft, onClose }: CompletionModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 slide-up">
      <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-6 sm:p-8 max-w-md w-full text-center bounce-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4">Congratulations!</h2>

        <div className="mb-6 space-y-3">
          <p className="text-lg sm:text-xl text-yellow-300">
            You have completed{" "}
            <span className="font-bold text-yellow-400">
              {foundWords}/{totalWords}
            </span>{" "}
            ChainGrid
          </p>

          <div className="bg-gray-800 border-2 border-yellow-400 p-4 rounded">
            <p className="text-yellow-600 text-sm mb-2">Final Score</p>
            <p className="text-3xl sm:text-4xl font-bold text-yellow-400">{score}</p>
          </div>

          <div className="bg-gray-800 border-2 border-yellow-400 p-3 rounded">
            <p className="text-yellow-600 text-sm mb-1">Time Remaining</p>
            <p className="text-xl sm:text-2xl font-bold text-yellow-400">{timeLeft}s</p>
          </div>
        </div>

        <div className="bg-yellow-400 text-black p-3 rounded mb-6 font-semibold text-sm sm:text-base">
          You can play again tomorrow at 00:00 WIB
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 btn-transition py-2 sm:py-3 text-base sm:text-lg"
        >
          Close
        </Button>
      </div>
    </div>
  )
}
