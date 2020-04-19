import React from "react";
import AnimeQuery from "./AnimeQuery";
import {
    Container,
    Button,
    Modal,
    Image,
    Icon,
    Header,
    Card
} from "semantic-ui-react";
import style from "./MediaList.module.scss";

class MediaList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null,
            hasNextPage: false,
            currentPage: 0,
            id: -1,
            open: false,
            reset: false,
            loadmore: null,
            runQuery: null
        };
    }

    getId = (event) => {
        console.log("onclicked getID = " + event.target.id);
        // set state to open the modal
        this.setState({
            id: event.target.id,
            open: true,
            reset: false,
        });
    };

    // to close the modal and reset content in the modal
    close = () => {
        this.setState({
            open: false,
            reset: true,
        });
    };

    // execute this function before call render
    UNSAFE_componentWillMount() {
        var runQuery;
        if (this.props.type === "anime")
            runQuery = AnimeQuery.getAllAnimeByPopularity;
        else if (this.props.type === "manga")
            runQuery = AnimeQuery.getAllManga;
        else
            runQuery = null;

        if (runQuery) {
            runQuery(50, 1).then((res) => {
                const result = [];
                var list = res.data.Page.media;
                list.forEach((element) => {
                    result.push(
                        <div key={element.id} className="anime-block">
                            <img
                                id={element.id}
                                onClick={this.getId}
                                src={element.coverImage.large}
                                alt={element.title.english}
                                className="anime-img"
                            ></img>
                            <div className="anime-title">
                                {element.title.native}
                            </div>
                            <div className="anime-title">
                                {element.title.english}
                            </div>
                        </div>
                    );
                });

                this.setState({
                    content: result,
                    current: res.data.Page.pageInfo.currentPage,
                    hasNext: res.data.Page.pageInfo.hasNextPage,
                    loadmore: <LoadMore addComponent={this.addComponent} />,
                    runQuery: runQuery,
                });
            });
        }
    }


    addComponent = () => {
        if (this.state.hasNext) {
            this.state.runQuery(
                50,
                this.state.current + 1
            ).then((res) => {
                const myresult = [];
                var list = res.data.Page.media;
                list.forEach((element) => {
                    myresult.push(
                        <div key={element.id} className="anime-block">
                            <img
                                id={element.id}
                                src={element.coverImage.large}
                                alt={element.title.english}
                                className="anime-img"
                                onClick={this.getId}
                            ></img>
                            <div className="anime-title">
                                {element.title.native}
                            </div>
                            <div className="anime-title">
                                {element.title.english}
                            </div>
                        </div>
                    );
                });
                this.setState({
                    content: this.state.content.concat(myresult),
                    current: res.data.Page.pageInfo.currentPage,
                    hasNext: res.data.Page.pageInfo.hasNextPage,
                });
            });
        }
    };

    render() {
        return (
            <div>
                <div className="flex-container">{this.state.content}</div>
                {this.state.loadmore}
                <MediaModal
                    id={this.state.id}
                    open={this.state.open}
                    close={this.close}
                    reset={this.state.reset}
                />
            </div>
        );
    }
}

const LoadMore = (props) => {
    return (
        <div className={style.loadmoreBlock}>
            <Button onClick={props.addComponent} className={style.loadmoreBtn}>
                Load More
                <Icon name="angle double down" className={style.loadmoreIcon}></Icon>
            </Button>
        </div>
    );
    
}   

class OneMedia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            img: props.img,
            native: props.native,
            english: props.english,
        };
    }

    render() {
        const { id, img, native, english } = this.state;
        return (
            <div id={id} key={id} className="anime-block">
                <img src={img} alt={english} className="anime-img"></img>
                <div className="anime-title">{native}</div>
                <div className="anime-title">{english}</div>
            </div>
        );
    }
}


class MediaModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            banner: "",
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.open) {
            console.log("current id == " + this.props.id);
            console.log("will receive id == " + nextProps.id);
            AnimeQuery.getMediaByID(nextProps.id).then((res) => {
                this.setState({
                    id: nextProps.id,
                    banner: res.data.Media.bannerImage,
                });
            });
        }

        if (nextProps.reset) {
            this.setState({
                id: null,
                banner: "",
            });
        }
    }

    render() {
        return (
            <Modal
                open={this.props.open}
                onClose={this.props.close}
                closeOnDimmerClick={true}
                closeIcon
            >
                <Modal.Header>
                    <img
                        src={this.state.banner}
                        style={{ width: "100%", height: "250px" }}
                    ></img>
                </Modal.Header>
                <Modal.Content image scrolling>
                    <Modal.Description>
                        <Header>{this.state.id}</Header>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={this.props.close}>
                        Close <Icon name="chevron right" />
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default MediaList;