import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Review from '../models/Review.js';

dotenv.config({ path: './.env' });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/caresync');
    console.log('[Seeder] Connected to MongoDB...');

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

    // 3. Create Doctor Users & Doctor Profiles
    const doctorSeeds = [
      {
        name: 'Dr. Alexander Wright',
        email: 'doctor@caresync.com', // Demo doctor login
        password: 'doctor123',
        specialization: 'Cardiologist',
        qualification: 'MD, FACC - Harvard Medical School',
        experience: 14,
        consultationFee: 150,
        rating: 4.9,
        reviewsCount: 128,
        clinic: { name: 'Boston Heart & Vascular Institute', address: '450 Medical Center Way', city: 'Boston' },
        bio: 'Board-certified cardiologist specializing in preventive cardiology, echocardiography, and complex coronary care.',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Dr. Elena Rostova',
        email: 'elena.rostova@caresync.com',
        password: 'doctor123',
        specialization: 'Dermatologist',
        qualification: 'MD, Board Certified Dermatologist',
        experience: 9,
        consultationFee: 120,
        rating: 4.8,
        reviewsCount: 94,
        clinic: { name: 'Aesthetic Skin & Laser Center', address: '788 Fifth Avenue', city: 'New York' },
        bio: 'Expert in clinical dermatology, skin cancer screening, laser therapy, and advanced cosmetic skin treatments.',
        image: 'https://images.unsplash.com/photo-1594824813566-88855ce78c80?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Dr. Marcus Vance',
        email: 'marcus.vance@caresync.com',
        password: 'doctor123',
        specialization: 'Neurologist',
        qualification: 'MD, PhD Neuroscience - Johns Hopkins',
        experience: 18,
        consultationFee: 200,
        rating: 4.95,
        reviewsCount: 156,
        clinic: { name: 'Comprehensive Brain & Nerve Care', address: '1200 Innovation Blvd', city: 'San Francisco' },
        bio: 'Pioneer in headache medicine, movement disorders, neuro-imaging, and neurodegenerative disease management.',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Dr. Sophia Patel',
        email: 'sophia.patel@caresync.com',
        password: 'doctor123',
        specialization: 'Pediatrician',
        qualification: 'MD Pediatrics, FAAP',
        experience: 11,
        consultationFee: 95,
        rating: 4.9,
        reviewsCount: 210,
        clinic: { name: 'Sunshine Kids Medical Clinic', address: '302 Parkview Road', city: 'Chicago' },
        bio: 'Compassionate care for infants, children, and adolescents focusing on growth development and immunization.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Dr. Robert Chen',
        email: 'robert.chen@caresync.com',
        password: 'doctor123',
        specialization: 'Orthopedic',
        qualification: 'MS Orthopedics, Fellowship Sports Medicine',
        experience: 15,
        consultationFee: 175,
        rating: 4.85,
        reviewsCount: 112,
        clinic: { name: 'Apex Joint & Spine Hospital', address: '99 Sports Health Plaza', city: 'Dallas' },
        bio: 'Specialist in arthroscopic joint surgery, knee/hip replacements, and sports injury rehabilitation.',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Dr. Amara Lawson',
        email: 'amara.lawson@caresync.com',
        password: 'doctor123',
        specialization: 'General Physician',
        qualification: 'MBBS, MD Internal Medicine',
        experience: 8,
        consultationFee: 80,
        rating: 4.75,
        reviewsCount: 88,
        clinic: { name: 'CareSync Primary Wellness Center', address: '500 Community Way', city: 'Seattle' },
        bio: 'Primary care specialist dedicated to lifestyle medicine, chronic illness prevention, and wellness management.',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Dr. Victoria Sterling',
        email: 'victoria.sterling@caresync.com',
        password: 'doctor123',
        specialization: 'Gynecologist',
        qualification: 'MD, FACOG Obstetrics & Gynecology',
        experience: 13,
        consultationFee: 140,
        rating: 4.9,
        reviewsCount: 140,
        clinic: { name: 'Women\'s Health & Wellness Suite', address: '880 Sunset Blvd', city: 'Los Angeles' },
        bio: 'Dedicated to complete women\'s health, reproductive medicine, laparoscopic surgery, and prenatal care.',
        image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Dr. David Miller',
        email: 'david.miller@caresync.com',
        password: 'doctor123',
        specialization: 'Dentist',
        qualification: 'DDS, Cosmetic & Restorative Dentistry',
        experience: 10,
        consultationFee: 110,
        rating: 4.8,
        reviewsCount: 96,
        clinic: { name: 'SmileCraft Dental Care', address: '14 Peachtree Street', city: 'Atlanta' },
        bio: 'Expert in pain-free dental implants, smile design, teeth whitening, and preventive oral health.',
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400',
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
        rating: docData.rating,
        reviewsCount: docData.reviewsCount,
        clinic: docData.clinic,
        bio: docData.bio,
        image: docData.image,
        isVerified: true,
        availability: [
          { day: 'Monday', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM'] },
          { day: 'Tuesday', slots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:30 PM'] },
          { day: 'Wednesday', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM'] },
          { day: 'Thursday', slots: ['10:00 AM', '11:30 AM', '03:00 PM', '05:00 PM'] },
          { day: 'Friday', slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] }
        ]
      });

      createdDoctors.push(doctorProfile);
    }

    // 4. Create Sample Appointments
    const sampleAppointments = [
      {
        patient: patientUser._id,
        doctor: createdDoctors[0]._id, // Dr. Alexander Wright
        patientName: patientUser.name,
        patientEmail: patientUser.email,
        patientPhone: patientUser.phone,
        date: '2026-09-25',
        timeSlot: '10:30 AM',
        status: 'confirmed',
        reason: 'Annual Cardiovascular Health Checkup',
        amount: createdDoctors[0].consultationFee,
        paymentStatus: 'paid',
      },
      {
        patient: patientUser._id,
        doctor: createdDoctors[1]._id, // Dr. Elena Rostova
        patientName: patientUser.name,
        patientEmail: patientUser.email,
        patientPhone: patientUser.phone,
        date: '2026-09-28',
        timeSlot: '02:00 PM',
        status: 'pending',
        reason: 'Routine Skin Screening & Allergy Consultation',
        amount: createdDoctors[1].consultationFee,
        paymentStatus: 'paid',
      },
      {
        patient: patientUser._id,
        doctor: createdDoctors[5]._id, // Dr. Amara Lawson
        patientName: patientUser.name,
        patientEmail: patientUser.email,
        patientPhone: patientUser.phone,
        date: '2026-09-10',
        timeSlot: '11:00 AM',
        status: 'completed',
        reason: 'General Blood Pressure & Metabolic Review',
        amount: createdDoctors[5].consultationFee,
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
        comment: 'Dr. Wright is extremely thorough and explained my ECG results with complete clarity. Highest recommendation!',
      },
      {
        patient: patientUser._id,
        doctor: createdDoctors[1]._id,
        patientName: patientUser.name,
        rating: 5,
        comment: 'Wonderful experience with Dr. Elena! Very patient and gave me great skin care advice.',
      }
    ];

    await Review.insertMany(sampleReviews);

    console.log('====================================================');
    console.log('[Seeder] SUCCESS! CareSync Seed Data Injected.');
    console.log('Preset Login Credentials:');
    console.log('👉 ADMIN:   admin@caresync.com  / admin123');
    console.log('👉 DOCTOR:  doctor@caresync.com / doctor123');
    console.log('👉 PATIENT: patient@caresync.com / patient123');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]', error);
    process.exit(1);
  }
};

seedData();
