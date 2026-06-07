"use client";



import { useRouter } from "next/navigation";

import { useState } from "react";

import { TerminalButton } from "@/components/terminal/TerminalButton";

import { useConfirmDialog } from "@/components/terminal/TerminalConfirmDialog";

import {

  formatBudget,

  formatBudgetInput,

  parseBudgetInput,

} from "@/lib/project-request-labels";



function ActionButton({

  label,

  onClick,

  confirmMessage,

  confirmTitle,

  variant = "primary",

}: {

  label: string;

  onClick: () => Promise<void>;

  confirmMessage?: string;

  confirmTitle?: string;

  variant?: "primary" | "ghost";

}) {

  const { confirm, dialogNode } = useConfirmDialog();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");



  async function handleClick() {

    if (

      confirmMessage &&

      !(await confirm({ title: confirmTitle, message: confirmMessage }))

    ) {

      return;

    }

    setLoading(true);

    setError("");

    try {

      await onClick();

    } catch (err) {

      setError(err instanceof Error ? err.message : "Gagal");

    } finally {

      setLoading(false);

    }

  }



  return (

    <div>

      <TerminalButton type="button" variant={variant} onClick={handleClick} disabled={loading}>

        {loading ? "..." : label}

      </TerminalButton>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      {dialogNode}

    </div>

  );

}



export function SelectDeveloperButton({

  requestId,

  applicationId,

  budgetAmount,

  budgetCurrency,

}: {

  requestId: string;

  applicationId: string;

  budgetAmount: number;

  budgetCurrency: string;

}) {

  const router = useRouter();

  const { confirm, dialogNode } = useConfirmDialog();

  const [showAgreedBudget, setShowAgreedBudget] = useState(false);

  const [agreedDisplay, setAgreedDisplay] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");



  async function handleSelect() {

    if (

      !(await confirm({

        title: "PILIH_DEVELOPER",

        message: "Pilih developer ini? Request akan masuk fase pengerjaan.",

        confirmLabel: "PILIH",

      }))

    ) {

      return;

    }



    const parsed = parseBudgetInput(agreedDisplay);

    const payload =

      parsed > 0 ? { agreedBudgetAmount: parsed } : {};



    setLoading(true);

    setError("");

    try {

      const res = await fetch(

        `/api/project-requests/${requestId}/applications/${applicationId}/select`,

        {

          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify(payload),

        }

      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.refresh();

    } catch (err) {

      setError(err instanceof Error ? err.message : "Gagal");

    } finally {

      setLoading(false);

    }

  }



  return (

    <div className="space-y-3">

      {showAgreedBudget ? (

        <div>

          <div className="flex items-center justify-between gap-2">

            <label

              htmlFor={`agreed-budget-${applicationId}`}

              className="text-[10px] font-bold uppercase text-muted"

            >

              Harga kesepakatan (opsional)

            </label>

            <button

              type="button"

              onClick={() => {

                setShowAgreedBudget(false);

                setAgreedDisplay("");

              }}

              className="text-[10px] text-muted underline hover:text-text-main"

            >

              Tutup

            </button>

          </div>

          <input

            id={`agreed-budget-${applicationId}`}

            type="text"

            inputMode="numeric"

            value={agreedDisplay}

            onChange={(e) => setAgreedDisplay(formatBudgetInput(e.target.value))}

            placeholder={formatBudget(budgetAmount, budgetCurrency)}

            className="mt-1 w-full border border-muted bg-page px-3 py-2 text-sm text-text-main placeholder:text-muted"

            autoFocus

          />

          <p className="mt-1 text-[10px] text-muted">

            Kosongkan untuk memakai estimasi awal:{" "}

            {formatBudget(budgetAmount, budgetCurrency)}

          </p>

        </div>

      ) : (

        <button

          type="button"

          onClick={() => setShowAgreedBudget(true)}

          className="text-[10px] text-muted underline hover:text-text-main"

        >

          Atur harga kesepakatan (opsional)

        </button>

      )}

      <TerminalButton type="button" onClick={handleSelect} disabled={loading}>

        {loading ? "..." : "[PILIH DEVELOPER INI]"}

      </TerminalButton>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {dialogNode}

    </div>

  );

}



export function CompleteRequestButton({ requestId }: { requestId: string }) {

  const router = useRouter();

  return (

    <ActionButton

      label="[TANDAI SELESAI]"

      confirmTitle="TANDAI_SELESAI"

      confirmMessage="Tandai proyek sebagai selesai?"

      onClick={async () => {

        const res = await fetch(`/api/project-requests/${requestId}/complete`, { method: "POST" });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        router.refresh();

      }}

    />

  );

}



export function CancelRequestButton({ requestId }: { requestId: string }) {

  const router = useRouter();

  return (

    <ActionButton

      label="[AJUKAN PEMBATALAN]"

      variant="ghost"

      confirmTitle="AJUKAN_PEMBATALAN"

      confirmMessage="Ajukan pembatalan? Pihak lain harus menyetujui."

      onClick={async () => {

        const res = await fetch(`/api/project-requests/${requestId}/cancel`, { method: "POST" });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        router.refresh();

      }}

    />

  );

}



export function CancellationBanner({

  requestId,

  requestedByName,

  canRespond,

}: {

  requestId: string;

  requestedByName: string;

  canRespond: boolean;

}) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");



  async function respond(action: "approve" | "reject") {

    setLoading(true);

    setError("");

    try {

      const res = await fetch(`/api/project-requests/${requestId}/cancel/${action}`, {

        method: "POST",

      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.refresh();

    } catch (err) {

      setError(err instanceof Error ? err.message : "Gagal");

    } finally {

      setLoading(false);

    }

  }



  return (

    <div className="border border-accent bg-surface p-4">

      <p className="text-sm text-text-main">

        <strong>{requestedByName}</strong> mengajukan pembatalan. Menunggu persetujuan Anda.

      </p>

      {canRespond && (

        <div className="mt-3 flex gap-2">

          <TerminalButton

            type="button"

            disabled={loading}

            onClick={() => respond("approve")}

          >

            [SETUJUI]

          </TerminalButton>

          <TerminalButton

            type="button"

            variant="ghost"

            disabled={loading}

            onClick={() => respond("reject")}

          >

            [TOLAK]

          </TerminalButton>

        </div>

      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

    </div>

  );

}



export function ReopenRequestButton({ requestId }: { requestId: string }) {

  const router = useRouter();

  return (

    <ActionButton

      label="[BUKA KEMBALI]"

      confirmTitle="BUKA_KEMBALI"

      confirmMessage="Buka kembali request? Developer harus mendaftar ulang."

      onClick={async () => {

        const res = await fetch(`/api/project-requests/${requestId}/reopen`, { method: "POST" });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        router.refresh();

      }}

    />

  );

}



export function DuplicateRequestButton({ requestId }: { requestId: string }) {

  const router = useRouter();

  return (

    <ActionButton

      label="[DUPLIKAT PROJECT]"

      confirmTitle="DUPLIKAT_PROJECT"

      confirmMessage="Buat pengajuan baru dengan brief yang sama?"

      onClick={async () => {

        const res = await fetch(`/api/project-requests/${requestId}/duplicate`, {

          method: "POST",

        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        router.push(`/dashboard/requests`);

        router.refresh();

      }}

    />

  );

}

