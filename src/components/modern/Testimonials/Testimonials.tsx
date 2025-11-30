import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './Testimonials.module.css';

interface Testimonial {
    customerName: string;
    feedback: string;
    rating: number;
}

interface TestimonialsProps {
    testimonials: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    if (!testimonials || testimonials.length === 0) {
        return null; // Don't render if no testimonials
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6 }
        }
    };

    // Render stars
    const renderStars = (rating: number) => {
        return (
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= rating ? styles.starFilled : styles.starEmpty}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <section className={styles.testimonials} ref={ref}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ y: 30, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className={styles.title}>What Our Clients Say</h2>
                    <p className={styles.subtitle}>
                        Don't just take our word for it - hear from our satisfied customers
                    </p>
                </motion.div>

                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={styles.quote}>"</div>
                            <div className={styles.content}>
                                <p className={styles.feedback}>{testimonial.feedback}</p>
                                {renderStars(testimonial.rating)}
                                <div className={styles.customer}>
                                    <div className={styles.avatar}>
                                        {testimonial.customerName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={styles.info}>
                                        <h4 className={styles.name}>{testimonial.customerName}</h4>
                                        <p className={styles.role}>Customer</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
