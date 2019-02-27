require('./style.less');

export default class CitySelector {

    constructor(options) {
        this.selector = $('#' + options.elementId);
        this.regionsUrl = options.regionsUrl;
        this.localitiesUrl = options.localitiesUrl;
        this.saveUrl = options.saveUrl;
        this.selected = {region: 0, city: ""};

        this.regionInfo = options.regionInfo;
        this.locationInfo = options.locationInfo;
        this.cache = [];

        this.initEvents();
    }

    initEvents() {
        this.renderComponent(this.selector);

        this.regionButton = this.findElement('.buttonRegion');
        this.regionSelector = this.findElement('.selectRegion');
        this.citySelector = this.findElement('.selectCity');
        this.saveButton = this.findElement('.save');
        this.formResult = this.findElement('.formResult');

        this.regionButton.on('click', () => {
            this.selectRegion();
        });
        this.saveButton.on('click', () => {
            this.save();
        });

        this.selector.on('changed:city', () => {
            this.regionInfo.text(this.selected.region);
            this.locationInfo.text(this.selected.city);
        });

        this.selector.on('changed:region', () => {
            this.regionInfo.text(this.selected.region);
        });
    }

    findElement(className) {
        return $($(this.selector).find(className)[0]);
    }

    renderComponent(target) {
        target.append('<button  class="buttonRegion">Выбрать регион</button>');
        target.append('<select  class="selectRegion select hidden"></select>');
        target.append('<select  class="selectCity select hidden"></select>');
        target.append('<button  class="button save hidden">Сохранить</button>');
        target.append('<h3  class="formResult hidden"></h3>');
    }

    selectRegion() {
        this.regionButton.addClass('hidden');
        this.regionSelector.size = 3;
        let regionRequest = $.getJSON(this.regionsUrl, () => {
            console.log("getJSON region callback");
        }).done((data) => {
            let items = [];
            $.each(data, (key, item) => {
                items.push("<option value='" + item.id + "'>" + item.title + "</option>");
            });
            //создание списка регионов
            this.renderList(this.regionSelector, items);
            //обработка выбранного региона
            this.regionSelector.on('change', () => {
                this.saveButton.attr("disabled", "disabled");
                this.selected.region = this.regionSelector[0].value;
                this.selector.trigger('changed:region');
                this.selected.city = "";
                this.selectCity();
                this.selector.trigger('changed:city');
            });
            console.log("regions loaded");
        })
            .fail(() => {
                console.log("error");
            });
    }

    selectCity() {
        let isInCache = this.cache.find(x => x.id === this.selected.region.toString().list);
        if (!isInCache) this.getCityList(this.cache);
        let cityList = this.cache.filter(x => x.id === this.selected.region.toString()).map(x => x.list)[0];
        this.renderList(this.citySelector, cityList);

        //обработка выбранного города
        this.citySelector.on('change', () => {
            this.saveButton.removeAttr("disabled");
            this.selected.city = this.citySelector[0].value;
            this.saveButton.removeClass('hidden');
            this.selector.trigger("changed:city");
        });

    }

    save() {
        this.saveButton.attr("disabled", "disabled");
        let data = JSON.stringify(this.selected);
        let saveDataRequest = $.ajax({
            method: "POST",
            async: false,
            url: this.saveUrl,
            contentType: 'application/json',
            data: data,
        }).done(() => {
            this.saveButton.removeClass('hidden');
            console.log("saved");
            //вывод результата
            this.renderResult(this.selector, this.selected);


        }).fail(() => {
            this.saveButton.removeClass('hidden');
            console.log("error");
        });
    }

    renderList(el, items) {
        el.empty();
        el.attr('size', items.length);
        el.html(items.join(''));
        el.removeClass('hidden');
    }

    renderResult(el, items) {
        this.citySelector.addClass('hidden');
        this.regionSelector.addClass('hidden');
        this.saveButton.addClass('hidden');
        this.formResult.removeClass('hidden');
        this.formResult.text(JSON.stringify(items));
    }

    getCityList(cache) {
        console.log("городов нет в кэше");
        let region = this.selected.region;
        let url = this.localitiesUrl + '/' + region.toString();

        $.ajax({
            url: url,
            async: false,
            success: function(data) {
                let cityList=[];
                $.each(data.list, function (key, item) {
                    cityList.push("<option value='" + item + "'>" + item + "</option>");
                });
                cache.push ({
                    id: region.toString(),
                    list: cityList
                });
            },
            error: function(xhr, error) {
                console.log("error");
            }
        });
    }
}

export default class InfoComponent {

    constructor(options) {
        this.regionInfo = options.regionInfo;
        this.locationInfo = options.locationInfo;
        this.initEvents();
    }

    initEvents(){
        this.selector.on('changed:city', () => {
            this.regionInfo.text(this.selected.region);
            this.locationInfo.text(this.selected.city);
        });

        this.selector.on('changed:region', () => {
            this.regionInfo.text(this.selected.region);
        });
    }
}


