import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Review from '../models/Review.js';

dotenv.config({ path: './.env' });

export const seedCareSyncData = async () => {
  // Clear existing collections
  await User.deleteMany({});
  await Doctor.deleteMany({});
  await Appointment.deleteMany({});
  await Review.deleteMany({});

  console.log('[Seeder] Cleared old database records.');

  // 1. Create Preset Admin
  const adminUser = await User.create({
    name: 'CareSync Admin',
    email: 'admin@caresync.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1 (555) 019-2831',
  });

  // 2. Create Preset Patient
  const patientUser = await User.create({
    name: 'Sarah Jenkins',
    email: 'patient@caresync.com',
    password: 'patient123',
    role: 'patient',
    phone: '+1 (555) 392-1049',
    gender: 'female',
    address: '742 Evergreen Terrace, Springfield',
  });

  // 3. Create Doctor Users & Doctor Profiles (including Tenali & top specialties)
  const doctorSeeds = [
    {
      name: 'Dr. Elena Rostova',
      email: 'doctor@caresync.com', // Demo doctor login
      password: 'doctor123',
      specialization: 'Dermatologist',
      qualification: 'MD, Board Certified Dermatologist',
      experience: 9,
      consultationFee: 700,
      gender: 'Female',
      consultationType: 'Both',
      rating: 4.9,
      reviewsCount: 142,
      clinic: { name: 'Aesthetic Skin & Laser Clinic', address: 'Gandhi Road, Main Bazar', city: 'Tenali' },
      location: 'Tenali, Andhra Pradesh',
      bio: 'Renowned clinical dermatologist specializing in acne management, skin laser therapy, pigmentation treatments, and cosmetic wellness.',
      image: 'https://images.unsplash.com/photo-1594824813566-88855ce78c80?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Today, 10:30 AM',
    },
    {
      name: 'Dr. Alexander Wright',
      email: 'alexander.wright@caresync.com',
      password: 'doctor123',
      specialization: 'Cardiologist',
      qualification: 'MD, FACC - Harvard Medical School',
      experience: 14,
      consultationFee: 1200,
      gender: 'Male',
      consultationType: 'In-Clinic',
      rating: 4.95,
      reviewsCount: 188,
      clinic: { name: 'Apollo Heart & Vascular Institute', address: 'Banjara Hills Road No 2', city: 'Hyderabad' },
      location: 'Hyderabad, Telangana',
      bio: 'Senior consultant interventional cardiologist specializing in preventive cardiology, echocardiography, and complex coronary care.',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Tomorrow, 09:00 AM',
    },
    {
      name: 'Dr. Marcus Vance',
      email: 'marcus.vance@caresync.com',
      password: 'doctor123',
      specialization: 'Neurologist',
      qualification: 'MD, PhD Neuroscience - Johns Hopkins',
      experience: 18,
      consultationFee: 1500,
      gender: 'Male',
      consultationType: 'Both',
      rating: 4.95,
      reviewsCount: 156,
      clinic: { name: 'Brain & Spine Super Specialty Clinic', address: '1200 Innovation Blvd', city: 'Bangalore' },
      location: 'Bangalore, Karnataka',
      bio: 'Pioneer in headache medicine, movement disorders, neuro-imaging, and neurodegenerative disease management.',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'This Week, 02:00 PM',
    },
    {
      name: 'Dr. Sophia Patel',
      email: 'sophia.patel@caresync.com',
      password: 'doctor123',
      specialization: 'Pediatrician',
      qualification: 'MD Pediatrics, FAAP',
      experience: 11,
      consultationFee: 600,
      gender: 'Female',
      consultationType: 'Both',
      rating: 4.88,
      reviewsCount: 210,
      clinic: { name: 'Sunshine Kids Care & Vaccination Center', address: 'Governorpet', city: 'Vijayawada' },
      location: 'Vijayawada, Andhra Pradesh',
      bio: 'Compassionate pediatric specialist caring for infants, children, and adolescents focusing on growth development and immunization.',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Today, 03:00 PM',
    },
    {
      name: 'Dr. Robert Chen',
      email: 'robert.chen@caresync.com',
      password: 'doctor123',
      specialization: 'Orthopedic',
      qualification: 'MS Orthopedics, Fellowship Sports Medicine',
      experience: 15,
      consultationFee: 900,
      gender: 'Male',
      consultationType: 'In-Clinic',
      rating: 4.85,
      reviewsCount: 112,
      clinic: { name: 'Apex Joint & Spine Hospital', address: 'Kothapet', city: 'Guntur' },
      location: 'Guntur, Andhra Pradesh',
      bio: 'Specialist in arthroscopic joint surgery, knee/hip replacements, and sports injury rehabilitation.',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Tomorrow, 11:30 AM',
    },
    {
      name: 'Dr. Amara Lawson',
      email: 'amara.lawson@caresync.com',
      password: 'doctor123',
      specialization: 'General Physician',
      qualification: 'MBBS, MD Internal Medicine',
      experience: 8,
      consultationFee: 500,
      gender: 'Female',
      consultationType: 'Both',
      rating: 4.75,
      reviewsCount: 88,
      clinic: { name: 'CareSync Primary Wellness Center', address: 'Station Road', city: 'Tenali' },
      location: 'Tenali, Andhra Pradesh',
      bio: 'Primary care specialist dedicated to lifestyle medicine, chronic illness prevention, fever management, and wellness.',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Today, 05:00 PM',
    },
    {
      name: 'Dr. Victoria Sterling',
      email: 'victoria.sterling@caresync.com',
      password: 'doctor123',
      specialization: 'Gynecologist',
      qualification: 'MD, FACOG Obstetrics & Gynecology',
      experience: 13,
      consultationFee: 800,
      gender: 'Female',
      consultationType: 'Both',
      rating: 4.92,
      reviewsCount: 140,
      clinic: { name: 'Womens Health & Maternity Suite', address: 'Jubilee Hills', city: 'Hyderabad' },
      location: 'Hyderabad, Telangana',
      bio: 'Dedicated to complete womens health, reproductive medicine, laparoscopic surgery, prenatal care, and postnatal wellness.',
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Tomorrow, 02:00 PM',
    },
    {
      name: 'Dr. David Miller',
      email: 'david.miller@caresync.com',
      password: 'doctor123',
      specialization: 'Dentist',
      qualification: 'DDS, Cosmetic & Restorative Dentistry',
      experience: 10,
      consultationFee: 650,
      gender: 'Male',
      consultationType: 'In-Clinic',
      rating: 4.8,
      reviewsCount: 96,
      clinic: { name: 'SmileCraft Dental Studio', address: 'MG Road', city: 'Vijayawada' },
      location: 'Vijayawada, Andhra Pradesh',
      bio: 'Expert in pain-free dental implants, smile design, root canal therapy, teeth whitening, and preventive oral health.',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Today, 04:00 PM',
    },
    {
      name: 'Dr. Rajesh Sharma',
      email: 'rajesh.sharma@caresync.com',
      password: 'doctor123',
      specialization: 'ENT Specialist',
      qualification: 'MS ENT, DNB Otorhinolaryngology',
      experience: 12,
      consultationFee: 750,
      gender: 'Male',
      consultationType: 'Both',
      rating: 4.85,
      reviewsCount: 78,
      clinic: { name: 'Ear, Nose & Throat Advanced Clinic', address: 'Arundelpet', city: 'Guntur' },
      location: 'Guntur, Andhra Pradesh',
      bio: 'Specialist in sinus endoscopy, hearing restoration, tonsillitis treatment, and microsurgery of the ear and voice.',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Tomorrow, 10:00 AM',
    },
    {
      name: 'Dr. Ananya Reddy',
      email: 'ananya.reddy@caresync.com',
      password: 'doctor123',
      specialization: 'Ophthalmologist',
      qualification: 'MS Ophthalmology, Cornea Fellowship',
      experience: 10,
      consultationFee: 700,
      gender: 'Female',
      consultationType: 'In-Clinic',
      rating: 4.9,
      reviewsCount: 105,
      clinic: { name: 'Vision First Eye Hospital', address: 'Brodipet', city: 'Guntur' },
      location: 'Guntur, Andhra Pradesh',
      bio: 'Advanced cataract laser surgery, LASIK vision correction, dry eye therapy, and diabetic retinopathy screening.',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Today, 02:30 PM',
    },
    {
      name: 'Dr. Vikram Malhotra',
      email: 'vikram.malhotra@caresync.com',
      password: 'doctor123',
      specialization: 'Psychiatrist',
      qualification: 'MD Psychiatry, Neuropsychiatry Diploma',
      experience: 16,
      consultationFee: 1100,
      gender: 'Male',
      consultationType: 'Video Consultation',
      rating: 4.93,
      reviewsCount: 134,
      clinic: { name: 'MindCare Behavioral Health Clinic', address: 'Hitec City', city: 'Hyderabad' },
      location: 'Hyderabad, Telangana',
      bio: 'Specializing in anxiety, depression, stress management, adult ADHD, sleep disorders, and cognitive behavioral therapy.',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Today, 06:00 PM',
    }
  ];

  const createdDoctors = [];

  for (const docData of doctorSeeds) {
    const docUser = await User.create({
      name: docData.name,
      email: docData.email,
      password: docData.password,
      role: 'doctor',
      phone: '+1 (555) ' + Math.floor(1000000 + Math.random() * 9000000),
      avatar: docData.image,
    });

    const doctorProfile = await Doctor.create({
      user: docUser._id,
      name: docData.name,
      specialization: docData.specialization,
      qualification: docData.qualification,
      experience: docData.experience,
      consultationFee: docData.consultationFee,
      gender: docData.gender,
      consultationType: docData.consultationType,
      rating: docData.rating,
      reviewsCount: docData.reviewsCount,
      clinic: docData.clinic,
      location: docData.location,
      bio: docData.bio,
      image: docData.image,
      nextAvailableSlot: docData.nextAvailableSlot,
      isVerified: true,
      availability: [
        {
          day: 'Monday',
          slots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM', '05:30 PM'],
        },
        {
          day: 'Tuesday',
          slots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:30 PM', '05:00 PM'],
        },
        {
          day: 'Wednesday',
          slots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM', '05:30 PM'],
        },
        {
          day: 'Thursday',
          slots: ['10:00 AM', '11:30 AM', '03:00 PM', '05:00 PM'],
        },
        {
          day: 'Friday',
          slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'],
        },
        {
          day: 'Saturday',
          slots: ['10:00 AM', '12:00 PM', '02:30 PM'],
        }
      ],
    });

    createdDoctors.push(doctorProfile);
  }

  // 4. Create Sample Appointments with unique bookingId
  const sampleAppointments = [
    {
      bookingId: 'CS-20260925-00125',
      patient: patientUser._id,
      doctor: createdDoctors[0]._id, // Dr. Elena Rostova
      patientName: patientUser.name,
      patientEmail: patientUser.email,
      patientPhone: patientUser.phone,
      date: '2026-09-25',
      timeSlot: '10:30 AM',
      consultationType: 'Video Consultation',
      status: 'CONFIRMED',
      reason: 'Acne Evaluation and Skin Glow Treatment',
      amount: createdDoctors[0].consultationFee,
      fee: createdDoctors[0].consultationFee,
      paymentStatus: 'paid',
    },
    {
      bookingId: 'CS-20260928-00126',
      patient: patientUser._id,
      doctor: createdDoctors[1]._id, // Dr. Alexander Wright
      patientName: patientUser.name,
      patientEmail: patientUser.email,
      patientPhone: patientUser.phone,
      date: '2026-09-28',
      timeSlot: '02:00 PM',
      consultationType: 'In-Clinic',
      status: 'PENDING',
      reason: 'Preventive ECG & Blood Pressure Checkup',
      amount: createdDoctors[1].consultationFee,
      fee: createdDoctors[1].consultationFee,
      paymentStatus: 'paid',
    },
    {
      bookingId: 'CS-20260910-00127',
      patient: patientUser._id,
      doctor: createdDoctors[5]._id, // Dr. Amara Lawson
      patientName: patientUser.name,
      patientEmail: patientUser.email,
      patientPhone: patientUser.phone,
      date: '2026-09-10',
      timeSlot: '11:00 AM',
      consultationType: 'In-Clinic',
      status: 'COMPLETED',
      reason: 'Routine Metabolic & Vitamin Deficiency Review',
      amount: createdDoctors[5].consultationFee,
      fee: createdDoctors[5].consultationFee,
      paymentStatus: 'paid',
    },
  ];

  await Appointment.insertMany(sampleAppointments);

  // 5. Create Sample Reviews
  const sampleReviews = [
    {
      patient: patientUser._id,
      doctor: createdDoctors[0]._id,
      patientName: patientUser.name,
      rating: 5,
      comment: 'Dr. Elena Rostova is wonderful! My skin improved dramatically within 2 weeks after her consultation. Highly recommended!',
    },
    {
      patient: patientUser._id,
      doctor: createdDoctors[1]._id,
      patientName: patientUser.name,
      rating: 5,
      comment: 'Dr. Wright is extremely thorough and explained my cardiovascular test results with total clarity.',
    }
  ];

  await Review.insertMany(sampleReviews);

  console.log('====================================================');
  console.log('[Seeder] SUCCESS! CareSync Seed Data Injected.');
  console.log('Preset Login Credentials:');
  console.log('👉 ADMIN:   admin@caresync.com  / admin123');
  console.log('👉 DOCTOR:  doctor@caresync.com / doctor123 (Dr. Elena Rostova in Tenali)');
  console.log('👉 PATIENT: patient@caresync.com / patient123');
  console.log('====================================================');
};

if (process.argv[1] && process.argv[1].includes('seeder.js')) {
  (async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/caresync');
      console.log('[Seeder] Connected to MongoDB...');
      await seedCareSyncData();
      process.exit(0);
    } catch (err) {
      console.error('[Seeder Error]', err);
      process.exit(1);
    }
  })();
}
