const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== Starting CareSync Full Profile & Image Flow Tests ===\n');

  try {
    // 1. Register a Patient
    const patientEmail = `testpatient_${Date.now()}@example.com`;
    console.log(`[1] Registering Patient: ${patientEmail}`);
    const patRegRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ramesh Verma',
        email: patientEmail,
        password: 'password123',
        phone: '9876543210',
        role: 'patient',
      }),
    });
    const patRegData = await patRegRes.json();
    if (!patRegData.success) throw new Error(`Patient register failed: ${patRegData.message}`);
    const patientToken = patRegData.token;
    console.log('✓ Patient registered successfully. User ID:', patRegData.user.id || patRegData.user._id);

    // 2. Patient Profile Update
    console.log('[2] Updating Patient Profile (DOB, Location, Blood Group)...');
    const patUpdateRes = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${patientToken}`,
      },
      body: JSON.stringify({
        dob: '1995-05-15',
        gender: 'male',
        location: 'Vijayawada, Andhra Pradesh',
        address: 'MG Road, Vijayawada',
        bloodGroup: 'O+',
        emergencyContact: '9876500000',
      }),
    });
    const patUpdateData = await patUpdateRes.json();
    if (!patUpdateData.success) throw new Error(`Patient update failed: ${patUpdateData.message}`);
    console.log('✓ Patient profile updated. Blood Group:', patUpdateData.user.bloodGroup);

    // 3. Patient Profile Picture Upload (Base64 data URL)
    console.log('[3] Uploading Patient Profile Picture via Base64/Data URI...');
    const dummyBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const patImgRes = await fetch(`${BASE_URL}/users/profile/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${patientToken}`,
      },
      body: JSON.stringify({ image: dummyBase64 }),
    });
    const patImgData = await patImgRes.json();
    if (!patImgData.success) throw new Error(`Image upload failed: ${patImgData.message}`);
    console.log('✓ Patient Image Uploaded! URL:', patImgData.profileImage);

    // 4. Verify Patient profile persistence
    const patGetRes = await fetch(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${patientToken}` },
    });
    const patGetData = await patGetRes.json();
    if (patGetData.user.profileImage !== patImgData.profileImage) {
      throw new Error('Patient profileImage not matching persisted value!');
    }
    console.log('✓ Patient profile persistence verified.');

    // 5. Register Doctor A, Doctor B, Doctor C with distinct images
    console.log('\n[5] Creating 3 Doctors with independent profiles...');
    const uniqueId = Date.now();
    const docAName = `Dr. Ananya Reddy_${uniqueId}`;
    const docBName = `Dr. Bharat Rao_${uniqueId}`;
    const docCName = `Dr. Chaitanya Prasad_${uniqueId}`;

    const docAEmail = `doc_a_${uniqueId}@example.com`;
    const docBEmail = `doc_b_${uniqueId}@example.com`;
    const docCEmail = `doc_c_${uniqueId}@example.com`;

    const docARes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: docAName,
        email: docAEmail,
        password: 'password123',
        phone: '9123456780',
        role: 'doctor',
        specialization: 'Dermatologist',
        experience: 7,
        consultationFee: 700,
        location: 'Guntur, Andhra Pradesh',
      }),
    });
    const docAData = await docARes.json();
    const docAToken = docAData.token;

    const docBRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: docBName,
        email: docBEmail,
        password: 'password123',
        phone: '9123456781',
        role: 'doctor',
        specialization: 'Pediatrician',
        experience: 10,
        consultationFee: 650,
        location: 'Vijayawada, Andhra Pradesh',
      }),
    });
    const docBData = await docBRes.json();
    const docBToken = docBData.token;

    const docCRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: docCName,
        email: docCEmail,
        password: 'password123',
        phone: '9123456782',
        role: 'doctor',
        specialization: 'Cardiologist',
        experience: 14,
        consultationFee: 900,
        location: 'Hyderabad, Telangana',
      }),
    });
    const docCData = await docCRes.json();
    const docCToken = docCData.token;

    console.log('✓ Doctor A, B, C registered.');

    // Doctor A uploads custom profile photo
    console.log('[6] Doctor A uploading custom profile photo A...');
    const docAImgRes = await fetch(`${BASE_URL}/users/profile/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${docAToken}`,
      },
      body: JSON.stringify({ image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNk+M9QzwAEjAwIDAAAAP//Bv8Dh78/Jq4AAAAASUVORK5CYII=' }),
    });
    const docAImgData = await docAImgRes.json();
    const docAInitialImg = docAImgData.profileImage;
    console.log('✓ Doctor A initial profileImage:', docAInitialImg);

    // Doctor B sets distinct image
    await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${docBToken}`,
      },
      body: JSON.stringify({
        profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      }),
    });

    // Doctor C sets distinct image
    await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${docCToken}`,
      },
      body: JSON.stringify({
        profileImage: 'https://images.unsplash.com/photo-1594824813589-cf771d5b3581?auto=format&fit=crop&q=80&w=400',
      }),
    });

    // 7. Verify Find Doctors endpoint returns all 3 with their distinct images
    console.log('\n[7] Querying Find Doctors API to verify distinct images...');
    const findDocsRes = await fetch(`${BASE_URL}/doctors?limit=50`);
    const findDocsData = await findDocsRes.json();
    const allDocs = findDocsData.doctors || [];

    const foundDocA = allDocs.find((d) => d.name === docAName);
    const foundDocB = allDocs.find((d) => d.name === docBName);
    const foundDocC = allDocs.find((d) => d.name === docCName);

    console.log('Found Doc A Image in Find Doctors:', foundDocA?.profileImage);
    console.log('Found Doc B Image in Find Doctors:', foundDocB?.profileImage);
    console.log('Found Doc C Image in Find Doctors:', foundDocC?.profileImage);

    if (!foundDocA || !foundDocB || !foundDocC) {
      throw new Error('Not all 3 test doctors were returned in Find Doctors!');
    }

    if (foundDocA.profileImage === foundDocB.profileImage || foundDocB.profileImage === foundDocC.profileImage) {
      throw new Error('Doctors are sharing the same profile image!');
    }
    console.log('✓ Verified: Each doctor has an independent, unique profile image.');

    // 8. Doctor A updates to a NEW Image B
    console.log('\n[8] Doctor A uploading NEW Image B...');
    const docAImgRes2 = await fetch(`${BASE_URL}/users/profile/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${docAToken}`,
      },
      body: JSON.stringify({ image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAAF0lEQVR42mNk+M9QzwAFjAwIDBgwDAAAAAAA//8CgQNf9b3bHQAAAABJRU5ErkJggg==' }),
    });
    const docAImgData2 = await docAImgRes2.json();
    const docANewImg = docAImgData2.profileImage;
    console.log('✓ Doctor A updated profileImage:', docANewImg);

    // 9. Re-query Find Doctors: Doctor A must show docANewImg, Doc B and C remain unchanged
    const findDocsAfterRes = await fetch(`${BASE_URL}/doctors?limit=50`);
    const findDocsAfterData = await findDocsAfterRes.json();
    const allDocsAfter = findDocsAfterData.doctors || [];
    const updatedDocA = allDocsAfter.find((d) => d.name === docAName);
    const updatedDocB = allDocsAfter.find((d) => d.name === docBName);
    const updatedDocC = allDocsAfter.find((d) => d.name === docCName);

    if (updatedDocA.profileImage !== docANewImg) {
      throw new Error(`Doctor A image did not update in Find Doctors! Expected ${docANewImg}, got ${updatedDocA.profileImage}`);
    }
    if (updatedDocB.profileImage !== foundDocB.profileImage) {
      throw new Error('Doctor B image was accidentally modified!');
    }
    if (updatedDocC.profileImage !== foundDocC.profileImage) {
      throw new Error('Doctor C image was accidentally modified!');
    }
    console.log('✓ Doctor A profile image update successfully propagated to Find Doctors while preserving Doctor B & C.');

    // 10. Admin Verification & Stats
    console.log('\n[10] Admin Login and Doctor Verification test...');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@caresync.com',
        password: 'password123',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.token;

    // Toggle Doctor A verification
    const verifyRes = await fetch(`${BASE_URL}/admin/doctors/${foundDocA._id}/verify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ isVerified: true }),
    });
    const verifyData = await verifyRes.json();
    console.log('✓ Admin set Doctor A verification to:', verifyData.doctor?.isVerified);

    // Specialization Counts
    const specCountsRes = await fetch(`${BASE_URL}/doctors/specialization-counts`);
    const specCountsData = await specCountsRes.json();
    console.log('✓ Live Specialization Counts:', specCountsData.counts);

    console.log('\n=============================================');
    console.log('🎉 ALL INTEGRATION & FLOW TESTS PASSED 100%!');
    console.log('=============================================');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
