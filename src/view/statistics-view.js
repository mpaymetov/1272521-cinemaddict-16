import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart-view';
import {FilterType,DurationType} from '../const';
import {filter} from '../utils/filter';
import {getUserRank, getFilmsDurations, getGenres, getTopGenre, filterByWatchingDate} from '../utils/statistics';

const renderDaysChart = (statisticCtx, films) => {
  const BAR_HEIGHT = 50;
  const genres = getGenres(films);
  const genresCount = genres.length;
  statisticCtx.height = BAR_HEIGHT * genresCount;

  const genresLabels = [];
  const genresValues = [];

  genres.forEach((genre) => {
    genresLabels.push(genre.genreName);
    genresValues.push(genre.genreCount);
  });

  new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genresLabels,
      datasets: [{
        data: genresValues,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = (data, films) => {
  const statisticFilterAll = (data.statisticsDuration === DurationType.ALL_TIME) ? 'checked' : '';
  const statisticFilterToday = (data.statisticsDuration === DurationType.TODAY) ? 'checked' : '';
  const statisticFilterWeek = (data.statisticsDuration === DurationType.WEEK) ? 'checked' : '';
  const statisticFilterMonth = (data.statisticsDuration === DurationType.MONTH) ? 'checked' : '';
  const statisticFilterYear = (data.statisticsDuration === DurationType.YEAR) ? 'checked' : '';

  const filmsCount = films.length;
  const userRank = getUserRank(filmsCount);

  const sumMinutes = getFilmsDurations(films);
  const filmsHoures = Math.trunc(sumMinutes / 60);
  const filmsMinutes = sumMinutes % 60;

  const topGenre = getTopGenre(films);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
          id="statistic-all-time" value="all-time" ${statisticFilterAll}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
          id="statistic-today" value="today" ${statisticFilterToday}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
          id="statistic-week" value="week" ${statisticFilterWeek}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
          id="statistic-month" value="month" ${statisticFilterMonth}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
          id="statistic-year" value="year" ${statisticFilterYear}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${filmsCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${filmsHoures} <span class="statistic__item-description">h</span> ${filmsMinutes} <span
            class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000" height="0"></canvas>
    </div>
  </section>`;
};

export default class StatisticsView extends SmartView {
  #daysChart = null;
  #filmsModel = null;

  constructor(filmsModel) {
    super();
    this.#filmsModel = filmsModel;

    this._data = {
      statisticsDuration: DurationType.ALL_TIME
    };

    this.#setInnerHandlers();
    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate(this._data, this.films);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#daysChart) {
      this.#daysChart.destroy();
      this.#daysChart = null;
    }
  };

  get films() {
    const watchedFilms = filter[FilterType.HISTORY](this.#filmsModel.films);
    return filterByWatchingDate(watchedFilms, this._data.statisticsDuration);
  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.statistic__filters-label')
      .forEach((select) => select.addEventListener('click', this.#statsDurationClickHandler));
  };

  #statsDurationClickHandler = (evt) => {
    evt.preventDefault();
    const inputId = evt.currentTarget.getAttribute('for');
    const duration = this.element.querySelector(`#${inputId}`).value;
    this.updateData({
      statisticsDuration: duration,
    }, false);
  };

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setCharts();
  };

  #setCharts = () => {
    const statisticCtx = this.element.querySelector('.statistic__chart');
    this.#daysChart = renderDaysChart(statisticCtx, this.films);
  }
}
