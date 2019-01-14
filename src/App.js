import React, { Component } from 'react';
import mirror from './assets/mirror.jpg'
import './App.css';

import axios from 'axios'
import moment from 'moment'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentMovie: 0,
      currentQuery: '',
      apiWorks: false,
      films: [],
      filmsTemplate: [],
      queries: [],
      favorites: [],
      activeSection: 'search'
    };
  }

  componentDidMount() {
    // Checking that TMDB API works
    fetch("https://api.themoviedb.org/3/movie/550?api_key=2be617903f117e66a3b8c7b330da2f5c")
      .then(res => console.log(res.json()))
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            apiWorks: true
          });
          console.log(this.state.apiWorks)
        },

        (error) => {
          this.setState({
            isLoaded: true,
            apiWorks: false,
            error
          });
        }
      )
  }

  texts = {
    meta: 'Basic film search with React',
    author: 'Luisfer Romero Calero, 2019',
    credits: 'Named after Andrei Tarkovski (1932-1986)'
  };

  setMovieQuery(event) {
    this.setState({currentQuery: event.target.value})
  };

  searchFilms(){
    let url = 'https://api.themoviedb.org/3/search/movie?api_key=2be617903f117e66a3b8c7b330da2f5c&vote_count.gte=50&query=' + this.state.currentQuery
    axios.get(url)
      .then(res => {
        this.setState({ films: res.data.results})
        this.setState({ filmsTemplate: this.generateFilmsTemplate(this.state.films)});
        this.addToRecentSearches(this.state.currentQuery);
      })
  };

  addToRecentSearches(query){
    let queryAdded = [...this.state.queries, query];
    let queriesSet = [...new Set(queryAdded)];
    this.setState({ queries: queriesSet });
  }

  setCurrentQuery(query){
    this.setState({ currentQuery: query}, () => {
      this.searchFilms();
    });
  }

  addToFavorites(film){
    let favorites = [...this.state.favorites, film];
    this.setState({ favorites: favorites});
  }

  generateFavorites(){
    this.setState({ activeSection: 'favorites', favoritesTemplate: this.generateFilmsTemplate(this.state.favorites, true)});
  }

  setActiveSection(section){
    this.setState({ activeSection: section});
  }

  generateFilmsTemplate(films, isFavorites){
    let filmsTemplate = films.map((film) => {
        let imageUrl = "http://image.tmdb.org/t/p/w200/" + film.poster_path
        let year = moment(film.release_date).year()
        let youtubeUrl = "https://www.youtube.com/results?search_query=trailer+" + film.original_title + "+" + year
        return (<div className="columns is-variable is-multiline">
        <div className="column is-2">
          <img src={imageUrl} />
        </div>
        <div className="column is-6">
          <p className="title is-2">{film.original_title} ({year})</p>
          <p className="subtitle is-6">{film.overview}</p>
          <p className="padding-top-normal subtitle is-6"><b>Rating: {film.vote_average}</b> based on <b>{film.vote_count}</b> votes</p>
          <a href={youtubeUrl} className="button is-info is-outlined"><i class="far fa-play-circle"></i>&nbsp;Play trailer</a>
          {!isFavorites && <a style={{marginLeft: '10px'}} onClick={() => this.addToFavorites(film)} className="button is-warning"><i class="far fa-star"></i>&nbsp;Add to favorites</a>}
        </div>
        </div>);
    });
    return filmsTemplate;
  };

  render() {

    let recentSearches = this.state.queries.map((query) => {
      return (<div className="hoverable" onClick={() => this.setCurrentQuery(query)}>{query}</div>)
    });


    return (
      <div className="App">
        <section className="hero background-hero position-fixed">
          <div className="hero-body">
            <div className="title is-2 text-white">Tarkovski</div>
          </div>
        </section>

        <div className="tabs position-fixed" style={{zIndex: 1000, marginTop: '100px', width: '100%'}}>
          <ul>
            <li onClick={() => this.setActiveSection('search')}><a className="text-white">Search</a></li>
            <li onClick={this.generateFavorites.bind(this)}><a className="text-white">Favorites</a></li>
            <li onClick={() => this.setActiveSection('credits')}><a className="text-white">Credits</a></li>
          </ul>
        </div>
        {this.state.activeSection == 'search' &&
        <div className="columns big-padding padding-top-normal" style={{paddingTop: '200px', width: '100%'}}>
          <div className="column is-12">
            <div className="columns">
            <div className="column is-4">
              <div className="field">
                <div className="control">
                  <input className="input is-info" value={this.state.currentQuery} onChange={this.setMovieQuery.bind(this)} type="text" placeholder="Search film"></input>
                </div>
              </div>
              </div>
              <div className="column is-2">
              <a className="button" onClick={this.searchFilms.bind(this)}>Search</a>
              </div>
            </div>

            <div className="columns">
              <div className="column is-10 align-left">
                <div className="movie-title">{this.state.currentQuery}</div>
                <div className="subtitle is-3"><i>{this.state.filmsTemplate.length} results</i></div>
                <div className="list">{this.state.filmsTemplate}</div>
              </div>
              <div className="column is-2">
                <div className="title-2 blue-text bold-text">Recent searches</div>
                {recentSearches}
              </div>
          </div>

          </div>
          <div className="column is-4">
          </div>
        </div>
            }
          {this.state.activeSection == 'favorites' && <div className="columns" style={{paddingTop: '200px', width: '100%'}}>
            <div className="column is-9 is-offset-1 align-left">
              <div className="list">{this.state.favoritesTemplate}</div>
            </div>
            <div className="column is-2">
            </div>
            </div>
          }
          {this.state.activeSection == 'credits' && <div className="column is-3" style={{paddingTop: '200px', width: '100%'}}>
            <img style={{width: '50%'}} src={mirror} />
            <div className=""><i>{this.texts.meta}</i></div>
            <div className="">{this.texts.author}</div>
            <div className="">{this.texts.credits}</div>
            </div>
          }
      </div>
    );
  }
}

export default App;
