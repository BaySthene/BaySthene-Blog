import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.errorCode}>
                    <span className={styles.four}>4</span>
                    <span className={styles.zero}>0</span>
                    <span className={styles.four}>4</span>
                </div>

                <h1 className={styles.title}>Sayfa Bulunamadı</h1>
                <p className={styles.description}>
                    Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                </p>

                <div className={styles.actions}>
                    <Link href="/" className={styles.primaryButton}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                        </svg>
                        Ana Sayfaya Dön
                    </Link>

                    <Link href="/search" className={styles.secondaryButton}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                        Yazılarda Ara
                    </Link>
                </div>

                <div className={styles.decoration}>
                    <div className={styles.blob1}></div>
                    <div className={styles.blob2}></div>
                </div>
            </div>
        </div>
    );
}
