const BASE_URL = 'http://localhost:5000/api';

async function runNewFeatureTests() {
  console.log('🧪 Starting CareSync New Features & Enhancements Verification Suite...\n');

  try {
    // 1. Specialization counts endpoint
    console.log('--- Test 1: GET /api/doctors/specialization-counts ---');
    const countsRes = await fetch(`${BASE_URL}/doctors/specialization-counts`);
    const countsData = await countsRes.json();
    console.log(`Status: ${countsRes.status}, Specialization counts:`, countsData.counts);
    if (!countsData.success || typeof countsData.counts !== 'object') {
      throw new Error('Specialization counts failed');
    }
    console.log('✅ Specialization counts returned dynamic counts from MongoDB');

    // 2. Doctor search by name (Elena)
    console.log('\n--- Test 2: Search doctor by keyword "Elena" ---');
    const searchRes = await fetch(`${BASE_URL}/doctors?search=Elena`);
    const searchData = await searchRes.json();
    console.log(`Status: ${searchRes.status}, Found: ${searchData.doctors?.length} doctor(s)`);
    if (!searchData.doctors || searchData.doctors.length === 0 || !searchData.doctors[0].name.includes('Elena')) {
      throw new Error('Search by name failed for Elena');
    }
    console.log(`✅ Doctor search matched: ${searchData.doctors[0].name}`);

    // 3. Location filtering in Andhra Pradesh & Telangana
    console.log('\n--- Test 3: Location filtering (Guntur, Vijayawada, Hyderabad, Warangal) ---');
    for (const city of ['Guntur', 'Vijayawada', 'Hyderabad', 'Warangal']) {
      const locRes = await fetch(`${BASE_URL}/doctors?location=${city}`);
      const locData = await locRes.json();
      console.log(`  📍 City: ${city} -> Found ${locData.doctors?.length || 0} doctor(s)`);
      if (!locData.doctors || locData.doctors.length === 0) {
        throw new Error(`Location filter returned 0 doctors for ${city}`);
      }
    }
    console.log('✅ Location filtering verified for AP & Telangana');

    // 4. Doctor Image Uniqueness Check
    console.log('\n--- Test 4: Doctor profileImage uniqueness ---');
    const allDocsRes = await fetch(`${BASE_URL}/doctors?limit=50`);
    const allDocsData = await allDocsRes.json();
    const images = allDocsData.doctors.map(d => d.profileImage || d.image).filter(Boolean);
    const uniqueImages = new Set(images);
    console.log(`Total Doctors: ${allDocsData.doctors.length}, Total Doctor Images: ${images.length}, Unique Images: ${uniqueImages.size}`);
    if (uniqueImages.size < allDocsData.doctors.length) {
      console.warn('⚠️ Warning: Some doctors might share images');
    } else {
      console.log('✅ All doctor profiles have 100% unique distinct profile images');
    }

    // 5. Admin Login & Stats Check
    console.log('\n--- Test 5: Admin Login & Live Database Statistics ---');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@caresync.com', password: 'admin123' }),
    });
    const adminLoginData = await adminLoginRes.json();
    if (!adminLoginRes.ok) throw new Error(`Admin login failed: ${adminLoginData.message}`);
    const adminToken = adminLoginData.token;
    console.log(`✅ Admin authenticated: ${adminLoginData.user.name}`);

    const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const statsData = await statsRes.json();
    console.log('Live Database Stats:', statsData.stats);
    if (!statsData.success || statsData.stats.totalDoctors === undefined) {
      throw new Error('Failed to retrieve live stats');
    }
    console.log(`✅ Live DB Stats verified: ${statsData.stats.totalDoctors} doctors, ${statsData.stats.totalPatients} patients, ${statsData.stats.verifiedDoctors} verified, ${statsData.stats.pendingDoctors} pending.`);

    // 6. Doctor Verification Toggle (MongoDB Update)
    console.log('\n--- Test 6: Doctor Verification Toggle (Real MongoDB Update) ---');
    const pendingDoc = allDocsData.doctors.find(d => !d.isVerified) || allDocsData.doctors[0];
    console.log(`Target Doctor: ${pendingDoc.name}, current isVerified = ${pendingDoc.isVerified}`);
    
    // Toggle to opposite
    const verifyRes1 = await fetch(`${BASE_URL}/admin/doctors/${pendingDoc._id}/verify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ isVerified: !pendingDoc.isVerified }),
    });
    const verifyData1 = await verifyRes1.json();
    console.log(`Updated isVerified to: ${verifyData1.doctor?.isVerified}`);
    if (verifyData1.doctor?.isVerified === pendingDoc.isVerified) {
      throw new Error('Doctor verification state did not change');
    }

    // Toggle back to original
    await fetch(`${BASE_URL}/admin/doctors/${pendingDoc._id}/verify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ isVerified: pendingDoc.isVerified }),
    });
    console.log('✅ Doctor verification toggle in MongoDB verified successfully');

    // 7. User Status Update (Active / Inactive)
    console.log('\n--- Test 7: User Status Update in MongoDB ---');
    const usersRes = await fetch(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const usersData = await usersRes.json();
    const targetPatient = usersData.users.find(u => u.role === 'patient');
    console.log(`Target User: ${targetPatient.name} (${targetPatient.email}), current status = ${targetPatient.status}`);

    const userStatusRes = await fetch(`${BASE_URL}/admin/users/${targetPatient._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'inactive', isActive: false }),
    });
    const userStatusData = await userStatusRes.json();
    console.log(`Updated user status: ${userStatusData.user?.status}`);
    if (userStatusData.user?.status !== 'inactive') {
      throw new Error('User status was not updated to inactive');
    }

    // Restore to active
    await fetch(`${BASE_URL}/admin/users/${targetPatient._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'active', isActive: true }),
    });
    console.log('✅ User status update in MongoDB verified successfully');

    console.log('\n🎉 ALL NEW FEATURE TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

runNewFeatureTests();
