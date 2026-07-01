// src/mocks/ticketsStore.ts
import type { Ticket, Comment } from '@/types/ticket.types';
import { TicketStatus } from '@/types/ticket.types';
import { mockTickets } from './tickets';

let ticketsData: Ticket[] = JSON.parse(JSON.stringify(mockTickets));

export const getTickets = (): Ticket[] => [...ticketsData];
export const getTicketById = (id: string): Ticket | undefined => {
  return ticketsData.find((t) => t.id === id);
};

export const updateTicket = (updatedTicket: Ticket): Ticket => {
  const index = ticketsData.findIndex((t) => t.id === updatedTicket.id);
  if (index !== -1) {
    const newData = [...ticketsData];
    newData[index] = { ...updatedTicket };
    ticketsData = newData;
  }
  return updatedTicket;
};

export const deleteTicket = (id: string): boolean => {
  const index = ticketsData.findIndex((t) => t.id === id);
  if (index !== -1) {
    const newData = [...ticketsData];
    newData.splice(index, 1);
    ticketsData = newData;
    return true;
  }
  return false;
};

export const addTicket = (ticket: Ticket): Ticket => {
  ticketsData = [...ticketsData, ticket];
  return ticket;
};

// НОВАЯ ФУНКЦИЯ: добавить комментарий к заявке
export const addComment = (ticketId: string, comment: Comment): Comment => {
  const ticket = getTicketById(ticketId);
  if (ticket) {
    const updatedTicket = {
      ...ticket,
      comments: [...ticket.comments, comment],
    };
    updateTicket(updatedTicket);
    return comment;
  }
  throw new Error('Заявка не найдена');
};