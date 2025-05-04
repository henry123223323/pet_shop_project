import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from './BreadCrumbs.module.css'

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  // ["", "products", "shoes", "nike"]
  const pathnames = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-container">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">首頁</Link>
        </li>
        {pathnames.map((segment, index) => {
          const to = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;
          return (
            <li
              key={to}
              className={`breadcrumb-item${isLast ? " active" : ""}`}
              {...(isLast ? { "aria-current": "page" } : {})}
            >
              {isLast ? (
                decodeURIComponent(segment)
              ) : (
                <Link to={to}>{decodeURIComponent(segment)}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
