const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Starting CareSync End-to-End Verification Suite...\n');

  try {
    // 1. Test Doctor Search with Specialization & Location (Tenali + Dermatologist)
    console.log('--- Test 1: Doctor Search by Specialization & Location (Dermatologist in Tenali) ---');
    const res1 = await fetch(`${BASE_URL}/doctors?specialization=Dermatologist&location=Tenali`);
    const data1 = await res1.json();
    console.log(`Status: ${res1.status}, Found: ${data1.doctors.length} doctor(s)`);
    if (data1.doctors.length > 0) {
      console.log(`✅ Doctor Found: ${data1.doctors[0].name}, Specialization: ${data1.doctors[0].specialization}, Location: ${data1.doctors[0].location}`);
    } else {
      throw new Error('Dermatologist in Tenali not found!');
    }

    // 2. Test Multi-Criteria Query Dynamic Construction
    console.log('\n--- Test 2: Doctor Search with Multi-Filter Combination ---');
    const queryParams = new URLSearchParams({
      specialization: 'Dermatologist',
      location: 'Tenali',
      experience: '5',
      minFee: '300',
      maxFee: '800',
      rating: '4',
      gender: 'Female',
      consultationType: 'Both',
      sort: 'rating'
    });
    const res2 = await fetch(`${BASE_URL}/doctors?${queryParams.toString()}`);
    const data2 = await res2.json();
    console.log(`Status: ${res2.status}, Matches: ${data2.doctors.length}`);
    if (data2.doctors.length > 0 && data2.doctors[0].name === 'Dr. Elena Rostova') {
      console.log(`✅ Multi-filter matched: ${data2.doctors[0].name}`);
    } else {
      throw new Error('Multi-filter failed to match Dr. Elena Rostova!');
    }

    const elenaDoctor = data2.doctors[0];

    // 3. Login as Patient
    console.log('\n--- Test 3: Patient Authentication ---');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'patient@caresync.com', password: 'patient123' })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');
    const patientToken = loginData.token;
    console.log(`✅ Patient Authenticated: ${loginData.user.name} (${loginData.user.email})`);

    const patientHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${patientToken}`
    };

    // 4. Create an Appointment with Dr. Elena Rostova
    console.log('\n--- Test 4: Book Appointment with Dr. Elena Rostova ---');
    const testDate = '2026-09-25';
    const testSlot = '02:00 PM';

    const bookRes = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: patientHeaders,
      body: JSON.stringify({
        doctorId: elenaDoctor._id,
        date: testDate,
        timeSlot: testSlot,
        consultationType: 'Video Consultation',
        reason: 'Skin allergy and routine checkup',
        patientName: 'Sarah Jenkins',
        patientEmail: 'patient@caresync.com',
        patientPhone: '+1 (555) 392-1049'
      })
    });

    const bookData = await bookRes.json();
    if (!bookRes.ok) throw new Error(bookData.message || 'Booking failed');
    const createdAppt = bookData.appointment;
    console.log(`✅ Appointment Booked!`);
    console.log(`   Booking ID: ${createdAppt.bookingId}`);
    console.log(`   Doctor: ${createdAppt.doctor?.name || 'Dr. Elena Rostova'}`);
    console.log(`   Status: ${createdAppt.status}`);
    console.log(`   Fee: ₹${createdAppt.fee || createdAppt.amount}`);
    console.log(`   Consultation Type: ${createdAppt.consultationType}`);

    if (!createdAppt.bookingId || !createdAppt.bookingId.startsWith('CS-')) {
      throw new Error(`Booking ID does not have CS- prefix! Got: ${createdAppt.bookingId}`);
    }

    // 5. Test Double-Booking Prevention on the exact same date/slot
    console.log('\n--- Test 5: Prevent Double Booking Check ---');
    const doubleBookRes = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: patientHeaders,
      body: JSON.stringify({
        doctorId: elenaDoctor._id,
        date: testDate,
        timeSlot: testSlot,
        consultationType: 'In-Clinic',
        reason: 'Another booking attempt for same slot',
        patientName: 'Sarah Jenkins',
        patientEmail: 'patient@caresync.com',
        patientPhone: '+1 (555) 392-1049'
      })
    });
    const doubleBookData = await doubleBookRes.json();
    if (doubleBookRes.status === 400) {
      console.log(`✅ Double Booking Successfully Blocked! Server responded: "${doubleBookData.message}"`);
    } else {
      throw new Error(`Double booking was allowed or returned status ${doubleBookRes.status}`);
    }

    // 6. Test Doctor's Availability Endpoint for bookedSlots
    console.log('\n--- Test 6: Doctor Availability Booked Slots Check ---');
    const docAvailRes = await fetch(`${BASE_URL}/doctors/${elenaDoctor._id}?date=${testDate}`);
    const docAvailData = await docAvailRes.json();
    console.log(`Booked slots for ${testDate}:`, docAvailData.bookedSlots);
    if (docAvailData.bookedSlots && docAvailData.bookedSlots.includes(testSlot)) {
      console.log(`✅ Slot "${testSlot}" correctly marked as booked in doctor availability.`);
    } else {
      throw new Error(`Slot ${testSlot} not in bookedSlots list!`);
    }

    // 7. Verify Patient's Dashboard My Appointments
    console.log('\n--- Test 7: Patient Dashboard Appointments List ---');
    const patientAppsRes = await fetch(`${BASE_URL}/appointments`, { headers: patientHeaders });
    const patientAppsData = await patientAppsRes.json();
    const foundPatientApp = patientAppsData.appointments.find(a => a._id === createdAppt._id);
    if (foundPatientApp) {
      console.log(`✅ Found in Patient Appointments: Booking ID ${foundPatientApp.bookingId}, Status: ${foundPatientApp.status}`);
    } else {
      throw new Error('Created appointment missing from patient appointment list!');
    }

    // 8. Doctor Portal: Login as Dr. Elena Rostova
    console.log('\n--- Test 8: Doctor Login & Appointment Discovery ---');
    const docLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'doctor@caresync.com', password: 'doctor123' })
    });
    const docLoginData = await docLoginRes.json();
    if (!docLoginRes.ok) throw new Error(docLoginData.message || 'Doctor login failed');
    const doctorToken = docLoginData.token;
    const doctorHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${doctorToken}`
    };
    console.log(`✅ Doctor Authenticated: ${docLoginData.user.name}`);

    const docAppsRes = await fetch(`${BASE_URL}/appointments`, { headers: doctorHeaders });
    const docAppsData = await docAppsRes.json();
    const foundDocApp = docAppsData.appointments.find(a => a._id === createdAppt._id);
    if (foundDocApp) {
      console.log(`✅ Appointment automatically populated in Doctor Dashboard!`);
      console.log(`   Patient: ${foundDocApp.patientName}`);
      console.log(`   Date/Time: ${foundDocApp.date} ${foundDocApp.timeSlot}`);
      console.log(`   Status: ${foundDocApp.status}`);
    } else {
      throw new Error('Appointment missing from doctor dashboard!');
    }

    // 9. Doctor Transitions Status to COMPLETED
    console.log('\n--- Test 9: Doctor Marks Appointment as COMPLETED ---');
    const statusUpdateRes = await fetch(`${BASE_URL}/appointments/${createdAppt._id}/status`, {
      method: 'PATCH',
      headers: doctorHeaders,
      body: JSON.stringify({ status: 'COMPLETED' })
    });
    const statusUpdateData = await statusUpdateRes.json();
    if (!statusUpdateRes.ok) throw new Error(statusUpdateData.message || 'Status update failed');
    console.log(`✅ Status updated to: ${statusUpdateData.appointment.status}`);

    // 10. Verify Completed Status Reflects in Patient Dashboard
    console.log('\n--- Test 10: Patient Dashboard Verifies COMPLETED Status ---');
    const singleAppRes = await fetch(`${BASE_URL}/appointments/${createdAppt._id}`, { headers: patientHeaders });
    const singleAppData = await singleAppRes.json();
    if (singleAppData.appointment.status === 'COMPLETED') {
      console.log(`✅ Patient view reflects COMPLETED status in MongoDB database!`);
    } else {
      throw new Error(`Expected COMPLETED, got ${singleAppData.appointment.status}`);
    }

    console.log('\n🎉 ALL 10 END-TO-END CRITICAL TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

runTests();
