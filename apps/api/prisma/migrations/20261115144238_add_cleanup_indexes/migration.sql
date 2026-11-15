-- CreateIndex
CREATE INDEX "otp_codes_createdAt_idx" ON "otp_codes"("createdAt");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "sessions_revokedAt_idx" ON "sessions"("revokedAt");
