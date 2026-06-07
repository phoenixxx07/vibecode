import { useState } from "react";

const COLORS = {
  bg: "#0A0A0F",
  card: "#111118",
  border: "#1E1E2E",
  accent: "#6EE7B7",
  accent2: "#818CF8",
  accent3: "#F472B6",
  text: "#E2E8F0",
  muted: "#64748B",
  highlight: "#1A1A2E",
};

const Section = ({ title, color = COLORS.accent, children }) => (
  <div style={{
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: "28px 32px",
    marginBottom: 24,
  }}>
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 20,
    }}>
      <div style={{ width: 4, height: 22, background: color, borderRadius: 4 }} />
      <h2 style={{ color, fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>{title}</h2>
    </div>
    {children}
  </div>
);

const Tag = ({ label, color = COLORS.accent }) => (
  <span style={{
    display: "inline-block",
    background: color + "18",
    border: `1px solid ${color}40`,
    color,
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 600,
    marginRight: 6,
    marginBottom: 6,
  }}>{label}</span>
);

const Row = ({ label, value, muted }) => (
  <div style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
    <span style={{ color: COLORS.muted, fontSize: 13, minWidth: 160, paddingTop: 1 }}>{label}</span>
    <span style={{ color: muted ? COLORS.muted : COLORS.text, fontSize: 13, flex: 1 }}>{value}</span>
  </div>
);

const Phase = ({ num, title, items, color }) => (
  <div style={{
    background: COLORS.highlight,
    border: `1px solid ${color}30`,
    borderRadius: 12,
    padding: "16px 20px",
    marginBottom: 12,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <div style={{
        background: color,
        color: "#000",
        borderRadius: "50%",
        width: 22,
        height: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 800,
        flexShrink: 0,
      }}>{num}</div>
      <span style={{ color, fontWeight: 700, fontSize: 14 }}>{title}</span>
    </div>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5 }}>
        <span style={{ color, fontSize: 12, marginTop: 2 }}>→</span>
        <span style={{ color: COLORS.text, fontSize: 13 }}>{item}</span>
      </div>
    ))}
  </div>
);

// ERD Component
const ERDTable = ({ name, color, fields, x, y, width = 220 }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect width={width} height={32 + fields.length * 28} rx={8} fill="#111118" stroke={color} strokeWidth={1.5} />
    <rect width={width} height={32} rx={8} fill={color + "22"} />
    <rect width={width} y={24} height={8} fill={color + "22"} />
    <text x={width / 2} y={21} textAnchor="middle" fill={color} fontSize={13} fontWeight={700} fontFamily="monospace">{name}</text>
    {fields.map((f, i) => (
      <g key={i} transform={`translate(0, ${32 + i * 28})`}>
        {i % 2 === 0 && <rect width={width} height={28} fill="#ffffff05" />}
        <text x={12} y={18} fill={f.pk ? color : f.fk ? "#818CF8" : "#94a3b8"} fontSize={11} fontFamily="monospace" fontWeight={f.pk || f.fk ? 700 : 400}>
          {f.pk ? "🔑 " : f.fk ? "🔗 " : "   "}{f.name}
        </text>
        <text x={width - 10} y={18} textAnchor="end" fill="#475569" fontSize={10} fontFamily="monospace">{f.type}</text>
      </g>
    ))}
  </g>
);

const ERDLine = ({ x1, y1, x2, y2, color = "#334155" }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.6} />
);

export default function App() {
  const [tab, setTab] = useState("resume");

  const tabs = [
    { id: "resume", label: "📋 Resume" },
    { id: "erd", label: "🗄️ ERD" },
    { id: "flow", label: "🔄 User Flow" },
  ];

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: "100vh",
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      color: COLORS.text,
      padding: "0 0 60px",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "24px 32px 0",
        background: COLORS.card,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>⚡</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: COLORS.text }}>VibeCatalog.id</h1>
              <p style={{ margin: 0, fontSize: 11, color: COLORS.muted }}>Platform Dokumen Perencanaan</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 20 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: "none",
                border: "none",
                borderBottom: tab === t.id ? `2px solid ${COLORS.accent}` : "2px solid transparent",
                color: tab === t.id ? COLORS.accent : COLORS.muted,
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: tab === t.id ? 700 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 24px" }}>

        {/* RESUME TAB */}
        {tab === "resume" && (
          <div>
            <Section title="Ringkasan Produk" color={COLORS.accent}>
              <Row label="Nama Platform" value="VibeCatalog.id (atau buatanlokal.id)" />
              <Row label="Konsep" value="Direktori & katalog produk digital buatan vibe coder Indonesia" />
              <Row label="Target User" value="Vibe coder lokal (builder) + pengguna yang cari tools lokal" />
              <Row label="Kompetitor" value="AppVerse.id (generalis), VibeDev.id (komunitas)" />
              <Row label="Differensiasi" value="Fokus vibe coding, filter by AI tools, screenshot preview otomatis" />
            </Section>

            <Section title="Fitur MVP" color={COLORS.accent2}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { icon: "🔍", title: "Katalog & Filter", desc: "Filter by kategori, AI tools, platform, harga" },
                  { icon: "📸", title: "Auto Screenshot", desc: "Preview via Thum.io saat submit, gambar statis" },
                  { icon: "📝", title: "Form Submission", desc: "Self-submit dengan kurasi admin sebelum live" },
                  { icon: "👤", title: "Akun Builder", desc: "Profil minimal: nama, sosmed, daftar produk" },
                  { icon: "👍", title: "Upvote", desc: "Pengunjung bisa upvote produk favorit" },
                  { icon: "🛡️", title: "Admin Dashboard", desc: "Approve/reject/featured produk yang masuk" },
                ].map((f, i) => (
                  <div key={i} style={{
                    background: COLORS.highlight,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{f.icon}</div>
                    <div style={{ color: COLORS.accent2, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{f.title}</div>
                    <div style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Form Submission Fields" color={COLORS.accent3}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      {["Field", "Tipe", "Wajib", "Catatan"].map(h => (
                        <th key={h} style={{ textAlign: "left", color: COLORS.muted, padding: "8px 12px", borderBottom: `1px solid ${COLORS.border}`, fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Nama Produk", "text", "✅", ""],
                      ["URL Website", "url", "✅", "Trigger auto-screenshot"],
                      ["Tagline", "text", "✅", "Max 80 karakter"],
                      ["3 Highlight", "text x3", "✅", "Ganti list fitur panjang"],
                      ["Kategori", "select", "✅", "Dari list yang tersedia"],
                      ["Platform", "multi-select", "✅", "Web / Mobile / Desktop / Extension"],
                      ["AI Tools", "multi-select", "✅", "Bolt, Lovable, Cursor, dll + request baru"],
                      ["Harga", "select", "✅", "Gratis / Freemium / Berbayar"],
                      ["Tech Stack", "multi-select", "❌", "Opsional"],
                      ["Kontak Builder", "text", "✅", "Email atau sosmed"],
                    ].map(([f, t, w, c], i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : COLORS.highlight }}>
                        <td style={{ padding: "10px 12px", color: COLORS.text, fontWeight: 600 }}>{f}</td>
                        <td style={{ padding: "10px 12px", color: COLORS.accent2 }}>{t}</td>
                        <td style={{ padding: "10px 12px" }}>{w}</td>
                        <td style={{ padding: "10px 12px", color: COLORS.muted }}>{c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="Roadmap" color={COLORS.accent}>
              <Phase num={1} color={COLORS.accent} title="MVP — Katalog Dasar (2–3 minggu)"
                items={[
                  "Landing page + katalog dengan filter",
                  "Form submission + auto-screenshot (Thum.io)",
                  "Admin dashboard approve/reject",
                  "Akun builder minimal",
                  "Seeding manual 20–30 produk awal",
                ]} />
              <Phase num={2} color={COLORS.accent2} title="Traction — Community Features (1–2 bulan)"
                items={[
                  "Upvote & bookmark",
                  "Halaman profil builder publik",
                  "Request tambah AI Tools",
                  "Search full-text",
                  '"Product of the Week" editorial',
                ]} />
              <Phase num={3} color={COLORS.accent3} title="Growth — Monetisasi (3+ bulan)"
                items={[
                  "Featured listing berbayar",
                  "Newsletter mingguan (sponsor slot)",
                  '"Hire Builder" di profil',
                  "Perbandingan produk side-by-side",
                  "API untuk embed katalog",
                ]} />
            </Section>

            <Section title="Tech Stack Rekomendasi" color={COLORS.accent2}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  ["Next.js", COLORS.accent],
                  ["PostgreSQL", COLORS.accent2],
                  ["Prisma ORM", COLORS.accent2],
                  ["Thum.io (screenshot)", COLORS.accent3],
                  ["NextAuth.js", COLORS.accent],
                  ["Tailwind CSS", COLORS.accent],
                  ["Docker + Traefik", COLORS.accent2],
                  ["Vercel / VPS", COLORS.accent3],
                ].map(([t, c]) => <Tag key={t} label={t} color={c} />)}
              </div>
              <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                Stack familiar dengan infrastruktur yang sudah kamu punya (Docker + Traefik).
              </p>
            </Section>
          </div>
        )}

        {/* ERD TAB */}
        {tab === "erd" && (
          <div>
            <Section title="Entity Relationship Diagram" color={COLORS.accent}>
              <p style={{ color: COLORS.muted, fontSize: 12, marginBottom: 16, margin: "0 0 16px" }}>
                🔑 Primary Key &nbsp;&nbsp; 🔗 Foreign Key
              </p>
              <div style={{ overflowX: "auto", borderRadius: 12, background: COLORS.highlight, border: `1px solid ${COLORS.border}`, padding: 16 }}>
                <svg width="860" height="680" style={{ display: "block" }}>
                  {/* Relationship Lines */}
                  {/* users → products */}
                  <ERDLine x1={150} y1={176} x2={150} y2={240} color={COLORS.accent} />
                  {/* products → product_ai_tools */}
                  <ERDLine x1={260} y1={440} x2={460} y2={440} color={COLORS.accent2} />
                  {/* products → product_categories */}
                  <ERDLine x1={260} y1={360} x2={460} y2={530} color={COLORS.accent3} />
                  {/* products → upvotes */}
                  <ERDLine x1={260} y1={390} x2={640} y2={300} color={COLORS.accent} />
                  {/* users → upvotes */}
                  <ERDLine x1={220} y1={176} x2={680} y2={260} color={COLORS.accent} />
                  {/* ai_tools → product_ai_tools */}
                  <ERDLine x1={640} y1={176} x2={570} y2={400} color={COLORS.accent2} />
                  {/* categories → product_categories */}
                  <ERDLine x1={680} y1={440} x2={680} y2={500} color={COLORS.accent3} />

                  {/* USERS */}
                  <ERDTable name="users" color={COLORS.accent} x={30} y={30} fields={[
                    { name: "id", type: "uuid", pk: true },
                    { name: "name", type: "varchar" },
                    { name: "email", type: "varchar" },
                    { name: "avatar_url", type: "text" },
                    { name: "social_link", type: "text" },
                    { name: "role", type: "enum" },
                    { name: "created_at", type: "timestamp" },
                  ]} />

                  {/* PRODUCTS */}
                  <ERDTable name="products" color={COLORS.accent} x={30} y={240} width={240} fields={[
                    { name: "id", type: "uuid", pk: true },
                    { name: "user_id", type: "uuid", fk: true },
                    { name: "name", type: "varchar" },
                    { name: "tagline", type: "varchar" },
                    { name: "url", type: "text" },
                    { name: "screenshot_url", type: "text" },
                    { name: "highlight_1", type: "text" },
                    { name: "highlight_2", type: "text" },
                    { name: "highlight_3", type: "text" },
                    { name: "platform", type: "enum[]" },
                    { name: "pricing", type: "enum" },
                    { name: "status", type: "enum" },
                    { name: "is_featured", type: "boolean" },
                    { name: "upvote_count", type: "int" },
                    { name: "created_at", type: "timestamp" },
                  ]} />

                  {/* AI TOOLS */}
                  <ERDTable name="ai_tools" color={COLORS.accent2} x={620} y={30} fields={[
                    { name: "id", type: "uuid", pk: true },
                    { name: "name", type: "varchar" },
                    { name: "logo_url", type: "text" },
                    { name: "website", type: "text" },
                    { name: "is_approved", type: "boolean" },
                    { name: "created_at", type: "timestamp" },
                  ]} />

                  {/* PRODUCT_AI_TOOLS (pivot) */}
                  <ERDTable name="product_ai_tools" color={COLORS.accent2} x={440} y={400} fields={[
                    { name: "product_id", type: "uuid", fk: true },
                    { name: "ai_tool_id", type: "uuid", fk: true },
                  ]} />

                  {/* CATEGORIES */}
                  <ERDTable name="categories" color={COLORS.accent3} x={620} y={440} fields={[
                    { name: "id", type: "uuid", pk: true },
                    { name: "name", type: "varchar" },
                    { name: "slug", type: "varchar" },
                    { name: "icon", type: "varchar" },
                  ]} />

                  {/* PRODUCT_CATEGORIES (pivot) */}
                  <ERDTable name="product_categories" color={COLORS.accent3} x={440} y={530} fields={[
                    { name: "product_id", type: "uuid", fk: true },
                    { name: "category_id", type: "uuid", fk: true },
                  ]} />

                  {/* UPVOTES */}
                  <ERDTable name="upvotes" color={COLORS.accent} x={620} y={260} fields={[
                    { name: "id", type: "uuid", pk: true },
                    { name: "user_id", type: "uuid", fk: true },
                    { name: "product_id", type: "uuid", fk: true },
                    { name: "created_at", type: "timestamp" },
                  ]} />

                  {/* AI_TOOL_REQUESTS */}
                  <ERDTable name="ai_tool_requests" color={COLORS.accent2} x={440} y={30} fields={[
                    { name: "id", type: "uuid", pk: true },
                    { name: "user_id", type: "uuid", fk: true },
                    { name: "name", type: "varchar" },
                    { name: "website", type: "text" },
                    { name: "status", type: "enum" },
                    { name: "created_at", type: "timestamp" },
                  ]} />

                </svg>
              </div>
            </Section>

            <Section title="Enum Values" color={COLORS.accent3}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { name: "users.role", values: ["user", "admin"] },
                  { name: "products.platform", values: ["web", "mobile", "desktop", "extension"] },
                  { name: "products.pricing", values: ["free", "freemium", "paid"] },
                  { name: "products.status", values: ["pending", "approved", "rejected"] },
                  { name: "ai_tool_requests.status", values: ["pending", "approved", "rejected"] },
                ].map((e, i) => (
                  <div key={i} style={{
                    background: COLORS.highlight,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    padding: "12px 16px",
                  }}>
                    <div style={{ color: COLORS.accent3, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{e.name}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {e.values.map(v => (
                        <span key={v} style={{
                          background: COLORS.card,
                          border: `1px solid ${COLORS.border}`,
                          color: COLORS.muted,
                          borderRadius: 4,
                          padding: "2px 8px",
                          fontSize: 11,
                          fontFamily: "monospace",
                        }}>{v}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* FLOW TAB */}
        {tab === "flow" && (
          <div>
            <Section title="Builder Flow" color={COLORS.accent}>
              {[
                { step: "01", title: "Daftar Akun", desc: "Email / Google OAuth", color: COLORS.accent },
                { step: "02", title: "Isi Form Submission", desc: "Nama, URL, tagline, 3 highlight, kategori, AI tools, platform, harga", color: COLORS.accent },
                { step: "03", title: "Auto Screenshot", desc: "System hit Thum.io API → simpan gambar preview ke storage", color: COLORS.accent },
                { step: "04", title: "Masuk Queue Review", desc: "Status: pending → notif ke admin dashboard", color: COLORS.accent2 },
                { step: "05", title: "Admin Kurasi", desc: "Approve / Reject / Request Edit", color: COLORS.accent2 },
                { step: "06", title: "Produk Live", desc: "Builder dapat notifikasi email + link listing", color: COLORS.accent },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 8, alignItems: "flex-start" }}>
                  <div style={{
                    background: s.color + "20",
                    border: `1px solid ${s.color}50`,
                    color: s.color,
                    borderRadius: 8,
                    padding: "6px 10px",
                    fontSize: 12,
                    fontWeight: 800,
                    minWidth: 40,
                    textAlign: "center",
                  }}>{s.step}</div>
                  <div style={{
                    background: COLORS.highlight,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    flex: 1,
                  }}>
                    <div style={{ color: s.color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ color: COLORS.muted, fontSize: 12 }}>{s.desc}</div>
                  </div>
                  {i < 5 && <div style={{ position: "absolute" }} />}
                </div>
              ))}
            </Section>

            <Section title="Visitor Flow" color={COLORS.accent2}>
              {[
                { step: "01", title: "Landing Homepage", desc: "Lihat produk terbaru + featured + stats (total produk, builder, kategori)" },
                { step: "02", title: "Browse & Filter", desc: "Filter: kategori, AI tools, platform, harga, sort: terbaru / terpopuler" },
                { step: "03", title: "Halaman Detail Produk", desc: "Screenshot preview, tagline, 3 highlight, info builder, upvote" },
                { step: "04", title: "Visit Website", desc: "CTA utama → buka URL produk di tab baru" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 8, alignItems: "flex-start" }}>
                  <div style={{
                    background: COLORS.accent2 + "20",
                    border: `1px solid ${COLORS.accent2}50`,
                    color: COLORS.accent2,
                    borderRadius: 8,
                    padding: "6px 10px",
                    fontSize: 12,
                    fontWeight: 800,
                    minWidth: 40,
                    textAlign: "center",
                  }}>{s.step}</div>
                  <div style={{
                    background: COLORS.highlight,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    flex: 1,
                  }}>
                    <div style={{ color: COLORS.accent2, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ color: COLORS.muted, fontSize: 12 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </Section>

            <Section title="Admin Flow" color={COLORS.accent3}>
              {[
                { step: "01", title: "Notif Produk Baru", desc: "Email/dashboard alert saat ada submission masuk" },
                { step: "02", title: "Review Submission", desc: "Cek screenshot, URL, konten — pastikan sesuai guidelines" },
                { step: "03", title: "Approve / Reject", desc: "Approve → produk live. Reject → builder dapat notif alasan" },
                { step: "04", title: "Manage Featured", desc: "Tandai produk pilihan sebagai Featured atau Editor's Pick" },
                { step: "05", title: "Approve AI Tools Request", desc: "Review request tools baru dari builder, tambahkan ke list global" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 8, alignItems: "flex-start" }}>
                  <div style={{
                    background: COLORS.accent3 + "20",
                    border: `1px solid ${COLORS.accent3}50`,
                    color: COLORS.accent3,
                    borderRadius: 8,
                    padding: "6px 10px",
                    fontSize: 12,
                    fontWeight: 800,
                    minWidth: 40,
                    textAlign: "center",
                  }}>{s.step}</div>
                  <div style={{
                    background: COLORS.highlight,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    flex: 1,
                  }}>
                    <div style={{ color: COLORS.accent3, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ color: COLORS.muted, fontSize: 12 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}