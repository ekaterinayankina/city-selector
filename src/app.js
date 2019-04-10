import {CitySelector, InfoComponent}  from './CitySelector';

$(document).ready(() => {
    const $regionInfo = $('#regionText');
    const $locationInfo = $('#localityText');
    const $selector = $('#citySelector');
    const $info = $('#info');
    const $createSelector = $('#createCitySelector');
    const $destroySelector = $('#destroyCitySelector');
    let $selectors = [];
    let selectorsCount = 0;

    //Добавление стилей кнопкам
    $createSelector.addClass('btn btn-dark');
    $destroySelector.addClass('btn btn-light');

    //Создание компонента селектора
    $createSelector.on('click', (e) => {
        if (!e.originalEvent) return;
        if (selectorsCount === 0) {
            createInfoComponent($info, $regionInfo, $locationInfo, $selectors);
        }

        const newId = 'citySelector'+ selectorsCount.toString();
        $selectors.push(newId);
        console.log('new CitySelector: ' + newId);
        $selector.append("<div  id=\'" + newId + "\'></div>");

        new CitySelector({
            elementId: newId,
            regionsUrl: 'http://localhost:3001/regions',
            localitiesUrl: 'http://localhost:3001/localities',
            saveUrl: 'http://localhost:3001/selectedRegions',
        });

        $info.trigger('new-selector', [newId]);

        selectorsCount++;
    });

    //Удаление компонента селектора
    $destroySelector.on ('click', () => {
        const lastElement = $selectors[$selectors.length-1];
        const lastSelector = $('#' + lastElement);
        lastSelector.remove();
        console.log('delete CitySelector: ' + lastElement);
        $selectors.pop();
        selectorsCount--;

        $locationInfo.text("");
        $regionInfo.text("");
        if (selectorsCount === 0) {
            $info.css('display', 'none');
        }
    });

});


//Создание компонента для вывода информации о выбранном регионе, городе
function createInfoComponent($info, $regionInfo, $locationInfo, $selectors) {
    new InfoComponent({
        componentId: $info,
        regionInfo: $regionInfo,
        locationInfo: $locationInfo,
        selectors: $selectors
    });
    $info.css('display', 'block');
}
