import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthPayload {
  userId: number
  email?: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
  if (!token) {
    res.status(401).json({ message: "Authentication required" })
    return
  }
  const secret = process.env.JWT_SECRET
  if (!secret) {
    res.status(500).json({ message: "Server configuration error" })
    return
  }
  try {
    const decoded = jwt.verify(token, secret) as AuthPayload
    req.user = { userId: decoded.userId, email: decoded.email }
    next()
  } catch {
    res.status(401).json({ message: "Invalid or expired token" })
  }
}
