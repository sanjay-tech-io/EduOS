import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

export const getClassrooms = () => API.get('/classrooms');
export const getClassroom = (id) => API.get(`/classrooms/${id}`);
export const createClassroom = (data) => API.post('/classrooms', data);
export const enrollStudent = (classroomId, studentId) => API.post(`/classrooms/${classroomId}/enroll`, { student_id: studentId });

export const markAttendance = (studentId, classroomId, data) => API.post(`/classrooms/${classroomId}/attendance`, { student_id: studentId, ...data });
export const getAttendance = (classroomId) => API.get(`/classrooms/${classroomId}/attendance`);
export const getMyAttendance = () => API.get('/classrooms/attendance/my');

export const enterMarks = (studentId, classroomId, data) => API.post(`/classrooms/${classroomId}/marks`, { student_id: studentId, ...data });
export const getMarks = (classroomId) => API.get(`/classrooms/${classroomId}/marks`);
export const getMyMarks = () => API.get('/classrooms/marks/my');

export const getCirculars = () => API.get('/circulars');
export const createCircular = (data) => API.post('/circulars', data);

export const getAnalytics = () => API.get('/analytics');

export const getStudents = () => API.get('/users/students');
export const getStudentsByDepartment = (department) => API.get(`/users/students?department=${department}`);
export const getFaculty = () => API.get('/users/faculty');
export const getStudentById = (id) => API.get(`/users/students/${id}`);

export const askAI = (message) => API.post('/ai/assistant', { message });

export default API;
