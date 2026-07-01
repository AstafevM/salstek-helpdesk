import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateTicketMutation } from '@/features/tickets/ticketsApi';

type CreateTicketForm = {
    theme: string;
    description: string;
};

const CreateTicketPage = () => {
    const navigate = useNavigate();
    const [createTicket] = useCreateTicketMutation();
    const { register, handleSubmit } = useForm<CreateTicketForm>();

    const onSubmit = async (data: CreateTicketForm) => {
        console.log('✅ onSubmit вызван, данные:', data);
        try {
            await createTicket({ theme: data.theme, description: data.description }).unwrap();
            navigate('/tickets');
        } catch (err) {
            console.error('Ошибка создания:', err);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
            <h1>Создать заявку</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Тема</label>
                    <input {...register('theme')} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Описание</label>
                    <textarea {...register('description')} rows={4} style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
                    Создать
                </button>
                <button type="button" onClick={() => navigate('/tickets')} style={{ marginLeft: '10px', padding: '10px 20px' }}>
                    Отмена
                </button>
            </form>
        </div>
    );
};

export default CreateTicketPage;