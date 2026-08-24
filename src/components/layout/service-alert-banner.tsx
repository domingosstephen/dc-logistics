import { createServerClient } from "@/lib/supabase/server";

interface Alert {
  id: string;
  message: string;
  severity: string;
}

export async function ServiceAlertBanner() {
  // Skip during static build when env vars are not available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

  let alerts: Alert[] = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("service_alerts")
      .select("id, message, severity")
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(3);
    alerts = (data ?? []) as Alert[];
  } catch {
    return null;
  }

  if (alerts.length === 0) return null;

  return (
    <div className="bg-[#FBF3E0] border-b border-[#E8B33C]/40">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="mx-auto max-w-[1440px] px-5 md:px-8 py-2 flex items-start gap-2 text-sm text-[#7A5A1E]"
        >
          <span className="mt-0.5 shrink-0" aria-hidden="true">
            {alert.severity === "critical" ? "⚠" : "ℹ"}
          </span>
          <p>{alert.message}</p>
        </div>
      ))}
    </div>
  );
}
