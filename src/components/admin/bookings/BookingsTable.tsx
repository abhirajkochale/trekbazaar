"use client";

import React, { useState } from 'react';
import type { Booking } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { Search, Download, FileText } from 'lucide-react';

export function BookingsTable({ bookings, onStatusChange }: { bookings: Booking[], onStatusChange?: (id: string, newStatus: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = bookings.filter(b => {
    const matchesSearch = 
      b.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.treks?.title.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Cancelled': return 'bg-zinc-50 text-zinc-700 border-zinc-200';
      case 'Completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  const exportToCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['Reference', 'Customer Name', 'Customer Email', 'Trek', 'Departure Date', 'Travellers', 'Total Amount', 'Status', 'Booking Date'];
    const csvData = filtered.map(b => [
      b.booking_reference,
      b.customer_name,
      b.customer_email,
      b.treks?.title || '',
      new Date(b.departure_date).toLocaleDateString('en-US'),
      b.travellers_count,
      b.total_amount,
      b.status,
      new Date(b.created_at).toLocaleDateString('en-US')
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.map(item => `"${String(item).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search bookings..." 
            className="w-full pl-9 pr-4 h-10 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-tb-primary focus:border-tb-primary transition-shadow outline-none shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            className="h-10 px-3 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:border-tb-primary shadow-sm hover:border-zinc-300 transition-colors w-full sm:w-auto"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
          
          <button
            onClick={exportToCSV}
            disabled={filtered.length === 0}
            className="flex items-center justify-center gap-2 h-10 px-4 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border border-zinc-200 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-zinc-50/80 border-b border-zinc-200 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Trek & Departure</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(booking => {
                const depDate = new Date(booking.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <tr key={booking.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-black text-zinc-900 text-sm tracking-tight">{booking.booking_reference}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900 text-sm">{booking.customer_name}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{booking.customer_email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900 text-sm max-w-[200px] truncate">{booking.treks?.title}</div>
                      <div className="text-xs text-zinc-500 mt-0.5 font-medium">{depDate} • {booking.travellers_count} pax</div>
                      {booking.companies?.name && (
                        <div className="text-[9px] text-tb-primary font-bold uppercase tracking-wider mt-1.5 inline-block bg-tb-primary/10 px-1.5 py-0.5 rounded">
                          {booking.companies.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-black text-zinc-900 text-sm">{formatPrice(booking.total_amount)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {onStatusChange ? (
                        <select
                          value={booking.status}
                          onChange={(e) => onStatusChange(booking.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border cursor-pointer focus:ring-2 focus:ring-tb-primary focus:outline-none transition-colors appearance-none text-center inline-block ${getStatusColor(booking.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Completed">Completed</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-zinc-500 font-medium whitespace-nowrap">
                      {new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <FileText className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                    <p className="text-zinc-900 font-bold text-sm">No bookings found</p>
                    <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">Try adjusting your filters or search term to find what you&apos;re looking for.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4 pb-12">
        {filtered.map(booking => {
          const depDate = new Date(booking.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return (
            <div key={booking.id} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-black text-zinc-900 text-sm tracking-tight">{booking.booking_reference}</span>
                  <div className="text-xs text-zinc-500 mt-0.5">{new Date(booking.created_at).toLocaleDateString('en-US')}</div>
                </div>
                {onStatusChange ? (
                  <select
                    value={booking.status}
                    onChange={(e) => onStatusChange(booking.id, e.target.value)}
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border cursor-pointer focus:ring-2 focus:ring-tb-primary focus:outline-none transition-colors appearance-none text-center shrink-0 ${getStatusColor(booking.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  <span className={`shrink-0 inline-flex items-center px-2 py-1 rounded-md border text-[9px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                )}
              </div>
              
              <div className="bg-zinc-50/80 rounded-xl p-3 border border-zinc-100 flex flex-col gap-1 text-sm">
                <div className="font-bold text-zinc-900 line-clamp-1">{booking.treks?.title}</div>
                <div className="flex justify-between items-center text-xs font-medium text-zinc-600">
                  <span>{depDate} • {booking.travellers_count} pax</span>
                  <span className="font-bold text-zinc-900">{formatPrice(booking.total_amount)}</span>
                </div>
              </div>
              
              <div>
                <div className="font-bold text-zinc-900 text-sm">{booking.customer_name}</div>
                <div className="text-xs text-zinc-500 truncate">{booking.customer_email}</div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center text-sm font-medium text-zinc-500 shadow-sm">
            No bookings found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
