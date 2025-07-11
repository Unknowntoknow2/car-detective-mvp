// FANG-style follow-up answer sanitizer for booleans/enums, safe for Supabase upsert

export function sanitizeFollowUpForSupabase(input: any) {
  const copy = { ...input };

  // --- Sanitize accidents fields ---
  if (copy.accidents) {
    copy.accidents = {
      ...copy.accidents,
      frameDamage:
        typeof copy.accidents.frameDamage === 'boolean'
          ? copy.accidents.frameDamage
          : copy.accidents.frameDamage === 'true'
            ? true
            : copy.accidents.frameDamage === 'false'
              ? false
              : false,
      repaired:
        typeof copy.accidents.repaired === 'boolean'
          ? copy.accidents.repaired
          : copy.accidents.repaired === 'true'
            ? true
            : copy.accidents.repaired === 'false'
              ? false
              : false,
    };
    if (copy.accidents.frameDamage === '' || copy.accidents.frameDamage == null)
      copy.accidents.frameDamage = false;
    if (copy.accidents.repaired === '' || copy.accidents.repaired == null)
      copy.accidents.repaired = false;
  }

  // --- Sanitize modifications fields ---
  if (copy.modifications) {
    copy.modifications = {
      ...copy.modifications,
      modified:
        typeof copy.modifications.modified === 'boolean'
          ? copy.modifications.modified
          : copy.modifications.modified === 'true'
            ? true
            : copy.modifications.modified === 'false'
              ? false
              : false,
      hasModifications:
        typeof copy.modifications.hasModifications === 'boolean'
          ? copy.modifications.hasModifications
          : copy.modifications.hasModifications === 'true'
            ? true
            : copy.modifications.hasModifications === 'false'
              ? false
              : false,
    };
    if (copy.modifications.modified === '' || copy.modifications.modified == null)
      copy.modifications.modified = false;
    if (copy.modifications.hasModifications === '' || copy.modifications.hasModifications == null)
      copy.modifications.hasModifications = false;
  }

  // --- Remove frontend/UI-only fields ---
  delete copy.payoffAmount;
  delete copy.lastSaveTime;
  delete copy.saveError;
  delete copy.isSaving;

  // --- (Optional) Defensive key pruning ---
  // If your table adds/removes keys, uncomment and edit this:
  /*
  const allowed = new Set([
    'vin', 'zip_code', 'mileage', 'condition', 'year', 'accidents', 'transmission',
    'title_status', 'previous_use', 'serviceHistory', 'previous_owners',
    'tire_condition', 'exterior_condition', 'interior_condition', 'brake_condition',
    'dashboard_lights', 'loan_balance', 'modifications', 'features',
    'additional_notes', 'completion_percentage', 'is_complete', 'valuation_id',
    'payoff_amount', 'updated_at'
  ]);
  Object.keys(copy).forEach(key => {
    if (!allowed.has(key)) delete copy[key];
  });
  */

  return copy;
}
