import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ProfileForm from '../../components/profile/ProfileForm';
import StockSkeleton from '../../components/stock/StockSkeleton';

const donorFieldsConfig = [
  { name: 'name', label: 'Full Name', required: true, placeholder: 'Full name' },
  { name: 'email', label: 'Email Address', readOnly: true },
  { name: 'phone', label: 'Phone Number', required: true, placeholder: 'Phone number' },
  { name: 'age', label: 'Age', type: 'number', required: true },
  {
    name: 'bloodGroup',
    label: 'Blood Group',
    type: 'select',
    required: true,
    options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => ({ value: g, label: g }))
  },
  {
    name: 'gender',
    label: 'Gender',
    type: 'select',
    required: true,
    options: [
      { value: 'female', label: 'Female' },
      { value: 'male', label: 'Male' },
      { value: 'other', label: 'Other' },
      { value: 'prefer_not_to_say', label: 'Prefer not to say' }
    ]
  },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', help: 'Donors must be between 18 and 65 years old.' },
  { name: 'weight', label: 'Weight (kg)', type: 'number', help: 'Minimum 45 kg required for blood donation.' },
  { name: 'city', label: 'City', required: true, placeholder: 'City' },
  { name: 'address', label: 'Address', col: 'col-12', placeholder: 'Address' },
  { name: 'medicalNotes', label: 'Medical Notes', type: 'textarea', col: 'col-12', placeholder: 'Relevant medical notes' },
  { name: 'isAvailable', label: 'Donation Availability', type: 'checkbox', col: 'col-12', checkboxLabel: 'I am currently available to donate blood when requested' }
];

export default function DonorProfile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.getDonorProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const validate = (formData) => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = 'Full name is required.';
    if (!formData.bloodGroup) errs.bloodGroup = 'Choose a blood group.';
    if (!formData.gender) errs.gender = 'Choose a gender option.';
    if (!formData.phone || !/^\+?[0-9 ()-]{7,20}$/.test(formData.phone)) errs.phone = 'Valid phone number required.';
    if (!formData.city?.trim()) errs.city = 'City is required.';
    if (!Number.isInteger(Number(formData.age)) || Number(formData.age) < 18 || Number(formData.age) > 65) errs.age = 'Donors must be between 18 and 65.';
    if (formData.weight !== undefined && formData.weight !== '' && Number(formData.weight) < 45) {
      errs.weight = 'Weight must be at least 45 kg.';
    }
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob > today) errs.dateOfBirth = 'Date of birth cannot be in the future.';
      else {
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        if (age < 18 || age > 65) errs.dateOfBirth = 'Donors must be between 18 and 65 years old.';
      }
    }
    if (formData.address && formData.address.trim().length < 5) errs.address = 'Address should be at least 5 characters.';
    if ((formData.medicalNotes || '').length > 1000) errs.medicalNotes = 'Medical notes must be 1,000 characters or fewer.';
    return { isValid: Object.keys(errs).length === 0, errs };
  };

  const eligibleAfter = profile?.donationEligibility?.eligibleAfter ? new Date(profile.donationEligibility.eligibleAfter) : null;
  const intervalEligible = profile?.donationEligibility?.eligible !== false;
  const intervalDays = profile?.donationEligibility?.minimumIntervalDays;
  const ageEligible = Number(profile?.age) >= 18 && Number(profile?.age) <= 65;
  const weightEligible = Number(profile?.weight) >= 45;

  const handleSave = async (data) => {
    try {
      setIsSaving(true);
      const payload = { ...data };
      delete payload.email;
      delete payload.role;
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.lastDonationDate;
      delete payload.donationEligibility;

      const res = await api.updateDonorProfile(payload);
      setProfile(res.data);
      updateUser({ name: res.data.name, bloodGroup: res.data.bloodGroup, city: res.data.city });
      toast.success('Donor profile updated successfully.');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="container app-container py-5"><StockSkeleton count={4} /></div>;
  }

  return (
    <div className="container app-container py-4">
      <ProfileForm
        title="Donor Profile & Health Information"
        subtitle="Manage your personal credentials, contact details, and blood donation preferences"
        initialData={profile}
        fieldsConfig={donorFieldsConfig}
        onSave={handleSave}
        isSaving={isSaving}
        validate={validate}
      />
      <div className="premium-card mt-3"><h2 className="h6 fw-bold">Eligibility information</h2><p className="small mb-1">Last completed donation: {profile?.lastDonationDate ? new Date(profile.lastDonationDate).toLocaleDateString() : 'None recorded'}</p><p className="small mb-1">Age: {ageEligible ? 'within the listed 18–65 range' : 'review your age in your profile'} · Weight: {weightEligible ? '45 kg or above' : 'review your weight in your profile'} · Donation interval: {intervalEligible ? (intervalDays ? `${intervalDays}-day interval met` : 'met') : `next date ${eligibleAfter?.toLocaleDateString()}`}</p><p className="small text-muted mb-0">The last donation date is set by the server after an admin marks a donation completed. This guidance does not replace clinical screening.</p></div>
    </div>
  );
}
