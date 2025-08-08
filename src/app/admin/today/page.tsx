"use client";

import { useEffect, useMemo, useState } from "react";
import {
  startOfDay,
  endOfDay,
  format,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";

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
  status:
    | "pending"
    | "accepted"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";
  total: number;
  items: OrderItem[];
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TodayOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

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

  const normalize = (d?: string) => {
    if (!d) return null;
    const date = new Date(d);
    return isNaN(date.getTime()) ? parseISO(d) : date;
  };

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const todaysOrders = useMemo(() => {
    return orders.filter((o) => {
      const created = normalize(o.createdAt) || normalize(o.updatedAt);
      return (
        !!created && isAfter(created, todayStart) && isBefore(created, todayEnd)
      );
    });
  }, [orders, todayStart, todayEnd]);

  const metrics = useMemo(() => {
    const totalOrders = todaysOrders.length;
    const totalRevenue = todaysOrders.reduce((s, o) => s + (o.total || 0), 0);
    const completedRevenue = todaysOrders
      .filter((o) => o.status === "completed")
      .reduce((s, o) => s + (o.total || 0), 0);
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
    const cancelledLoss = todaysOrders
      .filter((o) => o.status === "cancelled")
      .reduce((s, o) => s + (o.total || 0), 0);

    // top items
    const itemTotals = new Map<string, { name: string; revenue: number; qty: number }>();
    todaysOrders.forEach((o) => {
      o.items?.forEach((it) => {
        const prev = itemTotals.get(it.id) || {
          name: it.name,
          revenue: 0,
          qty: 0,
        };
        prev.revenue += (it.price || 0) * (it.quantity || 0);
        prev.qty += it.quantity || 0;
        itemTotals.set(it.id, prev);
      });
    });
    const topItems = Array.from(itemTotals.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // top customers (by revenue today)
    const byCustomer = new Map<string, { name: string; phone: string; orders: number; revenue: number }>();
    todaysOrders.forEach((o) => {
      const key = `${o.customerName}|${o.phone}`;
      const prev =
        byCustomer.get(key) ||
        ({ name: o.customerName, phone: o.phone, orders: 0, revenue: 0 } as const);
      const next = { ...prev } as { name: string; phone: string; orders: number; revenue: number };
      next.orders += 1;
      next.revenue += o.total || 0;
      byCustomer.set(key, next);
    });
    const topCustomers = Array.from(byCustomer.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // hourly series 0-23
    const hourly = Array.from({ length: 24 }, (_, h) => ({ h, value: 0 }));
    todaysOrders.forEach((o) => {
      const created = normalize(o.createdAt) || new Date();
      const h = (created as Date).getHours();
      hourly[h].value += o.total || 0;
    });

    return {
      totalOrders,
      totalRevenue,
      completedRevenue,
      avgOrderValue,
      cancelledLoss,
      topItems,
      topCustomers,
      hourly,
    };
  }, [todaysOrders]);

  return (
    <>
          {/* Date summary */}
          <p className="text-sm text-gray-500 mb-4">
            {format(todayStart, "EEE d MMM yyyy")}
          </p>
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">Orders Today</p>
                <p className="mt-2 text-2xl font-semibold">{metrics.totalOrders}</p>
                <p className="text-xs text-gray-500">Avg £{metrics.avgOrderValue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">Revenue Today</p>
                <p className="mt-2 text-2xl font-semibold">£{metrics.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Completed £{metrics.completedRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">Cancelled Loss</p>
                <p className="mt-2 text-2xl font-semibold">£{metrics.cancelledLoss.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Potential revenue lost</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">Top Item Today</p>
                {metrics.topItems[0] ? (
                  <div className="mt-2">
                    <p className="text-base font-medium truncate">{metrics.topItems[0].name}</p>
                    <p className="text-xs text-gray-500">
                      Qty {metrics.topItems[0].qty} · £{metrics.topItems[0].revenue.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">No data</p>
                )}
              </div>
            </div>

            {/* Hourly Revenue Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Hourly revenue</p>
                  <p className="text-xs text-gray-500">00:00 - 23:59</p>
                </div>
                <div className="relative h-52">
                  {(() => {
                    const data = metrics.hourly;
                    const width = 800;
                    const height = 200;
                    const padding = { top: 10, right: 10, bottom: 24, left: 36 };
                    const innerW = width - padding.left - padding.right;
                    const innerH = height - padding.top - padding.bottom;
                    const maxY = Math.max(1, ...data.map((d) => d.value));
                    const x = (i: number) => (i / Math.max(1, data.length - 1)) * innerW;
                    const y = (v: number) => innerH - (v / maxY) * innerH;

                    const path = data
                      .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.value)}`)
                      .join(" ");
                    const area =
                      `M 0 ${innerH} ` +
                      data.map((d, i) => `L ${x(i)} ${y(d.value)}`).join(" ") +
                      ` L ${innerW} ${innerH} Z`;
                    const gridY = [0, 0.25, 0.5, 0.75, 1].map((fr) => ({
                      y: y(maxY * fr),
                      v: maxY * fr,
                    }));

                    return (
                      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                        <g transform={`translate(${padding.left},${padding.top})`}>
                          {gridY.map((g, idx) => (
                            <line
                              key={idx}
                              x1={0}
                              x2={innerW}
                              y1={g.y}
                              y2={g.y}
                              stroke="#e5e7eb"
                              strokeWidth={1}
                            />
                          ))}
                          <path d={area} fill="rgba(239,68,68,0.15)" />
                          <path
                            d={path}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth={2}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                          {data.map((d, i) => (
                            <g
                              key={i}
                              onMouseEnter={() => setHoverIdx(i)}
                              onMouseLeave={() => setHoverIdx(null)}
                            >
                              <circle
                                cx={x(i)}
                                cy={y(d.value)}
                                r={hoverIdx === i ? 4 : 3}
                                fill="#ef4444"
                              />
                            </g>
                          ))}
                          {data.map((d, i) => (
                            <text
                              key={i}
                              x={x(i)}
                              y={innerH + 16}
                              fontSize={10}
                              textAnchor="middle"
                              fill="#6b7280"
                            >
                              {String(d.h).padStart(2, "0")}
                            </text>
                          ))}
                          {gridY.map((g, idx) => (
                            <text
                              key={idx}
                              x={-8}
                              y={g.y}
                              fontSize={10}
                              textAnchor="end"
                              dominantBaseline="middle"
                              fill="#6b7280"
                            >
                              £{g.v.toFixed(0)}
                            </text>
                          ))}
                        </g>
                      </svg>
                    );
                  })()}
                  {hoverIdx !== null && metrics.hourly[hoverIdx] && (
                    <div
                      className="absolute -translate-x-1/2 -translate-y-full px-2 py-1 text-xs bg-white border rounded shadow"
                      style={{
                        left: `calc(${(hoverIdx / Math.max(1, metrics.hourly.length - 1)) * 100}% + 36px)`,
                        top: 0,
                      }}
                    >
                      <div className="font-medium">
                        {String(metrics.hourly[hoverIdx].h).padStart(2, "0")}:00
                      </div>
                      <div>£{metrics.hourly[hoverIdx].value.toFixed(2)}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm font-medium mb-2">Top items today</p>
                <div className="divide-y">
                  {metrics.topItems.length === 0 && (
                    <p className="text-sm text-gray-500">No items</p>
                  )}
                  {metrics.topItems.map((it, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{it.name}</p>
                        <p className="text-xs text-gray-500">Qty {it.qty}</p>
                      </div>
                      <div className="text-right font-medium">£{it.revenue.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm font-medium mb-2">Top customers today</p>
                <div className="divide-y">
                  {metrics.topCustomers.length === 0 && (
                    <p className="text-sm text-gray-500">No customers</p>
                  )}
                  {metrics.topCustomers.map((c, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-medium truncate max-w-[24ch]">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.phone}</p>
                      </div>
                      <div className="text-right font-medium">£{c.revenue.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium">Orders today ({todaysOrders.length})</p>
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
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : todaysOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                          No orders yet today
                        </td>
                      </tr>
                    ) : (
                      todaysOrders.map((o) => (
                        <tr key={o._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">#{o._id?.slice(-6).toUpperCase()}</td>
                          <td className="px-4 py-2">
                            <div className="font-medium">{o.customerName}</div>
                            <div className="text-xs text-gray-500">{o.phone}</div>
                          </td>
                          <td className="px-4 py-2 capitalize">{o.status}</td>
                          <td className="px-4 py-2 text-right font-medium">£{(o.total || 0).toFixed(2)}</td>
                          <td className="px-4 py-2 truncate max-w-[24ch]">{o.deliveryAddress}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
    </>
  );
}
