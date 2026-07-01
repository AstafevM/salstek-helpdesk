// src/pages/TicketPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTicketByIdQuery, useAssignTicketMutation, useDeleteTicketMutation, useSendCommentMutation } from '@/features/tickets/ticketsApi';
import { TicketStatus } from '@/types/ticket.types';
import { useState } from 'react';

const TicketPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: ticket, isLoading, error, refetch } = useGetTicketByIdQuery(id!);
  const [newMessage, setNewMessage] = useState('');

  const [assignTicket] = useAssignTicketMutation();
  const [deleteTicket] = useDeleteTicketMutation();
  const [sendComment] = useSendCommentMutation();

  // Временная заглушка роли (можно поменять для теста)
  const currentUserRole: 'initiator' | 'executor' | 'admin' = 'executor' as 'initiator' | 'executor' | 'admin';

  if (isLoading) return <div>Загрузка...</div>;
  if (error || !ticket) return <div>Заявка не найдена</div>;

  const isChatActive = ticket.status === TicketStatus.IN_PROGRESS || ticket.status === TicketStatus.COMPLETED;

  // Отправка сообщения
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isChatActive) return;
    try {
      await sendComment({
        ticketId: ticket.id,
        text: newMessage,
        authorId: 'current-user-id', // можно заменить на реальный ID
        authorName: 'Текущий пользователь',
      }).unwrap();
      setNewMessage('');
      refetch();
    } catch (err) {
      console.error('Ошибка отправки:', err);
    }
  };

  // Изменение статуса (ручное)
  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (window.confirm(`Изменить статус на "${newStatus}"?`)) {
      try {
        // Мы не можем напрямую обновить статус через отдельную мутацию,
        // поэтому используем updateTicket из хранилища напрямую (но у нас его нет).
        // Вместо этого мы можем использовать assignTicket только для перехода в IN_PROGRESS,
        // но для других статусов сделаем через прямое обновление в мок-хранилище.
        // Для простоты я добавлю прямое изменение в мок-хранилище (через updateTicket),
        // но так как мы не можем вызвать его из компонента, мы создадим новую мутацию.
        // Вместо этого я покажу, как это сделать через отдельную мутацию в ticketsApi.
        // Для минимальной системы оставлю только возможность бронирования (перевод в В работе).
        // Если нужно ручное изменение, мы можем добавить мутацию updateStatus.
        // Пока просто предупрежу, что это будет в следующем шаге.
        alert('Ручное изменение статуса пока не реализовано, используйте бронирование.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAssign = async () => {
    if (window.confirm('Взять заявку в работу?')) {
      try {
        await assignTicket({ applicationId: ticket.id, newResponsibleId: 'executor1' }).unwrap();
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить заявку?')) {
      try {
        await deleteTicket(ticket.id).unwrap();
        navigate('/tickets');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const canDelete = (ticket.status === TicketStatus.NEW && currentUserRole === 'initiator') || currentUserRole === 'admin';
  const canAssign = ticket.status === TicketStatus.NEW && currentUserRole === 'executor';

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={() => navigate('/tickets')} style={{ marginBottom: '20px' }}>← Назад</button>
      <h1>Заявка №{ticket.number}</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ padding: '6px 12px', background: '#f0f0f0', borderRadius: '4px' }}>
          Статус: <strong>{ticket.status}</strong>
        </span>
        {canAssign && (
          <button onClick={handleAssign} style={{ padding: '6px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Бронь
          </button>
        )}
        {canDelete && (
          <button onClick={handleDelete} style={{ padding: '6px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Удалить
          </button>
        )}
        {/* Временная кнопка для ручного изменения статуса (заглушка) */}
        <select
          value={ticket.status}
          onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          {Object.values(TicketStatus).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Остальная информация и чат (без изменений) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
        <div><strong>Приоритет:</strong> {ticket.priority}</div>
        <div><strong>Дата создания:</strong> {new Date(ticket.createdAt).toLocaleString()}</div>
        <div><strong>Срок исполнения:</strong> {new Date(ticket.deadline).toLocaleString()}</div>
        <div><strong>Клиент:</strong> {ticket.initiator.fullName}</div>
        <div><strong>Ответственный:</strong> {ticket.responsible?.fullName || 'Не назначен'}</div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Тема</h3>
        <p>{ticket.title}</p>
        <h3>Описание</h3>
        <p>{ticket.description}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Вложения</h3>
        {ticket.attachments.length === 0 ? <p>Нет вложений</p> : <ul>{ticket.attachments.map((f) => <li key={f.id}><a href={f.url}>{f.fileName}</a></li>)}</ul>}
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
        <h3>Чат</h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px' }}>
          {ticket.comments.length === 0 ? <p style={{ color: '#999' }}>Нет сообщений</p> :
            ticket.comments.map((c) => (
              <div key={c.id} style={{ marginBottom: '10px', padding: '8px', background: '#f9f9f9', borderRadius: '4px' }}>
                <strong>{c.author.fullName}</strong> <span style={{ fontSize: '12px', color: '#999', marginLeft: '10px' }}>{new Date(c.createdAt).toLocaleString()}</span>
                <p style={{ margin: '5px 0 0 0' }}>{c.text}</p>
              </div>
            ))
          }
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isChatActive ? 'Введите сообщение...' : 'Чат недоступен'}
            disabled={!isChatActive}
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!isChatActive || !newMessage.trim()}
            style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: (isChatActive && newMessage.trim()) ? '#007bff' : '#ccc', color: '#fff' }}
          >
            Отправить
          </button>
        </div>
        {!isChatActive && <div style={{ marginTop: '8px', fontSize: '14px', color: '#888' }}>Чат доступен только для статусов «В работе» и «Исполнено».</div>}
      </div>
    </div>
  );
};

export default TicketPage;