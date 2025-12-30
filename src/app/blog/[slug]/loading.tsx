import styles from './loading.module.css';

export default function BlogLoading() {
    return (
        <div className={styles.container}>
            <div className={styles.layout}>
                <article className={styles.article}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={`${styles.skeleton} ${styles.backLink}`}></div>
                        <div className={`${styles.skeleton} ${styles.meta}`}></div>
                        <div className={`${styles.skeleton} ${styles.title}`}></div>
                        <div className={styles.tags}>
                            <div className={`${styles.skeleton} ${styles.tag}`}></div>
                            <div className={`${styles.skeleton} ${styles.tag}`}></div>
                            <div className={`${styles.skeleton} ${styles.tag}`}></div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className={`${styles.skeleton} ${styles.coverImage}`}></div>

                    {/* Content */}
                    <div className={styles.content}>
                        <div className={`${styles.skeleton} ${styles.paragraph}`}></div>
                        <div className={`${styles.skeleton} ${styles.paragraph}`}></div>
                        <div className={`${styles.skeleton} ${styles.paragraph} ${styles.short}`}></div>

                        <div className={`${styles.skeleton} ${styles.heading}`}></div>
                        <div className={`${styles.skeleton} ${styles.paragraph}`}></div>
                        <div className={`${styles.skeleton} ${styles.paragraph}`}></div>

                        <div className={`${styles.skeleton} ${styles.codeBlock}`}></div>

                        <div className={`${styles.skeleton} ${styles.paragraph}`}></div>
                        <div className={`${styles.skeleton} ${styles.paragraph} ${styles.short}`}></div>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={`${styles.skeleton} ${styles.toc}`}></div>
                </aside>
            </div>
        </div>
    );
}
