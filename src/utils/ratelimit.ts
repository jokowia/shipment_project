import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Helper to check if Redis is configured
const isRedisConfigured = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN

// Create a new ratelimiter, that allows 10 requests per 10 seconds per IP
export const ipRateLimit = isRedisConfigured ? new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
}) : { limit: async () => ({ success: true }) } as any

// Create a stricter limit for OTP submissions (e.g. 5 attempts per 15 minutes per Token)
export const otpRateLimit = isRedisConfigured ? new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
}) : { limit: async () => ({ success: true }) } as any
