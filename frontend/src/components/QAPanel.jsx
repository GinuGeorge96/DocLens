import { useState } from 'react'
import { askQuestion } from '../services/api'

export default function QAPanel({ filename }) {
    const [question, setQuestion] = useState('')
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)

    const handleAsk = async () => {
        if (!question.trim()) return
        setLoading(true)
        try {
            const res = await askQuestion(question)
            setHistory(prev => [...prev, {
                question,
                answer: res.data.answer,
                sources: res.data.sources,
                scores: res.data.relevance_scores
            }])

            setQuestion('')
        } catch (err) {
            setHistory(prev => [...prev, {
                question,
                answer: 'Error getting answer. Please try again.',
                sources: []
            }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Q&A — <span className="text-blue-500">{filename}</span>
            </h3>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {history.length === 0 && (
                    <p className="text-gray-400 text-sm">Ask anything about your document...</p>
                )}
                {history.map((item, i) => (
                    <div key={i} className="space-y-2">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-gray-500">DocLens</p>
                                {item.scores && item.scores[0] && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
        ${item.scores[0] >= 70 ? 'bg-green-100 text-green-600' :
                                            item.scores[0] >= 40 ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-red-100 text-red-600'}`}>
                                        {item.scores[0]}% match
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-800">{item.answer}</p>
                            {item.sources.length > 0 && (
                                <details className="mt-2">
                                    <summary className="text-xs text-blue-400 cursor-pointer">View sources</summary>
                                    {item.sources.map((s, j) => (
                                        <p key={j} className="text-xs text-gray-400 mt-1 border-l-2 border-blue-200 pl-2">{s}</p>
                                    ))}
                                </details>
                            )}
                        </div>

                    </div>
                ))}
                {loading && (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                )}

            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAsk()}
                    placeholder="Ask a question..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
                <button
                    onClick={handleAsk}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                    Ask
                </button>
            </div>
        </div>
    )
}
