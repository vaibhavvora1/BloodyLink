import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ProfileForm from '../../components/profile/ProfileForm';
import StockSkeleton from '../../components/stock/StockSkeleton';

const patientFieldsConfig = [
  { name: 'name', label: 'Full Name', required: true, placeholder: 'Patient or Guardian Name' },
  { name: 'email', label: 'Email Address', readOnly: true },
  { name: 'phone', label: 'Phone Number', required: true, placeholder: '+91 9876543210' },
  {
    name: 'bloodGroup',
    label: 'Blood Group Required',
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
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { name: 'hospital', label: 'Primary Admitted Hospital', required: true, placeholder: 'e.g. Lilavati Hospital' },
  { name: 'emergencyContact', label: 'Emergency Contact Number', placeholder: '+91 9876543211' },
  { name: 'city', label: 'City', required: true, placeholder: 'City' },
  { name: 'address', label: 'Residential Address', col: 'col-12', placeholder: 'Address details' }
];

export default function PatientProfile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.getPatientProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const validate = (formData) => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = 'Full name is required.';
    if (!formData.phone || !/^\+?[0-9 ()-]{7,20}$/.test(formData.phone)) errs.phone = 'Valid phone number required.';
    if (!formData.city?.trim()) errs.city = 'City is required.';
    if (!formData.hospital?.trim()) errs.hospital = 'Hospital name is required.';
    if (formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
      errs.dateOfBirth = 'Date of birth cannot be in the future.';
    }
    if (formData.emergencyContact && !/^\+?[0-9 ()-]{7,20}$/.test(formData.emergencyContact)) {
      errs.emergencyContact = 'Valid emergency contact number required.';
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

      const res = await api.updatePatientProfile(payload);
      setProfile(res.data);
      updateUser({ name: res.data.name, bloodGroup: res.data.bloodGroup, city: res.data.city });
      toast.success('Patient profile updated successfully.');
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
        title="Patient Profile & Medical Contact"
        subtitle="Maintain current emergency contact and hospital details for blood requisition"
        initialData={profile}
        fieldsConfig={patientFieldsConfig}
        onSave={handleSave}
        isSaving={isSaving}
        validate={validate}
      />
    </div>
  );
}
