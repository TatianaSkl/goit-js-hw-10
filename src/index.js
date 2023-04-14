import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry() {
  let inputValue = input.value.trim();
  if (inputValue === '') {
    return;
  }
  fetchCountries(inputValue)
    .then(country => {
      if (country.length === 1) {
        clearMarkup();
        createMarkupCard(country);
      } else if (country.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        clearMarkup();
      } else if (country.length >= 2 && country.length < 10) {
        clearMarkup();
        createMarkupList(country);
      }
    })
    .catch(onFetchError);
}

function createMarkupList(countries) {
  const markupList = countries.reduce(
    (markup, { flags, name }) =>
      (markup += `<li class="country-list__item">
        <img src="${flags.svg}" alt="${flags.alt}" width="30" height="20" />
        <p class="country-list__text">${name.official}</p>
      </li>`),
    ''
  );
  list.innerHTML = markupList;
}

function createMarkupCard(country) {
  const markupInfo = country.reduce(
    (markup, { flags, name, capital, population, languages }) =>
      (markup += `<img src="${flags.svg}" alt="${flags.alt}" width="30" height="20" />
  <h2>${name.official}</h2>
  <ul>
    <li>
      <p><span>Capital:</span> ${capital}</p>
    </li>
    <li>
      <p><span>Population:</span> ${population}</p>
    </li>
    <li>
      <p><span>Languages:</span> ${Object.values(languages)} </p>
    </li>
  </ul>`),
    ''
  );
  info.innerHTML = markupInfo;
}

function onFetchError() {
  clearMarkup();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clearMarkup() {
  list.innerHTML = '';
  info.innerHTML = '';
}
