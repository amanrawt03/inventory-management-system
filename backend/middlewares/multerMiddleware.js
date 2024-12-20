// multerMiddleware.js
import multer from 'multer';
import path from 'path';

// Set up memory storage instead of disk storage
const storage = multer.memoryStorage();

// Create the Multer instance with limits
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024  
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'), false);
    }
    cb(null, true);
  }
});

export default upload