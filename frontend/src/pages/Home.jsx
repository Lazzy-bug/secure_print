import React, { useEffect } from "react";
import { FaLock, FaClipboardList, FaCloud, FaCogs, FaShieldAlt, FaFileAlt, FaChartLine, FaExclamationTriangle } from "react-icons/fa";  // Importing necessary icons
import "./home.css";

const HomePage = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('.features-section, .why-secure-print'); // Select the sections to animate

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active'); // Add the 'active' class when the section comes into view
          observer.unobserve(entry.target); // Stop observing after it is animated
        }
      });
    }, {
      threshold: 0.5 // Trigger animation when 50% of the section is in view
    });

    sections.forEach(section => {
      observer.observe(section); // Start observing each section
    });
  }, []);

  return (
    <div className="home-page">
      {/* Header */}
      <header className="main-header">
        <div className="logo">
          <img src="/path/to/logo.png" alt="Secure Print Logo" />
        </div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#help">Help</a>
          <a href="/login">Login</a>
        </nav>
      </header>

      {/* Hero Section */}
        <header className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
          Secure Print </h1>
          <br />
          <h2 className="hero-sub-title">Your Trusted Printing Partner</h2>
            <p className="hero-description animate-slide-up">
          Experience secure, reliable, and efficient document printing.
            </p>
            <button className="cta-button animate-bounce">Get Started</button>
          </div>
          {/* <div className="hero-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="185" height="204" viewBox="0 0 185 204" fill="none">
            <path d="M25.7273 5C25.7273 2.51472 27.742 0.5 30.2273 0.5H142.746L184.5 42.7055V199C184.5 201.485 182.485 203.5 180 203.5H30.2273C27.742 203.5 25.7273 201.485 25.7273 199V5Z" fill="#31A8FF" stroke="#0C8CE9"/>
            <path d="M143.455 1.21634L183.802 42H145.955C144.574 42 143.455 40.8807 143.455 39.5V1.21634Z" fill="#C8D1EA" stroke="#0C8CE9"/>
            <path d="M0.981847 67.2434C1.14022 65.9111 2.19161 64.9086 3.52143 64.7302C8.74162 64.0303 21.9535 62.0905 31.1218 59.2844C40.8906 56.2944 55.2501 49.5108 59.6417 47.3936C60.4816 46.9887 61.4502 46.9887 62.2901 47.3936C66.6817 49.5108 81.0412 56.2944 90.81 59.2844C99.9783 62.0905 113.19 64.0303 118.41 64.7302C119.74 64.9086 120.792 65.9111 120.95 67.2434C122.668 81.6947 129.088 162.286 61.8199 182.498C61.2753 182.661 60.6565 182.661 60.1119 182.498C-7.15635 162.286 -0.735925 81.6947 0.981847 67.2434Z" fill="#C8D1EA"/>
            <mask id="path-4-inside-1_1_87" fill="white">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M52.9487 162.74C50.2886 161.522 47.8198 160.151 45.5289 158.65L67.6937 67.0218C69.9828 68.0942 72.635 69.2954 75.2844 70.405L52.9487 162.74ZM59.9457 64.289L38.457 153.122C33.012 148.079 28.8954 142.176 25.7976 135.93L41.1279 72.5553C47.7662 70.2136 56.3202 66.0646 59.6017 64.4347C59.7141 64.3788 59.829 64.3303 59.9457 64.289Z"/>
            </mask>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M52.9487 162.74C50.2886 161.522 47.8198 160.151 45.5289 158.65L67.6937 67.0218C69.9828 68.0942 72.635 69.2954 75.2844 70.405L52.9487 162.74ZM59.9457 64.289L38.457 153.122C33.012 148.079 28.8954 142.176 25.7976 135.93L41.1279 72.5553C47.7662 70.2136 56.3202 66.0646 59.6017 64.4347C59.7141 64.3788 59.829 64.3303 59.9457 64.289Z" fill="#0C8CE9"/>
            <path d="M52.9487 162.74L52.5325 163.649L53.6355 164.154L53.9207 162.975L52.9487 162.74ZM45.5289 158.65L44.557 158.415L44.3912 159.1L44.9808 159.487L45.5289 158.65ZM67.6937 67.0218L68.118 66.1162L67.0096 65.5969L66.7218 66.7866L67.6937 67.0218ZM75.2844 70.405L76.2564 70.6401L76.4567 69.8119L75.6707 69.4827L75.2844 70.405ZM59.9457 64.289L60.9176 64.5241L61.3514 62.7311L59.6122 63.3462L59.9457 64.289ZM38.457 153.122L37.7775 153.856L39.0282 155.014L39.429 153.357L38.457 153.122ZM25.7976 135.93L24.8256 135.695L24.7401 136.049L24.9017 136.375L25.7976 135.93ZM41.1279 72.5553L40.7952 71.6123L40.2835 71.7928L40.1559 72.3202L41.1279 72.5553ZM59.6017 64.4347L60.0465 65.3303V65.3303L59.6017 64.4347ZM53.365 161.831C50.7504 160.634 48.3256 159.287 46.0771 157.814L44.9808 159.487C47.314 161.016 49.8269 162.411 52.5325 163.649L53.365 161.831ZM46.5009 158.885L68.6657 67.2569L66.7218 66.7866L44.557 158.415L46.5009 158.885ZM67.2695 67.9273C69.5665 69.0035 72.232 70.2108 74.8981 71.3274L75.6707 69.4827C73.0379 68.38 70.399 67.1849 68.118 66.1162L67.2695 67.9273ZM74.3124 70.1699L51.9768 162.505L53.9207 162.975L76.2564 70.6401L74.3124 70.1699ZM58.9737 64.0539L37.4851 152.887L39.429 153.357L60.9176 64.5241L58.9737 64.0539ZM39.1366 152.389C33.7939 147.44 29.746 141.64 26.6935 135.486L24.9017 136.375C28.0449 142.712 32.2302 148.718 37.7775 153.856L39.1366 152.389ZM26.7696 136.165L42.0998 72.7905L40.1559 72.3202L24.8256 135.695L26.7696 136.165ZM41.4606 73.4984C48.163 71.134 56.7665 66.9594 60.0465 65.3303L59.1568 63.5391C55.8739 65.1697 47.3693 69.2932 40.7952 71.6123L41.4606 73.4984ZM60.0465 65.3303C60.1227 65.2924 60.2004 65.2596 60.2791 65.2318L59.6122 63.3462C59.4576 63.4009 59.3055 63.4652 59.1568 63.5391L60.0465 65.3303Z" fill="#0C8CE9" mask="url(#path-4-inside-1_1_87)"/>
            <path d="M17.4684 79.6663C17.6127 78.3311 18.6614 77.3369 19.991 77.1476C24.1171 76.56 33.0544 75.148 39.3547 73.1508C46.1522 70.996 56.0192 66.214 59.6017 64.4345C60.4634 64.0065 61.4685 64.0065 62.3302 64.4345C65.9127 66.214 75.7797 70.996 82.5772 73.1508C88.8775 75.148 97.8148 76.56 101.941 77.1476C103.271 77.3369 104.319 78.3311 104.464 79.6663C105.777 91.8214 109.518 150.426 61.8455 165.479C61.2847 165.656 60.6472 165.656 60.0864 165.479C12.4138 150.426 16.155 91.8214 17.4684 79.6663Z" stroke="#0C8CE9" stroke-width="2"/>
          </svg>
          </div> */}
        </header>

        {/* Why Secure Print Section */}
      <section className="why-secure-print">
        <h2>Why Secure Print?</h2>
        <div className="why-grid">
          <div className="why-item">
            <FaShieldAlt size={40} />
            <h3>🔒 Unmatched Security</h3>
            <p>All your documents are encrypted end-to-end, ensuring privacy.</p>
          </div>
          <div className="why-item">
            <FaCloud size={40} />
            <h3>🌐 User-Friendly Interface</h3>
            <p>Intuitive design that makes printing and document sharing seamless.</p>
          </div>
          <div className="why-item">
            <FaCogs size={40} />
            <h3>⚙️ Customizable Options</h3>
            <p>
              Tailored solutions for businesses, including role-based access and
              temporary document storage.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
{/* Shop and User Section */}
<section className="shop-user-section">
  <div className="shop-container">
    <h3>Shop/Owner</h3>
    <p>
      Manage printing tasks securely, adhering to privacy protocols while
      accessing user-uploaded documents.
    </p>
    <div className="shop-buttons">
      <button
        className="cta-button"
        onClick={() => window.open("/owner/signup", "_blank")}
      >
        Signup
      </button>
      <button
        className="cta-button secondary"
        onClick={() => window.open("/owner/login", "_blank")}
      >
        Login
      </button>
    </div>
  </div>
  <div className="user-container">
    <h3>Users</h3>
    <p>
      Upload your documents securely and track their progress for a seamless
      printing experience.
    </p>
    <div className="user-buttons">
      <button
        className="cta-button"
        onClick={() => window.open("/user/signup", "_blank")}
      >
        Signup
      </button>
      <button
        className="cta-button secondary"
        onClick={() => window.open("/user/login", "_blank")}
      >
        Login
      </button>
    </div>
  </div>
</section>

{/* Footer */}
<footer className="footer">
  <p>&copy; {new Date().getFullYear()} Secure Print. All rights reserved.</p>
</footer>

    </div>
  );
};

export default HomePage;
