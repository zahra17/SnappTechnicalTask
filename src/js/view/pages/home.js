import '../../../style/pages/homepage.scss';
import logo from '../../../res/images/logo.png';
import {Link} from 'react-router-dom';
import React from 'react';
function Home() {
    return (
    <div className="wrapper">
        <Link className="wrapper__nextBtn--pink" to='/vendorlist'>
            مشاهده تمامی رستوران ها
        </Link>
        <img src={logo} className="logo" />

    </div>);
}

export default Home;