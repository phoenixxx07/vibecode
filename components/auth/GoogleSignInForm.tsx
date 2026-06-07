"use client";

type GoogleSignInFormProps = {
  callbackUrl?: string;
  className?: string;
  children: React.ReactNode;
};

export function GoogleSignInForm({
  callbackUrl = "/auth/complete",
  className,
  children,
}: GoogleSignInFormProps) {
  return (
    <form action="/api/auth/signin/google" method="POST" className={className}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {children}
    </form>
  );
}
