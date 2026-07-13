# Multi-stage production image — standalone Next.js, no runtime cache growth.
FROM node:lts-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

FROM base AS builder
RUN apk add --no-cache python3 make g++ vips-dev fftw-dev
ARG NEXT_PUBLIC_SITE_URL=https://devasafetynets.com
ARG NEXT_PUBLIC_SITE_NAME=Deva Safety Nets
ARG NEXT_PUBLIC_BRAND_PHONE=+917558844405
ARG NEXT_PUBLIC_WHATSAPP=917558844405
ARG NEXT_PUBLIC_EMAIL=devasafetynetskochi@gmail.com
ARG NEXT_PUBLIC_GOOGLE_MAPS_KEY=
ARG NEXT_PUBLIC_GOOGLE_ADS_ID=AW-18317175490
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_SITE_NAME=$NEXT_PUBLIC_SITE_NAME \
    NEXT_PUBLIC_BRAND_PHONE=$NEXT_PUBLIC_BRAND_PHONE \
    NEXT_PUBLIC_WHATSAPP=$NEXT_PUBLIC_WHATSAPP \
    NEXT_PUBLIC_EMAIL=$NEXT_PUBLIC_EMAIL \
    NEXT_PUBLIC_GOOGLE_MAPS_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_KEY \
    NEXT_PUBLIC_GOOGLE_ADS_ID=$NEXT_PUBLIC_GOOGLE_ADS_ID \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=4096"
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN test -f public/images/invisible-grill-balcony/i3.jpg
RUN npm run build \
  && find .next -name '*.map' -delete \
  && rm -rf .next/cache node_modules \
  && npm cache clean --force

FROM node:lts-alpine AS runner
RUN apk add --no-cache libc6-compat tini
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    NODE_HEAP_MB=256

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && mkdir -p /tmp /app/.next/cache /ops \
  && chown -R nextjs:nodejs /tmp /app

WORKDIR /app
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --chown=nextjs:nodejs deploy/healthcheck.sh deploy/startup.sh /ops/
RUN chmod +x /ops/healthcheck.sh /ops/startup.sh \
  && test -f /app/public/images/invisible-grill-balcony/i3.jpg

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD /ops/healthcheck.sh

STOPSIGNAL SIGTERM
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/ops/startup.sh"]
