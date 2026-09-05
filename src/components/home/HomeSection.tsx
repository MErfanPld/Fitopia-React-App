import { ReactNode } from "react";

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
};

export function HomeSection({ title, actionLabel, onAction, children }: Props) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="section-title">{title}</h2>
        {actionLabel && onAction && (
          <button type="button" className="section-link" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
