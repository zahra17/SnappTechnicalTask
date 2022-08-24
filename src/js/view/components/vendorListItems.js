import Loader from "./loader";
import { store } from "../../redux/store/store";
import {connect} from 'react-redux';

function VendorListItems(props) {
    const list = props.list;
    const isLoading = store.getState().entities.vendorLists.isLoading;
    return (<>
             <div className="wrapper-list" onScroll={props.onScroll}>
                {list.length > 0 ? 
                <ul className="vendorList">
                    {list.map((item , index) =>
                        <li key={index}>
                            <a title={item.data.title} className="vendorList__link" href="#">
                            <section className="vendorList__card">
                                <div className="vendorList__card__total-info">
                                    <div className="image">
                                        <img alt={item.data.title} src={item.data.defLogo} />
                                    </div>
                                    <div className="title">
                                        <h2>{item.data.title}</h2>
                                        <span className="description">
                                            {item.data.description}
                                        </span>
                                    </div>
                                </div>
                            <div className="vendorList__card__rate-price">
                                    <span className="price">
                                        {item.data.costsForTwo}
                                        تومان
                                    </span>
                                    <span className="rate">
                                        <span className="rate__number">
                                            {item.data.rate.toFixed(1)}
                                        </span>
                                        <span className="rate__voteCount">
                                        ({item.data.voteCount})
                                        </span>  
                                    </span>
                            </div>
                            </section>
                        </a>
                    </li>)}
                </ul>
                : <Loader />}
                {isLoading ? 
                    <div className="list-container__loader">
                        <div className="loader-bar"></div>
                    </div> : null}
            </div>
      
    </>);
}

const stateMapToProps = (state) => ({
    list: state.entities.vendorLists.vendorList,
    isLoading: state.entities.vendorLists.isLoading
});
export default connect(stateMapToProps)(VendorListItems);