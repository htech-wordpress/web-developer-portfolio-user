import { useEffect } from 'react';
import { useWebsiteData } from './hooks/useWebsiteData';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/modern/Header/Header';
import { Hero } from './components/modern/Hero/Hero';
import { About } from './components/modern/About/About';
import { Services } from './components/modern/Services/Services';
import { Testimonials } from './components/modern/Testimonials/Testimonials';
import { Contact } from './components/modern/Contact/Contact';
import { Footer } from './components/modern/Footer/Footer';
import './styles/global.css';

function App() {
  const { data, loading, error } = useWebsiteData();

  // Apply theme from database
  useTheme(data?.theme || null);

  useEffect(() => {
    if (data?.settings) {
      document.title = data.settings.websiteTitle || data.settings.businessName || 'Welcome';

      // Update favicon dynamically from database
      if (data.settings.faviconUrl) {
        const faviconLink = document.getElementById('favicon') as HTMLLinkElement;
        if (faviconLink) {
          faviconLink.href = data.settings.faviconUrl;

          // Determine MIME type from URL extension
          const ext = data.settings.faviconUrl.split('.').pop()?.toLowerCase();
          if (ext === 'ico') {
            faviconLink.type = 'image/x-icon';
          } else if (ext === 'png') {
            faviconLink.type = 'image/png';
          } else if (ext === 'svg') {
            faviconLink.type = 'image/svg+xml';
          } else if (ext === 'jpg' || ext === 'jpeg') {
            faviconLink.type = 'image/jpeg';
          }

          console.log('🎯 Updated favicon:', data.settings.faviconUrl);
        }
      }

      // Apply dynamic CSS variables for colors
      const primaryColor = data.settings.primaryColor || '#0066FF';
      const secondaryColor = data.settings.secondaryColor || '#FFCC00';
      const gradientType = data.settings.gradientType || 'linear';

      // Create gradient based on type
      const gradient = gradientType === 'radial'
        ? `radial-gradient(circle, ${primaryColor}, ${secondaryColor})`
        : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;

      // Set CSS variables
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      document.documentElement.style.setProperty('--secondary-color', secondaryColor);
      document.documentElement.style.setProperty('--gradient', gradient);

      console.log('🎨 Applied theme colors:', { primaryColor, secondaryColor, gradientType });
    }
  }, [data]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2563eb, #1e40af)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</h1>
          <h2 style={{ marginBottom: '1rem' }}>Error Loading Website</h2>
          <p style={{ color: '#6b7280' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Transform header menu from database format (array of strings) to component format
  const transformedMenu = data.header?.menu?.map((item: string) => {
    // Normalize the menu item to match section IDs
    let sectionId = item.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Handle common variations
    const sectionMap: { [key: string]: string } = {
      'home': 'home',
      'about': 'about',
      'about-us': 'about',
      'aboute-us': 'about', // Handle typo from database
      'services': 'services',
      'our-services': 'services',
      'contact': 'contact',
      'contact-us': 'contact',
    };

    // Use mapped section ID if available, otherwise use generated ID
    const href = `#${sectionMap[sectionId] || sectionId}`;

    return {
      label: item,
      href: href
    };
  });

  return (
    <div className="app">
      {/* Header Navigation */}
      <Header
        siteName={data.settings.businessName}
        logo={data.header?.logoUrl || data.settings.logoUrl}
        title={data.header?.title}
        subtitle={data.header?.subtitle}
        menu={transformedMenu}
      />

      {/* Hero Section */}
      {data.homepage && (
        <Hero
          data={{
            heading: data.homepage.heroHeading,
            tagline: data.homepage.heroSubtext,
            slides: data.homepage.heroSlides
          }}
        />
      )}

      {/* Services Section */}
      {data.services && data.services.length > 0 && (
        <Services
          data={{
            title: 'Our Services',
            subtitle: 'Discover what we offer',
            services: data.services
          }}
          whatsappNumber={data.contact?.phone}
        />
      )}

      {/* About Section */}
      {data.about && (
        <About data={data.about} />
      )}

      {/* Testimonials Section */}
      {data.homepage?.testimonials && data.homepage.testimonials.length > 0 && (
        <Testimonials testimonials={data.homepage.testimonials} />
      )}

      {/* Contact Section */}
      {data.contact && (
        <Contact
          data={data.contact}
          whatsappNumber={data.whatsapp?.phoneNumber}
        />
      )}

      {/* Footer */}
      <Footer
        siteName={data.settings.businessName}
        logo={data.settings.logoUrl}
        tagline={data.settings.websiteTitle}
        email={data.contact?.email}
        phone={data.contact?.phone}
        socialMedia={data.contact?.socialMedia}
      />
    </div>
  );
}

export default App;
