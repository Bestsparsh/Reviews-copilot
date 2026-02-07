"use client"

import { useState } from "react"
import ReviewModal from "./ReviewModal"

const RatingStars = ({ value }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= value ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  )
}

const Badge = ({ children, color }) => (
  <span
    className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}
  >
    {children}
  </span>
)

export default function ReviewsTable({ reviews, pagination, reload, loading }) {
  const [selected, setSelected] = useState(null)
  const [filters, setFilters] = useState({
    location: "",
    sentiment: "",
    q: "",
    page: 1
  })

  const sentimentColor = s => {
    if (s === "Positive") return "bg-green-100 text-green-700"
    if (s === "Negative") return "bg-red-100 text-red-700"
    return "bg-yellow-100 text-yellow-700"
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 }
    setFilters(newFilters)
    reload(newFilters)
  }

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage }
    setFilters(newFilters)
    reload(newFilters)
  }

  return (
    <>
      <div className="rounded-2xl border shadow-sm overflow-hidden bg-white">
        {/* Filters Section */}
        <div className="p-4 bg-gray-50 border-b flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search reviews..."
            className="px-3 py-2 border rounded-lg flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.q}
            onChange={(e) => handleFilterChange("q", e.target.value)}
          />
          
          <select
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="NYC">NYC</option>
            <option value="SF">SF</option>
            <option value="LA">LA</option>
            <option value="Chicago">Chicago</option>
            <option value="Boston">Boston</option>
          </select>

          <select
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.sentiment}
            onChange={(e) => handleFilterChange("sentiment", e.target.value)}
          >
            <option value="">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Review</th>
              <th className="p-3 text-left">Rating</th>
              <th className="p-3 text-left">Sentiment</th>
              <th className="p-3 text-left">Topic</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  Loading reviews...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((r, idx) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`
                    cursor-pointer
                    transition
                    hover:bg-gray-50
                    ${idx % 2 ? "bg-gray-50/40" : ""}
                  `}
                >
                  <td className="p-3 font-medium text-gray-700">{r.id}</td>
                  <td className="p-3 text-gray-700">{r.location}</td>
                  <td className="p-3 text-gray-500 text-xs">{r.date}</td>
                  <td className="p-3 max-w-md truncate text-gray-700">
                    {r.text}
                  </td>

                  <td className="p-3">
                    <RatingStars value={r.rating} />
                  </td>

                  <td className="p-3">
                    <Badge color={sentimentColor(r.sentiment)}>
                      {r.sentiment}
                    </Badge>
                  </td>

                  <td className="p-3 text-gray-500">
                    {r.topic}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {pagination && (
          <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.total_pages} ({pagination.total} total reviews)
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.has_prev}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-black"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.has_next}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-black"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <ReviewModal
          review={selected}
          onClose={() => setSelected(null)}
          reload={() => reload(filters)}
        />
      )}
    </>
  )
}
