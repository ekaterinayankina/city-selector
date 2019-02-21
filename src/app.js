// const CitySelector = require('./CitySelector');
import CitySelector from './CitySelector';

$(document).ready(() => {


//При выборе региона появляется список его населенных пунктов (запросить аяксом с http://localhost:3000/localities/[regionId]).
//При выборе населенного пункта появляется кнопка «Сохранить». Если населенный пункт не выбран, кнопка должна быть заблокирована (свойство disabled).
//При сохранении, id региона и название населенного пункта отсылаются синхронным POST-запросом на http://localhost:3000/selectedRegions.

    let $regionInfo = $('#regionText');
    let $locationInfo = $('#localityText');
    let $selector = $('#citySelector');
    let $info = $('#info');
    let $createSelector = $('#createCitySelector');
    let $destroySelector = $('#destroyCitySelector');
    btnBlink($createSelector);
    btnBlink($destroySelector);


    $createSelector.on('click', (e) => {
        if (!e.originalEvent) return;                                               //?
        $createSelector.attr("disabled", "disabled");
        $info.css('display', 'block');

        let selector = new CitySelector({
            elementId: 'citySelector',
            regionsUrl: 'http://localhost:3001/regions',
            localitiesUrl: 'http://localhost:3001/localities',
            saveUrl: 'http://localhost:3001/selectedRegions'                                              //double
        });

        $selector.on('changed:city', () => {
            $locationInfo.text(selector.selected.city);
        });
        $selector.on('changed:region', () => {
            $regionInfo.text(selector.selected.region);
        });
    });






    $destroySelector.on ('click', () => {
        $selector.empty();
        $createSelector.removeAttr("disabled");
        $locationInfo.text("");
        $regionInfo.text("");
        // $info.css('display', 'none');                                            //?
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
