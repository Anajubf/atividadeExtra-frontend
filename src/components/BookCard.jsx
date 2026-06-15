import { supabase } from '../lib/supabase';
import styles from './BookCard.module.css';

export default function BookCard({ book, onUpdate }) {
    // Função para alternar entre 'Read' e 'To-Read' diretamente no card
    const toggleStatus = async () => {
        const nextStatus = book.status === 'Read' ? 'To-Read' : 'Read';
        try {
            const { error } = await supabase
                .from('livros')
                .update({ status: nextStatus })
                .eq('id', book.id);

            if (error) throw error;
            if (onUpdate) onUpdate(); // Força o App.jsx a recarregar a lista
        } catch (err) {
            console.error('Erro ao atualizar status:', err.message);
        }
    };

    // Função para alternar o favorito (coração)
    const toggleFavorite = async () => {
        try {
            const { error } = await supabase
                .from('livros')
                .update({ favorite: !book.favorite })
                .eq('id', book.id);

            if (error) throw error;
            if (onUpdate) onUpdate(); // Força o App.jsx a recarregar a lista
        } catch (err) {
            console.error('Erro ao favoritar livro:', err.message);
        }
    };

    // Gera as estrelas com base na nota do banco de dados
    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div className={styles.card}>
            {/* CONTAINER DA CAPA */}
            <div className={styles.coverWrapper}>
                {book.cover_url ? (
                    <img
                        src={book.cover_url}
                        alt={`Capa do livro ${book.title}`}
                        className={styles.coverImage}
                    />
                ) : (
                    /* Capa padrão com a inicial caso não tenha imagem */
                    <div className={styles.placeholderCover}>
                        <span>{book.title?.charAt(0).toUpperCase()}</span>
                    </div>
                )}

                {/* Badge de Status por cima da imagem (igual ao app) */}
                <span
                    className={`${styles.statusBadge} ${
                        book.status === 'Read' ? styles.badgeRead : styles.badgeToRead
                    }`}
                    onClick={toggleStatus}
                    title="Clique para alterar o status">
                    {book.status === 'Read' ? 'Lido' : 'Quero ler'}
                </span>
            </div>

            {/* INFO DO LIVRO */}
            <div className={styles.bookInfo}>
                <div className={styles.titleRow}>
                    <h3 className={styles.bookTitle}>{book.title}</h3>
                    <button
                        className={`${styles.favBtn} ${book.favorite ? styles.isFav : ''}`}
                        onClick={toggleFavorite}>
                        {book.favorite ? '💜' : '🤍'}
                    </button>
                </div>

                <p className={styles.bookAuthor}>{book.author}</p>
                <p className={styles.bookGenre}>{book.genre || 'Geral'}</p>

                <div className={styles.ratingRow}>
                    <span className={styles.stars}>{renderStars(book.rating || 5)}</span>
                    <span className={styles.ratingNumber}>{(book.rating || 5).toFixed(1)}</span>
                </div>
            </div>
        </div>
    );
}
