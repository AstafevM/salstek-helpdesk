// src/mocks/tickets.ts
import type { Ticket } from '@/types/ticket.types';
import { TicketStatus, Priority } from '@/types/ticket.types';

export const mockTickets: Ticket[] = Array.from({ length: 25 }, (_, i) => {
    const id = (i + 1).toString();
    const statuses = [
        TicketStatus.NEW,
        TicketStatus.IN_PROGRESS,
        TicketStatus.COMPLETED,
        TicketStatus.CLOSED,
    ];
    const priorities = [
        Priority.LOW,
        Priority.MEDIUM,
        Priority.HIGH,
        Priority.CRITICAL,
    ];
    const names = [
        'Иванов И.И.',
        'Петрова М.С.',
        'Сидоров А.П.',
        'Козлова Е.В.',
        'Смирнов Д.А.',
    ];
    const topics = [
        'Не работает принтер',
        'Запрос на установку ПО',
        'Сброс пароля',
        'Проблема с VPN',
        'Заявка на оборудование',
    ];

    const status = statuses[i % statuses.length];
    const isClosed = status === TicketStatus.CLOSED;

    return {
        id: `t-${id}`,
        number: `T-${String(i + 1).padStart(3, '0')}`,
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - i * 3600000).toISOString(),
        deadline: new Date(Date.now() + 86400000 * (i + 1)).toISOString(),
        title: topics[i % topics.length] + ` (заявка ${i + 1})`,
        description: `Описание заявки номер ${i + 1}`,
        priority: priorities[i % priorities.length],
        status: status,
        initiator: {
            id: `u${i}`,
            fullName: names[i % names.length],
            email: `user${i}@example.com`,
            role: 'initiator',
        },
        responsible:
            status === TicketStatus.NEW
                ? undefined
                : {
                    id: `u${i + 10}`,
                    fullName: `Исполнитель ${i + 1}`,
                    email: `exec${i}@example.com`,
                    role: 'executor' as const,
                },
        attachments:
            i % 3 === 0
                ? [
                    {
                        id: `a${i}`,
                        fileName: `file_${i}.png`,
                        fileSize: 1024,
                        mimeType: 'image/png',
                        url: '#',
                        uploadedAt: new Date().toISOString(),
                    },
                ]
                : [],
        comments: i === 1 ? [
            {
                id: 'c1',
                ticketId: `t-${id}`,
                author: {
                    id: 'u1',
                    fullName: 'Иванов И.И.',
                    email: 'ivan@example.com',
                    role: 'initiator',
                },
                text: 'Не могу распечатать документ, ошибка 404',
                createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
            {
                id: 'c2',
                ticketId: `t-${id}`,
                author: {
                    id: 'u3',
                    fullName: 'Сидоров А.П.',
                    email: 'alex@example.com',
                    role: 'executor',
                },
                text: 'Попробуйте перезагрузить принтер',
                createdAt: new Date(Date.now() - 1800000).toISOString(),
            },
        ] : [],
        isArchived: isClosed,
    };
});