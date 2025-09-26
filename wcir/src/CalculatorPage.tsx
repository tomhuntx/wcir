// src/CalculatorPage.tsx
import React from 'react';

// Keep types local so this file is self-contained.
// (They’re structurally compatible with the same types in HomePage.)
export type CurrencyCode = 'AUD' | 'USD' | 'EUR' | 'GBP';

export interface TargetResult {
  months: number;
  years: number;
  remMonths: number;
  balance: number;
  hit: boolean;
}

export interface CalculatorPageProps {
  onBack: () => void;
  showBack?: boolean; // show a small back button row
  title?: string; // small right-aligned title

  // state + setters coming from HomePage
  currency: CurrencyCode;
  setCurrency: React.Dispatch<React.SetStateAction<CurrencyCode>>;

  principal: number;
  setPrincipal: React.Dispatch<React.SetStateAction<number>>;

  monthlyContribution: number;
  setMonthlyContribution: React.Dispatch<React.SetStateAction<number>>;

  nominalReturnPct: number;
  setNominalReturnPct: React.Dispatch<React.SetStateAction<number>>;

  inflationPct: number;
  setInflationPct: React.Dispatch<React.SetStateAction<number>>;

  annualSpend: number;
  setAnnualSpend: React.Dispatch<React.SetStateAction<number>>;

  withdrawalPct: number;
  setWithdrawalPct: React.Dispatch<React.SetStateAction<number>>;

  // derived values (already computed in HomePage)
  targetNestEgg: number;
  projected: TargetResult;
  realR: number; // decimal e.g. 0.05
  etaDate: string;

  // handlers from HomePage
  onCurrency: React.ChangeEventHandler<HTMLSelectElement>;
  onNumber: (
    setter: React.Dispatch<React.SetStateAction<number>>,
  ) => React.ChangeEventHandler<HTMLInputElement>;
}

// local helpers (kept tiny to avoid imports/cycles)
function currencyFormat(value: number, currency: CurrencyCode = 'AUD'): string {
  if (!Number.isFinite(value)) return '-';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
  } catch {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
  }
}
function percent(value: number, digits: number = 1): string {
  if (!Number.isFinite(value)) return '-';
  return (
    new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value * 100) + '%'
  );
}

// slim local UI bits so this component is standalone
const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <label className="block">
    <div className="text-sm text-slate-300">{label}</div>
    <div className="mt-1">{children}</div>
    {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
  </label>
);

export function CalculatorPage(p: CalculatorPageProps) {
  const { showBack = false, title = 'Full Calculator' } = p;

  return (
    <section className="mx-auto max-w-5xl px-6 py-8">
      {/* small header row inside content */}
      <div className="mb-4 flex items-center justify-between">
        {showBack ? (
          <button
            onClick={p.onBack}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 hover:bg-slate-700"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        <div className="text-sm text-slate-400">{title}</div>
      </div>

      {/* Inputs */}
      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Calculator</h3>
        <p className="mt-1 text-sm text-slate-400">Tweak any value and watch results update.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Initial amount">
            <input
              type="number"
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
              value={p.principal}
              onChange={p.onNumber(p.setPrincipal)}
            />
          </Field>

          <Field label="Monthly contribution">
            <input
              type="number"
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
              value={p.monthlyContribution}
              onChange={p.onNumber(p.setMonthlyContribution)}
            />
          </Field>

          <Field label="Expected annual return (%)" hint="Before inflation">
            <input
              type="number"
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
              value={p.nominalReturnPct}
              onChange={p.onNumber(p.setNominalReturnPct)}
            />
          </Field>

          <Field label="Inflation (%)">
            <input
              type="number"
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
              value={p.inflationPct}
              onChange={p.onNumber(p.setInflationPct)}
            />
          </Field>

          <Field label="Annual spend in retirement">
            <input
              type="number"
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
              value={p.annualSpend}
              onChange={p.onNumber(p.setAnnualSpend)}
            />
          </Field>

          <Field label="Withdrawal rate (%)" hint="Common rule-of-thumb ≈ 4%">
            <input
              type="number"
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
              value={p.withdrawalPct}
              onChange={p.onNumber(p.setWithdrawalPct)}
            />
          </Field>

          <Field label="Currency">
            <select
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
              value={p.currency}
              onChange={p.onCurrency}
            >
              <option value="AUD">AUD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </Field>
        </div>

        {/* Results */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-600 bg-slate-900 p-4">
            <div className="text-sm text-slate-400">Target nest egg</div>
            <div className="mt-1 text-2xl font-semibold">
              {currencyFormat(p.targetNestEgg, p.currency)}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-600 bg-slate-900 p-4">
            <div className="text-sm text-slate-400">Time to reach</div>
            <div className="mt-1 text-2xl font-semibold">
              {p.projected.hit ? `${p.projected.years}y ${p.projected.remMonths}m` : '>100y'}
            </div>
            <div className="mt-1 text-xs text-slate-500">≈ {p.etaDate}</div>
          </div>

          <div className="rounded-2xl border border-slate-600 bg-slate-900 p-4">
            <div className="text-sm text-slate-400">Real return (after inflation)</div>
            <div className="mt-1 text-2xl font-semibold">{percent(p.realR)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
