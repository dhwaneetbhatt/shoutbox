(function () {
    'use strict';

    var socket = io(),
        Shout = Backbone.Model.extend({
            initialize: function () {}
        }),

        ShoutCollection = Backbone.Collection.extend({
            model: Shout,
            url: '/shouts'
        }),

        shouts = new ShoutCollection,

        ShoutView = Backbone.View.extend({
            className: "shout",
            tagName: "li",
            template: _.template($('#tmpl-shout-item').html()),
            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        }),

        AppView = Backbone.View.extend({
            template: _.template($('#tmpl-input').html()),
            nameEdit: true,
            events: {
                "click #input-btn": "createNew",
                "click #shout-name": "editName",
                "click .icon-ok": "saveName",
                "keypress #input-name": "updateNameOnEnter"
            },
            initialize: function () {
                var self = this;
                this.render();

                this.listenTo(shouts, 'add', this.addOne);
                this.listenTo(shouts, 'reset', this.addAll);
                socket.on('update', function (shout) {
                    self.addOne(new Shout({
                        name: shout.name,
                        text: shout.text
                    }));
                });

                shouts.fetch();
            },
            render: function () {
                this.$el.html(this.template({name: this.name, nameEdit: this.nameEdit}));
                $("#input-container").append(this.$el);
                return this;
            },
            addOne: function (shout) {
                var view = new ShoutView({model: shout});
                $("#shouts-container ul").prepend(view.render().el);
            },
            addAll: function () {
                shouts.each(this.addOne, this);
            },
            createNew: function () {
                var self = this,
                    name = this.name,
                    text = this.$("#input-text").val(),
                    shout;
                if (name && text) {
                    this.$("#input-text").val('');
                    shout = {name: name, text: text};
                    socket.emit('shout', shout, function (res) {
                        if (res === 'ok') {
                            self.addOne(new Shout({
                                name: shout.name,
                                text: shout.text
                            }));
                        }
                    });
                }
            },
            editName: function () {
                var text = this.$("#input-text").val();
                this.nameEdit = true;
                this.render();
                this.$("#input-text").val(text);
            },
            saveName: function () {
                this.name = this.$("#input-name").val();
                if (this.name) {
                    var text = this.$("#input-text").val();
                    this.nameEdit = false;
                    this.render();
                    this.$("#input-text").focus();
                    this.$("#input-text").val(text);
                }
            },
            updateNameOnEnter: function (e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    this.saveName();
                }
            }
        }),

        App = new AppView;
})();