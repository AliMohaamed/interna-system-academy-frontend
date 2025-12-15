// 1. Permission Interface based on Mongoose Model
export interface Permission {
  _id: string;
  subject: string; // e.g. 'lead', 'student'
  action: string;  // e.g. 'create', 'read'
}

// 2. Role Interface (Populated)
export interface Role {
  _id: string;
  name: string;
  permissions: Permission[]; // Array of populated permissions
}

// 3. User Interface (Populated)
export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role; // Backend returns populated role object
}

// 4. API Response Wrappers (To avoid 'any' in Axios responses)
// Backend Response Format: { status: 'success', data: ..., message: ... } [cite: 365]
export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  message: string;
  data: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// 5. Auth Specific Responses
export interface LoginResponseData {
  user: User;
  accessToken: string;
}

// 6. Error Response Interface
export interface ApiErrorResponse {
  status: 'error' | 'fail';
  message: string;
  errors?: { field: string; message: string }[]; // For validation errors [cite: 93]
}