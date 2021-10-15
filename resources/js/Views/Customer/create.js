import React, {useEffect, useState} from "react";
import {inject, observer} from "mobx-react";
import Layout from "../../Components/Layout/front.layout";
import {Formik} from "formik";
import * as Yup from "yup";
import {Link} from "react-router-dom";
import Select from 'react-select';
import CustomInput from "../../Components/Form/custominput";
import axios from "axios";
import CKEditor from 'ckeditor4-react';
import swal from 'sweetalert';
import Loader from "react-loader-spinner";

const Create = (props) => {
    const [loading, setLoading] = useState(true);
    const [customerType, setCustomerType] = useState([
        {id:0, name:'Müştəri'},
        {id:1, name:'Tədarikçi'}
    ]);

    useEffect(() => {
        axios.get(`/api/customer/create`,{
            headers:{
                Authorization: 'Bearer '+ props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            setLoading(false);
        }).catch(e => console.log(e));
    },[]);

    const handleSubmit = (values, { resetForm }) => {
        axios.post(`/api/customer`, {...values}, {
            headers: {
                'Authorization': 'Bearer ' + props.AuthStore.appState.user.access_token
            }
        })
            .then((res) => {
                if (res.data.success) {
                    resetForm({});
                    swal(res.data.message);
                } else {
                    swal(res.data.message);
                }
            })
            .catch(e => console.log(e));
    };

    if (loading) {
        return <div className="loader">
            <Loader
                type="Puff"
                color="#00BFFF"
                height={300}
                width={300}
            />
        </div>
    }

    return (
        <Layout>
            <div>
                <main className="container mt-4">
                    <Link className="mt-3 d-block" to={'/customer'}>Müştərilərin Siyahısı</Link>
                    <Formik
                        initialValues={{
                            customer_type: '',
                            name: '',
                            mobile: '',
                            address: '',
                            note: ''
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={
                            Yup.object().shape({
                                customer_type: Yup.number()
                                    .required('Seçim edilməyib!'),
                                name: Yup.string()
                                    .required('Ad boş qoyula bilməz!')
                            })
                        }>
                        {({
                              values,
                              handleChange,
                              handleSubmit,
                              handleBlur,
                              errors,
                              isValid,
                              isSubmitting,
                              touched,
                              setFieldValue
                          }) => (
                            <div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <Select
                                            placeholder={'Seçim edin'}
                                            onChange={(e) => setFieldValue('customer_type', e.id)}
                                            getOptionLabel={option => option.name}
                                            getOptionValue={option => option.id}
                                            options={customerType}
                                        />
                                        {(errors.customer_type && touched.customer_type) && <p>{errors.customer_type}</p>}
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <CustomInput
                                            id={'name'}
                                            placeholder={"Adı"}
                                            handleBlur={handleBlur}
                                            value={values.name}
                                            handleChange={handleChange('name')}
                                        />
                                        {(errors.name && touched.name) && <p>{errors.name}</p>}
                                    </div>
                                    <div className="col-6">
                                        <div className="form-floating">
                                            <CustomInput
                                                id={'mobile'}
                                                placeholder={"Mobil №"}
                                                handleBlur={handleBlur}
                                                value={values.mobile}
                                                handleChange={handleChange('mobile')}
                                            />
                                            {(errors.mobile && touched.mobile) && <p>{errors.mobile}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <CustomInput
                                                id={'address'}
                                                placeholder={"Ünvan"}
                                                handleBlur={handleBlur}
                                                value={values.address}
                                                handleChange={handleChange('address')}
                                            />
                                            {(errors.address && touched.address) && <p>{errors.address}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <CKEditor
                                                data={values.note}
                                                onChange={(event) => {
                                                    const data = event.editor.getData();
                                                    setFieldValue('note', data);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button className="w-100 btn btn-lg btn-primary" type="button"
                                        onClick={handleSubmit}
                                        disabled={!isValid || isSubmitting}
                                >Əlavə et
                                </button>
                            </div>
                        )}
                    </Formik>
                </main>
            </div>
        </Layout>
    )
};
export default inject("AuthStore")(observer(Create));
