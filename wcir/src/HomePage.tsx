import { useMemo, useState } from "react";
import { Stat } from "./Stat";

function currencyFormat(value: number, currency = "AUD") {
  if (!Number.isFinite(value)) return "-";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
  } catch {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
  }
}

function percentFormat(value: number) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value) + "%";
}

function computeFutureValue({ principal, annualRatePct, years, compoundsPerYear, contribution, contributionPerYear }) {
  const r = annualRatePct / 100;
  const n = compoundsPerYear;
  const t = years;

  if (r === 0) {
    const totalContrib = contribution * contributionPerYear * t;
    const future = principal + totalContrib;
    return { future, totalContrib, interest: 0 };
  }

  const compoundGrowth = Math.pow(1 + r / n, n * t);
  const futurePrincipal = principal * compoundGrowth;

  const m = contributionPerYear;
  const rEff = Math.pow(1 + r / n, n / m) - 1;
  const totalPeriods = Math.round(m * t);

  let futureContrib = 0;
  if (rEff === 0) {
    futureContrib = contribution * totalPeriods;
  } else {
    futureContrib = contribution * ((Math.pow(1 + rEff, totalPeriods) - 1) / rEff);
  }

  const future = futurePrincipal + futureContrib;
  const totalContrib = contribution * totalPeriods;
  const interest = future - principal - totalContrib;
  return { future, totalContrib, interest };
}

const InfoBadge = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-emerald-900 text-emerald-200 text-xs font-medium px-3 py-1 border border-emerald-700">
    {children}
  </span>
);

export default function HomePage() {
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);
  const [compoundsPerYear, setCompoundsPerYear] = useState(12);
  const [contribution, setContribution] = useState(200);
  const [contribFreq, setContribFreq] = useState(12);
  const [currency, setCurrency] = useState("AUD");

  const result = useMemo(() => computeFutureValue({
    principal: Number(principal) || 0,
    annualRatePct: Number(rate) || 0,
    years: Number(years) || 0,
    compoundsPerYear: Number(compoundsPerYear) || 1,
    contribution: Number(contribution) || 0,
    contributionPerYear: Number(contribFreq) || 1,
  }), [principal, rate, years, compoundsPerYear, contribution, contribFreq]);

  const totalInvested = (Number(principal) || 0) + result.totalContrib;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="w-full bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-white/10 grid place-items-center font-bold">∑</div>
            <span className="font-semibold tracking-tight">GrowBuddy</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <InfoBadge>No AI</InfoBadge>
            <InfoBadge>No personal data</InfoBadge>
            <InfoBadge>Local calculations</InfoBadge>
          </div>
        </div>
      </div>

      <header className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Compound interest made simple.
            </h1>
            <p className="mt-4 text-slate-400 text-lg">
              Start with an easy calculator. Stay for the plan: track contributions, project outcomes, and grow confidence—without accounts, tracking, or ads.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#calculator" className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500">
                Try the calculator
              </a>
              <a href="#why" className="px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 font-medium hover:bg-slate-700">
                Why this app?
              </a>
            </div>
            <div className="mt-6 text-sm text-slate-500">
              Cross-platform with Ionic & Capacitor. Local storage on desktop, SQLite on Android.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Future value" value={currencyFormat(result.future, currency)} sub={`in ${years} years`} />
            <Stat label="Total invested" value={currencyFormat(totalInvested, currency)} sub={`${currencyFormat(Number(principal)||0, currency)} initial + ${currencyFormat(result.totalContrib, currency)} contributions`} />
            <Stat label="Interest earned" value={currencyFormat(result.interest, currency)} sub={percentFormat((result.interest / (totalInvested || 1)) * 100) + " of total"} />
            <Stat label="Rate" value={percentFormat(rate)} sub={`${compoundsPerYear}× compounding`} />
          </div>
        </div>
      </header>

      <section id="calculator" className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-sm">
            <h2 className="text-xl font-semibold">Quick Calculator</h2>
            <p className="text-sm text-slate-400 mt-1">Client-side math only. Change any field to see results instantly.</p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-slate-400">Initial amount</span>
                <input type="number" className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">Annual rate (%)</span>
                <input type="number" className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={rate} onChange={(e) => setRate(e.target.value)} />
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">Years</span>
                <input type="number" className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={years} onChange={(e) => setYears(e.target.value)} />
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">Compounds per year</span>
                <select className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={compoundsPerYear} onChange={(e) => setCompoundsPerYear(Number(e.target.value))}>
                  <option value={1}>Yearly</option>
                  <option value={2}>Semiannual</option>
                  <option value={4}>Quarterly</option>
                  <option value={12}>Monthly</option>
                  <option value={26}>Fortnightly</option>
                  <option value={52}>Weekly</option>
                  <option value={365}>Daily</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">Regular contribution</span>
                <input type="number" className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={contribution} onChange={(e) => setContribution(e.target.value)} />
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">Contribution frequency</span>
                <select className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={contribFreq} onChange={(e) => setContribFreq(Number(e.target.value))}>
                  <option value={1}>Yearly</option>
                  <option value={4}>Quarterly</option>
                  <option value={12}>Monthly</option>
                  <option value={26}>Fortnightly</option>
                  <option value={52}>Weekly</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">Currency</span>
                <select className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option>AUD</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </label>
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              <Stat label="Future value" value={currencyFormat(result.future, currency)} sub={`in ${years} years`} />
              <Stat label="Interest earned" value={currencyFormat(result.interest, currency)} sub={percentFormat((result.interest / (totalInvested || 1)) * 100) + " of total"} />
              <Stat label="Total invested" value={currencyFormat(totalInvested, currency)} />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-sm">
            <h3 className="text-xl font-semibold">Start simple or try the plan</h3>
            <ul className="mt-4 space-y-2 list-disc list-inside text-slate-300">
              <li>Instant calculator for quick answers.</li>
              <li>Save scenarios locally—no sign up required.</li>
              <li>Track deposits and see how habits grow results.</li>
              <li>Upgrade later for advanced insights and reminders.</li>
            </ul>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-slate-600 bg-slate-900">
                <div className="text-sm text-slate-400">Free</div>
                <div className="text-2xl font-bold mt-1 text-slate-100">$0</div>
                <ul className="mt-3 text-sm space-y-1 text-slate-300">
                  <li>• Calculator</li>
                  <li>• Save up to 3 plans (local)</li>
                  <li>• No tracking / no AI</li>
                </ul>
                <button className="mt-4 w-full px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500">Get started</button>
              </div>
              <div className="p-4 rounded-xl border border-slate-600 bg-slate-900">
                <div className="text-sm text-slate-400">Pro</div>
                <div className="text-2xl font-bold mt-1 text-slate-100">One-time or subscription</div>
                <ul className="mt-3 text-sm space-y-1 text-slate-300">
                  <li>• Unlimited plans</li>
                  <li>• Habit tracking & reminders</li>
                  <li>• Export & offline backups</li>
                </ul>
                <button className="mt-4 w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 hover:bg-slate-700">See pricing</button>
              </div>
            </div>

            <div id="why" className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-600">
              <h4 className="font-semibold text-slate-100">Privacy by design</h4>
              <p className="text-sm text-slate-400 mt-1">
                We only ask for a first name (optional). No accounts required. No location tracking. Everything calculates on your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-700 bg-slate-950 text-slate-400">
        <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold text-slate-200">GrowBuddy</div>
            <p className="mt-2">Compound interest tools for humans. Built to be clear, private, and helpful.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-200">Platform</div>
            <ul className="mt-2 space-y-1">
              <li>Ionic + Capacitor (Android, iOS, Desktop)</li>
              <li>SQLite on Android; localStorage on Desktop</li>
              <li>100% client-side math</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-200">Legal</div>
            <ul className="mt-2 space-y-1">
              <li>No AI features</li>
              <li>No personal data tracking</li>
              <li>Local-first design</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}