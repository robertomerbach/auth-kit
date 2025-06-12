/**
 * Core user entity representation
 * Contains essential user information
 */
export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  language: string;
  createdAt: Date;
  accounts?: { provider: string }[]
  hasPassword?: boolean // Computed from password field
}