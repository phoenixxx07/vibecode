"use client";

import { useState, useTransition } from "react";
import { signInWithGoogle } from "@/lib/actions/sign-in-google";

type GoogleSignInButtonProps = {
  callbackUrl?: string;
  className?: string;
  children: React.ReactNode;
};

export function GoogleSignInButton({
  callbackUrl,
  className,
  children,
}: GoogleSignInButtonProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleClick() {
    setError("");
    startTransition(async () => {
      try {
        const url = await signInWithGoogle(callbackUrl);
        window.location.assign(url);
      } catch (err) {
        console.error("[auth] google sign-in failed", err);
        setError("Gagal memulai login Google. Cek GOOGLE_CLIENT_ID/SECRET di server.");
      }
    });
  }

  return (
    <div>
      {error && (
        <p className="mb-4 border border-red-500 p-3 text-xs text-red-400">{error}</p>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={className}
      >
        {pending ? "[CONNECTING...]" : children}
      </button>
    </div>
  );
}
