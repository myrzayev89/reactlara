import React from "react";

const HeaderComponent = (props) => {
    return (
        <div style={{display:'flex'}}>
            <button className={props.action.class} onClick={props.action.url}>{props.action.title}</button>
            <input type="text" placeholder="Axtarış..." onChange={props.filter} style={{flex:1}} className="ml-1 form-control"/>
        </div>
    );
};
export default HeaderComponent;
