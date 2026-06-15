import { supabase } from '../lib/supabase';
import styles from './BookCard.module.css';

export default function BookCard({ book, onUpdate }) {
    // Alterna o status de favorito direto no Supabase ao clicar no coração
    const toggleFavorite = async (e) => {
        e.stopPropagation(); // Evita ações indesejadas na linha/card

        try {
            const { error } = await supabase
                .from('livros')
                .update({ favorite: !book.favorite }) // Inverte o valor atual (true vira false e vice-versa)
                .eq('id', book.id);

            if (error) throw error;

            if (onUpdate) onUpdate(); // Recarrega a lista de livros no App.jsx automaticamente
        } catch (err) {
            console.error('❌ Erro ao atualizar favorito:', err.message);
            alert('Não foi possível atualizar o favorito: ' + err.message);
        }
    };

    // Altera o status do livro (Lido / Quero Ler) clicando na badge da capa
    const toggleStatus = async (e) => {
        e.stopPropagation();
        const nextStatus = book.status === 'Read' ? 'To-Read' : 'Read';

        try {
            const { error } = await supabase
                .from('livros')
                .update({ status: nextStatus })
                .eq('id', book.id);

            if (error) throw error;
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('❌ Erro ao atualizar status:', err.message);
        }
    };

    return (
        <div className={styles.card}>
            {/* ÁREA DA CAPA */}
            <div className={styles.coverWrapper}>
                {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className={styles.coverImage} />
                ) : (
                    <div className={styles.placeholderCover}>
                        <span>{book.title ? book.title.charAt(0).toUpperCase() : '📖'}</span>
                    </div>
                )}

                {/* Badge Interativa de Status */}
                <span
                    className={`${styles.statusBadge} ${book.status === 'Read' ? styles.badgeRead : styles.badgeToRead}`}
                    onClick={toggleStatus}>
                    {book.status === 'Read' ? '✓ Lido' : '⏳ Quero Ler'}
                </span>
            </div>

            {/* TEXTOS E INFORMAÇÕES */}
            <div className={styles.bookInfo}>
                <div className={styles.titleRow}>
                    <h4 className={styles.bookTitle}>{book.title}</h4>

                    {/* Botão do Coração: Dinâmico baseado no banco de dados */}
                    <button
                        className={`${styles.favBtn} ${book.favorite ? styles.isFav : ''}`}
                        onClick={toggleFavorite}
                        title={book.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
                        {book.favorite ? '💜' : '🤍'}
                    </button>
                </div>

                <p className={styles.bookAuthor}>{book.author}</p>
                <span className={styles.bookGenre}>{book.genre}</span>

                {/* Avaliação por Estrelas */}
                <div className={styles.ratingRow}>
                    <span className={styles.stars}>
                        {'★'.repeat(Number(book.rating || 5)) +
                            '☆'.repeat(5 - Number(book.rating || 5))}
                    </span>
                    <span className={styles.ratingNumber}>{book.rating || 5}.0</span>
                </div>
            </div>
        </div>
    );
}
