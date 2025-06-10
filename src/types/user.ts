/**
 * Core user entity representation
 * Contains essential user information
 */
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  language: string;
  createdAt?: string | null;
  accounts?: { provider: string }[]
  hasPassword?: boolean
}