import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './Services.module.css';
import type { Service } from '../../../types';

interface ServicesProps {
    data: {
        title?: string;
        subtitle?: string;
        services?: Service[];
    };
    whatsappNumber?: string;
}

export const Services: React.FC<ServicesProps> = ({ data, whatsappNumber }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const handleWhatsAppClick = (service: Service) => {
        if (!whatsappNumber) return;

        const message = service.whatsappMessage ||
            `Hello! I'm interested in ${service.name}. Please share more details.`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <section id="services" className={styles.services} ref={ref}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ y: 30, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className={styles.title}>
                        {data.title || 'Our Services'}
                    </h2>
                    {data.subtitle && (
                        <p className={styles.subtitle}>{data.subtitle}</p>
                    )}
                </motion.div>

                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {data.services && data.services.map((service, index) => (
                        <motion.div
                            key={service.id || index}
                            className={styles.card}
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={styles.cardGlow}></div>
                            <div className={styles.cardContent}>
                                {/* Service Name & Price */}
                                <div className={styles.titleRow}>
                                    <h3 className={styles.serviceName}>{service.name}</h3>
                                    {service.price && (
                                        <span className={styles.price}>₹{service.price}</span>
                                    )}
                                </div>

                                {/* Short Description */}
                                {service.shortDesc && (
                                    <p className={styles.shortDesc}>{service.shortDesc}</p>
                                )}

                                {/* Full Description */}
                                {service.description && (
                                    <p className={styles.description}>{service.description}</p>
                                )}

                                {/* Features List */}
                                {service.features && service.features.length > 0 && (
                                    <ul className={styles.features}>
                                        {service.features.map((feature, idx) => (
                                            <li key={idx}>
                                                <span className={styles.checkmark}>✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Service Image - Full Width after features */}
                                {(service.icon || service.iconUrl) && (
                                    <div className={styles.serviceImageWrapper}>
                                        <img
                                            src={service.icon || service.iconUrl}
                                            alt={service.name}
                                            className={styles.serviceImage}
                                        />
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className={styles.actions}>
                                    {/* WhatsApp Button */}
                                    {whatsappNumber && (
                                        <button
                                            className={styles.whatsappBtn}
                                            onClick={() => handleWhatsAppClick(service)}
                                        >
                                            <span className={styles.whatsappIcon}>📱</span>
                                            Inquire Now
                                        </button>
                                    )}

                                    {/* YouTube Video Link */}
                                    {service.youtubeUrl && (
                                        <a
                                            href={service.youtubeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.youtubeBtn}
                                        >
                                            <span className={styles.youtubeIcon}>▶</span>
                                            Watch Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
