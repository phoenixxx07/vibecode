"use client";

import { useEffect, useRef, useState } from "react";

type SessionResponse = {
  user?: {
    id?: string;
  } | null;
};

export function useLoggedInUserId(fallbackId?: string) {
  const userIdRef = useRef(fallbackId ?? "");
  const [userId, setUserId] = useState(fallbackId ?? "");

  useEffect(() => {
    if (fallbackId) {
      userIdRef.current = fallbackId;
      setUserId(fallbackId);
    }
  }, [fallbackId]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => res.json() as Promise<SessionResponse>)
      .then((session) => {
        const id = session?.user?.id;
        if (!cancelled && id) {
          userIdRef.current = id;
          setUserId(id);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return { userId, userIdRef };
}
