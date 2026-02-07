export default function AnalyticsCards({ data }) {
  const sentimentData = [
    { name: "Positive", count: data.sentiment?.Positive || 0, color: "bg-green-500" },
    { name: "Neutral", count: data.sentiment?.Neutral || 0, color: "bg-yellow-500" },
    { name: "Negative", count: data.sentiment?.Negative || 0, color: "bg-red-500" },
  ]

  const topicData = Object.entries(data.topics || {}).map(([name, count]) => ({
    name,
    count,
    color: "bg-blue-500"
  }))

  const maxSentiment = Math.max(...sentimentData.map(d => d.count), 1)
  const maxTopic = Math.max(...topicData.map(d => d.count), 1)

  return (
    <div className="space-y-6">
\      <div className="grid grid-cols-3 gap-4">
        <Card title="Total Reviews" value={data.total_reviews} />
        <Card title="Avg Rating" value={data.avg_rating} />
        <Card title="Positive" value={data.sentiment?.Positive || 0} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-xl p-4 shadow-sm bg-white">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Sentiment Distribution</h3>
          <div className="space-y-3">
            {sentimentData.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500 flex items-center justify-end px-2`}
                    style={{ width: `${(item.count / maxSentiment) * 100}%` }}
                  >
                    {item.count > 0 && (
                      <span className="text-xs font-medium text-white">
                        {Math.round((item.count / data.total_reviews) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-xl p-4 shadow-sm bg-white">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Topic Breakdown</h3>
          <div className="space-y-3">
            {topicData.slice(0, 5).map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500 flex items-center justify-end px-2`}
                    style={{ width: `${(item.count / maxTopic) * 100}%` }}
                  >
                    {item.count > 0 && (
                      <span className="text-xs font-medium text-white">
                        {Math.round((item.count / data.total_reviews) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
