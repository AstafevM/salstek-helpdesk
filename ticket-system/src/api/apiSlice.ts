// src/api/apiSlice.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseQuery';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Ticket', 'User', 'Comment'],
  endpoints: () => ({}),
});