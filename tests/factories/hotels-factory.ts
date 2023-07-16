//factory

import faker from '@faker-js/faker';
import { prisma } from '@/config';
// import { TicketStatus } from '@prisma/client';

// Criar um hotel
export const createHotel = async () => {
  const hotel = await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.future(),
    },
    include: {
      Rooms: true,
    },
  });

  return hotel;
};

// Criar um hotel com quartos
export const createHotelWithRooms = async () => {
  const hotel = await createHotel();
  const rooms = await createRooms(hotel.id);
  const hotelWithRooms = { ...hotel, rooms };

  return hotelWithRooms;
};

// Cria quartos para um hotel específico.
export const createRooms = async (hotelId: number) => {
  const roomCount = faker.datatype.number({ min: 1, max: 5 });
  const rooms = [];

  for (let i = 0; i < roomCount; i++) {
    const room = await prisma.room.create({
      data: {
        name: faker.commerce.productName(),
        capacity: faker.datatype.number({ min: 1, max: 4 }),
        hotelId: hotelId,
        createdAt: faker.date.recent(),
        updatedAt: faker.date.future(),
      },
    });

    rooms.push(room);
  }

  return rooms;
};

// Cria um ticketType para um evento remoto
export async function createTicketTypeRemote() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: faker.datatype.boolean(),
    },
  });
}

// Cria um ticketType para um evento com hospedagem em hotel
export async function createTicketTypeWithHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

// Cria um ticketType para um evento sem hospedagem em hotel
export async function createTicketTypeWithoutHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: false,
    },
  });
}
