import { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bike, 
  FileText, 
  Settings as SettingsIcon, 
  Plus, 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  Wrench
} from 'lucide-react';

export default function SuperAdminPanel() {
  const { fleet, bookings, updateBikeStatus } = useRental();
  const [activeTab, setActiveTab] = useState('fleet'); // 'dashboard', 'fleet', 'bookings', 'settings'

  // Calculations for stats
  const totalBikes = fleet.length;
  const availableBikes = fleet.filter(b => b.status === 'Available').length;
  const maintenanceBikes = fleet.filter(b => b.status === 'In Maintenance').length;
  const rentedBikes = fleet.filter(b => b.status === 'On Rent').length;
  const totalBookingsCount = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const handleToggleMaintenance = (bikeId, currentStatus) => {
    const nextStatus = currentStatus === 'Available' ? 'In Maintenance' : 'Available';
    updateBikeStatus(bikeId, nextStatus);
  };

  const handleAddNewVehicle = () => {
    alert('Add New Vehicle feature clicked! (Mock alert for prototype validation)');
  };

  return (
    <div className="bg-[#F5F5F4] min-h-screen pt-[76px] flex font-['Manrope'] text-[#1C1917]">
      {/* Sidebar Navigation */}
      <aside className="w-[280px] bg-[#1C1917] text-white shrink-0 hidden md:flex flex-col p-6 gap-8">
        <div>
          <Link to="/" className="flex items-baseline gap-0 select-none px-3">
            <span className="font-['Space_Grotesk'] font-bold text-[26px] tracking-tight text-white">
              RIDE
            </span>
            <span className="w-[8px] h-[8px] rounded-full bg-[#FBBF24] inline-block mb-[3px] ml-[2px]" />
            <span className="text-[12px] uppercase text-[#A8A29E] font-bold tracking-widest ml-3 border-l border-zinc-700 pl-3">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2">
          {/* Dashboard Tab */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[14px] font-semibold text-[14px] transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#FBBF24] text-[#1C1917]'
                : 'text-[#A8A29E] hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard size={18} />
            Executive Dashboard
          </button>

          {/* Fleet Inventory Tab (Default) */}
          <button
            onClick={() => setActiveTab('fleet')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[14px] font-semibold text-[14px] transition-all cursor-pointer ${
              activeTab === 'fleet'
                ? 'bg-[#FBBF24] text-[#1C1917]'
                : 'text-[#A8A29E] hover:text-white hover:bg-white/5'
            }`}
          >
            <Bike size={18} />
            Fleet & Inventory
          </button>

          {/* Bookings Tab */}
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[14px] font-semibold text-[14px] transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-[#FBBF24] text-[#1C1917]'
                : 'text-[#A8A29E] hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText size={18} />
            Rental Bookings
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[14px] font-semibold text-[14px] transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#FBBF24] text-[#1C1917]'
                : 'text-[#A8A29E] hover:text-white hover:bg-white/5'
            }`}
          >
            <SettingsIcon size={18} />
            Branch Settings
          </button>
        </nav>

        {/* Back navigation */}
        <div className="mt-auto pt-6 border-t border-zinc-800">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 font-semibold text-[14px] text-[#A8A29E] hover:text-white transition-all group"
          >
            <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Back to homepage
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-[1320px] mx-auto w-full">
        
        {/* Render Tab View: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-['Space_Grotesk'] font-bold text-[32px] tracking-tight text-[#1C1917]">
                Executive Dashboard
              </h1>
              <p className="text-[14px] text-[#57534E] mt-1">
                Real-time branch stats, revenue statements, and utilization insights.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-[18px] border border-[#E7E5E4] flex items-center justify-between">
                <div>
                  <span className="text-[12px] uppercase text-[#A8A29E] font-bold tracking-wider">Total Revenue</span>
                  <h3 className="font-['Space_Grotesk'] text-[28px] font-bold text-[#1C1917] mt-1">₹{totalRevenue}</h3>
                </div>
                <div className="w-[50px] h-[50px] rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#F59E0B]">
                  <TrendingUp size={22} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-[18px] border border-[#E7E5E4] flex items-center justify-between">
                <div>
                  <span className="text-[12px] uppercase text-[#A8A29E] font-bold tracking-wider">Bookings</span>
                  <h3 className="font-['Space_Grotesk'] text-[28px] font-bold text-[#1C1917] mt-1">{totalBookingsCount}</h3>
                </div>
                <div className="w-[50px] h-[50px] rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle size={22} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-[18px] border border-[#E7E5E4] flex items-center justify-between">
                <div>
                  <span className="text-[12px] uppercase text-[#A8A29E] font-bold tracking-wider">On Rent</span>
                  <h3 className="font-['Space_Grotesk'] text-[28px] font-bold text-[#1C1917] mt-1">{rentedBikes}</h3>
                </div>
                <div className="w-[50px] h-[50px] rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Bike size={22} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-[18px] border border-[#E7E5E4] flex items-center justify-between">
                <div>
                  <span className="text-[12px] uppercase text-[#A8A29E] font-bold tracking-wider">Maintenance</span>
                  <h3 className="font-['Space_Grotesk'] text-[28px] font-bold text-[#1C1917] mt-1">{maintenanceBikes}</h3>
                </div>
                <div className="w-[50px] h-[50px] rounded-full bg-amber-50 flex items-center justify-center text-[#F59E0B]">
                  <Wrench size={22} />
                </div>
              </div>
            </div>

            {/* Simulated graph or list */}
            <div className="bg-white border border-[#E7E5E4] rounded-[18px] p-6">
              <h3 className="font-['Space_Grotesk'] font-bold text-[18px] mb-4">Utilization Overview</h3>
              <div className="h-[200px] flex items-end justify-between gap-4 pt-10 px-4">
                {[45, 60, 55, 70, 85, 90, 80].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-[#FBBF24] rounded-t-[6px] transition-all hover:bg-[#F59E0B]" 
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[11px] text-[#A8A29E] font-semibold">Day {i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Render Tab View: Fleet Management (DEFAULT) */}
        {activeTab === 'fleet' && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-['Space_Grotesk'] font-bold text-[32px] tracking-tight text-[#1C1917]">
                  Fleet & Inventory
                </h1>
                <p className="text-[14px] text-[#57534E] mt-1">
                  Configure branch inventory availability, rates, and maintenance lockouts.
                </p>
              </div>

              <button
                onClick={handleAddNewVehicle}
                className="bg-[#FBBF24] text-[#1C1917] hover:bg-[#F59E0B] px-6 py-3 rounded-full font-semibold text-[14px] flex items-center gap-2 transition-all w-fit cursor-pointer shadow-[0_4px_14px_rgba(251,191,36,0.2)]"
              >
                <Plus size={18} />
                Add New Vehicle
              </button>
            </div>

            {/* Quick summary strip */}
            <div className="flex flex-wrap gap-4 text-[13px] font-semibold text-[#57534E]">
              <span className="bg-white border border-[#E7E5E4] px-4 py-2 rounded-full">
                Total Fleet: {totalBikes}
              </span>
              <span className="bg-green-50 border border-green-100 text-green-700 px-4 py-2 rounded-full">
                Available: {availableBikes}
              </span>
              <span className="bg-amber-50 border border-amber-100 text-[#F59E0B] px-4 py-2 rounded-full">
                In Maintenance: {maintenanceBikes}
              </span>
              <span className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full">
                Rented Out: {rentedBikes}
              </span>
            </div>

            {/* Fleet Master Table Card */}
            <div className="bg-white border border-[#E7E5E4] rounded-[18px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E7E5E4] bg-[#FAFAF9] text-[12px] font-bold uppercase tracking-wider text-[#A8A29E]">
                      <th className="py-4 px-6">Vehicle details</th>
                      <th className="py-4 px-6">Number plate</th>
                      <th className="py-4 px-6">Daily rate</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-center">Maintenance lock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E5E4] text-[14px]">
                    {fleet.map((bike) => {
                      const isMaintenance = bike.status === 'In Maintenance';
                      const isOnRent = bike.status === 'On Rent';
                      
                      return (
                        <tr key={bike.id} className="hover:bg-[#FFFDF8]/50 transition-colors">
                          {/* Image & Make/Model */}
                          <td className="py-4 px-6 flex items-center gap-4">
                            <img
                              src={bike.image_url}
                              alt={bike.model}
                              className="w-14 h-14 object-cover rounded-[10px] bg-[#F5F5F4] border border-[#E7E5E4]/50"
                            />
                            <div className="flex flex-col">
                              <span className="font-['Space_Grotesk'] font-bold text-[16px] text-[#1C1917]">
                                {bike.make} {bike.model}
                              </span>
                              <span className="text-[12px] text-[#A8A29E] font-medium">
                                Category: {bike.category}
                              </span>
                            </div>
                          </td>

                          {/* Plate */}
                          <td className="py-4 px-6 font-mono font-medium text-[#57534E] uppercase">
                            {bike.number_plate}
                          </td>

                          {/* Rate */}
                          <td className="py-4 px-6 font-semibold text-[#1C1917]">
                            ₹{bike.daily_rate}/day
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold ${
                              bike.status === 'Available'
                                ? 'bg-green-50 text-green-700'
                                : isMaintenance
                                ? 'bg-amber-50 text-[#F59E0B]'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                bike.status === 'Available'
                                  ? 'bg-[#22C55E]'
                                  : isMaintenance
                                  ? 'bg-[#F59E0B]'
                                  : 'bg-blue-500'
                              }`} />
                              {bike.status}
                            </span>
                          </td>

                          {/* Toggle Switch */}
                          <td className="py-4 px-6 text-center">
                            {isOnRent ? (
                              <span className="text-[12px] font-medium text-[#A8A29E]">
                                Cannot toggle while On Rent
                              </span>
                            ) : (
                              <div className="flex items-center justify-center">
                                <label className="relative inline-flex items-center cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={isMaintenance}
                                    onChange={() => handleToggleMaintenance(bike.id, bike.status)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59E0B]" />
                                </label>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab View: Bookings Log */}
        {activeTab === 'bookings' && (
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-['Space_Grotesk'] font-bold text-[32px] tracking-tight text-[#1C1917]">
                Rental Bookings
              </h1>
              <p className="text-[14px] text-[#57534E] mt-1">
                Monitor current rental transactions, check invoices, and review drop-off audits.
              </p>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-[18px] p-12 text-center border border-[#E7E5E4]">
                <FileText size={48} className="text-[#A8A29E] mx-auto mb-4" />
                <h3 className="font-['Space_Grotesk'] text-[20px] font-semibold text-[#1C1917]">
                  No Booking History
                </h3>
                <p className="text-[#57534E] text-[14px] mt-2 max-w-[360px] mx-auto">
                  There are no active or completed bookings recorded in the system for this session.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-[#E7E5E4] rounded-[18px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E7E5E4] bg-[#FAFAF9] text-[12px] font-bold uppercase tracking-wider text-[#A8A29E]">
                        <th className="py-4 px-6">Booking ID</th>
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Vehicle</th>
                        <th className="py-4 px-6">Total paid</th>
                        <th className="py-4 px-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E5E4] text-[14px]">
                      {bookings.map((booking) => {
                        const bike = fleet.find((b) => b.id === booking.bikeId);
                        return (
                          <tr key={booking.id} className="hover:bg-[#FFFDF8]/50 transition-colors">
                            <td className="py-4 px-6 font-mono font-semibold text-[#1C1917]">
                              {booking.id}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex flex-col">
                                <span className="font-semibold text-[#1C1917]">
                                  {booking.userDetails.name}
                                </span>
                                <span className="text-[12px] text-[#A8A29E]">
                                  {booking.userDetails.email}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              {bike ? `${bike.make} ${bike.model}` : 'Unknown Vehicle'}
                            </td>
                            <td className="py-4 px-6 font-semibold text-[#1C1917]">
                              ₹{booking.totalAmount}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold ${
                                booking.status === 'Completed'
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-amber-50 text-[#F59E0B]'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Render Tab View: Settings */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-['Space_Grotesk'] font-bold text-[32px] tracking-tight text-[#1C1917]">
                Branch Settings
              </h1>
              <p className="text-[14px] text-[#57534E] mt-1">
                Configure operational windows, late penalties, and general tax policies.
              </p>
            </div>

            <div className="bg-white border border-[#E7E5E4] rounded-[18px] p-6 max-w-[600px] flex flex-col gap-6">
              <h3 className="font-['Space_Grotesk'] font-bold text-[18px] border-b border-[#E7E5E4] pb-3">
                Operational Policies
              </h3>

              <div className="flex flex-col gap-4 text-[14px]">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#57534E]">Branch Hours</span>
                  <span className="text-[#1C1917] font-medium">10:00 AM - 12:00 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#57534E]">Standard Late Fee Penalty</span>
                  <span className="text-[#1C1917] font-medium">₹250 / hour</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#57534E]">Grace return period</span>
                  <span className="text-[#1C1917] font-medium">1 hour</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#57534E]">Tax Policy (GST)</span>
                  <span className="text-[#1C1917] font-medium">18% (standard)</span>
                </div>
              </div>

              <button
                onClick={() => alert('Settings successfully saved! (Mock alert)')}
                className="bg-[#1C1917] text-white hover:bg-[#37312F] py-3 px-6 rounded-full font-semibold text-[14px] transition-all w-fit cursor-pointer self-end"
              >
                Save Configurations
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
