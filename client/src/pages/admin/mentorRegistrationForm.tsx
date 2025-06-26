"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import axios from "axios";
import imageCompression from "browser-image-compression";

export default function AdminMentorRegister() {
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const [previewKyc, setPreviewKyc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6).required("Password is required"),
    experience: Yup.number().required("Experience is required"),
    specialization: Yup.string().required("Specialization is required"),
    education: Yup.string().required("Education is required"),
    gender: Yup.string().required("Gender is required"),
    phone: Yup.string().required("Phone is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    street: Yup.string().required("Street is required"),
    pincode: Yup.string().required("Pincode is required"),
    about: Yup.string().required("About is required"),
    availableDays: Yup.array().min(1).required("Available days are required"),
    profileImg: Yup.mixed().required("Profile image is required"),
    kycCertificate: Yup.mixed().required("KYC certificate is required"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      experience: "",
      specialization: "General coach",
      education: "",
      gender: "",
      phone: "",
      city: "",
      state: "",
      street: "",
      pincode: "",
      about: "",
      availableDays: [] as string[],
      profileImg: null as File | null,
      kycCertificate: null as File | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, v));
          } else if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value as string);
          }
        });

        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/admin/mentors/admin/register`,
          formData
        );
        toast.success("Mentor registered successfully");
        formik.resetForm();
        setPreviewProfile(null);
        setPreviewKyc(null);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profileImg" | "kycCertificate"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("File size must be less than 20MB");
      return;
    }

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      formik.setFieldValue(field, compressedFile);

      const url = URL.createObjectURL(compressedFile);
      field === "profileImg" ? setPreviewProfile(url) : setPreviewKyc(url);
    } catch (err) {
      toast.error("Image compression failed");
    }
  };

  const toggleDay = (day: string) => {
    const selectedDays = [...formik.values.availableDays];
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    formik.setFieldValue("availableDays", newDays);
  };

  return (
    <div className="flex h-screen">
      <div className="w-64">
        <AdminSidebar />
      </div>
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md"
        >
          {/* File Upload Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium">Change Profile</label>
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mt-2">
                {previewProfile ? (
                  <img
                    src={previewProfile}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "profileImg")}
                className="mt-2 text-sm"
              />
              {formik.touched.profileImg && formik.errors.profileImg && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.profileImg}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center">
              <label className="text-sm font-medium">Add KYC Certificate</label>
              <div className="w-24 h-24 bg-gray-200 mt-2 flex items-center justify-center">
                {previewKyc ? (
                  <img
                    src={previewKyc}
                    alt="KYC Certificate"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-500">No Image</div>
                )}
              </div>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "kycCertificate")}
                className="mt-2 text-sm"
              />
              {formik.touched.kycCertificate &&
                formik.errors.kycCertificate && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.kycCertificate}
                  </div>
                )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[
              { name: "fullName", label: "Mentor Name", type: "text" },
              {
                name: "specialization",
                label: "Specialization",
                type: "select",
                options: [
                  "General coach",
                  "clinical",
                  "counseling",
                  "neuropsychology",
                ],
              },
              { name: "email", label: "Mentor Email", type: "email" },
              { name: "education", label: "Education", type: "text" },
              { name: "password", label: "Password", type: "password" },
              {
                name: "gender",
                label: "Gender",
                type: "select",
                options: ["Male", "Female", "Other"],
              },
              { name: "experience", label: "Experience", type: "number" },
              { name: "phone", label: "Phone", type: "text" },
            ].map(({ name, label, type, options }) => (
              <div key={name}>
                <label className="block text-sm font-medium">{label}</label>
                {type === "select" ? (
                  <select
                    name={name}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select</option>
                    {options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded-md"
                  />
                )}
                {formik.touched[name] && formik.errors[name] && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors[name]}
                  </div>
                )}
              </div>
            ))}

            {/* Address fields */}
            <div>
              <label className="block text-sm font-medium">Street</label>
              <input
                type="text"
                name="street"
                value={formik.values.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-md"
              />
              {formik.touched.street && formik.errors.street && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.street}
                </div>
              )}

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-md mt-2"
              />
              {formik.touched.city && formik.errors.city && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.city}
                </div>
              )}

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-md mt-2"
              />
              {formik.touched.state && formik.errors.state && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.state}
                </div>
              )}

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formik.values.pincode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-md mt-2"
              />
              {formik.touched.pincode && formik.errors.pincode && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.pincode}
                </div>
              )}
            </div>
          </div>

          {/* Available Days */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Available Days</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`px-3 py-1 border rounded-md ${
                    formik.values.availableDays.includes(day)
                      ? "bg-teal-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
            {formik.touched.availableDays && formik.errors.availableDays && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.availableDays}
              </div>
            )}
          </div>

          {/* About Mentor */}
          <div className="mt-4">
            <label className="block text-sm font-medium">About Mentor</label>
            <textarea
              name="about"
              value={formik.values.about}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border rounded-md h-20"
            ></textarea>
            {formik.touched.about && formik.errors.about && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.about}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700"
              disabled={loading}
            >
              {loading ? "Adding mentor..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
