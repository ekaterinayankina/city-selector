import {CitySelector, InfoComponent}  from './CitySelector';

$(document).ready(() => {
    let $regionInfo = $('#regionText');
    let $locationInfo = $('#localityText');
    let $selector = $('#citySelector');
    let $info = $('#info');
    let $createSelector = $('#createCitySelector');
    let $destroySelector = $('#destroyCitySelector');
    btnBlink($createSelector);
    btnBlink($destroySelector);
    let $selectors = [];
    let selectorsCount = 0;


    //Создание компонента селектора
    $createSelector.on('click', (e) => {
        if (!e.originalEvent) return;
        if (selectorsCount === 0) createInfoComponent($info, $regionInfo, $locationInfo, $selectors);

        let newId = 'citySelector'+ selectorsCount.toString();
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
        let lastElement = $selectors[$selectors.length-1];
        let lastSelector = $('#' + lastElement);
        lastSelector.remove();
        console.log('delete CitySelector: ' + lastElement);
        $selectors.pop();
        selectorsCount--;

        $locationInfo.text("");
        $regionInfo.text("");
        if (selectorsCount === 0) $info.css('display', 'none');
    });

});

function btnBlink(btn){
    btn.mousedown(function () {
        $(this).addClass("down");
    });
    btn.mouseup(function () {
        $(this).removeClass("down");
    });
}


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
