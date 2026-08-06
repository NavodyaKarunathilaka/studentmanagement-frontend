export type Role = "ADMIN" | "USER";

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface LoginResponse {
  token: string;
  role: Role;
  email: string;
  id: number;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  age?: number;
  contactNum?: string;
  courseId?: number;
  courseName?: string;
}

export interface Course {
  id: number;
  name: string;
  description?: string;
  fee?: number;
  duration?: number;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  contactNum: string;
}
