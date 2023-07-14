import { Router } from 'express';
import { authenticateToken} from '@/middlewares';
import { getHotels, getRooms } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter.get('/', authenticateToken, getHotels)
hotelsRouter.get('/:hotelId', authenticateToken, getRooms)

export { hotelsRouter };