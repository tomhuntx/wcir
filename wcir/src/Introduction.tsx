// src/components/WelcomeFlow.tsx
import React from 'react';

type CurrencyCode = 'AUD' | 'USD' | 'EUR' | 'GBP';
interface TargetResult {
  months: number;
  years: number;
  remMonths: number;
  balance: number;
  hit: boolean;
}

type IntroductionProps = {
  appName: string;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  currency: CurrencyCode;
  setCurrency: React.Dispatch<React.SetStateAction<CurrencyCode>>;
  savings: number;
  setSavings: React.Dispatch<React.SetStateAction<number>>;
  investments: number;
  setInvestments: React.Dispatch<React.SetStateAction<number>>;
  contribution: number;
  setContribution: React.Dispatch<React.SetStateAction<number>>;
  contributionFrequency: string;
  setContributionFrequency: React.Dispatch<React.SetStateAction<string>>;
  nominalReturnPct: number;
  setNominalReturnPct: React.Dispatch<React.SetStateAction<number>>;
  inflationPct: number;
  setInflationPct: React.Dispatch<React.SetStateAction<number>>;
  annualSpend: number;
  setAnnualSpend: React.Dispatch<React.SetStateAction<number>>;
  withdrawalPct: number;
  setWithdrawalPct: React.Dispatch<React.SetStateAction<number>>;
  targetNestEgg: number;
  realR: number;
  projection: TargetResult;
  etaDate: string;
  totalInvested: number;

  onText: React.ChangeEventHandler<HTMLInputElement>;
  onCurrency: React.ChangeEventHandler<HTMLSelectElement>;
  onNumber: (
    setter: React.Dispatch<React.SetStateAction<number>>,
  ) => React.ChangeEventHandler<HTMLInputElement>;

  percent: (value: number, digits?: number) => string;
  currencyFormat: (value: number, currency: CurrencyCode) => string;
};

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

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = '',
}) => (
  <div
    className={`flex flex-col rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-sm ${className}`}
  >
    {children}
  </div>
);

export const Introduction: React.FC<IntroductionProps> = (props) => {
  const {
    appName,
    step,
    setStep,
    firstName,
    setFirstName,
    currency,
    setCurrency,
    savings,
    setSavings,
    investments,
    setInvestments,
    contribution,
    setContribution,
    contributionFrequency,
    setContributionFrequency,
    nominalReturnPct,
    setNominalReturnPct,
    inflationPct,
    setInflationPct,
    annualSpend,
    setAnnualSpend,
    withdrawalPct,
    setWithdrawalPct,
    targetNestEgg,
    realR,
    projection,
    etaDate,
    totalInvested,
    onText,
    onCurrency,
    onNumber,
    percent,
    currencyFormat,
  } = props;

  return (
    <>
      {/* Welcome / Intro */}
      {step === 0 && (
        <header className="mx-auto h-full max-w-5xl px-6 pt-12 pb-10">
          <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
            <div className="col-span-2">
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                When Can I Retire?
              </h1>
              <p className="mt-4 text-lg text-slate-300">
                In today’s corporation-first world, it’s easy to feel like financial freedom is out
                of reach. This tool gives you a clear, simple answer—no jargon, no hidden agendas.
                Reclaim your time and focus on what matters.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-500"
                >
                  Get started
                </button>
                <button
                  onClick={() => (window.location.hash = '#/calculator')}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-medium hover:bg-slate-700"
                >
                  Skip to calculator
                </button>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                This is a tool to help people like myself reach financial freedom and independence
                from their working obligations.
              </p>
            </div>
            <Card className="h-full">
              <h3 className="text-xl font-semibold">My Pledge</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>
                  <strong>Your privacy matters</strong>: I do not collect your personal information.
                </li>
                <li>
                  <strong>Your journey is unique</strong>: Tailor your strategy, risk level, and
                  goals.
                </li>
                <li>
                  <strong>Empowering you</strong>: Clarity, confidence, and hope for the future.
                </li>
              </ul>
            </Card>
            <Card className="h-full">
              <h3 className="text-xl font-semibold">What this service does</h3>
              <p className="mt-3 text-base text-slate-300">
                This tool will guide you through a few human-friendly questions, then estimate when
                your investments could sustainably fund your lifestyle. Everything runs on your
                device. No accounts. No tracking.
              </p>
            </Card>
          </div>
        </header>
      )}

      {/* Stepper */}
      {step > 0 && (
        <section className="mx-auto w-3xl px-6 pt-6 pb-10">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
            <div>Step {step} of 5</div>
            <button className="underline hover:text-slate-200" onClick={() => setStep(0)}>
              Restart
            </button>
          </div>

          {step === 1 && (
            <Card className="h-[21rem]">
              <h2 className="text-xl font-semibold">Let’s start with your name and currency</h2>
              <p className="mt-1 text-sm text-slate-400">
                I only use this to personalize the experience. Feel free to use any name.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="First name">
                  <input
                    value={firstName}
                    onChange={onText}
                    className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Currency">
                  <select
                    value={currency}
                    onChange={onCurrency}
                    className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                  >
                    <option value="AUD">AUD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </Field>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <button
                  onClick={() => setStep(0)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
                >
                  Next
                </button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="h-[21rem]">
              <h2 className="text-xl font-semibold">
                Do you have any current investments or savings?
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                I only use this to personalize the experience. Feel free to use any name.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Current savings">
                  <input
                    type="number"
                    value={savings}
                    onChange={onNumber(setSavings)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                  />
                </Field>
                <Field label="Expected annual return (%)">
                  <input
                    type="number"
                    value={nominalReturnPct}
                    onChange={onNumber(setNominalReturnPct)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                  />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Current investments">
                  <input
                    type="number"
                    value={investments}
                    onChange={onNumber(setInvestments)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                  />
                </Field>
                <Field label="Expected annual return (%)">
                  <input
                    type="number"
                    value={nominalReturnPct}
                    onChange={onNumber(setNominalReturnPct)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                  />
                </Field>
              </div>

              {/* Action bar pinned to bottom of the Card */}
              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
                >
                  Next
                </button>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card className="h-[21rem]">
              <h2 className="text-xl font-semibold">Income & expenses</h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Contribution amount">
                    <input
                      type="number"
                      value={contribution}
                      onChange={onNumber(setContribution)}
                      className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                    />
                </Field>
                <Field label="Contribution frequency">
                    <select
                      value={contributionFrequency}
                      onChange={(e) => setContributionFrequency(e.target.value)}
                      className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="fortnightly">Fortnightly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                </Field>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <button
                  onClick={() => setStep(2)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
                >
                  Next
                </button>
              </div>
            </Card>
          )}

          {step === 4 && (
            <Card className="h-[21rem]">
              <h2 className="text-xl font-semibold">What lifestyle are you funding?</h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Field label="Annual spend in retirement">
                  <input
                    type="number"
                    value={annualSpend}
                    onChange={onNumber(setAnnualSpend)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                  />
                </Field>
                <Field label="Withdrawal rate (%)" hint="Common rule-of-thumb ≈ 4%">
                  <input
                    type="number"
                    value={withdrawalPct}
                    onChange={onNumber(setWithdrawalPct)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                  />
                </Field>
                <Field label="Target (in today's dollars)">
                  <div className="rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100">
                    {currencyFormat(targetNestEgg, currency)}
                  </div>
                </Field>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <button
                  onClick={() => setStep(3)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
                >
                  See result
                </button>
              </div>
            </Card>
          )}

          {step === 5 && (
            <Card className="h-[21rem]">
              <h2 className="text-xl font-semibold">
                {firstName ? `${firstName}, h` : 'H'}ere’s your rough timeline
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Based on your inputs and real return of {percent(realR)}.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-600 bg-slate-900 p-4">
                  <div className="text-sm text-slate-400">Target nest egg</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {currencyFormat(targetNestEgg, currency)}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-600 bg-slate-900 p-4">
                  <div className="text-sm text-slate-400">Time to reach</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {projection.hit ? `${projection.years}y ${projection.remMonths}m` : '>100y'}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">≈ {etaDate}</div>
                </div>
                <div className="rounded-2xl border border-slate-600 bg-slate-900 p-4">
                  <div className="text-sm text-slate-400">Total invested by then</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {currencyFormat(totalInvested, currency)}
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                <button
                  onClick={() => setStep(4)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2"
                >
                  Back
                </button>
                <button
                  onClick={() => (window.location.hash = '#/calculator')}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
                >
                  Open full calculator
                </button>
              </div>
            </Card>
          )}
        </section>
      )}
    </>
  );
};
