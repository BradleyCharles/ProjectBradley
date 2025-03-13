import React from 'react';
import '@/styles/footer.css';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Malworld. All rights reserved.</p>

            </div>
        </footer>
    );
};

export default Footer;
