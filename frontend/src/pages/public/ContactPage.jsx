import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";

const ContactPage = () => {
  const { success } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    success("Your message has been received! Our support team will get back to you shortly.");
    setSubmitted(true);
  };

  return (
    <div className="contact-page fade-in" style={{ padding: "3rem 0 5rem" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="badge badge-red" style={{ marginBottom: "0.75rem" }}>GET IN TOUCH</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>
            Contact Filmvora
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "600px", margin: "0 auto" }}>
            Have a question about our streaming catalog, want to submit an independent film, or need technical assistance?
          </p>
        </div>

        {/* Contact Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "3rem" }} className="contact-grid">
          {/* Info Side */}
          <div>
            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.75rem",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Direct Channels
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                  Our media relations and content support teams are available Monday through Friday.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(229, 9, 20, 0.15)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Email Inquiries</div>
                  <div style={{ fontWeight: 600, color: "#fff", marginTop: "0.2rem" }}>support@filmvora.com</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>licensing@filmvora.com</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(0, 210, 255, 0.15)",
                    color: "var(--accent-cyan)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Headquarters</div>
                  <div style={{ fontWeight: 600, color: "#fff", marginTop: "0.2rem" }}>Filmvora Streaming Labs</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>San Francisco, CA & London, UK</div>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--border-subtle)",
                  paddingTop: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                }}
              >
                <ShieldCheck size={18} color="var(--accent-emerald)" />
                <span>DMCA complaints are answered within 24 hours.</span>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div>
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "2rem",
              }}
            >
              {submitted ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <CheckCircle2 size={54} color="var(--accent-emerald)" style={{ margin: "0 auto 1.25rem" }} />
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    Thank You, {name}!
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    We have received your message regarding <strong>{subject || "your inquiry"}</strong>. A representative from our team will email you at <strong>{email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setSubject("");
                      setMessage("");
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="contact-name-email">
                    <div className="form-group">
                      <label className="form-label">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Elena Vance"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="elena@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Inquiry Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="form-select"
                    >
                      <option value="general">General Platform Inquiry</option>
                      <option value="submissions">Content / Filmmaker Submission</option>
                      <option value="licensing">Licensing & Commercial Partnership</option>
                      <option value="copyright">Copyright / DMCA Notice</option>
                      <option value="technical">Streaming / Technical Bug Report</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="Brief topic summary"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message Details</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Provide all relevant details regarding your inquiry..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="form-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "0.5rem", padding: "0.85rem" }}
                  >
                    <Send size={16} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
