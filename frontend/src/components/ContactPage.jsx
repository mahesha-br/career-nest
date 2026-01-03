import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      fullName: !form.fullName.trim(),
      email: !form.email.trim(),
      message: !form.message.trim(),
    };

    setError(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      setIsLoading(true);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3_ACCESS_KEY,
          name: form.fullName,
          email: form.email,
          subject: form.subject || "Contact Form Message",
          message: form.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Message sent successfully!", {
          position: "top-center",
        });
        setForm({ fullName: "", email: "", subject: "", message: "" });
      } else {
        toast.error(result.message || "Failed to send message");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl h-[71.1vh] md:h-[82.75vh] mt-18 mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>

      <p className="text-gray-600 mb-6">
        Have a question or need support? Fill out the form below and we’ll get
        back to you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none
            ${
              error.fullName
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none
            ${
              error.email
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
        />

        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Subject (optional)"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <textarea
          name="message"
          rows="4"
          value={form.message}
          onChange={handleChange}
          placeholder="Your Message"
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none
            ${
              error.message
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 cursor-pointer rounded-lg text-white font-medium transition
            ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
