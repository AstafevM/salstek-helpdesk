// src/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import TicketsPage from '../pages/TicketsPage';
import TicketPage from '../pages/TicketPage';
import CreateTicketPage from '../pages/CreateTicketPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/tickets',
    element: <TicketsPage />,
  },
  {
    path: '/tickets/:id',
    element: <TicketPage />,
  },
  {
    path: '/tickets/create',
    element: <CreateTicketPage />,
  }
]);