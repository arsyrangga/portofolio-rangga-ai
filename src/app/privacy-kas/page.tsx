"use client";

import { useEffect, useRef, useState } from "react";
import { Inter, IBM_Plex_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

type Section = {
  id: string;
  number: string;
  title: string;
};

const SECTIONS: Section[] = [
  { id: "informasi", number: "01", title: "Informasi yang Kami Kumpulkan" },
  { id: "penggunaan", number: "02", title: "Cara Kami Menggunakan Informasi" },
  { id: "keamanan", number: "03", title: "Penyimpanan dan Keamanan Data" },
  { id: "berbagi", number: "04", title: "Berbagi dengan Pihak Ketiga" },
  { id: "retensi", number: "05", title: "Retensi Data" },
  { id: "hak", number: "06", title: "Hak Pengguna" },
  { id: "anak", number: "07", title: "Privasi Anak-anak" },
  { id: "perubahan", number: "08", title: "Perubahan Kebijakan" },
  { id: "kontak", number: "09", title: "Hubungi Kami" },
];

const C = {
  bg: "#FFFFFF",
  surface: "#F7F8FA",
  ink: "#13151A",
  inkSoft: "#666C7A",
  border: "#E7E9ED",
  accent: "#16A34A",
  accentSoft: "#EEFBF3",
};

export default function KebijakanPrivasiPage() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [navOpen, setNavOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const OFFSET = 140; // px from top of viewport that counts as the "active" line

    function computeActive() {
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = sectionRefs.current[s.id];
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        // Section has reached/passed the active line, so it's the
        // current candidate. We keep walking so the LAST one that
        // qualifies (i.e. the lowest one already scrolled past the
        // line) wins.
        if (top - OFFSET <= 0) {
          current = s.id;
        }
      }

      // If user has scrolled to the very bottom of the page, force the
      // last section active even if its content is shorter than the
      // offset (covers short final sections like "Hubungi Kami").
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (scrolledToBottom) current = SECTIONS[SECTIONS.length - 1].id;

      setActiveId((prev) => (prev === current ? prev : current));
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        computeActive();
        ticking = false;
      });
    }

    computeActive(); // set correct initial state on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function goTo(id: string) {
    const el = sectionRefs.current[id];
    if (!el) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    setNavOpen(false);
  }

  return (
    <div
      className={`${inter.variable} ${plexMono.variable} min-h-screen`}
      style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-body)" }}
    >
      {/* Top bar */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-sm"
        style={{ borderColor: C.border, backgroundColor: "rgba(255,255,255,0.85)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold"
              style={{ backgroundColor: C.accent, color: "#fff" }}
            >
              K
            </span>
            <span className="text-[15px] font-semibold">Kas Canggih</span>
          </div>
          <button
            onClick={() => setNavOpen((v) => !v)}
            className="rounded-md border px-3 py-1.5 text-xs font-medium lg:hidden focus:outline-none focus-visible:ring-2"
            style={{ borderColor: C.border, color: C.inkSoft }}
            aria-expanded={navOpen}
            aria-controls="mobile-toc"
          >
            {navOpen ? "Tutup" : "Daftar isi"}
          </button>
        </div>

        {navOpen && (
          <nav
            id="mobile-toc"
            className="border-t px-5 py-3 lg:hidden"
            style={{ borderColor: C.border }}
          >
            <ul className="flex flex-col gap-0.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => goTo(s.id)}
                    className="flex w-full items-baseline gap-3 rounded-md px-2 py-2 text-left text-sm focus:outline-none focus-visible:ring-2"
                    style={{ color: C.inkSoft }}
                  >
                    <span style={{ fontFamily: "var(--font-mono)", color: C.accent, fontSize: "11px" }}>
                      {s.number}
                    </span>
                    <span>{s.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-14 pb-10 md:px-8">
        <div
          className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: C.accentSoft, color: C.accent, fontFamily: "var(--font-mono)" }}
        >
          Diperbarui 18 Juni 2026
        </div>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
          Kebijakan Privasi
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: C.inkSoft }}>
          Aplikasi Kas Canggih dikembangkan oleh RanggaAI. Kami berkomitmen untuk
          melindungi privasi pengguna dan memastikan bahwa data pribadi dikelola
          secara bertanggung jawab. Dengan menggunakan Aplikasi ini, Anda
          menyetujui praktik yang dijelaskan dalam Kebijakan Privasi ini.
        </p>
      </section>

      {/* Body: sidebar + content */}
      <div className="mx-auto max-w-6xl gap-12 px-5 pb-24 md:px-8 lg:flex">
        <aside className="hidden lg:block lg:w-60 lg:flex-shrink-0">
          <nav className="sticky top-24 flex flex-col gap-0.5">
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-wide"
              style={{ color: C.inkSoft }}
            >
              Daftar isi
            </p>
            {SECTIONS.map((s) => {
              const isActive = activeId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => goTo(s.id)}
                  className="group flex items-baseline gap-3 rounded-md py-1.5 pl-3 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2"
                  style={{
                    color: isActive ? C.ink : C.inkSoft,
                    borderLeft: `2px solid ${isActive ? C.accent : C.border}`,
                    fontWeight: isActive ? 600 : 400,
                  }}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="leading-snug">{s.title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="flex flex-col gap-12">
            <SectionBlock
              refCb={(el) => (sectionRefs.current["informasi"] = el)}
              id="informasi"
              number="01"
              title="Informasi yang Kami Kumpulkan"
            >
              <SubEntry title="1. Informasi Akun">
                <p style={{ color: C.inkSoft }}>
                  Jika Anda menggunakan fitur Login Google, kami dapat menerima
                  informasi berikut dari akun Google Anda:
                </p>
                <SimpleList items={["Nama", "Alamat email", "Foto profil (jika tersedia)"]} />
                <p style={{ color: C.inkSoft }}>
                  Informasi tersebut digunakan untuk proses autentikasi dan
                  pengelolaan akun pengguna.
                </p>
              </SubEntry>

              <SubEntry title="2. Data yang Anda Masukkan">
                <p style={{ color: C.inkSoft }}>
                  Aplikasi dapat menyimpan data yang Anda masukkan untuk keperluan
                  pencatatan dan pengelolaan keuangan, seperti:
                </p>
                <SimpleList
                  items={[
                    "Data kas",
                    "Catatan transaksi",
                    "Kategori transaksi",
                    "Informasi lain yang Anda input ke dalam aplikasi",
                  ]}
                />
              </SubEntry>

              <SubEntry title="3. Data Suara">
                <p style={{ color: C.inkSoft }}>
                  Aplikasi menyediakan fitur konversi suara menjadi teks
                  (speech-to-text). Saat Anda menggunakan fitur ini:
                </p>
                <SimpleList
                  items={[
                    "Suara direkam hanya saat Anda mengaktifkan fitur tersebut.",
                    "Data suara digunakan untuk mengubah ucapan menjadi teks.",
                    "Data suara tidak digunakan untuk identifikasi pengguna.",
                    "Data suara tidak dijual kepada pihak ketiga.",
                  ]}
                />
                <p style={{ color: C.inkSoft }}>
                  Pemrosesan suara dapat dilakukan menggunakan layanan pihak ketiga
                  yang menyediakan teknologi pengenalan suara.
                </p>
              </SubEntry>

              <SubEntry title="4. Informasi Perangkat">
                <p style={{ color: C.inkSoft }}>
                  Aplikasi dapat mengumpulkan informasi teknis tertentu seperti:
                </p>
                <SimpleList items={["Jenis perangkat", "Sistem operasi", "Versi aplikasi"]} />
                <p style={{ color: C.inkSoft }}>
                  Informasi ini digunakan untuk menjaga stabilitas dan
                  kompatibilitas aplikasi.
                </p>
              </SubEntry>
            </SectionBlock>

            <SectionBlock
              refCb={(el) => (sectionRefs.current["penggunaan"] = el)}
              id="penggunaan"
              number="02"
              title="Cara Kami Menggunakan Informasi"
            >
              <p style={{ color: C.inkSoft }}>Informasi yang dikumpulkan digunakan untuk:</p>
              <SimpleList
                items={[
                  "Menyediakan dan mengoperasikan layanan aplikasi.",
                  "Menyimpan data kas dan transaksi pengguna.",
                  "Menyediakan fitur login dan autentikasi.",
                  "Menyediakan fitur konversi suara menjadi teks.",
                  "Memperbaiki kualitas dan kinerja aplikasi.",
                  "Menangani masalah teknis dan dukungan pengguna.",
                ]}
              />
            </SectionBlock>

            <SectionBlock
              refCb={(el) => (sectionRefs.current["keamanan"] = el)}
              id="keamanan"
              number="03"
              title="Penyimpanan dan Keamanan Data"
            >
              <p style={{ color: C.inkSoft }}>
                Kami berupaya melindungi data pengguna menggunakan langkah-langkah
                keamanan yang wajar dan sesuai standar industri. Meskipun demikian,
                tidak ada metode penyimpanan atau transmisi data melalui internet
                yang dapat dijamin sepenuhnya aman.
              </p>
            </SectionBlock>

            <SectionBlock
              refCb={(el) => (sectionRefs.current["berbagi"] = el)}
              id="berbagi"
              number="04"
              title="Berbagi Informasi dengan Pihak Ketiga"
            >
              <p style={{ color: C.inkSoft }}>
                Kami tidak menjual data pribadi pengguna kepada pihak ketiga. Data
                dapat diproses oleh penyedia layanan yang membantu operasional
                aplikasi, termasuk:
              </p>
              <SimpleList
                items={[
                  "Google Sign-In untuk autentikasi pengguna.",
                  "Penyedia layanan pengenalan suara (speech recognition) yang digunakan untuk fitur suara menjadi teks.",
                  "Penyedia layanan hosting atau cloud jika diperlukan.",
                ]}
              />
              <p style={{ color: C.inkSoft }}>
                Pihak ketiga tersebut hanya dapat menggunakan data sesuai
                kebutuhan untuk menyediakan layanan mereka.
              </p>
            </SectionBlock>

            <SectionBlock
              refCb={(el) => (sectionRefs.current["retensi"] = el)}
              id="retensi"
              number="05"
              title="Retensi Data"
            >
              <p style={{ color: C.inkSoft }}>
                Data pengguna akan disimpan selama akun masih aktif atau selama
                diperlukan untuk menyediakan layanan aplikasi. Pengguna dapat
                meminta penghapusan data dengan menghubungi kami melalui alamat
                email yang tercantum di bawah.
              </p>
            </SectionBlock>

            <SectionBlock
              refCb={(el) => (sectionRefs.current["hak"] = el)}
              id="hak"
              number="06"
              title="Hak Pengguna"
            >
              <p style={{ color: C.inkSoft }}>Pengguna memiliki hak untuk:</p>
              <SimpleList
                items={[
                  "Mengakses data pribadi yang dimiliki.",
                  "Memperbarui informasi akun.",
                  "Meminta penghapusan data.",
                  "Mengajukan pertanyaan terkait privasi dan penggunaan data.",
                ]}
              />
            </SectionBlock>

            <SectionBlock
              refCb={(el) => (sectionRefs.current["anak"] = el)}
              id="anak"
              number="07"
              title="Privasi Anak-anak"
            >
              <p style={{ color: C.inkSoft }}>
                Aplikasi ini tidak ditujukan secara khusus untuk anak-anak di
                bawah usia 13 tahun. Kami tidak secara sengaja mengumpulkan
                informasi pribadi dari anak-anak.
              </p>
            </SectionBlock>

            <SectionBlock
              refCb={(el) => (sectionRefs.current["perubahan"] = el)}
              id="perubahan"
              number="08"
              title="Perubahan Kebijakan Privasi"
            >
              <p style={{ color: C.inkSoft }}>
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
                Perubahan akan diumumkan melalui halaman Kebijakan Privasi ini.
              </p>
            </SectionBlock>

            <SectionBlock
              refCb={(el) => (sectionRefs.current["kontak"] = el)}
              id="kontak"
              number="09"
              title="Hubungi Kami"
              isLast
            >
              <p style={{ color: C.inkSoft }}>
                Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini,
                silakan hubungi:
              </p>
              <div
                className="mt-1 inline-flex w-fit items-center gap-4 rounded-xl border px-5 py-4"
                style={{ borderColor: C.border, backgroundColor: C.surface }}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: C.accent, color: "#fff" }}
                >
                  K
                </span>
                <div>
                  <p className="text-sm font-semibold">RanggaAI</p>
                  <a
                    href="mailto:arsyrangga@gmail.com"
                    className="text-sm hover:underline focus:outline-none focus-visible:ring-2"
                    style={{ color: C.accent }}
                  >
                    arsyrangga@gmail.com
                  </a>
                </div>
              </div>
            </SectionBlock>
          </div>
        </main>
      </div>
    </div>
  );
}

function SectionBlock({
  id,
  number,
  title,
  children,
  refCb,
  isLast,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
  refCb: (el: HTMLElement | null) => void;
  isLast?: boolean;
}) {
  return (
    <section
      id={id}
      ref={refCb}
      className={isLast ? "" : "border-b pb-10"}
      style={{ borderColor: C.border, scrollMarginTop: "96px" }}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-semibold"
          style={{ backgroundColor: C.accentSoft, color: C.accent, fontFamily: "var(--font-mono)" }}
        >
          {number}
        </span>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
      </div>
      <div className="flex flex-col gap-5 pl-9 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}

function SubEntry({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold" style={{ color: C.ink }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function SimpleList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5" style={{ color: C.inkSoft }}>
          <span
            className="mt-2 h-1 w-1 flex-shrink-0 rounded-full"
            style={{ backgroundColor: C.accent }}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}