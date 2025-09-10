import { supabase } from "../../../db/supabaseClient.js";
export async function createRunLog(params) {
    const { data, error } = await supabase
        .from("ingest_runs")
        .insert([{ run_id: params.run_id, source: params.source, model: params.model, urls: params.urls }])
        .select("*")
        .single();
    if (error)
        console.warn("[ingest_runs.insert] error", error);
    return data;
}
export async function finishRunLog(params) {
    const { error } = await supabase
        .from("ingest_runs")
        .update({
        status: params.status,
        finished_at: new Date().toISOString(),
        listings_found: params.listings_found,
        listings_upserted: params.listings_upserted,
        token_input: params.token_input ?? 0,
        token_output: params.token_output ?? 0,
        notes: params.notes ?? {}
    })
        .eq("run_id", params.run_id);
    if (error)
        console.warn("[ingest_runs.update] error", error);
}
