// Service

import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketsRepository from "@/repositories/tickets-repository";
// import { TicketStatus } from "@prisma/client";
import { paymentRequired } from "@/errors";

const hotelsService = {
  getHotels: async (userId: number) => {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
      throw notFoundError();
    }
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();
    if (ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw paymentRequired();
      }
    // if (!ticket || isPaymentRequired(ticket)) {
    //   throw new Error("Payment required");
    // }

    const hotels = await hotelsRepository.getHotels();
    if (!hotels || hotels.length === 0) {
      throw notFoundError();
    }

    return hotels;
  },

  getRooms: async (userId: number, hotelId: number) => {
    const hotel = await hotelsRepository.getRooms(hotelId);
    if (!hotel) {
      throw notFoundError();
    }
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
      throw notFoundError();
    }
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();
    if (ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw paymentRequired();
      }

    return formatHotelResult(hotel);
  },
};

// const isPaymentRequired = (ticket: any) => {
//   return (
//     ticket.status === TicketStatus.RESERVED ||
//     ticket.isRemote ||
//     !ticket.includesHotel
//   );
// };

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
