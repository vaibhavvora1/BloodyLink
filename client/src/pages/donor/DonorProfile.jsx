import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ProfileForm from '../../components/profile/ProfileForm';
import StockSkeleton from '../../components/stock/StockSkeleton';

const donorFieldsConfig = [
  { name: 'name', label: 'Full Name', required: true, placeholder: 'Full Name' },
  { name: 'email', label: 'Email Address', readOnly: true },
  { name: 'phone', label: 'Phone Number', required: true, placeholder: '+91 9876543210' },
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
  { name: 'address', label: 'Residential Address', col: 'col-12', placeholder: 'Street / Area / Pincode' },
  { name: 'lastDonationDate', label: 'Last Blood Donation Date', type: 'date', help: 'Leave blank if you have not donated blood yet.' },
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
    if (!formData.phone || !/^\+?[0-9 ()-]{7,20}$/.test(formData.phone)) errs.phone = 'Valid phone number required.';
    if (!formData.city?.trim()) errs.city = 'City is required.';
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
    if (formData.lastDonationDate && new Date(formData.lastDonationDate) > new Date()) {
      errs.lastDonationDate = 'Last donation date cannot be in the future.';
    }
    return { isValid: Object.keys(errs).length === 0, errs };
  };

  const handleSave = async (data) => {
    try {
      setIsSaving(true);
      const payload = { ...data };
      delete payload.email;
      delete payload.role;
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;

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
    </div>
  );
}
