// Controller
import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

// Obtém a lista de hotéis para o usuário autenticado.
export const getHotels = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req;
  try {
    // Chamar o serviço para obter a lista de hotéis
    const result = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

// Obtém os quartos de um hotel para o usuário autenticado.
export const getRooms = async (req: AuthenticatedRequest, res: Response) => {
  const hotelId = Number(req.params.hotelId);
  const { userId } = req;
  try {
    // Chamar o serviço para obter os quartos do hotel
    const hotel = await hotelsService.getRooms(userId, hotelId);
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

// Função auxiliar para tratar erros específicos e retornar a resposta apropriada
const handleErrorResponse = (error: any, res: Response) => {
  if (error.name === 'UnauthorizedError') {
    // Usuário não autorizado
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
  if (error.name === 'NotFoundError') {
    // Dados não encontrados
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
  if (error.name === 'PaymentRequired') {
    // Pagamento necessário
    return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
  }
  // Erro genérico
  return res.sendStatus(httpStatus.BAD_REQUEST);
};
