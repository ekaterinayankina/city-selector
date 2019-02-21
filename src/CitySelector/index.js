require('./style.less');

//TODO
//Кэш
//Вывод результата
//паттерн подписчик
export default class CitySelector {

    constructor(options) {
        this.elementId = options.elementId;
        this.regionsUrl = options.regionsUrl;
        this.localitiesUrl = options.localitiesUrl;
        this.saveUrl = options.saveUrl;
        this.selected = {region: 0, city: ""};

        let tempText = "#" + this.elementId;
        this.scoreboard = $(tempText);

        this.initEvents();
    }

    initEvents() {
        this.addEl(this.scoreboard);

        this.regionButton = this.findEl('.buttonRegion');
        this.regionSelector = this.findEl('.selectRegion');
        this.citySelector = this.findEl('.selectCity');
        this.saveButton = this.findEl('.save');

        this.regionButton.on('click', () => {
            this.selectRegion();
        });
        this.saveButton.on('click', () => {
            this.save();
        });
    }

    findEl(className) {
        return $($(this.scoreboard).find(className)[0]);
    }

    addEl(target) {
        target.append('<button  class="buttonRegion">Выбрать регион</button>');                          //?
        target.append('<select  class="selectRegion select hidden"></select>');                  //?
        target.append('<select  class="selectCity select hidden"></select>');                      //?
        target.append('<button  class="button save hidden">Сохранить</button>');                     //?
    }

    selectRegion() {
        this.regionButton.addClass('hidden');
        this.regionSelector.size = 3;                                   //?
        let jqxhrRegion = $.getJSON(this.regionsUrl, () => {
            console.log("getJSON region callback");
        }).done((data) => {
            let items = [];
            $.each(data, (key, item) => {
                items.push("<option value='" + item.id + "'>" + item.title + "</option>");
            });
            //создание списка регионов
            this.renderElement(this.regionSelector, items);
            //обработка выбранного региона
            this.regionSelector.on('change', () => {
                this.saveButton.attr("disabled", "disabled");
                this.selected.region = this.regionSelector[0].value;
                this.scoreboard.trigger('changed:region');
                this.selected.city = "";
                this.selectCity();
                this.scoreboard.trigger('changed:city');
            });
            console.log("regions loaded");
        })
            .fail(() => {
                console.log("error");
            });
    }

    selectCity() {
        let url = this.localitiesUrl + '/' + this.selected.region.toString();
        let jqxhrCity = $.getJSON(url, () => {
            console.log("getJSON locality callback");
        }).done((data) => {
            let items = [];
            $.each(data.list, function (key, item) {
                items.push("<option value='" + item + "'>" + item + "</option>");
            });
            //если список городов уже есть, то замена значений
            this.renderElement(this.citySelector, items);
            //обработка выбранного города
            this.citySelector.on('change', () =>{
                this.saveButton.removeAttr("disabled");
                this.selected.city = this.citySelector[0].value;
                this.saveButton.removeClass('hidden');
                this.scoreboard.trigger("changed:city");
            });
            console.log("success");
        }).fail(() => {
            console.log("error");
        })
    }

    save() {
        this.saveButton.attr("disabled", "disabled");
        let data = JSON.stringify(this.selected);
        let component = this;
        let request = $.ajax({
            method: "POST",
            url: this.saveUrl,
            contentType: 'application/json',
            data: data,
        }).done(() => {
            component.saveButton.removeClass('hidden');
            console.log("saved");
        }).fail(() => {
            component.saveButton.removeClass('hidden');
            console.log("error");
        });

    }

    renderElement(el, items) {
        el.empty();
        el.attr('size', items.length);
        el.html(items.join(''));
        el.removeClass('hidden');
    }
}


