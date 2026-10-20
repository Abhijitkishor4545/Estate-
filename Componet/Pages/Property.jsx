import React, { useRef, useState } from "react";
import { propertiesStyles as s } from "../../src/assets/dummyStyle";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Property = () => {
    const property = () => {
        const navigate = useNavigate();
        const { user, token } = useAuth();
        const location = uselocation();
        const [properties, setproperties] = useState();
        const [wishlistedIds, setWishlistedIds] = useState(true);

        const [error, setError] = useState(null);
        const [viewMode, setviewmode] = useState("grid");

        const [filter, setFilters] = useState({
            city: "",
            propertyType: [],
            bhk: "",
            maxprice: 100000000,
            amenities: [],
            furshing: [],
            sort: "latest"
        });
        const propertyType = [
            { label: "flat/ Apartment", value: "flat" },
            { label: "Independent House/ villa", value: "Villa" },
            { label: "penthouse", value: "penthouse" },
            { label: "commercial", value: "commercial" },

        ];
        const bhkoptions = ["1", "2", "3", "4", "5+"];
        const furshingoptions = [
            { label: "Furshined", value: "furshed" },
            { label: "semi-furshied", value: "semi-furshied" },
            { label: "Unfornished", value: "Unfounoshed" }
        ];

        useEffect(() => {
            const queryparams = new URLSearchParams(location.search);
            const city = queryparams.get("city") || " ";
            const type = queryparams.get("type") || " ";
            const bhk = queryparams.get("bhk") || " ";
            const intialfilters = {
                ...filter,
                city,
                propertyType: type ? [type] : [],
                bhk,
            };
            setFilters(intialfilters);
            fetchproperties(intialfilters);

            if (user) {
                fetchwishlist();
            }
        }, [location.search, user]);

        const fetchwishlist = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/wishlist`, {
                    headers: { Authorization: `Bearer${token}` }
                });

                setWishlistedIds(
                    res.data.filter((item) => item.property).map((item) => String(item.property._id))
                );

            }
            catch (err) {
                console.error("Failed to fetch wishlist: ", err);

            }
        };

        // to toggle wishlist

        const handleToggleWishlist = async (propertyId) => {
            try {
                const isWishlisted = wishlistedIds.include(propertyId);
                if (isWishlisted) {
                    await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
                        header: { Authorization: `bearer ${token}` }

                    });
                    setWishlistedIds((prev) => prev.filter((id) => id !== propertyId));

                } else {
                    await axios.post(
                        `${API_URL}/api/wishlist/${propertyId}`,
                        {
                            header: { Authorization: `Bearer ${token}` },
                        },
                    );
                    setWishlistedIds((prev) => [...prev, propertyId]);

                }
            }
            catch (err) {
                console.error("Failed to toggle wishlist: ", err);
            }
        }
    }

    // to fetch property

    const fetchproperties = async (currentfilters) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (currentfilters.city) params.append("city", currentfilters.city);
            if (currentfilters.propertyType.length > 0) params.append("propertyType", currentfilters.propertyType.join(","));
            if (currentfilters.bhk) params.append("bhk", currentfilters.bhk);
            if (currentfilters.maxprice) params.append("maxprice", currentfilters.maxprice);
            if (currentfilters.furshing && currentfilters.furshing.length > 0) params.append("furshing", currentfilters.furshing.join(","));

            if (currentfilters.sort) params.append("sort", currentfilters.sort);

            const res = await axios.get(
                `${API_URL}/api/property?${params.toString()}`,
            );

            fetchproperties(res.data.properties);
            setError(null);

        }
        catch (err) {

            setError("failed to load properties please try again later");

        }
        finally {
            setLoading(false);
        }
    };

    const fetchTimer = useRef(null);

    const debounced = (updateFilter) => {
        if (fetchTimer.current) {
            clearTimeout(fetchTimer.current);
        }

        fetchTimer.current = setTimeout(() => {
            fetchproperties(updateFilter);
        }, 500);
    };

    // // for filter fetching timer

    const handlecheckboxchange = (category, value) => {
        const current = [...(filter[category] || [])];
        const index = current.indexOf(value);
        if (index === -1) {
            current.push(value);
        }
        else {
            current.splice(index, 1);
        }
        const updateFilters = { ...filters, [category]: current };
        setFilters(updateFilters);
        fetchproperties(updateFilters);
    };

    // to update filter once toggle the checkbox

    const handlepricechange = (e) => {
        const value = parseInt(e.target.value);
        const updateFilter = {
            ...filters,
            maxprice: value
        };
        setFilters(updateFilters);
        debouncedFetch(updateFilters);

    };

    // for price filter

    const handleBhkselect = (value) => {
        const updateFilters = {
            ...filters,
            bhk: filters.bhk === value ? "" : value,

        };
        resetFilter(updateFilters);
        fetchproperties(updateFilters)
    }

    // to filter according to bhk

    const handlesortChange = (e) => {
        const newsort = e.target.value;
        const updateFilters = { ...filters, sort: newsort };
        resetFilter(updateFilters);
        fetchproperties(updateFilters)
    }

    const applyFilters = () => {
        if (fetchTimer.current) clearTimeout(fetchTimer.current);
        fetchproperties(filters)
    }
    // to apply filter by btn

    const resetFilter = () => {
        if (fetchTimer.current)
            clearTimeout(fetchTimer.current);

        const reset = {
            city: " ",
            propertyType: [],
            bhk: "",
            maxprice: 100000000,
            amenities: [],
            furnishing: [],
            sort: "latest"
        };

        // latest entry will be shown first

        setFilter(reset);
        navigate("/properties");
        fetchproperties(reset);
    };

    const [setshowMobileFilter, setshowMobileFilter] = useState(false);

    <div className={s.layout}>
        <aside className={`${s.sidebar} ${setshowMobileFilter ? s.sidebarVisible : s.sidebarHidden}`}>
            <div className={s.sidebarHeader}>
                <div className={s.sidebarTitleWrapper}>
                    <HiFilter className={s.sidebarTitleIcon} />
                    <h2 className={s.sidebarTitle}>Filters</h2>
                </div>

                <div className={s.sidebarHeaderActions}>
                    <button onClick={resetFilter} className={s.resetButton}>
                        Reset
                    </button>

                    <button className={s.closeMobileFilters}
                        onClick={() => setshowMobileFilter(false)}>
                        <Hix />
                    </button>
                </div>
            </div>
            <div className={s.filtersScrollArea}>
                <div className={s.filterSection}>
                    <label className={s.filterLabel}>Location</label>
                    <div className={s.searchInputWrapper}>
                        <Hisearch className={s.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by city..."
                            value={filters.city}
                            onChange={(e) => {
                                const updateFilters = {
                                    ...filters,
                                    city: e.target.value
                                };
                                setFilters(updateFilters);
                                debouncedFetch(updateFilters);
                            }}
                            className={s.searchInput}
                        />
                    </div>
                </div>

                <div className={s.filterSection}>
                    <div className={s.priceHeader}>
                        <label className={s.filterLabel}>Price Range</label>
                        <span className={s.pricevalue}>
                            {filters.maxprice >= 10000000
                                ? `${(filters.maxprice / 1000000).toFixed(2)}Cr`
                                : `${(filters.maxprice / 10000).toFixed(1)}`}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="100000"
                        max="100000000"
                        step="5000"
                        value={filters.maxprice}
                        onChange={handlepricechange}
                        className={s.priceSlider}
                    />

                    <div className={s.priceLabels}>
                        <span>$1l</span>
                        <span>$10cr</span>
                    </div>
                </div>

                <div className={s.filterSection}>
                    <label className={s.filterLabel}>Property Type</label>
                    <div className={s.checkboxGroup}>
                        {propertyTypes.map((type) => (
                            <label key={type.value} className={s.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={filters.propertyType.includes(type.value)}
                                    onChange={() => handlecheckboxchange("propertyType", type.value)}
                                    className={s.checkbox}
                                />
                                {type.label}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={s.filterSection}>
                    <label className={s.filterLabel}>BHK(Bedrooms)</label>
                    <div className={s.bhkGroup}>
                        {bhkoptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleBhkselect(option)}
                                className={`${s.bhkButton} ${filters.bhk === option ? s.bhkButtonActive : s.bhkButtonInactive}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={s.filterSection}>
                    <label className={s.filterLabel}>Furnishing</label>
                    <div className={s.checkboxGroup}>
                        {furnishingoptions.map((option) => (
                            <label key={option.value} className={s.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={filters.furnishing.includes(option.value)}
                                    onChange={() => handlecheckboxchange("furshing", option.value)}
                                    className={s.checkbox}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </aside>

        {/* Main content*/}
        <main className={s.mainContent}>
            <div className={s.contentHeader}>
                <div>
                    <span className={s.resultCount}>
                        showing {" "}
                        <strong className={s.resultCountStrong}>
                            {loading ? "..." : property.length}
                        </strong> {" "}
                        Properties
                    </span>
                    <div className={s.headerControls}>
                        <div className={s.viewModeToggle}>
                            <button
                                onClick={() => setviewmode("grid")}
                                className={`${s.viewModeButton} ${viewMode === "grid" ? s.viewModeActive : s.viewModeInactive
                                    }`}
                            >

                            </button>
                            <button onClick={() => setviewmode("list")}
                            >
                                className = {`${s.viewModeButton} ${viewMode === "list" ? s.viewModeActive : s.viewModeInactive}`}
                                <HiviewList size={20} />
                            </button>
                        </div>

                        <div className={s.sortControl}>
                            <span className={s.sortLabel}>
                                sort:
                            </span>

                            <select value={filters.sort} onChange={handlesortChange} className={s.sortSelect}>

                            </select>
                            <select value={filters.sort}
                                onChange={handlesortChange}
                                className={s.sortSelect}
                            >
                                <option value="latest">
                                    Latest
                                </option>
                                <option value="priceLow">
                                    price: Low to high
                                </option>
                                <option value="price high">
                                    High to Low
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Property grid*/}
                {loading ? (
                    <div className={s.skeletonGrid}>
                        {[1, 2, 3, 4, 5, 6].map((i) =>
                            <div key={i} className={s.skeletonCard}>
                            </div>
                        )}

                    </div>

                ) :
                    error ? (
                        <div className={s.errorContainer}>
                            <Hix size={48} className={s.errorIcon} />
                            <h3 className={s.errorTitle}>
                                {error}
                            </h3>
                            <button onclick={applyFilters}
                                className={e.errorButton}>
                                Try Again
                            </button>
                        </div>
                    ) :
                        property.length === 0 ? (
                            <div className={s.emptyContainer}>
                                <div className={s.emptyContainer}>
                                    <div className={s.emptyIconWrapper}>
                                        <HiAdjustments size={32} className={s.emptyIcon} />
                                    </div>

                                    <h2 className={s.emptyTitle}>
                                        No Properties found
                                    </h2>
                                    <p className={s.emptyText}>
                                        Broaded your search critaria
                                    </p>

                                    <button onclick={resetFilter}
                                        className={s.emptyButton}>
                                        Clear All
                                    </button>
                                </div>
                                ):(
                                <div className={`${s.propertyList} ${viewMode === "grid" ? s.propertyListGrid : s.propertyListList}`}>
                                    {property.filter((p) => p).map((p) => (
                                        <propertycard key={p._id} property={p}
                                            isWishlisted={wishlistedIds.includes(String(p._id))}
                                            onToggleWishlist={handleToggleWishlist}
                                        />

                                    ))}

                                </div>
                                )


                            </div>
                        )
                
                }

            </div>
        </main>
    </div>



    return (
        <div className={s.pageContainer}>
            <Navbar />
            <div className={s.container}>
                <div className={s.mobileFilterButtonWrapper}>
                    <button onClick={() => setshowMobileFilter(true)}
                        className={s.mobileFilterButton}
                    >
                        <HiFilter />
                        Show Filter & Search

                    </button>
                </div>
            </div>

        </div>
    )
}