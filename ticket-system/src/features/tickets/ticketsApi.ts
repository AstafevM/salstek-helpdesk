// src/features/tickets/ticketsApi.ts
import { apiSlice } from '@/api/apiSlice';
import type { Ticket } from '@/types/ticket.types';
import { TicketStatus } from '@/types/ticket.types';
import { getTickets, getTicketById, updateTicket, deleteTicket, addTicket } from '@/mocks/ticketsStore';
import { addComment } from '@/mocks/ticketsStore';
import type { Comment } from '@/types/ticket.types';

export const ticketsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<Ticket[], void>({
      async queryFn() {
        return { data: getTickets() };
      },
      providesTags: ['Ticket'],
    }),
    getTicketById: builder.query<Ticket, string>({
      async queryFn(id) {
        const ticket = getTicketById(id);
        if (ticket) {
          return { data: ticket };
        }
        return { error: { status: 404, data: 'Заявка не найдена' } };
      },
      providesTags: (result, error, id) => [{ type: 'Ticket', id }],
    }),
    createTicket: builder.mutation<Ticket, { theme: string; description: string }>({
      async queryFn(data) {
        const newTicket: Ticket = {
          id: `t-${Date.now()}`,
          number: `T-${String(getTickets().length + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deadline: new Date(Date.now() + 86400000).toISOString(),
          title: data.theme,
          description: data.description,
          priority: 'Средний' as any,
          status: TicketStatus.NEW,
          initiator: {
            id: 'u1',
            fullName: 'Текущий пользователь',
            email: 'user@example.com',
            role: 'initiator' as const,
          },
          responsible: undefined,
          attachments: [],
          comments: [],
          isArchived: false,
        };
        addTicket(newTicket);
        return { data: newTicket };
      },
      invalidatesTags: ['Ticket'],
    }),
    assignTicket: builder.mutation<Ticket, { applicationId: string; newResponsibleId: string }>({
      async queryFn({ applicationId }) {
        const ticket = getTicketById(applicationId);
        if (!ticket) {
          return { error: { status: 404, data: 'Заявка не найдена' } };
        }
        const updated: Ticket = {
          ...ticket,
          status: TicketStatus.IN_PROGRESS,
          responsible: {
            id: 'executor1',
            fullName: 'Исполнитель',
            email: 'exec@example.com',
            role: 'executor' as const,
          },
        };
        updateTicket(updated);
        return { data: updated };
      },
      invalidatesTags: (result, error, { applicationId }) => [{ type: 'Ticket', id: applicationId }, 'Ticket'],
    }),
    deleteTicket: builder.mutation<void, string>({
      async queryFn(id) {
        const success = deleteTicket(id);
        if (!success) {
          return { error: { status: 404, data: 'Заявка не найдена' } };
        }
        return { data: undefined };
      },
      invalidatesTags: ['Ticket'],
    }),
    // Новая мутация: отправить сообщение в чат
    sendComment: builder.mutation<Comment, { ticketId: string; text: string; authorId: string; authorName: string }>({
      async queryFn({ ticketId, text, authorId, authorName }) {
        const newComment: Comment = {
          id: `c${Date.now()}`,
          ticketId,
          author: {
            id: authorId,
            fullName: authorName,
            email: 'user@example.com',
            role: 'initiator',
          },
          text,
          createdAt: new Date().toISOString(),
        };
        addComment(ticketId, newComment);
        return { data: newComment };
      },
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }, 'Ticket'],
    }),
    updateStatus: builder.mutation<Ticket, { id: string; status: TicketStatus }>({
      async queryFn({ id, status }) {
        const ticket = getTicketById(id);
        if (!ticket) return { error: { status: 404, data: 'Заявка не найдена' } };
        const updated = { ...ticket, status };
        updateTicket(updated);
        return { data: updated };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }, 'Ticket'],
    }),
  }),

});

export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useAssignTicketMutation,
  useDeleteTicketMutation,
  useSendCommentMutation, // экспортируем новый хук
  useUpdateStatusMutation,
} = ticketsApi;