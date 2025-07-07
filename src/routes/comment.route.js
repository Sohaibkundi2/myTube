import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment
} from '../controllers/comment.controller.js';

const router = Router();


router.get('/:videoId', getVideoComments);


router.post('/:videoId', verifyJWT, addComment);


router.patch('/update/:commentId', verifyJWT, updateComment);


router.delete('/delete/:commentId', verifyJWT, deleteComment);

export default router;
