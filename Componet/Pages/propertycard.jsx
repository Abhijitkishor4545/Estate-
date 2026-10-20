import React from 'react'
import { propertyCardStyles as s } from '../../src/assets/dummyStyle'
import { useAuth } from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom';

const propertycard = ({
    property,
    renderActions,
    isWishList,
    onToggleWishList
}) => {
    if (!property) return null;

    const { user } = useAuth();
    const navigate = useNavigate();

    // for the click

    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate("/login");
            return;
        }
        if (onToggleWishList) {
            onToggleWishList(property._id);
        }
    };

    const formattedprice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,

    }).format(property.price);

    const statusBadgeclass = s.badgestatus(property.status)
    return (

        <div className={s.card}>

            <Link to={`{/property/${property._id}`} className={s.Link}>
                <div className={s.imagesection}>

                    <img src={property.images[0]}
                        alt={property.title}
                        className={s.image}
                    />

                    {/* Top bages*/}

                    <div className={s.topBadges}>
                        <div className={s.badgesLeft}>
                            {
                                renderActions ? (
                                    <span className={statusBadgeclass}>
                                        {property.status === "sale" ? "available" : property.status}

                                    </span>
                                ) : (
                                    <span className={s.badgeNew}>
                                        New
                                    </span>
                                )
                            }

                            <span className={s.badgeVerified}>
                                <Hishiledcheck size={14} />
                                Verfied

                            </span>
                        </div>
                        {(!user || user.role === "buyer") && (
                            <button
                                className={s.wishlistButton(isWishList)}
                                onClick={handleWishlistClick}
                            >
                                {isWishList ? (
                                    <HiHeart size={20} />
                                ) : (
                                    <HioutlineHeart size={20} />
                                )}
                            </button>
                        )}

                    </div>
                    <div className={s.priceOverlay}>
                        <h3 className={s.price}>
                            {formattedprice}

                        </h3>

                    </div>

                    <div className={s.content}>
                        <div className='flex justify-between item-center'>
                            <span className={s.propertyType}>
                                {property.propertyType}
                            </span>

                            {property.views !== undefined && (
                                <div className={s.views}>
                                    <HiEye size={16} />{property.views}
                                </div>
                            )}

                        </div>

                        <h4 className={s.title}>
                            {property.title}
                        </h4>
                        <div className={s.location}>
                            <HiLocationMarkar className={s.locationIcon} />
                            <span className='white-space overflow-hidden text-ellipsis'>
                                {property.area},
                                {property.city}
                            </span>
                        </div>
                        <div className={s.specsGrid}>
                            {property.propertyType?.toLowerCase() === "commericial Type" ? (
                                <>
                                    <div className={s.specItem}>
                                        <div className={s.specIcon}>
                                            <HioutlineHome size={20} />

                                        </div>
                                        <div className={s.specValue}>
                                            {property.status}
                                        </div>

                                        <div className={s.specLabel}>
                                            Type
                                        </div>
                                    </div>
                                    <div className={`${s.specItem} ${s.specDivider}`}>
                                        <div className={s.specIcon}>
                                            <HiArrowsExpand size={20} />

                                        </div>
                                        <div className={s.specValue}>
                                            {property.areasize}
                                        </div>

                                        <div className={s.specLabel}>
                                            SQ LT

                                        </div>


                                    </div>
                                    <div className={s.specItem}>
                                        <div className={s.specIcon}>
                                            <Hishiledcheck size={20} />
                                        </div>
                                        <div className={s.specValue}>Ok</div>
                                        <div className={s.specLabel}>Legal</div>

                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={s.specItem}>
                                        <div className={s.specIcon}>
                                            <HioutlineHome size={20} />

                                        </div>
                                        <div className={s.specValue}>
                                            {property.bhk}
                                        </div>
                                        <div className={s.specLabel}>
                                            Beds
                                        </div>
                                    </div>
                                    <div className={`${s.specItem} ${s.specDivider}`}>
                                        <div className={s.specIcon}>
                                            <HioutlineUserGroup size={20} />

                                        </div>

                                        <div className={s.specValue}>
                                            {property.bathroomes || Math.max(1, parseInt(property.bhk) - 1 || 0)}

                                        </div>
                                        <div className={s.specLabel}>
                                            Baths
                                        </div>

                                    </div>

                                    <div className={s.specItem}>
                                        <div className={s.specIcon}>
                                            <HiArrowsExpand size={20} />

                                        </div>
                                        <div className={s.specValue}>
                                            {property.areasize}

                                        </div>
                                        <div className={s.specLabel}>
                                            sq Lt
                                        </div>
                                    </div>
                                </>

                            )}

                        </div>
                        {/* view Details Action*/}
                        {
                            !renderActions && (
                                <div className={s.viewDetailsBtn}>
                                    <button className={s.viewDetailsBtn}>
                                        View Details
                                    </button>

                                </div>
                            )}

                    </div>
                </div>
            </Link >

            {
                renderActions && (
                    <div onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                    }} onMouseDown={(e) => e.stopPropagation()} className={s.actionsContainer}>
                        {renderActions(property)}
                    </div>
                )
            }

        </div >
    )


}

export default propertycard
