import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.container}>
            {/* Hero Skeleton */}
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={`${styles.skeleton} ${styles.tagline}`}></div>
                    <div className={`${styles.skeleton} ${styles.title}`}></div>
                    <div className={`${styles.skeleton} ${styles.subtitle}`}></div>
                </div>
            </div>

            {/* Cards Skeleton */}
            <div className={styles.section}>
                <div className={`${styles.skeleton} ${styles.sectionTitle}`}></div>
                <div className={styles.grid}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={styles.card}>
                            <div className={`${styles.skeleton} ${styles.cardImage}`}></div>
                            <div className={styles.cardContent}>
                                <div className={`${styles.skeleton} ${styles.cardMeta}`}></div>
                                <div className={`${styles.skeleton} ${styles.cardTitle}`}></div>
                                <div className={`${styles.skeleton} ${styles.cardExcerpt}`}></div>
                                <div className={`${styles.skeleton} ${styles.cardExcerpt} ${styles.short}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
