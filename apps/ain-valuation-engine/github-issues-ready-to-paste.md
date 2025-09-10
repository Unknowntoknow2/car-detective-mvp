# 🎯 GitHub Issues - Ready to Paste

## Template Structure
Copy the content below each issue header and paste directly into GitHub Issues.

---

## Issue 1: VIN Validation & Normalization (ISO 3779)

```markdown
## Summary
Implement strict VIN validator (regex + check digit) and canonicalization (trim+uppercase).

## Scope
- [ ] Add Postgres `fn_validate_vin(vin text)` and `fn_vin_check_digit(vin text)` (see SQL in artifacts)
- [ ] Enforce via `vehicle_specs.vin` CHECK constraint + API input validation  
- [ ] Return `400_INVALID_VIN`, `422_CHECK_DIGIT_FAIL` error codes
- [ ] Integrate with existing unified VIN decoder service

## Acceptance Criteria
- [ ] Invalid VINs rejected at database and API level
- [ ] Unit tests include fuzz testing for edge cases
- [ ] Clear error UX messages shown to users
- [ ] Performance: validation <5ms per VIN
- [ ] Integration with existing `/src/services/unifiedVinDecoder.ts`

## Implementation Notes
- Use existing unified VIN decoder validation logic in `/src/services/vinValidation.ts`
- Integrate with current Supabase edge functions
- Update frontend error handling for new error codes
- SQL functions available in `/sql/vin_validation_functions.sql`

## Definition of Done
- [ ] All tests pass including edge cases
- [ ] API documentation updated
- [ ] Error handling verified in frontend
- [ ] Performance benchmarks meet requirements
```

---

## Issue 2: API Contract v1 + Versioning

```markdown
## Summary
Publish OpenAPI v1 with stable DTOs & error model; add `X-Request-Id` correlation.

## Scope
- [ ] Implement `/v1/decode-vin` (POST) and `/v1/vehicle-profile/{vin}` (GET) endpoints
- [ ] Add idempotency key support for POST operations
- [ ] Implement pagination pattern for list endpoints
- [ ] Add semantic version header + deprecation policy in README
- [ ] Request/response correlation with X-Request-Id

## Acceptance Criteria  
- [ ] OpenAPI spec committed to `/openapi/openapi.yaml`
- [ ] CI pipeline fails on breaking changes detection
- [ ] All endpoints include X-Request-Id correlation
- [ ] Deprecation policy documented and enforced
- [ ] Response schemas match specification exactly

## Implementation Notes
- Complete OpenAPI spec available in `/openapi/openapi.yaml`
- Integrate with existing Supabase edge functions
- Use existing unified VIN decoder as foundation
- Add versioning middleware for future API changes

## Definition of Done
- [ ] OpenAPI spec validates successfully
- [ ] All endpoints respond according to spec
- [ ] Breaking change detection working in CI
- [ ] Documentation published and accessible
```

---

## Issue 3: Rate Limiting & Abuse Protection

```markdown
## Summary
Implement per-IP and per-user rate limits on decode/recall/safety endpoints with WAF rules.

## Scope
- [ ] Edge middleware with token bucket algorithm (`60/min/IP`, `300/day/user`)
- [ ] Return `429 Too Many Requests` with `Retry-After` header
- [ ] IP blocklists + basic WAF patterns for common attacks
- [ ] Rate limit headers in all responses
- [ ] Admin override capability for testing/whitelisting

## Acceptance Criteria
- [ ] k6 load tests demonstrate proper throttling behavior
- [ ] Logs include rate-limit counters and violations
- [ ] Graceful degradation under sustained load
- [ ] Admin interface for managing rate limits
- [ ] Monitoring alerts for abuse patterns

## Implementation Notes
- Integrate with Supabase edge function middleware
- Use Redis or similar for distributed rate limiting
- Consider user authentication tiers (free/paid)
- k6 test file available in `/k6/decode_vin.js`

## Definition of Done
- [ ] Rate limiting active and enforced
- [ ] Load tests pass with proper throttling
- [ ] Monitoring dashboards showing rate limit metrics
- [ ] Documentation updated with rate limit information
```

---

## Issue 4: Caching & Performance Hardening

```markdown
## Summary
Implement namespaced cache with SWR, negative caching, request coalescing, and eviction.

## Scope
- [ ] Database table: `api_cache(key, payload, ttl_seconds, source, fetched_at)`
- [ ] Namespaced cache keys: `vpic:VIN:...`, `ncap:year:make:model`, `recalls:VIN`
- [ ] Stale-While-Revalidate: serve cached if < TTL; revalidate async
- [ ] Negative cache for invalid VINs (prevent repeated API calls)
- [ ] Request coalescing: per-VIN lock to prevent thundering herd
- [ ] Configurable timeouts: vPIC/NCAP/Recalls 2.5s with exponential backoff

## Acceptance Criteria
- [ ] p95 response time < 400ms on warm cache path
- [ ] Cache hit rate ≥ 50% under normal load
- [ ] No thundering herd behavior on cache misses
- [ ] Graceful timeout and retry handling
- [ ] Cache eviction prevents unbounded growth

## Implementation Notes
- Integrate with existing unified VIN decoder
- Use Supabase for cache storage with RLS policies
- Consider Redis for high-performance caching layer
- Implement cache warming for popular VINs

## Definition of Done
- [ ] Performance benchmarks meet targets
- [ ] Cache behavior verified under load
- [ ] Monitoring shows cache hit rates
- [ ] Eviction policies working correctly
```

---

## Issue 5: Postgres Migrations, Constraints & RLS (Phase 1)

```markdown
## Summary
Finalize core database tables with constraints, RLS policies, and server-only write RPCs.

## Scope
- [ ] Unique constraints: `vehicle_specs.vin`, composite `nhtsa_recalls(vin,campaign_id)`
- [ ] NOT NULL constraints for critical fields
- [ ] RLS policies: `vehicle_specs` (anon read via view), `api_cache` server-only
- [ ] SECURITY DEFINER RPCs: `upsert_specs`, `upsert_recalls`, `upsert_safety`, `upsert_fuel`
- [ ] Rollback scripts for all migrations
- [ ] Seed test data for development/testing

## Acceptance Criteria
- [ ] `supabase db push` succeeds without errors
- [ ] RLS policies verified - no unauthorized access possible
- [ ] Seed data loads successfully in clean database
- [ ] Rollback scripts tested and working
- [ ] Server-only write access enforced

## Implementation Notes
- Build on existing migration work in `/supabase/migrations/`
- SQL artifacts available in `/sql/rls_policies.sql`
- Use existing database schema as foundation
- Test with existing unified VIN decoder

## Definition of Done
- [ ] All migrations apply successfully
- [ ] Security model verified and tested
- [ ] Data integrity constraints working
- [ ] Development environment reproducible
```

---

## Issue 6: Observability Pack (logs, metrics, tracing)

```markdown
## Summary
Implement structured JSON logs, correlation IDs, performance counters, and latency histograms.

## Scope
- [ ] Structured log fields: `request_id`, `vin`, `source`, `latency_ms`, `cache_hit`, `status`
- [ ] W3C trace context headers across edge→database
- [ ] Performance dashboards: success rate, p95 latency, cache hits, external API latency  
- [ ] Alerting rules for error rates and performance degradation
- [ ] Log aggregation and search capability

## Acceptance Criteria
- [ ] Dashboards render with real-time data
- [ ] Alerts trigger on error-rate >2% in 5-minute window
- [ ] Request correlation works across service boundaries
- [ ] Log retention policy configured and enforced
- [ ] Performance metrics baseline established

## Implementation Notes
- Integrate with Supabase logging and monitoring
- Consider external tools (DataDog, New Relic, etc.)
- Use existing request correlation in unified VIN decoder
- Set up cost-effective log retention strategy

## Definition of Done
- [ ] All services producing structured logs
- [ ] Dashboards accessible to development team
- [ ] Alert notifications configured
- [ ] Performance baseline documented
```

---

## Issue 7: CI/CD Safety & Security Gates

```markdown
## Summary
Implement database dry-run, secret scanning, SAST/CodeQL, and OpenAPI breaking-change detection.

## Scope
- [ ] Protected branch policies with required reviews
- [ ] Database migration dry-run in CI pipeline
- [ ] Secret scanning for credentials and API keys
- [ ] Static Application Security Testing (SAST) with CodeQL
- [ ] OpenAPI specification breaking-change detection
- [ ] Canary deployment for edge functions with rollback capability

## Acceptance Criteria
- [ ] CI pipeline blocks deployments on security violations
- [ ] Canary deployment process documented and tested
- [ ] Database migration dry-run prevents production issues
- [ ] Breaking change detection prevents API regressions
- [ ] Secret scanning catches leaked credentials

## Implementation Notes
- Use GitHub Actions for CI/CD pipeline
- Integrate with existing Supabase deployment workflow
- Consider Terraform or similar for infrastructure as code
- Document rollback procedures

## Definition of Done
- [ ] All security gates active and tested
- [ ] Deployment process documented
- [ ] Rollback procedures verified
- [ ] Team trained on new CI/CD workflow
```

---

## Quick Assignment Template

Add these labels and assignees when creating issues:

**Labels to apply:**
- `backend`, `frontend`, `schema`, `security`, `performance`, `observability`, `ops`, `api`, `docs`, `ci`

**Milestone assignment:**
- M1 Issues: `M1 Phase-1 Hardening`
- M2 Issues: `M2 Phase-2 Enrichment`  
- M0 Issues: `M0 Platform Ops`

**Assignee suggestions:**
- Backend Issues: `@backend-owner`
- DevOps/Infrastructure: `@devops-owner`
- Frontend: `@frontend-owner`
- Database/Schema: `@backend-owner`

## Issue Dependencies

```
Issue 1 (VIN Validation) → Issue 2 (API Contract) → Issue 3 (Rate Limiting)
                       ↘                        ↗
Issue 5 (Database) → Issue 4 (Caching) → Issue 6 (Observability)
                                      ↗
                   Issue 7 (CI/CD) ← Issue 11-13 (Platform Ops)
```
