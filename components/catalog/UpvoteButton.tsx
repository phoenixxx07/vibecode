"use client";

import { useState } from "react";
import { TerminalButton } from "../terminal/TerminalButton";

export function UpvoteButton({
  productId,
  initialCount,
  hasUpvoted = false,
  isLoggedIn,
}: {
  productId: string;
  initialCount: number;
  hasUpvoted?: boolean;
  isLoggedIn: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [upvoted, setUpvoted] = useState(hasUpvoted);
  const [loading, setLoading] = useState(false);

  async function handleUpvote() {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}/upvote`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.upvoteCount);
        setUpvoted(data.upvoted);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <TerminalButton
      variant={upvoted ? "primary" : "ghost"}
      onClick={handleUpvote}
      disabled={loading}
    >
      {upvoted ? "[UPVOTED]" : "[UPVOTE]"} ▲ {count}
    </TerminalButton>
  );
}
