"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  Clipboard,
  Copy,
  FileText,
  Plus,
  Printer,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  MapPinned,
} from "lucide-react";

type Owner = {
  id: number;
  name: string;
  numerator: string;
  denominator: string;
};

const SARSHAl_PER_MARLA = 9;
const MARLA_PER_KANAL = 20;

function formatArea(totalSarshai: number) {
  const kanal = Math.floor(totalSarshai / (MARLA_PER_KANAL * SARSHAl_PER_MARLA));
  const remainderAfterKanal =
    totalSarshai % (MARLA_PER_KANAL * SARSHAl_PER_MARLA);

  const marla = Math.floor(remainderAfterKanal / SARSHAl_PER_MARLA);
  const sarshai = remainderAfterKanal % SARSHAl_PER_MARLA;

  return `${kanal} Kanal ${marla} Marla ${sarshai} Sarshai`;
}

function formatShortArea(totalSarshai: number) {
  const kanal = Math.floor(
    totalSarshai / (MARLA_PER_KANAL * SARSHAl_PER_MARLA)
  );

  const remainder =
    totalSarshai % (MARLA_PER_KANAL * SARSHAl_PER_MARLA);

  const marla = Math.floor(remainder / SARSHAl_PER_MARLA);
  const sarshai = remainder % SARSHAl_PER_MARLA;

  return `${kanal}K ${marla}M ${sarshai}S`;
}

function toNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default function Home() {
  const [village, setVillage] = useState("");
  const [year, setYear] = useState("");
  const [khewat, setKhewat] = useState("");
  const [kanal, setKanal] = useState("");
  const [marla, setMarla] = useState("");

  const [owners, setOwners] = useState<Owner[]>([
    {
      id: 1,
      name: "",
      numerator: "",
      denominator: "",
    },
  ]);

  const totalSarshai = useMemo(() => {
    return (
      toNumber(kanal) * MARLA_PER_KANAL * SARSHAl_PER_MARLA +
      toNumber(marla) * SARSHAl_PER_MARLA
    );
  }, [kanal, marla]);

  const results = useMemo(() => {
    return owners.map((owner) => {
      const numerator = toNumber(owner.numerator);
      const denominator = toNumber(owner.denominator);

      const share =
        denominator > 0 && numerator >= 0
          ? numerator / denominator
          : 0;

      const areaSarshai = Math.floor(totalSarshai * share);

      return {
        ...owner,
        share,
        areaSarshai,
      };
    });
  }, [owners, totalSarshai]);

  const shareTotal = useMemo(() => {
    return results.reduce((sum, owner) => sum + owner.share, 0);
  }, [results]);

  const shareDifference = Math.abs(1 - shareTotal);
  const sharesValid =
    results.some(
      (owner) =>
        toNumber(owner.denominator) > 0 &&
        toNumber(owner.numerator) >= 0
    ) && shareDifference < 0.000001;

  function addOwner() {
    setOwners((current) => [
      ...current,
      {
        id: Date.now(),
        name: "",
        numerator: "",
        denominator: "",
      },
    ]);
  }

  function removeOwner(id: number) {
    if (owners.length === 1) return;
    setOwners((current) => current.filter((owner) => owner.id !== id));
  }

  function updateOwner(
    id: number,
    field: keyof Owner,
    value: string
  ) {
    setOwners((current) =>
      current.map((owner) =>
        owner.id === id
          ? { ...owner, [field]: value }
          : owner
      )
    );
  }

  function resetCalculator() {
    setVillage("");
    setYear("");
    setKhewat("");
    setKanal("");
    setMarla("");
    setOwners([
      {
        id: Date.now(),
        name: "",
        numerator: "",
        denominator: "",
      },
    ]);
  }

  function copyResults() {
    const lines = [
      "JASS LAND RECORDS PORTAL",
      "Khewat Share Calculation",
      "",
      `Village: ${village || "-"}`,
      `Jamabandi Year: ${year || "-"}`,
      `Khewat No.: ${khewat || "-"}`,
      `Total Area: ${formatArea(totalSarshai)}`,
      "",
      "OWNER\tSHARE\tAREA",
      ...results.map(
        (owner) =>
          `${owner.name || "-"}\t${owner.numerator || 0}/${owner.denominator || 0}\t${formatArea(owner.areaSarshai)}`
      ),
      "",
      `Share Total: ${(shareTotal * 100).toFixed(4)}%`,
    ];

    navigator.clipboard.writeText(lines.join("\n"));
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#09090b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
              <MapPinned size={22} />
            </div>

            <div>
              <div className="font-bold tracking-tight">
                JASS DIGITAL
              </div>
              <div className="text-xs text-zinc-500">
                Land Records Portal
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-sm text-zinc-500 sm:flex">
            <Calculator size={16} />
            Khewat Share Calculator
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-sm text-emerald-400">
              <Calculator size={16} />
              Land ownership calculation
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Khewat Share Calculator
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
              Calculate each owner&apos;s proportional area from a
              Khewat&apos;s total land area and recorded ownership share.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* KHEWAT DETAILS */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="mb-6 flex items-center gap-3">
            <FileText size={19} className="text-zinc-400" />
            <div>
              <h2 className="font-semibold text-white">
                Khewat Details
              </h2>
              <p className="text-xs text-zinc-600">
                Enter the basic Jamabandi information
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Field
              label="Village"
              value={village}
              onChange={setVillage}
              placeholder="e.g. Khatrawan"
            />

            <Field
              label="Jamabandi Year"
              value={year}
              onChange={setYear}
              placeholder="e.g. 2024-25"
            />

            <Field
              label="Khewat Number"
              value={khewat}
              onChange={setKhewat}
              placeholder="e.g. 239"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm text-zinc-400">
              Total Khewat Area
            </label>

            <div className="grid grid-cols-2 gap-4 sm:max-w-md">
              <NumberField
                label="Kanal"
                value={kanal}
                onChange={setKanal}
                placeholder="0"
              />

              <NumberField
                label="Marla"
                value={marla}
                onChange={setMarla}
                placeholder="0"
              />
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs uppercase tracking-wider text-zinc-600">
                Total Area
              </div>
              <div className="mt-1 font-semibold text-white">
                {formatArea(totalSarshai)}
              </div>
            </div>
          </div>
        </section>

        {/* OWNERS */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-white">
                Owners & Shares
              </h2>
              <p className="mt-1 text-xs text-zinc-600">
                Enter each owner&apos;s recorded ownership ratio
              </p>
            </div>

            <button
              onClick={addOwner}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              <Plus size={16} />
              Add Owner
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {owners.map((owner, index) => (
              <div
                key={owner.id}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                    Owner {index + 1}
                  </span>

                  {owners.length > 1 && (
                    <button
                      onClick={() => removeOwner(owner.id)}
                      className="rounded-lg p-2 text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400"
                      title="Remove owner"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_140px_140px_180px]">
                  <div>
                    <label className="mb-2 block text-xs text-zinc-500">
                      Owner Name
                    </label>
                    <input
                      value={owner.name}
                      onChange={(e) =>
                        updateOwner(owner.id, "name", e.target.value)
                      }
                      placeholder="Owner name"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/25"
                    />
                  </div>

                  <NumberField
                    label="Numerator"
                    value={owner.numerator}
                    onChange={(value) =>
                      updateOwner(owner.id, "numerator", value)
                    }
                    placeholder="1"
                  />

                  <NumberField
                    label="Denominator"
                    value={owner.denominator}
                    onChange={(value) =>
                      updateOwner(owner.id, "denominator", value)
                    }
                    placeholder="4"
                  />

                  <div>
                    <label className="mb-2 block text-xs text-zinc-500">
                      Calculated Area
                    </label>
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-emerald-300">
                      {formatShortArea(
                        results.find((r) => r.id === owner.id)
                          ?.areaSarshai || 0
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* VALIDATION */}
          <div className="mt-6">
            {sharesValid ? (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />
                <div>
                  <div className="font-medium text-emerald-300">
                    Ownership shares total 100%
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    The entered ownership ratios are internally consistent.
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
                <AlertTriangle
                  size={19}
                  className="mt-0.5 shrink-0 text-amber-400"
                />
                <div>
                  <div className="font-medium text-amber-300">
                    Share total: {(shareTotal * 100).toFixed(4)}%
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    Enter valid ownership ratios and make sure their total
                    equals 100%.
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RESULTS */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-white">
                Ownership Distribution
              </h2>
              <p className="mt-1 text-xs text-zinc-600">
                Calculated area based on the entered ownership ratios
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={copyResults}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                <Copy size={15} />
                Copy
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                <Printer size={15} />
                Print
              </button>

              <button
                onClick={resetCalculator}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                <RotateCcw size={15} />
                Reset
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-600">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Share</th>
                  <th className="px-4 py-3">Percentage</th>
                  <th className="px-4 py-3">Area</th>
                </tr>
              </thead>

              <tbody>
                {results.map((owner, index) => (
                  <tr
                    key={owner.id}
                    className="border-b border-white/5 text-sm"
                  >
                    <td className="px-4 py-4 text-zinc-600">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4 font-medium text-white">
                      {owner.name || "—"}
                    </td>

                    <td className="px-4 py-4 text-zinc-400">
                      {owner.numerator || 0}/{owner.denominator || 0}
                    </td>

                    <td className="px-4 py-4 text-zinc-400">
                      {(owner.share * 100).toFixed(4)}%
                    </td>

                    <td className="px-4 py-4 font-medium text-emerald-300">
                      {formatArea(owner.areaSarshai)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-600">
                Total Khewat Area
              </div>
              <div className="mt-1 font-semibold text-white">
                {formatArea(totalSarshai)}
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-xs uppercase tracking-wider text-zinc-600">
                Share Total
              </div>
              <div
                className={`mt-1 font-semibold ${
                  sharesValid
                    ? "text-emerald-300"
                    : "text-amber-300"
                }`}
              >
                {(shareTotal * 100).toFixed(4)}%
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <div className="py-8 text-center text-xs leading-6 text-zinc-700">
          JASS Digital Land Records Portal · Khewat Share Calculator
          <br />
          Calculations are based on the values entered by the user.
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-zinc-400">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/25"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs text-zinc-500">
        {label}
      </label>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/25"
      />
    </div>
  );
}
