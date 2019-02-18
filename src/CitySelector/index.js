require('./style.less');
var stateful = {
    none: 0,
    selectRegion: 1,
    selectCity: 2
};
class CitySelector{
    constructor(selector, holder) {
        this.state = stateful.none;

        this.holder = holder;
        this.elementId = selector.elementId;
        this.regionsUrl = selector.regionsUrl;
        this.localitiesUrl = selector.localitiesUrl;
        this.saveUrl = selector.saveUrl;
        this.selected = {region:0, city:""};

        holder.append('<button id="regionButton" class="button">Выбрать регион</button>');
        holder.append('<select id="regionSelector" class="selectRegion select hidden"></select>');
        holder.append('<select id="citySelector" class="selectCity select hidden"></select>');
        holder.append('<button id="saveButton" class="button save hidden">Сохранить</button>');

        this.regionButton = $(holder).find('#regionButton');
        this.regionSelector = $(holder).find('#regionSelector');
        this.citySelector = $(holder).find('#citySelector');
        this.saveButton = $(holder).find('#saveButton');
        var component = this;

        this.regionButton.on('click', function(e) {
            component.selectRegion();
        });
        this.saveButton.on('click', function(e) {
            component.save();
        });

    }
    selectRegion(){
        this.regionButton.css('display','none');//!
        var component = this;
        component.regionSelector.size = 3;
        var jqxhrRegion = $.getJSON(component.regionsUrl, function() {

            console.log("success");

        }).done(function(data) {
            var items = [];
            $.each( data, function( key, item ) {
                items.push( "<option value='" + item.id + "'>" + item.title + "</option>" );
            });
            //создание списка регионов
            component.regionSelector.empty();
            component.regionSelector.attr('size',items.length);
            component.regionSelector.html(items.join(''));
            component.regionSelector.removeClass('hidden');
            //обработка выбранного региона
            component.regionSelector.on('change', function() {
                this.state = stateful.selectRegion;
                component.saveButton.attr("disabled", "disabled");
                var optionSelected = $("option:selected", this);
                component.selected.region = this.value;
                component.holder.trigger("changed:region");

                component.selected.city = "";
                component.selectCity();
                component.holder.trigger('changed:city');
            });
        })
            .fail(function() { console.log("error");});
    }
    selectCity(){
        var component = this;
        var url = this.localitiesUrl+'/'+component.selected.region.toString();
        var jqxhrCity = $.getJSON(url, function() {
            console.log( "success" );
        }).done(function(data) {
            var items = [];
            $.each( data.list, function( key, item ) {
                items.push( "<option value='" + item + "'>" + item + "</option>" );
            });
            //если список городов уже есть, то замена значений
            component.citySelector.empty();
            component.citySelector.attr('size',items.length);
            component.citySelector.html(items.join(''));
            component.citySelector.removeClass('hidden');
            //обработка выбранного города
            component.citySelector.on('change', function() {
                this.state = stateful.selectCity;
                component.saveButton.removeAttr("disabled");
                var optionSelected = $("option:selected", this);
                var city = this.value;
                component.selected.city = city;
                component.saveButton.removeClass('hidden');
                component.holder.trigger("changed:city");
            });
        }).fail(function() {
            console.log( "error" );
        })
    }
    save() {
        this.saveButton.attr("disabled", "disabled");
        var data = JSON.stringify(this.selected);
        var component = this;
        var request = $.ajax({
            method: "POST",
            url: this.saveUrl,
            contentType: 'application/json',
            data: data,
        }).done(function() {
            component.saveButton.removeClass('hidden');
            console.log("saved");
        }).fail(function() {
            component.saveButton.removeClass('hidden');
            console.log( "error" );
        });

    }
}

$(document).ready(function () {
    $('button').mousedown(function () {
        $(this).addClass("down");
    });
    $('button').mouseup(function () {
        $(this).removeClass("down");
    });

//При выборе региона появляется список его населенных пунктов (запросить аяксом с http://localhost:3000/localities/[regionId]).
//При выборе населенного пункта появляется кнопка «Сохранить». Если населенный пункт не выбран, кнопка должна быть заблокирована (свойство disabled).
//При сохранении, id региона и название населенного пункта отсылаются синхронным POST-запросом на http://localhost:3000/selectedRegions.

    var regionInfo = $('#info #regionText');
    var locationInfo = $('#info #localityText');

    $('#createCitySelector').on('click', function (event) {
        if(event.originalEvent){
            $('#createCitySelector').attr("disabled", "disabled");
            $('#info').css('display','block');
            var selector = new CitySelector({
                elementId: 'citySelector',
                regionsUrl: 'http://localhost:3000/regions',
                localitiesUrl: 'http://localhost:3000/localities',
                saveUrl: 'http://localhost:3000/selectedRegions'
            }, $('#citySelector'));

            $('#citySelector').on('changed:city', function(e) {
                locationInfo.text(selector.selected.city);
            });
            $('#citySelector').on('changed:region', function(e) {
                regionInfo.text(selector.selected.region);
            });
        }
    });

    $('#destroyCitySelector').click(function () {
        $("#citySelector").empty();
        $('#createCitySelector').removeAttr("disabled");
        locationInfo.text("");
        regionInfo.text("");
        delete selector;
    });

});


