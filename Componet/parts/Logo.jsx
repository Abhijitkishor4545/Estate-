import React from 'react'
import { logoStyles } from '../../src/assets/dummyStyle'
import { Link } from 'react-router-dom';

const Logo = ({
    fontsize = "1.5rem",
    iconsize = 24,
    showtext = true,
    ...props
}) => {
    return (
        <Link to="/" className={'${s.Link} $props.className || "" }'} style={{ fontsize, ...props.style }}>
            <div className={s.iconWrapper}>
                <HioutlineLibrary size={iconsize} />
            </div>

            showtext && <span className={s.text}>
                RealEstate
            </span>

        </Link>
    )
}


export default Logo