import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './About.module.css';
import type { About as AboutType } from '../../../types';

interface AboutProps {
    data: AboutType;
}

// Helper function to preserve text formatting (line breaks)
const formatText = (text: string) => {
    return text.split('\n').map((line, index, array) => (
        <span key={index}>
            {line}
            {index < array.length - 1 && <br />}
        </span>
    ));
};

export const About: React.FC<AboutProps> = ({ data }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Debug logging
    console.log('About component data:', data);
    console.log('Core values:', data.coreValues);
    console.log('Innovation:', data.coreValues?.innovation);
    console.log('Excellence:', data.coreValues?.excellence);
    console.log('Trust:', data.coreValues?.trust);

    return (
        <section id="about" className={styles.about} ref={ref}>
            <div className={styles.container}>
                {/* About Title & Description with Optional Image */}
                {(data.title || data.description) && (
                    <div className={styles.aboutIntro}>
                        {data.introImageUrl ? (
                            // Layout with Image
                            <div className={styles.introWithImage}>
                                <motion.div
                                    className={styles.introText}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                >
                                    {data.title && <h2 className={styles.mainTitle}>{data.title}</h2>}
                                    {data.description && (
                                        <p className={styles.mainDescription}>{formatText(data.description)}</p>
                                    )}
                                </motion.div>
                                <motion.div
                                    className={styles.introImageWrapper}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                >
                                    <img src={data.introImageUrl} alt="About Us" />
                                </motion.div>
                            </div>
                        ) : (
                            // Center-aligned without Image
                            <motion.div
                                className={styles.introTextOnly}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                {data.title && <h2 className={styles.mainTitle}>{data.title}</h2>}
                                {data.description && (
                                    <p className={styles.mainDescription}>{formatText(data.description)}</p>
                                )}
                            </motion.div>
                        )}
                    </div>
                )}

                {/* Mission & Vision Section with Optional Image */}
                {(data.mission || data.vision) && (
                    <div className={styles.missionVisionSection}>
                        <div className={styles.aboutGrid}>
                            {/* Left: Image (if provided) */}
                            {data.imageUrl && (
                                <motion.div
                                    className={styles.aboutImageWrapper}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    <img src={data.imageUrl} alt="Our Mission & Vision" />
                                </motion.div>
                            )}

                            {/* Right: Mission & Vision (full width if no image) */}
                            <div className={`${styles.missionVisionContainer} ${!data.imageUrl ? styles.fullWidth : ''}`}>
                                {/* Mission */}
                                {data.mission && (
                                    <motion.div
                                        className={styles.missionVisionCard}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                    >
                                        <div className={styles.cardIcon}>🎯</div>
                                        <div className={styles.cardContent}>
                                            <h3>Our Mission</h3>
                                            <p>{formatText(data.mission)}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Vision */}
                                {data.vision && (
                                    <motion.div
                                        className={styles.missionVisionCard}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.7, duration: 0.6 }}
                                    >
                                        <div className={styles.cardIcon}>📊</div>
                                        <div className={styles.cardContent}>
                                            <h3>Our Vision</h3>
                                            <p>{formatText(data.vision)}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Component 3: Why Choose Us */}
                {data.whyChoose && (
                    <motion.div
                        className={styles.whyChooseSection}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <div className={styles.whyChooseCard}>
                            <div className={styles.icon}>⭐</div>
                            <div>
                                <h3>Why Choose Us</h3>
                                <p>{formatText(data.whyChoose)}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Component 4: Core Values (Excellence, Innovation, Trust) */}
                {((data.coreValues && (data.coreValues?.innovation || data.coreValues?.excellence || data.coreValues?.trust)) ||
                    (data.innovation || data.excellence || data.trust)) && (
                        <div className={styles.coreValuesSection}>
                            <motion.h3
                                className={styles.valuesTitle}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.7, duration: 0.5 }}
                            >
                                Our Core Values
                            </motion.h3>
                            <div className={styles.valuesGrid}>
                                {(data.coreValues?.innovation || data.innovation) && (
                                    <motion.div
                                        className={styles.value}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 0.8, duration: 0.5 }}
                                    >
                                        <div className={styles.valueIcon}>💡</div>
                                        <h4>Innovation</h4>
                                        <p>{formatText((data.coreValues?.innovation || data.innovation) || '')}</p>
                                    </motion.div>
                                )}
                                {(data.coreValues?.excellence || data.excellence) && (
                                    <motion.div
                                        className={styles.value}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 0.9, duration: 0.5 }}
                                    >
                                        <div className={styles.valueIcon}>⭐</div>
                                        <h4>Excellence</h4>
                                        <p>{formatText((data.coreValues?.excellence || data.excellence) || '')}</p>
                                    </motion.div>
                                )}
                                {(data.coreValues?.trust || data.trust) && (
                                    <motion.div
                                        className={styles.value}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 1.0, duration: 0.5 }}
                                    >
                                        <div className={styles.valueIcon}>🤝</div>
                                        <h4>Trust</h4>
                                        <p>{formatText((data.coreValues?.trust || data.trust) || '')}</p>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    )}
            </div>
        </section>
    );
};
