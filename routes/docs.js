import express from 'express'
import { handleGetApiDocs } from '../controllers/docs.js';

const router = express.Router();

router.get('/', handleGetApiDocs);

export default router;