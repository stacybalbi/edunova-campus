// User roles
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

// User model
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  createdAt: string;
}

// Course model
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  teacherId: string;
  thumbnail?: string;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
}

// Enrollment model
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
}

// Lesson model
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl?: string;
  orderNumber: number;
  duration?: string;
}

// Quiz model
export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  timeLimit?: number; // in minutes
  createdAt: string;
}

// Question types
export type QuestionType = 'multiple_choice' | 'true_false';

// Question model
export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: QuestionType;
  points?: number;
}

// Option model
export interface Option {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
}

// Submission model
export interface Submission {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  maxScore: number;
  submittedAt: string;
  answers: SubmissionAnswer[];
}

export interface SubmissionAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

// Progress model
export interface Progress {
  id: string;
  studentId: string;
  courseId: string;
  completedLessonIds: string[];
  percent: number;
  lastAccessedAt: string;
}

// Notification model
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
