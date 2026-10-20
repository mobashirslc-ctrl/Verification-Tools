import { useState } from "react"
import {
  Building2,
  FileCheck2,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react"
import Dashboard from "./Dashboard"
import VerificationView from "./VerificationView"

export type StatementData = {
  bankName: string
  accountNumber: string
  accountType: string
  accountName: string
  openingBalance: string
  closingBalance: string
  periodFrom: string
  periodTo: string
  certificateId: string
  statementFileName: string
  bankLogo: string
}

const initialStatement: StatementData = {
  bankName: "Pubali Bank PLC",
  accountNumber: "0192 3445 6789",
  accountType: "Savings Account",
  accountName: "Mahir Hasan",
  openingBalance: "245000",
  closingBalance: "318450.75",
  periodFrom: "2025-01-01",
  periodTo: "2025-03-31",
  certificateId: "GRN-PBL-2503-8F4K2",
  statementFileName: "",
  bankLogo: "",
}

type View = "dashboard" | "verification"

export default function App() {
  const [view, setView] = useState<View>("dashboard")
  const [statement, setStatement] = useState<StatementData>(initialStatement)

  return (
    <div className="min-h-screen bg-stone-50 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-screen-2xl items-center justify-between px-5 lg:px-8">
          <button
            className="group flex items-center gap-3"
            onClick={() => setView("dashboard")}
            aria-label="Go to dashboard"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-950 text-lime-300 shadow-sm transition-transform group-hover:scale-105">
              <ShieldCheck size={21} strokeWidth={2.25} />
            </span>
            <span className="text-left">
              <span className="block font-display text-xl font-bold leading-none tracking-tight">
                gorun
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Statement Verify
              </span>
            </span>
          </button>

          <nav
            className="hidden items-center gap-1 rounded-xl bg-slate-100 p-1 sm:flex"
            aria-label="Primary navigation"
          >
            <NavButton
              active={view === "dashboard"}
              onClick={() => setView("dashboard")}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </NavButton>
            <NavButton
              active={view === "verification"}
              onClick={() => setView("verification")}
            >
              <FileCheck2 size={16} />
              Verification view
            </NavButton>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                Gorun Admin
              </p>
              <p className="text-xs text-slate-400">Verification desk</p>
            </div>
            <div className="grid size-10 place-items-center rounded-full bg-lime-200 text-sm font-bold text-emerald-950">
              GA
            </div>
          </div>

          <button
            className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-emerald-950 sm:hidden"
            onClick={() =>
              setView(view === "dashboard" ? "verification" : "dashboard")
            }
            aria-label={
              view === "dashboard" ? "Open verification view" : "Open dashboard"
            }
          >
            {view === "dashboard" ? (
              <FileCheck2 size={19} />
            ) : (
              <Building2 size={19} />
            )}
          </button>
        </div>
      </header>

      {view === "dashboard" ? (
        <Dashboard
          statement={statement}
          onChange={setStatement}
          onOpenVerification={() => setView("verification")}
        />
      ) : (
        <VerificationView
          statement={statement}
          onBack={() => setView("dashboard")}
        />
      )}
    </div>
  )
}

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? "bg-white text-emerald-950 shadow-sm"
          : "text-slate-500 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  )
}
