"use client";

import { useState } from "react";
import Link from "next/link";

export default function InfoDialog() {
  const [open, setOpen] = useState(false);

  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Information"
        className="ml-3 inline-flex items-center justify-center rounded-full border border-red-200 bg-white/90 text-red-700 hover:text-red-800 hover:border-red-300 shadow-sm hover:shadow transition-all w-12 h-12 text-2xl"
        title="Information"
      >
        ℹ️
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white text-sm">i</span>
                Information
              </h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1 text-center">Food hygiene rating</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">Generally Satisfactory</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">Rating by the Food Standards Agency and your local authority. This rating may have changed. For more information</p>
                <p className="text-xs text-gray-500 mt-1">Last inspection 19/02/2025</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">A little bit about us</p>
                <p className="text-sm text-gray-700">
                  Mr Phung’s is located on Selby Avenue in Leeds. We’ve been serving the community for years with generous portions and classic Chinese dishes cooked the right way. Order safely and directly via our website here: <Link href="/order" className="text-red-600 hover:text-red-700 font-medium underline underline-offset-2">Order Online</Link>.
                  We serve all your favourites including Chop Suey, Satay and Pineapple dishes, plus set meals which are ideal if you have more than one mouth to feed.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Delivery information</p>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>Orders over 3 miles will include an additional charge.</li>
                  <li>0–3 mile radius: total 50p delivery charge</li>
                  <li>3–4 mile radius: total £1 delivery charge</li>
                  <li>4–5 mile radius: total £1.50 delivery charge</li>
                  <li>We cannot deliver to addresses more than a 5 mile radius away.</li>
                </ul>
                <p className="mt-2 text-sm text-gray-700"><strong>PLEASE NOTE:</strong> Scarcroft and Thorner have a fixed £2.50 delivery charge which must be paid cash upon delivery. Any delivery charges over 50p must be paid cash upon delivery.</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500">Delivery fee section: more details coming soon.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
