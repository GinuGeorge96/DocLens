import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
})

export const uploadFile = (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  return API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      const percent = Math.round((e.loaded * 100) / e.total)
      if (onProgress) onProgress(percent)
    },
  })
}

export const askQuestion = (question) => {
  return API.post('/qa', { question })
}

export const getInsights = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return API.post('/insights', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
