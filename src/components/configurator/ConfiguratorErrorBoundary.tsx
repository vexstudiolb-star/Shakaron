"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ConfiguratorErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Configurator error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-sm border border-gold/20 bg-charcoal-soft p-8 text-center">
          <p className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
            Preview unavailable
          </p>
          <p className="max-w-sm text-sm font-light text-cream/60">
            The 3D viewer could not start. Try refreshing, or use the parts library
            on the left — drag-and-drop still works once the view loads.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="border border-gold/40 px-6 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-cream hover:border-gold"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
