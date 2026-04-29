import React from "react";
import "./DynamicForm.css";

// Accepts a ChartConfig object (e.g., LineChartConfig) as 'config' prop
function DynamicForm({ config, onChange }) {
  if (!config || !config.fieldConfig) {
    return <div>No config provided</div>;
  }

  // Render a form field for each FieldConfig in config.fieldConfig
  const renderField = (fieldKey, fieldCfg) => {
    const { label, type, value, name, options } = fieldCfg;

    const handleChange = (e) => {
      let newValue;
      if (type === "checkbox") {
        newValue = e.target.checked;
      } else if (type === "number") {
        newValue = Number(e.target.value);
      } else {
        newValue = e.target.value;
      }
      if (onChange) {
        onChange(name, newValue);
      }
    };

    switch (type) {
      case "text":
        return (
          <div className="form-group" key={fieldKey}>
            <label>{label}</label>
            <input type="text" value={value ?? ""} onChange={handleChange} />
          </div>
        );
      case "number":
        return (
          <div className="form-group" key={fieldKey}>
            <label>{label}</label>
            <input type="number" value={value ?? 0} onChange={handleChange} />
          </div>
        );
      case "checkbox":
        return (
          <div className="form-group" key={fieldKey}>
            <label>
              <input
                type="checkbox"
                checked={!!value}
                onChange={handleChange}
              />{" "}
              {label}
            </label>
          </div>
        );
      case "color":
        return (
          <div className="form-group" key={fieldKey}>
            <label>{label}</label>
            <input
              type="color"
              value={value ?? "#000000"}
              onChange={handleChange}
            />
          </div>
        );
      case "select":
        return (
          <div className="form-group" key={fieldKey}>
            <label>{label}</label>
            <select value={value} onChange={handleChange}>
              {(options || []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        );
      case "object":
        // For margin or similar objects, render JSON input for now
        return (
          <div className="form-group" key={fieldKey}>
            <label>{label}</label>
            <input
              type="text"
              value={JSON.stringify(value ?? {})}
              onChange={(e) => {
                let newValue;
                try {
                  newValue = JSON.parse(e.target.value);
                } catch {
                  newValue = value;
                }
                if (onChange) onChange(name, newValue);
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form className="dynamic-form">
      {Object.entries(config.fieldConfig).map(([key, fieldCfg]) =>
        renderField(key, fieldCfg),
      )}
    </form>
  );
}

export default DynamicForm;
