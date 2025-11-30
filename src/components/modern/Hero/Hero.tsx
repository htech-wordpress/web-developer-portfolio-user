import { motion } from 'framer-motion';
import styles from './Hero.module.css';
import type { HeroSlide } from '../../../types';

interface HeroProps {
    data: {
        heading?: string;
        tagline?: string;
        slides?: HeroSlide[];
    };
}

export const Hero: React.FC<HeroProps> = ({ data }) => {
    return (
        <motion.section
            id="home"
            className={styles.hero}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className={styles.background}>
                <div className={styles.gradient}></div>
                <div className={styles.shapes}>
                    <div className={styles.shape1}></div>
                    <div className={styles.shape2}></div>
                    <div className={styles.shape3}></div>
                </div>
            </div>

            <div className={styles.container}>
                <motion.div
                    className={styles.content}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <motion.h1
                        className={styles.heading}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        {data.heading || 'Welcome to Our Platform'}
                    </motion.h1>

                    <motion.p
                        className={styles.tagline}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                    >
                        {data.tagline || 'Building the future, one innovation at a time'}
                    </motion.p>

                    <motion.div
                        className={styles.cta}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                    >
                        <button
                            className={styles.primaryBtn}
                            onClick={() => {
                                const contactSection = document.getElementById('contact');
                                if (contactSection) {
                                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}
                        >
                            Get Started
                        </button>
                    </motion.div>
                </motion.div>

                <motion.div
                    className={styles.scrollIndicator}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                >
                    <div className={styles.mouse}>
                        <div className={styles.wheel}></div>
                    </div>
                    <span>Scroll to explore</span>
                </motion.div>
            </div>
        </motion.section>
    );
};
