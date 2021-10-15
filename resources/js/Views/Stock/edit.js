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
    const { params } = props.match;
    const [stock, setStock] = useState([]);
    const [products, setProducts] = useState([]);
    const [stockTypes, setStockTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/stock/${params.id}/edit`,{
            headers:{
                Authorization: 'Bearer '+ props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            setStock(res.data.stock);
            setProducts(res.data.products);
            setStockTypes(res.data.stockTypes);
            setLoading(false);
        }).catch(e => console.log(e));
    },[]);

    const handleSubmit = (values) => {
        values['_method'] = 'put';
        axios.post(`/api/stock/${stock.id}`, {...values}, {
            headers: {
                'Authorization': 'Bearer ' + props.AuthStore.appState.user.access_token
            }
        })
            .then((res) => {
                if (res.data.success) {
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
                    <Link className="mt-3 d-block" to={'/stock'}>Stokların Siyahısı</Link>
                    <Formik
                        initialValues={{
                            stock_type: stock.stock_type,
                            product_id: stock.product_id,
                            qty: stock.qty,
                            total_price: stock.total_price,
                            date: stock.date,
                            note: stock.note
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={
                            Yup.object().shape({
                                stock_type: Yup.number()
                                    .required('Stok növü seçilməyib!'),
                                product_id: Yup.number()
                                    .required('Mal seçilməyib!'),
                                qty: Yup.number()
                                    .required('Miqdar boş qoyula bilməz!'),
                                total_price: Yup.number()
                                    .required('Məbləğ boş qoyula bilməz!')
                            })
                        }>
                        {({
                              values,
                              handleChange,
                              handleSubmit,
                              handleBlur,
                              errors,
                              isValid,
                              touched,
                              setFieldValue
                          }) => (
                            <div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <Select
                                            value={stockTypes.find(item => item.id === values.stock_type)}
                                            placeholder={'Seçim edin'}
                                            onChange={(e) => setFieldValue('stock_type', e.id)}
                                            getOptionLabel={option => option.name}
                                            getOptionValue={option => option.id}
                                            options={stockTypes}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <Select
                                            value={products.find(item => item.id === values.product_id)}
                                            placeholder={'Mal seçin'}
                                            onChange={(e) => setFieldValue('product_id', e.id)}
                                            getOptionLabel={option => `${option.barcode} - ${option.name}`}
                                            getOptionValue={option => option.id}
                                            options={products}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <CustomInput
                                            id={'qty'}
                                            type={'number'}
                                            placeholder={'Miqdar'}
                                            handleBlur={handleBlur}
                                            value={values.qty}
                                            handleChange={handleChange('qty')}
                                        />
                                        {(errors.qty && touched.qty) && <p>{errors.qty}</p>}
                                    </div>
                                    <div className="col-6">
                                        <CustomInput
                                            id={'total_price'}
                                            type={'number'}
                                            placeholder={'Məbləğ'}
                                            handleBlur={handleBlur}
                                            value={values.total_price}
                                            handleChange={handleChange('total_price')}
                                        />
                                        {(errors.total_price && touched.total_price) && <p>{errors.total_price}</p>}
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <CustomInput
                                            id={'date'}
                                            type={'date'}
                                            placeholder={'Tarix'}
                                            value={values.date}
                                            handleChange={handleChange('date')}
                                        />
                                        {(errors.date && touched.date) && <p>{errors.date}</p>}
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <CKEditor
                                            data={values.note}
                                            onChange={(event) => {
                                                const data = event.editor.getData();
                                                setFieldValue('note', data);
                                            }}
                                        />
                                    </div>
                                </div>
                                <button className="w-100 btn btn-lg btn-primary" type="button"
                                        onClick={handleSubmit}
                                        disabled={!isValid}
                                >Redaktə et
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
