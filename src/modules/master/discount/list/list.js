import { inject } from 'aurelia-framework';
import { Service } from "./../service";
import { Router } from 'aurelia-router';

@inject(Router, Service)
export class List {
    context = ["Detail"];
    columns = [
        { field: "name", title: "Diskon" },
        { field: "startDate", title: "Mulai Berlaku" },
        { field: "endDate", title: "Berlaku Hingga" },
        { field: "discountType", title: "Tipe Diskon" },
    ];

    loader = (info) => {
        var order = {};

        if (info.sort)
            order[info.sort] = info.order;

        var arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order
        }

        return this.service.search(arg)
            .then(result => {
                for (let data of result.data) {
                    data.Category.FullName = data.Category.SubCategory ? data.Category.Name + " - " + data.Category.SubCategory : data.Category.Name;
                }
                return {
                    total: result.info.total,
                    data: result.data
                }
            });
    }

    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    contextCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        switch (arg.name) {
            case "Detail":
                this.router.navigateToRoute('view', { id: data.Id });
                break;
        }
    }

    create() {
        this.router.navigateToRoute('create');
    }
}