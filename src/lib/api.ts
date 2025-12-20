// Mock API utilities - simulates backend behavior with JSON data
// All data is stored in memory and resets on page refresh

import type { 
  User, Course, Enrollment, Lesson, Quiz, Question, Option, 
  Submission, Progress, Notification, ApiResponse 
} from '@/types';

// Import JSON data
import usersData from '@/data/users.json';
import coursesData from '@/data/courses.json';
import lessonsData from '@/data/lessons.json';
import enrollmentsData from '@/data/enrollments.json';
import quizzesData from '@/data/quizzes.json';
import questionsData from '@/data/questions.json';
import optionsData from '@/data/options.json';
import submissionsData from '@/data/submissions.json';
import progressData from '@/data/progress.json';
import notificationsData from '@/data/notifications.json';

// In-memory store (mutable)
class DataStore {
  users: User[] = [...usersData] as User[];
  courses: Course[] = [...coursesData] as Course[];
  lessons: Lesson[] = [...lessonsData] as Lesson[];
  enrollments: Enrollment[] = [...enrollmentsData] as Enrollment[];
  quizzes: Quiz[] = [...quizzesData] as Quiz[];
  questions: Question[] = [...questionsData] as Question[];
  options: Option[] = [...optionsData] as Option[];
  submissions: Submission[] = [...submissionsData] as Submission[];
  progress: Progress[] = [...progressData] as Progress[];
  notifications: Notification[] = [...notificationsData] as Notification[];
}

export const dataStore = new DataStore();

// Simulate network latency (200-600ms)
export const delay = (min = 200, max = 600): Promise<void> => {
  const ms = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Generate unique IDs
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// API Response helpers
export const successResponse = <T>(data: T): ApiResponse<T> => ({
  data,
  success: true,
});

export const errorResponse = (error: string): ApiResponse<never> => ({
  error,
  success: false,
});

// Auth storage key
const AUTH_KEY = 'edunova_auth';

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    const { userId } = JSON.parse(stored);
    return dataStore.users.find(u => u.id === userId) || null;
  } catch {
    return null;
  }
};

// Set current user in localStorage
export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: user.id }));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
};
