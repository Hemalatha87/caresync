import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import {
  User, Camera, Trash2, CheckCircle2, AlertCircle, Sparkles,
  MapPin, Phone, Mail, Calendar, Stethoscope, Award, DollarSign,
  Building2, Video, Globe, Shield, Clock, Plus, X, UploadCloud,
  ChevronRight, Save, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400';
const DEFAULT_DOCTOR_AVATAR = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400';

const SPECIALIZATIONS = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Neurologist',
  'Orthopedic',
  'Gynecologist',
  'Dentist',
  'ENT Specialist',
  'Ophthalmologist',
  'Psychiatrist'
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [toast, setToast] = useState(null);

  // Common Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('unspecified');
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState('');

  // Patient Specific Form State
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Doctor Specific Form State
  const [specialization, setSpecialization] = useState('General Physician');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState(1);
  const [consultationFee, setConsultationFee] = useState(500);
  const [consultationType, setConsultationType] = useState('Both');
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicCity, setClinicCity] = useState('');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState('English, Telugu, Hindi');
  const [isVerified, setIsVerified] = useState(true);
  const [availability, setAvailability] = useState([]);
  const [patientAgeGroups, setPatientAgeGroups] = useState(['adults', 'seniors']);

  // Photo upload modal / preview state
  const [previewPhotoModal, setPreviewPhotoModal] = useState(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState('');
  const [uploadError, setUploadError] = useState('');

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getProfile();
      if (res.data?.success && res.data.user) {
        const u = res.data.user;
        setName(u.name || '');
        setEmail(u.email || '');
        setPhone(u.phone || '');
        setGender(u.gender || 'unspecified');
        setDob(u.dob || '');
        setLocation(u.location || '');
        setAddress(u.address || '');
        setAvatar(u.profileImage || u.avatar || '');
        setBloodGroup(u.bloodGroup || '');
        setEmergencyContact(u.emergencyContact || '');

        if (u.doctorProfile) {
          const doc = u.doctorProfile;
          setSpecialization(doc.specialization || 'General Physician');
          setQualification(doc.qualification || '');
          setExperience(doc.experience || 1);
          setConsultationFee(doc.consultationFee || 500);
          setConsultationType(doc.consultationType || 'Both');
          setClinicName(doc.clinic?.name || '');
          setClinicAddress(doc.clinic?.address || '');
          setClinicCity(doc.clinic?.city || '');
          setBio(doc.bio || '');
          setLanguages(doc.languages || 'English, Telugu, Hindi');
          setIsVerified(doc.isVerified !== undefined ? doc.isVerified : true);
          setAvailability(doc.availability || []);
          if (doc.patientAgeGroups && Array.isArray(doc.patientAgeGroups)) {
            setPatientAgeGroups(doc.patientAgeGroups);
          } else {
            setPatientAgeGroups(doc.specialization === 'Pediatrician' ? ['kids'] : ['adults', 'seniors']);
          }
        }

        // Sync with AuthContext
        updateUser(u);
      }
    } catch (err) {
      console.error('Error fetching profile', err);
      showToast('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Photo Selection
  const handleFileChange = (e) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError('Please select a valid image file (JPG, JPEG, PNG, or WEBP).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image file is too large. Maximum allowed size is 5MB.');
      return;
    }

    setSelectedPhotoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewPhotoUrl(objectUrl);
    setPreviewPhotoModal(true);
  };

  // Save Uploaded Photo
  const handleConfirmPhotoUpload = async () => {
    if (!selectedPhotoFile) return;
    setUploadingPhoto(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedPhotoFile);

      const res = await userAPI.uploadProfileImage(formData);
      if (res.data?.success) {
        const newImgUrl = res.data.profileImage;
        setAvatar(newImgUrl);
        updateUser({ avatar: newImgUrl, profileImage: newImgUrl });
        showToast('Profile photo updated successfully!');
        setPreviewPhotoModal(false);
        setSelectedPhotoFile(null);
        if (previewPhotoUrl) URL.revokeObjectURL(previewPhotoUrl);
      }
    } catch (err) {
      console.error('Photo upload error', err);
      setUploadError(err.response?.data?.message || 'Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Remove Photo
  const handleRemovePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;
    setUploadingPhoto(true);
    try {
      const res = await userAPI.removeProfileImage();
      if (res.data?.success) {
        setAvatar('');
        updateUser({ avatar: '', profileImage: '' });
        showToast('Profile picture removed.');
      }
    } catch (err) {
      console.error('Remove photo error', err);
      showToast('Failed to remove photo', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Save Complete Profile Details
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const userPayload = {
        name,
        phone,
        gender,
        dob,
        location,
        address,
        bloodGroup,
        emergencyContact,
        avatar,
        profileImage: avatar,
      };

      const res = await userAPI.updateProfile(userPayload);
      if (res.data?.success) {
        updateUser(res.data.user);

        // If Doctor, also save professional doctor details
        if (user?.role === 'doctor') {
          const docPayload = {
            specialization,
            qualification,
            experience: Number(experience),
            consultationFee: Number(consultationFee),
            consultationType,
            clinicName,
            clinicAddress,
            city: clinicCity || location,
            location: location || (clinicCity ? `${clinicCity}, Andhra Pradesh` : 'Guntur, Andhra Pradesh'),
            bio,
            languages,
            availability,
            patientAgeGroups,
          };
          await userAPI.updateDoctorProfile(docPayload);
        }

        showToast('Profile saved successfully in database!');
      }
    } catch (err) {
      console.error('Profile update error', err);
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const role = user?.role || 'patient';
  const displayAvatar = avatar || (role === 'doctor' ? DEFAULT_DOCTOR_AVATAR : DEFAULT_AVATAR);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080E1E] pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toast Feedback */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2.5 backdrop-blur-md ${
                toastMessage.type === 'error'
                  ? 'bg-rose-50/95 dark:bg-rose-950/90 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800'
                  : 'bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
              }`}
            >
              {toastMessage.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              <span>{toastMessage.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden File Input for Image Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
        />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Healthcare Account</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {role === 'doctor' ? 'Doctor Profile & Clinical Settings' : role === 'admin' ? 'Super Admin Profile' : 'My Patient Profile'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage your personal information, profile photo, and role configurations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchProfile}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
              <span>Reload</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleSaveProfile}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </div>

        {/* Profile Card Header Banner */}
        <div className="bg-white dark:bg-[#111B33] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-500/10 dark:from-cyan-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar Photo with Hover Upload Action */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800">
                <img
                  src={displayAvatar}
                  alt={name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Upload overlay trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Change Profile Photo"
                className="absolute inset-0 rounded-3xl bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs cursor-pointer"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">Change Photo</span>
              </button>
            </div>

            {/* User Meta Information */}
            <div className="text-center sm:text-left flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{name || 'User Profile'}</h2>
                <span className="px-3 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-cyan-400 text-xs font-bold uppercase border border-brand-200 dark:border-brand-900/60">
                  {role}
                </span>

                {role === 'doctor' && (
                  isVerified ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-1 border border-amber-200 dark:border-amber-800/60">
                      <Clock className="w-3.5 h-3.5" /> Verification Pending
                    </span>
                  )
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
                <span>{email}</span>
                {phone && (
                  <>
                    <span className="mx-1">•</span>
                    <Phone className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{phone}</span>
                  </>
                )}
              </p>

              {role === 'doctor' && (
                <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
                    {specialization}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-cyan-500" />
                    {experience} Yrs Experience
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {location || 'Andhra Pradesh'}
                  </span>
                </div>
              )}

              {/* Photo Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-50 dark:bg-slate-800 hover:bg-brand-100 dark:hover:bg-slate-700 text-brand-700 dark:text-cyan-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>

                {avatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form Details */}
        <form onSubmit={handleSaveProfile} className="space-y-8">
          
          {/* 1. Common Personal Information Section */}
          <div className="bg-white dark:bg-[#111B33] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <User className="w-5 h-5 text-brand-600 dark:text-cyan-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Ravi Kumar or Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400 text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98480 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
                >
                  <option value="unspecified">Unspecified</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">City / Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Guntur, Vijayawada, Hyderabad"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 402, Gandhi Nagar, Guntur, Andhra Pradesh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* 2. Patient Specific Healthcare Fields */}
          {role === 'patient' && (
            <div className="bg-white dark:bg-[#111B33] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Shield className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Patient Emergency & Health Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="">Select Blood Group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Emergency Contact Number</label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="e.g. +91 94401 23456 (Spouse/Parent)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Doctor Specific Professional Details */}
          {role === 'doctor' && (
            <div className="bg-white dark:bg-[#111B33] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Stethoscope className="w-5 h-5 text-brand-600 dark:text-cyan-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Doctor Professional & Clinical Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Specialization</label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
                  >
                    {SPECIALIZATIONS.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Qualification</label>
                  <input
                    type="text"
                    required
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. MBBS, MD Dermatology, Board Certified"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Consultation Format</label>
                  <select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Both">Both In-Clinic & Video Consultation</option>
                    <option value="In-Clinic">In-Clinic Consultation Only</option>
                    <option value="Video Consultation">HD Video Consultation Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Spoken Languages</label>
                  <input
                    type="text"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="e.g. English, Telugu, Hindi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Clinic / Hospital Name</label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="e.g. Aesthetic Skin & Laser Clinic"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Clinic City</label>
                  <input
                    type="text"
                    value={clinicCity}
                    onChange={(e) => setClinicCity(e.target.value)}
                    placeholder="e.g. Guntur, Tenali, Hyderabad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Clinic Street Address</label>
                  <input
                    type="text"
                    value={clinicAddress}
                    onChange={(e) => setClinicAddress(e.target.value)}
                    placeholder="e.g. Gandhi Road, Main Bazar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Who do you provide care for? (Patient Age Groups)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'kids', label: 'Kids Care', age: '0–17 Years', emoji: '👶' },
                      { id: 'adults', label: 'Adult Care', age: '18–59 Years', emoji: '🧑' },
                      { id: 'seniors', label: 'Senior Care', age: '60+ Years', emoji: '👴' },
                    ].map((ag) => {
                      const isChecked = patientAgeGroups.includes(ag.id);
                      return (
                        <label
                          key={ag.id}
                          className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-brand-50/80 dark:bg-brand-950/40 border-brand-300 dark:border-cyan-500/50 text-slate-900 dark:text-white shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setPatientAgeGroups(patientAgeGroups.filter((g) => g !== ag.id));
                              } else {
                                setPatientAgeGroups([...patientAgeGroups, ag.id]);
                              }
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                          />
                          <span className="text-lg">{ag.emoji}</span>
                          <div>
                            <p className="text-xs font-bold">{ag.label}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">{ag.age}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Professional Bio</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your medical expertise, special procedures, and philosophy of care..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-600 dark:focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save Profile Button Bottom */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 text-white font-bold text-sm shadow-lg shadow-brand-600/25 hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes to MongoDB...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

        {/* Photo Upload & Preview Modal */}
        <AnimatePresence>
          {previewPhotoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPreviewPhotoModal(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white dark:bg-[#111B33] rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl max-w-sm w-full z-10 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Profile Photo Preview</h3>
                  <button
                    onClick={() => setPreviewPhotoModal(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="w-40 h-40 mx-auto rounded-3xl overflow-hidden border-4 border-brand-500 shadow-lg bg-slate-100 dark:bg-slate-800">
                  <img
                    src={previewPhotoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {uploadError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold text-center">{uploadError}</p>
                )}

                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                  This photo will be saved to your profile and displayed across CareSync doctor cards and dashboards.
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    disabled={uploadingPhoto}
                    onClick={() => setPreviewPhotoModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={uploadingPhoto}
                    onClick={handleConfirmPhotoUpload}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md"
                  >
                    {uploadingPhoto ? 'Uploading to Server...' : 'Confirm & Upload'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
