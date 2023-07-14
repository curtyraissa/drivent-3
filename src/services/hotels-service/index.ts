// Service

import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { TicketStatus } from "@prisma/client";

const hotelsService = {
    //Obtém a lista de hotéis para um usuário específico.
  getHotels: async (userId: number) => {
    // Obter a inscrição do usuário
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
      throw notFoundError();
    }

    // Obter o ticket da inscrição
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket || isPaymentRequired(ticket)) {
      throw new Error("Payment required");
    }

    // Obter os hotéis
    const hotel = await hotelsRepository.getHotels();
    if (!hotel || hotel.length === 0) {
      throw notFoundError();
    }

    return hotel;
  },

  //Obtém os quartos de um hotel para um usuário específico, pelo ID
  getRooms: async (userId: number, hotelId: number) => {
    const hotelRoom = await hotelsRepository.getRooms(hotelId);

    if (!hotelRoom) {
      throw notFoundError();
    }

    return formatHotelResult(hotelRoom);
  },
};

//Verifica se o pagamento é necessário com base no ticket do usuário.
const isPaymentRequired = (ticket: any) => {
  return (
    ticket.status === TicketStatus.RESERVED ||
    ticket.isRemote ||
    !ticket.includesHotel
  );
};

//Formata o resultado do hotel e quartos.
const formatHotelResult = (result: any) => {
  return {
    id: result.id,
    name: result.name,
    image: result.image,
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
    Rooms: result.Rooms.map((room: any) => ({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      hotelId: room.hotelId,
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    })),
  };
};

export default hotelsService;
