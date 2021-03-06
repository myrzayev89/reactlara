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

const Edit = (props) => {
    const { params } = props.match;
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [property, setProperty] = useState([]);
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [newImages, setNewImages] = useState([]);
    const [defaultImages, setDefaultImages] = useState([]);

    useEffect(() => {
        axios.get(`/api/product/${params.id}/edit`,{
            headers:{
                Authorization: 'Bearer '+ props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            if (res.data.success) {
                setProduct(res.data.product);
                setCategories(res.data.categories);
                setImages(res.data.product.images);
                setProperty(res.data.product.properties);
                res.data.product.images.filter(x => !x.isRemove).map((item) => {
                    defaultImages.push(item.image_path)
                });
                setLoading(false);
            } else {
                swal('Xeta bas verdi!');
            }
        }).catch(e => console.log(e));
    },[]);

    const handleSubmit = (values) => {
        const data = new FormData();
        newImages.forEach((image_file) => {
            data.append('newImg[]', image_file);
        });
        data.append('img', JSON.stringify(images));
        data.append('category_id', values.category_id ?? []);
        data.append('name', values.name);
        data.append('barcode', values.barcode);
        data.append('stock', values.stock);
        data.append('pur_price', values.pur_price);
        data.append('sel_price', values.sel_price);
        data.append('tax', values.tax ?? 0);
        data.append('text', values.text ?? null);
        data.append('property', JSON.stringify(property));
        data.append('_method','put');

        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + props.AuthStore.appState.user.access_token
            }
        };
        axios.post(`/api/product/${product.id}`, data, config)
            .then((res) => {
                if (res.data.success) {
                    swal(res.data.message);
                } else {
                    swal(res.data.message);
                }
            })
            .catch(e => console.log(e));
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

    const onChange = (picturesImage, pictures) => {
        if (picturesImage.length > 0) {
            setNewImages(newImages.concat(picturesImage))
        }
        const diffrence = defaultImages.filter(x => !pictures.includes(x));
        diffrence.map((item) => {
            const findIndex = defaultImages.findIndex((picture) => picture === item);
            if (findIndex !== -1) {
                const findIndexImage = images.findIndex((image) => image.image_path === item);
                images[findIndexImage]['isRemove'] = true;
                setImages([...images]);
            }
        });
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
                    <Link className="mt-3 d-block" to={'/product'}>Mallar??n Siyah??s??</Link>
                    <Formik
                        initialValues={{
                            category_id: product.category_id,
                            name: product.name,
                            barcode: product.barcode,
                            stock: product.stock,
                            pur_price: product.pur_price,
                            sel_price: product.sel_price,
                            tax: product.tax,
                            text: product.text
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={
                            Yup.object().shape({
                                name: Yup.string()
                                    .required('Mal??n ad?? bo?? qoyula bilm??z!'),
                                barcode: Yup.number()
                                    .required('Barkod bo?? qoyula bilm??z!'),
                                stock: Yup.number()
                                    .required('Miqdar bo?? qoyula bilm??z!'),
                                pur_price: Yup.number()
                                    .required('Al???? qiym??ti bo?? qoyula bilm??z!'),
                                sel_price: Yup.number()
                                    .required('Sat???? qiym??ti bo?? qoyula bilm??z!')
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
                                <div className="row">
                                    <div className="col-12">
                                        <ImageUploader
                                            withIcon={true}
                                            defaultImages={defaultImages}
                                            buttonText='????kil se??in'
                                            onChange={(picturesFiles,pictures) => onChange(picturesFiles,pictures)}
                                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                            maxFileSize={5242880}
                                            withPreview={true}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <Select
                                            value={categories.find(item => item.id === values.category_id)}
                                            placeholder={'Se??im edin'}
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
                                            placeholder={"Mal??n Ad??"}
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
                                                placeholder={"Al???? Qiym??ti"}
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
                                                placeholder={"Sat???? Qiym??ti"}
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
                                                placeholder={"Miqdar??"}
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
                                                placeholder={"??DV"}
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
                                        <button type="button" onClick={newProperty} className="btn btn-primary">??z??llikl??ri</button>
                                    </div>
                                    {
                                        property.map((item, index) => (
                                            <div className="row mb-3 mt-3">
                                                <div className="col-5">
                                                    <div className="form-floating">
                                                        <input type="text" id="name" className="form-control" name="property" onChange={(e) => changeTextInput(e,index)} value={item.property} placeholder="??z??llik Ad??"/>
                                                        <label htmlFor="name">??z??llik Ad??</label>
                                                    </div>
                                                </div>
                                                <div className="col-5">
                                                    <div className="form-floating">
                                                        <input type="text" id="value" className="form-control" name="value" onChange={(e) => changeTextInput(e,index)} value={item.value} placeholder="??z??llik D??y??ri"/>
                                                        <label htmlFor="value">??z??llik D??y??ri</label>
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
                                        disabled={!isValid}
                                >Redakt?? et
                                </button>
                            </div>
                        )}
                    </Formik>
                </main>
            </div>
        </Layout>
    )
};

export default inject("AuthStore")(observer(Edit));


