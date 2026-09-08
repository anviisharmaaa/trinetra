import type { ReactNode, CSSProperties } from 'react';

export function Panel({
  title, actions, children, className = '', bodyClassName = '', noPadding = false, style,
}: {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={`panel ${className}`} style={style}>
      {(title || actions) && (
        <div className="panel-header">
          {typeof title === 'string' ? <span className="section-title">{title}</span> : title}
          {actions}
        </div>
      )}
      <div className={noPadding ? bodyClassName : `panel-body ${bodyClassName}`}>{children}</div>
    </div>
  );
}
