(function () {
  const socket = io();
  const Shout = Backbone.Model.extend({
    initialize() {},
  });

  const ShoutCollection = Backbone.Collection.extend({
    model: Shout,
    url: '/shouts',
  });

  const shouts = new ShoutCollection();

  const ShoutView = Backbone.View.extend({
    className: 'shout',
    tagName: 'li',
    template: _.template($('#tmpl-shout-item').html()),
    render() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
  });

  const AppView = Backbone.View.extend({
    template: _.template($('#tmpl-input').html()),
    nameEdit: true,
    events: {
      'click #input-btn': 'createNew',
      'click #shout-name': 'editName',
      'click .icon-ok': 'saveName',
      'keypress #input-name': 'updateNameOnEnter',
    },
    initialize() {
      const self = this;
      this.render();

      this.listenTo(shouts, 'add', this.addOne);
      this.listenTo(shouts, 'reset', this.addAll);
      socket.on('update', (shout) => {
        self.addOne(new Shout({
          name: shout.name,
          text: shout.text,
        }));
      });

      shouts.fetch();
    },
    render() {
      this.$el.html(this.template({ name: this.name, nameEdit: this.nameEdit }));
      $('#input-container').append(this.$el);
      return this;
    },
    addOne(shout) {
      const view = new ShoutView({ model: shout });
      $('#shouts-container ul').prepend(view.render().el);
    },
    addAll() {
      shouts.each(this.addOne, this);
    },
    createNew() {
      const self = this;
      const { name } = this;
      const text = this.$('#input-text').val();
      let shout;
      if (name && text) {
        this.$('#input-text').val('');
        shout = { name, text };
        socket.emit('shout', shout, (res) => {
          if (res === 'ok') {
            self.addOne(new Shout({
              name: shout.name,
              text: shout.text,
            }));
          }
        });
      }
    },
    editName() {
      const text = this.$('#input-text').val();
      this.nameEdit = true;
      this.render();
      this.$('#input-text').val(text);
    },
    saveName() {
      this.name = this.$('#input-name').val();
      if (this.name) {
        const text = this.$('#input-text').val();
        this.nameEdit = false;
        this.render();
        this.$('#input-text').focus();
        this.$('#input-text').val(text);
      }
    },
    updateNameOnEnter(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.saveName();
      }
    },
  });

  const App = new AppView();
}());
