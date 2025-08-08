"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { startOfDay, subDays, format } from "date-fns";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  status: "pending" | "accepted" | "preparing" | "ready" | "completed" | "cancelled";
  total: number;
  items: OrderItem[];
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"7d" | "30d" | "all">("7d");
  const [status, setStatus] = useState<"all" | Order["status"]>("all");
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    let result = orders;
    if (range !== "all") {
      const days = range === "7d" ? 7 : 30;
      const start = startOfDay(subDays(new Date(), days - 1));
      result = result.filter((o) => new Date(o.createdAt || o.updatedAt) >= start);
    }
    if (status !== "all") {
      result = result.filter((o) => o.status === status);
    }
    return result;
  }, [orders, range, status]);

  const metrics = useMemo(() => {
    const totalOrders = filtered.length;
    const totalRevenue = filtered.reduce((s, o) => s + (o.total || 0), 0);
    const completedRevenue = filtered
      .filter((o) => o.status === "completed")
      .reduce((s, o) => s + (o.total || 0), 0);
    const cancelledValue = filtered
      .filter((o) => o.status === "cancelled")
      .reduce((s, o) => s + (o.total || 0), 0);
    // Potential income: all non-cancelled & not yet completed
    const potentialIncome = filtered
      .filter((o) => o.status !== "cancelled" && o.status !== "completed")
      .reduce((s, o) => s + (o.total || 0), 0);
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      completedRevenue,
      cancelledValue,
      potentialIncome,
      avgOrderValue,
    };
  }, [filtered, range]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <nav className="-mb-px flex gap-6 text-sm">
              <Link href="/admin" className="border-b-2 border-transparent hover:border-gray-300 pb-2 text-gray-600 hover:text-gray-900">Overview</Link>
              <Link href="/admin/today" className="border-b-2 border-transparent hover:border-gray-300 pb-2 text-gray-600 hover:text-gray-900">Today</Link>
              <span className="border-b-2 border-red-600 pb-2 text-gray-900">Orders</span>
              <Link href="/admin/items" className="border-b-2 border-transparent hover:border-gray-300 pb-2 text-gray-600 hover:text-gray-900">Items</Link>
              <Link href="/admin/customers" className="border-b-2 border-transparent hover:border-gray-300 pb-2 text-gray-600 hover:text-gray-900">Customers</Link>
              <Link href="/admin/revenue" className="border-b-2 border-transparent hover:border-gray-300 pb-2 text-gray-600 hover:text-gray-900">Revenue</Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Controls */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Range:</span>
                <div className="flex overflow-hidden rounded-md border">
                  {(["7d", "30d", "all"] as const).map((r) => (
                    <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 text-sm ${range === r ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}>{r}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="px-2 py-1.5 text-sm border rounded-md bg-white">
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">Orders</p>
                <p className="mt-2 text-2xl font-semibold">{metrics.totalOrders}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">Revenue</p>
                <p className="mt-2 text-2xl font-semibold">£{metrics.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">Completed Revenue</p>
                <p className="mt-2 text-2xl font-semibold">£{metrics.completedRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">Potential Income</p>
                <p className="mt-2 text-2xl font-semibold">£{metrics.potentialIncome.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">Cancelled Value</p>
                <p className="mt-2 text-2xl font-semibold">£{metrics.cancelledValue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">AOV</p>
                <p className="mt-2 text-2xl font-semibold">£{metrics.avgOrderValue.toFixed(2)}</p>
              </div>
            </div>

            {/* Status breakdown removed as requested */}

            {/* Orders table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium">Orders ({filtered.length})</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">ID</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Customer</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Total</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Address</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500">Loading...</td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500">No orders</td>
                      </tr>
                    ) : (
                      filtered.map((o) => (
                        <tr
                          key={o._id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelected(o)}
                        >
                          <td className="px-4 py-2">#{o._id?.slice(-6).toUpperCase()}</td>
                          <td className="px-4 py-2">
                            <div className="font-medium">{o.customerName}</div>
                            <div className="text-xs text-gray-500">{o.phone}</div>
                          </td>
                          <td className="px-4 py-2 capitalize">{o.status}</td>
                          <td className="px-4 py-2 text-right font-medium">£{(o.total || 0).toFixed(2)}</td>
                          <td className="px-4 py-2 truncate max-w-[24ch]">{o.deliveryAddress}</td>
                          <td className="px-4 py-2">{new Date(o.createdAt || o.updatedAt).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal for order details */}
            {selected && (
              <div className="fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
                <div className="absolute inset-y-0 right-0 w-full max-w-xl bg-white shadow-xl">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div>
                      <p className="text-sm text-gray-500">Order</p>
                      <h2 className="text-lg font-semibold">#{selected._id?.slice(-6).toUpperCase()}</h2>
                    </div>
                    <button className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50" onClick={() => setSelected(null)}>Close</button>
                  </div>
                  <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs uppercase text-gray-500">Customer</p>
                        <p className="font-medium">{selected.customerName}</p>
                        <p className="text-xs text-gray-500">{selected.phone}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs uppercase text-gray-500">Status</p>
                        <p className="font-medium capitalize">{selected.status}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs uppercase text-gray-500">Total</p>
                        <p className="font-medium">£{(selected.total || 0).toFixed(2)}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs uppercase text-gray-500">Created</p>
                        <p className="font-medium">{new Date(selected.createdAt || selected.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Delivery</p>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm">{selected.deliveryAddress}</p>
                        {selected.deliveryNotes && (
                          <p className="text-xs text-gray-500 mt-2">Notes: {selected.deliveryNotes}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Items</p>
                      <div className="bg-white rounded border">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-gray-600">Item</th>
                              <th className="px-3 py-2 text-right text-gray-600">Qty</th>
                              <th className="px-3 py-2 text-right text-gray-600">Price</th>
                              <th className="px-3 py-2 text-right text-gray-600">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selected.items?.map((it) => (
                              <tr key={it.id}>
                                <td className="px-3 py-2">
                                  <div className="font-medium">{it.name}</div>
                                  {it.description && (
                                    <div className="text-xs text-gray-500">{it.description}</div>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-right">{it.quantity}</td>
                                <td className="px-3 py-2 text-right">£{(it.price || 0).toFixed(2)}</td>
                                <td className="px-3 py-2 text-right font-medium">£{(((it.price || 0) * (it.quantity || 0)) || 0).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
