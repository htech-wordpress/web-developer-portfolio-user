import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
    siteName: string;
    logo?: string;
    title?: string;
    subtitle?: string;
    menu?: Array<{ label: string; href: string }>;
}

export const Header: React.FC<HeaderProps> = ({ siteName, logo, title, subtitle, menu }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setMobileMenuOpen(false);
        }
    };

    // Default menu if not provided from DB
    const defaultMenu = [
        { label: 'Home', href: '#home' },
        { label: 'About Us', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Contact Us', href: '#contact' }
    ];

    const navigationMenu = menu && menu.length > 0 ? menu : defaultMenu;

    return (
        <motion.header
            className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.container}>
                <div className={styles.brandSection}>
                    {logo && (
                        <div className={styles.logoWrapper}>
                            <img src={logo} alt={siteName} className={styles.logoImage} />
                        </div>
                    )}
                    <div className={styles.brandText}>
                        <h1 className={styles.brandTitle}>{title || siteName}</h1>
                        {subtitle && <p className={styles.brandSubtitle}>{subtitle}</p>}
                    </div>
                </div>

                <nav className={`${styles.nav} ${mobileMenuOpen ? styles.open : ''}`}>
                    {navigationMenu.map((item, index) => (
                        <motion.a
                            key={index}
                            href={item.href}
                            className={styles.navLink}
                            onClick={(e) => handleNavClick(e, item.href)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {item.label}
                        </motion.a>
                    ))}
                </nav>

                <button
                    className={styles.mobileToggle}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </motion.header>
    );
};
