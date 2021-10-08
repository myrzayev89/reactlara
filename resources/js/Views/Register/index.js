import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from 'yup';
import axios from 'axios';
import { inject, observer } from 'mobx-react';

const Register = (props) => {

    const [errors, setErrors] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (props.AuthStore.appState != null && props.AuthStore.appState.isLoggedIn) {
            return props.history.push('/');
        }
    });

    const handleSubmit = (values) => {
        axios.post(`/api/auth/register`, {...values})
            .then((res) => {
                if (res.data.success) {
                    const userData = {
                        id:res.data.id,
                        name:res.data.name,
                        email:res.data.email,
                        access_token:res.data.access_token,
                    };
                    const appState = {
                        isLoggedIn:true,
                        user:userData
                    };
                    props.AuthStore.saveToken(JSON.stringify(appState));
                    props.history.push('/');
                } else {
                    alert('Xəta baş verdi!');
                }
            })
            .catch(error => {
                if (error.response) {
                    let err = error.response.data;
                    setErrors(err.errors);
                } else if (error.request) {
                    let err = error.request;
                    setError(err);
                } else {
                    setError(err.message);
                }
            });
    };
    let arr = [];
    if(errors.length > 0 ){
        Object.values(errors).forEach(value => {
            arr.push(value)
        });
    }
    return (
        <div>
            <main className="form-signin">
                <h1 className="h3 mb-3 fw-normal">Sistemə Qeyd olun</h1>
                { arr.length !== 0 && arr.map((item) => (<p>{item}</p>)) }
                { error !== '' && (<p>{error}</p>) }
                <Formik
                    initialValues={{
                        name:'',
                        email:'',
                        password:'',
                        password_confirmation:'',
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={
                        Yup.object().shape({
                            email:Yup
                                .string()
                                .email('Email formatı düzgün yazlmayıb!')
                                .required('Email boş qoyula bilməz!'),
                            name:Yup.string()
                                .required('Ad Soyad boş qoyula bilməz!'),
                            password:Yup.string()
                                .required('Şifrə boş qoyula bilməz!'),
                            password_confirmation:Yup.string()
                                .oneOf([Yup.ref('password'), null], 'Şifrə təkrar yanlışdır!')
                        })
                    }
                >
                    {({
                          values,
                          handleChange,
                          handleSubmit,
                          handleBlur,
                          errors,
                          isValid,
                          isSubmitting,
                          touched
                      }) => (
                        <div>
                            <div className="form-floating">
                                <input type="text" className="form-control" id="name" placeholder="Ahmad Rzali"
                                   onBlur={handleBlur}
                                   value={values.name}
                                   onChange={handleChange('name')}
                                />
                                {(errors.name && touched.name) && <p>{errors.name}</p>}
                                <label htmlFor="name">Ad Soyad</label>
                            </div>
                            <div className="form-floating">
                                <input type="text" className="form-control" id="email" placeholder="name@example.com"
                                   onBlur={handleBlur}
                                   value={values.email}
                                   onChange={handleChange('email')}
                                />
                                {(errors.email && touched.email) && <p>{errors.email}</p>}
                                <label htmlFor="email">E-poçt ünvanı</label>
                            </div>
                            <div className="form-floating">
                                <input type="password" className="form-control" id="password" placeholder="******"
                                   onBlur={handleBlur}
                                   value={values.password}
                                   onChange={handleChange('password')}
                                />
                                {(errors.password && touched.password) && <p>{errors.password}</p>}
                                <label htmlFor="password">Şifrə</label>
                            </div>
                            <div className="form-floating">
                                <input type="password" className="form-control" id="pass_confirmed"
                                       placeholder="******"
                                       value={values.password_confirmation}
                                       onChange={handleChange('password_confirmation')}
                                />
                                {(errors.password_confirmation && touched.password_confirmation) && <p>{errors.password_confirmation}</p>}
                                <label htmlFor="pass_confirmed">Şifrə Təkrar</label>
                            </div>
                            <button className="w-100 btn btn-lg btn-primary" type="button"
                             onClick={handleSubmit}
                             disabled={!isValid || isSubmitting}
                            >Qeyd ol</button>
                        </div>
                    )}
                </Formik>
                <Link className="mt-3 d-block" to={'/login'}>Daxil ol</Link>
            </main>
        </div>
    )
};

export default inject('AuthStore')(observer(Register));
