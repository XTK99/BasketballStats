// FieldConfig: Generic interface for a dynamic form field
// This class is used for type safety and IDE hints, not for instantiation
class FieldConfig {
  /**
   * @param {Object} config
   * @param {string} config.name - Unique field name (required)
   * @param {string} [config.label] - Field label
   * @param {string} [config.type] - Input type (text, number, select, checkbox, etc.)
   * @param {Array} [config.options] - Options for select/radio fields
   * @param {any} [config.defaultValue] - Default value (deprecated)
   * @param {boolean} [config.required] - Is field required?
   * @param {string} [config.placeholder] - Input placeholder
   * @param {any} [config.value] - Current value for the field
   * @param {function} [config.validate] - Validation function
   * @param {string} [config.helpText] - Help or description text
   * @param {Object} [config.inputProps] - Additional input props
   */
  constructor({
    name,
    label = "",
    type = "text",
    options = [],
    // defaultValue is deprecated and ignored
    required = false,
    placeholder = "",
    value = undefined,
    validate = null,
    helpText = "",
    inputProps = {},
  }) {
    this.name = name;
    this.label = label;
    this.type = type;
    this.options = options;
    // this.defaultValue = defaultValue;
    this.required = required;
    this.placeholder = placeholder;
    this.value = value;
    this.validate = validate;
    this.helpText = helpText;
    this.inputProps = inputProps;
  }
}

export default FieldConfig;
