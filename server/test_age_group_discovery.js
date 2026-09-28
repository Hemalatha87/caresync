import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import Doctor from './models/Doctor.js';
import User from './models/User.js';
import { seedCareSyncData } from './utils/seeder.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

let server;
let BASE_URL = 'http://localhost:5001/api';

async function runAgeGroupDiscoveryTests() {
  console.log('🧪 Starting CareSync Age-Group Discovery End-to-End Test Suite...\n');

  try {
    await connectDB();
    console.log('Connected to MongoDB.');
    await seedCareSyncData();

    await new Promise((resolve) => {
      server = app.listen(5001, () => {
        console.log('Test Server listening on port 5001');
        resolve();
      });
    });
    // 1. Test Age Group = kids
    console.log('--- Test 1: GET /api/doctors?ageGroup=kids ---');
    const kidsRes = await fetch(`${BASE_URL}/doctors?ageGroup=kids`);
    const kidsData = await kidsRes.json();
    console.log(`Status: ${kidsRes.status}, Found: ${kidsData.doctors?.length} doctor(s)`);
    if (!kidsData.success || !kidsData.doctors || kidsData.doctors.length === 0) {
      throw new Error('Age group kids filter returned no doctors');
    }
    kidsData.doctors.forEach(d => {
      if (!d.patientAgeGroups || !d.patientAgeGroups.includes('kids')) {
        throw new Error(`Doctor ${d.name} does not include "kids" in patientAgeGroups`);
      }
    });
    console.log('✅ All returned doctors support "kids" age group.');

    // 2. Test Age Group = adults
    console.log('\n--- Test 2: GET /api/doctors?ageGroup=adults ---');
    const adultsRes = await fetch(`${BASE_URL}/doctors?ageGroup=adults`);
    const adultsData = await adultsRes.json();
    console.log(`Status: ${adultsRes.status}, Found: ${adultsData.doctors?.length} doctor(s)`);
    if (!adultsData.success || !adultsData.doctors || adultsData.doctors.length === 0) {
      throw new Error('Age group adults filter returned no doctors');
    }
    adultsData.doctors.forEach(d => {
      if (!d.patientAgeGroups || !d.patientAgeGroups.includes('adults')) {
        throw new Error(`Doctor ${d.name} does not include "adults" in patientAgeGroups`);
      }
    });
    console.log('✅ All returned doctors support "adults" age group.');

    // 3. Test Age Group = seniors
    console.log('\n--- Test 3: GET /api/doctors?ageGroup=seniors ---');
    const seniorsRes = await fetch(`${BASE_URL}/doctors?ageGroup=seniors`);
    const seniorsData = await seniorsRes.json();
    console.log(`Status: ${seniorsRes.status}, Found: ${seniorsData.doctors?.length} doctor(s)`);
    if (!seniorsData.success || !seniorsData.doctors || seniorsData.doctors.length === 0) {
      throw new Error('Age group seniors filter returned no doctors');
    }
    seniorsData.doctors.forEach(d => {
      if (!d.patientAgeGroups || !d.patientAgeGroups.includes('seniors')) {
        throw new Error(`Doctor ${d.name} does not include "seniors" in patientAgeGroups`);
      }
    });
    console.log('✅ All returned doctors support "seniors" age group.');

    // 4. Test Combined: Age Group = adults & specialization = Cardiologist
    console.log('\n--- Test 4: Combined Filter: ageGroup=adults & specialization=Cardiologist ---');
    const comb1Res = await fetch(`${BASE_URL}/doctors?ageGroup=adults&specialization=Cardiologist`);
    const comb1Data = await comb1Res.json();
    console.log(`Status: ${comb1Res.status}, Found: ${comb1Data.doctors?.length} doctor(s)`);
    if (!comb1Data.doctors || comb1Data.doctors.length === 0) {
      throw new Error('Combined filter adults + Cardiologist returned no results');
    }
    comb1Data.doctors.forEach(d => {
      if (d.specialization !== 'Cardiologist' || !d.patientAgeGroups.includes('adults')) {
        throw new Error(`Doctor ${d.name} does not match combined criteria`);
      }
    });
    console.log('✅ Combined filter (Adults + Cardiologist) verified.');

    // 5. Test Combined: Age Group = kids & location = Tenali or Guntur or Vijayawada
    console.log('\n--- Test 5: Combined Filter: ageGroup=kids & location=Vijayawada ---');
    const comb2Res = await fetch(`${BASE_URL}/doctors?ageGroup=kids&location=Vijayawada`);
    const comb2Data = await comb2Res.json();
    console.log(`Status: ${comb2Res.status}, Found: ${comb2Data.doctors?.length} doctor(s)`);
    if (!comb2Data.doctors || comb2Data.doctors.length === 0) {
      throw new Error('Combined filter kids + Vijayawada returned no results');
    }
    console.log('✅ Combined filter (Kids + Vijayawada) verified.');

    // 6. Test Doctor Profile Update: edit patientAgeGroups
    console.log('\n--- Test 6: Doctor login and update patientAgeGroups in MongoDB ---');
    const docLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'doctor@caresync.com', password: 'doctor123' }),
    });
    const docLoginData = await docLoginRes.json();
    if (!docLoginRes.ok) throw new Error(`Doctor login failed: ${docLoginData.message}`);
    const docToken = docLoginData.token;

    // Update doctor's patientAgeGroups to all 3: ['kids', 'adults', 'seniors']
    const updateRes = await fetch(`${BASE_URL}/users/doctor-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${docToken}`,
      },
      body: JSON.stringify({
        patientAgeGroups: ['kids', 'adults', 'seniors'],
      }),
    });
    const updateData = await updateRes.json();
    if (!updateData.success || !updateData.doctor?.patientAgeGroups?.includes('kids')) {
      throw new Error('Doctor profile update for patientAgeGroups failed');
    }
    console.log('✅ Doctor updated patientAgeGroups in MongoDB successfully to:', updateData.doctor.patientAgeGroups);

    // 7. Re-verify search with Kids includes Dr. Elena
    const verifyDocRes = await fetch(`${BASE_URL}/doctors?ageGroup=kids&search=Elena`);
    const verifyDocData = await verifyDocRes.json();
    if (!verifyDocData.doctors || verifyDocData.doctors.length === 0) {
      throw new Error('Updated doctor Elena not found in kids search');
    }
    console.log(`✅ Live search verified: ${verifyDocData.doctors[0].name} now correctly shows in Kids Care search results.`);

    // 8. Safe handling of invalid ageGroup (e.g. ageGroup=abc)
    console.log('\n--- Test 8: Safe handling of invalid ageGroup parameter ---');
    const invalidRes = await fetch(`${BASE_URL}/doctors?ageGroup=abc`);
    const invalidData = await invalidRes.json();
    if (!invalidData.success) {
      throw new Error('Backend failed on invalid ageGroup param');
    }
    console.log(`✅ Invalid ageGroup handled gracefully without crashing (returned ${invalidData.doctors?.length} doctors).`);

    console.log('\n🎉 ALL AGE-GROUP DISCOVERY END-TO-END TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

runAgeGroupDiscoveryTests();
