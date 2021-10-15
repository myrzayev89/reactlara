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

    const [customers, setCustomers] = useState();
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        filteredData:[],
        text:'',
        isFilter:false
    });

    useEffect(() => {
        axios.get(`/api/customer`,{
            headers:{
                Authorization: 'Bearer ' + props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            setCustomers(res.data.customers);
            setLoading(false);
        }).catch(e => console.log(e));
    },[refresh]);

    const columns = [
        {name: 'Müştəri Növü', selector: row => row.customerTypeString},
        {name: 'Adı', selector: row => row.name, sortable: true},
        {name: 'Mobil №', selector: row => row.mobile, sortable: true},
        {name: 'Ünvan', selector: row => row.address, sortable: true},
        {name: 'Redaktə', cell: (item) => <button className="btn btn-primary" onClick={() => props.history.push({
                pathname: `/customer/${item.id}/edit`
            })}>Redaktə et</button>},
        {name: 'Sil', cell: (item) => <button onClick={() => deleteItem(item)} className="btn btn-danger">Sil</button>, button: true},
    ];
    const getFilter = (e) => {
        const filterText = e.target.value;
        if (filterText !== '') {
            const filteredItems = customers.filter((item) => (
                    item.customerTypeString && item.customerTypeString.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.name && item.name.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.mobile && item.mobile.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.address && item.address.toLowerCase().includes(filterText.toLowerCase())
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
                    axios.delete(`/api/customer/${item.id}`,{
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
                                title="Müştərilərin Siyahısı"
                                columns={columns}
                                subHeader={true}
                                responsive={true}
                                hover={true}
                                fixedHeader
                                pagination
                                expandableRows
                                expandableRowsComponent={<ExpandedComponent/>}
                                data={(filter.isFilter) ? filter.filteredData : customers}
                                subHeaderComponent={<HeaderComponent filter={getFilter} action={{url:() => props.history.push('/customer/create'), title:'Yeni Müştəri', class:'btn btn-success'}}/>}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
};
export default inject("AuthStore")(observer(Index));
