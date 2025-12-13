# Deployment Steps — Vercel + MongoDB Atlas (+ Upstash)

## Prereqs
- Vercel account and project
- MongoDB Atlas cluster (free tier OK)
- Optional Upstash Redis for Socket.IO adapter

## Environment Variables
- `MONGODB_URI`: Atlas connection string
- `REDIS_URL`: Upstash Redis (optional)
- `NEXT_PUBLIC_WS_URL`: WebSocket endpoint
- `ORIGIN`: Allowed CORS origin(s)

## Steps
1. Connect GitHub repo to Vercel
2. Configure env vars in Vercel project settings
3. Set build command (`pnpm build`) and output
4. Add IP allowlist or enable SRV for Atlas; create DB user with least privilege
5. (Optional) Configure Redis adapter for Socket.IO scaling
6. Deploy preview; run smoke tests (join, start, answer)
7. Promote to production

## Health & Rollback
- Health checks: `/api/health`, WS connect success, DB latency
- Rollback: redeploy prior commit via Vercel dashboard; confirm env parity

## Post-deploy Checklist
- Verify session creation/join flows
- Check realtime events latency p95 < 150ms
- Validate analytics events and Sentry
