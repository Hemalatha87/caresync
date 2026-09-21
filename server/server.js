import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import Doctor from './models/Doctor.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CareSync Healthcare API',
    timestamp: new Date().toISOString(),
  });
});

// Global 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'CareSync API Route Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[CareSync Server Error]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
const startServer = async () => {
  const isConnected = await connectDB();
  
  if (isConnected) {
    try {
      // Check if DB is empty and auto-seed if necessary
      const doctorCount = await Doctor.countDocuments();
      if (doctorCount === 0) {
        console.log('[CareSync Auto-Seed] Database empty, seeding initial records...');
        // Dynamically run seeder logic
        const { default: User } = await import('./models/User.js');
        const { default: Appointment } = await import('./models/Appointment.js');
        const { default: Review } = await import('./models/Review.js');

        // Create Preset Admin
        await User.create({
          name: 'CareSync Admin',
          email: 'admin@caresync.com',
          password: 'admin123',
          role: 'admin',
          phone: '+1 (555) 019-2831',
        });

        // Create Preset Patient
        const patientUser = await User.create({
          name: 'Sarah Jenkins',
          email: 'patient@caresync.com',
          password: 'patient123',
          role: 'patient',
          phone: '+1 (555) 392-1049',
          gender: 'female',
          address: '742 Evergreen Terrace, Springfield',
        });

        // Seed 8 Doctors
        const doctorSeeds = [
          { name: 'Dr. Alexander Wright', email: 'doctor@caresync.com', specialization: 'Cardiologist', qualification: 'MD, FACC - Harvard Medical School', experience: 14, fee: 150, rating: 4.9, reviewsCount: 128, city: 'Boston', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400', bio: 'Board-certified cardiologist specializing in preventive cardiology and echocardiography.' },
          { name: 'Dr. Elena Rostova', email: 'elena.rostova@caresync.com', specialization: 'Dermatologist', qualification: 'MD, Board Certified Dermatologist', experience: 9, fee: 120, rating: 4.8, reviewsCount: 94, city: 'New York', image: 'https://images.unsplash.com/photo-1594824813566-88855ce78c80?auto=format&fit=crop&q=80&w=400', bio: 'Expert in clinical dermatology, skin cancer screening, laser therapy, and cosmetics.' },
          { name: 'Dr. Marcus Vance', email: 'marcus.vance@caresync.com', specialization: 'Neurologist', qualification: 'MD, PhD Neuroscience - Johns Hopkins', experience: 18, fee: 200, rating: 4.95, reviewsCount: 156, city: 'San Francisco', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400', bio: 'Pioneer in headache medicine, movement disorders, and neurodegenerative care.' },
          { name: 'Dr. Sophia Patel', email: 'sophia.patel@caresync.com', specialization: 'Pediatrician', qualification: 'MD Pediatrics, FAAP', experience: 11, fee: 95, rating: 4.9, reviewsCount: 210, city: 'Chicago', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400', bio: 'Compassionate pediatric care focusing on adolescent health and immunizations.' },
          { name: 'Dr. Robert Chen', email: 'robert.chen@caresync.com', specialization: 'Orthopedic', qualification: 'MS Orthopedics, Fellowship Sports Medicine', experience: 15, fee: 175, rating: 4.85, reviewsCount: 112, city: 'Dallas', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400', bio: 'Specialist in arthroscopic joint surgery, knee/hip replacements, and sports injury rehab.' },
          { name: 'Dr. Amara Lawson', email: 'amara.lawson@caresync.com', specialization: 'General Physician', qualification: 'MBBS, MD Internal Medicine', experience: 8, fee: 80, rating: 4.75, reviewsCount: 88, city: 'Seattle', image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400', bio: 'Primary care specialist dedicated to lifestyle medicine and chronic illness prevention.' },
          { name: 'Dr. Victoria Sterling', email: 'victoria.sterling@caresync.com', specialization: 'Gynecologist', qualification: 'MD, FACOG Obstetrics & Gynecology', experience: 13, fee: 140, rating: 4.9, reviewsCount: 140, city: 'Los Angeles', image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400', bio: 'Dedicated to complete womens health, reproductive medicine, and laparoscopic surgery.' },
          { name: 'Dr. David Miller', email: 'david.miller@caresync.com', specialization: 'Dentist', qualification: 'DDS, Cosmetic & Restorative Dentistry', experience: 10, fee: 110, rating: 4.8, reviewsCount: 96, city: 'Atlanta', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400', bio: 'Expert in pain-free dental implants, smile design, teeth whitening, and preventive oral health.' }
        ];

        for (const docData of doctorSeeds) {
          const docUser = await User.create({
            name: docData.name,
            email: docData.email,
            password: 'doctor123',
            role: 'doctor',
            avatar: docData.image,
          });

          await Doctor.create({
            user: docUser._id,
            name: docData.name,
            specialization: docData.specialization,
            qualification: docData.qualification,
            experience: docData.experience,
            consultationFee: docData.fee,
            rating: docData.rating,
            reviewsCount: docData.reviewsCount,
            clinic: { name: `${docData.specialization} Health Hub`, address: '100 Healthcare Way', city: docData.city },
            bio: docData.bio,
            image: docData.image,
            isVerified: true,
            availability: [
              { day: 'Monday', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM'] },
              { day: 'Wednesday', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM'] },
              { day: 'Friday', slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] }
            ]
          });
        }
        console.log('[CareSync Auto-Seed] Auto-seeding completed successfully!');
      }
    } catch (seedErr) {
      console.warn('[CareSync Auto-Seed Warning]', seedErr.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`[CareSync Server] Server running on http://localhost:${PORT}`);
  });
};

startServer();
