import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest) {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                refresh: refreshToken,
              });

              const { access } = response.data;
              localStorage.setItem('access_token', access);

              // Retry original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${access}`;
              }
              return this.client(originalRequest);
            } catch (refreshError) {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  register(email: string, password: string, role: string) {
    return this.client.post('/accounts/register/', {
      email,
      password,
      role,
    });
  }

  login(email: string, password: string) {
    return this.client.post<AuthResponse>('/accounts/login/', {
      email,
      password,
    });
  }

  logout(refreshToken: string) {
    return this.client.post('/accounts/logout/', {
      refresh: refreshToken,
    });
  }

  refreshToken(refreshToken: string) {
    return this.client.post<{ access: string }>('/token/refresh/', {
      refresh: refreshToken,
    });
  }

  // Candidate Profile endpoints
  getCandidateProfile() {
    return this.client.get('/accounts/profile/candidate/');
  }

  updateCandidateProfile(data: FormData | Record<string, any>) {
    return this.client.patch('/accounts/profile/candidate/', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  }

  // Recruiter Profile endpoints
  getRecruiterProfile() {
    return this.client.get('/accounts/profile/recruiter/');
  }

  updateRecruiterProfile(data: FormData | Record<string, any>) {
    return this.client.post('/accounts/profile/recruiter/', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  }

  // Job endpoints
  getJobs(params?: Record<string, any>) {
    return this.client.get('/jobs/', { params });
  }

  getRecruiterJobs() {
    return this.client.get('/jobs/');
  }

  getJobById(id: number) {
    return this.client.get(`/jobs/${id}/`);
  }

  createJob(data: Record<string, any>) {
    return this.client.post('/jobs/', data);
  }

  updateJob(id: number, data: Record<string, any>) {
    return this.client.patch(`/jobs/${id}/`, data);
  }

  deleteJob(id: number) {
    return this.client.delete(`/jobs/${id}/`);
  }

  // Job Application endpoints
  applyForJob(jobId: number) {
    return this.client.post(`/jobs/${jobId}/apply/`);
  }

  getJobApplications(jobId: number) {
    return this.client.get(`/jobs/${jobId}/applications/`);
  }

  updateApplicationStatus(applicationId: number, status: string) {
    return this.client.patch(`/jobs/recruiter/applications/${applicationId}/status/`, {
      status,
    });
  }

  getApplications(params?: Record<string, any>) {
    return this.client.get('/jobs/applications/', { params });
  }

  // Resume endpoints
  uploadResume(file: File) {
    const formData = new FormData();
    formData.append('resume', file);
    return this.client.post('/resumes/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  getResumes() {
    return this.client.get('/resumes/');
  }

  deleteResume(id: number) {
    return this.client.delete(`/resumes/${id}/`);
  }

  // Generic request method
  get<T = any>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: any) {
    return this.client.patch<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export default new APIClient();
