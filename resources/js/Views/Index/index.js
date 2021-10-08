import React from "react";
import { inject, observer } from "mobx-react";
import Layout from "../../Components/Layout/front.layout";

const Index = (props) => {
    return (
        <Layout/>
    )
};

export default inject("AuthStore")(observer(Index));
