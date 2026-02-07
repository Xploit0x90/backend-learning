// Matches your Express API response types
export interface User {
  id: number
  name: string
  age: number
}

export interface ApiError {
  message: string
}
