import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE = import.meta.env.VITE_ADMIN_API_URL ;

const Membership = () => {
  const [activeTab, setActiveTab] = useState("plans");
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Plan modal
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    planName: "", price: "", discount: "", durationMonths: "", benefits: "", isActive: true
  });

  // Assign modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [plansRes, membersRes, customersRes] = await Promise.all([
        axios.get(`${BASE}/api/membership-plans`),
        axios.get(`${BASE}/api/members`),
        axios.get(`${BASE}/api/customers`)
      ]);
      setPlans(plansRes.data);
      setMembers(membersRes.data);
      setCustomers(customersRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openPlanModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanForm({
        planName: plan.planName,
        price: plan.price,
        discount: plan.discount || 0,
        durationMonths: plan.durationMonths,
        benefits: (plan.benefits || []).join("\n"),
        isActive: plan.isActive
      });
    } else {
      setEditingPlan(null);
      setPlanForm({ planName: "", price: "", discount: "", durationMonths: "", benefits: "", isActive: true });
    }
    setIsPlanModalOpen(true);
  };

  const savePlan = async (e) => {
    e.preventDefault();
    const data = {
      ...planForm,
      price: parseFloat(planForm.price),
      discount: parseFloat(planForm.discount || 0),
      durationMonths: parseInt(planForm.durationMonths),
      benefits: planForm.benefits.split("\n").map(b => b.trim()).filter(Boolean)
    };
    try {
      if (editingPlan) {
        await axios.put(`${BASE}/api/membership-plans/${editingPlan._id}`, data);
      } else {
        await axios.post(`${BASE}/api/membership-plans`, data);
      }
      setIsPlanModalOpen(false);
      fetchAll();
    } catch (err) {
      console.error("Save plan error:", err);
    }
  };

  const deletePlan = async (id) => {
    if (window.confirm("Delete this membership plan?")) {
      await axios.delete(`${BASE}/api/membership-plans/${id}`);
      fetchAll();
    }
  };

  const assignMembership = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE}/api/customers/${selectedCustomer}/activate-membership`, { planId: selectedPlan });
      setIsAssignModalOpen(false);
      fetchAll();
    } catch (err) {
      console.error("Assign error:", err);
    }
  };

  const deactivate = async (customerId) => {
    if (window.confirm("Remove membership from this customer?")) {
      await axios.post(`${BASE}/api/customers/${customerId}/deactivate-membership`);
      fetchAll();
    }
  };

  const getStatusColor = (endDate) => {
    if (!endDate) return "#64748b";
    const today = new Date();
    const end = new Date(endDate);
    const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return "#ef4444";
    if (daysLeft <= 30) return "#f59e0b";
    return "#059669";
  };

  const getDaysLeft = (endDate) => {
    if (!endDate) return "—";
    const days = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Expired";
    return `${days} days left`;
  };

  const tabStyle = (tab) => ({
    padding: "12px 28px", borderRadius: "8px 8px 0 0", border: "none", cursor: "pointer",
    fontWeight: "700", fontSize: "14px", transition: "all 0.2s",
    backgroundColor: activeTab === tab ? "#2563eb" : "transparent",
    color: activeTab === tab ? "#fff" : "#64748b",
    borderBottom: activeTab === tab ? "2px solid #2563eb" : "2px solid transparent"
  });

  return (
    <>
      <div className="main-content-inner">
        <div className="main-content-wrap">
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#1e293b" }}>Membership Management</h3>
              <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: "14px" }}>Manage plans and configurable member discounts</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { setSelectedCustomer(""); setSelectedPlan(""); setIsAssignModalOpen(true); }}
                style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #2563eb", background: "#fff", color: "#2563eb", fontWeight: "700", cursor: "pointer" }}>
                Assign Membership
              </button>
              <button onClick={() => openPlanModal()}
                style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#fff", fontWeight: "700", cursor: "pointer" }}>
                + New Plan
              </button>
            </div>
          </div>

          {/* Chapters and Tabs logic remained essentially the same, just removing manual layout */}
          {/* Tabs */}
          <div style={{ borderBottom: "1px solid #e2e8f0", marginBottom: "30px", display: "flex", gap: "5px" }}>
            <button style={tabStyle("plans")} onClick={() => setActiveTab("plans")}>Plans ({plans.length})</button>
            <button style={tabStyle("members")} onClick={() => setActiveTab("members")}>Active Members ({members.length})</button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>Loading...</div>
          ) : activeTab === "plans" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
              {plans.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                  No plans yet. Create one to get started.
                </div>
              )}
              {plans.map(plan => (
                <div key={plan._id} style={{
                  backgroundColor: "#fff", borderRadius: "16px", padding: "30px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9",
                  position: "relative", overflow: "hidden"
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: plan.isActive ? "linear-gradient(90deg, #2563eb, #7c3aed)" : "#e2e8f0" }}></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h4 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: "800", color: "#1e293b" }}>{plan.planName}</h4>
                      <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "100px", backgroundColor: plan.isActive ? "#dcfce7" : "#f1f5f9", color: plan.isActive ? "#166534" : "#64748b", fontWeight: "600" }}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "28px", fontWeight: "800", color: "#2563eb" }}>₹{plan.price.toLocaleString()}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>{plan.durationMonths} month{plan.durationMonths > 1 ? "s" : ""}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: "20px", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Benefits</div>
                    <div style={{ padding: "10px 15px", backgroundColor: "#eff6ff", borderRadius: "8px", color: "#1e40af", fontSize: "13px", fontWeight: "600", marginBottom: "12px" }}>
                       ✓ {plan.discount || 0}% off on all services
                    </div>
                    {(plan.benefits || []).map((b, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569", marginBottom: "8px" }}>
                        <span style={{ color: "#059669", fontWeight: "700" }}>✓</span> {b}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button onClick={() => openPlanModal(plan)} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#fff", color: "#1e293b", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>Edit</button>
                    <button onClick={() => deletePlan(plan._id)} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "none", background: "#fef2f2", color: "#ef4444", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              {members.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>No active members yet.</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      {["Customer", "Plan", "Start Date", "End Date", "Status", "Actions"].map(h => (
                        <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ fontWeight: "700", color: "#1e293b" }}>{m.name}</div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>{m.phone}</div>
                        </td>
                        <td style={{ padding: "16px 20px", fontSize: "13px", fontWeight: "600", color: "#2563eb" }}>{m.membershipPlanId?.planName || "—"}</td>
                        <td style={{ padding: "16px 20px", fontSize: "13px", color: "#475569" }}>{m.membershipStartDate || "—"}</td>
                        <td style={{ padding: "16px 20px", fontSize: "13px", color: "#475569" }}>{m.membershipEndDate || "—"}</td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ padding: "4px 12px", borderRadius: "100px", backgroundColor: `${getStatusColor(m.membershipEndDate)}20`, color: getStatusColor(m.membershipEndDate), fontSize: "12px", fontWeight: "700" }}>
                            {getDaysLeft(m.membershipEndDate)}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <button onClick={() => deactivate(m._id)} style={{ padding: "6px 14px", borderRadius: "6px", border: "none", background: "#fef2f2", color: "#ef4444", fontWeight: "600", cursor: "pointer", fontSize: "12px" }}>Revoke</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Plan Modal */}
      {isPlanModalOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}>
            <h4 style={{ margin: "0 0 25px", fontSize: "20px", fontWeight: "800", color: "#1e40af" }}>{editingPlan ? "Edit Plan" : "Create New Plan"}</h4>
            <form onSubmit={savePlan}>
              {[
                { label: "PLAN NAME *", name: "planName", type: "text", required: true },
                { label: "PRICE (₹) *", name: "price", type: "number", required: true },
                { label: "DISCOUNT (%) *", name: "discount", type: "number", required: true },
                { label: "DURATION (MONTHS) *", name: "durationMonths", type: "number", required: true },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "8px", letterSpacing: "1px" }}>{f.label}</label>
                  <input type={f.type} value={planForm[f.name]} required={f.required}
                    onChange={e => setPlanForm({ ...planForm, [f.name]: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              ))}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "8px", letterSpacing: "1px" }}>ADDITIONAL BENEFITS (one per line)</label>
                <textarea value={planForm.benefits} onChange={e => setPlanForm({ ...planForm, benefits: e.target.value })}
                  rows={4} placeholder="Priority booking&#10;Free hair wash&#10;Birthday discount"
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="checkbox" id="isActive" checked={planForm.isActive} onChange={e => setPlanForm({ ...planForm, isActive: e.target.checked })} />
                <label htmlFor="isActive" style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>Active (visible to customers)</label>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => setIsPlanModalOpen(false)} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#fff", fontWeight: "800", cursor: "pointer" }}>Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Membership Modal */}
      {isAssignModalOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "450px" }}>
            <h4 style={{ margin: "0 0 25px", fontSize: "20px", fontWeight: "800", color: "#1e40af" }}>Assign Membership</h4>
            <form onSubmit={assignMembership}>
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "8px", letterSpacing: "1px" }}>SELECT CUSTOMER *</label>
                <select value={selectedCustomer} required onChange={e => setSelectedCustomer(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", backgroundColor: "#fff" }}>
                  <option value="">-- Choose Customer --</option>
                  {customers.filter(c => c.membershipStatus !== "Active").map(c => (
                    <option key={c._id} value={c._id}>{c.name} — {c.phone}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "8px", letterSpacing: "1px" }}>SELECT PLAN *</label>
                <select value={selectedPlan} required onChange={e => setSelectedPlan(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", backgroundColor: "#fff" }}>
                  <option value="">-- Choose Plan --</option>
                  {plans.filter(p => p.isActive).map(p => (
                    <option key={p._id} value={p._id}>{p.planName} — ₹{p.price} / {p.durationMonths} mo</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => setIsAssignModalOpen(false)} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#fff", fontWeight: "800", cursor: "pointer" }}>Activate Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Membership;
