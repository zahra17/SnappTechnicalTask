import React from "react";
import logo from '../../../res/images/logo.png';
function Loader() {
    return (
    <div className="loader-container">
        <img src={logo} />
        <b className="loading">در حال بارگزاری ...</b>
    </div>);
}

export default Loader;