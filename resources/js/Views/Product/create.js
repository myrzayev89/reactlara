import React, {useEffect, useState} from "react";
import {inject, observer} from "mobx-react";
import Layout from "../../Components/Layout/front.layout";
import {Formik} from "formik";
import * as Yup from "yup";
import {Link} from "react-router-dom";
import Select from 'react-select';
import CustomInput from "../../Components/Form/custominput";
import axios from "axios";
import ImageUploader from 'react-images-upload';
import CKEditor from 'ckeditor4-react';
import swal from 'sweetalert';
import Loader from "react-loader-spinner";

const Create = (props) => {
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [property, setProperty] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/product/create`,{
            headers:{
                Authorization: 'Bearer '+ props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            setCategories(res.data.categories);
            setLoading(false);
        }).catch(e => console.log(e));
    },[images]);

    const handleSubmit = (values, { resetForm }) => {
        const data = new FormData();
        images.forEach((image_file) => {
            data.append('img[]', image_file);
        });
        data.append('category_id', values.category_id ?? []);
        data.append('name', values.name);
        data.append('barcode', values.barcode);
        data.append('stock', values.stock);
        data.append('pur_price', values.pur_price);
        data.append('sel_price', values.sel_price);
        data.append('tax', values.tax ?? 0);
        data.append('text', values.text ?? null);
        data.append('property', JSON.stringify(property));

        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + props.AuthStore.appState.user.access_token
            }
        };
        axios.post(`/api/product`, data, config)
            .then((res) => {
                if (res.data.success) {
                    swal(res.data.message);
                    resetForm({});
                    setImages([]);
                    setProperty([]);
                } else {
                    swal(res.data.message);
                }
            })
            .catch(e => { setSubmitting(true); console.log(e); });
    };

    const newProperty = () => {
        setProperty([...property, { property:'', value:'' }]);
    };
    const removeProperty = (index) => {
        const oldProperty = property;
        oldProperty.splice(index, 1);
        setProperty([...oldProperty]);
    };
    const changeTextInput = (event, index) => {
        property[index][event.target.name] = event.target.value;
        setProperty([...property]);
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
                    <Link className="mt-3 d-block" to={'/product'}>Malların Siyahısı</Link>
                    <Formik
                        initialValues={{
                            name: '',
                            barcode: '',
                            stock: '',
                            pur_price: '',
                            sel_price: ''
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={
                            Yup.object().shape({
                                name: Yup.string()
                                    .required('Malın adı boş qoyula bilməz!'),
                                barcode: Yup.number()
                                    .required('Barkod boş qoyula bilməz!'),
                                stock: Yup.number()
                                    .required('Miqdar boş qoyula bilməz!'),
                                pur_price: Yup.number()
                                    .required('Alış qiyməti boş qoyula bilməz!'),
                                sel_price: Yup.number()
                                    .required('Satış qiyməti boş qoyula bilməz!')
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
                                <div className="row">
                                    <div className="col-12">
                                        <ImageUploader
                                            withIcon={true}
                                            buttonText='Şəkil seçin'
                                            onChange={(picturesFile) => {setImages(images.concat(picturesFile))}}
                                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                            maxFileSize={5242880}
                                            withPreview={true}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <Select
                                            placeholder={'Seçim edin'}
                                            onChange={(e) => setFieldValue('category_id', e.id)}
                                            getOptionLabel={option => option.name}
                                            getOptionValue={option => option.id}
                                            options={categories} />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <CustomInput
                                            id={'name'}
                                            placeholder={"Malın Adı"}
                                            handleBlur={handleBlur}
                                            value={values.name}
                                            handleChange={handleChange('name')}
                                        />
                                        {(errors.name && touched.name) && <p>{errors.name}</p>}
                                    </div>
                                    <div className="col-6">
                                        <div className="form-floating">
                                            <CustomInput
                                                id={'barcode'}
                                                placeholder={"Barkodu"}
                                                handleBlur={handleBlur}
                                                value={values.barcode}
                                                handleChange={handleChange('barcode')}
                                            />
                                            {(errors.barcode && touched.barcode) && <p>{errors.barcode}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <div className="form-floating">
                                            <CustomInput
                                                id={'purPrice'}
                                                placeholder={"Alış Qiyməti"}
                                                handleBlur={handleBlur}
                                                value={values.pur_price}
                                                handleChange={handleChange('pur_price')}
                                            />
                                            {(errors.pur_price && touched.pur_price) && <p>{errors.pur_price}</p>}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-floating">
                                            <CustomInput
                                                id={'selPrice'}
                                                placeholder={"Satış Qiyməti"}
                                                handleBlur={handleBlur}
                                                value={values.sel_price}
                                                handleChange={handleChange('sel_price')}
                                            />
                                            {(errors.sel_price && touched.sel_price) && <p>{errors.sel_price}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <div className="form-floating">
                                            <CustomInput
                                                id={'stock'}
                                                placeholder={"Miqdarı"}
                                                handleBlur={handleBlur}
                                                value={values.stock}
                                                handleChange={handleChange('stock')}
                                            />
                                            {(errors.stock && touched.stock) && <p>{errors.stock}</p>}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-floating">
                                            <CustomInput
                                                id={'tax'}
                                                placeholder={"ƏDV"}
                                                handleBlur={handleBlur}
                                                value={values.tax}
                                                handleChange={handleChange('tax')}
                                            />
                                            {(errors.tax && touched.tax) && <p>{errors.tax}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3 mt-3">
                                    <div className="col-12">
                                        <button type="button" onClick={newProperty} className="btn btn-primary">Özəllikləri</button>
                                    </div>
                                    {
                                        property.map((item, index) => (
                                            <div className="row mb-3 mt-3">
                                                <div className="col-5">
                                                    <div className="form-floating">
                                                        <input type="text" id="name" className="form-control" name="property" onChange={(e) => changeTextInput(e,index)} value={item.property} placeholder="Özəllik Adı"/>
                                                        <label htmlFor="name">Özəllik Adı</label>
                                                    </div>
                                                </div>
                                                <div className="col-5">
                                                    <div className="form-floating">
                                                        <input type="text" id="value" className="form-control" name="value" onChange={(e) => changeTextInput(e,index)} value={item.value} placeholder="Özəllik Dəyəri"/>
                                                        <label htmlFor="value">Özəllik Dəyəri</label>
                                                    </div>
                                                </div>
                                                <div className="col-2">
                                                    <div className="form-floating">
                                                        <button type="button" onClick={() => removeProperty(index)} className="btn btn-danger">X</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <CKEditor
                                                data={values.text}
                                                onChange={(event) => {
                                                    const data = event.editor.getData();
                                                    setFieldValue('text', data);
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


