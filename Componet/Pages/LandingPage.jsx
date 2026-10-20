
import React from 'react'
import Navbar from '../parts/Navbar'
import { landingPageStyles as s } from '../../src/assets/dummyStyle'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import wishlist from '../../../backend/Models/wishlist.model'
export const LandingPage = () => {

    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [properties, setproperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, seterror] = useState(null);
    const [searchTerm, setsearchTerm] = useState("");
    const [propertyType, setPropertyType] = useState("Select Type");
    const [propertyCount, setpropertyCount] = useState({
        flat: 0,
        villa: 0,
        penthouse: 0,
        commercial: 0
    });

    const [wishlistedIds, setWishlistedIds] = useState([]);

    useEffect(() => {
        fetchproperties();
        fetchcounts();
        if (user) {
            fetchwishlist();
        }
    }, [user]);

    const fetchwishlist = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/api/wishlist`, {
                Headers: { Authorization: 'Bearer ${token}' },
            }
            );
            setWishlistedIds(
                res.data
                    .filter((item) => item.property)
                    .map((item) => item.property._id)
            )

        } catch (err) {
            console.error("Failed to fetch wishlist", err);
        }
    };

    // to remove a wishlist

    const handleToggleWishlist = async (propertyId) => {

        try {
            const isWishlisted = wishlistedIds.includes(propertyId);
            if (isWishlisted) {
                await axios.delete(`${API_URL}/api/wishlist${propertyId}`, {
                    headers: { Authorization: `Bearer${token}` },
                });

                setWishlistedIds((prev) => prev.filter((id) => id !== propertyId))
            }
            else {
                await axios.post(`${API_URL}/api/wishlist/ ${propertyId}`, {}, {
                    // to add this 
                    headers: { Authorization: `Bearer ${token}` }

                });
                // to add

                setWishlistedIds((prev) => [...prev, propertyId]);
            }

        } catch (err) {
            console.error("Failed to Toggle whislist", err);

        }

    }

    // to fetch counts
    const fetchcounts = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/property/counts`);

            if (res.data.success) {
                setpropertyCount(res.data.counts);
            }


        } catch (err) {
            console.error("Failed to fetch propertyCounts:", err);

        }
    }

    // to fetch properties

    const fetchproperties = async (search = "") => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/property?city=${search}`);
            setproperties(res.data.properties || res.data || []);
            seterror(null);
        }
        catch (err) {
            seterror("Failed to load properties please try again");
        }
        finally {
            setLoading(false);
        }
    }

    const handlesearch = (e) => {
        e.preventdefault();
        const params = new URLSearchParams();
        if (searchTerm)
            params.append("city", searchTerm);

        if (propertyType !== "Select Type")
            params.append("Type", propertyType);
        navigate(`/Properties? ${params.toString()}`);
    }
    const categories = [
        {
            name: "Modern Flats",
            count: propertyCount.flat || 0,
            icon: <HiOfficeBuilding size={32} />,
            type: "flat",
        },
        {
            name: "Luxury Villas",
            count: propertyCount.villa || 0,
            icon: <HiHome size={32} />,
            type: "villa",
        },
        {
            name: "Penthouse",
            count: propertyCount.penthouse || 0,
            icon: <HiOfficeBuilding size={32} />,
            type: "penthouse",
        },
        {
            name: "Commercial",
            count: propertyCount.commercial || 0,
            icon: <HiOfficeBuilding size={32} />,
            type: "commercial",
        },
    ];

    const features = [
        {
            title: "Verified Trust",
            desc: "Every listing is strictly audited for ownership, condition, and legality.",
            icon: <HiShieldCheck size={24} />,
        },
        {
            title: "Smart Search",
            desc: "Our AI-driven algorithms help you find the best matches based on preferences.",
            icon: <HiLightningBolt size={24} />,
        },
        {
            title: "Best Value",
            desc: "Direct-from-owner listings and zero-commission options to ensure competitive prices.",
            icon: <HiCurrencyDollar size={24} />,
        },
        {
            title: "Virtual Tours",
            desc: "High-definition 3D tours allow you to experience the property from home.",
            icon: <HiVideoCamera size={24} />,
        },
    ];







    return (
        <div className="bg-bg-main">
            <Navbar />
            {/*Hero Section*/}

            <Section className="fade-in items-center justify-center hero-section pt-32 pb-16 xl:px-60 flex items-center gap-16 overflow-hidden md:flex-col lg:flex-col xl:flex-row max-lg:flex-col max-lg:text-center max-lg: pt-28 max-lg :pb-8 max-lg: px-4 max-lg:gap-8">
                <div className="hero-content flex-1 max-lg: flex max-lg: flex-col max-lg:items-center">
                    <span className="badge bg-primary-light text-primary-dark mb-6 inline-block">
                        Trusted by 20,000+ home Owners
                    </span>
                    <h1 className="hero-title text-[clamp(2rem, 5vw, 4.5rem)] mb-6 transition-all duration-300 max-lg: text-[clamp(1.75rem,8vw,2.5rem)] max-lg:leading-tight max-lg:text-center">
                        Find Your <span className="text-gradient" >
                            PerFect
                        </span> Next Chapter
                    </h1>
                    <p className="hero-subtitle text-[1.125rem] text-text-muted mb-12 max-w-[540px] max-lg: text-base max-lg: mb-10 max-lg:mx-auto max-lg: text-center max-lg:">
                        Experience the most advanced real estate search platform. Discover verfied listing , correct with top agents & Find a place you'll love
                    </p>
                    <form onSubmit={handlesearch}
                        className="glass search-form p-5 rounded-[2rem] flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.08)] max-w-[900px] border-white/50 relative z-10 max-lg: flex-col max-lg: w-full max-lg: max-w-[500px] max-lg:mx-auto max-lg: gap-2 max-lg: rounded-[1.5rem]"
                    >
                        <div className="search-field flex-[1.2] flex items-center gap-3 py-2 px-3 transition-all duration-300 min-w-[220px] max-lg:w-full max-lg:py-4 max-lg: px-2 max-lg:border-b max-lg:border-[#f1f5f9]">
                            <div className="text-primary">
                                <HiLocationMarker size={26} />
                                <div className="flex flex-col flex-1">
                                    <label className="text-[0.7rem] font-extrabold text-text-muted uppercase tracking-[0.05rem] mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="where are you looking?"
                                        value={searchTerm}
                                        onChange={(e) => setsearchTerm(e.target.value)}
                                        className="border-none bg-transparent outline-none w-full text-base font-semibold text-text-main"
                                    />
                                </div>
                            </div>
                            <div className={s.searchDivider} />
                            <div className={s.searchField}>

                                <div className={s.textPrimary}>
                                    <HiHome size={26} />
                                </div>
                                <div className={s.flexCol}>
                                    <label clasName={s.labelSmall}> {/* */}
                                        PropertyType
                                    </label>
                                    <select value={propertyType}
                                        onChange={(e) => setPropertyType(e.target.value)}
                                        className={`${s.inputTransparent} cursor-pointer`}
                                    >
                                        <option value="Select Type">
                                            Select Type
                                        </option>
                                        <option value="Flat">
                                            Flat
                                        </option>
                                        <option value="villa">
                                            Villa
                                        </option>
                                        <option value="penthouse">
                                            PentHouse
                                        </option>
                                        <option value="commercial">
                                            commercial
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button type="Submit" className={s.searchButton}>
                            <HiSearch size={22} />
                            Search
                        </button>
                    </form>

                    
                    {/* stats*/}
                    <div className="stats-container flex gap-[clamp(1rem, 3vw, 4rem)] mt-16 max-lg: justify-center max-lg:gap-8 max-md:flex-wrap">

                        <div className="flex-1 max-md:flex-none max-md:shrink-0 max-md: basis-[120px]">
                            <h3 className="text-[clamp(1.5rem, 3vw, 2rem)] font-extrabold">
                                12k
                            </h3>
                            <p className="Uppercase text-[0.7rem] text-text-muted font-extrabold tracking-[0.05rem]">
                                Ready Properties
                            </p>
                        </div>
                        <div className="stat-item border-1 border-border-color p1-[clamp(1rem, 3vw, 4rem)] flex-1 max-lg: pl-8 max-md: border-none max-md:p1-0 max-md: flex-none max-md: shrink-0 max-md: basis-[120px]">
                            <h3 className={s.statNumber}>
                                500
                            </h3>
                            <p className="text-[clamp(1.5rem, 3vw, 2rem)] font-extrabold">
                                Agent NetWork
                            </p>
                        </div>
                    </div>
                </div>

                {/* Hero Images*/}

                <div className="hero-image-container flex-1 relative">
                    <div className="rounded-[3rem] overflow-hidden shadow -[0_40px_80px_20px_rgba(0,0,0,0.25)] relative">
                        <img src={banner} alt="banner" className="w-full h-[600px] object-cover" />
                        <div className="glass absolute bottom-8 left-8 p-6 rounded-3xl flex items-center gap-4 max-w-[300px]">
                            <div className="bg-primary-light p-3 rounded-2xl">
                                <Hishieldcheck size={24} className="text-primary" />
                            </div>
                        </div>
                        <h4 className="text-[0.9375rem] m-0 font-bold"> Verified Listing</h4>
                        <p className="text-[0.75rem] text-text-muted m-0">Inspected by our professionals team</p>
                    </div>
                </div>

            </Section>
            {/* Category section*/}

            <section className="py-24 bg-bg-alt">
                <div className={s.container}>
                    <div className="category-header flex justify-between items-end mb-12 max-sm: flex-col max-sm: items-start max-sm: gap-6">
                        <div className="max-w-[500px]">
                            <h2 className="text-[2.5rem] font-extrabold mb-4 max-sm:text-[2rem]">
                                Browser by Category
                            </h2>
                            <p className="text-text-muted">
                                explore curated collections of properties
                                tailored to your specific lifecycle and needs
                            </p>
                        </div>
                    </div>
                    <div className="category-grid grid-cols-[repeat(auto-fit, minmax(240px, 1fr))] max-sm: grid-col2-max-sm: gap-4">
                        {categories.map((car, idx) => (

                            <div key={idx} className="category-card py-10 px-6 text-center cursor-pointer bg-white rounded-3xl border-[#e2e8f0] transition-all-duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:border-primary hover:shadow-[0_12px_25px -5x_rgba(13,148, 136, 0.1)] group max-sm: py-6 max-sm:px-4" onClick={() => navigate(`properties?true=${car.type}`)}>

                                <div className="category-icon-wrapper w-16 h-16 bg-primary-light text-primary-rounded-[1.25rem] flex item-center justify-center mx-auto mb-6 transition-all duration-300 group-hover: bg-primary group-hover:text-white group-hover: scale-110 max-sm: w-12 max-sm: h-12 max-sm: mb-4 max-sm: rounded-2xl">
                                    {car.icon}
                                </div>
                                <h3 className="mb-2 text-xl font-bold max-sm:text-base">
                                    {car.name}
                                </h3>
                                <p className="text-text-muted text-[0.875rem]">
                                    {car.count.toLocaleString()}
                                    Properties
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Feature section*/}
            <Section className="py-32">
                <div className="container feature-container flex gap-24 items-center max-lg: flex-col max-lg:gap-12">
                    <div className="feature-list-container felx-1 grid grid-cols-[repeat(auto-fit, minmax(240px, 1fr))] gap-8 max-mid: grid-cols-1 max-md:gap-8">

                        {features.map((f, idx) => {
                            <div key={idx} className="feature-list-container flex-1 grid grid-cols-[repeat(auto-fit, minmax(240px,1fr))] gap-8 max-md: grid-cols-1 max-md: gap-8">
                                {features.map((f, idx) => (
                                    <div
                                        key={idx}
                                        className="fade-in feature-card-item p-8 bg-white rounded-3xl border border-[#e2e8fo] transition-all duration-300 flex flex-col items-start hover: border-primary hover: -translate-y-[5px] hover:shadow-[0_10px_25px_5px_rgba(0,0,0,0.05)]"
                                        style={{ animationDelay: '${idx * 0.1}s' }}
                                    >
                                        <div className="w-14 h-14 bg-primary-light text-primary rounded-2xl flex items-center justify-center mb-6"> {f.icon}</div>
                                        <h3 className="text-[1.125rem] mb-3 font-extrabold">{f.title}</h3>
                                        <p className="text-text-muted text-[0.875rem] leading-relaxed">{f.desc}</p>
                                    </div>
                                ))}
                            </div>

                        })}
                        <div className="flex-1">
                            <h2 className="text-[clamp(2rem, 4vw, 3.5rem)] font-extrabold mb-8">
                                Why RealEstate <br />
                                is the <span className={s.textGradient}>
                                    Preferred choice
                                </span>
                            </h2>
                            <p className="text-text-muted text-[1.125rem] mb-12 leading-[1.8]">
                                We' ve reinvented the property search experience from the group up By fucusing on transparent by techonological precision and user-centric design we help you find not just a house but a home
                            </p>
                            <ul className=''>
                                {[
                                    "Direct connection with cerfied agents",
                                    "real-time market valuation data",
                                    "secure document management System",
                                    "24/7 preminum customer support"
                                ].map((item, idx) => (
                                    <li key={idx} className='text-primary'>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a href='#process' className="inline-block mt-12 text-primary font-semibold border-b-2 hover: text-primary-dark">
                                Learn more about our process &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </Section>

            {/* now it works */}
            <section id="process" className="py-32 bg-bg-main">
                <div className={s.container}>
                    <div className="text-center mb-20 ">
                        <span className="badge bg-primary/10 text-primary mb-4 inline-block">
                            How to works
                        </span>
                        <h2 className="text-5xl mb-6 max-sm:text-4xl text-text-main font-extrabold">
                            our seamless<span className={s.textGradient}>
                                process
                            </span>

                        </h2>
                        <p className="text-text-muted max-w-[600px] mx-auto text-lg">
                            we 've simplified the journey of finding your dream home into three clear stress-free steps
                        </p>
                    </div>
                    <div className="process-grid grid grid-cols-[repeat(auto-fit, minmax(300px,1fr))] gap-2">
                        {processSteps.map((p, idx) =>
                        (<div key={p.step}
                            className={s.processCard}>
                            <div className={s.stepNumber}>
                                {p.step} </div>
                            <div className={s.processIconWrapper}>
                                {p.icon} </div> <h3 className={s.processCardTitle}>
                                {p.title} </h3> <p className={s.processCardDesc}> {p.desc} </p> </div>))}

                    </div>

                </div>

            </section>
            {/* Feature collection */}
            <section className="py-24 bg-bg-alt">
                <div className={s.container}>
                    <div className="text-center mb-16">
                        <span className="badge bg-primary-light text-primary mb-4 inline-block">
                            handpicked for you
                        </span>

                        <h2 className="text-5xl mb-6 max-sm:text-4xl font-extrahold text-text-main">
                            Featured collections
                        </h2>
                        <p className="text-text-muted max-w-[600px] mx-auto text-lg pt-1 pb-1">
                            Discover high-value properties curated by our experts for their exceptional design, locations, and investment potential.
                        </p>
                    </div>

                    {loading ? (<div className="flex justify-center items-center py-20 min-h-[400px]">
                        <div className="loading w-10 h-10 border-4 border-solid border-secondary border-t-primary rounded-full animate-spin mx-auto"></div>
                    </div>) :
                        error ? (
                            <div className="text-center py-20 text-red-500 min-h-[300px]">
                                <p>{error}</p>

                            </div>
                        ) :
                            (
                                <div className={s.processGrid}>
                                    {properties.filter((p) => p)
                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                        .slice(0, 6)
                                        .map((property) => (
                                            <property
                                                key={property._id}
                                                property={property}
                                                isWishlisted={wishlistedIds.includes(String(property._id))}
                                                onToggleWishlist={handleToggleWishlist}
                                            />
                                        ))}
                                </div>
                            )}
                </div>
                <div className="text-center mt-20">
                    <button onClick={() => navigate("/properties")} className="btn btn-primary p-4 px-12 rounded-3xl">
                        discover more properties
                    </button>

                </div>
            </section>

            {/* Footer*/}
            <footer className="bg-white border-t border-[#e2e8fo] pt-24 pb-0">
                <div className={s.container}>
                    <div className="footer-main-grid grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-16 mb-16 max-lg:grid-cols-2 max-lg: gap-12 max-sm:grid-cols-1 min-[640px]:max-[1024px]:justify-items-center">
                        <div className="footer-brand-section max-sm:text-center max-sm:flex max-sm:flex-col max-sm:items-center">
                            <div className="flex items-center gap-2 text-2xl font-extrabold text-primary mb-6">
                                <div className="bg-primary text-white py-1.5 px-2.5 rounded-xl text-base">
                                    RE
                                </div>
                                Real Estate
                            </div>
                            <p className="text-text-muted mb-8 leading-relaxed text-[0.9375rem]">
                                The most trusted platform for buying ,selling & renting prenium real estate globally.
                                we make property honting seamless
                            </p>
                            <div className={s.socialIcon}>                             // there will be an doubt 
                                {[facebook, Fatwitter, FaInsstorage, faLinkedIn].map(
                                    (icon, idx) =>
                                        <a href="#" key={idx} className={s.socialIcon}>
                                            <icon size={16} />
                                        </a>

                                )}

                            </div>

                        </div>

                    </div>

                    {/* Column 4*/}
                    <div>
                        <h4 className={s.footerHeading}>
                            Newletter
                        </h4>
                        <p className={s.newsletterDesc}>
                            Subscribe to get the latest listings & marks insights directing in your inbox
                        </p>
                        <div className={s.newsletterInputWrapper}>
                            <input type="email" placeholder='Enter Your Email' className={s.newsletterInput} />
                            <button className={s.newsletterButton}>
                                Join
                            </button>

                        </div>
                    </div>
                </div>

                {/* bottom bar */}
                <div className={s.bottomBar}>
                    <div className={s.bottomBarFlex}>
                        <p>
                            &copy;
                            {new Date().getFullYear()}
                            RealEsate. ALL RIght reversed
                        </p>

                        <div className={s.footerLegalLinks}>
                            <a href="#" className={s.footerLink}>
                                privacy policy
                            </a>
                            <a href="#" className={s.footerLink}>
                                Terms & Conditions
                            </a>

                            <a href='#' className={s.footerLink}>
                                cookies and Settings
                            </a>

                        </div>
                    </div>

                    <div className={s.designCredit}>
                        <img src={logo} alt="logo" className={s.designLogo} />
                        <span className='test-muted'>
                            Designed by
                        </span>
                        <a href='https:/google.com' target='_black' className={s.designLink}>
                            Hexagon Digital Service
                        </a>

                    </div>

                </div>

            </footer>
        </div >




