import multer from 'multer';
import path from 'path';

// Define storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder where you want to store the files
    cb(null, 'uploads');  // This will store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Generate a unique filename based on current time and original file extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);  // Set the file name to be unique
  }
});

// Create the Multer instance with limits
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024  // Limit the file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'), false);
    }
    cb(null, true);
  }
});

export default upload;
