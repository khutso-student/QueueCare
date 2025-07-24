import React, { useState, useEffect, useContext } from "react";
import {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
} from "../../services/bookingAPI";
import { AuthContext  } from '../../context/AuthContext';

import { CiFilter } from "react-icons/ci";
import { IoIosAdd } from "react-icons/io";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineBloodtype } from "react-icons/md";
import { RiMapPinUserFill } from "react-icons/ri";

const departments = [
  "General Consultation",
  "Dentistry",
  "Cardiology",
  "Dermatology",
  "ENT (Ear, Nose, Throat)",
  "Gynecology",
  "Pediatrics",
  "Orthopedics",
  "Ophthalmology (Eyes)",
  "Neurology",
  "Oncology",
  "Radiology",
  "Urology",
  "Gastroenterology",
  "Psychiatry",
  "Physiotherapy",
  "Nutrition & Dietetics",
  "Pulmonology",
  "Nephrology",
  "Emergency",
  "Infectious Diseases",
];

const formatDate = (dateString) => {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  return isNaN(date) ? "Invalid date" : date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};


export default function BookAppointments() {
  const [showBook, setShowBook] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    session: "Morning",
    department: "",
    date: new Date().toISOString().split("T")[0],
 });
    const [bookings, setBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterSession, setFilterSession] = useState("");
    const [filterStatus, setFilterStatus] = useState("");


  const { user } = useContext(AuthContext);
  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
  if (user && !editBooking && isPatient) {
    setFormData((prev) => ({
      ...prev,
      fullName: user.name || "",
      email: user.email || "",
    }));
  }
    }, [user, editBooking, isPatient]);


  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  const startEdit = (booking) => {
    // Only patient can edit their own booking OR doctor can edit any
    if (isPatient && booking.email !== user.email) {
      alert("You can only edit your own appointments.");
      return;
    }

    setEditBooking(booking);
    setFormData({
      fullName: booking.fullName,
      email: booking.email,
      session: booking.session,
      department: booking.department,
      date: booking.date ? booking.date.split("T")[0] : new Date().toISOString().split("T")[0],
    });
    setShowBook(true);
  };

  const closeModal = () => {
    setShowBook(false);
    setEditBooking(null);
    setFormData({
      fullName: "",
      email: "",
      session: "Morning",
      department: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBooking) {
        if (isPatient && editBooking.email !== user.email) {
          alert("You can only edit your own appointments.");
          return;
        }
        await updateBooking(editBooking._id, {
            ...formData,
            date: new Date(formData.date).toISOString(),
        });

      } else {
        if (!isPatient) {
          alert("Only patients can book appointments.");
          return;
        }
        await createBooking({
            ...formData,
            date: new Date(formData.date).toISOString(),
        });
      }
      closeModal();
      fetchBookings();
    } catch (err) {
      console.error("Booking failed", err);
    }
  };

  const handleStatusChange = async (id, status) => {
    if (!isDoctor) return alert("Only doctors can update status.");
    try {
      await updateBookingStatus(id, { status });  // <-- fixed here
      fetchBookings();
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const handleDelete = async (id) => {
    if (!isDoctor) return alert("Only doctors can delete appointments.");
    try {
      await deleteBooking(id);
      fetchBookings();
    } catch (err) {
      console.error("Error deleting booking", err);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
  // Search matches name, email, or department (case insensitive)
  const searchMatch =
    booking.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.department?.toLowerCase().includes(searchQuery.toLowerCase());

  // Session matches or filter empty
  const sessionMatch =
    filterSession === "" || booking.session === filterSession;

  // Status matches or filter empty
  const statusMatch =
    filterStatus === "" || booking.status === filterStatus;

  // Return only if all match
  return searchMatch && sessionMatch && statusMatch;
});

  return (
    <main className="flex flex-col md:flex-row w-full h-full p-4 gap-4">
      <div className="flex-1">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <div className="flex flex-wrap gap-2 bg-[#F2F6FF] border border-[#e9e9e959] p-2 rounded-lg w-full mb-4">
                <input
                    type="search"
                    placeholder="Search your booking..."
                    className="text-sm bg-white flex-1 min-w-[200px] h-8 border border-[#888686] px-3 rounded-md focus:outline-[#d6d6d6]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select
                    className="text-sm bg-white h-8 px-3 border border-[#888686] rounded-md focus:outline-[#d4d4d4]"
                    value={filterSession}
                    onChange={(e) => setFilterSession(e.target.value)}
                >
                    <option value="">All Sessions</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                </select>

                <select
                    className="text-sm bg-white h-8 px-3 border border-[#888686] rounded-md focus:outline-[#d4d4d4]"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>

                <button
                    onClick={() => {
                    setSearchQuery("");
                    setFilterSession("");
                    setFilterStatus("");
                    }}
                    className="text-xs bg-[#000000bb] hover:bg-[#00000088] cursor-pointer text-white py-1 px-1.5 ml-2 rounded-md"
                >
                    Clear Filters
                </button>

                {isPatient && (
                    <button
                    onClick={() => setShowBook(true)}
                    className="flex items-center bg-[#1FBEC3] hover:bg-[#508e91] text-white text-sm h-8 px-3 rounded-md ml-auto"
                    >
                    <IoIosAdd />
                    Book Now
                    </button>
                )}
            </div>

        </div>

        <div className="mb-4 text-[#069094] font-semibold text-lg">
          Total Appointments: {bookings.length}
        </div>

        

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredBookings.map((booking) => {
            console.log("Booking object:", booking); // ✅ Proper console log

            return (
                <div
                key={booking._id}
                className="flex flex-col justify-between bg-white p-4 rounded-xl border border-[#d3d3d3] shadow-sm"
                >
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-[#069094] font-bold">{booking.department}</h1>
                    <div className="bg-[#1FBEC3] text-white font-bold w-8 h-8 flex justify-center items-center rounded-full">
                    <RiMapPinUserFill className="text-[20px]" />
                    </div>
                </div>

                <h2 className="font-bold text-[#655E5E]">{booking.fullName}</h2>
                <p className="text-xs text-[#655E5E] mb-2">{booking.email}</p>

                <div className="flex justify-between items-center">
                    <h1 className="text-red-500 text-xl font-light mb-2">{booking.session}</h1>
                    <p className="text-sm text-[#655E5E]">{formatDate(booking.date)}</p>
                </div>

                {booking.status === "Approved" && (
                <div className="text-sm text-[#655E5E] mb-2">
                    <p>
                    Queue Line: <span className="font-bold">{booking.queueLine || "-"}</span>
                    </p>
                    <p>
                    Queue Number:{" "}
                    <span className="font-bold text-[#1FBEC3]">{booking.queueNumber || "-"}</span>
                    </p>
                </div>
                )}


                <div
                    className={`text-sm mt-2 mb-2 py-1 px-2 rounded-full w-fit ${
                    booking.status === "Approved"
                        ? "bg-green-200 text-green-700"
                        : booking.status === "Rejected"
                        ? "bg-red-200 text-red-700"
                        : "bg-yellow-200 text-yellow-700"
                    }`}
                >
                    {booking.status || "Pending"}
                </div>

                <div className="flex justify-end items-center gap-2">
                    {isDoctor && booking.status === "Pending" && (
                    <>
                        <button
                        onClick={() => handleStatusChange(booking._id, "Approved")}
                        className="text-sm text-green-600 hover:underline"
                        title="Accept Appointment"
                        >
                        Accept
                        </button>
                        <button
                        onClick={() => handleStatusChange(booking._id, "Rejected")}
                        className="text-sm text-red-600 hover:underline"
                        title="Reject Appointment"
                        >
                        Reject
                        </button>
                    </>
                    )}

                    {isDoctor && (
                    <button
                        onClick={() => handleDelete(booking._id)}
                        className="text-sm bg-red-200 hover:bg-red-300 p-1 rounded-full text-red-400 hover:text-red-600 cursor-pointer duration-300"
                        title="Delete Appointment"
                    >
                        <MdDelete />
                    </button>
                    )}

                    {isPatient && booking.email === user.email && (
                    <button
                        onClick={() => startEdit(booking)}
                        className="text-sm bg-blue-200 hover:bg-blue-300 cursor-pointer p-1 rounded-full text-blue-600 duration-300"
                        title="Edit your appointment"
                    >
                        <MdModeEdit />
                    </button>
                    )}
                </div>
                </div>
            );
            })}

        </div>
      </div>

      <div className="w-full md:w-60 flex flex-col gap-2">
        <div className="flex flex-col justify-center items-center bg-white rounded-xl border border-[#d3d3d3] p-4">
          <h1 className="text-[#655E5E] text-2xl mb-4">User</h1>
          <div className="flex justify-center items-center bg-gray-100 rounded-full p-4 mb-4">
            <FaRegUser className="text-[50px] text-[#655E5E]" />
          </div>
          <h2 className="text-[#686767] font-bold">{user.name || "Guest"}</h2>
          <p className="text-xs text-[#686767] mb-4">{user.email || "No email"}</p>
          <h1 className="text-2xl text-[#069094] uppercase">{user.role || "Patient"}</h1>
        </div>

        <div className="flex items-center gap-2 p-4 bg-red-200 border border-red-400 rounded-xl">
          <div className="flex justify-center items-center bg-red-300 border border-red-400 w-10 h-10 rounded-full">
            <MdOutlineBloodtype className="text-red-900 text-[25px]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-red-900 text-sm font-semibold">EMERGENCY</h1>
            <p className="text-red-900 text-xs">Call: 064 857 1755</p>
          </div>
        </div>
      </div>

      {showBook && (
        <div
          onClick={closeModal}
          className="fixed top-0 left-0 w-full h-full bg-[#00000083] flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[400px] p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-bold text-center mb-4 text-[#069094]">
              {editBooking ? "Edit Appointment" : "Book Appointment"}
            </h2>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-[#c4c4c4]"
                required
                disabled={isDoctor}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-[#c4c4c4]"
                required
                disabled={isDoctor}
              />
              <select
                name="session"
                value={formData.session}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-[#c4c4c4]"
                required
                disabled={isDoctor}
              >
                <option value="">Select Session</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
              </select>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 text-sm"
                required
                disabled={isDoctor}
              >
                <option value="">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-[#c4c4c4]"
                required
                disabled={isDoctor}
              />
              <button
                type="submit"
                className="bg-[#1FBEC3] hover:bg-[#069094] text-white text-sm font-bold p-2 rounded-md"
              >
                {editBooking ? "Update Appointment" : "Submit Booking"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
