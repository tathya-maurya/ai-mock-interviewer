import axios from 'axios'

const BASE_URL = 'https://ai-mock-interviewer-production-d3c6.up.railway.app'

export const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export const getAllInterviews = () =>
  axios.get(`${BASE_URL}/interview/all`, getAuthHeader())

export const scheduleInterview = (topic) =>
  axios.post(`${BASE_URL}/interview/schedule`, { interviewTopic: topic }, getAuthHeader())

export const startInterview = (id) =>
  axios.get(`${BASE_URL}/interview/start/${id}`, getAuthHeader())

export const submitAnswer = (questionId, answer) =>
  axios.post(`${BASE_URL}/interview/submit-answer`, { questionId, answer }, getAuthHeader())

export const getScore = (id) =>
  axios.get(`${BASE_URL}/interview/${id}/score`, getAuthHeader())

export const resumeInterview = (id) =>
  axios.get(`${BASE_URL}/interview/resume/${id}`, getAuthHeader())

