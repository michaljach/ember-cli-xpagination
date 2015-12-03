import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
    totalPages : 1,
    currentPage: 1,
    routerMain: null,
    propertyObserver : Ember.observer('this.meta', function(){
        this.set('currentPage', this.meta.page);
        this.calculatePages();
    }),
    actions: {
        changePage: function(id, params) {
            var pages = this.get('pages');

            if(id === 'prev') {
                if(this.currentPage > 1) {
                    pages[this.currentPage-1].set('current', false);
                    this.decrementProperty('currentPage');
                    this.routerMain.router.transitionTo(this.routerMain.get('currentRouteName'), { queryParams: { page: this.currentPage, sort_by: params.sort_by, sort_order: params.sort_order } });
                }
            } else if(id === 'next') {
                if(this.currentPage < this.totalPages) {
                    pages[this.currentPage-1].set('current', false);
                    this.incrementProperty('currentPage');
                    this.routerMain.router.transitionTo(this.routerMain.get('currentRouteName'), { queryParams: { page: this.currentPage, sort_by: params.sort_by, sort_order: params.sort_order } });
                }
            } else {
                pages[this.currentPage-1].set('current', false);
                this.set('currentPage', id);
            }

            pages[this.currentPage-1].set('current', true);
        }
    },
    pages: computed('pages', function() {
        return this.calculatePages();
    }),
    calculatePages: function() {
        this.routerMain = this.get('container').lookup('router:main');

        if(this.routerMain.router.state.queryParams.page !== undefined) {
            this.currentPage = this.routerMain.router.state.queryParams.page;
        }

        var pages = [], i = 0;
        this.totalPages = this.meta.count >= this.meta.per_page ? Math.ceil(this.meta.count / this.meta.per_page) : 0;

        var Page = Ember.Object.extend({
            id: null,
            current: false
        });

        for(i = 1; i < this.totalPages + 1; i++) {
            var isCurrent = parseInt(this.currentPage) === i ? true : false;
            var page = Page.create({ id: i, current: isCurrent });
            pages.pushObject(page);
        }

        this.set('pages', pages);

        return pages;
    }
});
