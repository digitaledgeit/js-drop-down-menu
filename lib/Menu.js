var emitter = require('emitter');

/**
 * A drop down menu
 * @constructor
 * @param   {Object}      options
 * @param   {HTMLElement} options.el
 * @param   {HTMLElement} options.trigger
 */
function Menu(options) {
	var self = this;

	/** @private */
	this.el = options.el;

	/** @private */
	this.triggerEl = options.trigger;

	//get the menu items for only this menu level
	var items = Array.prototype.slice.call(this.el.querySelectorAll(Menu.ITEM_SELECTOR)).filter(function(itemElement) {
		return itemElement.parentNode === self.el;
	});

	/** @private */
	this.items = items.map(function(itemElement) {

		//create a new menu item
		var MenuItem = require('./MenuItem');
		var menuItem = new MenuItem({
			el: itemElement,
			shouldToggleTheChildMenu: options.shouldToggleTheChildMenu
		});

	});

	if (this.triggerEl) {

		//toggle the menu when the trigger is clicked
		this.triggerEl.addEventListener('click', function() {
			self.toggle();
		});

		//toggle classes on the trigger when the menu is opened or closed
		this
			.on('opened', function() {
				self.triggerEl.classList.add('is-open');
			})
			.on('closed', function() {
				self.triggerEl.classList.remove('is-open');
			})
		;

	}

}
emitter(Menu.prototype);

Menu.ITEM_SELECTOR = '.js-item';

/**
 * Get whether the menu is open
 * @returns {boolean}
 */
Menu.prototype.isOpen = function() {
	return this.el.classList.contains('is-open');
};

/**
 * Open the menu
 * @returns {Menu}
 */
Menu.prototype.open = function() {
	this.el.classList.add('is-open');
	this.emit('opened');
	return this;
};

/**
 * Close the menu
 * @returns {Menu}
 */
Menu.prototype.close = function() {
	this.el.classList.remove('is-open');
	this.emit('closed');
	return this;
};

/**
 * Toggle the menu
 * @returns {Menu}
 */
Menu.prototype.toggle = function() {
	if (this.isOpen()) {
		this.close();
	} else {
		this.open();
	}
	return this;
};

module.exports = Menu;