// src/pages/TicketsPage.tsx
import { useState, useMemo } from 'react';
import { useGetTicketsQuery } from '@/features/tickets/ticketsApi';
import { TicketStatus, Priority } from '@/types/ticket.types';
import { useNavigate } from 'react-router-dom';

const TicketsPage = () => {
  const { data: tickets, isLoading, error } = useGetTicketsQuery();
  const navigate = useNavigate();
  // Состояния для фильтра и пагинации
  const [hideClosed, setHideClosed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 1. Фильтрация: скрываем "Закрыта", если чекбокс включен
  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    if (hideClosed) {
      return tickets.filter((ticket) => ticket.status !== TicketStatus.CLOSED);
    }
    return tickets;
  }, [tickets, hideClosed]);

  // 2. Пагинация: берём только 20 записей для текущей страницы
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage]);

  // Сброс страницы при изменении фильтра
  const handleFilterChange = (checked: boolean) => {
    setHideClosed(checked);
    setCurrentPage(1); // Возвращаем на первую страницу
  };

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка заявок...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка загрузки данных (используются моки)</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Реестр заявок</h1>
        <button
          onClick={() => navigate('/tickets/create')}
          style={{
            padding: '10px 20px',
            background: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          + Создать заявку
        </button>
      </div>

      {/* Панель фильтров (пункт 1.2 ТЗ) */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <label style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={hideClosed}
            onChange={(e) => handleFilterChange(e.target.checked)}
          />
          {' '}Скрыть заявки со статусом «Закрыта»
        </label>
        <span style={{ fontSize: '14px', color: '#666' }}>
          Всего: {filteredTickets.length} заявок
        </span>
      </div>

      {/* Таблица (пункт 1.2 ТЗ) */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>№ заявки</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Дата и время</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Тема</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Клиент (ФИО)</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Статус</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Приоритет</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Ответственный</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Вложения</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTickets.map((ticket) => (
            <tr
              key={ticket.id}
              style={{
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <td style={{ padding: '10px' }}>{ticket.number}</td>
              <td style={{ padding: '10px' }}>{new Date(ticket.createdAt).toLocaleString()}</td>
              <td style={{ padding: '10px' }}>{ticket.title}</td>
              <td style={{ padding: '10px' }}>{ticket.initiator.fullName}</td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  background: getStatusColor(ticket.status),
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  {ticket.status}
                </span>
              </td>
              <td style={{ padding: '10px', color: getPriorityColor(ticket.priority), fontWeight: 'bold' }}>
                {ticket.priority}
              </td>
              <td style={{ padding: '10px' }}>{ticket.responsible?.fullName || '—'}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                {ticket.attachments.length > 0 && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Пагинация (пункт 1.2 ТЗ - 20 заявок) */}
      {totalPages > 1 && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Назад
          </button>
          <span style={{ padding: '8px 16px' }}>
            Страница {currentPage} из {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
};

// Хелперы для цветов (пункт 1.2 ТЗ)
const getPriorityColor = (priority: Priority): string => {
  const colors = {
    [Priority.LOW]: 'green',
    [Priority.MEDIUM]: '#ff8c00', // оранжевый
    [Priority.HIGH]: 'red',
    [Priority.CRITICAL]: '#8b0000', // темно-красный
  };
  return colors[priority] || 'black';
};

const getStatusColor = (status: TicketStatus): string => {
  const colors = {
    [TicketStatus.NEW]: '#007bff', // синий
    [TicketStatus.IN_PROGRESS]: '#ff8c00', // оранжевый
    [TicketStatus.COMPLETED]: '#28a745', // зеленый
    [TicketStatus.CLOSED]: '#6c757d', // серый
  };
  return colors[status] || '#6c757d';
};

export default TicketsPage;