import "./SidebarMenu.css";

/**
 * SidebarMenu component
 * @param {boolean} open - Whether the sidebar is open
 * @param {function} onClose - Function to close the sidebar
 * @param {"left"|"right"} position - Sidebar position ("left" or "right")
 * @param {React.ReactNode} children - Sidebar content
 */
function SidebarMenu({ open, onClose, position = "left", children }) {
  return (
    <div
      className={`sidebar-menu sidebar-menu--${position}${open ? " open" : ""}`}
      role="navigation"
      aria-label="Sidebar menu"
      tabIndex={open ? 0 : -1}
      aria-hidden={!open}
    >
      <button
        className={`sidebar-menu__close sidebar-menu__close--${position}`}
        onClick={onClose}
        aria-label="Close sidebar"
        tabIndex={open ? 0 : -1}
      >
        &times;
      </button>
      <div className="sidebar-menu__content">{children}</div>
    </div>
  );
}

export default SidebarMenu;
