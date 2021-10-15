import React, {useEffect, useState} from "react";
import {inject, observer} from "mobx-react";
import Layout from "../../Components/Layout/front.layout";
import {Formik} from "formik";
import * as Yup from "yup";
import {Link} from "react-router-dom";
import CustomInput from "../../Components/Form/custominput";
import axios from "axios";
import swal from 'sweetalert';
import Loader from "react-loader-spinner";

const Create = (props) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/category/create`,{
            headers:{
                Authorization: 'Bearer '+ props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            setCategories(res.data.categories);
            setLoading(false);
        }).catch(e => console.log(e));
    },[]);

    const handleSubmit = (values, { resetForm }) => {
        const data = new FormData();
        data.append('name', values.name);
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + props.AuthStore.appState.user.access_token
            }
        };
        axios.post(`/api/category`, data, config)
            .then((res) => {
                if (res.data.success) {
                    swal(res.data.message);
                    resetForm({});
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
                    <Link className="mt-3 d-block" to={'/category'}>Bölmələrin Siyahısı</Link>
                    <Formik
                        initialValues={{
                            name: ''
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={
                            Yup.object().shape({
                                name: Yup.string()
                                    .required('Bölmə adı boş qoyula bilməz!')
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
                              touched
                          }) => (
                            <div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <CustomInput
                                            id={'name'}
                                            placeholder={"Bölmə Adı"}
                                            handleBlur={handleBlur}
                                            value={values.name}
                                            handleChange={handleChange('name')}
                                        />
                                        {(errors.name && touched.name) && <p>{errors.name}</p>}
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
