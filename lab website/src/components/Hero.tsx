'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
    const scrollToNext = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Parallax effect: move the background down as we scroll down
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <section ref={containerRef} className={styles.heroSection}>
            <motion.div 
                className={styles.imageWrapper} 
                style={{ y }}
            >
                {/* Light Mode Image */}
                <Image
                    src="/hero-nexus.jpg"
                    alt="Floating rock with medicinal plants"
                    width={1800}
                    height={1600}
                    className={`${styles.brandImage} ${styles.lightImage}`}
                    priority
                />
                {/* Dark Mode Image */}
                <Image
                    src="/hero-nexus-dark.jpg"
                    alt="Floating rock with medicinal plants (Dark Mode)"
                    width={1800}
                    height={1600}
                    className={`${styles.brandImage} ${styles.darkImage}`}
                    priority
                />
            </motion.div>

            <div className={styles.content}>
                <motion.button
                    className={styles.scrollIndicator}
                    onClick={scrollToNext}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <span>SCROLL</span>
                    <ArrowDown className={styles.chevron} size={20} />
                </motion.button>
            </div>
        </section>
    );
}
