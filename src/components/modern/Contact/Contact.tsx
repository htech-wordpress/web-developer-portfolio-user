import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import styles from './Contact.module.css';
import type { Contact as ContactType } from '../../../types';

interface ContactProps {
    data: ContactType;
    whatsappNumber?: string;
}

export const Contact: React.FC<ContactProps> = ({ data }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        // Simulate form submission
        setTimeout(() => {
            console.log('Form submitted:', formData);
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });

            setTimeout(() => setStatus('idle'), 3000);
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <section id="contact" className={styles.contact} ref={ref}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ y: 30, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className={styles.title}>Get In Touch</h2>
                    <p className={styles.subtitle}>We'd love to hear from you. Send us a message!</p>
                </motion.div>

                <div className={styles.content}>
                    {(data.email || data.phone || data.address || data.socialMedia) && (
                        <motion.div
                            className={styles.info}
                            initial={{ x: -30, opacity: 0 }}
                            animate={isInView ? { x: 0, opacity: 1 } : {}}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            <h3>Contact Information</h3>

                            {data.email && (
                                <div className={styles.infoItem}>
                                    <div className={styles.infoIcon}>📧</div>
                                    <div>
                                        <h4>Email</h4>
                                        <a href={`mailto:${data.email}`}>{data.email}</a>
                                    </div>
                                </div>
                            )}

                            {data.phone && (
                                <div className={styles.infoItem}>
                                    <div className={styles.infoIcon}>📱</div>
                                    <div>
                                        <h4>Phone</h4>
                                        <a href={`tel:${data.phone}`}>{data.phone}</a>
                                    </div>
                                </div>
                            )}

                            {data.address && (
                                <div className={styles.infoItem}>
                                    <div className={styles.infoIcon}>📍</div>
                                    <div>
                                        <h4>Address</h4>
                                        <p>{data.address}</p>
                                    </div>
                                </div>
                            )}

                            {data.socialMedia && (data.socialMedia.facebook || data.socialMedia.instagram || data.socialMedia.linkedin) && (
                                <div className={styles.social}>
                                    <h4>Follow Us</h4>
                                    <div className={styles.socialLinks}>
                                        {data.socialMedia.facebook && (
                                            <a href={data.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                                                Facebook
                                            </a>
                                        )}
                                        {data.socialMedia.instagram && (
                                            <a href={data.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                                                Instagram
                                            </a>
                                        )}
                                        {data.socialMedia.linkedin && (
                                            <a href={data.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                                                LinkedIn
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    <motion.form
                        className={styles.form}
                        onSubmit={handleSubmit}
                        initial={{ x: 30, opacity: 0 }}
                        animate={isInView ? { x: 0, opacity: 1 } : {}}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your name"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message">Message *</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="Tell us about your project..."
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={status === 'sending'}
                        >
                            {status === 'sending' ? 'Sending...' : status === 'success' ? '✓ Sent!' : 'Send Message'}
                        </button>

                        {status === 'success' && (
                            <p className={styles.successMessage}>
                                Thank you! We'll get back to you soon.
                            </p>
                        )}
                    </motion.form>
                </div>

                {/* Google Maps Section */}
                {data.googleMapsUrl && (
                    <motion.div
                        className={styles.mapSection}
                        initial={{ y: 30, opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <div className={styles.mapContainer}>
                            <iframe
                                src={data.googleMapsUrl}
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Maps Location"
                            />
                        </div>
                        <a
                            href={data.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.directionsBtn}
                        >
                            <span className={styles.directionsIcon}>📍</span>
                            Get Directions
                        </a>
                    </motion.div>
                )}
            </div>
        </section>
    );
};
