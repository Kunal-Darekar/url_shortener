import express from 'express'
import { handleGenerateNewShortURL , handleGetAnalytics , getallurl } from '../controllers/url.js';


const router= express.Router();


router.post('/', handleGenerateNewShortURL);

router.get('/analytics/:shortId',handleGetAnalytics )
router.get("/" ,  getallurl)

export default router;