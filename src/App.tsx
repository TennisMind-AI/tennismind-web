import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './routes/Auth'
import Upload from './routes/Upload'
import Review from './routes/Review'
import History from './routes/History'

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Navigate to="/upload" replace />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/review" element={<Review />} />
      <Route path="/review/:sessionId" element={<Review />} />
      <Route path="/history" element={<History />} />
      <Route path="*" element={<Navigate to="/upload" replace />} />
    </Routes>
  )
}
