import Image from "next/image";
import styles from "./page.module.css";
import Navbar from '../components/layout/HeaderComponent';

export default function Home() {
  return (

    <div className={styles.page}>
        <Navbar />
      <main className={styles.main}>

      </main>
      <footer className={styles.footer}>

      </footer>
    </div>
  );
}
