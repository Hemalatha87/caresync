import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
  removeProfilePhoto,
  updateDoctorMyProfile,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadProfileImage } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Profile photo upload (supports multipart/form-data or JSON url/base64)
router.post(
  '/profile/image',
  (req, res, next) => {
    uploadProfileImage.single('image')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  uploadProfilePhoto
);

router.delete('/profile/image', removeProfilePhoto);

// Doctor professional profile edit
router.put('/doctor-profile', authorize('doctor', 'admin'), updateDoctorMyProfile);

export default router;
