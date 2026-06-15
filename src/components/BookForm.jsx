import { useState } from 'react';
import styles from './BookForm.module.css';

export default function BookForm({ onAddBook }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [genre, setGenre] = useState('Romance'); // Padrão inicial
    const [status, setStatus] = useState('To-Read');
    const [rating, setRating] = useState(5);
    const [favorite, setFavorite] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim() || !author.trim()) {
            alert('Por favor, preencha pelo menos o Título e o Autor!');
            return;
        }

        // Envia os dados estruturados para a função handleAddBook no App.jsx
        onAddBook({
            title,
            author,
            cover_url: coverUrl.trim() || null,
            genre,
            status,
            rating: Number(rating),
            favorite,
        });

        // Limpa o formulário após o envio
        setTitle('');
        setAuthor('');
        setCoverUrl('');
        setGenre('Romance');
        setStatus('To-Read');
        setRating(5);
        setFavorite(false);
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    placeholder="Título do Livro"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="Autor"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={styles.input}
                />
            </div>

            <div className={styles.inputGroupRow}>
                <input
                    type="url"
                    placeholder="URL da Imagem da Capa (opcional)"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className={styles.inputUrl}
                />

                <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className={styles.select}>
                    <option value="Romance">Romance 💜</option>
                    <option value="Fantasia">Fantasia 🧜‍♀️</option>
                    <option value="Mistério">Mistério 🕵️‍♂️</option>
                    <option value="Aventura">Aventura ⛺</option>
                    <option value="Clássicos">Clássicos 📚</option>
                    <option value="Young Adult">Young Adult 🔮</option>
                </select>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={styles.select}>
                    <option value="To-Read">Quero Ler ⏳</option>
                    <option value="Read">Lido ✓</option>
                </select>

                <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className={styles.selectSmall}>
                    <option value="5">5 ★</option>
                    <option value="4">4 ★</option>
                    <option value="3">3 ★</option>
                    <option value="2">2 ★</option>
                    <option value="1">1 ★</option>
                </select>
            </div>

            <div className={styles.footerRow}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={favorite}
                        onChange={(e) => setFavorite(e.target.checked)}
                        className={styles.checkbox}
                    />
                    <span>Marcar como Favorito 💜</span>
                </label>

                <button type="submit" className={styles.submitBtn}>
                    Salvar na Estante
                </button>
            </div>
        </form>
    );
}
