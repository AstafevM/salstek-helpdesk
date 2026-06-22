// src/types/ticket.types.ts

// ---------- Пункт 1.3 ТЗ ----------
export enum TicketStatus {
  NEW = 'Новая',
  IN_PROGRESS = 'В работе',
  COMPLETED = 'Исполнено',
  CLOSED = 'Закрыта',
}

// ---------- Пункт 1.1 ТЗ ----------
export enum Priority {
  LOW = 'Низкий',
  MEDIUM = 'Средний',
  HIGH = 'Высокий',
  CRITICAL = 'Критический',
}

// ---------- Пункт 4.2 ТЗ (Роли в БД) ----------
export type UserRole = 'initiator' | 'executor' | 'admin';

// ---------- Пункт 1.1, 1.2 ТЗ ----------
export interface User {
  id: string;
  fullName: string;  // ФИО
  email: string;
  role: UserRole;
}

// ---------- Пункт 1.1, 1.4 ТЗ (Вложения) ----------
export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;   // в байтах
  mimeType: string;   // например, 'image/png'
  url: string;        // ссылка для скачивания/просмотра
  uploadedAt: string; // ISO-дата
}

// ---------- Пункт 1.5 ТЗ (Чат) ----------
export interface Comment {
  id: string;
  ticketId: string;
  author: User;
  text: string;
  attachments?: Attachment[]; // можно приложить файл к сообщению
  createdAt: string;
  isSystem?: boolean; // системное сообщение (например, "Статус изменён")
}

// ---------- ГЛАВНАЯ СУЩНОСТЬ (Пункты 1.1, 1.2, 1.3) ----------
export interface Ticket {
  id: string;
  number: string;          // № заявки (формируется автоматически)
  createdAt: string;       // Дата и время заявки
  updatedAt: string;
  deadline: string;        // Срок исполнения

  title: string;           // Тема
  description: string;     // Описание
  priority: Priority;

  status: TicketStatus;

  initiator: User;         // Клиент (ФИО)
  responsible?: User;      // Ответственный (появляется после брони)

  attachments: Attachment[];
  comments: Comment[];

  isArchived: boolean;     // Пункт 1.6
}