import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/DonorScheduling.css";

const CENTERS = [
  {
    id: "civil-bhavnagar",
    name: "Civil Hospital Blood Bank",
    city: "Bhavnagar",
    address: "Jail Road, Bhavnagar",
  },
  {
    id: "sardar-hospital",
    name: "Sardar Hospital Blood Bank",
    city: "Botad",
    address: "Station Road, Botad",
  },
  {
    id: "redcross-bhavnagar",
    name: "Red Cross Society",
    city: "Bhavnagar",
    address: "Ghogha Circle, Bhavnagar",
  },
];

const TIME_SLOTS = [
  { id: "9-10", label: "9:00 AM – 10:00 AM" },
  { id: "10-11", label: "10:00 AM – 11:00 AM" },
  { id: "11-12", label: "11:00 AM – 12:00 PM" },
  { id: "14-15", label: "2:00 PM – 3:00 PM" },
  { id: "15-16", label: "3:00 PM – 4:00 PM" },
  { id: "16-17", label: "4:00 PM – 5:00 PM" },
];

// Simulated already-booked slots per date+center, so the UI has something
// to disable/show as full — replace with real availability from your API.
const BOOKED = {
  "civil-bhavnagar|9-10": true,
  "civil-bhavnagar|11-12": true,
  "sardar-hospital|14-15": true,
};

const getNextNDays = (n) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
};

const formatDateLabel = (date) =>
  date.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });

const toISODate = (date) => date.toISOString().split("T")[0];

const DonorScheduling = () => {
  const navigate = useNavigate();
  const upcomingDays = useMemo(() => getNextNDays(14), []);

  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const lastDonationDate = new Date("2026-06-12");
  const daysSinceLastDonation = Math.floor(
    (new Date() - lastDonationDate) / (1000 * 60 * 60 * 24)
  );
  const isEligible = daysSinceLastDonation >= 90;
  const nextEligibleDate = new Date(lastDonationDate);
  nextEligibleDate.setDate(nextEligibleDate.getDate() + 90);

  const isSlotBooked = (centerId, slotId) =>
    Boolean(BOOKED[`${centerId}|${slotId}`]);

  const validate = () => {
    const newErrors = {};
    if (!selectedCenter) newErrors.center = "Please select a donation center.";
    if (!selectedDate) newErrors.date = "Please select a date.";
    if (!selectedSlot) newErrors.slot = "Please select a time slot.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!isEligible) return;
    if (!validate()) return;

    try {
      setSubmitting(true);
      // Replace with real API call, e.g.
      // await axios.post("/api/appointments", {
      //   centerId: selectedCenter.id,
      //   date: toISODate(selectedDate),
      //   slotId: selectedSlot.id,
      //   notes,
      // });
      await new Promise((resolve) => setTimeout(resolve, 900));
      setConfirmed(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="scheduling-page py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="confirm-card text-center">
                <div className="confirm-icon">✅</div>
                <h3 className="mt-3 mb-2">Appointment Scheduled</h3>
                <p className="text-muted mb-4">
                  Your donation appointment has been booked. A confirmation
                  will be sent to your registered contact details.
                </p>

                <div className="confirm-details text-start">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Center</span>
                    <span className="fw-semibold">{selectedCenter.name}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Date</span>
                    <span className="fw-semibold">
                      {formatDateLabel(selectedDate)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-0">
                    <span className="text-muted">Time</span>
                    <span className="fw-semibold">{selectedSlot.label}</span>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <Link to="/" className="btn btn-outline-gold flex-grow-1">
                    Back to Home
                  </Link>
                  <button
                    className="btn btn-gold flex-grow-1"
                    onClick={() => navigate("/history")}
                  >
                    View History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scheduling-page py-5">
      <div className="container">
        <div className="scheduling-header text-center mb-4">
          <span className="badge scheduling-badge mb-2">Book a Donation</span>
          <h2 className="mb-1">
            Schedule Your <span className="text-gold">Blood Donation</span>
          </h2>
          <p className="text-muted mb-0">
            Pick a center, date and time that works for you.
          </p>
        </div>

        {/* Eligibility banner */}
        <div className="row justify-content-center mb-4">
          <div className="col-lg-9">
            {isEligible ? (
              <div className="eligibility-banner eligible">
                <span className="fs-4">✅</span>
                <div>
                  <p className="mb-0 fw-bold">You're eligible to donate</p>
                  <small className="text-muted">
                    Last donation was {daysSinceLastDonation} days ago
                  </small>
                </div>
              </div>
            ) : (
              <div className="eligibility-banner not-eligible">
                <span className="fs-4">⏳</span>
                <div>
                  <p className="mb-0 fw-bold">Not yet eligible</p>
                  <small className="text-muted">
                    You can donate again on{" "}
                    {nextEligibleDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    (90 days between donations)
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>

        <fieldset disabled={!isEligible} className="scheduling-fieldset">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              {/* Step 1: Center */}
              <div className="scheduling-card mb-4">
                <h6 className="section-label">1. Choose a Donation Center</h6>
                <div className="row g-3">
                  {CENTERS.map((center) => (
                    <div className="col-md-4" key={center.id}>
                      <button
                        type="button"
                        className={
                          "center-option w-100" +
                          (selectedCenter?.id === center.id ? " selected" : "")
                        }
                        onClick={() => {
                          setSelectedCenter(center);
                          setSelectedSlot(null);
                          setErrors((prev) => ({ ...prev, center: "" }));
                        }}
                      >
                        <p className="center-name mb-1">{center.name}</p>
                        <p className="center-address mb-0">
                          📍 {center.address}
                        </p>
                      </button>
                    </div>
                  ))}
                </div>
                {errors.center && (
                  <div className="text-danger small mt-2">{errors.center}</div>
                )}
              </div>

              {/* Step 2: Date */}
              <div className="scheduling-card mb-4">
                <h6 className="section-label">2. Choose a Date</h6>
                <div className="date-scroll">
                  {upcomingDays.map((date) => (
                    <button
                      type="button"
                      key={toISODate(date)}
                      className={
                        "date-chip" +
                        (selectedDate && toISODate(selectedDate) === toISODate(date)
                          ? " selected"
                          : "")
                      }
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                        setErrors((prev) => ({ ...prev, date: "" }));
                      }}
                    >
                      <span className="date-day">
                        {date.toLocaleDateString("en-GB", { weekday: "short" })}
                      </span>
                      <span className="date-num">{date.getDate()}</span>
                      <span className="date-month">
                        {date.toLocaleDateString("en-GB", { month: "short" })}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.date && (
                  <div className="text-danger small mt-2">{errors.date}</div>
                )}
              </div>

              {/* Step 3: Time slot */}
              <div className="scheduling-card mb-4">
                <h6 className="section-label">3. Choose a Time Slot</h6>
                {!selectedCenter || !selectedDate ? (
                  <p className="text-muted small mb-0">
                    Select a center and date first to see available slots.
                  </p>
                ) : (
                  <div className="row g-2">
                    {TIME_SLOTS.map((slot) => {
                      const booked = isSlotBooked(selectedCenter.id, slot.id);
                      return (
                        <div className="col-6 col-md-4" key={slot.id}>
                          <button
                            type="button"
                            className={
                              "slot-option w-100" +
                              (selectedSlot?.id === slot.id ? " selected" : "") +
                              (booked ? " booked" : "")
                            }
                            disabled={booked}
                            onClick={() => {
                              setSelectedSlot(slot);
                              setErrors((prev) => ({ ...prev, slot: "" }));
                            }}
                          >
                            {slot.label}
                            {booked && (
                              <span className="slot-full-tag">Full</span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {errors.slot && (
                  <div className="text-danger small mt-2">{errors.slot}</div>
                )}
              </div>

              {/* Notes */}
              <div className="scheduling-card mb-4">
                <h6 className="section-label">
                  Notes <span className="text-muted">(optional)</span>
                </h6>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Any health notes the center should know about..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Summary + confirm */}
              <div className="scheduling-card summary-card">
                <div className="row align-items-center g-3">
                  <div className="col-md-8">
                    <p className="text-muted small mb-1">Appointment Summary</p>
                    <p className="mb-0 fw-semibold">
                      {selectedCenter ? selectedCenter.name : "—"}
                      {selectedDate && ` · ${formatDateLabel(selectedDate)}`}
                      {selectedSlot && ` · ${selectedSlot.label}`}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <button
                      type="button"
                      className="btn btn-gold btn-lg w-100"
                      onClick={handleConfirm}
                      disabled={submitting}
                    >
                      {submitting ? "Booking..." : "Confirm Appointment"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default DonorScheduling;