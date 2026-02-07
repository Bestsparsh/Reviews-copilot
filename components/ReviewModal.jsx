"use client"

import { useState } from "react"
import { api } from "../lib/api"

const Badge = ({ children, color }) => (
  <span className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}>
    {children}
  </span>
)

const RatingStars = ({ value }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} className={i <= value ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ))}
  </div>
)

export default function ReviewModal({ review, onClose, reload }) {
  const [reply, setReply] = useState(review.reply || "")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const sentimentColor = s => {
    if (s === "Positive") return "bg-green-100 text-green-700"
    if (s === "Negative") return "bg-red-100 text-red-700"
    return "bg-yellow-100 text-yellow-700"
  }

  async function generate() {
    setLoading(true)

    try {
      const res = await api(`/reviews/${review.id}/suggest-reply`, {
        method: "POST",
      })

      setReply(res.reply)
    } catch (error) {
      console.error("Failed to generate reply:", error)
      alert("Failed to generate reply: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    try {
      await api(`/reviews/${review.id}`, {
        method: "PATCH",
        body: JSON.stringify({ reply }),
      })

      reload()
      onClose()
    } catch (error) {
      console.error("Failed to save reply:", error)
      alert("Failed to save reply: " + error.message)
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(reply)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-[640px] rounded-2xl shadow-xl p-6 flex flex-col gap-5"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-black">Review #{review.id}</h2>
            <div className="flex gap-3 mt-2 items-center">
              <RatingStars value={review.rating} />
              <Badge color={sentimentColor(review.sentiment)}>
                {review.sentiment}
              </Badge>
              <span className="text-xs text-gray-500">{review.topic}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
          {review.text}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Suggested Reply</label>
            {reply && (
              <button
                onClick={copyToClipboard}
                className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition"
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
            )}
          </div>
          <textarea
            className="
              w-full border rounded-lg p-3
              text-gray-900 font-medium
              focus:outline-none focus:ring-2 focus:ring-blue-500
              resize-none
              placeholder:text-gray-400 placeholder:font-normal
            "
            rows={5}
            placeholder="Write or generate a reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={generate}
            disabled={loading}
            className="
              px-4 py-2 rounded-lg bg-purple-600 text-white cursor-pointer
              hover:bg-purple-700 transition disabled:opacity-50
            "
          >
            {loading ? "✨ Generating..." : "✨ AI Suggest"}
          </button>

          <button
            onClick={save}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
            Save
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-black hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
