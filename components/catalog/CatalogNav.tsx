import Link from "next/link";

export function CatalogNav({ active }: { active: "products" | "requests" }) {
  const tabs = [
    { key: "products" as const, label: "Produk", href: "/catalog" },
    { key: "requests" as const, label: "Request Project", href: "/catalog/requests" },
  ];

  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b border-muted pb-4">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`border px-4 py-2 text-xs font-bold uppercase transition-colors ${
            active === tab.key
              ? "border-primary bg-primary text-background-dark"
              : "border-muted text-muted hover:border-primary hover:text-primary"
          }`}
        >
          [{tab.label.toUpperCase().replace(" ", "_")}]
        </Link>
      ))}
    </nav>
  );
}
