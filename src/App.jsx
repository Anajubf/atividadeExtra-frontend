import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

import BookCard from './components/BookCard';
import BookForm from './components/BookForm';

import appStyles from './App.module.css';
import './index.css';

export default function App() {
    const [books, setBooks] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('all'); // 'all' | 'read' | 'to-read' | 'favorites'
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // Busca os dados em tempo real do Supabase
    const fetchBooks = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('livros')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;
            setBooks(data || []);
        } catch (err) {
            console.error('❌ Erro ao buscar livros:', err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // Adiciona um novo livro no banco de dados
    const handleAddBook = async (bookData) => {
        try {
            const { error } = await supabase.from('livros').insert([
                {
                    title: bookData.title,
                    author: bookData.author,
                    cover_url: bookData.cover_url || null,
                    rating: bookData.rating || 5,
                    bg: bookData.bg || '#1e1b2e',
                    status: bookData.status || 'To-Read',
                    genre: bookData.genre || 'Geral',
                    favorite: bookData.favorite || false,
                },
            ]);

            if (error) throw error;

            setShowForm(false);
            fetchBooks();
        } catch (err) {
            console.error('❌ Erro ao adicionar livro:', err.message);
            alert('Erro ao salvar: ' + err.message);
        }
    };

    // Estatísticas dos cards superiores
    const totalBooks = books.length;
    const readBooks = books.filter((b) => b.status === 'Read').length;
    const toReadBooks = books.filter((b) => b.status === 'To-Read').length;
    const favoriteBooks = books.filter((b) => b.favorite === true).length;

    const percentRead = totalBooks > 0 ? Math.round((readBooks / totalBooks) * 100) : 0;
    const percentToRead = totalBooks > 0 ? Math.round((toReadBooks / totalBooks) * 100) : 0;

    // Filtro combinado de Abas (Status) + Gêneros da Barra Lateral
    const filteredBooks = books.filter((book) => {
        let matchesTab = true;
        if (currentFilter === 'read') matchesTab = book.status === 'Read';
        if (currentFilter === 'to-read') matchesTab = book.status === 'To-Read';
        if (currentFilter === 'favorites') matchesTab = book.favorite === true;

        let matchesGenre = true;
        if (selectedGenre !== 'all') matchesGenre = book.genre === selectedGenre;

        return matchesTab && matchesGenre;
    });

    return (
        <div className={appStyles.appLayout}>
            {/* SIDEBAR ESQUERDA */}
            <aside className={appStyles.sidebar}>
                <div className={appStyles.logoArea}>
                    <div className={appStyles.logoIcon}>🔮</div>
                    <div>
                        <h2 className={appStyles.logoText}>InkShelf</h2>
                        <span className={appStyles.logoSubtext}>Biblioteca cuidada</span>
                    </div>
                </div>

                <nav className={appStyles.sideNav}>
                    <button
                        className={
                            currentFilter === 'all' && selectedGenre === 'all'
                                ? appStyles.activeSideBtn
                                : appStyles.sideBtn
                        }
                        onClick={() => {
                            setCurrentFilter('all');
                            setSelectedGenre('all');
                        }}>
                        <span className={appStyles.btnIcon}>📚</span> Todos os livros
                    </button>
                    <button
                        className={
                            currentFilter === 'read' ? appStyles.activeSideBtn : appStyles.sideBtn
                        }
                        onClick={() => setCurrentFilter('read')}>
                        <span className={appStyles.btnIcon}>✓</span> Lidos
                    </button>
                    <button
                        className={
                            currentFilter === 'to-read'
                                ? appStyles.activeSideBtn
                                : appStyles.sideBtn
                        }
                        onClick={() => setCurrentFilter('to-read')}>
                        <span className={appStyles.btnIcon}>⏳</span> Quero ler
                    </button>
                    <button
                        className={
                            currentFilter === 'favorites'
                                ? appStyles.activeSideBtn
                                : appStyles.sideBtn
                        }
                        onClick={() => setCurrentFilter('favorites')}>
                        <span className={appStyles.btnIcon}>💜</span> Favoritos
                    </button>
                </nav>

                {/* SESSÃO DE GÊNEROS TOTALMENTE INTERATIVA */}
                <div className={appStyles.genreSection}>
                    <p className={appStyles.genreHeading}>GÊNEROS</p>
                    {[
                        { name: 'Romance', icon: '💜' },
                        { name: 'Fantasia', icon: '🧜‍♀️' },
                        { name: 'Mistério', icon: '🕵️‍♂️' },
                        { name: 'Aventura', icon: '⛺' },
                        { name: 'Clássicos', icon: '📚' },
                        { name: 'Young Adult', icon: '🔮' },
                    ].map((genre) => (
                        <button
                            key={genre.name}
                            className={
                                selectedGenre === genre.name
                                    ? appStyles.activeGenreBtn
                                    : appStyles.genreBtn
                            }
                            onClick={() => setSelectedGenre(genre.name)}>
                            <span className={appStyles.genreIcon}>{genre.icon}</span> {genre.name}
                        </button>
                    ))}
                </div>
            </aside>

            {/* CONTEÚDO PRINCIPAL (DIREITA) */}
            <div className={appStyles.mainViewport}>
                <header className={appStyles.topHeader}>
                    <div>
                        <h1 className={appStyles.welcomeText}>Olá, Leitora! 👋</h1>
                        <p className={appStyles.welcomeSub}>Bem-vinda à sua biblioteca pessoal</p>
                    </div>
                    <button className={appStyles.addBookBtn} onClick={() => setShowForm(!showForm)}>
                        {showForm ? '✕ Fechar' : '＋ Adicionar livro'}
                    </button>
                </header>

                {showForm && <BookForm onAddBook={handleAddBook} />}

                {/* CARDS DE METRICAS */}
                <section className={appStyles.statsGrid}>
                    <div className={appStyles.statCard}>
                        <div className={`${appStyles.statIcon} ${appStyles.iconPurple}`}>🔮</div>
                        <div>
                            <h3>Total de livros</h3>
                            <h2>{totalBooks}</h2>
                            <p>na sua estante</p>
                        </div>
                    </div>
                    <div className={appStyles.statCard}>
                        <div className={`${appStyles.statIcon} ${appStyles.iconGreen}`}>✓</div>
                        <div>
                            <h3>Lidos</h3>
                            <h2>{readBooks}</h2>
                            <p>{percentRead}% do total</p>
                        </div>
                    </div>
                    <div className={appStyles.statCard}>
                        <div className={`${appStyles.statIcon} ${appStyles.iconOrange}`}>⏳</div>
                        <div>
                            <h3>Quero ler</h3>
                            <h2>{toReadBooks}</h2>
                            <p>{percentToRead}% do total</p>
                        </div>
                    </div>
                    <div className={appStyles.statCard}>
                        <div className={`${appStyles.statIcon} ${appStyles.iconPink}`}>💜</div>
                        <div>
                            <h3>Favoritos</h3>
                            <h2>{favoriteBooks}</h2>
                            <p>Livros favoritos</p>
                        </div>
                    </div>
                </section>

                {/* FILTROS INTERNOS */}
                <div className={appStyles.innerTabsBar}>
                    <div className={appStyles.tabsGroup}>
                        <button
                            className={
                                currentFilter === 'all' ? appStyles.activeTab : appStyles.tabBtn
                            }
                            onClick={() => setCurrentFilter('all')}>
                            Todos
                        </button>
                        <button
                            className={
                                currentFilter === 'read' ? appStyles.activeTab : appStyles.tabBtn
                            }
                            onClick={() => setCurrentFilter('read')}>
                            Lidos
                        </button>
                        <button
                            className={
                                currentFilter === 'to-read' ? appStyles.activeTab : appStyles.tabBtn
                            }
                            onClick={() => setCurrentFilter('to-read')}>
                            Quero ler
                        </button>
                        <button
                            className={
                                currentFilter === 'favorites'
                                    ? appStyles.activeTab
                                    : appStyles.tabBtn
                            }
                            onClick={() => setCurrentFilter('favorites')}>
                            Favoritos
                        </button>
                    </div>
                </div>

                {/* GRADE DE LIVROS REAIS */}
                <main className={appStyles.booksGrid}>
                    {loading ? (
                        <p className={appStyles.statusMessage}>Sincronizando estante...</p>
                    ) : filteredBooks.length === 0 ? (
                        <p className={appStyles.statusMessage}>
                            Nenhum livro cadastrado nessa categoria.
                        </p>
                    ) : (
                        filteredBooks.map((book) => (
                            <BookCard key={book.id} book={book} onUpdate={fetchBooks} />
                        ))
                    )}
                </main>
            </div>
        </div>
    );
}
