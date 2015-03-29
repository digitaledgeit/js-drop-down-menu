var emitter = require('emitter');

/**
 * A menu item
 * @constructor
 * @param   {Object}              options
 * @param   {HTMLElement}         options.el
 * @param   {function(MenuItem)}  [options.shouldToggleTheChildMenu]
 */
function MenuItem(options) {
	var self = this;
	options.shouldToggleTheChildMenu = options.shouldToggleTheChildMenu || function() {return true;};

	/** @private */
	this.el = options.el;

	/** @private */
	this.link = this.el.querySelector(MenuItem.LINK_SELECTOR);

	var menuElement = this.el.querySelector(MenuItem.MENU_SELECTOR);
	if (menuElement && menuElement.parentNode === this.el) {

		//create a child menu
		/** @private */
		var Menu = require('./Menu');
		this.menu = new Menu({
			el: menuElement
		});

		//toggle the child menu, if there is one, when the link is clicked
		this.link.addEventListener('click', function(event) {
			if (self.hasMenu() && options.shouldToggleTheChildMenu(self)) {
				event.preventDefault();
				self.getMenu().toggle();
			}
		});

		//toggle classes on the menu item when the child menu is opened or closed
		this.getMenu()
			.on('opened', function() {
				console.log('item', self.el);
				self.el.classList.add('is-active');
				self.emit('active');
			})
			.on('closed', function() {
				self.el.classList.remove('is-active');
				self.emit('inactive');
			})
		;

	}

}
emitter(MenuItem.prototype);

MenuItem.LINK_SELECTOR = '.js-link';
MenuItem.MENU_SELECTOR = '.js-menu';

/**
 * Get whether the menu item contains a child menu
 * @returns {boolean}
 */
MenuItem.prototype.hasMenu = function() {
	return !!this.menu;
};

/**
 * Get the child menu
 * @returns {Menu|null}
 */
MenuItem.prototype.getMenu = function() {
	return this.menu;
};

module.exports = MenuItem;