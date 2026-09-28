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
    phone: '+91 98480 12345',
    status: 'active',
    isActive: true,
  });

  // 2. Create Preset Patients
  const patientUser = await User.create({
    name: 'Sarah Jenkins',
    email: 'patient@caresync.com',
    password: 'patient123',
    role: 'patient',
    phone: '+91 98491 56789',
    gender: 'female',
    address: 'Kothapet, Guntur, Andhra Pradesh',
    status: 'active',
    isActive: true,
  });

  const patientUser2 = await User.create({
    name: 'Kavitha Ramesh',
    email: 'kavitha.ramesh@gmail.com',
    password: 'patient123',
    role: 'patient',
    phone: '+91 94401 88990',
    gender: 'female',
    address: 'Banjara Hills, Hyderabad, Telangana',
    status: 'active',
    isActive: true,
  });

  const patientUser3 = await User.create({
    name: 'Suresh Varma',
    email: 'suresh.varma@gmail.com',
    password: 'patient123',
    role: 'patient',
    phone: '+91 99890 22334',
    gender: 'male',
    address: 'Benz Circle, Vijayawada, Andhra Pradesh',
    status: 'active',
    isActive: true,
  });

  const patientUser4 = await User.create({
    name: 'Anil Kumar',
    email: 'anil.kumar@gmail.com',
    password: 'patient123',
    role: 'patient',
    phone: '+91 98660 33445',
    gender: 'male',
    address: 'Hanamkonda, Warangal, Telangana',
    status: 'inactive',
    isActive: false,
  });

  // 3. Create Doctor Users & Doctor Profiles with 100% UNIQUE Images and AP/Telangana Locations
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
      profileImage: 'https://images.unsplash.com/photo-1594824813566-88855ce78c80?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1594824813566-88855ce78c80?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Today, 10:30 AM',
      isVerified: true,
      patientAgeGroups: ['adults', 'seniors'],
    },
    {
      name: 'Dr. Alexander Wright',
      email: 'alexander.wright@caresync.com',
      password: 'doctor123',
      specialization: 'Cardiologist',
      qualification: 'MD, DM Cardiology - Harvard Fellow',
      experience: 14,
      consultationFee: 1200,
      gender: 'Male',
      consultationType: 'In-Clinic',
      rating: 4.95,
      reviewsCount: 188,
      clinic: { name: 'Apollo Heart & Vascular Institute', address: 'Banjara Hills Road No 2', city: 'Hyderabad' },
      location: 'Hyderabad, Telangana',
      bio: 'Senior consultant interventional cardiologist specializing in preventive cardiology, echocardiography, and complex coronary care.',
      profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Tomorrow, 09:00 AM',
      isVerified: true,
      patientAgeGroups: ['adults', 'seniors'],
    },
    {
      name: 'Dr. Marcus Vance',
      email: 'marcus.vance@caresync.com',
      password: 'doctor123',
      specialization: 'Neurologist',
      qualification: 'MD, DM Neurology - NIMHANS',
      experience: 18,
      consultationFee: 1500,
      gender: 'Male',
      consultationType: 'Both',
      rating: 4.95,
      reviewsCount: 156,
      clinic: { name: 'Care Neuro & Spine Center', address: 'Maharanipeta', city: 'Visakhapatnam' },
      location: 'Visakhapatnam, Andhra Pradesh',
      bio: 'Pioneer in headache medicine, movement disorders, neuro-imaging, and neurodegenerative disease management.',
      profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'This Week, 02:00 PM',
      isVerified: true,
      patientAgeGroups: ['adults', 'seniors'],
    },
    {
      name: 'Dr. Sophia Patel',
      email: 'sophia.patel@caresync.com',
      password: 'doctor123',
      specialization: 'Pediatrician',
      qualification: 'MD Pediatrics, DCH, FAAP',
      experience: 11,
      consultationFee: 600,
      gender: 'Female',
      consultationType: 'Both',
      rating: 4.88,
      reviewsCount: 210,
      clinic: { name: 'Sunshine Kids Care & Vaccination Center', address: 'Governorpet', city: 'Vijayawada' },
      location: 'Vijayawada, Andhra Pradesh',
      bio: 'Compassionate pediatric specialist caring for infants, children, and adolescents focusing on growth development and immunization.',
      profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Today, 03:00 PM',
      isVerified: true,
      patientAgeGroups: ['kids'],
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
      clinic: { name: 'Apex Joint & Spine Hospital', address: 'Kothapet Main Road', city: 'Guntur' },
      location: 'Guntur, Andhra Pradesh',
      bio: 'Specialist in arthroscopic joint surgery, knee/hip replacements, and sports injury rehabilitation.',
      profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Tomorrow, 11:30 AM',
      isVerified: true,
      patientAgeGroups: ['adults', 'seniors'],
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
      profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Today, 05:00 PM',
      isVerified: true,
      patientAgeGroups: ['kids', 'adults', 'seniors'],
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
      clinic: { name: 'Womens Health & Maternity Suite', address: 'Jubilee Hills Road No 36', city: 'Hyderabad' },
      location: 'Hyderabad, Telangana',
      bio: 'Dedicated to complete womens health, reproductive medicine, laparoscopic surgery, prenatal care, and postnatal wellness.',
      profileImage: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Tomorrow, 02:00 PM',
      isVerified: true,
      patientAgeGroups: ['adults', 'seniors'],
    },
    {
      name: 'Dr. David Miller',
      email: 'david.miller@caresync.com',
      password: 'doctor123',
      specialization: 'Dentist',
      qualification: 'MDS, Cosmetic & Restorative Dentistry',
      experience: 10,
      consultationFee: 650,
      gender: 'Male',
      consultationType: 'In-Clinic',
      rating: 4.8,
      reviewsCount: 96,
      clinic: { name: 'SmileCraft Dental Studio', address: 'MG Road, Labbipet', city: 'Vijayawada' },
      location: 'Vijayawada, Andhra Pradesh',
      bio: 'Expert in pain-free dental implants, smile design, root canal therapy, teeth whitening, and preventive oral health.',
      profileImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Today, 04:00 PM',
      isVerified: true,
      patientAgeGroups: ['kids', 'adults', 'seniors'],
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
      clinic: { name: 'Ear, Nose & Throat Advanced Clinic', address: 'Arundelpet 4th Lane', city: 'Guntur' },
      location: 'Guntur, Andhra Pradesh',
      bio: 'Specialist in sinus endoscopy, hearing restoration, tonsillitis treatment, and microsurgery of the ear and voice.',
      profileImage: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Tomorrow, 10:00 AM',
      isVerified: true,
      patientAgeGroups: ['kids', 'adults', 'seniors'],
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
      clinic: { name: 'Vision First Eye Hospital', address: 'Brodipet Main Road', city: 'Guntur' },
      location: 'Guntur, Andhra Pradesh',
      bio: 'Advanced cataract laser surgery, LASIK vision correction, dry eye therapy, and diabetic retinopathy screening.',
      profileImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Today, 02:30 PM',
      isVerified: true,
      patientAgeGroups: ['kids', 'adults', 'seniors'],
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
      clinic: { name: 'MindCare Behavioral Health Clinic', address: 'Hitec City, Madhapur', city: 'Hyderabad' },
      location: 'Hyderabad, Telangana',
      bio: 'Specializing in anxiety, depression, stress management, adult ADHD, sleep disorders, and cognitive behavioral therapy.',
      profileImage: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Today, 06:00 PM',
      isVerified: true,
      patientAgeGroups: ['adults', 'seniors'],
    },
    // Additional Doctors across Andhra Pradesh & Telangana, including Pending Verification for Admin flow
    {
      name: 'Dr. Srinivas Rao',
      email: 'srinivas.rao@caresync.com',
      password: 'doctor123',
      specialization: 'General Physician',
      qualification: 'MBBS, DNB Family Medicine',
      experience: 7,
      consultationFee: 450,
      gender: 'Male',
      consultationType: 'Both',
      rating: 4.7,
      reviewsCount: 52,
      clinic: { name: 'Kakatiya Health Clinic', address: 'Nakkalagutta', city: 'Warangal' },
      location: 'Warangal, Telangana',
      bio: 'Experienced family physician delivering compassionate primary care, viral fever treatment, and chronic diabetes monitoring.',
      profileImage: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Tomorrow, 10:00 AM',
      isVerified: false, // Pending verification for Admin Demo
      patientAgeGroups: ['kids', 'adults', 'seniors'],
    },
    {
      name: 'Dr. Meera Krishnan',
      email: 'meera.krishnan@caresync.com',
      password: 'doctor123',
      specialization: 'Dermatologist',
      qualification: 'MD Dermatology, Venereology & Leprosy',
      experience: 6,
      consultationFee: 650,
      gender: 'Female',
      consultationType: 'Both',
      rating: 4.82,
      reviewsCount: 44,
      clinic: { name: 'DermaGlow Care Clinic', address: 'Near RTC Complex', city: 'Tirupati' },
      location: 'Tirupati, Andhra Pradesh',
      bio: 'Expert in skin glow therapies, chemical peels, fungal skin infections, and hair loss PRP treatments.',
      profileImage: 'https://images.unsplash.com/photo-1594824813686-9051010e42d7?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1594824813686-9051010e42d7?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Today, 11:00 AM',
      isVerified: false, // Pending verification for Admin Demo
      patientAgeGroups: ['adults', 'seniors'],
    },
    {
      name: 'Dr. Harsha Vardhan',
      email: 'harsha.vardhan@caresync.com',
      password: 'doctor123',
      specialization: 'Cardiologist',
      qualification: 'MD, DM Interventional Cardiology',
      experience: 12,
      consultationFee: 1000,
      gender: 'Male',
      consultationType: 'In-Clinic',
      rating: 4.89,
      reviewsCount: 68,
      clinic: { name: 'Amaravati Heart Institute', address: 'Penumaka Road', city: 'Amaravati' },
      location: 'Amaravati, Andhra Pradesh',
      bio: 'Specialist in advanced angiography, pacemaker implantation, hypertension, and preventive cardiac wellness.',
      profileImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'Tomorrow, 04:30 PM',
      isVerified: true,
      patientAgeGroups: ['adults', 'seniors'],
    },
    {
      name: 'Dr. Pradeep Chandran',
      email: 'pradeep.chandran@caresync.com',
      password: 'doctor123',
      specialization: 'Orthopedic',
      qualification: 'MS Orthopedics, Joint Replacement Surgeon',
      experience: 14,
      consultationFee: 850,
      gender: 'Male',
      consultationType: 'Both',
      rating: 4.86,
      reviewsCount: 77,
      clinic: { name: 'Karimnagar Bone & Joint Center', address: 'Collectorate Road', city: 'Karimnagar' },
      location: 'Karimnagar, Telangana',
      bio: 'Experienced surgeon for minimally invasive spine surgery, arthritis management, and trauma recovery.',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      nextAvailableSlot: 'This Week, 03:00 PM',
      isVerified: false, // Pending verification for Admin Demo
      patientAgeGroups: ['adults', 'seniors'],
    }
  ];

  const createdDoctors = [];

  for (const docData of doctorSeeds) {
    const docUser = await User.create({
      name: docData.name,
      email: docData.email,
      password: docData.password,
      role: 'doctor',
      phone: '+91 ' + Math.floor(9000000000 + Math.random() * 999999999),
      avatar: docData.profileImage,
      gender: docData.gender.toLowerCase(),
      address: docData.location,
      status: 'active',
      isActive: true,
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
      clinic: docData.clinic,
      location: docData.location,
      bio: docData.bio,
      rating: docData.rating,
      reviewsCount: docData.reviewsCount,
      image: docData.image,
      profileImage: docData.profileImage,
      nextAvailableSlot: docData.nextAvailableSlot,
      isVerified: docData.isVerified,
      patientAgeGroups: docData.patientAgeGroups || (docData.specialization === 'Pediatrician' ? ['kids'] : ['adults', 'seniors']),
      availability: [
        {
          day: 'Monday',
          date: new Date().toISOString().split('T')[0],
          slots: ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '05:30 PM']
        },
        {
          day: 'Tuesday',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          slots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:30 PM']
        },
        {
          day: 'Wednesday',
          date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          slots: ['10:00 AM', '12:00 PM', '03:00 PM', '05:00 PM']
        }
      ]
    });

    createdDoctors.push({ user: docUser, profile: doctorProfile });
  }

  console.log(`[Seeder] Created ${createdDoctors.length} unique doctor profiles.`);

  // 4. Create Appointments for Demo Patient & Doctors
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const appt1 = await Appointment.create({
    patient: patientUser._id,
    doctor: createdDoctors[0].profile._id, // Dr. Elena Rostova
    date: today,
    timeSlot: '10:30 AM',
    consultationType: 'Video Consultation',
    status: 'confirmed',
    patientName: patientUser.name,
    patientPhone: patientUser.phone,
    patientEmail: patientUser.email,
    reason: 'Skin allergy consultation and acne laser assessment',
    amount: createdDoctors[0].profile.consultationFee,
    paymentStatus: 'paid',
  });

  const appt2 = await Appointment.create({
    patient: patientUser._id,
    doctor: createdDoctors[1].profile._id, // Dr. Alexander Wright
    date: tomorrow,
    timeSlot: '09:00 AM',
    consultationType: 'In-Clinic',
    status: 'pending',
    patientName: patientUser.name,
    patientPhone: patientUser.phone,
    patientEmail: patientUser.email,
    reason: 'Routine quarterly cardiovascular wellness checkup',
    amount: createdDoctors[1].profile.consultationFee,
    paymentStatus: 'paid',
  });

  const appt3 = await Appointment.create({
    patient: patientUser._id,
    doctor: createdDoctors[3].profile._id, // Dr. Sophia Patel
    date: yesterday,
    timeSlot: '03:00 PM',
    consultationType: 'In-Clinic',
    status: 'completed',
    patientName: patientUser.name,
    patientPhone: patientUser.phone,
    patientEmail: patientUser.email,
    reason: 'Child immunization booster vaccination',
    amount: createdDoctors[3].profile.consultationFee,
    paymentStatus: 'paid',
  });

  const appt4 = await Appointment.create({
    patient: patientUser2._id,
    doctor: createdDoctors[4].profile._id, // Dr. Robert Chen
    date: today,
    timeSlot: '11:30 AM',
    consultationType: 'In-Clinic',
    status: 'confirmed',
    patientName: patientUser2.name,
    patientPhone: patientUser2.phone,
    patientEmail: patientUser2.email,
    reason: 'Knee joint pain diagnosis',
    amount: createdDoctors[4].profile.consultationFee,
    paymentStatus: 'paid',
  });

  // 5. Create Reviews for Doctors
  await Review.create({
    doctor: createdDoctors[0].profile._id,
    patient: patientUser._id,
    patientName: patientUser.name,
    rating: 5,
    comment: 'Dr. Elena was extremely thorough, caring, and prescribed an effective skincare regimen!',
  });

  await Review.create({
    doctor: createdDoctors[1].profile._id,
    patient: patientUser._id,
    patientName: patientUser.name,
    rating: 5,
    comment: 'Exceptional cardiologist. Explained everything with clarity and confidence.',
  });

  console.log('[Seeder] Database successfully populated with CareSync live data.');
};

// If run directly via node
if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/caresync')
    .then(async () => {
      console.log('Connected to MongoDB for Seeding...');
      await seedCareSyncData();
      console.log('Seeding Complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeder Error:', err);
      process.exit(1);
    });
}
