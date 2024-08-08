import { Router } from 'express';
import { register } from '../controllers/users.register.js';
import { login } from '../controllers/users.login.js';
import { upload } from '../middlewares/multer.middlewares.js';
import { authmiddleware } from '../middlewares/verifyAccessToken.middlewares.js';
import { logout } from '../controllers/users.logout.js';
import { addPlaylist } from '../controllers/users.addPlaylist.js';
import { uploadVideo } from '../controllers/users.uploadVideo.js';
import { fetchVideos } from '../controllers/fetchVideos.js';
import { fetchAllChannels } from '../controllers/fetchAllChannels.js';
import { fetchWatchLaters } from '../controllers/fetchAllWatchLaters.js';
import { addWatchLater } from '../controllers/users.addWatchLater.js';
import { startVideo } from '../controllers/users.startVideo.js';
import { fetchAllWatchHistories } from '../controllers/fetchAllWatchHistories.js';

const router = Router();

//public route
router.post('/login', login);
router.post('/register', register);
router.get('/videos', fetchVideos);
router.get('/channels',fetchAllChannels);
//authentic route
router.post('/addPlaylist',authmiddleware, addPlaylist);
router.get('/watchLaters',authmiddleware, fetchWatchLaters);
router.post('/watchLater',authmiddleware, addWatchLater);
router.post('/video', authmiddleware,startVideo);
router.get('/history',authmiddleware,fetchAllWatchHistories);
router.post('/uploadVideo',authmiddleware, upload.fields([{ name: 'video', maxCount: 1 },{name:'thumbnail',maxCount: 1 }]), uploadVideo);

router.post('/logout', logout);


export default router;










