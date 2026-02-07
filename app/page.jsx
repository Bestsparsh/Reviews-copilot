"use client"

import { useEffect, useState } from "react"
import { api } from "../lib/api"
import ReviewsTable from "../components/ReviewsTable"
import AnalyticsCards from "../components/AnalyticsCards"

export default function Dashboard() {
  const [reviews, setReviews] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load(filters = {}) {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (filters.page) params.append("skip", (filters.page - 1) * 20)
      if (filters.location) params.append("location", filters.location)
      if (filters.sentiment) params.append("sentiment", filters.sentiment)
      if (filters.q) params.append("q", filters.q)
      
      const queryString = params.toString()
      const reviewsData = await api(`/reviews${queryString ? '?' + queryString : ''}`)
      const analyticsData = await api("/analytics")

      setReviews(reviewsData.reviews || [])
      setPagination(reviewsData.pagination || null)
      setAnalytics(analyticsData)
    } catch (err) {
      setError(err.message)
      console.error("Failed to load data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (error) {
    return (
      <main className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <strong>Error:</strong> {error}
        </div>
      </main>
    )
  }

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-black">Reviews Copilot</h1>

      {analytics && <AnalyticsCards data={analytics} />}

      <ReviewsTable 
        reviews={reviews} 
        pagination={pagination}
        reload={load}
        loading={loading}
      />
    </main>
  )
}
