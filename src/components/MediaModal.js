import React from "react";
import AnimeQuery from "./AnimeQuery";
import paragraph from "../images/paragraph.png";
import { getName } from 'country-list';
// import { Chart } from "react-google-charts";
import { Button, Modal, Image, Icon, Label, Loader, Segment, Dimmer, Grid, Rating, Transition, Table } from "semantic-ui-react";
import style from "./MediaModal.module.scss";
import './MediaModal.css';
import { ErrorBox } from "./Error";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Doughnut, Bar } from 'react-chartjs-2';

/**
 * A single media box for displaying information for a single media
 */
class MediaModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            media: null,
            error: false,
            readMore: false,
            informationVisible: false,
            statisticVisible: false,
            characterListVisible: false,
            watchListVisible: false,
        };
    }

    handleReadMore = () => {
        this.setState({ readMore: !this.state.readMore });
    }
    handleReadMoreKeyup = (e) => {
        if (e.keyCode === 13) {
            this.handleReadMore();
        }
    }

    toggleInformation = () => {
        this.setState({ informationVisible: !this.state.informationVisible });
    };

    toggleStatistic = () => {
        this.setState({ statisticVisible: !this.state.statisticVisible });
    };

    toggleCharacter = () => {
        this.setState({ characterListVisible: !this.state.characterListVisible });
    };

    toggleWatch = () => {
        this.setState({ watchListVisible: !this.state.watchListVisible });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.open) {
            AnimeQuery.getMediaByID(nextProps.id)
                .then((res) => {
                    this.setState({
                        id: nextProps.id,
                        media: res.data.Media,
                    });
                })
                .catch(err => {
                    console.log('my err: ' + err);
                    this.setState({ error: true });
                });
        }

        // reset all states when modal closed
        if (nextProps.reset) {
            this.setState({
                id: null,
                media: null,
                error: false,
                readMore: false,
                informationVisible: false,
                statisticVisible: false,
                characterListVisible: false,
                watchListVisible: false,
            });
        }
    }

    render() {
        const { media } = this.state;
        if (media) {
            // description
            var description = handleDescription(media.description);
            var firstDescription = '';
            var secondDescription = '';
            var showReadmore = false;
            if (description.length > 401) {
                showReadmore = true;
                firstDescription = description.substring(0, 400);
                secondDescription = description.substr(400);
            } else
                firstDescription = description;
            
            const ReadMoreText = (
                <Transition visible={this.state.readMore} animation='fade' duration={150} >
                    <span className={'secondDescription'}>{secondDescription}</span>
                </Transition>
            );

            // score
            var score = Math.round((media.meanScore / 100) * 10);

            // tag list
            var tags = [];
            var tagNum = (media.tags.length > 12 ? 12 : media.tags.length);
            for (var i = 0; i < tagNum; ++i) {
                let tag = media.tags[i];
                tags.push(
                    <Label as="a" tag key={tag.name} className={style.tag}>
                        <Icon name='tag' />
                        {tag.name}
                    </Label>
                );
            }

            // genres
            var genres = [];
            media.genres.forEach((genre) => {
                genres.push(
                    <Label
                        as="a"
                        circular
                        color="black"
                        key={genre}
                        className={style.genre}
                        size="big"
                    >
                        {genre}
                    </Label>
                );
            });            

            return (
                <Modal
                    id="modal"
                    open={this.props.open}
                    onClose={this.props.close}
                    closeOnDimmerClick={true}
                    dimmer="blurring"
                    // closeIcon
                >
                    <div className={style.myModal + ' ' + style.fadeInEffect}>
                        {media.bannerImage ? (
                            <div className={style.modalBanner}>
                                <LazyLoadImage
                                    src={media.bannerImage}
                                    alt={media.title.english}
                                    className={style.modalBannerImg}
                                    wrapperClassName={style.myWrapper}
                                    effect="myblur"
                                />
                                {/* <img
                                    src={media.bannerImage}
                                    alt={media.title.english}
                                    className={style.modalBannerImg}
                                ></img> */}
                            </div>
                        ) : null}

                        <div className={style.modalContent}>
                            <div className={style.modalTitle}>
                                <div className={style.modalNative}>
                                    {media.title.native}
                                </div>
                                <div className={style.modalRomaji}>
                                    ({media.title.romaji})
                                </div>
                                <div className={style.modalEnglish}>
                                    {media.title.english}
                                </div>
                            </div>

                            <Grid columns={2} divided>
                                <Grid.Row>
                                    <Grid.Column width={7}>
                                        <div className={style.cover}>
                                            <LazyLoadImage
                                                src={media.coverImage.large}
                                                alt={media.title.english}
                                                className={style.coverImg + ' ui medium centered rounded image'}
                                                effect="myblur"
                                            />
                                        </div>
                                        <div className={style.rating}>
                                            <Rating
                                                maxRating={10}
                                                defaultRating={score}
                                                disabled
                                                icon="star"
                                                size="large"
                                                title={
                                                    'Mean Score: ' +
                                                    media.meanScore
                                                }
                                                className={style.ratingSize}
                                            />
                                        </div>

                                        <div className={style.favorite}>
                                            <Label
                                                size="medium"
                                                className={style.favoriteLabel}
                                            >
                                                <Icon
                                                    name="heart"
                                                    color="red"
                                                />
                                                <span
                                                    className={
                                                        style.favoriteText
                                                    }
                                                >
                                                    {media.favourites} Favorites
                                                </span>
                                            </Label>
                                        </div>

                                        <div className={style.favorite}>
                                            <Label
                                                size="medium"
                                                className={style.favoriteLabel}
                                            >
                                                <Icon
                                                    name="star"
                                                    color="yellow"
                                                />
                                                <span
                                                    className={
                                                        style.favoriteText
                                                    }
                                                >
                                                    {media.popularity}{' '}
                                                    Pupularity
                                                </span>
                                            </Label>
                                        </div>

                                        <div className={style.genreContainer}>
                                            {genres}
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column width={9}>
                                        <div className={style.flexColumnContainer}>
                                            <div className={style.descriptionContainer}>
                                                <p>
                                                    <b>Description:</b>
                                                </p>
                                                <p className={style.description}>
                                                    {firstDescription}
                                                    {ReadMoreText}
                                                    {showReadmore ? (
                                                        <span tabIndex='0' onKeyUp={this.handleReadMoreKeyup} onClick={this.handleReadMore} className={style.descriptionReadmore}>
                                                            {this.state.readMore
                                                                ? 'Read Less >>>'
                                                                : '... Read More >>>'}
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </p>
                                            </div>
                                            <div
                                                className={style.tagsContainer}
                                            >
                                                {tags}
                                            </div>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>

                            <SubSection
                                click={this.toggleInformation}
                                visible={this.state.informationVisible}
                                name="Media Information"
                                color="blue"
                            >
                                <div>
                                    <InformationTable media={media} />
                                </div>
                            </SubSection>

                            <SubSection
                                click={this.toggleStatistic}
                                visible={this.state.statisticVisible}
                                name="Media Statistic"
                                color="green"
                            >
                                <div>
                                    <MediaStatistic stats={media.stats} />
                                </div>
                            </SubSection>

                            <SubSection
                                click={this.toggleCharacter}
                                visible={this.state.characterListVisible}
                                name="Character List"
                                color="violet"
                            >
                                <div>
                                    <CharacterList
                                        id={media.id}
                                        characters={media.characters}
                                    />
                                </div>
                            </SubSection>

                            <SubSection
                                click={this.toggleWatch}
                                visible={this.state.watchListVisible}
                                name="Watch List"
                                color="orange"
                            >
                                <div>
                                    <WatchList
                                        watchList={media.streamingEpisodes}
                                    />
                                </div>
                            </SubSection>
                        </div>
                    </div>

                    <Modal.Actions>
                        <Button
                            negative
                            circular
                            onClick={this.props.close}
                            icon
                            labelPosition="right"
                        >
                            Close <Icon name="close" />
                        </Button>
                    </Modal.Actions>
                </Modal>
            );
        } else {
            return (
                <Modal
                    id="modal"
                    open={this.props.open}
                    onClose={this.props.close}
                    closeOnDimmerClick={true}
                >
                    <div className={style.myModal + " " + style.tempModal}>
                        {!this.state.error ? (
                            <Segment className={style.loadingBox}>
                                <Dimmer active inverted>
                                    <Loader inverted size="large" >
                                        Loading
                                    </Loader>
                                </Dimmer>

                                <Image
                                    src={paragraph}
                                    alt="p"
                                    className={style.paragraph}
                                />
                            </Segment>)
                        :
                            (<ErrorBox title="Internet Error" text="Please try again later" />)
                        }
                        
                    </div>
                    <Modal.Actions>
                        <Button
                            negative
                            circular
                            onClick={this.props.close}
                            icon
                            labelPosition="right"
                        >
                            Close <Icon name="close" />
                        </Button>
                    </Modal.Actions>
                </Modal>
            );
        }
    }
}


const SubSection = (props) => {
    return (
        <div className={style.informationContainer}>
            <Button
                onClick={props.click}
                className={style.modalBigBtn}
                color={props.color}
                circular
                icon
                labelPosition="right"
            >
                {props.name}
                {props.visible ? (
                    <Icon name="angle double up" />
                ) : (
                    <Icon name="angle double down" />
                )}
            </Button>
            <Transition
                visible={props.visible}
                animation="slide down"
                duration={500}
                unmountOnHide={true}
            >
                {props.children}
            </Transition>
        </div>
    );
}


const InformationTable = (props) => {
    const { media } = props;
    // origin country
    var origin = (media.countryOfOrigin ? getName(media.countryOfOrigin) : 'Unknown');

    // source
    var source = (media.source ? media.source : 'Unknown');

    // studio
    var studio = '';
    if (media.studios.edges.length > 0) {
        studio = media.studios.edges[0].node.name;
    } else {
        studio = 'Unknown';
    }

    // season
    var season = "";
    if (media.season && media.seasonYear)
        season = media.season + ' ' + media.seasonYear;
    else
        season = (media.season ? media.season : media.seasonYear ? media.seasonYear : 'Unknown');
    
    // start / end date
    var startDate = convertDate(media.startDate.year, media.startDate.month, media.startDate.day);
    var endDate = convertDate(media.endDate.year, media.endDate.month, media.endDate.day);

    // chapter/volume, episode/duration
    var chapter = (media.chapters ? media.chapters : 'Unknown');
    var volume = (media.volumes ? media.volumes : 'Unknown');
    var episode = (media.episodes ? media.episodes : 'Unknown');
    var duration = convertTime(media.duration);
    
    return (
        <Table
            celled
            selectable
            striped
            color="blue"
            className={style.modalTable}
            unstackable
        >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan="2">Information</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        <b>Native Name</b>
                    </Table.Cell>
                    <Table.Cell>
                        {media.title.native ? media.title.native : "Unknown"}
                    </Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Romaji Name</b>
                    </Table.Cell>
                    <Table.Cell>
                        {media.title.romaji ? media.title.romaji : "Unknown"}
                    </Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>English Name</b>
                    </Table.Cell>
                    <Table.Cell>
                        {media.title.english ? media.title.english : "Unknown"}
                    </Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Origin</b>
                    </Table.Cell>
                    <Table.Cell>{origin}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Type</b>
                    </Table.Cell>
                    <Table.Cell>{media.type ? media.type : 'Unknown'}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Format</b>
                    </Table.Cell>
                    <Table.Cell>{media.format ? media.format : 'Unknown'}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b title="Source type the media was adapted from">Source</b>
                    </Table.Cell>
                    <Table.Cell>{source}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Main Studio</b>
                    </Table.Cell>
                    <Table.Cell>{studio}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Status</b>
                    </Table.Cell>
                    <Table.Cell>{media.status ? media.status : 'Unknown'}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Season</b>
                    </Table.Cell>
                    <Table.Cell>{season}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Start Date</b>
                    </Table.Cell>
                    <Table.Cell>{startDate}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>End Date</b>
                    </Table.Cell>
                    <Table.Cell>{endDate}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>{media.type === "ANIME" ? "Episodes" : "Volumes"}</b>
                    </Table.Cell>
                    <Table.Cell>
                        {media.type === "ANIME" ? episode : volume}
                    </Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>
                            {media.type === "ANIME" ? "duration" : "Chapters"}
                        </b>
                    </Table.Cell>
                    <Table.Cell>
                        {media.type === "ANIME" ? duration : chapter}
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    );
}

const ChartJSDoughnut = (props) => {
    if (!props.data) {
        return null;
    }
    const doudata = {
        labels: props.data.labels,
        datasets: [
            {
                data: props.data.data,
                backgroundColor: props.data.colors,
                hoverBackgroundColor: props.data.hoverColors,
                borderColor: '#fff',
                hoverBorderColor: '#fff',
            },
        ],
    };
    return (
        <div>
            <div className={style.statTitle}>{props.title}</div>
            <div className={style.statBlock}>
                <Doughnut data={doudata} />
            </div>
        </div>
    );
}

const barColors = [
    '#E21A1A',
    '#E4802D',
    '#D2802D',
    '#D2802D',
    '#CAC46F',
    '#C6C935',
    '#BCBE25',
    '#9BD22D',
    '#74BD43',
    '#64D22D',
];

const ChartJSBar = (props) => {
    let backgroundColors = [];
    let hoverColor = [];
    props.data.colors.forEach(color => {
        backgroundColors.push(color + '77');
        hoverColor.push(color + 'aa');
    });
    
    const bardata = {
        labels: props.data.labels,
        datasets: [
            {
                label: '# of people',
                backgroundColor: backgroundColors,
                borderColor: props.data.colors,
                borderWidth: 1,
                hoverBorderWidth: 1,
                hoverBackgroundColor: hoverColor,
                // hoverBorderColor: '#fff',
                data: props.data.data,
            },
        ],
    };
    const options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
    return (
        <div>
            <div className={style.statTitle}>{props.title}</div>
            <div className={style.statBlock}>
                <Bar data={bardata} options={options} />
            </div>
        </div>
    );
};

class MediaStatistic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pieData: null,
            pieLength: null,
            pieColors: null,
            pieError: false,
            pie: null,
            barData: null,
            barError: false,
            bar: null,
        };
    }

    UNSAFE_componentWillMount() {
        if (this.props.stats) {
            let scoreList = this.props.stats.scoreDistribution;
            let statusList = this.props.stats.statusDistribution;

            let pieData = null;
            let statusData = [];
            let statusColor = [];
            let statusHoverColor = [];
            let statusLabel = [];
            let statusError = false;
            if (statusList.length !== 0) {
                statusList.forEach(status => {
                    statusData.push(status.amount);
                    if (status.status === "CURRENT") {
                        statusLabel.push('Current');
                        statusColor.push('#63b4eebb');
                        statusHoverColor.push('#63b4ee');
                    }
                    else if (status.status === "COMPLETED") {
                        statusLabel.push('Completed');
                        statusColor.push('#7ae487bb');
                        statusHoverColor.push('#7ae487');
                    } 
                    else if (status.status === "PLANNING") {
                        statusLabel.push('Planning');
                        statusColor.push('#ac84febb');
                        statusHoverColor.push('#ac84fe');
                    }
                    else if (status.status === "DROPPED") {
                        statusLabel.push('Dropped');
                        statusColor.push('#ff839cbb');
                        statusHoverColor.push('#ff839c');
                    }
                    else if (status.status === "PAUSED") {
                        statusLabel.push('Paused');
                        statusColor.push('#feb168bb');
                        statusHoverColor.push('#feb168');
                    }           
                    else if (status.status === 'REPEATING') {
                        statusLabel.push('Repeating');
                        statusColor.push('#73ccccbb');
                        statusHoverColor.push('#73cccc');
                    } 
                    else {
                        statusLabel.push('Others');
                        statusColor.push('#d1d1d1bb');
                        statusHoverColor.push('#d1d1d1');
                    }
                });
                pieData = {
                    data: statusData,
                    labels: statusLabel,
                    colors: statusColor,
                    hoverColors: statusHoverColor,
                }
            } else {
                statusError = true;
            }

            let barData = null;
            let scoreLabel = [];
            let scoreData = [];
            let scoreColor = [];
            let scoreError = false;
            if (scoreList.length !== 0) {
                scoreList.forEach((score) => {
                    let colorIndex = (score.score - 10) / 10;
                    scoreData.push(score.amount);
                    scoreLabel.push(score.score.toString());
                    scoreColor.push(barColors[colorIndex]);
                });
                barData = {
                    data: scoreData,
                    labels: scoreLabel,
                    colors: scoreColor,
                }
            } else {
                scoreError = true;
            }

            this.setState({
                pieData: pieData,
                pieError: statusError,
                barData: barData,
                barError: scoreError
            });
        }
    }
    
    componentDidMount() {
        if (!this.state.pieError) {
            this.setState({
                pie: (
                    <ChartJSDoughnut
                        data={this.state.pieData}
                        title="Status Distribution"
                    />
                )
            });
        }
        if (!this.state.barError) {
            this.setState({
                bar: (
                    <ChartJSBar
                        data={this.state.barData}
                        title="Score Distribution"
                    />
                ),
            });
        } 
    }

    render() {
        if (!this.state.pieError && !this.state.barError) {
            return (
                <div className={style.StatContainer}>
                    <Grid doubling columns={2} textAlign="center">
                        <Grid.Column>{this.state.pie}</Grid.Column>
                        <Grid.Column>{this.state.bar}</Grid.Column>
                    </Grid>
                </div>
            );
        } else if (!this.state.barError || !this.state.pieError) {
            return (
                <div className={style.StatContainer}>
                    <Grid doubling columns={1} textAlign="center">
                        <Grid.Column>{this.state.barError ? this.state.pie : this.state.bar}</Grid.Column>
                    </Grid>
                </div>
            );
        } else {
            return (
                <div className={style.StatContainer}>
                    <div className={style.emptyBox + ' ' + style.emptyStatBox}>
                        <div>No Stats Available</div>
                    </div>
                </div>
            );
        }
    }
}


class CharacterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            content: [],
            error: false
        };
    }

    UNSAFE_componentWillMount() {
        const { characters } = this.props;
        const mycontent = [];
        if (characters) {
            let charList = characters.edges;
            if (charList && charList.length > 0) {
                charList.forEach(char => {
                    let roleID = char.id;
                    let role = char.role;
                    let fullName = char.node.name.full;
                    let nativeName = char.node.name.native;
                    let img = char.node.image.medium;
                    mycontent.push(
                        <Grid.Column key={roleID} className={style.myColumn} >
                            <div className={style.charBox}>
                                <div>
                                    <LazyLoadImage
                                        id={roleID}
                                        src={img}
                                        alt={fullName}
                                        className={style.charImg + ' ui image'}
                                        effect="myblur"
                                    />
                                </div>
                                <div className={style.charContent}>
                                    <div className={style.charNameBlock}>
                                        <div className={style.charName}>
                                            {nativeName}
                                        </div>
                                        <div className={style.charName}>
                                            {fullName}
                                        </div>
                                    </div>

                                    <div className={style.charRole}>{role}</div>
                                </div>
                            </div>
                        </Grid.Column>
                    );
                });
                this.setState({ content: this.state.content.concat(mycontent) });

            } else {
                this.setState({ error: true });
            }
        }
    }

    render() {
        return (
            <div className={style.characterContainer}>
                {!this.state.error ? (
                    // <Grid doubling columns={3}>
                    //     {this.state.content}
                    // </Grid>
                    <Grid doubling columns='3'>
                        {this.state.content}
                    </Grid>

                ) : (
                    <div className={style.emptyBox + ' ' + style.emptyCharacterBox}>
                        <div>No characters available</div>
                    </div>
                )}
            </div>
        );
    }
}


class WatchList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [],
        };
    }

    UNSAFE_componentWillMount() {
        const { watchList } = this.props;
        const mycontent = [];
        if (watchList.length > 0) {
            watchList.forEach(watch => {
                let title = watch.title;
                let img = watch.thumbnail;
                let url = watch.url;
                mycontent.push(
                    <Grid.Column key={title} className={style.myColumn}>
                        <div className={style.watchBox} title={title}>
                            <a href={url} target="_blank" rel='noopener noreferrer'>
                                <LazyLoadImage
                                    src={img}
                                    alt={title}
                                    className={style.watchImg + ' ui image'}
                                    effect="myblur"
                                />
                                <div className={style.watchTitle}>{title}</div>
                            </a>
                        </div>
                    </Grid.Column>
                );
            });

            this.setState({
                content: this.state.content.concat(mycontent)
            });
        }
    }

    render() {
        if (this.props.watchList.length > 0) {
            return (
                <div className={style.characterContainer}>
                    <Grid doubling columns={3}>
                        {this.state.content}
                    </Grid>
                </div>
            );
        } else {
            return (
                <div className={style.characterContainer}>
                    <div className={style.emptyBox + ' ' + style.emptyWatchListBox}>
                        <div>No watch list available</div>
                    </div>
                </div>
            );
        }
    }
}


function handleDescription(mediaDescription) {
    if (mediaDescription === null || mediaDescription === ' ') {
        return "No description available ...";
    }
    let desList = mediaDescription.split(/<br>(.*|[^.*])<br>/g);
    var description = "";
    for (var i = 0; i < desList.length; ++i) {
        if (desList[i] === "" || desList[i] === "\n")
            continue;
        let sub = desList[i].split("\n");
        for (var j = 0; j < sub.length; ++j) {
            if (sub[j] === "" || sub[j] === "\n")
                continue;
            let subb = sub[j].replace(/\n|\r|\r\n|<br>|<\/br>/gm, "");
            if (subb !== "")
                description += subb + "\n\n";
        }
    }
    return description;
}

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// convert date into format "Month day, year"
function convertDate(myear, mmonth, mday) {
    var date = '';
    if (myear)
        date = myear.toString();
    if (mday)
        date = mday.toString() + ", " + date;
    if (mmonth && mday)
        date = months[mmonth - 1] + " " + date;
    else if (mmonth)
        date = months[mmonth - 1] + ", " + date;
    if (date === "")
        date = "Unknown";
    return date;
}


function convertTime(time) {
    if (time) {
        if (time < 60)
            return time.toString() + ' mins';
        let hour = (time / 60);
        hour = Math.floor(hour);
        let min = time - (hour * 60);
        let hourText = (hour === 1 ? 'hour' : 'hours');
        let minText = (min === 1 ? 'min' : 'mins');
        return hour.toString() + ' ' + hourText + ' ' + min + ' ' + minText;
    } else {
        return 'Unknown';
    }
}

export default MediaModal;