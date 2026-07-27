import { Link } from 'react-router-dom'
import { Home, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import './Footer.css'

const SocialIcons = {
  Instagram: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  Twitter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Linkedin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Youtube: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" />
    </svg>
  ),
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L48 55C96 50 192 40 288 43.3C384 46.7 480 63.3 576 66.7C672 70 768 60 864 53.3C960 46.7 1056 43.3 1152 48.3C1248 53.3 1344 66.7 1392 73.3L1440 80V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z" fill="var(--color-bg-dark)"/>
        </svg>
      </div>

      <div className="footer-content">
        <div className="container-wide">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <div className="footer-logo-icon">
                  <Home size={20} />
                </div>
                <span>NestHaven</span>
              </Link>
              <p className="footer-tagline">
                Find your perfect home with India's most trusted real estate platform. 
                We connect buyers, sellers, and renters with transparency and ease.
              </p>
              <div className="footer-socials">
                <a href="#" className="social-icon" aria-label="Instagram"><SocialIcons.Instagram /></a>
                <a href="#" className="social-icon" aria-label="Twitter"><SocialIcons.Twitter /></a>
                <a href="#" className="social-icon" aria-label="LinkedIn"><SocialIcons.Linkedin /></a>
                <a href="#" className="social-icon" aria-label="YouTube"><SocialIcons.Youtube /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4 className="footer-col-title">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/properties">Buy Property</Link></li>
                <li><Link to="/rent">Rent Property</Link></li>
                <li><Link to="/properties">New Projects</Link></li>
                <li><Link to="/signup">List Your Property</Link></li>
                <li><Link to="/properties">EMI Calculator</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="footer-col">
              <h4 className="footer-col-title">Company</h4>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4 className="footer-col-title">Contact Us</h4>
              <div className="footer-contact">
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>42 MG Road, Bangalore, India 560001</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <span>+91 80 1234 5678</span>
                </div>
                <div className="contact-item">
                  <Mail size={16} />
                  <span>hello@nesthaven.in</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="footer-newsletter">
                <p className="newsletter-label">Get property alerts</p>
                <div className="newsletter-input">
                  <input type="email" placeholder="Your email" />
                  <button className="newsletter-btn" aria-label="Subscribe">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 NestHaven. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
