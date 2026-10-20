import { ChangeEvent, DragEvent, useRef, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  FileText,
  Image,
  Info,
  QrCode,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react"
import type { StatementData } from "./App"

type DashboardProps = {
  statement: StatementData
  onChange: (statement: StatementData) => void
  onOpenVerification: () => void
}

const banks = [
  "Pubali Bank PLC",
  "The City Bank PLC",
  "BRAC Bank PLC",
  "Dutch-Bangla Bank PLC",
  "Eastern Bank PLC",
]
const accountTypes = [
  "Savings Account",
  "Current Account",
  "Business Account",
  "Fixed Deposit",
]

export default function Dashboard({
  statement,
  onChange,
  onOpenVerification,
}: DashboardProps) {
  const [showQr, setShowQr] = useState(false)
  const [copied, setCopied] = useState(false)
  const pdfInput = useRef<HTMLInputElement>(null)
  const logoInput = useRef<HTMLInputElement>(null)

  const verificationLink = `${window.location.origin}/verify/${statement.certificateId || "certificate"}`

  const update = (field: keyof StatementData, value: string) => {
    onChange({ ...statement, [field]: value })
  }

  const handlePdf = (file?: File) => {
    if (file?.type === "application/pdf") update("statementFileName", file.name)
  }

  const handleLogo = (file?: File) => {
    if (file?.type.startsWith("image/"))
      update("bankLogo", URL.createObjectURL(file))
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(verificationLink)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-5 py-8 lg:px-8 lg:py-12">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <span className="size-2 rounded-full bg-lime-400" />
            Verification management
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Create a verified statement
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Enter statement details, attach the original document, and generate
            a secure QR verification record.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <ShieldCheck size={19} className="text-emerald-600" />
          <span>
            <strong>Secure draft</strong>
            <span className="ml-1 text-emerald-700">saved locally</span>
          </span>
        </div>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_-32px_rgba(15,23,42,0.28)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Statement information
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                All fields are included in the verification record.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
              Step 1 of 2
            </span>
          </div>

          <form
            className="p-6 sm:p-8"
            onSubmit={(event) => {
              event.preventDefault()
              setShowQr(true)
            }}
          >
            <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
              <SelectField
                label="Bank name"
                value={statement.bankName}
                options={banks}
                onChange={(event) => update("bankName", event.target.value)}
              />
              <InputField
                label="Account number"
                value={statement.accountNumber}
                onChange={(event) =>
                  update("accountNumber", event.target.value)
                }
                placeholder="Enter account number"
                inputMode="numeric"
              />
              <SelectField
                label="Account type"
                value={statement.accountType}
                options={accountTypes}
                onChange={(event) => update("accountType", event.target.value)}
              />
              <InputField
                label="Account name"
                value={statement.accountName}
                onChange={(event) => update("accountName", event.target.value)}
                placeholder="Name of account holder"
              />
              <InputField
                label="Opening balance"
                value={statement.openingBalance}
                onChange={(event) =>
                  update("openingBalance", event.target.value)
                }
                placeholder="0.00"
                type="number"
                prefix="৳"
              />
              <InputField
                label="Closing balance"
                value={statement.closingBalance}
                onChange={(event) =>
                  update("closingBalance", event.target.value)
                }
                placeholder="0.00"
                type="number"
                prefix="৳"
              />
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Statement period
                </label>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <input
                    type="date"
                    value={statement.periodFrom}
                    onChange={(event) =>
                      update("periodFrom", event.target.value)
                    }
                    className="field"
                    required
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    to
                  </span>
                  <input
                    type="date"
                    value={statement.periodTo}
                    onChange={(event) => update("periodTo", event.target.value)}
                    className="field"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <InputField
                  label="Certificate ID"
                  value={statement.certificateId}
                  onChange={(event) =>
                    update("certificateId", event.target.value.toUpperCase())
                  }
                  placeholder="GRN-BANK-0000-XXXXX"
                  hint="Use a unique reference for this statement"
                />
              </div>
            </div>

            <div className="my-8 h-px bg-slate-100" />

            <div className="mb-4">
              <h3 className="font-display text-base font-bold text-slate-900">
                Supporting files
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Add the original PDF and an optional bank logo.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <UploadBox
                icon={<FileText size={21} />}
                title="Bank statement PDF"
                detail={statement.statementFileName || "PDF up to 20 MB"}
                accept=".pdf,application/pdf"
                active={Boolean(statement.statementFileName)}
                inputRef={pdfInput}
                onFile={handlePdf}
              />
              <UploadBox
                icon={
                  statement.bankLogo ? (
                    <img
                      src={statement.bankLogo}
                      className="size-7 object-contain"
                      alt=""
                    />
                  ) : (
                    <Image size={21} />
                  )
                }
                title="Bank logo"
                detail={
                  statement.bankLogo
                    ? "Logo uploaded successfully"
                    : "PNG, JPG or SVG"
                }
                accept="image/*"
                active={Boolean(statement.bankLogo)}
                inputRef={logoInput}
                onFile={handleLogo}
              />
            </div>

            <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Info size={15} />
                You can update these details after generating.
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 transition-all hover:-translate-y-0.5 hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-200"
              >
                <QrCode size={18} />
                Generate verification QR
              </button>
            </div>
          </form>
        </section>

        <aside className="xl:sticky xl:top-26">
          <div className="overflow-hidden rounded-2xl bg-emerald-950 text-white shadow-[0_24px_50px_-28px_rgba(6,78,59,0.65)]">
            <div className="relative overflow-hidden px-6 pb-7 pt-6">
              <div className="absolute -right-12 -top-12 size-40 rounded-full border-[28px] border-white/5" />
              <div className="relative flex items-start justify-between">
                <div className="grid size-11 place-items-center overflow-hidden rounded-xl bg-white text-emerald-950">
                  {statement.bankLogo ? (
                    <img
                      src={statement.bankLogo}
                      alt="Bank logo preview"
                      className="size-8 object-contain"
                    />
                  ) : (
                    <ShieldCheck size={23} />
                  )}
                </div>
                <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-lime-300">
                  Preview
                </span>
              </div>
              <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-emerald-300">
                Issued by
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-tight">
                {statement.bankName || "Select a bank"}
              </h2>
              <p className="mt-1 text-sm text-emerald-200/70">
                {statement.accountType}
              </p>
            </div>
            <div className="border-t border-white/10 bg-white/5 px-6 py-5">
              <p className="text-xs text-emerald-300">Account holder</p>
              <p className="mt-1 font-semibold">
                {statement.accountName || "—"}
              </p>
              <div className="mt-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-emerald-300">Certificate ID</p>
                  <p className="mt-1 font-mono text-xs font-semibold tracking-wide">
                    {statement.certificateId || "—"}
                  </p>
                </div>
                <div className="grid size-12 place-items-center rounded-lg bg-white">
                  <QRCodeCanvas
                    value={verificationLink}
                    size={36}
                    fgColor="#052e2b"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-lime-100 text-emerald-800">
                <CheckCircle2 size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Ready to verify
                </p>
                <p className="text-xs text-slate-400">
                  Preview your public record
                </p>
              </div>
            </div>
            <button
              onClick={onOpenVerification}
              className="mt-4 flex w-full items-center justify-between rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200"
            >
              Open verification page
              <ArrowRight size={17} />
            </button>
          </div>
        </aside>
      </div>

      {showQr && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-emerald-950/65 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Generated QR code"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowQr(false)
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="mb-4 grid size-11 place-items-center rounded-xl bg-lime-100 text-emerald-900">
                  <Check size={22} strokeWidth={3} />
                </span>
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950">
                  QR code generated
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your public verification link is ready to share.
                </p>
              </div>
              <button
                onClick={() => setShowQr(false)}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
                aria-label="Close QR modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-6 grid place-items-center rounded-2xl border border-slate-100 bg-slate-50 p-7">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <QRCodeCanvas
                  value={verificationLink}
                  size={180}
                  fgColor="#052e2b"
                  level="H"
                />
              </div>
              <p className="mt-4 font-mono text-xs font-semibold text-slate-500">
                {statement.certificateId}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 pl-4">
              <p className="min-w-0 flex-1 truncate text-xs text-slate-500">
                {verificationLink}
              </p>
              <button
                onClick={copyLink}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                  copied
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {copied ? <Check size={14} /> : <Clipboard size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <button
              onClick={() => {
                setShowQr(false)
                onOpenVerification()
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-950 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-emerald-900"
            >
              View public verification
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

function InputField({
  label,
  hint,
  prefix,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  prefix?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <span className="relative block">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
            {prefix}
          </span>
        )}
        <input
          {...props}
          required
          className={`field ${prefix ? "pl-9" : ""}`}
        />
      </span>
      {hint && (
        <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>
      )}
    </label>
  )
}

function SelectField({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  options: string[]
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <span className="relative block">
        <select {...props} className="field appearance-none pr-10">
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </span>
    </label>
  )
}

type UploadBoxProps = {
  icon: React.ReactNode
  title: string
  detail: string
  accept: string
  active: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
  onFile: (file?: File) => void
}

function UploadBox({
  icon,
  title,
  detail,
  accept,
  active,
  inputRef,
  onFile,
}: UploadBoxProps) {
  const [dragging, setDragging] = useState(false)

  const drop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setDragging(false)
    onFile(event.dataTransfer.files[0])
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onFile(event.target.files?.[0])
        }
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
        className={`group flex min-h-36 items-center gap-4 rounded-xl border border-dashed p-5 text-left transition-all ${
          dragging
            ? "border-emerald-500 bg-emerald-50"
            : active
              ? "border-emerald-300 bg-emerald-50/50"
              : "border-slate-300 bg-slate-50/60 hover:border-emerald-400 hover:bg-emerald-50/40"
        }`}
      >
        <span
          className={`grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl transition-colors ${
            active
              ? "bg-white text-emerald-700 shadow-sm"
              : "bg-white text-slate-500 shadow-sm group-hover:text-emerald-700"
          }`}
        >
          {active && !title.includes("logo") ? (
            <CheckCircle2 size={22} />
          ) : (
            icon
          )}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-slate-800">
            {title}
          </span>
          <span
            className={`mt-1 block truncate text-xs ${
              active ? "text-emerald-700" : "text-slate-400"
            }`}
          >
            {detail}
          </span>
          <span className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <UploadCloud size={14} />
            {active ? "Replace file" : "Browse or drop here"}
          </span>
        </span>
      </button>
    </>
  )
}
