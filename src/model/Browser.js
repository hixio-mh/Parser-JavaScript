const NameVersion = require('primitive/NameVersion');

class Browser extends NameVersion {
  constructor({using, family, channel, stock = true, hidden = false, mode = '', type = ''}) {
    super({using, family, channel, stock, hidden, mode, type});
  }

  /**
   * Set the properties to the default values
   *
   * @param   {Object|null}  properties  An optional Object of properties to set after setting it to the default values
   *
   * @internal
   */

  reset(properties = null) {
    super.reset();

    this.channel = null;
    this.using = null;
    this.family = null;

    this.stock = true;
    this.hidden = false;
    this.mode = '';
    this.type = '';

    properties && this.set(properties);
  }


  /**
   * Get the name in a human readable format
   *
   * @return string
   */

  getName() {
    const name = super.getName();
    return name ? `${name}${this.channel ? ` ${this.channel}` : ''}` : '';
  }


  /**
   * Is the browser from the specified family
   *
   * @param  {string}   name   The name of the family
   *
   * @return boolean
   */

  isFamily(name) {
    return this.getName() === name || (!!this.family && this.family.getName() === name);
  }


  /**
   * Is the browser using the specified webview
   *
   * @param  {string}   name   The name of the webview
   *
   * @return boolean
   */

  isUsing(name) {
    return !!this.using && this.using.getName() === name;
  }


  /**
   * Get a combined name and version number in a human readable format
   *
   * @return string
   */

  toString() {
    if (this.hidden) {
      return '';
    }
    const result = `${this.getName()} ${!!this.version && !this.version.hidden ? this.getVersion() : ''}`.trim();

    if (!result && this.using) {
      return this.using.toString();
    }

    return result;
  }


  /**
   * Get object with all defined properties
   *
   * @internal
   *
   * @return Object
   */

  toObject() {
    const result = {};

    if (this.name) {
      result.name = this.name;
    }

    if (this.alias) {
      result.alias = this.alias;
    }

    if (this.using) {
      result.using = this.using.toObject();
    }

    if (this.family) {
      result.family = this.family.toObject();
    }

    let versionObj;
    if (this.version && Object.keys(( versionObj = this.version.toObject())).length) {
      result.version = versionObj;
    }

    if (this.type) {
      result.type = this.type;
    }

    return result;
  }
}
