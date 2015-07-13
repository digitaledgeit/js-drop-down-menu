var emitter = require('component-emitter');

/**
 * A drop down menu
 * @constructor
 * @param   {Object}      options
 * @param   {HTMLElement} options.el
 * @param   {HTMLElement} [options.trigger]
 */
function Menu(options) {
	var self = this;
	this.canBeToggled = options.canBeToggled || function(menu) {return true};

	/** @private */
	this.el = options.el;

	/** @private */
	this.trigger = options.trigger;

	if (this.trigger) {

    this.onClickTrigger = this.onClickTrigger.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);

    //toggle the menu when the trigger is clicked
    this.trigger.addEventListener('click', this.onClickTrigger);

		//toggle the classes on the trigger when the menu is opened or closed
		this
			.on('opened', function() {
				self.trigger.classList.add('is-open');
			})
			.on('closed', function() {
				self.trigger.classList.remove('is-open');
			})
		;

	}

	/** @private */
	this.children = [];

	var items = Array.prototype.slice.call(this.el.querySelectorAll(Menu.ITEM_SELECTOR))
		.filter(function(itemElement) {
			return itemElement.parentNode === self.el; //ignore menu items deeper than one level
		})
		.forEach(function(itemElement) {

				var triggerElement  = itemElement.querySelector(Menu.TRIGGER_SELECTOR);
				var menuElement     = itemElement.querySelector(Menu.MENU_SELECTOR);

				if (menuElement && menuElement.parentNode === itemElement) {

					//ignore triggers deeper than one level
					if (triggerElement && triggerElement.parentNode !== itemElement) {
						triggerElement = null;
					}

					//create a child menu
					var menu = new Menu({
						el:           menuElement,
						trigger:      triggerElement,
						canBeToggled: self.canBeToggled
					});

					self.children.push(menu);

				}

		})
	;

}
emitter(Menu.prototype);

Menu.TRIGGER_SELECTOR = '.js-trigger';
Menu.MENU_SELECTOR    = '.js-menu';
Menu.ITEM_SELECTOR    = '.js-item';

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

  //let the menu be opened
  var self = this;
  setTimeout(function() {
    document.documentElement.addEventListener('click', self.onClickOutside);
  }, 0);

	return this;
};

/**
 * Close the menu
 * @returns {Menu}
 */
Menu.prototype.close = function() {
  document.documentElement.removeEventListener('click', this.onClickOutside);
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

/**
 * Get the child menus
 * @returns {Array.<Menu>}
 */
Menu.prototype.getChildren = function() {
	return this.children;
};

/**
 * Toggle the menu when the user clicks the trigger
 * @param event
 */
Menu.prototype.onClickTrigger = function(event) {
  if (this.canBeToggled(self)) {
    event.preventDefault();
    this.toggle();
  }
};

/**
 * Close the menu when the user clicks outside of the menu
 * @param event
 */
Menu.prototype.onClickOutside = function(event) {
  if (!this.el.contains(event.target) && this.isOpen()) {
    this.close();
  }
};

/**
 * When a menu is opened, close all of its siblings
 * @param {Array.<Menu>} siblings
 */
Menu.closeSiblingsWhenAMenuIsOpened = function (siblings) {
	for (var i=0; i<siblings.length; ++i) {
		var menu = siblings[i];

		menu.on('opened', function() {
			for (var i=0; i<siblings.length; ++i) {
				var sibling = siblings[i];
				if (sibling !== this) {
					sibling.close();
				}
			}
		});

	}
};

module.exports = Menu;