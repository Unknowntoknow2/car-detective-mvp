# 🚀 AIN Valuation - Operator Rollout Checklist

*Safe rollout management for non-engineers*

---

## 📋 Pre-Rollout Setup

### Step 1: Enable AIN API
1. Go to **Lovable Project Settings** → **Environment Variables**
2. Set these values:
   ```
   USE_AIN_VALUATION = true
   VITE_AIN_VALUATION_URL = [Ask Engineering for URL]
   VITE_AIN_API_KEY = [Ask Engineering for API Key]  
   VITE_AIN_TIMEOUT_MS = 30000
   ```
3. Click **Save**

---

## 📊 Canary Monitoring (24 Hours)

### What to Watch
Open browser console on your app and look for these metrics:

| Metric | Target | Status |
|--------|--------|---------|
| `ain.ok` | ≥ 99% | ⏳ Monitor |
| `ain.latency.ms` | ≤ 1500ms average | ⏳ Monitor |  
| `ain.fallback.used` | ≤ 1% | ⏳ Monitor |

### ✅ GREEN LIGHT Criteria
- No user complaints about slow valuations
- Console shows mostly `ain.ok` events
- Fallback usage stays under 1%

### 🚨 RED LIGHT Criteria  
- Users report valuation errors
- Console shows frequent `ain.err` events
- Response times consistently > 2 seconds

---

## 🔄 Rollback Process (Emergency)

### When to Rollback
- Any RED LIGHT criteria met
- Engineering requests immediate rollback
- Unusual user error reports

### How to Rollback (30 seconds)
1. Go to **Lovable Project Settings** → **Environment Variables**
2. Change: `USE_AIN_VALUATION = false`
3. Click **Save**
4. Verify app still works normally
5. Notify engineering team

**⚠️ No code changes needed - just flip the flag!**

---

## ✅ Full Rollout (After 24h Clean Canary)

### If Canary Goes Well
1. Monitor for another 24 hours
2. Get engineering approval
3. Document successful rollout
4. Continue monitoring weekly

### Success Indicators
- Zero rollback needed during canary
- User satisfaction unchanged
- Performance metrics within targets

---

## 📞 Emergency Contacts

- **Engineering Lead**: [Name/Contact]
- **Product Owner**: [Name/Contact]  
- **On-Call Engineer**: [Contact method]

---

## 🎯 Success Definition

**✅ Rollout Complete When:**
- 48+ hours of stable metrics
- No user-facing issues
- Engineering confirms all green
- Fallback usage < 1% sustained

**📈 Expected Benefits:**
- Faster valuation responses  
- More accurate pricing
- Better user experience
- Reduced infrastructure load

---

*This checklist ensures safe, monitored rollout with instant rollback capability*