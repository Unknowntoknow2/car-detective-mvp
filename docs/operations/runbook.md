# AIN MVP Operations Runbook

## 🚨 Emergency Contacts
- **Lead Developer**: [Contact Information]
- **DevOps Engineer**: [Contact Information]
- **Product Owner**: [Contact Information]

## 📊 Monitoring & Health Checks

### Quick Health Check
```bash
# Test email service
curl -X POST https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/test-email-integration

# Expected response: {"success": true, "email_service_status": "ready"}
```

### Key Metrics to Monitor
1. **API Response Times**
   - PDF Generation: < 10 seconds
   - Email Delivery: < 5 seconds
   - VIN Decode: < 3 seconds

2. **Error Rates**
   - Overall error rate: < 1%
   - Email delivery failures: < 2%
   - PDF generation failures: < 0.5%

3. **System Resources**
   - Database connections: < 80% of limit
   - Storage usage: Monitor growth rate
   - Edge function invocations: Track usage patterns

## 🔧 Common Issues & Solutions

### 1. Email Service Down
**Symptoms**: Email delivery failing, 503 errors from email endpoints

**Diagnosis**:
```bash
# Check email service status
curl -X POST /functions/v1/test-email-integration
```

**Solutions**:
1. Verify RESEND_API_KEY in Supabase secrets
2. Check Resend.com service status
3. Verify domain authentication in Resend dashboard
4. Check rate limits on Resend account

**Escalation**: If Resend service is down, consider temporary email provider

### 2. PDF Generation Failures
**Symptoms**: PDF downloads failing, 500 errors from generate-valuation-pdf

**Diagnosis**:
1. Check Supabase function logs
2. Verify storage bucket permissions
3. Test with simple valuation data

**Solutions**:
1. Check storage bucket "PDF Valuation Reports" exists and is accessible
2. Verify RLS policies allow function access
3. Check for corrupted valuation data
4. Restart edge function if memory issues

### 3. Database Connection Issues
**Symptoms**: Timeouts, connection refused errors

**Diagnosis**:
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check for long-running queries
SELECT query, state, query_start 
FROM pg_stat_activity 
WHERE state != 'idle' 
ORDER BY query_start;
```

**Solutions**:
1. Kill long-running queries if safe
2. Check connection pooling settings
3. Scale database if consistently hitting limits

### 4. Public Sharing Token Issues
**Symptoms**: "Invalid token" errors, expired token messages

**Diagnosis**:
```sql
-- Check token status
SELECT token, expires_at, created_at 
FROM public_tokens 
WHERE token = 'problem-token';
```

**Solutions**:
1. Verify token hasn't expired (30-day limit)
2. Check RLS policies on public_tokens table
3. Regenerate token if corrupted

## 🚀 Deployment Procedures

### Production Deployment Checklist
- [ ] All tests passing in CI/CD
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Edge functions deployed
- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Rollback plan ready

### Emergency Rollback
1. **Edge Functions**: Revert to previous version in Supabase dashboard
2. **Database**: Apply reverse migrations if needed
3. **Client Code**: Deploy previous version via Lovable
4. **Notify**: Update status page and alert users if needed

## 📈 Scaling Considerations

### Database Scaling
- **Current Limits**: Check Supabase plan limits
- **Upgrade Triggers**: 
  - > 80% connection utilization
  - Query times > 1 second average
  - Storage > 80% of limit

### Edge Function Scaling
- **Auto-scaling**: Handled by Supabase
- **Rate Limits**: Monitor per-function invocation rates
- **Memory**: Check function memory usage in logs

### Storage Scaling
- **PDF Files**: Implement cleanup for old files
- **Photos**: Compress and optimize uploads
- **Monitoring**: Track storage growth rate

## 🔒 Security Incident Response

### Data Breach Response
1. **Immediate**: Revoke compromised API keys
2. **Assess**: Determine scope of data access
3. **Notify**: Alert security team and users if required
4. **Remediate**: Patch vulnerabilities, rotate secrets
5. **Document**: Log incident for review

### API Key Rotation
1. Generate new keys in respective services
2. Update Supabase secrets
3. Test functionality with new keys
4. Revoke old keys
5. Monitor for any failures

## 📋 Maintenance Tasks

### Daily
- [ ] Check error rates in monitoring dashboard
- [ ] Review edge function logs for anomalies
- [ ] Verify email delivery rates

### Weekly
- [ ] Database performance review
- [ ] Storage usage analysis
- [ ] Security updates check
- [ ] Backup verification

### Monthly
- [ ] API key rotation (if policy requires)
- [ ] Performance optimization review
- [ ] Cost analysis and optimization
- [ ] User feedback review

## 📞 Escalation Procedures

### Severity Levels

**P0 - Critical (Response: Immediate)**
- System completely down
- Data breach suspected
- Revenue-impacting issues

**P1 - High (Response: 2 hours)**
- Major feature broken
- Performance severely degraded
- Security vulnerability

**P2 - Medium (Response: 24 hours)**
- Minor feature issues
- Performance slow but functional
- Non-critical bugs

**P3 - Low (Response: 1 week)**
- Enhancement requests
- Documentation updates
- Optimization opportunities

### Contact Escalation
1. **On-call engineer** (immediate response)
2. **Lead developer** (if no response in 30 min)
3. **Product owner** (for business decisions)
4. **External support** (vendor-specific issues)

## 🔧 Useful Commands

### Database Queries
```sql
-- Check system health
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables;

-- Monitor active sessions
SELECT state, count(*) 
FROM pg_stat_activity 
GROUP BY state;
```

### Edge Function Management
```bash
# View function logs
supabase functions logs function-name

# Deploy specific function
supabase functions deploy function-name

# Test function locally
supabase functions serve function-name
```

### Storage Management
```sql
-- Check storage usage
SELECT 
  bucket_id,
  count(*) as file_count,
  sum(metadata->>'size')::bigint as total_size
FROM storage.objects
GROUP BY bucket_id;
```

## 📖 Documentation Links
- [Supabase Dashboard](https://supabase.com/dashboard/project/xltxqqzattxogxtqrggt)
- [API Documentation](../api/README.md)
- [Architecture Overview](../architecture.md)
- [Environment Configuration](../setup/environment.md)