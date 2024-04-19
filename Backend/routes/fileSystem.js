import express from 'express';
import  { 
  addFolder,
  updateFolder,
  deleteFolder,
  getFolders, } from '../controllers/fileSystem.js';
import { isAuthenticate } from '../middleware/auth.js';

const router = express.Router();

// router
//   .route('/all')
//     .get( isAuthenticate, getMyTasks )

router.route('/folder/add').post( isAuthenticate, addFolder )
router.route('/folder/update').post( isAuthenticate, updateFolder )
router.route('/folder/delete/:id').get( isAuthenticate, deleteFolder )
router.route('/folder/get/:id').get( isAuthenticate, getFolders )

// router
//   .route('/:id')
//     .patch(isAuthenticate, updateTask)
//     .delete(isAuthenticate, deleteTask)

// router
//   .route('/:id')

export default router;