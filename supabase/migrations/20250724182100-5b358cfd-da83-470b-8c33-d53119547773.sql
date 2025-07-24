-- CRITICAL SECURITY FIXES: Phase 1
-- Fix 1: Enable RLS on tables that have it disabled but have policies

-- Enable RLS on tables that have policies but RLS is disabled
ALTER TABLE public.auction_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_data_cache ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.models_nhtsa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zip_validations ENABLE ROW LEVEL SECURITY;

-- Fix 2: Secure all database functions by setting search_path
-- This prevents function hijacking attacks by ensuring functions use fully qualified names

CREATE OR REPLACE FUNCTION public.clean_old_zip_validations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  DELETE FROM public.zip_validations 
  WHERE valid_at < NOW() - INTERVAL '30 days';
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_vehicle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_on_new_offer()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  RAISE NOTICE 'New offer created: %', NEW.id;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_premium_access_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_auction_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  PERFORM net.http_post(
    url := 'https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch-auction-data',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('my.supabase_service_role_key', true)
    ),
    body := jsonb_build_object('vin', NEW.vin)::text
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_referral_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF NEW.reward_status != OLD.reward_status THEN
    -- Add additional validation logic here if needed
  END IF;
  
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_valuation_results_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.schedule_next_task_run()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  NEW.next_run_at = NEW.last_run_at + (NEW.frequency_minutes || ' minutes')::INTERVAL;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trigger_auction_fetch()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
begin
  perform net.http_post(
    url := 'https://YOUR_PROJECT.functions.supabase.co/fetch-bidcars',
    headers := json_build_object(
      'Authorization', 'Bearer ' || current_setting('my.api.service_role'),
      'Content-Type', 'application/json'
    ),
    body := json_build_object('vin', NEW.vin)::text
  );

  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.update_model_trims_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_referral_stats(user_id uuid)
RETURNS TABLE(total_referrals bigint, pending_referrals bigint, earned_rewards bigint, claimed_rewards bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_referrals,
    COUNT(*) FILTER (WHERE reward_status = 'pending') as pending_referrals,
    COUNT(*) FILTER (WHERE reward_status = 'earned') as earned_rewards,
    COUNT(*) FILTER (WHERE reward_status = 'claimed') as claimed_rewards
  FROM public.referrals
  WHERE inviter_id = user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_referral_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  new_token TEXT;
BEGIN
  SELECT substring(replace(gen_random_uuid()::text, '-', '') for 8) INTO new_token;
  
  WHILE EXISTS (SELECT 1 FROM public.referrals WHERE referral_token = new_token) LOOP
    SELECT substring(replace(gen_random_uuid()::text, '-', '') for 8) INTO new_token;
  END LOOP;
  
  RETURN new_token;
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_referral(token text, new_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  UPDATE public.referrals
  SET referred_user_id = new_user_id
  WHERE referral_token = token
    AND referred_user_id IS NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_title_adjustment(title_status text, base_value numeric)
RETURNS numeric
LANGUAGE plpgsql
STABLE
SET search_path TO ''
AS $function$
DECLARE
  adjustment_pct NUMERIC := 0;
BEGIN
  SELECT adjustment_percentage INTO adjustment_pct
  FROM public.title_status_adjustments
  WHERE title_status_adjustments.title_status = LOWER(get_title_adjustment.title_status)
  LIMIT 1;
  
  IF adjustment_pct IS NULL THEN
    adjustment_pct := 0;
  END IF;
  
  RETURN base_value * (adjustment_pct / 100.0);
END;
$function$;

CREATE OR REPLACE FUNCTION public.mark_referral_earned(user_id uuid, reward_type text DEFAULT 'valuation'::text, reward_amount numeric DEFAULT 5.00)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  UPDATE public.referrals
  SET reward_status = 'earned',
      reward_type = mark_referral_earned.reward_type,
      reward_amount = mark_referral_earned.reward_amount
  WHERE referred_user_id = user_id
    AND reward_status = 'pending';
END;
$function$;

CREATE OR REPLACE FUNCTION public.claim_referral_reward(referral_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  claimed_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO claimed_count
  FROM public.referrals
  WHERE inviter_id = (SELECT inviter_id FROM public.referrals WHERE id = referral_id)
    AND reward_status = 'claimed';
  
  IF claimed_count < 5 THEN
    UPDATE public.referrals
    SET reward_status = 'claimed',
        updated_at = now()
    WHERE id = referral_id
      AND reward_status = 'earned';
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.use_premium_credit(p_user_id uuid, p_valuation_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_credits INTEGER;
BEGIN
  SELECT remaining_credits INTO v_credits
  FROM public.premium_credits
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  IF v_credits IS NULL OR v_credits <= 0 THEN
    RETURN FALSE;
  END IF;
  
  UPDATE public.premium_credits
  SET 
    remaining_credits = remaining_credits - 1,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  INSERT INTO public.premium_valuations (user_id, valuation_id, created_at)
  VALUES (p_user_id, p_valuation_id, now())
  ON CONFLICT (user_id, valuation_id) DO NOTHING;
  
  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_premium_credits_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;