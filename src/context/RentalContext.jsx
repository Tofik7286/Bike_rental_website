import { createContext, useContext, useState, useEffect } from 'react';
import { mockFleet, mockBookings } from '../data/mockDatabase';

const RentalContext = createContext();

export function RentalProvider({ children }) {
  const [fleet, setFleet] = useState(() => {
    const saved = localStorage.getItem('ride_fleet');
    return saved ? JSON.parse(saved) : mockFleet;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('ride_bookings');
    return saved ? JSON.parse(saved) : mockBookings;
  });

  const [currentUser, setCurrentUser] = useState({
    id: 'U-101',
    name: 'Aravind Sharma',
    email: 'aravind@ride.com',
    role: 'Customer', // 'Customer', 'Staff', 'Admin'
  });

  // Sync to localStorage for persistence
  useEffect(() => {
    localStorage.setItem('ride_fleet', JSON.stringify(fleet));
  }, [fleet]);

  useEffect(() => {
    localStorage.setItem('ride_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Actions
  const createBooking = (bikeId, dates, totalAmount, userDetails) => {
    const newBooking = {
      id: `BK-${String(bookings.length + 1).padStart(3, '0')}`,
      bikeId,
      dates, // { start, end }
      totalAmount,
      userDetails: userDetails || { name: currentUser.name, email: currentUser.email },
      status: 'Upcoming', // 'Upcoming', 'Completed', 'Cancelled'
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    setFleet((prevFleet) =>
      prevFleet.map((bike) =>
        bike.id === bikeId ? { ...bike, status: 'On Rent' } : bike
      )
    );

    return newBooking;
  };

  const updateBikeStatus = (bikeId, newStatus) => {
    setFleet((prevFleet) =>
      prevFleet.map((bike) =>
        bike.id === bikeId ? { ...bike, status: newStatus } : bike
      )
    );
  };

  const activateBooking = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: 'Active' } : booking
      )
    );
  };

  const completeBooking = (bookingId, lateFee = 0, damageMemo = '') => {
    setBookings((prevBookings) => {
      const updated = prevBookings.map((booking) => {
        if (booking.id === bookingId) {
          // Set bike back to Available
          updateBikeStatus(booking.bikeId, 'Available');
          return {
            ...booking,
            status: 'Completed',
            lateFee,
            damageMemo,
            completedAt: new Date().toISOString(),
          };
        }
        return booking;
      });
      return updated;
    });
  };

  return (
    <RentalContext.Provider
      value={{
        fleet,
        bookings,
        currentUser,
        setCurrentUser,
        createBooking,
        updateBikeStatus,
        activateBooking,
        completeBooking,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
}

export function useRental() {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context;
}
