// src/pages/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(4, 'Пароль должен содержать минимум 4 символа'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = () => {
    // Мок-логин: сразу переходим на таблицу
    navigate('/tickets');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h1>Вход в систему</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <input {...register('email')} style={{ width: '100%', padding: '8px' }} />
          {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Пароль</label>
          <input type="password" {...register('password')} style={{ width: '100%', padding: '8px' }} />
          {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}
        </div>
        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Войти
        </button>
      </form>
    </div>
  );
};

export default LoginPage;