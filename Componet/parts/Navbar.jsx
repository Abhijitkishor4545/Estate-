
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, logout] = useAuth();

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const navLinks = (
        <>
            {/* Browse Properties - Guest */}
            {(!user || user.role !== "buyer") && (
                <Link
                    to="/properties"
                    className={s.navLinks}
                    onClick={() => setIsOpen(false)}
                >
                    Browse Properties
                </Link>
            )}

            {/* Buyer */}
            {user && user.role === "buyer" && (
                <>
                    <Link
                        to="/"
                        className={s.navLinks}
                        onClick={() => setIsOpen(false)}
                    >
                        Home
                    </Link>

                    <Link
                        to="/properties"
                        className={s.navLinks}
                        onClick={() => setIsOpen(false)}
                    >
                        Properties
                    </Link>

                    <Link
                        to="/wishlist"
                        className={s.navLinks}
                        onClick={() => setIsOpen(false)}
                    >
                        Wishlist
                    </Link>

                    <Link
                        to="/chat-message"
                        className={s.navLinks}
                        onClick={() => setIsOpen(false)}
                    >
                        Messages
                    </Link>

                    <Link
                        to="/contact"
                        className={s.navLinks}
                        onClick={() => setIsOpen(false)}
                    >
                        Contact Us
                    </Link>
                </>
            )}

            {/* Guest */}
            {!user && (
                <>
                    <Link
                        to="/login"
                        className={s.navLinks}
                        onClick={() => setIsOpen(false)}
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className={s.navLinks}
                        onClick={() => setIsOpen(false)}
                    >
                        Register
                    </Link>
                </>
            )}

            {/* Seller */}
            {user && user.role === "seller" && (
                <Link
                    to="/dashboard"
                    className={s.navLinks}
                    onClick={() => setIsOpen(false)}
                >
                    Dashboard
                </Link>
            )}

            {/* Admin */}
            {user && user.role === "admin" && (
                <Link
                    to="/admin-dashboard"
                    className={s.navLinks}
                    onClick={() => setIsOpen(false)}
                >
                    Admin Panel
                </Link>
            )}
        </>
    );

    return (
        <>
            <nav className="glass fixed top-0 left-0 w-full z-[100] py-2 lg:py-4">
                <div className="container px-6 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">

                        {/* Logo */}
                        <div className="justify-self-start">
                            <Logo />
                        </div>

                        {/* Desktop Menu */}
                        <div className={s.desktopMenu}>
                            {navLinks}
                        </div>

                        {/* Right Section */}
                        <div className={s.rightSection}>
                            {user ? (
                                <div className={s.userSection}>
                                    <Link to="/profile" className='flex items-center'>
                                        <img src={
                                            user.profilePic || ''
                                        } />

                                    </Link>
                                    <button onClick={logout}
                                        className={s.logoutButton}
                                    >
                                        Logout
                                    </button>
                                </div>

                            ) : null}

                            {/*mobile toggle */}
                            <div className={s.mobileToggle}
                                onClick={toggleMenu}
                            >
                                {isOpen ? <Hix size={28} /> : <HiMenuAlt3 size={28} />}

                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className={s.backdrop(isOpen)} onClick={() => setIsOpen(false)}>

            </div>
            <div className={s.drawer(isOpen)}>
                <div className={s.drawerHeader}>
                    <Logo onClick={() => setIsOpen(false)} />

                    <Hix size={28} onClick={() => setIsOpen(false)}
                        className={s.drawerCloseIcon}
                    />
                </div>

                <div className={s.drawnavLink}>
                    {navLinks}
                </div>
                {user && (
                    <>
                        <div className={s.draweruserSection}>
                            <div className={s.draweruserInfo}>
                                <img
                                    src={
                                        user.profilePic || 'https://ui-assets.com/api/?name=${user.name}&background=06de5g&color = fff'
                                    }
                                    alt="profile"
                                    className={s.drawerAvater}
                                />
                            </div>
                            <div className={s.draweruserName}>
                                {user.name}
                            </div>
                            <div className={s.draweruserEmail}>
                                {user.email}
                            </div>
                        </div>

                        <button onClick={logout} className={s.drawerLogoutButton}>
                            Logout

                        </button>
                    </>
                )}

            </div>
        </>
    );
};

export default Navbar;

