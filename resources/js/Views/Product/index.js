import React, {useEffect, useState} from "react";
import { inject, observer } from "mobx-react";
import Layout from "../../Components/Layout/front.layout";
import axios from "axios";
import DataTable from 'react-data-table-component';
import HeaderComponent from '../../Components/HeaderComponent';
import ExpandedComponent from '../../Components/ExpandedComponent';
import swal from 'sweetalert';
import Loader from "react-loader-spinner";

const Index = (props) => {

    const [product, setProduct] = useState();
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        filteredData:[],
        text:'',
        isFilter:false
    });

    useEffect(() => {
        axios.get(`/api/product`,{
            headers:{
                Authorization: 'Bearer ' + props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            setProduct(res.data.product);
            setLoading(false);
        }).catch(e => console.log(e));
    },[refresh]);

    const columns = [
        {name: 'Barkodu', selector: row => row.barcode},
        {name: 'Malın Adı', selector: row => row.name, sortable: true},
        {name: 'Miqdarı', selector: row => row.stock, sortable: true},
        {name: 'Alış Qiyməti', selector: row => row.pur_price, sortable: true},
        {name: 'Satış Qiyməti', selector: row => row.sel_price, sortable: true},
        {name: 'ƏDV %', selector: row => row.tax},
        {name: 'Redaktə', cell: (item) => <button className="btn btn-primary" onClick={() => props.history.push({
                pathname: `/product/${item.id}/edit`
            })}>Redaktə et</button>},
        {name: 'Sil', cell: (item) => <button onClick={() => deleteItem(item)} className="btn btn-danger">Sil</button>, button: true},
    ];
    const getFilter = (e) => {
        const filterText = e.target.value;
        if (filterText !== '') {
            const filteredItems = product.filter((item) => (
                    item.name && item.name.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.barcode && item.barcode.toLowerCase().includes(filterText.toLowerCase())
                )
            );
            setFilter({
                filteredData:filteredItems,
                text:filterText,
                isFilter:true
            });
        } else {
            setFilter({
                filteredData:[],
                text:'',
                isFilter:false
            });
        }
    };

    const deleteItem = (item) => {
        swal({
            title: 'Silmək istədiyinizdən əminsinizmi?',
            text: 'QEYD: Bazadan birdəfəlik silinəcəkdir',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.delete(`/api/product/${item.id}`,{
                        headers:{
                            Authorization: 'Bearer ' + props.AuthStore.appState.user.access_token
                        }
                    }).then((res) => {
                        if (res.data.success) {
                            swal(res.data.message);
                            setRefresh(true);
                        } else {
                            swal(res.data.message);
                        }
                    }).catch(e => console.log(e));
                }
            })
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
                <div className="container">
                    <div className="row mt-4">
                        <div className="col-12">
                            <DataTable
                                title="Malların Siyahısı"
                                columns={columns}
                                subHeader={true}
                                responsive={true}
                                hover={true}
                                fixedHeader
                                pagination
                                expandableRows
                                expandableRowsComponent={<ExpandedComponent/>}
                                data={(filter.isFilter) ? filter.filteredData : product}
                                subHeaderComponent={<HeaderComponent filter={getFilter} action={{url:() => props.history.push('/product/create'), title:'Yeni Mal', class:'btn btn-success'}}/>}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
};
export default inject("AuthStore")(observer(Index));
