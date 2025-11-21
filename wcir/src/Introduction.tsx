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
  savingsContribution: number;
  setSavingsContribution: React.Dispatch<React.SetStateAction<number>>;
  savingsFrequency: string;
  setSavingsFrequency: React.Dispatch<React.SetStateAction<string>>;
  investments: number;
  setInvestments: React.Dispatch<React.SetStateAction<number>>;
  investmentContribution: number;
  setInvestmentContribution: React.Dispatch<React.SetStateAction<number>>;
  investmentFrequency: string;
  setInvestmentFrequency: React.Dispatch<React.SetStateAction<string>>;
  savingsReturnPercent: number;
  setSavingsReturnPercent: React.Dispatch<React.SetStateAction<number>>;
  investmentReturnPercent: number;
  setInvestmentReturnPercent: React.Dispatch<React.SetStateAction<number>>;
  contribution: number;
  setContribution: React.Dispatch<React.SetStateAction<number>>;
  contributionFrequency: string;
  setContributionFrequency: React.Dispatch<React.SetStateAction<string>>;
  nominalReturnPercent: number;
  setNominalReturnPercent: React.Dispatch<React.SetStateAction<number>>;
  inflationPercent: number;
  setInflationPct: React.Dispatch<React.SetStateAction<number>>;
  annualSpend: number;
  setAnnualSpend: React.Dispatch<React.SetStateAction<number>>;
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
    savingsContribution,
    setSavingsContribution,
    savingsFrequency,
    setSavingsFrequency,
    investments,
    setInvestments,
    investmentContribution,
    setInvestmentContribution,
    investmentFrequency,
    setInvestmentFrequency,
    savingsReturnPercent,
    setSavingsReturnPercent,
    investmentReturnPercent,
    setInvestmentReturnPercent,
    contribution,
    setContribution,
    contributionFrequency,
    setContributionFrequency,
    nominalReturnPercent,
    setNominalReturnPercent,
    inflationPercent,
    setInflationPct,
    annualSpend,
    setAnnualSpend,
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
                This tool will guide you through a few simple questions to calculate how long it
                will take for you to reach your goals. Everything runs on your device and your
                session will be kept so you can come back any time.
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
            <Card className="h-[20rem]">
              <h2 className="text-xl font-semibold text-slate-200">
                Let’s start with your name and currency
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                I only use this to personalize the experience. Feel free to use any name.
              </p>

              {/* Inline, human sentence */}
              <div className="3xl mt-10 flex flex-wrap items-center gap-x-2 gap-y-3 text-xl leading-relaxed text-slate-100">
                <span>My name is</span>

                <label className="sr-only" htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  value={firstName}
                  onChange={onText}
                  placeholder="Jane"
                  className="inline-block w-40 rounded-xl border-0 border-b-2 border-emerald-500 bg-slate-900/50 px-3 py-1 text-inherit focus:ring-0 focus:outline-none"
                />

                <span>and my currency is</span>

                <label className="sr-only" htmlFor="currency">
                  Currency
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={onCurrency}
                  className="inline-block rounded-xl border-0 border-b-2 border-emerald-500 bg-slate-900/50 px-3 py-2 text-inherit focus:outline-none"
                >
                  <option value="AUD">AUD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
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
            <Card className="h-[20rem]">
              <h2 className="text-sm font-semibold text-slate-400">
                Your current savings & investments
              </h2>

              <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-3 text-xl leading-relaxed text-slate-100">
                <span>I currently have</span>
                <input
                  type="number"
                  value={savings}
                  onChange={onNumber(setSavings)}
                  placeholder="500"
                  className="inline-block w-32 rounded-xl border-0 border-b-2 border-emerald-500 bg-slate-900/50 px-3 py-1 text-inherit focus:outline-none"
                />
                <span>in savings and</span>
                <input
                  type="number"
                  value={investments}
                  onChange={onNumber(setInvestments)}
                  placeholder="1000"
                  className="inline-block w-32 rounded-xl border-0 border-b-2 border-emerald-500 bg-slate-900/50 px-3 py-1 text-inherit focus:outline-none"
                />
                <span>invested.</span>
              </div>

              <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-3 text-xl leading-relaxed text-slate-100">
                <span>
                  I expect my savings to make
                  <input
                    type="number"
                    value={savingsReturnPercent}
                    onChange={(e) => setSavingsReturnPercent(Number(e.target.value))}
                    className="ml-2 inline-block w-16 rounded-xl border-0 border-b-2 border-emerald-500 bg-slate-900/50 px-3 py-1 text-inherit focus:outline-none"
                  />
                  % of interest per year and my investments to grow an average of
                  <input
                    type="number"
                    value={investmentReturnPercent}
                    onChange={(e) => setInvestmentReturnPercent(Number(e.target.value))}
                    className="ml-2 inline-block w-16 rounded-xl border-0 border-b-2 border-emerald-500 bg-slate-900/50 px-3 py-1 text-inherit focus:outline-none"
                  />
                  % per year.
                </span>
              </div>

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
            <Card className="h-[20rem] text-lg">
              <h2 className="text-sm font-semibold text-slate-400">
                Your current income & expenses
              </h2>
              {/* 
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Contribution amount">
                  <input
                    type="number"
                    value={contribution}
                    onChange={onNumber(setContribution)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                  />
                </Field>
              </div> */}

              <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-3 text-xl leading-relaxed text-slate-100">
                <span>I set aside</span>
                <input
                  type="number"
                  value={savingsContribution}
                  onChange={(e) => setSavingsContribution(Number(e.target.value))}
                  className="inline-block w-24 rounded-xl border-0 border-b-2 border-emerald-500 bg-slate-900/50 px-3 py-1 text-inherit focus:outline-none"
                />
                <span>per</span>
                <select
                  value={savingsFrequency}
                  onChange={(e) => setSavingsFrequency(e.target.value)}
                  className="inline-block rounded-xl border-0 border-b-2 border-emerald-500 bg-slate-900/50 px-3 py-2 text-inherit focus:outline-none"
                >
                  <option value="weekly">Week</option>
                  <option value="fortnightly">Fortnight</option>
                  <option value="monthly">Month</option>
                </select>
                <span>into my savings accounts.</span>
              </div>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-3 text-xl leading-relaxed text-slate-100">
                <span>I make investment contributions of</span>
                <input
                  type="number"
                  value={investmentContribution}
                  onChange={(e) => setInvestmentContribution(Number(e.target.value))}
                  className="inline-block w-24 rounded-xl border-0 border-b-2 border-emerald-500 bg-slate-900/50 px-3 py-1 text-inherit focus:outline-none"
                />
                <span>per</span>
                <select
                  value={investmentFrequency}
                  onChange={(e) => setInvestmentFrequency(e.target.value)}
                  className="inline-block rounded-xl border-0 border-b-2 border-emerald-500 bg-slate-900/50 px-3 py-2 text-inherit focus:outline-none"
                >
                  <option value="weekly">Week</option>
                  <option value="fortnightly">Fortnight</option>
                  <option value="monthly">Month</option>
                </select>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-base">
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
            <Card className="h-[20rem]">
              <h2 className="text-sm font-semibold text-slate-400">Your retirement goals</h2>

              <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-3 text-xl leading-relaxed text-slate-100">
                <span>I predict my yearly expenses when I retire will be roughly</span>
                <input
                  type="number"
                  value={annualSpend}
                  onChange={onNumber(setAnnualSpend)}
                  className="inline-block w-28 rounded-xl border-0 border-b-2 border-emerald-500 bg-slate-900/50 px-3 py-1 text-inherit focus:outline-none"
                />
                <span>per year in today's dollars.</span>
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
            <Card className="h-[20rem]">
              <h2 className="text-xl font-semibold">Here’s your rough timeline</h2>
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
