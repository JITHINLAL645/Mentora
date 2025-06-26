import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

const MentorRegistrationPage = () => {
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const [previewKyc, setPreviewKyc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6).required("Password is required"),
    specialization: Yup.string().required("Specialization is required"),
    education: Yup.string().required("Education is required"),
    gender: Yup.string().required("Gender is required"),
    experience: Yup.number().required("Experience is required"),
    phone: Yup.string().required("Phone is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    street: Yup.string().required("Street is required"),
    pincode: Yup.string().required("Pincode is required"),
    about: Yup.string().required("About is required"),
    profileImg: Yup.mixed().required("Profile image is required"),
    kycCertificate: Yup.mixed().required("KYC certificate is required"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      specialization: "General coach",
      education: "",
      gender: "",
      experience: "",
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

        await axios.post("/api/mentors/register", formData);
        toast.success("Mentor registered successfully");
        navigate("/login");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    },
  });

  const MAX_SIZE = 20 * 1024 * 1024;

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profileImg" | "kycCertificate"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      console.error("Compression error:", err);
      toast.error("Image compression failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">
          Mentor Registration
        </h2>

        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Education", name: "education", type: "text" },
            { label: "Experience", name: "experience", type: "number" },
            { label: "Phone", name: "phone", type: "text" },
            { label: "Street", name: "street", type: "text" },
            { label: "City", name: "city", type: "text" },
            { label: "State", name: "state", type: "text" },
            { label: "Pincode", name: "pincode", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                onChange={formik.handleChange}
                value={(formik.values as any)[field.name]}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-red-500 text-xs mt-1">
                {(formik.errors as any)[field.name]}
              </p>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Specialization
            </label>
            <select
              name="specialization"
              onChange={formik.handleChange}
              value={formik.values.specialization}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>General coach</option>
              <option>Clinical</option>
              <option>Counseling</option>
              <option>Neuropsychology</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Gender
            </label>
            <select
              name="gender"
              onChange={formik.handleChange}
              value={formik.values.gender}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <p className="text-red-500 text-xs mt-1">{formik.errors.gender}</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              About
            </label>
            <textarea
              name="about"
              rows={3}
              onChange={formik.handleChange}
              value={formik.values.about}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            ></textarea>
            <p className="text-red-500 text-xs mt-1">{formik.errors.about}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Profile Image
            </label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "profileImg")}
            />
            {previewProfile && (
              <img
                src={previewProfile}
                alt="Preview"
                className="w-20 h-20 mt-2 rounded-full object-cover"
              />
            )}
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.profileImg as string}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              KYC Certificate
            </label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "kycCertificate")}
            />
            {previewKyc && (
              <img
                src={previewKyc}
                alt="Preview"
                className="w-20 h-20 mt-2 object-cover"
              />
            )}
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.kycCertificate as string}
            </p>
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 text-white px-8 py-2 rounded-md hover:bg-teal-700 transition duration-200"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorRegistrationPage;
