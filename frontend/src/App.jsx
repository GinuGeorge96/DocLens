import { useState } from 'react'
import UploadPanel from './components/UploadPanel'
import QAPanel from './components/QAPanel'
import InsightsPanel from './components/InsightsPanel'

export default function App() {
  const [uploadData, setUploadData] = useState(null)

  const handleUploadSuccess = (data) => {
    setUploadData(data)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-600">DocLens</h1>
          <p className="text-sm text-gray-400">Document Intelligence Platform</p>
        </div>
        {uploadData && (
          <button
            onClick={() => setUploadData(null)}
            className="text-sm text-gray-500 hover:text-red-500 border border-gray-300 hover:border-red-400 px-3 py-1 rounded-lg transition"
          >
            Upload new file
          </button>
        )}
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {!uploadData ? (
          <div className="max-w-xl mx-auto mt-20 bg-white rounded-2xl shadow">
            <UploadPanel onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow min-h-[600px] flex flex-col">
              {uploadData.file_type === 'pdf' ? (
                <QAPanel filename={uploadData.filename} />
              ) : (
                <div className="p-6 text-gray-400 text-sm">
                  Q&A is only available for PDF files.
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow min-h-[600px]">
              {uploadData.file_type === 'csv' ? (
                <InsightsPanel file={uploadData.file} filename={uploadData.filename} />
              ) : (
                <div className="p-6 text-gray-400 text-sm">
                  Upload a CSV file to see insights.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
