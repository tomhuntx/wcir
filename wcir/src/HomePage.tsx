import React, { useEffect, useMemo, useState } from 'react';
import { InfoBadge } from './constants/InfoBadge';
import { CalculatorPage } from './CalculatorPage';
import { Introduction } from './Introduction';

// =========================
// Types & Utilities (TS)
// =========================

type CurrencyCode = 'AUD' | 'USD' | 'EUR' | 'GBP';

interface TargetParams {
  principal: number;
  contribution: number;
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
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function useHashRoute(): string {
  const [hash, setHash] = React.useState<string>(() => window.location.hash || '#/');
  React.useEffect(() => {
    const onHash = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return (hash.startsWith('#') ? hash.slice(1) : hash) || '/';
}

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

// Fisher equation (approx) -> real return in decimal
function realReturn(nominalPct: number, inflPct: number): number {
  const r = nominalPct / 100;
  const i = inflPct / 100;
  return (1 + r) / (1 + i) - 1;
}

function yearsToTarget({
  principal,
  contribution,
  annualRealReturnDecimal,
  targetAmount,
  maxYears = 100,
}: TargetParams): TargetResult {
  const monthlyRate = annualRealReturnDecimal / 12;
  let months = 0;
  let balance = principal;
  const maxMonths = Math.round(maxYears * 12);

  while (balance < targetAmount && months < maxMonths) {
    balance *= 1 + monthlyRate;
    balance += contribution;
    months++;
  }

  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return { months, years, remMonths, balance, hit: balance >= targetAmount };
}

// =========================
// Main Component
// =========================

export default function HomePage() {
  const appName = 'WCIR';

  // Minimal, non-personal local memory of first name
  const [firstName, setFirstName] = useState<string>('');
  useEffect(() => {
    try {
      const n = localStorage.getItem('gb_first_name');
      if (n) setFirstName(n);
    } catch {
      // ignore storage failures
    }
  }, []);
  useEffect(() => {
    try {
      if (firstName) localStorage.setItem('gb_first_name', firstName);
    } catch {
      // ignore storage failures
    }
  }, [firstName]);

  // Wizard state
  const [step, setStep] = useState<number>(0); // 0: welcome; 1..5 steps
  const [currency, setCurrency] = useState<CurrencyCode>('AUD');

  // Inputs gathered step-by-step
  const [principal, setPrincipal] = useState<number>(0);
  const [investments, setInvestments] = useState<number>(0);
  const [investmentFrequency, setInvestmentFrequency] = useState<string>('monthly');
  const [savings, setSavings] = useState<number>(0);
  const [savingsFrequency, setSavingsFrequency] = useState<string>('monthly');
  const [savingsReturnPercent, setSavingsReturnPercent] = useState<number>(3);
  const [investmentReturnPercent, setInvestmentReturnPercent] = useState<number>(8);
  const [contribution, setContribution] = useState<number>(500);
  const [contributionFrequency, setContributionFrequency] = useState<string>('monthly');
  const [nominalReturnPercent, setNominalReturnPercent] = useState<number>(8);
  const [inflationPercent, setInflationPct] = useState<number>(2.5);
  const [annualSpend, setAnnualSpend] = useState<number>(40000);
  const [withdrawalPct, setWithdrawalPct] = useState<number>(4);

  // Override principle if investments or savings is set
  useEffect(() => {
    if (investments > 0 || savings > 0) {
      setPrincipal(0);
    }
  }, [investments, savings]);

  // Override return percent if investments or savings is set
  useEffect(() => {
    if (savingsReturnPercent > 0 || investmentReturnPercent > 0) {
      setNominalReturnPercent(0);
    }
  }, [savingsReturnPercent, investmentReturnPercent]);

  // Derived
  const targetNestEgg = useMemo<number>(() => {
    const wr = clampNum(withdrawalPct, 0.1, 10) / 100; // 0.1%..10%
    return (annualSpend || 0) / (wr || 0.0001);
  }, [annualSpend, withdrawalPct]);

  const realR = useMemo<number>(
    () => realReturn(nominalReturnPercent, inflationPercent),
    [nominalReturnPercent, inflationPercent],
  );

  const projection = useMemo<TargetResult>(
    () =>
      yearsToTarget({
        principal: principal || 0,
        contribution: contribution || 0,
        annualRealReturnDecimal: realR,
        targetAmount: targetNestEgg,
      }),
    [principal, contribution, realR, targetNestEgg],
  );

  const etaDate = useMemo<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + projection.months);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
  }, [projection.months]);

  const totalInvested = useMemo<number>(
    () => (principal || 0) + (contribution || 0) * projection.months,
    [principal, contribution, projection.months],
  );

  // Typed handlers
  const onText: React.ChangeEventHandler<HTMLInputElement> = (e) => setFirstName(e.target.value);
  const onCurrency: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
    setCurrency(e.target.value as CurrencyCode);

  const onNumber =
    (
      setter: React.Dispatch<React.SetStateAction<number>>,
    ): React.ChangeEventHandler<HTMLInputElement> =>
    (e) =>
      setter(toNumber(e.target.value));

  // Routing: embed calculator in main content vs. welcome flow
  const route = useHashRoute();
  const isCalc = route === '/calculator';

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-100">
      {/* Top banner */}
      <div className="w-full bg-slate-950 text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-xl bg-white/10 font-bold">
              ?
            </div>
            <span className="font-semibold tracking-tight">{appName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <InfoBadge>No AI</InfoBadge>
            <InfoBadge>No email</InfoBadge>
            <InfoBadge>No signup</InfoBadge>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <main className="mx-auto flex max-w-5xl flex-1 items-center justify-center px-6">
        {isCalc ? (
          <CalculatorPage
            showBack
            title="Full Calculator"
            onBack={() => {
              if (window.history.length > 1) window.history.back();
              else window.location.hash = '#/';
            }}
            currency={currency}
            setCurrency={setCurrency}
            principal={principal || savings + investments}
            setPrincipal={setPrincipal}
            contribution={contribution}
            setContribution={setContribution}
            nominalReturnPercent={
              nominalReturnPercent || savingsReturnPercent + investmentReturnPercent
            }
            setNominalReturnPercent={setNominalReturnPercent}
            inflationPercent={inflationPercent}
            setInflationPct={setInflationPct}
            annualSpend={annualSpend}
            setAnnualSpend={setAnnualSpend}
            withdrawalPct={withdrawalPct}
            setWithdrawalPct={setWithdrawalPct}
            targetNestEgg={targetNestEgg}
            projected={projection}
            realR={realR}
            etaDate={etaDate}
            onCurrency={onCurrency}
            onNumber={onNumber}
          />
        ) : (
          <Introduction
            appName={appName}
            step={step}
            setStep={setStep}
            firstName={firstName}
            setFirstName={setFirstName}
            currency={currency}
            setCurrency={setCurrency}
            savings={savings}
            setSavings={setSavings}
            savingsFrequency={savingsFrequency}
            setSavingsFrequency={setSavingsFrequency}
            investments={investments}
            setInvestments={setInvestments}
            investmentFrequency={investmentFrequency}
            setInvestmentFrequency={setInvestmentFrequency}
            savingsReturnPercent={savingsReturnPercent}
            setSavingsReturnPercent={setSavingsReturnPercent}
            investmentReturnPercent={investmentReturnPercent}
            setInvestmentReturnPercent={setInvestmentReturnPercent}
            contribution={contribution}
            setContribution={setContribution}
            contributionFrequency={contributionFrequency}
            setContributionFrequency={setContributionFrequency}
            nominalReturnPercent={nominalReturnPercent}
            setNominalReturnPercent={setNominalReturnPercent}
            inflationPercent={inflationPercent}
            setInflationPct={setInflationPct}
            annualSpend={annualSpend}
            setAnnualSpend={setAnnualSpend}
            withdrawalPct={withdrawalPct}
            setWithdrawalPct={setWithdrawalPct}
            targetNestEgg={targetNestEgg}
            realR={realR}
            projection={projection}
            etaDate={etaDate}
            totalInvested={totalInvested}
            onText={onText}
            onCurrency={onCurrency}
            onNumber={onNumber}
            percent={percent}
            currencyFormat={currencyFormat}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-950 text-slate-400">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-10 text-sm md:grid-cols-3">
          <div>
            <div className="font-semibold text-slate-200">{appName}</div>
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
              <li>
                <button onClick={() => (window.location.hash = '#/')} className="underline">
                  Back to welcome
                </button>
              </li>
              <li>
                <button
                  onClick={() => (window.location.hash = '#/calculator')}
                  className="underline"
                >
                  Open calculator
                </button>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
