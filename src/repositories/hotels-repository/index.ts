// Repository

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hotelsRepository = {
  //Obtém a lista de todos os hotéis.
  getHotels: async () => {
    return prisma.hotel.findMany();
  },

  //Obtém os quartos de um hotel específico.
  getRooms: async (hotelId: number) => {
    return prisma.hotel.findFirst({
      where: {
        id: hotelId,
      },
      include: {
        Rooms: true,
      },
    });
  },
};

export default hotelsRepository;
