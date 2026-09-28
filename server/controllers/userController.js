import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import fs from 'fs';
import path from 'path';

// @desc    Get current user profile
// @route   GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || user.profileImage,
        profileImage: user.profileImage || user.avatar,
        gender: user.gender,
        dob: user.dob,
        location: user.location,
        address: user.address,
        bloodGroup: user.bloodGroup,
        emergencyContact: user.emergencyContact,
        status: user.status,
        createdAt: user.createdAt,
        doctorProfile,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      name,
      phone,
      gender,
      dob,
      location,
      address,
      bloodGroup,
      emergencyContact,
      avatar,
      profileImage,
    } = req.body;

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (gender !== undefined) user.gender = gender;
    if (dob !== undefined) user.dob = dob;
    if (location !== undefined) user.location = location.trim();
    if (address !== undefined) user.address = address.trim();
    if (bloodGroup !== undefined) user.bloodGroup = bloodGroup.trim();
    if (emergencyContact !== undefined) user.emergencyContact = emergencyContact.trim();

    const img = profileImage || avatar;
    if (img !== undefined) {
      user.avatar = img;
      user.profileImage = img;
    }

    await user.save();

    // If doctor, also synchronize common fields to Doctor record
    let doctorProfile = null;
    if (user.role === 'doctor') {
      const docUpdates = {};
      if (name) docUpdates.name = name.trim();
      if (gender) docUpdates.gender = gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : 'Other';
      if (location) docUpdates.location = location.trim();
      if (img !== undefined) {
        docUpdates.image = img;
        docUpdates.profileImage = img;
      }

      doctorProfile = await Doctor.findOneAndUpdate(
        { user: user._id },
        { $set: docUpdates },
        { new: true }
      );
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        profileImage: user.profileImage,
        gender: user.gender,
        dob: user.dob,
        location: user.location,
        address: user.address,
        bloodGroup: user.bloodGroup,
        emergencyContact: user.emergencyContact,
        status: user.status,
        doctorProfile,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload profile image (multipart/form-data or JSON url/base64)
// @route   POST /api/users/profile/image
export const uploadProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let imageUrl = '';

    if (req.file) {
      // Multer uploaded file
      imageUrl = `/uploads/profiles/${req.file.filename}`;
    } else if (req.body.profileImage || req.body.image || req.body.avatar) {
      // JSON body with image URL or Base64 data
      const rawImg = req.body.profileImage || req.body.image || req.body.avatar;

      if (rawImg.startsWith('data:image/')) {
        // Save Base64 to disk
        const matches = rawImg.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return res.status(400).json({ success: false, message: 'Invalid base64 image data' });
        }

        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `profile-${user._id}-${Date.now()}.${ext}`;
        const filePath = path.join(process.cwd(), 'uploads/profiles', filename);

        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        fs.writeFileSync(filePath, buffer);
        imageUrl = `/uploads/profiles/${filename}`;
      } else {
        imageUrl = rawImg;
      }
    } else {
      return res.status(400).json({ success: false, message: 'No image file or URL provided' });
    }

    // Save to User
    user.avatar = imageUrl;
    user.profileImage = imageUrl;
    await user.save();

    // If doctor, also update Doctor document
    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOneAndUpdate(
        { user: user._id },
        { $set: { image: imageUrl, profileImage: imageUrl } },
        { new: true }
      );
    }

    return res.json({
      success: true,
      message: 'Profile picture updated successfully',
      profileImage: imageUrl,
      avatar: imageUrl,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        profileImage: user.profileImage,
        doctorProfile,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove profile photo
// @route   DELETE /api/users/profile/image
export const removeProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.avatar = '';
    user.profileImage = '';
    await user.save();

    if (user.role === 'doctor') {
      await Doctor.findOneAndUpdate(
        { user: user._id },
        { $set: { image: '', profileImage: '' } }
      );
    }

    return res.json({
      success: true,
      message: 'Profile picture removed successfully',
      profileImage: '',
      avatar: '',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update doctor professional profile
// @route   PUT /api/doctors/my-profile
export const updateDoctorMyProfile = async (req, res) => {
  try {
    let doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const {
      specialization,
      qualification,
      experience,
      consultationFee,
      consultationType,
      clinicName,
      clinicAddress,
      city,
      location,
      bio,
      languages,
      availability,
      patientAgeGroups,
    } = req.body;

    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experience !== undefined) doctor.experience = Number(experience);
    if (consultationFee !== undefined) doctor.consultationFee = Number(consultationFee);
    if (consultationType) doctor.consultationType = consultationType;
    if (bio !== undefined) doctor.bio = bio;
    if (languages !== undefined) doctor.languages = languages;
    if (location !== undefined) doctor.location = location;
    if (patientAgeGroups && Array.isArray(patientAgeGroups)) {
      doctor.patientAgeGroups = patientAgeGroups;
    }

    if (clinicName || clinicAddress || city) {
      doctor.clinic = {
        name: clinicName || doctor.clinic?.name || 'Clinic',
        address: clinicAddress || doctor.clinic?.address || '',
        city: city || doctor.clinic?.city || location || 'City',
      };
    }

    if (availability && Array.isArray(availability)) {
      doctor.availability = availability;
    }

    await doctor.save();

    return res.json({
      success: true,
      message: 'Professional doctor details saved successfully',
      doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
