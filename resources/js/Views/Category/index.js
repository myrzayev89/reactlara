import React, {useEffect, useState} from "react";
import { inject, observer } from "mobx-react";
import Layout from "../../Components/Layout/front.layout";
import axios from "axios";
import DataTable from 'react-data-table-component';
import HeaderComponent from '../../Components/HeaderComponent';
import swal from 'sweetalert';
import Loader from "react-loader-spinner";

const Index = (props) => {
    const [category, setCategory] = useState();
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        filteredData:[],
        text:'',
        isFilter:false
    });

    useEffect(() => {
        axios.get(`/api/category`,{
            headers:{
                Authorization: 'Bearer ' + props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            if (res.data.success) {
                setCategory(res.data.categories);
                setLoading(false);
                swal(res.data.message);
            } else {
                swal(res.data.message);
            }
        }).catch(e => console.log(e));
    },[refresh]);

    const columns = [
        {name: 'Bölmə Adı', selector: row => row.name},
        {name: 'Redaktə', cell: (item) => <button className="btn btn-primary" onClick={() => props.history.push({
                pathname: `/category/${item.id}/edit`
            })}>Redaktə et</button>},
        {name: 'Sil', cell: (item) => <button onClick={() => deleteItem(item)} className="btn btn-danger">Sil</button>, button: true},
    ];
    const getFilter = (e) => {
        const filterText = e.target.value;
        if (filterText !== '') {
            const filteredItems = category.filter((item) => (
                    item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
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
                    axios.delete(`/api/category/${item.id}`,{
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
                                title="Bölmələrin Siyahısı"
                                columns={columns}
                                subHeader={true}
                                responsive={true}
                                hover={true}
                                fixedHeader
                                pagination
                                data={(filter.isFilter) ? filter.filteredData : category}
                                subHeaderComponent={<HeaderComponent filter={getFilter} action={{url:() => props.history.push('/category/create'), title:'Yeni Bölmə', class:'btn btn-success'}}/>}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
};
export default inject("AuthStore")(observer(Index));
