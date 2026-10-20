import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  Download,
  FileCheck2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react"
import type { StatementData } from "./App"

type VerificationViewProps = {
  statement: StatementData
  onBack: () => void
}

export default function VerificationView({
  statement,
  onBack,
}: VerificationViewProps) {
  const currency = (value: string) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(Number(value) || 0)

  const date = (value: string) =>
    value
      ? new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(`${value}T00:00:00`))
      : "—"

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-[radial-gradient(circle_at_top,_#d1fae5_0,_#fafaf9_34rem)] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={onBack}
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to management
        </button>

        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_28px_80px_-36px_rgba(6,78,59,0.32)]">
          <header className="relative overflow-hidden bg-emerald-950 px-5 pb-14 pt-6 text-white sm:px-8 sm:pb-16 sm:pt-8">
            <div className="absolute -right-20 -top-28 size-72 rounded-full border-[44px] border-white/5" />
            <div className="absolute -bottom-28 -left-14 size-56 rounded-full border-[34px] border-lime-300/5" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-emerald-950 shadow-sm sm:size-14">
                  {statement.bankLogo ? (
                    <img
                      src={statement.bankLogo}
                      alt={`${statement.bankName} logo`}
                      className="size-9 object-contain"
                    />
                  ) : (
                    <Building2 size={25} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold sm:text-xl">
                    {statement.bankName}
                  </p>
                  <p className="mt-0.5 text-xs text-emerald-200/70">
                    Digital Statement Verification
                  </p>
                </div>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-emerald-100 sm:flex">
                <LockKeyhole size={14} />
                Secure record
              </div>
            </div>
          </header>

          <div className="-mt-7 px-4 pb-7 sm:-mt-8 sm:px-8 sm:pb-9">
            <section className="relative rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_12px_30px_-18px_rgba(6,78,59,0.4)] sm:p-6">
              <div className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                  <Check size={24} strokeWidth={3.5} />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                      Valid Statement
                    </h1>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                      Verified
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    This statement is authentic and its details match the
                    issuing record.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <FileCheck2 size={18} className="text-emerald-700" />
                  <h2 className="font-display text-sm font-bold text-slate-900 sm:text-base">
                    Statement summary
                  </h2>
                </div>
                <span className="font-mono text-[10px] font-bold text-slate-400">
                  GORUN VERIFIED
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <p className="section-label">Account details</p>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <Detail label="Account name" value={statement.accountName} />
                  <Detail label="Account type" value={statement.accountType} />
                  <Detail
                    label="Account number"
                    value={maskAccount(statement.accountNumber)}
                    mono
                  />
                  <Detail label="Issuing bank" value={statement.bankName} />
                </div>

                <div className="my-6 h-px bg-slate-100" />

                <p className="section-label">Balance summary</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-400">
                      Opening balance
                    </p>
                    <p className="mt-2 break-all font-display text-base font-bold text-slate-800 sm:text-lg">
                      {currency(statement.openingBalance)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-4">
                    <p className="text-xs font-medium text-emerald-700">
                      Closing balance
                    </p>
                    <p className="mt-2 break-all font-display text-base font-bold text-emerald-950 sm:text-lg">
                      {currency(statement.closingBalance)}
                    </p>
                  </div>
                </div>

                <div className="my-6 h-px bg-slate-100" />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="section-label">Statement period</p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                        <CalendarDays size={17} />
                      </span>
                      <p className="text-sm font-semibold text-slate-700">
                        {date(statement.periodFrom)}{" "}
                        <span className="mx-1 text-slate-300">—</span>{" "}
                        {date(statement.periodTo)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="section-label">Certificate ID</p>
                    <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2.5 font-mono text-xs font-bold tracking-wide text-slate-700">
                      {statement.certificateId}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <button
              onClick={() =>
                window.alert(
                  "Demo mode: connect this action to your statement file URL.",
                )
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900"
            >
              <Download size={17} />
              View original statement
            </button>

            <div className="mt-7 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
              <ShieldCheck size={15} className="text-emerald-600" />
              Secured and verified by{" "}
              <strong className="font-bold text-slate-600">Gorun</strong>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-center text-[11px] leading-5 text-slate-400">
          Verification confirms that the displayed information matches the
          record supplied to Gorun. It does not constitute a guarantee of
          available funds.
        </p>
      </div>
    </main>
  )
}

function Detail({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p
        className={`mt-1.5 text-sm font-bold text-slate-800 ${
          mono ? "font-mono tracking-wide" : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  )
}

function maskAccount(accountNumber: string) {
  const compact = accountNumber.replace(/\s/g, "")
  if (compact.length < 5) return accountNumber || "—"
  return `•••• •••• ${compact.slice(-4)}`
}
