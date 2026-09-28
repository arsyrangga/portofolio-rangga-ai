"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, AlertCircle, ArrowLeft } from "lucide-react";

function AccessForm() {
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get("from");

  // Prevent open-redirect vulnerabilities and ensure redirect goes directly to login.html
  let destination =
    rawFrom && rawFrom.startsWith("/quad-proto") ? rawFrom : "/quad-proto/login.html";
  if (destination === "/quad-proto" || destination === "/quad-proto/") {
    destination = "/quad-proto/login.html";
  }

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setError("Silakan masukkan password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/quad-proto-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to intended prototype path
        window.location.href = destination;
      } else {
        setError(data.message || "Password salah. Silakan coba lagi.");
        setLoading(false);
      }
    } catch {
      setError("Gagal menghubungi server. Silakan coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[440px] bg-white rounded-[6px] shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] px-10 pt-12 pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3 text-neutral-900">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="11.5" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="14" cy="14" rx="5.5" ry="11.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M2.5 10h23M2.5 18h23"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-[22px] font-bold text-neutral-900 mb-2">QuadraNG Prototype</h1>
        <p className="text-[13px] text-neutral-500 leading-relaxed max-w-[280px] mx-auto">
          Akses prototipe ini diproteksi. Masukkan password otorisasi untuk membuka.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-5 p-3 rounded bg-red-50 border border-red-200 flex items-center gap-2.5 text-[13px] text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="block text-[13px] font-medium text-neutral-700 mb-2"
          >
            Password Prototipe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              autoFocus
              className="w-full h-10 px-3 pr-10 border border-neutral-300 text-neutral-900 text-[13px] outline-none focus:border-[#E04A2A] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#E04A2A] hover:bg-[#c93d21] text-white text-[14px] font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Buka Prototipe</span>
            </>
          )}
        </button>
      </form>

      {/* Back to portfolio */}
      <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-[#E04A2A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Portfolio</span>
        </Link>
      </div>
    </div>
  );
}

export default function QuadProtoAccessPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4 font-sans text-neutral-900">
      <Suspense fallback={<div className="text-neutral-500 text-sm">Loading...</div>}>
        <AccessForm />
      </Suspense>
    </div>
  );
}
