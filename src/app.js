import CitySelector from './CitySelector';

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


    $createSelector.on('click', (e) => {
        if (!e.originalEvent) return;
        //$createSelector.attr("disabled", "disabled");
        $info.css('display', 'block');

        let newId = 'citySelector'+ selectorsCount.toString();
        $selectors.push(newId);
        console.log('new CitySelector: ' + newId);
        $selector.append("<div  id=\'" + newId + "\'></div>");

        new CitySelector({
            elementId: newId,
            regionsUrl: 'http://localhost:3001/regions',
            localitiesUrl: 'http://localhost:3001/localities',
            saveUrl: 'http://localhost:3001/selectedRegions',
            regionInfo: $regionInfo,
            locationInfo: $locationInfo
        });

        selectorsCount++;
    });

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
