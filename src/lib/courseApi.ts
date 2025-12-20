// Course management API functions
import type { Course, Lesson, Quiz, Question, Option, User, Enrollment, ApiResponse } from '@/types';
import { dataStore, delay, generateId, successResponse, errorResponse } from './api';

// ============= COURSES =============
export const createCourse = async (course: Omit<Course, 'id' | 'createdAt'>): Promise<ApiResponse<Course>> => {
  await delay();
  const newCourse: Course = {
    ...course,
    id: generateId('course'),
    createdAt: new Date().toISOString(),
  };
  dataStore.courses.push(newCourse);
  return successResponse(newCourse);
};

export const updateCourse = async (id: string, updates: Partial<Course>): Promise<ApiResponse<Course>> => {
  await delay();
  const index = dataStore.courses.findIndex(c => c.id === id);
  if (index === -1) return errorResponse('Curso no encontrado');
  
  dataStore.courses[index] = { ...dataStore.courses[index], ...updates };
  return successResponse(dataStore.courses[index]);
};

export const deleteCourse = async (id: string): Promise<ApiResponse<boolean>> => {
  await delay();
  const index = dataStore.courses.findIndex(c => c.id === id);
  if (index === -1) return errorResponse('Curso no encontrado');
  
  // Delete related data
  dataStore.lessons = dataStore.lessons.filter(l => l.courseId !== id);
  dataStore.quizzes = dataStore.quizzes.filter(q => q.courseId !== id);
  dataStore.enrollments = dataStore.enrollments.filter(e => e.courseId !== id);
  dataStore.progress = dataStore.progress.filter(p => p.courseId !== id);
  dataStore.courses.splice(index, 1);
  
  return successResponse(true);
};

// ============= LESSONS =============
export const createLesson = async (lesson: Omit<Lesson, 'id'>): Promise<ApiResponse<Lesson>> => {
  await delay();
  const newLesson: Lesson = {
    ...lesson,
    id: generateId('lesson'),
  };
  dataStore.lessons.push(newLesson);
  return successResponse(newLesson);
};

export const updateLesson = async (id: string, updates: Partial<Lesson>): Promise<ApiResponse<Lesson>> => {
  await delay();
  const index = dataStore.lessons.findIndex(l => l.id === id);
  if (index === -1) return errorResponse('Lección no encontrada');
  
  dataStore.lessons[index] = { ...dataStore.lessons[index], ...updates };
  return successResponse(dataStore.lessons[index]);
};

export const deleteLesson = async (id: string): Promise<ApiResponse<boolean>> => {
  await delay();
  const index = dataStore.lessons.findIndex(l => l.id === id);
  if (index === -1) return errorResponse('Lección no encontrada');
  
  dataStore.lessons.splice(index, 1);
  return successResponse(true);
};

// ============= QUIZZES =============
export const createQuiz = async (quiz: Omit<Quiz, 'id' | 'createdAt'>): Promise<ApiResponse<Quiz>> => {
  await delay();
  const newQuiz: Quiz = {
    ...quiz,
    id: generateId('quiz'),
    createdAt: new Date().toISOString(),
  };
  dataStore.quizzes.push(newQuiz);
  return successResponse(newQuiz);
};

export const updateQuiz = async (id: string, updates: Partial<Quiz>): Promise<ApiResponse<Quiz>> => {
  await delay();
  const index = dataStore.quizzes.findIndex(q => q.id === id);
  if (index === -1) return errorResponse('Quiz no encontrado');
  
  dataStore.quizzes[index] = { ...dataStore.quizzes[index], ...updates };
  return successResponse(dataStore.quizzes[index]);
};

export const deleteQuiz = async (id: string): Promise<ApiResponse<boolean>> => {
  await delay();
  const index = dataStore.quizzes.findIndex(q => q.id === id);
  if (index === -1) return errorResponse('Quiz no encontrado');
  
  // Delete related questions and options
  const questionIds = dataStore.questions.filter(q => q.quizId === id).map(q => q.id);
  dataStore.options = dataStore.options.filter(o => !questionIds.includes(o.questionId));
  dataStore.questions = dataStore.questions.filter(q => q.quizId !== id);
  dataStore.submissions = dataStore.submissions.filter(s => s.quizId !== id);
  dataStore.quizzes.splice(index, 1);
  
  return successResponse(true);
};

// ============= QUESTIONS =============
export const createQuestion = async (question: Omit<Question, 'id'>, options: Omit<Option, 'id' | 'questionId'>[]): Promise<ApiResponse<Question>> => {
  await delay();
  const newQuestion: Question = {
    ...question,
    id: generateId('question'),
  };
  dataStore.questions.push(newQuestion);
  
  // Create options
  options.forEach(opt => {
    const newOption: Option = {
      ...opt,
      id: generateId('option'),
      questionId: newQuestion.id,
    };
    dataStore.options.push(newOption);
  });
  
  return successResponse(newQuestion);
};

export const updateQuestion = async (id: string, updates: Partial<Question>): Promise<ApiResponse<Question>> => {
  await delay();
  const index = dataStore.questions.findIndex(q => q.id === id);
  if (index === -1) return errorResponse('Pregunta no encontrada');
  
  dataStore.questions[index] = { ...dataStore.questions[index], ...updates };
  return successResponse(dataStore.questions[index]);
};

export const deleteQuestion = async (id: string): Promise<ApiResponse<boolean>> => {
  await delay();
  const index = dataStore.questions.findIndex(q => q.id === id);
  if (index === -1) return errorResponse('Pregunta no encontrada');
  
  dataStore.options = dataStore.options.filter(o => o.questionId !== id);
  dataStore.questions.splice(index, 1);
  return successResponse(true);
};

// ============= OPTIONS =============
export const updateOption = async (id: string, updates: Partial<Option>): Promise<ApiResponse<Option>> => {
  await delay();
  const index = dataStore.options.findIndex(o => o.id === id);
  if (index === -1) return errorResponse('Opción no encontrada');
  
  dataStore.options[index] = { ...dataStore.options[index], ...updates };
  return successResponse(dataStore.options[index]);
};

// ============= USERS =============
export const createUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> => {
  await delay();
  
  const existingUser = dataStore.users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingUser) return errorResponse('El correo ya está registrado');
  
  const newUser: User = {
    ...user,
    id: generateId('user'),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
    createdAt: new Date().toISOString(),
  };
  dataStore.users.push(newUser);
  return successResponse(newUser);
};

export const deleteUser = async (id: string): Promise<ApiResponse<boolean>> => {
  await delay();
  const index = dataStore.users.findIndex(u => u.id === id);
  if (index === -1) return errorResponse('Usuario no encontrado');
  
  // Delete related data
  dataStore.enrollments = dataStore.enrollments.filter(e => e.studentId !== id);
  dataStore.progress = dataStore.progress.filter(p => p.studentId !== id);
  dataStore.submissions = dataStore.submissions.filter(s => s.studentId !== id);
  dataStore.users.splice(index, 1);
  
  return successResponse(true);
};

// ============= ENROLLMENTS =============
export const getEnrolledStudents = (courseId: string): (User & { enrolledAt: string })[] => {
  const enrollments = dataStore.enrollments.filter(e => e.courseId === courseId);
  return enrollments.map(e => {
    const student = dataStore.users.find(u => u.id === e.studentId);
    return student ? { ...student, enrolledAt: e.enrolledAt } : null;
  }).filter(Boolean) as (User & { enrolledAt: string })[];
};

export const removeEnrollment = async (studentId: string, courseId: string): Promise<ApiResponse<boolean>> => {
  await delay();
  const index = dataStore.enrollments.findIndex(e => e.studentId === studentId && e.courseId === courseId);
  if (index === -1) return errorResponse('Inscripción no encontrada');
  
  dataStore.enrollments.splice(index, 1);
  dataStore.progress = dataStore.progress.filter(p => !(p.studentId === studentId && p.courseId === courseId));
  return successResponse(true);
};
