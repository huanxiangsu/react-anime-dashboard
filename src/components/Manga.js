import React from "react";
import Navbar from "./Navbar";
import MediaList from './MediaList';

class Manga extends React.Component {
    constructor(props) {
        super(props);
        this.defaultConfig = {
            search: '',
            type: "Manga",
            season: '',
            seasonYear: '',
            sort: "Popularity",
        };
    }

    render() {
        return (
            <Navbar active="manga" {...this.props}>
                {/* <h1 style={{ textAlign: 'center', color: 'white' }}>
                    All Manga
                </h1> */}
                <MediaList type="manga" config={this.defaultConfig} />
            </Navbar>
        );
    }
}

export default Manga;