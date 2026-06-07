import { signOut } from "@/lib/auth";
import { TerminalButton } from "@/components/terminal/TerminalButton";

async function logout() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export function LogoutButton() {
  return (
    <form action={logout}>
      <TerminalButton type="submit" variant="ghost" className="px-3 py-1.5 text-xs">
        [LOGOUT]
      </TerminalButton>
    </form>
  );
}
