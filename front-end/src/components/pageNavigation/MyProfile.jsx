import React, { useState, useEffect } from "react";

export default function MyProfile() {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?.id;
        console.log("Stored user:", storedUser);
        console.log("User ID:", userId);


        const [showModel, setShowModel] = useState(false);
        const [selectedImage, setSelectedImage] = useState(null);
        const [previewImage, setPreviewImage] = useState("");
        const [loading, setLoading] = useState(false);

        const [user, setUser] = useState({
        name: "",
        email: "",
        role: "",
        profileImage: "",
        });

        const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        profileImage: "",
        });


    

  // 🔁 Fetch user profile on mount
        useEffect(() => {
            const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/users/${userId}`);
                const data = await res.json();
                if (data) {
                setUser(data);
                setFormData(data);
                setPreviewImage(data.profileImage);
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
            };

            if (userId) {
            fetchUser();
            } else {
            console.error("No user ID found in localStorage");
            }
        }, [userId]);

  // 📤 Upload profile image
  const handleUpload = async () => {
    if (!selectedImage || !userId) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setLoading(true);
        const res = await fetch(`http://localhost:5000/api/uploads/upload-profile/${userId}`, {
          method: "POST",
          body: formData,
        });

      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setPreviewImage(data.user.profileImage);
        alert("Profile image updated!");
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save profile
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (selectedImage) {
        await handleUpload();
      }

      const { name, email, role } = formData;

      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, role }),
      });

      const updatedUser = await res.json();
      console.log("Updated user from server:", updatedUser);

      setUser(updatedUser);
      setFormData(updatedUser);
      setPreviewImage(updatedUser.profileImage);
      setShowModel(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // 📥 Form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col items-center bg-white w-120 h-90 border border-[#dfdfdf] rounded-lg p-3">
        {/* Banner */}
        <div className="flex justify-center items-center bg-[#1FBEC3] w-full h-30 rounded-lg">
          <h1 className="text-[50px] font-bold text-[#ffffff1a] animate-bounce">
            QueueCare
          </h1>
        </div>

        {/* Profile Image */}
        <div className="bg-black w-30 h-30 rounded-full border-8 border-[#ffffff] relative mt-[-55px] overflow-hidden">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-300"></div>
          )}
        </div>

        {/* Profile Info */}
        <p className="text-[#686161] mb-1">{user.name}</p>
        <h2 className="text-[#686161] mb-1 font-semibold">{user.email}</h2>
       <h1 className="text-[#686161] text-xl mb-1 font-bold">
          {typeof user.role === 'string' && user.role.length > 0
            ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
            : ""}
        </h1>


        {/* Edit Button */}
        <button
          onClick={() => {
            setFormData(user);
            setPreviewImage(user.profileImage);
            setShowModel(true);
          }}
          className="bg-[#1FBEC3] hover:bg-[#529092] text-white text-sm rounded-md py-1.5 px-4 mt-2"
        >
          Edit Details
        </button>

        {/* Modal */}
        {showModel && (
          <div
            onClick={() => setShowModel(false)}
            className="fixed top-0 left-0 w-full h-full bg-[#000000af] flex justify-center items-center z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-96 rounded-lg p-6 shadow-md"
            >
              <h2 className="text-lg font-bold mb-4">Edit Profile</h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-1">Upload Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setSelectedImage(e.target.files[0]);
                      setPreviewImage(URL.createObjectURL(e.target.files[0]));
                    }}
                    className="text-sm"
                  />

                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="mt-2 h-20 w-20 object-cover rounded-full border"
                    />
                  )}
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModel(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1FBEC3] text-white rounded hover:bg-[#14888c]"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
