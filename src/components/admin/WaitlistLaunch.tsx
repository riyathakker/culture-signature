"use client";

import { useCallback, useEffect, useState } from "react";
import { Send, Users, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { toast } from "sonner";

type Stats = { total: number; notified: number; pending: number };

const ENDPOINT = "/api/admin/notify/launch";

export function WaitlistLaunch() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [sending, setSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch(ENDPOINT);
      if (res.ok) setStats(await res.json());
    } catch {
      /* stats are non-critical on the overview — stay silent */
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStats();
  }, [loadStats]);

  const sendLaunch = async () => {
    setConfirmOpen(false);
    setSending(true);
    try {
      const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send.");
      toast.success(
        `Launch email sent to ${data.sent} subscriber${data.sent === 1 ? "" : "s"}.` +
          (data.failed ? ` ${data.failed} failed — try again to retry.` : "")
      );
      await loadStats();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send launch emails.");
    } finally {
      setSending(false);
    }
  };

  const pending = stats?.pending ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Waitlist</h3>
      </div>
      <div className="bg-background border border-border/50 rounded-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-2xl font-heading leading-none">{stats?.total ?? 0}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Subscribers</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-2xl font-heading leading-none">{stats?.notified ?? 0}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Notified</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-2xl font-heading leading-none">{pending}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Pending</p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setConfirmOpen(true)}
          disabled={sending || pending === 0}
          className="uppercase tracking-widest text-[10px] font-bold shrink-0"
        >
          <Send className="w-4 h-4 mr-2" />
          {sending ? "Sending…" : `Send launch email${pending ? ` (${pending})` : ""}`}
        </Button>
      </div>

      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={sendLaunch}
        title="Send launch email?"
        description={`This emails the launch announcement with a personal 10% coupon to ${pending} subscriber${pending === 1 ? "" : "s"} who haven't been notified yet. This cannot be undone.`}
        confirmText="Send now"
        variant="primary"
        isLoading={sending}
      />
    </div>
  );
}
