import React from "react";

const CustomInput = ({type='text', id, placeholder, value, handleChange, handleBlur }) => {
    return (
        <div className="form-floating">
            <input
                type={type}
                id={id}
                className={'form-control'}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <label htmlFor={id}>{placeholder}</label>
        </div>
    );
};
export default CustomInput;
