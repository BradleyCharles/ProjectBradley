import React from 'react';
import Link from 'next/link';
import '../styles/navbar.css'; // Import your custom CSS file

const Navbar: React.FC = () => {
    return (
        <nav>
            <div className="navbar-container">
                <div className="navbar-logo">Malworld</div>
                <ul className="navbar-links">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/about">About</Link>
                    </li>
                    <li>
                        <Link href="/projects">Projects</Link>
                    </li>
                    <li>
                        <Link href="/contact">Contact</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
