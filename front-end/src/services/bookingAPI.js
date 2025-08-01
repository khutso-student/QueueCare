import api from '../services/api';

export const getAllBookings = async () => {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const res = await api.post('/bookings', bookingData);
    return res.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const updateBookingStatus = async (id, updateData) => {
  try {
    const res = await api.put(`/bookings/${id}/status`, updateData);
    return res.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const updateBooking = async (id, updateData) => {
  try {
    const res = await api.put(`/bookings/${id}`, updateData);
    return res.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const deleteBooking = async (id) => {
  try {
    const res = await api.delete(`/bookings/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

export const getDashboardData = async () => {
  try {
    const response = await api.get('/dashboard'); // ✅ fixed here
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
