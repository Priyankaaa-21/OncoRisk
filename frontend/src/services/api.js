/**
 * OncoRisk API client service.
 * Handles prediction endpoints, image uploads, RAG chatbot, authentication, and history.
 */

// Support custom remote backend in production (e.g. Render / Railway) or local proxy
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function getAuthHeader() {
  const token = localStorage.getItem('oncorisk_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errData = await response.json();
      errorMsg = errData.detail || errData.message || errorMsg;
    } catch {
      errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Cancer Predictions
  predictCancer: (cancerType, payload) =>
    request(`/predict/${cancerType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  predictSkin: (formData) => {
    // If formData is FormData instance, fetch automatically sets multipart boundary
    const isFormData = formData instanceof FormData;
    return request('/predict/skin', {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? formData : JSON.stringify(formData),
    });
  },

  getExplanation: (assessmentId) => request(`/explain/${assessmentId}`),

  // ML Benchmarks & Performance Metrics
  getModelMetrics: () => request('/model-metrics'),

  // AI Health Assistant (RAG)
  sendChatMessage: (message, conversationHistory = []) =>
    request('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversation_history: conversationHistory }),
    }),

  // User Auth & Profiles
  register: (email, password, fullName) =>
    request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  getProfile: () => request('/auth/me'),

  // History & Risk Trend
  getHistory: () => request('/assessments/history'),

  deleteMyData: (deleteAccount = false) =>
    request(`/assessments/my-data?delete_account=${deleteAccount}`, {
      method: 'DELETE',
    }),
};
