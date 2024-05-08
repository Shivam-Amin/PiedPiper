import express from 'express';
import fileUpload from 'express-fileupload'
import  { 
  addFolder,
  updateFolder,
  deleteFolder,
  getFolders,
  uploadFile,
  getFiles, } from '../controllers/fileSystem.js';
import { isAuthenticate } from '../middleware/auth.js';
import singleUpload from '../middleware/multer.js';

const router = express.Router();

// router
//   .route('/all')
//     .get( isAuthenticate, getMyTasks )

router.route('/folder/add').post( isAuthenticate, addFolder )
router.route('/folder/update').post( isAuthenticate, updateFolder )
router.route('/folder/delete/:id').get( isAuthenticate, deleteFolder )
router.route('/folder/get/:id').get( isAuthenticate, getFolders )
router.route('/file/upload').post( isAuthenticate, singleUpload, uploadFile )
router.route('/file/get/:id').get( isAuthenticate, getFiles )

// router
//   .route('/:id')
//     .patch(isAuthenticate, updateTask)
//     .delete(isAuthenticate, deleteTask)

// router
//   .route('/:id')

export default router;