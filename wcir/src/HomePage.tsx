import React, { useEffect, useMemo, useState } from "react";
import { InfoBadge } from "./constants/InfoBadge";

// =========================
// Types & Utilities (TS)
// =========================

type CurrencyCode = "AUD" | "USD" | "EUR" | "GBP";

interface TargetParams {
  principal: number;
  monthlyContribution: number;
  annualRealReturnDecimal: number; // e.g. 0.05 for 5%
  targetAmount: number;
  maxYears?: number;
}

interface TargetResult {
  months: number;
  years: number;
  remMonths: number;
  balance: number;
  hit: boolean;
}

const clampNum = (n: number, min = 0, max = Number.POSITIVE_INFINITY): number =>
  Number.isFinite(n) ? Math.min(Math.max(n, min), max) : 0;

const toNumber = (v: string | number): number => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function currencyFormat(value: number, currency: CurrencyCode = "AUD"): string {
  if (!Number.isFinite(value)) return "-";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
  } catch {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
  }
}

function percent(value: number, digits: number = 1): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value * 100) + "%";
}

// Fisher equation (approx) -> real return in decimal
function realReturn(nominalPct: number, inflPct: number): number {
  const r = nominalPct / 100;
  const i = inflPct / 100;
  return (1 + r) / (1 + i) - 1;
}

function yearsToTarget({ principal, monthlyContribution, annualRealReturnDecimal, targetAmount, maxYears = 100 }: TargetParams): TargetResult {
  const monthlyRate = annualRealReturnDecimal / 12;
  let months = 0;
  let balance = principal;
  const maxMonths = Math.round(maxYears * 12);

  while (balance < targetAmount && months < maxMonths) {
    balance *= 1 + monthlyRate;
    balance += monthlyContribution;
    months++;
  }

  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return { months, years, remMonths, balance, hit: balance >= targetAmount };
}

// =========================
// Small UI bits
// =========================

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, hint, children }) => (
  <label className="block">
    <div className="text-sm text-slate-300">{label}</div>
    <div className="mt-1">{children}</div>
    {hint ? <div className="text-xs text-slate-500 mt-1">{hint}</div> : null}
  </label>
);

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-sm ${className}`}>{children}</div>
);

// =========================
// Main Component
// =========================

export default function HomePage() {
  const appName = 'WCIR';

  // Minimal, non-personal local memory of first name
  const [firstName, setFirstName] = useState<string>("");
  useEffect(() => {
    try {
      const n = localStorage.getItem("gb_first_name");
      if (n) setFirstName(n);
    } catch {
      // ignore storage failures
    }
  }, []);
  useEffect(() => {
    try {
      if (firstName) localStorage.setItem("gb_first_name", firstName);
    } catch {
      // ignore storage failures
    }
  }, [firstName]);

  // Wizard state
  const [step, setStep] = useState<number>(0); // 0: welcome; 1..5 steps
  const [currency, setCurrency] = useState<CurrencyCode>("AUD");

  // Inputs gathered step-by-step
  const [principal, setPrincipal] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [nominalReturnPct, setNominalReturnPct] = useState<number>(7);
  const [inflationPct, setInflationPct] = useState<number>(2.5);
  const [annualSpend, setAnnualSpend] = useState<number>(40000);
  const [withdrawalPct, setWithdrawalPct] = useState<number>(4);

  // Derived
  const targetNestEgg = useMemo<number>(() => {
    const wr = clampNum(withdrawalPct, 0.1, 10) / 100; // 0.1%..10%
    return (annualSpend || 0) / (wr || 0.0001);
  }, [annualSpend, withdrawalPct]);

  const realR = useMemo<number>(() => realReturn(nominalReturnPct, inflationPct), [nominalReturnPct, inflationPct]);

  const projection = useMemo<TargetResult>(
    () =>
      yearsToTarget({
        principal: principal || 0,
        monthlyContribution: monthlyContribution || 0,
        annualRealReturnDecimal: realR,
        targetAmount: targetNestEgg,
      }),
    [principal, monthlyContribution, realR, targetNestEgg]
  );

  const etaDate = useMemo<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + projection.months);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long" });
  }, [projection.months]);

  const totalInvested = useMemo<number>(() => (principal || 0) + (monthlyContribution || 0) * projection.months, [principal, monthlyContribution, projection.months]);

  // Full calculator visibility
  const [showFullCalc, setShowFullCalc] = useState<boolean>(false);

  // Typed handlers
  const onText: React.ChangeEventHandler<HTMLInputElement> = (e) => setFirstName(e.target.value);
  const onCurrency: React.ChangeEventHandler<HTMLSelectElement> = (e) => setCurrency(e.target.value as CurrencyCode);

  const onNumber = (setter: React.Dispatch<React.SetStateAction<number>>): React.ChangeEventHandler<HTMLInputElement> =>
    (e) => setter(toNumber(e.target.value));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Top banner */}
      <div className="w-full bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-white/10 grid place-items-center font-bold">?</div>
            <span className="font-semibold tracking-tight">{ appName }</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <InfoBadge>No AI</InfoBadge>
            <InfoBadge>No personal data</InfoBadge>
            <InfoBadge>Local calculations</InfoBadge>
          </div>
        </div>
      </div>

      {/* Welcome / Intro */}
      {step === 0 && (
        <header className="max-w-5xl mx-auto px-6 pt-12 pb-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="col-span-2">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">When Can I Retire?</h1>
              <p className="mt-4 text-slate-300 text-lg">
                In today’s corporation-first world, it’s easy to feel like financial freedom is out of reach. This tool gives you a
                clear, simple answer—no jargon, no hidden agendas. Reclaim your time and focus on what matters.
              </p>
              
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500">Get started</button>
                <button onClick={() => setShowFullCalc(true)} className="px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 font-medium hover:bg-slate-700">Skip to calculator</button>
              </div>
              <p className="mt-4 text-xs text-slate-500">This is a tool to help people like myself reach financial freedom and independence from their working obligations.</p>
            </div>
            <Card className="h-full">
              <h3 className="text-xl font-semibold">My Pledge</h3>
              <ul className="mt-3 space-y-2 text-slate-300 text-sm">
                <li><strong>Your privacy matters</strong>: I do not collect or sell your personal information.</li>
                <li><strong>Your journey is unique</strong>: Tailor your strategy, risk level, and goals.</li>
                <li><strong>Empowering you</strong>: Clarity, confidence, and hope for the future.</li>
              </ul>
            </Card>
            <Card className="h-full">
              <h3 className="text-xl font-semibold">What this service does</h3>
              <p className="mt-3 text-slate-300 text-base">
                We guide you through a few human‑friendly questions, then estimate when your investments could sustainably fund your lifestyle.
                Everything runs on your device. No accounts. No tracking.
              </p>
            </Card>
          </div>
        </header>
      )}

      {/* Stepper */}
      {step > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-10 pt-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
            <div>Step {step} of 5</div>
            <button className="underline hover:text-slate-200" onClick={() => setStep(0)}>Restart</button>
          </div>

          {step === 1 && (
            <Card>
              <h2 className="text-xl font-semibold">Let’s start with your name (optional)</h2>
              <p className="text-slate-400 text-sm mt-1">I only use this locally to personalize the experience.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="First name">
                  <input value={firstName} onChange={onText} className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" placeholder="e.g. Tom" />
                </Field>
                <Field label="Currency">
                  <select value={currency} onChange={onCurrency} className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100">
                    <option value="AUD">AUD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </Field>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(0)} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700">Back</button>
                <button onClick={() => setStep(2)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Next</button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <h2 className="text-xl font-semibold">What do you have invested today?</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Current investments">
                  <input type="number" value={principal} onChange={onNumber(setPrincipal)} className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" />
                </Field>
                <Field label="Monthly contribution">
                  <input type="number" value={monthlyContribution} onChange={onNumber(setMonthlyContribution)} className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" />
                </Field>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(1)} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700">Back</button>
                <button onClick={() => setStep(3)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Next</button>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <h2 className="text-xl font-semibold">Assumptions about returns & inflation</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Field label="Expected annual return (%)" hint="Before inflation">
                  <input type="number" value={nominalReturnPct} onChange={onNumber(setNominalReturnPct)} className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" />
                </Field>
                <Field label="Inflation (%)">
                  <input type="number" value={inflationPct} onChange={onNumber(setInflationPct)} className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" />
                </Field>
                <Field label="Real return (auto)" hint="After inflation">
                  <div className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-900 text-slate-100">{percent(realR)}</div>
                </Field>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(2)} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700">Back</button>
                <button onClick={() => setStep(4)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Next</button>
              </div>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <h2 className="text-xl font-semibold">What lifestyle are you funding?</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Field label="Annual spend in retirement">
                  <input type="number" value={annualSpend} onChange={onNumber(setAnnualSpend)} className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" />
                </Field>
                <Field label="Withdrawal rate (%)" hint="Common rule‑of‑thumb ≈ 4%">
                  <input type="number" value={withdrawalPct} onChange={onNumber(setWithdrawalPct)} className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" />
                </Field>
                <Field label="Target nest egg (auto)">
                  <div className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-900 text-slate-100">{currencyFormat(targetNestEgg, currency)}</div>
                </Field>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(3)} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700">Back</button>
                <button onClick={() => setStep(5)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">See result</button>
              </div>
            </Card>
          )}

          {step === 5 && (
            <Card>
              <h2 className="text-xl font-semibold">{firstName ? `${firstName}, h` : "H"}ere’s your rough timeline</h2>
              <p className="text-slate-400 text-sm mt-1">Based on your inputs and real return of {percent(realR)}.</p>

              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border border-slate-600 bg-slate-900">
                  <div className="text-sm text-slate-400">Target nest egg</div>
                  <div className="text-2xl font-semibold mt-1">{currencyFormat(targetNestEgg, currency)}</div>
                </div>
                <div className="p-4 rounded-2xl border border-slate-600 bg-slate-900">
                  <div className="text-sm text-slate-400">Time to reach</div>
                  <div className="text-2xl font-semibold mt-1">{projection.hit ? `${projection.years}y ${projection.remMonths}m` : ">100y"}</div>
                  <div className="text-xs text-slate-500 mt-1">≈ {etaDate}</div>
                </div>
                <div className="p-4 rounded-2xl border border-slate-600 bg-slate-900">
                  <div className="text-sm text-slate-400">Total invested by then</div>
                  <div className="text-2xl font-semibold mt-1">{currencyFormat(totalInvested, currency)}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => setStep(4)} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700">Adjust inputs</button>
                <button onClick={() => setShowFullCalc((v) => !v)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">{showFullCalc ? "Hide" : "Open"} full calculator</button>
              </div>
            </Card>
          )}
        </section>
      )}

      {/* Full calculator (prefilled, revealed at the end or via skip) */}
      {(showFullCalc || step === 0) && (
        <section id="calculator" className="max-w-5xl mx-auto px-6 pb-12">
          {showFullCalc ? (
            <Card>
              <h3 className="text-xl font-semibold">Full Calculator</h3>
              <p className="text-sm text-slate-400 mt-1">Tweak any value and watch results update.</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <Field label="Initial amount">
                  <input type="number" className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={principal} onChange={onNumber(setPrincipal)} />
                </Field>
                <Field label="Monthly contribution">
                  <input type="number" className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={monthlyContribution} onChange={onNumber(setMonthlyContribution)} />
                </Field>
                <Field label="Expected annual return (%)">
                  <input type="number" className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={nominalReturnPct} onChange={onNumber(setNominalReturnPct)} />
                </Field>
                <Field label="Inflation (%)">
                  <input type="number" className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={inflationPct} onChange={onNumber(setInflationPct)} />
                </Field>
                <Field label="Annual spend in retirement">
                  <input type="number" className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={annualSpend} onChange={onNumber(setAnnualSpend)} />
                </Field>
                <Field label="Withdrawal rate (%)">
                  <input type="number" className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={withdrawalPct} onChange={onNumber(setWithdrawalPct)} />
                </Field>
                <Field label="Currency">
                  <select className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={currency} onChange={onCurrency}>
                    <option value="AUD">AUD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </Field>
              </div>

              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border border-slate-600 bg-slate-900">
                  <div className="text-sm text-slate-400">Target nest egg</div>
                  <div className="text-2xl font-semibold mt-1">{currencyFormat(targetNestEgg, currency)}</div>
                </div>
                <div className="p-4 rounded-2xl border border-slate-600 bg-slate-900">
                  <div className="text-sm text-slate-400">Time to reach</div>
                  <div className="text-2xl font-semibold mt-1">{projection.hit ? `${projection.years}y ${projection.remMonths}m` : ">100y"}</div>
                  <div className="text-xs text-slate-500 mt-1">≈ {etaDate}</div>
                </div>
                <div className="p-4 rounded-2xl border border-slate-600 bg-slate-900">
                  <div className="text-sm text-slate-400">Real return (after inflation)</div>
                  <div className="text-2xl font-semibold mt-1">{percent(realR)}</div>
                </div>
              </div>
            </Card>
          ) : null}
        </section>
      )}

      <footer className="border-t border-slate-700 bg-slate-950 text-slate-400">
        <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold text-slate-200">{ appName }</div>
            <p className="mt-2">Tools for financial freedom. Clear, private, local‑first.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-200">Privacy</div>
            <ul className="mt-2 space-y-1">
              <li>First name only (optional)</li>
              <li>No accounts • No tracking</li>
              <li>All calculations on-device</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-200">Actions</div>
            <ul className="mt-2 space-y-1">
              <li><button onClick={() => setStep(0)} className="underline">Back to welcome</button></li>
              <li><button onClick={() => setStep(1)} className="underline">Start questions</button></li>
              <li><button onClick={() => setShowFullCalc(true)} className="underline">Open calculator</button></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
